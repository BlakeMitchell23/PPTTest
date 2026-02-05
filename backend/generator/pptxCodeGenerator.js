/**
 * PPTX Code Generator v3
 * Generates JavaScript code using pptxgenjs to create native PowerPoint files
 * The generated code follows Wavestone brand guidelines EXACTLY
 *
 * THEME SOURCE: Wavestone July 30 (theme1.xml + slideMaster1.xml analysis)
 */

const Anthropic = require('@anthropic-ai/sdk');

/**
 * System prompt - STRICT Wavestone theme compliance based on official theme documentation
 */
const PPTX_CODE_SYSTEM_PROMPT = `Tu es un expert en generation de code JavaScript pptxgenjs.
Tu generes du code PowerPoint qui respecte PARFAITEMENT la charte graphique Wavestone.

################################################################################
#                    SPECIFICATIONS WAVESTONE - THEME OFFICIEL                  #
################################################################################

=== DIMENSIONS DU SLIDE (OBLIGATOIRE) ===
Format 16:9 elargi Wavestone:
- Largeur: 33.87 cm = 13.33 pouces
- Hauteur: 19.05 cm = 7.5 pouces

CODE OBLIGATOIRE AU DEBUT:
pptx.defineLayout({ name: 'WAVESTONE', width: 13.33, height: 7.5 });
pptx.layout = 'WAVESTONE';

⚠️ NE JAMAIS utiliser LAYOUT_16x9 (10" x 5.625") - dimensions incorrectes!

=== PALETTE DE COULEURS OFFICIELLE (codes hex SANS #) ===
// Couleurs semantiques du theme
const VIOLET = '451DC7';      // bg2/lt2 - Couleur signature Wavestone (titres, puces, copyright)
const INDIGO = '250F6B';      // accent3 - Fonds couverture, top title
const BLACK = '000000';       // dk1/tx1 - Texte principal corps
const WHITE = 'FFFFFF';       // lt1/bg1 - Fonds slides contenu, texte sur fond sombre

// Couleurs d'accentuation
const GREEN = '04F06A';       // accent1 - Vert vif (succes, decorations)
const GREEN_LIGHT = 'CAFEE0'; // accent2 - Vert menthe (fonds legers)
const GRAY_LIGHT = 'F6F6F6';  // accent6 - Gris tres clair (fonds cards, KPIs)
const STEEL_BLUE = '4682B4';  // accent4 - Bleu acier (graphiques)
const PURPLE = '8F00FF';      // accent5 - Violet electrique (accents dynamiques)

=== POLICES OFFICIELLES (CRITIQUE) ===
// Police majeure (titres): Aptos SemiBold - pour TOUS les titres de slides
// Police mineure (corps): Aptos - pour le corps de texte, toptitle, chapter indicator
// Police numeros chapitres: Tempus Sans ITC - uniquement pour "1.", "2.", etc.
// Police date couverture: Aptos Light

REGLES POLICES:
- Titres de slides: fontFace: 'Aptos SemiBold' (PAS 'Aptos' avec bold: true!)
- Toptitle et Chapter indicator: fontFace: 'Aptos' SANS bold (PAS bold: true!)
- Corps de texte: fontFace: 'Aptos'
- Numeros de chapitre: fontFace: 'Tempus Sans ITC'

################################################################################
#                         POSITIONS EXACTES DU THEME                           #
################################################################################

Toutes les positions sont en POUCES (inches) - valeurs exactes du theme XML.

=== SLIDE DE COUVERTURE (Layout 2: Cover full blue without picture) ===
Arriere-plan: Degradé base indigo #250F6B

// Titre principal - BLANC, 34pt, Aptos SemiBold
slide.addText(titrePrincipal, {
  x: 0.465, y: 0.441, w: 7.453, h: 1.866,
  fontSize: 34, fontFace: 'Aptos SemiBold',
  color: 'FFFFFF', align: 'left', valign: 'top'
});

// Sous-titre - BLANC, 18pt, Arial
slide.addText(sousTitre, {
  x: 0.465, y: 2.315, w: 7.453, h: 0.543,
  fontSize: 18, fontFace: 'Arial',
  color: 'FFFFFF', align: 'left', valign: 'top'
});

// Date | Auteur | Internal - BLANC, 12pt, Aptos Light
slide.addText(dateAuteur, {
  x: 0.465, y: 2.862, w: 7.453, h: 0.528,
  fontSize: 12, fontFace: 'Aptos Light',
  color: 'FFFFFF', align: 'left', valign: 'top'
});

// PAS de copyright sur la couverture!

=== SLIDE DE CHAPITRE (Layout 12: Chapter gradient blue) ===
Arriere-plan: Blanc (herite du masque)

// Numero de chapitre - VIOLET, 88pt, Tempus Sans ITC
slide.addText('1.', {
  x: 0.465, y: 1.476, w: 5.953, h: 1.335,
  fontSize: 88, fontFace: 'Tempus Sans ITC',
  color: '451DC7', align: 'left', valign: 'top'
});

// Titre du chapitre - NOIR, 36pt, Aptos (police mineure, PAS SemiBold)
slide.addText(titreSection, {
  x: 0.465, y: 2.811, w: 5.953, h: 1.335,
  fontSize: 36, fontFace: 'Aptos',
  color: '000000', align: 'left', valign: 'top'
});

// PAS de copyright sur les slides de chapitre!

=== SLIDE DE CONTENU (Layout 5: General content without picture) ===
Arriere-plan: Blanc

// 1. TOP TITLE (sur-titre haut gauche) - INDIGO, 10pt, Aptos NORMAL (pas bold!)
slide.addText(titreDuDeck, {
  x: 0.465, y: 0.157, w: 8.524, h: 0.283,
  fontSize: 10, fontFace: 'Aptos',
  color: '250F6B', align: 'left', valign: 'middle'
});

// 2. CHAPTER INDICATOR (haut droite) - INDIGO, 10pt, Aptos NORMAL (pas bold!), aligne droite
slide.addText(chapterIndicator, {
  x: 8.988, y: 0.157, w: 3.882, h: 0.283,
  fontSize: 10, fontFace: 'Aptos',
  color: '250F6B', align: 'right', valign: 'middle'
});

// 3. TITRE DE SLIDE - VIOLET, 24pt, Aptos SemiBold (police majeure, PAS Aptos + bold!)
// ⚠️ Le titre doit etre une ASSERTION, pas un label generique!
slide.addText(titreSlide, {
  x: 0.465, y: 0.441, w: 12.406, h: 1.024,
  fontSize: 24, fontFace: 'Aptos SemiBold',
  color: '451DC7', align: 'left', valign: 'top'
});

// 4. ZONE DE CONTENU - debut a y=1.469"
slide.addText(contenu, {
  x: 0.465, y: 1.469, w: 12.406, h: 5.354,
  fontSize: 16, fontFace: 'Aptos', color: '000000'
});

// 5. COPYRIGHT - OBLIGATOIRE, violet, 7pt, aligne droite
// Position exacte du masque: X=29.42cm, Y=18.27cm
slide.addText('© WAVESTONE | ' + slideNumber, {
  x: 11.583, y: 7.193, w: 1.299, h: 0.264,
  fontSize: 7, fontFace: 'Aptos', color: '451DC7',
  align: 'right', valign: 'middle'
});

=== SLIDE DE FIN (Layout 22: End page blue) ===
Arriere-plan: Degradé base indigo #250F6B

// Slide de fin = logo Wavestone centre (pas de texte par defaut)
// Si besoin d'un message de remerciement, utiliser Aptos SemiBold:
slide.addText('Merci', {
  x: 0, y: 2.705, w: 13.33, h: 2.091,
  fontSize: 48, fontFace: 'Aptos SemiBold',
  color: 'FFFFFF', align: 'center', valign: 'middle'
});

// PAS de copyright sur la slide de fin!

################################################################################
#                    HIERARCHIE DES PUCES (bodyStyle du masque)                #
################################################################################

=== NIVEAU 1: Texte sans puce (titre de paragraphe) ===
- Marge gauche: 0
- Pas de puce
- fontSize: 16pt
- color: '000000' (noir)
- Espacement avant: 6pt

=== NIVEAU 2: Puce ronde pleine (•) ===
- Marge gauche: 0.295" (0.75cm)
- Retrait puce: -0.295"
- Puce: • (Unicode 2022)
- Couleur puce: '451DC7' (violet)
- fontSize: 16pt
- color: '000000'

=== NIVEAU 3: Tiret (–) ===
- Marge gauche: 0.591" (1.50cm)
- Retrait puce: -0.299"
- Puce: – (Unicode 2013, tiret demi-cadratin)
- Couleur puce: '451DC7' (violet)
- fontSize: 14pt
- color: '000000'

=== NIVEAU 4+: Cercle vide (o) ===
- Marge gauche: 0.882" (2.24cm)
- Retrait puce: -0.291"
- Puce: o (cercle vide)
- Couleur puce: '451DC7' (violet)
- fontSize: 12pt
- color: '000000'

=== CODE PPTXGENJS POUR LISTES A PUCES ===
slide.addText([
  { text: 'Titre de section (niveau 1)\\n', options: { bullet: false, fontSize: 16 } },
  { text: 'Point principal\\n', options: {
      bullet: { type: 'bullet', code: '2022' },
      indentLevel: 1, fontSize: 16
  }},
  { text: 'Sous-point avec tiret\\n', options: {
      bullet: { type: 'bullet', code: '2013' },
      indentLevel: 2, fontSize: 14
  }},
  { text: 'Detail fin\\n', options: {
      bullet: { type: 'bullet', code: '006F' }, // 'o'
      indentLevel: 3, fontSize: 12
  }},
], {
  x: 0.465, y: 1.469, w: 12.406,
  fontFace: 'Aptos', color: '000000',
  paraSpaceBefore: 6, paraSpaceAfter: 0,
  bullet: { color: '451DC7' }
});

################################################################################
#                    COMPOSANTS VISUELS WAVESTONE                              #
################################################################################

=== KPI / CHIFFRE CLE ===
// Fond gris clair accent6, valeur en violet
slide.addShape('roundRect', {
  x: X, y: Y, w: 2.8, h: 1.6,
  fill: { color: 'F6F6F6' },
  rectRadius: 0.08,
  line: { color: 'F6F6F6', width: 0 }
});
slide.addText('42%', {
  x: X, y: Y + 0.15, w: 2.8, h: 0.7,
  fontSize: 36, fontFace: 'Aptos', bold: true,
  color: '451DC7', align: 'center', valign: 'middle'
});
slide.addText('Description KPI', {
  x: X, y: Y + 0.9, w: 2.8, h: 0.5,
  fontSize: 12, fontFace: 'Aptos',
  color: '000000', align: 'center', valign: 'top'
});

=== TABLEAU ===
// En-tete violet, lignes alternees blanc/gris
const tableData = [
  [{ text: 'Colonne 1', options: { bold: true, fill: { color: '451DC7' }, color: 'FFFFFF' } },
   { text: 'Colonne 2', options: { bold: true, fill: { color: '451DC7' }, color: 'FFFFFF' } }],
  [{ text: 'Donnee 1', options: { fill: { color: 'FFFFFF' } } },
   { text: 'Donnee 2', options: { fill: { color: 'FFFFFF' } } }],
  [{ text: 'Donnee 3', options: { fill: { color: 'F6F6F6' } } },
   { text: 'Donnee 4', options: { fill: { color: 'F6F6F6' } } }],
];
slide.addTable(tableData, {
  x: 0.465, y: 1.469, w: 12.406,
  fontFace: 'Aptos', fontSize: 12, color: '000000',
  border: { type: 'solid', color: 'DEE2E6', pt: 0.5 },
  rowH: 0.45, valign: 'middle'
});

=== CALLOUT / ENCADRE ===
// Fond gris clair avec barre verticale violette a gauche
slide.addShape('rect', {
  x: X, y: Y, w: 0.04, h: H,
  fill: { color: '451DC7' }, line: { width: 0 }
});
slide.addShape('rect', {
  x: X + 0.04, y: Y, w: W - 0.04, h: H,
  fill: { color: 'F6F6F6' }, line: { width: 0 }
});
slide.addText(texteCallout, {
  x: X + 0.15, y: Y + 0.1, w: W - 0.25, h: H - 0.2,
  fontSize: 14, fontFace: 'Aptos', color: '000000'
});

################################################################################
#                       REGLES QUALITE CONSULTANT                              #
################################################################################

TITRES DE SLIDES = ASSERTIONS SPECIFIQUES
❌ INTERDIT: "Contexte", "Objectifs", "Analyse", "Recommandations", "Next Steps"
❌ INTERDIT: "Introduction", "Conclusion", "Synthese", "Resume"
✅ CORRECT: "Le marche francais croitra de 15% d'ici 2025"
✅ CORRECT: "3 leviers permettent de reduire les couts de 20%"
✅ CORRECT: "La solution A repond mieux aux 4 criteres identifies"

CONTENU SPECIFIQUE
- Utiliser des noms, chiffres, dates concrets (pas de "environ", "plusieurs")
- Eviter le jargon vide: "synergie", "holistique", "best-in-class", "disruptif", "leverage"
- Chaque slide doit apporter UNE information nouvelle et actionnable
- Maximum 5-7 points par slide

################################################################################
#                    STRUCTURE DU CODE A GENERER                               #
################################################################################

const PptxGenJS = require('pptxgenjs');

async function generatePresentation() {
  const pptx = new PptxGenJS();

  // ===== CONFIGURATION OBLIGATOIRE =====
  pptx.defineLayout({ name: 'WAVESTONE', width: 13.33, height: 7.5 });
  pptx.layout = 'WAVESTONE';
  pptx.author = 'Wavestone';
  pptx.company = 'Wavestone';
  pptx.title = 'TITRE_DU_DECK';

  // ===== CONSTANTES THEME WAVESTONE =====
  const VIOLET = '451DC7';
  const INDIGO = '250F6B';
  const BLACK = '000000';
  const WHITE = 'FFFFFF';
  const GRAY_LIGHT = 'F6F6F6';
  const GREEN = '04F06A';

  // ===== POSITIONS STANDARD (en pouces) =====
  const MARGIN_X = 0.465;
  const TOP_TITLE_Y = 0.157;
  const TITLE_Y = 0.441;
  const CONTENT_Y = 1.469;
  const CONTENT_W = 12.406;
  const CONTENT_H = 5.354;
  const COPYRIGHT_X = 11.583;
  const COPYRIGHT_Y = 7.193;

  // SLIDE 1: COUVERTURE
  let slide = pptx.addSlide();
  slide.bkgd = { color: INDIGO };
  // ... elements de couverture ...

  // SLIDES DE CONTENU
  // ... avec top title, chapter indicator, titre violet, copyright ...

  // SLIDE FINALE
  slide = pptx.addSlide();
  slide.bkgd = { color: INDIGO };
  // ... pas de copyright ...

  return await pptx.write({ outputType: 'nodebuffer' });
}

module.exports = { generatePresentation };

################################################################################
#                        ERREURS FREQUENTES A EVITER                           #
################################################################################

❌ pptx.layout = 'LAYOUT_16x9'     → Utiliser layout WAVESTONE (13.33" x 7.5")
❌ color: 'violet' ou '#451DC7'    → Utiliser color: '451DC7' (sans #)
❌ fontSize: 9 pour copyright      → C'est fontSize: 7
❌ "© WAVESTONE 1"                 → Format correct: "© WAVESTONE | 1" (avec pipe)
❌ Titre en noir                   → Le titre est TOUJOURS en violet '451DC7'
❌ Oublier le top title            → Top title OBLIGATOIRE sur slides de contenu
❌ Oublier le copyright            → Copyright OBLIGATOIRE sur slides de contenu
❌ Pas de slide de couverture      → Premiere slide = couverture (OBLIGATOIRE)
❌ Pas de slide de fin             → Derniere slide = fin (fond indigo, OBLIGATOIRE)
❌ fontFace: 'Aptos', bold: true pour titres → Utiliser fontFace: 'Aptos SemiBold' (SANS bold: true)
❌ bold: true pour toptitle/chapter → Utiliser fontFace: 'Aptos' SANS bold
❌ Positions approximatives        → Utiliser les positions EXACTES du theme

################################################################################
#                          FORMAT DE SORTIE                                    #
################################################################################

Tu dois generer UNIQUEMENT le code JavaScript:
- Pas de markdown, pas de \`\`\`javascript, pas de backticks
- Le code commence directement par: const PptxGenJS = require('pptxgenjs');
- Le code doit etre complet et executable immediatement
- Pas de commentaires inutiles, juste le code necessaire
`;

/**
 * Generate pptxgenjs code with streaming and detailed feedback
 */
async function generatePptxCodeStreaming(plan, language = 'fr', onThinking, onCodeChunk, onProgress) {
  const client = new Anthropic();
  const userMessage = buildPptxCodeUserMessage(plan, language);

  // Send initial progress
  if (onProgress) {
    onProgress({
      step: 'init',
      message: 'Initialisation de la génération...',
      details: `${plan.slides.length} slides à générer`
    });
  }

  try {
    let thinkingBuffer = '';
    let codeBuffer = '';
    let lastProgressTime = 0;
    const PROGRESS_THROTTLE = 500;

    if (onProgress) {
      onProgress({
        step: 'thinking',
        message: 'Analyse du plan et conception des slides...',
        details: 'Claude réfléchit à la meilleure structure'
      });
    }

    const stream = await client.messages.stream({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 20000,
      thinking: {
        type: 'enabled',
        budget_tokens: 12000,
      },
      messages: [{ role: 'user', content: userMessage }],
      system: PPTX_CODE_SYSTEM_PROMPT,
    });

    let codeStarted = false;
    let slideCount = 0;

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'thinking_delta') {
          thinkingBuffer += event.delta.thinking;

          // Extract progress from thinking
          const now = Date.now();
          if (now - lastProgressTime > PROGRESS_THROTTLE) {
            // Parse thinking for progress indicators
            if (thinkingBuffer.includes('couverture') || thinkingBuffer.includes('cover')) {
              if (onProgress) onProgress({ step: 'slide', message: 'Création de la page de couverture...', current: 1, total: plan.slides.length });
            }
            if (thinkingBuffer.includes('chapitre') || thinkingBuffer.includes('section')) {
              if (onProgress) onProgress({ step: 'slide', message: 'Création des séparateurs de section...', current: slideCount, total: plan.slides.length });
            }
            if (thinkingBuffer.includes('fin') || thinkingBuffer.includes('end')) {
              if (onProgress) onProgress({ step: 'slide', message: 'Création de la page de fin...', current: plan.slides.length, total: plan.slides.length });
            }

            lastProgressTime = now;
          }

          // Send thinking updates
          const lastPeriod = thinkingBuffer.lastIndexOf('.');
          const lastNewline = thinkingBuffer.lastIndexOf('\n');
          const splitPoint = Math.max(lastPeriod, lastNewline);
          if (splitPoint > 30) {
            const toSend = thinkingBuffer.substring(0, splitPoint + 1).trim();
            if (toSend && onThinking) {
              onThinking(toSend);
            }
            thinkingBuffer = thinkingBuffer.substring(splitPoint + 1);
          }
        } else if (event.delta.type === 'text_delta') {
          const chunk = event.delta.text;
          codeBuffer += chunk;

          if (!codeStarted && codeBuffer.includes('PptxGenJS')) {
            codeStarted = true;
            if (onProgress) {
              onProgress({
                step: 'code_start',
                message: 'Génération du code PowerPoint...',
                details: 'Écriture du code pptxgenjs'
              });
            }
          }

          // Count slides being generated
          const newSlides = (chunk.match(/addSlide\(\)/g) || []).length;
          if (newSlides > 0) {
            slideCount += newSlides;
            if (onProgress) {
              onProgress({
                step: 'slide',
                message: `Slide ${slideCount} générée...`,
                current: slideCount,
                total: plan.slides.length
              });
            }
          }

          if (onCodeChunk) {
            onCodeChunk(chunk);
          }
        }
      }
    }

    // Send remaining thinking
    if (thinkingBuffer.trim() && onThinking) {
      onThinking(thinkingBuffer.trim());
    }

    if (onProgress) {
      onProgress({
        step: 'validation',
        message: 'Validation du code généré...',
        details: 'Vérification de la structure'
      });
    }

    // Clean the code
    let code = codeBuffer.trim();
    code = code.replace(/^```(?:javascript|js)?\s*/i, '').replace(/\s*```$/i, '');

    // Validate the code
    const validation = validateGeneratedCode(code, plan.slides.length);
    if (!validation.valid) {
      if (onProgress) {
        onProgress({
          step: 'warning',
          message: 'Avertissement: ' + validation.warnings.join(', '),
          details: 'Le code peut nécessiter des ajustements'
        });
      }
    }

    if (onProgress) {
      onProgress({
        step: 'complete',
        message: 'Code généré avec succès',
        details: `${slideCount} slides créées`
      });
    }

    return code;
  } catch (error) {
    if (onProgress) {
      onProgress({
        step: 'error',
        message: 'Erreur lors de la génération',
        details: error.message
      });
    }
    console.error('Error generating pptx code (streaming):', error);
    throw error;
  }
}

/**
 * Validate the generated code for common issues
 * Checks theme compliance based on Wavestone documentation
 */
function validateGeneratedCode(code, expectedSlideCount) {
  const warnings = [];

  // === CRITICAL: Layout and dimensions ===
  if (!code.includes('defineLayout')) {
    warnings.push('Layout WAVESTONE non défini');
  }
  if (!code.includes('width: 13.33') && !code.includes('width:13.33')) {
    warnings.push('Dimensions incorrectes (doit être 13.33" x 7.5")');
  }
  if (code.includes('LAYOUT_16x9') || code.includes('LAYOUT_WIDE')) {
    warnings.push('Layout standard détecté - utiliser layout WAVESTONE custom');
  }

  // === Colors ===
  if (!code.includes('451DC7')) {
    warnings.push('Couleur violet Wavestone (#451DC7) non utilisée');
  }
  if (!code.includes('250F6B')) {
    warnings.push('Couleur indigo Wavestone (#250F6B) non utilisée');
  }
  // Check for common color mistakes
  if (code.includes('#451DC7') || code.includes('#250F6B')) {
    warnings.push('Couleurs avec # détectées - utiliser sans # (ex: 451DC7)');
  }

  // === Font ===
  if (!code.includes("fontFace: 'Aptos'") && !code.includes('fontFace:"Aptos"')) {
    warnings.push('Police Aptos non détectée');
  }

  // === Copyright format ===
  if (!code.includes('© WAVESTONE |')) {
    warnings.push('Format copyright incorrect (doit être "© WAVESTONE | N")');
  }
  // Check copyright font size
  const copyrightMatch = code.match(/© WAVESTONE.*?fontSize:\s*(\d+)/s);
  if (copyrightMatch && parseInt(copyrightMatch[1]) !== 7) {
    warnings.push(`Copyright fontSize=${copyrightMatch[1]} détecté - doit être 7`);
  }

  // === Slide count ===
  const slideCount = (code.match(/addSlide\(\)/g) || []).length;
  if (slideCount < expectedSlideCount) {
    warnings.push(`${slideCount} slides générées sur ${expectedSlideCount} attendues`);
  }

  // === Key positions (spot checks) ===
  // Check title Y position (should be around 0.44")
  const titleYMatch = code.match(/titreSlide|titre.*slide/i) && code.match(/y:\s*([\d.]+)/);
  if (titleYMatch) {
    const titleY = parseFloat(titleYMatch[1]);
    if (titleY < 0.4 || titleY > 0.5) {
      // Only warn if significantly off
    }
  }

  // === Structural checks ===
  if (!code.includes('bkgd')) {
    warnings.push('Aucun arrière-plan défini (bkgd)');
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
}

/**
 * Build the user message with explicit slide-by-slide instructions
 * Uses exact positions from Wavestone theme documentation
 */
function buildPptxCodeUserMessage(plan, language) {
  const languageInstruction = language === 'en'
    ? 'Generate all text content in English.'
    : 'Génère tout le texte en français.';

  // Build detailed slide descriptions with EXACT positions
  let slidesDescription = '';
  let slideNumber = 1;
  let contentSlideNumber = 1;

  for (const slide of plan.slides) {
    slidesDescription += `\n--- SLIDE ${slideNumber} ---\n`;
    slidesDescription += `Type: ${slide.type}\n`;
    slidesDescription += `Titre: ${slide.plan?.title || 'Sans titre'}\n`;
    slidesDescription += `Contenu: ${slide.plan?.summary || 'Pas de description'}\n`;

    if (slide.type === 'title') {
      slidesDescription += `→ PAGE DE COUVERTURE (Layout 2) - OBLIGATOIRE EN PREMIERE SLIDE:\n`;
      slidesDescription += `   - slide.bkgd = { color: '250F6B' }  // Fond indigo\n`;
      slidesDescription += `   - Titre: x=0.465, y=0.441, w=7.453, h=1.866, fontSize=34, fontFace='Aptos SemiBold', color='FFFFFF'\n`;
      slidesDescription += `   - Sous-titre: x=0.465, y=2.315, w=7.453, h=0.543, fontSize=18, fontFace='Arial', color='FFFFFF'\n`;
      slidesDescription += `   - Date: x=0.465, y=2.862, w=7.453, h=0.528, fontSize=12, fontFace='Aptos Light', color='FFFFFF'\n`;
      slidesDescription += `   - PAS de copyright!\n`;
    } else if (slide.type === 'section') {
      slidesDescription += `→ SEPARATEUR DE CHAPITRE (Layout 12):\n`;
      slidesDescription += `   - slide.bkgd = { color: 'FFFFFF' }  // Fond blanc\n`;
      slidesDescription += `   - Numero "${slide.section_number || '?'}.": x=0.465, y=1.476, w=5.953, h=1.335, fontSize=88, fontFace='Tempus Sans ITC', color='451DC7'\n`;
      slidesDescription += `   - Titre: x=0.465, y=2.811, w=5.953, h=1.335, fontSize=36, fontFace='Aptos', color='000000'\n`;
      slidesDescription += `   - PAS de copyright!\n`;
    } else if (slide.type === 'end') {
      slidesDescription += `→ PAGE DE FIN (Layout 22) - OBLIGATOIRE EN DERNIERE SLIDE:\n`;
      slidesDescription += `   - slide.bkgd = { color: '250F6B' }  // Fond indigo\n`;
      slidesDescription += `   - Optionnel "Merci": x=0, y=2.705, w=13.33, h=2.091, fontSize=48, fontFace='Aptos SemiBold', color='FFFFFF', align='center'\n`;
      slidesDescription += `   - PAS de copyright!\n`;
    } else {
      slidesDescription += `→ SLIDE DE CONTENU #${contentSlideNumber} (Layout 5):\n`;
      slidesDescription += `   - slide.bkgd = { color: 'FFFFFF' }  // Fond blanc\n`;
      slidesDescription += `   - Top title "${plan.deck_title}": x=0.465, y=0.157, w=8.524, h=0.283, fontSize=10, fontFace='Aptos' (PAS bold!), color='250F6B'\n`;
      slidesDescription += `   - Chapter indicator "${slide.section_name || ''}": x=8.988, y=0.157, w=3.882, h=0.283, fontSize=10, fontFace='Aptos' (PAS bold!), color='250F6B', align='right'\n`;
      slidesDescription += `   - Titre slide: x=0.465, y=0.441, w=12.406, h=1.024, fontSize=24, fontFace='Aptos SemiBold', color='451DC7'\n`;
      slidesDescription += `   - Contenu: x=0.465, y=1.469, w=12.406, h=5.354, fontSize=16, fontFace='Aptos', color='000000'\n`;
      slidesDescription += `   - Copyright "© WAVESTONE | ${contentSlideNumber}": x=11.583, y=7.193, w=1.299, h=0.264, fontSize=7, fontFace='Aptos', color='451DC7', align='right'\n`;
      contentSlideNumber++;
    }

    slideNumber++;
  }

  // Check if we have cover and end slides
  const hasCover = plan.slides.some(s => s.type === 'title');
  const hasEnd = plan.slides.some(s => s.type === 'end');

  let coverWarning = '';
  if (!hasCover) {
    coverWarning = '\n⚠️ ATTENTION: Pas de slide de couverture dans le plan. AJOUTE UNE PAGE DE COUVERTURE AU DEBUT!\n';
  }
  if (!hasEnd) {
    coverWarning += '\n⚠️ ATTENTION: Pas de slide de fin dans le plan. AJOUTE UNE PAGE DE FIN!\n';
  }

  return `Génère le code JavaScript pptxgenjs pour cette présentation Wavestone.

═══════════════════════════════════════════════════════════════════════════════
INFORMATIONS DE LA PRÉSENTATION
═══════════════════════════════════════════════════════════════════════════════
TITRE: ${plan.deck_title}
SOUS-TITRE: ${plan.deck_subtitle || ''}
NOMBRE DE SLIDES: ${plan.slides.length}
LANGUE: ${language === 'en' ? 'Anglais' : 'Français'}
${coverWarning}

═══════════════════════════════════════════════════════════════════════════════
PLAN DÉTAILLÉ SLIDE PAR SLIDE (avec positions EXACTES du thème Wavestone)
═══════════════════════════════════════════════════════════════════════════════
${slidesDescription}

═══════════════════════════════════════════════════════════════════════════════
RAPPELS CRITIQUES - THEME WAVESTONE
═══════════════════════════════════════════════════════════════════════════════
1. LAYOUT OBLIGATOIRE: pptx.defineLayout({ name: 'WAVESTONE', width: 13.33, height: 7.5 });

2. COULEURS (sans # devant):
   - VIOLET: '451DC7' (titres slides, copyright, puces)
   - INDIGO: '250F6B' (fond couverture/fin, top title)
   - BLACK: '000000' (texte corps)
   - WHITE: 'FFFFFF' (fond slides contenu, texte sur fond sombre)
   - GRAY_LIGHT: 'F6F6F6' (fond KPIs, cards)

3. POLICES (CRITIQUE):
   - fontFace: 'Aptos SemiBold' pour TOUS les titres de slides
   - fontFace: 'Aptos' pour top title, chapter indicator, corps (SANS bold: true!)
   - fontFace: 'Tempus Sans ITC' uniquement pour les numeros de chapitre
   - fontFace: 'Aptos Light' pour la date sur la couverture
   - fontFace: 'Arial' pour le sous-titre de couverture

4. PUCES (bullet):
   - Niveau 1: pas de puce, fontSize=16
   - Niveau 2: bullet code '2022' (•), indentLevel=1, fontSize=16, bullet color='451DC7'
   - Niveau 3: bullet code '2013' (–), indentLevel=2, fontSize=14, bullet color='451DC7'
   - Niveau 4: bullet code '006F' (o), indentLevel=3, fontSize=12, bullet color='451DC7'

5. COPYRIGHT (slides de contenu uniquement):
   - Format exact: "© WAVESTONE | N"
   - Position: x=11.583, y=7.193, w=1.299, h=0.264
   - fontSize=7, fontFace='Aptos', color='451DC7', align='right', valign='middle'

6. SLIDES OBLIGATOIRES:
   - PREMIERE slide = PAGE DE COUVERTURE (fond indigo)
   - DERNIERE slide = PAGE DE FIN (fond indigo)

${languageInstruction}

Génère UNIQUEMENT le code JavaScript, sans markdown ni backticks.
Le code doit commencer par: const PptxGenJS = require('pptxgenjs');`;
}

/**
 * Generate pptx code without streaming (simpler version)
 */
async function generatePptxCode(plan, language = 'fr') {
  const client = new Anthropic();
  const userMessage = buildPptxCodeUserMessage(plan, language);

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 20000,
      messages: [{ role: 'user', content: userMessage }],
      system: PPTX_CODE_SYSTEM_PROMPT,
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent) throw new Error('No text content in response');

    let code = textContent.text.trim();
    code = code.replace(/^```(?:javascript|js)?\s*/i, '').replace(/\s*```$/i, '');

    return code;
  } catch (error) {
    console.error('Error generating pptx code:', error);
    throw error;
  }
}

module.exports = {
  generatePptxCodeStreaming,
  generatePptxCode,
  validateGeneratedCode,
};
