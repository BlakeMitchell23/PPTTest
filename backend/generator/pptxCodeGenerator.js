/**
 * PPTX Code Generator v4
 * Generates JavaScript code using pptxgenjs to create native PowerPoint files
 * Uses Skill.md for theme specifications - strict theme, creative content
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

/**
 * Load the Skill.md content for the system prompt
 */
function loadSkillPrompt() {
  const skillPath = path.join(__dirname, '..', '..', 'Skill.md');
  try {
    const skillContent = fs.readFileSync(skillPath, 'utf-8');
    return skillContent;
  } catch (error) {
    console.error('Error loading Skill.md:', error);
    // Fallback to a minimal prompt if file not found
    return getFallbackSkillPrompt();
  }
}

/**
 * Fallback prompt if Skill.md is not found
 */
function getFallbackSkillPrompt() {
  return `Tu es un générateur de présentations PowerPoint Wavestone.
Génère du code JavaScript pptxgenjs qui respecte la charte Wavestone:
- Couleurs: VIOLET='451DC7', INDIGO='250F6B', NOIR='000000', BLANC='FFFFFF'
- Polices: Aptos (titres), Aptos (corps)
- Copyright: "© WAVESTONE | N" en bas à droite, 7pt, violet
- Format: 16:9 (13.33" x 7.5")`;
}

/**
 * Build the system prompt from Skill.md
 */
function buildSystemPrompt() {
  const skillContent = loadSkillPrompt();

  return `${skillContent}

---

## INSTRUCTIONS DE GÉNÉRATION - CRITIQUES

Tu dois générer du code JavaScript pptxgenjs COMPLET et EXÉCUTABLE.

### STRUCTURE OBLIGATOIRE DU CODE:

Le code DOIT contenir ces éléments dans cet ordre:

1. \`const PptxGenJS = require('pptxgenjs');\`
2. Toutes les constantes (COLORS, FONTS, SLIDE, POS, FONT_SIZES)
3. Toutes les fonctions helper (addCopyright, addTopTitle, addTitle, createCoverSlide, createChapterSlide, createContentSlide)
4. \`async function generatePresentation() { ... }\` - OBLIGATOIRE
5. \`return await pptx.write({ outputType: 'nodebuffer' });\` - à la fin de generatePresentation
6. \`module.exports = { generatePresentation };\`

### Format de sortie:
- Pas de markdown, pas de \`\`\`javascript, pas de backticks
- Le code commence directement par: const PptxGenJS = require('pptxgenjs');
- Le code doit être complet et exécutable immédiatement

### Qualité du contenu:
- Les titres de slides doivent être des ASSERTIONS, pas des labels génériques
- ❌ INTERDIT: "Contexte", "Objectifs", "Conclusion", "Synthèse"
- ✅ CORRECT: "Le marché croîtra de 15% d'ici 2025", "3 leviers réduisent les coûts de 20%"
- Contenu spécifique avec des chiffres, noms, dates concrets
- Maximum 5-7 points par slide

### ERREUR FATALE À ÉVITER:
Si tu oublies \`async function generatePresentation()\` ou \`pptx.write({ outputType: 'nodebuffer' })\`, le code NE FONCTIONNERA PAS.
`;
}

// Cache the system prompt
let cachedSystemPrompt = null;

function getSystemPrompt() {
  if (!cachedSystemPrompt) {
    cachedSystemPrompt = buildSystemPrompt();
  }
  return cachedSystemPrompt;
}

/**
 * Generate pptxgenjs code with streaming and detailed feedback
 */
async function generatePptxCodeStreaming(plan, language = 'fr', onThinking, onCodeChunk, onProgress) {
  const client = new Anthropic();
  const userMessage = buildPptxCodeUserMessage(plan, language);
  const systemPrompt = getSystemPrompt();

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
      max_tokens: 40000,  // Increased for large presentations (30+ slides)
      thinking: {
        type: 'enabled',
        budget_tokens: 10000,  // Reduced to give more room for code output
      },
      messages: [{ role: 'user', content: userMessage }],
      system: systemPrompt,
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

    // Auto-fix truncated code (adds missing pptx.write and module.exports if needed)
    code = autoFixTruncatedCode(code);

    // Validate the code
    const validation = validateGeneratedCode(code, plan.slides.length);

    if (validation.errors && validation.errors.length > 0) {
      if (onProgress) {
        onProgress({
          step: 'error',
          message: 'Erreurs critiques: ' + validation.errors.join(', '),
          details: 'Le code ne peut pas être exécuté'
        });
      }
      console.error('Code validation errors:', validation.errors);
    }

    if (validation.warnings && validation.warnings.length > 0) {
      if (onProgress) {
        onProgress({
          step: 'warning',
          message: 'Avertissements: ' + validation.warnings.join(', '),
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
 * Auto-fix truncated code by adding missing closing parts
 * This handles cases where the code was cut off before completion
 */
function autoFixTruncatedCode(code) {
  let fixedCode = code;
  let wasFixed = false;

  // Check if generatePresentation function exists but is incomplete
  if (fixedCode.includes('async function generatePresentation') || fixedCode.includes('function generatePresentation')) {

    // Check if pptx.write is missing
    if (!fixedCode.includes('pptx.write')) {
      console.log('[AutoFix] Adding missing pptx.write statement');

      // Find the last complete statement (ends with ; or })
      // and add the return statement before closing the function

      // Check if the function is incomplete (missing closing brace)
      const funcMatch = fixedCode.match(/async function generatePresentation\s*\(\s*\)\s*\{/);
      if (funcMatch) {
        // Count braces to see if function is complete
        const funcStart = fixedCode.indexOf(funcMatch[0]);
        const afterFunc = fixedCode.substring(funcStart + funcMatch[0].length);
        let braceCount = 1;
        let lastValidPos = 0;

        for (let i = 0; i < afterFunc.length; i++) {
          if (afterFunc[i] === '{') braceCount++;
          if (afterFunc[i] === '}') braceCount--;
          if (afterFunc[i] === ';' || afterFunc[i] === '}') {
            lastValidPos = i;
          }
          if (braceCount === 0) break;
        }

        // If function is incomplete, add closing
        if (braceCount > 0) {
          // Add missing return and close function
          fixedCode = fixedCode.trimEnd();

          // Remove any trailing incomplete statements
          const lines = fixedCode.split('\n');
          while (lines.length > 0) {
            const lastLine = lines[lines.length - 1].trim();
            // Keep lines that end properly
            if (lastLine.endsWith(';') || lastLine.endsWith('{') || lastLine.endsWith('}') || lastLine.endsWith(',') || lastLine === '') {
              break;
            }
            lines.pop();
          }
          fixedCode = lines.join('\n');

          // Add the missing ending
          fixedCode += `

  // ===== EXPORT - AUTO-FIXED =====
  return await pptx.write({ outputType: 'nodebuffer' });
}

module.exports = { generatePresentation };
`;
          wasFixed = true;
        }
      }
    }

    // Check if module.exports is missing but pptx.write exists
    if (!fixedCode.includes('module.exports') && fixedCode.includes('pptx.write')) {
      console.log('[AutoFix] Adding missing module.exports');
      fixedCode = fixedCode.trimEnd() + '\n\nmodule.exports = { generatePresentation };\n';
      wasFixed = true;
    }
  }

  if (wasFixed) {
    console.log('[AutoFix] Code was auto-fixed for missing closing statements');
  }

  return fixedCode;
}

/**
 * Validate the generated code for common issues
 */
function validateGeneratedCode(code, expectedSlideCount) {
  const warnings = [];
  const errors = [];

  // CRITICAL: Check for required structure
  if (!code.includes('function generatePresentation') && !code.includes('async function generatePresentation')) {
    errors.push('Fonction generatePresentation() manquante');
  }

  if (!code.includes('pptx.write')) {
    errors.push('pptx.write() manquant - le code ne peut pas exporter');
  }

  if (!code.includes('nodebuffer')) {
    warnings.push('outputType nodebuffer non spécifié');
  }

  // Layout and dimensions
  if (!code.includes('defineLayout') && !code.includes('WAVESTONE')) {
    warnings.push('Layout WAVESTONE non défini');
  }
  if (code.includes('LAYOUT_16x9') || code.includes('LAYOUT_WIDE')) {
    warnings.push('Layout standard détecté - utiliser layout WAVESTONE custom');
  }

  // Colors
  if (!code.includes('451DC7')) {
    warnings.push('Couleur violet Wavestone (#451DC7) non utilisée');
  }
  if (!code.includes('250F6B')) {
    warnings.push('Couleur indigo Wavestone (#250F6B) non utilisée');
  }
  if (code.includes('#451DC7') || code.includes('#250F6B')) {
    warnings.push('Couleurs avec # détectées - utiliser sans # (ex: 451DC7)');
  }

  // Font
  if (!code.includes("fontFace: 'Aptos'") && !code.includes('fontFace:"Aptos"') && !code.includes("FONTS.")) {
    warnings.push('Police Aptos non détectée');
  }

  // Copyright format
  if (!code.includes('© WAVESTONE') && !code.includes('WAVESTONE |')) {
    warnings.push('Format copyright incorrect');
  }

  // Slide count
  const slideCount = (code.match(/addSlide\(\)/g) || []).length;
  if (slideCount < expectedSlideCount * 0.8) {
    warnings.push(`${slideCount} slides générées sur ${expectedSlideCount} attendues`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Build the user message with the plan details
 */
function buildPptxCodeUserMessage(plan, language) {
  const languageInstruction = language === 'en'
    ? 'Generate all text content in English.'
    : 'Génère tout le texte en français.';

  // Build slide descriptions
  let slidesDescription = '';
  let slideNumber = 1;
  let contentSlideNumber = 1;

  for (const slide of plan.slides) {
    slidesDescription += `\n### Slide ${slideNumber}: ${slide.type.toUpperCase()}\n`;
    slidesDescription += `- Titre: ${slide.plan?.title || 'Sans titre'}\n`;
    slidesDescription += `- Contenu: ${slide.plan?.summary || 'Pas de description'}\n`;

    if (slide.type === 'title') {
      slidesDescription += `- → Utiliser createCoverSlide()\n`;
    } else if (slide.type === 'section') {
      slidesDescription += `- → Utiliser createChapterSlide() avec numéro "${slide.section_number || '?'}"\n`;
    } else if (slide.type === 'end') {
      slidesDescription += `- → Slide de fin avec fond INDIGO\n`;
    } else {
      slidesDescription += `- → Slide de contenu #${contentSlideNumber}\n`;
      slidesDescription += `- Section: ${slide.section_name || ''}\n`;
      contentSlideNumber++;
    }

    slideNumber++;
  }

  // Check structure
  const hasCover = plan.slides.some(s => s.type === 'title');
  const hasEnd = plan.slides.some(s => s.type === 'end');

  let structureWarning = '';
  if (!hasCover) {
    structureWarning += '\n⚠️ AJOUTE une page de COUVERTURE au début!\n';
  }
  if (!hasEnd) {
    structureWarning += '\n⚠️ AJOUTE une page de FIN à la fin!\n';
  }

  return `Génère le code JavaScript pptxgenjs pour cette présentation Wavestone.

## Informations de la présentation

- **Titre**: ${plan.deck_title}
- **Sous-titre**: ${plan.deck_subtitle || ''}
- **Nombre de slides**: ${plan.slides.length}
- **Langue**: ${language === 'en' ? 'Anglais' : 'Français'}
${structureWarning}

## Plan détaillé
${slidesDescription}

## Instructions

1. Commence par copier TOUTES les constantes du thème (COLORS, FONTS, POS, FONT_SIZES)
2. Inclus les fonctions helper (addCopyright, addTopTitle, addTitle, createCoverSlide, createChapterSlide, createContentSlide, createEndSlide)
3. Génère le code pour chaque slide en utilisant ces fonctions et constantes
4. N'oublie pas le copyright sur les slides de contenu
5. Respecte les positions exactes du thème
6. CRITIQUE: Termine TOUJOURS par \`return await pptx.write({ outputType: 'nodebuffer' });\` et \`module.exports = { generatePresentation };\`

${languageInstruction}

Génère UNIQUEMENT le code JavaScript, sans markdown ni backticks.`;
}

/**
 * Generate pptx code without streaming (simpler version)
 */
async function generatePptxCode(plan, language = 'fr') {
  const client = new Anthropic();
  const userMessage = buildPptxCodeUserMessage(plan, language);
  const systemPrompt = getSystemPrompt();

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 40000,  // Increased for large presentations
      messages: [{ role: 'user', content: userMessage }],
      system: systemPrompt,
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent) throw new Error('No text content in response');

    let code = textContent.text.trim();
    code = code.replace(/^```(?:javascript|js)?\s*/i, '').replace(/\s*```$/i, '');

    // Auto-fix truncated code
    code = autoFixTruncatedCode(code);

    return code;
  } catch (error) {
    console.error('Error generating pptx code:', error);
    throw error;
  }
}

/**
 * Reload the skill prompt (useful for development)
 */
function reloadSkillPrompt() {
  cachedSystemPrompt = null;
  return getSystemPrompt();
}

module.exports = {
  generatePptxCodeStreaming,
  generatePptxCode,
  validateGeneratedCode,
  autoFixTruncatedCode,
  reloadSkillPrompt,
};
