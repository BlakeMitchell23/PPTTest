/**
 * Slide HTML Generator
 * Generates HTML slides using Claude Opus 4.5
 * Each slide is a <div class="slide"> using the Wavestone CSS framework
 */

const Anthropic = require('@anthropic-ai/sdk');

/**
 * System prompt with full CSS class reference + quality rules
 */
const SLIDE_HTML_SYSTEM_PROMPT = `Tu es un consultant senior Wavestone qui genere des slides HTML de qualite conseil.

Tu generes du HTML pur utilisant le framework CSS Wavestone. Pas de <style>, pas de <script>, pas de CSS inline sauf exception justifiee.

===============================================================
CHARTE GRAPHIQUE WAVESTONE — Slide Master
===============================================================

POLICE : Aptos (obligatoire, deja declaree dans le CSS).
COULEURS THEME (clrMap du slideMaster1.xml) :
- bg1 = #FFFFFF (blanc)
- tx1 = #000000 (noir, texte courant)
- bg2 = #451DC7 (violet Wavestone — titres, puces, footer)
- accent1 = #04F06A (vert vif)
- accent2 = #CAFEE0 (vert menthe)
- accent3 = #250F6B (indigo — header bar, sous-titres forts)
- accent4 = #4682B4 (bleu acier)
- accent5 = #8F00FF (violet electrique)
- accent6 = #F6F6F6 (gris tres clair — fonds de cartes/KPI)

===============================================================
STRUCTURE HTML D'UNE SLIDE DE CONTENU
===============================================================

Chaque slide de contenu DOIT avoir cette structure exacte :

<div class="slide">
  <div class="slide-header-bar">
    <span class="header-bar-left">TITRE DU DECK</span>
    <span class="header-bar-right">NOM DU CHAPITRE</span>
  </div>
  <h2 class="slide-title">Titre assertif (24px SemiBold violet)</h2>
  <div class="slide-body">
    <!-- Composants visuels ici -->
  </div>
  <div class="slide-footer">&copy; WAVESTONE N</div>
</div>

ELEMENTS OBLIGATOIRES :
- .slide-header-bar : bandeau fin en haut, texte indigo (#250F6B), sans bordure, sans fond
  - .header-bar-left : titre du deck (indigo)
  - .header-bar-right : nom du chapitre (indigo)
- .slide-title : titre assertif 24px SemiBold, couleur violet (#451DC7)
- .slide-body : zone de contenu flex (padding 0 33px 24px)
- .slide-footer : texte "&copy; WAVESTONE N" (N = numero de page), 7pt, violet, aligne a droite

===============================================================
CLASSES CSS DISPONIBLES (framework slides.css)
===============================================================

CONTENEURS DE SLIDE :
- .slide : slide blanche standard (960x540px, Aptos, overflow hidden)
- .slide.slide-cover : couverture (image de fond PagedeGarde.png)
- .slide.slide-section : separateur de section (gradient violet → indigo)
- .slide.slide-end : slide de fin (image de fond PagedeFin.png)

TITRE :
- .slide-title : Aptos SemiBold 24px, violet #451DC7, max-height 74px
- .slide-subtitle : 16px, gris
- .slide-body : conteneur flex-grow sous le titre

CHIFFRES CLES :
- .kpi-grid > .kpi-card : grille de KPI
- .kpi-card : carte (fond #F6F6F6, bordure gauche coloree)
  - .trend-up (bordure verte), .trend-down (bordure rouge), .trend-stable (bordure orange)
- .kpi-value : chiffre (32px bold, violet par defaut)
- .kpi-unit : unite (13px SemiBold gris)
- .kpi-label : description (12px)
- .kpi-trend : tendance (.up vert, .down rouge, .stable orange)

Exemple KPI :
<div class="kpi-grid">
  <div class="kpi-card trend-down">
    <div class="kpi-value">47</div>
    <div class="kpi-unit">incidents/mois</div>
    <div class="kpi-label">Depuis la migration de septembre</div>
    <div class="kpi-trend down">+120% vs N-1</div>
  </div>
</div>

PROCESSUS :
- .process-flow : conteneur flex horizontal
- .process-step : une etape
  - .step-number : cercle numero (violet)
  - .step-icon : emoji/icone
  - .step-title : titre (14px bold indigo)
  - .step-desc : description (11px gris)
- .step-connector : fleche entre etapes (→ automatique)

Exemple processus :
<div class="process-flow">
  <div class="process-step">
    <div class="step-number">1</div>
    <div class="step-title">Audit</div>
    <div class="step-desc">Cartographie des incidents</div>
  </div>
  <div class="step-connector"></div>
  <div class="process-step">
    <div class="step-number">2</div>
    <div class="step-title">Plan d'action</div>
    <div class="step-desc">Priorisation des quick wins</div>
  </div>
</div>

COMPARAISON :
- .comparison-grid : grille 2 colonnes
- .comparison-column : une colonne
  - .before : bordure rouge (avant, puces ✗)
  - .after : bordure verte (apres, puces ✓)
  - .left / .right : variantes neutres
- .comparison-header : titre de colonne (16px bold indigo)
- Utiliser <ul><li> pour les items

TABLEAU :
- .slide-table : tableau formate (12px)
  - thead > th : header violet, texte blanc, 12px SemiBold
  - tbody > td : cellules avec alternance de fond (#F6F6F6)

TIMELINE :
- .timeline : conteneur flex horizontal avec ligne violette
- .timeline-item : un jalon (.done = point vert, .current = violet avec halo)
  - .timeline-dot, .timeline-date, .timeline-label, .timeline-desc

CITATION :
- .quote-block : conteneur centre
  - .quote-text : 20px italic indigo, bordure gauche verte
  - .quote-author : 14px SemiBold gris
  - .quote-role : 12px gris clair

GRILLE DE CARTES :
- .card-grid > .icon-card : grille responsive (fond #F6F6F6, bordure basse violette)
  - .card-icon : emoji/icone (24px)
  - .card-title : 14px bold indigo
  - .card-desc : 11px gris

CALLOUT (encadre) :
- .callout.info : bleu
- .callout.warning : orange
- .callout.success : vert
- .callout.danger : rouge
- .callout-icon : icone a gauche

LISTES (hierarchie du bodyStyle slide master) :
- .slide-bullets : liste hierarchique 4 niveaux (balise <ul>)
  Niveau 1 = <li> direct : pas de puce, 16px noir
  Niveau 2 = <li> dans <ul> imbrique : puce • violette, 16px, marge gauche 21px
  Niveau 3 = <li> dans <ul> imbrique x2 : tiret – violet, 14px, marge 43px
  Niveau 4 = <li> dans <ul> imbrique x3 : cercle ○ violet, 12px, marge 64px

  Exemple slide-bullets (niveaux 1 et 2) :
  <ul class="slide-bullets">
    <li>Titre de categorie (niveau 1, sans puce)
      <ul>
        <li>Detail avec puce violette (niveau 2)</li>
        <li>Autre detail (niveau 2)</li>
      </ul>
    </li>
  </ul>

- ul.slide-list : liste a puces simple (un seul niveau, puces • violettes)
  <ul class="slide-list">
    <li><strong>Point cle</strong> : description du point</li>
    <li>Autre element de la liste</li>
  </ul>

STICKERS DE STATUT (optionnel) :
- .slide-sticker : bandeau violet en haut a droite (BACK UP, DRAFT, etc.)

LAYOUTS :
- .layout-2col : 2 colonnes egales
- .layout-3col : 3 colonnes
- .layout-centered : centre vertical et horizontal

UTILITAIRES :
- .text-violet, .text-green, .text-indigo, .text-danger, .text-success, .text-warning, .text-muted
- .text-small (12px), .text-bold (700)
- .accent-bar : barre decorative verte (60x3px)
- .mb-0, .mb-8, .mb-16, .gap-8, .gap-12, .gap-16, .mt-auto

===============================================================
REGLES QUALITE CONSULTANT
===============================================================

TITRES = ASSERTIONS :
- JAMAIS : "Contexte", "Objectifs", "Solutions", "Recommandations"
- TOUJOURS : une phrase assertive specifique au contexte client
- Exemples :
  Mauvais : "Analyse des ventes"
  Bon : "Les ventes ont chute de 15% au Q3 suite au depart de 3 commerciaux cles"

CONTENU SPECIFIQUE :
- Utiliser les VRAIS NOMS du contexte (equipes, outils, personnes)
- Utiliser les VRAIS CHIFFRES fournis
- Vocabulaire METIER du client
- Test : si on remplace le nom du client par un autre et que la slide fonctionne encore, elle est TROP GENERIQUE

INTERDIT :
- Termes bullshit : "synergie", "holistique", "best-in-class", "disruptif", "game-changer", "paradigme"
- Listes generiques de 4-5 bullet points commencant par un verbe
- Definitions Wikipedia
- Affirmations marketing

ACCESSIBILITE :
- JAMAIS de texte blanc sur fond vert (illisible)
- JAMAIS de texte vert clair sur fond blanc
- Le texte sur fond colore doit etre blanc ou tres fonce
- Les KPI utilisent des couleurs semantiques (rouge=mauvais, vert=bon)

===============================================================
FORMAT DE SORTIE
===============================================================

Tu retournes UNIQUEMENT le HTML de la slide, sans markdown, sans backticks, sans explication.
Le HTML commence par <div class="slide..."> et finit par </div>.
Chaque slide DOIT avoir un <div class="slide-footer">&copy; WAVESTONE N</div> (N = numero de page).
Les slides de contenu DOIVENT avoir un <div class="slide-header-bar">.
Pas de balise <style> ni <script>.
Pas d'attribut style="" sauf cas exceptionnel justifie (ex: couleur specifique d'un KPI).`;

/**
 * Generate HTML for all slides from a plan
 */
async function generateAllSlidesHtml(plan, language = 'fr', clientContext = {}) {
  const client = new Anthropic();
  const slides = [];
  const totalSlides = plan.slides.length;

  for (let i = 0; i < totalSlides; i++) {
    const slide = plan.slides[i];
    const pageNumber = i + 1;

    // Deterministic slides: cover, section, end
    if (slide.type === 'title') {
      slides.push(buildCoverSlide(plan, pageNumber, totalSlides));
      continue;
    }

    if (slide.type === 'section') {
      slides.push(buildSectionSlide(slide, pageNumber, totalSlides));
      continue;
    }

    if (slide.type === 'end') {
      slides.push(buildEndSlide(plan, pageNumber, totalSlides, language));
      continue;
    }

    // Content slides: call Claude
    try {
      const html = await generateSingleSlideHtml(client, slide, {
        pageNumber,
        totalSlides,
        language,
        clientContext,
        deckTitle: plan.deck_title,
        previousSlides: slides.slice(-2).map(extractTitleFromHtml),
      });
      slides.push(html);
    } catch (error) {
      console.error(`Error generating slide ${pageNumber}:`, error.message);
      slides.push(buildFallbackSlide(slide, pageNumber, totalSlides));
    }
  }

  return slides;
}

/**
 * Generate HTML for all slides with streaming progress
 */
async function generateAllSlidesHtmlStreaming(plan, language = 'fr', clientContext = {}, onProgress) {
  const client = new Anthropic();
  const slides = [];
  const totalSlides = plan.slides.length;

  for (let i = 0; i < totalSlides; i++) {
    const slide = plan.slides[i];
    const pageNumber = i + 1;
    const slideTitle = slide.plan?.title || slide.section_name || slide.type;

    // Deterministic slides: cover, section, end
    if (slide.type === 'title') {
      onProgress({
        slideNumber: pageNumber,
        totalSlides,
        slideType: 'title',
        status: 'generating',
        message: `Page de garde : "${plan.deck_title}"`
      });
      slides.push(buildCoverSlide(plan, pageNumber, totalSlides));
      onProgress({
        slideNumber: pageNumber,
        totalSlides,
        slideType: 'title',
        status: 'complete',
        message: `Page de garde créée`
      });
      continue;
    }

    if (slide.type === 'section') {
      onProgress({
        slideNumber: pageNumber,
        totalSlides,
        slideType: 'section',
        status: 'generating',
        message: `Section ${slide.section_number} : "${slideTitle}"`
      });
      slides.push(buildSectionSlide(slide, pageNumber, totalSlides));
      onProgress({
        slideNumber: pageNumber,
        totalSlides,
        slideType: 'section',
        status: 'complete',
        message: `Section ${slide.section_number} créée`
      });
      continue;
    }

    if (slide.type === 'end') {
      onProgress({
        slideNumber: pageNumber,
        totalSlides,
        slideType: 'end',
        status: 'generating',
        message: `Page de fin`
      });
      slides.push(buildEndSlide(plan, pageNumber, totalSlides, language));
      onProgress({
        slideNumber: pageNumber,
        totalSlides,
        slideType: 'end',
        status: 'complete',
        message: `Page de fin créée`
      });
      continue;
    }

    // Content slides: call Claude with streaming
    onProgress({
      slideNumber: pageNumber,
      totalSlides,
      slideType: slide.type,
      status: 'generating',
      message: `Slide ${pageNumber} : "${slideTitle.substring(0, 60)}${slideTitle.length > 60 ? '...' : ''}"`
    });

    try {
      const html = await generateSingleSlideHtmlStreaming(client, slide, {
        pageNumber,
        totalSlides,
        language,
        clientContext,
        deckTitle: plan.deck_title,
        previousSlides: slides.slice(-2).map(extractTitleFromHtml),
      }, (thinking) => {
        onProgress({
          slideNumber: pageNumber,
          totalSlides,
          slideType: slide.type,
          status: 'thinking',
          thinking: thinking
        });
      });

      slides.push(html);
      onProgress({
        slideNumber: pageNumber,
        totalSlides,
        slideType: slide.type,
        status: 'complete',
        message: `Slide ${pageNumber} générée`
      });
    } catch (error) {
      console.error(`Error generating slide ${pageNumber}:`, error.message);
      slides.push(buildFallbackSlide(slide, pageNumber, totalSlides));
      onProgress({
        slideNumber: pageNumber,
        totalSlides,
        slideType: slide.type,
        status: 'error',
        message: `Erreur slide ${pageNumber} - fallback utilisé`
      });
    }
  }

  return slides;
}

/**
 * Generate HTML for a single content slide via Claude
 */
async function generateSingleSlideHtml(client, slide, context) {
  const { pageNumber, totalSlides, language, clientContext, deckTitle, previousSlides } = context;

  const languageInstruction = language === 'en'
    ? 'Generate all text in English.'
    : 'Genere tout le texte en francais.';

  let contextSection = '';
  if (clientContext.clientContext) {
    contextSection = `
CONTEXTE CLIENT :
${clientContext.clientContext}
${clientContext.events ? `\nEvenements : ${clientContext.events}` : ''}
${clientContext.history ? `\nHistorique : ${clientContext.history}` : ''}
${clientContext.audience ? `\nAudience : ${clientContext.audience}` : ''}
${clientContext.decision ? `\nDecision attendue : ${clientContext.decision}` : ''}`;
  }

  const sectionName = slide.section_name || '';

  const userMessage = `Genere le HTML pour la slide ${pageNumber}/${totalSlides} du deck "${deckTitle}".

TYPE : ${slide.type}
TITRE PREVU : ${slide.plan?.title || 'Sans titre'}
RESUME / INSTRUCTIONS : ${slide.plan?.summary || 'Pas de resume fourni'}
${sectionName ? `SECTION : ${sectionName}` : ''}
${contextSection}
${previousSlides.length > 0 ? `\nSLIDES PRECEDENTES : ${previousSlides.join(' -> ')}` : ''}

${languageInstruction}

RAPPEL STRUCTURE :
1. <div class="slide-header-bar"> avec header-bar-left="${escapeHtml(deckTitle)}" et header-bar-right="${escapeHtml(sectionName)}"
2. Le footer : <div class="slide-footer">&copy; WAVESTONE ${pageNumber}</div>
3. Le titre doit etre une ASSERTION specifique, pas un label (24px SemiBold violet)
4. Utilise les classes CSS du framework (kpi-grid, process-flow, comparison-grid, slide-table, timeline, card-grid, quote-block, callout, slide-bullets, slide-list, layout-2col, etc.)
5. Choisis le composant visuel le plus adapte au contenu decrit
6. Pour les listes : slide-bullets (hierarchie 4 niveaux) ou slide-list (puces simples violettes)`;

  const response = await client.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 4096,
    messages: [{ role: 'user', content: userMessage }],
    system: SLIDE_HTML_SYSTEM_PROMPT,
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent) {
    throw new Error('No text content in response');
  }

  let html = textContent.text.trim();

  // Remove markdown code fences if present
  html = html.replace(/^```html?\s*/i, '').replace(/\s*```$/i, '');

  // Validate HTML
  html = validateSlideHtml(html, pageNumber, totalSlides, deckTitle, sectionName);

  return html;
}

/**
 * Generate HTML for a single content slide via Claude (streaming with thinking)
 */
async function generateSingleSlideHtmlStreaming(client, slide, context, onThinking) {
  const { pageNumber, totalSlides, language, clientContext, deckTitle, previousSlides } = context;

  const languageInstruction = language === 'en'
    ? 'Generate all text in English.'
    : 'Genere tout le texte en francais.';

  let contextSection = '';
  if (clientContext.clientContext) {
    contextSection = `
CONTEXTE CLIENT :
${clientContext.clientContext}
${clientContext.events ? `\nEvenements : ${clientContext.events}` : ''}
${clientContext.history ? `\nHistorique : ${clientContext.history}` : ''}
${clientContext.audience ? `\nAudience : ${clientContext.audience}` : ''}
${clientContext.decision ? `\nDecision attendue : ${clientContext.decision}` : ''}`;
  }

  const sectionName = slide.section_name || '';

  const userMessage = `Genere le HTML pour la slide ${pageNumber}/${totalSlides} du deck "${deckTitle}".

TYPE : ${slide.type}
TITRE PREVU : ${slide.plan?.title || 'Sans titre'}
RESUME / INSTRUCTIONS : ${slide.plan?.summary || 'Pas de resume fourni'}
${sectionName ? `SECTION : ${sectionName}` : ''}
${contextSection}
${previousSlides.length > 0 ? `\nSLIDES PRECEDENTES : ${previousSlides.join(' -> ')}` : ''}

${languageInstruction}

RAPPEL STRUCTURE :
1. <div class="slide-header-bar"> avec header-bar-left="${escapeHtml(deckTitle)}" et header-bar-right="${escapeHtml(sectionName)}"
2. Le footer : <div class="slide-footer">&copy; WAVESTONE ${pageNumber}</div>
3. Le titre doit etre une ASSERTION specifique, pas un label (24px SemiBold violet)
4. Utilise les classes CSS du framework (kpi-grid, process-flow, comparison-grid, slide-table, timeline, card-grid, quote-block, callout, slide-bullets, slide-list, layout-2col, etc.)
5. Choisis le composant visuel le plus adapte au contenu decrit
6. Pour les listes : slide-bullets (hierarchie 4 niveaux) ou slide-list (puces simples violettes)`;

  try {
    let thinkingBuffer = '';
    let textBuffer = '';

    const stream = await client.messages.stream({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 8000,
      thinking: {
        type: 'enabled',
        budget_tokens: 4000,
      },
      messages: [{ role: 'user', content: userMessage }],
      system: SLIDE_HTML_SYSTEM_PROMPT,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'thinking_delta') {
          thinkingBuffer += event.delta.thinking;
          // Send thinking updates in smaller chunks for real-time feel
          if (thinkingBuffer.length > 30) {
            const lastSpace = thinkingBuffer.lastIndexOf(' ');
            const lastPeriod = thinkingBuffer.lastIndexOf('.');
            const lastNewline = thinkingBuffer.lastIndexOf('\n');
            const splitPoint = Math.max(lastSpace, lastPeriod, lastNewline);
            if (splitPoint > 10) {
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

    let html = textBuffer.trim();

    // Remove markdown code fences if present
    html = html.replace(/^```html?\s*/i, '').replace(/\s*```$/i, '');

    // Validate HTML
    html = validateSlideHtml(html, pageNumber, totalSlides, deckTitle, sectionName);

    return html;
  } catch (error) {
    console.error(`Error in streaming slide generation:`, error);
    throw error;
  }
}

/**
 * Validate slide HTML: ensure single .slide div, no <style>/<script>, footer present, header bar present
 */
function validateSlideHtml(html, pageNumber, totalSlides, deckTitle = '', sectionName = '') {
  // Remove any <style> or <script> tags
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Ensure it starts with <div class="slide
  if (!html.match(/^<div\s+class="slide/)) {
    // Try to extract the slide div
    const slideMatch = html.match(/<div\s+class="slide[\s\S]*$/);
    if (slideMatch) {
      html = slideMatch[0];
    }
  }

  // Ensure footer is present (format: © WAVESTONE <page>)
  if (!html.includes('slide-footer')) {
    const footer = `\n  <div class="slide-footer">&copy; WAVESTONE ${pageNumber}</div>`;
    const lastDivClose = html.lastIndexOf('</div>');
    if (lastDivClose !== -1) {
      html = html.substring(0, lastDivClose) + footer + '\n</div>';
    }
  }

  // Ensure header bar is present (for content slides only, not cover/section/end)
  if (!html.includes('slide-cover') && !html.includes('slide-section') && !html.includes('slide-end')) {
    if (!html.includes('slide-header-bar')) {
      const headerBar = `\n  <div class="slide-header-bar">\n    <span class="header-bar-left">${escapeHtml(deckTitle)}</span>\n    <span class="header-bar-right">${escapeHtml(sectionName)}</span>\n  </div>`;
      // Insert after opening <div class="slide">
      const openingDivEnd = html.indexOf('>');
      if (openingDivEnd !== -1) {
        html = html.substring(0, openingDivEnd + 1) + headerBar + html.substring(openingDivEnd + 1);
      }
    }
  }

  return html;
}

/**
 * Build cover slide (deterministic, no API call)
 */
function buildCoverSlide(plan, pageNumber, totalSlides) {
  const subtitle = plan.deck_subtitle ? `\n  <p class="slide-subtitle">${escapeHtml(plan.deck_subtitle)}</p>` : '';
  return `<div class="slide slide-cover">
  <h1 class="slide-title">${escapeHtml(plan.deck_title)}</h1>${subtitle}
</div>`;
}

/**
 * Build section divider slide (deterministic)
 */
function buildSectionSlide(slide, pageNumber, totalSlides) {
  const sectionNum = slide.section_number || '';
  const title = slide.plan?.title || slide.section_name || 'Section';
  return `<div class="slide slide-section">
  <div class="section-number">${escapeHtml(String(sectionNum))}</div>
  <h1 class="slide-title">${escapeHtml(title)}</h1>
</div>`;
}

/**
 * Build end/thank you slide (deterministic)
 */
function buildEndSlide(plan, pageNumber, totalSlides, language) {
  return `<div class="slide slide-end"></div>`;
}

/**
 * Build fallback slide when generation fails
 */
function buildFallbackSlide(slide, pageNumber, totalSlides) {
  const title = slide.plan?.title || 'Slide en erreur';
  const summary = slide.plan?.summary || '';
  return `<div class="slide">
  <div class="slide-header-bar">
    <span class="header-bar-left"></span>
    <span class="header-bar-right"></span>
  </div>
  <h2 class="slide-title">${escapeHtml(title)}</h2>
  <div class="slide-body">
    <p class="text-muted">${escapeHtml(summary)}</p>
    <div class="callout warning">
      <span class="callout-icon">&#9888;</span>
      <span>Cette slide n'a pas pu etre generee automatiquement. Utilisez le chatbot pour la completer.</span>
    </div>
  </div>
  <div class="slide-footer">&copy; WAVESTONE ${pageNumber}</div>
</div>`;
}

/**
 * Extract title text from slide HTML (for context in subsequent slides)
 */
function extractTitleFromHtml(html) {
  const match = html.match(/slide-title[^>]*>(.*?)<\//);
  return match ? match[1].replace(/<[^>]+>/g, '') : '';
}

/**
 * Escape HTML entities
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = {
  generateAllSlidesHtml,
  generateAllSlidesHtmlStreaming,
};
