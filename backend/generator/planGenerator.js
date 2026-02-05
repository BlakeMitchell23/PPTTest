/**
 * Plan Generator
 * Generates a slide plan (outline) for brainstorming
 * Simplified: outputs id, type, title, summary, section_number
 */

const Anthropic = require('@anthropic-ai/sdk');

/**
 * Available slide types
 */
const SLIDE_TYPES = {
  title: { name: 'Titre', description: 'Slide de titre principale' },
  section: { name: 'Section', description: 'Separateur de section' },
  content: { name: 'Contenu', description: 'Slide de contenu standard' },
  comparison: { name: 'Comparaison', description: 'Deux colonnes (avant/apres, pour/contre)' },
  process: { name: 'Processus', description: 'Etapes numerotees, workflow' },
  table: { name: 'Tableau', description: 'Donnees en tableau' },
  list: { name: 'Liste', description: 'Grille d\'elements' },
  quote: { name: 'Citation', description: 'Citation ou verbatim client' },
  end: { name: 'Fin', description: 'Slide de fin / merci' },
};

/**
 * System prompt - CONSULTANT QUALITY RULES
 */
const PLAN_SYSTEM_PROMPT = `Tu es un consultant senior Wavestone qui planifie des presentations de qualite conseil.

Tu dois creer un PLAN de presentation ACTIONNABLE et SPECIFIQUE. Pas de contenu generique.

===============================================================
REGLES ABSOLUES - TITRES
===============================================================

Un titre n'est JAMAIS :
- Un theme ou une etiquette : "Analyse des ventes", "Contexte", "Nos solutions", "Objectifs"
- Un mot seul ou un groupe nominal : "Introduction", "Recommandations"

Un titre EST TOUJOURS :
- La phrase que tu prononcerais en premier si tu pitchais cette slide a l'oral
- Une ASSERTION, un CONSTAT ou une CONCLUSION
- SPECIFIQUE au contexte client fourni

EXEMPLES :
Mauvais : "Analyse des ventes" -> Bon : "Les ventes ont chute de 15% au Q3 suite au depart de 3 commerciaux cles"
Mauvais : "Contexte" -> Bon : "L'equipe DSI fait face a 47 demandes en attente depuis 6 mois"
Mauvais : "Notre approche" -> Bon : "3 quick wins permettront de reduire le backlog de 60% en 8 semaines"

TEST : Si le titre peut s'appliquer a n'importe quel autre projet, il est MAUVAIS.

===============================================================
REGLES ABSOLUES - CONTENU
===============================================================

INTERDIT :
- Termes bullshit : "synergie", "holistique", "best-in-class", "state-of-the-art", "leverage", "disruptif", "game-changer", "ecosysteme", "paradigme", "scalable"
- Affirmations sans preuve ou source tracable
- Fonctionnalites presentees "dans le vide"
- Listes de benefices generiques
- Slides "definition Wikipedia"
- Listes a puces generiques de 4-5 items commencant tous par un verbe d'action
- Affirmations marketing ("leader du marche", "solution innovante")

OBLIGATOIRE :
- Utiliser les VRAIS NOMS : equipes, outils, systemes, personnes, projets du contexte
- Utiliser les VRAIS CHIFFRES et donnees du contexte
- Utiliser le VOCABULAIRE METIER du client
- Le contenu doit etre NON-SUBSTITUABLE

===============================================================
REGLES ABSOLUES - STRUCTURE NARRATIVE
===============================================================

STRUCTURE EN 3 ACTES :
- ACTE 1 (10-20%) : POURQUOI maintenant ? Contexte specifique, probleme chiffre
- ACTE 2 (60-70%) : QUOI concretement ? Analyse, solution, demonstration - avec PREUVES
- ACTE 3 (15-20%) : ET MAINTENANT ? Prochaines etapes CONCRETES (qui, quoi, pour quand)

===============================================================
REGLES ABSOLUES - VISUALISATION
===============================================================

- Si quelque chose PEUT etre montre visuellement, il DOIT l'etre
- Privilegier : table > comparison > process > list > content
- Les comparaisons utilisent des TABLEAUX cote a cote
- Les processus utilisent des SCHEMAS avec des flux

===============================================================
TYPES DE SLIDES
===============================================================

Types disponibles : title, section, content, comparison, process, table, list, quote, end

===============================================================
FORMAT JSON ATTENDU
===============================================================

{
  "deck_title": "Titre assertif du deck (pas un theme)",
  "deck_subtitle": "Sous-titre contextuel",
  "slides": [
    {
      "id": "slide-1",
      "type": "title",
      "plan": {
        "title": "Titre assertif du deck",
        "summary": "Description du contenu de cette slide"
      },
      "section_number": null,
      "section_name": null
    },
    {
      "id": "slide-2",
      "type": "section",
      "plan": {
        "title": "Titre de section",
        "summary": ""
      },
      "section_number": 1,
      "section_name": "Nom de section"
    },
    {
      "id": "slide-3",
      "type": "content|comparison|process|table|list|quote",
      "plan": {
        "title": "ASSERTION specifique au contexte",
        "summary": "Description DETAILLEE : type de visuel (KPI, processus, comparaison, grille, tableau, timeline), DONNEES concretes, MESSAGE a faire passer, COULEURS/tendances si pertinent"
      },
      "section_number": 1,
      "section_name": "Nom de section"
    }
  ]
}

La premiere slide doit etre de type "title".
La derniere slide doit etre de type "end".
Les separateurs de section sont de type "section".

IMPORTANT - LE CHAMP "summary" :
Ce resume sera affiche a l'utilisateur qui pourra le modifier avant generation.
Il doit decrire PRECISEMENT le contenu visuel prevu.

Reponds UNIQUEMENT avec le JSON.`;

/**
 * Generate a slide plan
 */
async function generatePlan(params) {
  const { prompt, slideCount, language = 'fr', deckType = 'autre', clientContext = {} } = params;

  const client = new Anthropic();
  const userMessage = buildPlanUserMessage(prompt, slideCount, language, deckType, clientContext);

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 8192,
      messages: [{ role: 'user', content: userMessage }],
      system: PLAN_SYSTEM_PROMPT,
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent) throw new Error('No text content in response');

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const plan = JSON.parse(jsonMatch[0]);
    return validatePlan(plan);
  } catch (error) {
    console.error('Error generating plan:', error);
    throw error;
  }
}

/**
 * Generate a slide plan with streaming (extended thinking)
 */
async function generatePlanStreaming(params, onThinking) {
  const { prompt, slideCount, language = 'fr', deckType = 'autre', clientContext = {} } = params;

  const client = new Anthropic();
  const userMessage = buildPlanUserMessage(prompt, slideCount, language, deckType, clientContext);

  try {
    let thinkingBuffer = '';
    let textBuffer = '';

    const stream = await client.messages.stream({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 16000,
      thinking: {
        type: 'enabled',
        budget_tokens: 8000,
      },
      messages: [{ role: 'user', content: userMessage }],
      system: PLAN_SYSTEM_PROMPT,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'thinking_delta') {
          thinkingBuffer += event.delta.thinking;
          // Send thinking updates in chunks
          if (thinkingBuffer.length > 50) {
            // Extract last complete sentence or phrase
            const lastPeriod = thinkingBuffer.lastIndexOf('.');
            const lastNewline = thinkingBuffer.lastIndexOf('\n');
            const splitPoint = Math.max(lastPeriod, lastNewline);
            if (splitPoint > 0) {
              const toSend = thinkingBuffer.substring(0, splitPoint + 1).trim();
              if (toSend) {
                onThinking(toSend);
              }
              thinkingBuffer = thinkingBuffer.substring(splitPoint + 1);
            }
          }
        } else if (event.delta.type === 'text_delta') {
          textBuffer += event.delta.text;
        }
      }
    }

    // Send any remaining thinking
    if (thinkingBuffer.trim()) {
      onThinking(thinkingBuffer.trim());
    }

    const jsonMatch = textBuffer.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const plan = JSON.parse(jsonMatch[0]);
    return validatePlan(plan);
  } catch (error) {
    console.error('Error generating plan (streaming):', error);
    throw error;
  }
}

/**
 * Build user message with mandatory context
 */
function buildPlanUserMessage(prompt, slideCount, language, deckType, clientContext = {}) {
  const languageInstructions = language === 'en'
    ? 'Generate the plan in English.'
    : 'Genere le plan en francais.';

  const deckTypeInstructions = {
    formation: `TYPE : FORMATION - Objectifs d'apprentissage MESURABLES, progression pedagogique`,
    proposition: `TYPE : PROPOSITION COMMERCIALE - Enjeux CLIENT, solution point par point`,
    rapport: `TYPE : RAPPORT DE PROJET - Contexte, travaux realises vs prevus, resultats chiffres`,
    autre: 'Structure selon le sujet, toujours ACTIONNABLE et SPECIFIQUE.',
  };

  let contextSection = '';
  if (clientContext.clientContext || clientContext.history || clientContext.events) {
    contextSection = `
CONTEXTE CLIENT (A UTILISER IMPERATIVEMENT) :
${clientContext.clientContext || 'Non fourni'}
${clientContext.events ? `Evenements : ${clientContext.events}` : ''}
${clientContext.history ? `Historique : ${clientContext.history}` : ''}`;
  }

  let audienceSection = '';
  if (clientContext.audience || clientContext.decision) {
    audienceSection = `
AUDIENCE ET INTENTION :
Qui va lire : ${clientContext.audience || 'Non fourni'}
Decision attendue : ${clientContext.decision || 'Non fourni'}
Niveau : ${clientContext.audienceKnowledge || 'Non fourni'}`;
  }

  return `Cree un PLAN de presentation de QUALITE CONSULTANT.

DEMANDE : ${prompt}

${deckTypeInstructions[deckType] || deckTypeInstructions.autre}

NOMBRE DE SLIDES CIBLE : environ ${slideCount}
${contextSection}
${audienceSection}

${languageInstructions}

RAPPEL :
1. TITRES = ASSERTIONS (pas de labels comme "Contexte", "Objectifs")
2. CONTENU = SPECIFIQUE au contexte (noms, chiffres, vocabulaire du client)
3. VISUELS = Privilegier tableaux, schemas, comparaisons
4. Premiere slide = type "title", derniere = type "end"
5. Chaque summary decrit PRECISEMENT le visuel prevu

Reponds UNIQUEMENT avec le JSON.`;
}

/**
 * Validate and normalize the plan
 */
function validatePlan(plan) {
  if (!plan.deck_title) plan.deck_title = 'Nouvelle presentation';
  if (!plan.deck_subtitle) plan.deck_subtitle = '';
  if (!plan.slides || !Array.isArray(plan.slides)) plan.slides = [];

  plan.slides = plan.slides.map((slide, index) => ({
    id: slide.id || `slide-${index + 1}`,
    type: SLIDE_TYPES[slide.type] ? slide.type : 'content',
    plan: {
      title: slide.plan?.title || 'Titre a definir',
      summary: slide.plan?.summary || '',
    },
    section_number: slide.section_number || null,
    section_name: slide.section_name || null,
  }));

  return plan;
}

module.exports = {
  generatePlan,
  generatePlanStreaming,
  SLIDE_TYPES,
};
