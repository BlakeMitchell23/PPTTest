/**
 * PPTX Code Executor
 * Executes generated pptxgenjs JavaScript code in a sandboxed environment
 * Returns the PPTX buffer with Wavestone theme fonts and assets applied
 */

const PptxGenJS = require('pptxgenjs');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

/**
 * Wavestone theme font configuration
 */
const WAVESTONE_THEME_FONTS = {
  majorFont: 'Aptos SemiBold',
  minorFont: 'Aptos',
};

/**
 * Load Wavestone assets (background images) as base64
 */
function loadWavestoneAssets() {
  const assetsDir = path.join(__dirname, '..', 'assets');
  const assets = {};

  const assetFiles = {
    COVER_BG: 'PagedeGarde.png',
    END_BG: 'PagedeFin.png',
    CHAPTER_BG: 'PageDeChapitre.png',
  };

  for (const [key, filename] of Object.entries(assetFiles)) {
    const filePath = path.join(assetsDir, filename);
    try {
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        assets[key] = buffer.toString('base64');
        console.log(`[Assets] Loaded ${filename}`);
      } else {
        console.warn(`[Assets] File not found: ${filePath}`);
        assets[key] = null;
      }
    } catch (error) {
      console.error(`[Assets] Error loading ${filename}:`, error);
      assets[key] = null;
    }
  }

  return assets;
}

// Load assets once at startup
const WAVESTONE_ASSETS = loadWavestoneAssets();

/**
 * Post-process the PPTX to set Wavestone theme fonts
 */
function applyWavestoneThemeFonts(pptxBuffer) {
  try {
    const zip = new AdmZip(pptxBuffer);
    const themeEntry = zip.getEntry('ppt/theme/theme1.xml');

    if (!themeEntry) {
      console.warn('theme1.xml not found in PPTX, skipping font modification');
      return pptxBuffer;
    }

    let themeXml = themeEntry.getData().toString('utf8');

    themeXml = themeXml.replace(
      /<a:majorFont>[\s\S]*?<\/a:majorFont>/,
      `<a:majorFont>
        <a:latin typeface="${WAVESTONE_THEME_FONTS.majorFont}"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
      </a:majorFont>`
    );

    themeXml = themeXml.replace(
      /<a:minorFont>[\s\S]*?<\/a:minorFont>/,
      `<a:minorFont>
        <a:latin typeface="${WAVESTONE_THEME_FONTS.minorFont}"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
      </a:minorFont>`
    );

    zip.updateFile('ppt/theme/theme1.xml', Buffer.from(themeXml, 'utf8'));

    return zip.toBuffer();
  } catch (error) {
    console.error('Error applying Wavestone theme fonts:', error);
    return pptxBuffer;
  }
}

/**
 * Execute pptxgenjs code and return the PPTX buffer
 */
async function executePptxCode(code) {
  try {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

    let cleanedCode = code
      .replace(/const\s+PptxGenJS\s*=\s*require\s*\(\s*['"]pptxgenjs['"]\s*\)\s*;?/g, '')
      .replace(/module\.exports\s*=\s*\{[^}]*\}\s*;?/g, '');

    // Inject PptxGenJS and Wavestone assets
    const wrappedCode = `
      const PptxGenJS = this.PptxGenJS;
      const WAVESTONE_ASSETS = this.WAVESTONE_ASSETS;

      ${cleanedCode}

      return await generatePresentation();
    `;

    const fn = new AsyncFunction(wrappedCode);

    // Execute with PptxGenJS and assets bound to this
    let buffer = await fn.call({ PptxGenJS, WAVESTONE_ASSETS });

    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Generated code did not return a valid buffer');
    }

    // Apply Wavestone theme fonts
    buffer = applyWavestoneThemeFonts(buffer);

    return buffer;
  } catch (error) {
    console.error('Error executing pptx code:', error);

    if (error.message.includes('generatePresentation is not defined')) {
      throw new Error('Le code genere ne definit pas la fonction generatePresentation');
    }
    if (error.message.includes('PptxGenJS is not defined')) {
      throw new Error('Erreur interne: PptxGenJS non disponible');
    }
    if (error.message.includes('Unexpected token')) {
      throw new Error('Erreur de syntaxe dans le code genere: ' + error.message);
    }

    throw new Error('Erreur execution du code: ' + error.message);
  }
}

/**
 * Validate the code structure before execution
 */
function validatePptxCode(code) {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Code is empty or not a string' };
  }

  if (!code.includes('generatePresentation')) {
    return { valid: false, error: 'Code must define a generatePresentation function' };
  }

  if (!code.includes('PptxGenJS')) {
    return { valid: false, error: 'Code must use PptxGenJS' };
  }

  if (!code.includes('pptx.write')) {
    return { valid: false, error: 'Code must call pptx.write to generate output' };
  }

  const dangerousPatterns = [
    /require\s*\(\s*['"]fs['"]\s*\)/,
    /require\s*\(\s*['"]child_process['"]\s*\)/,
    /require\s*\(\s*['"]net['"]\s*\)/,
    /require\s*\(\s*['"]http['"]\s*\)/,
    /require\s*\(\s*['"]https['"]\s*\)/,
    /eval\s*\(/,
    /process\.exit/,
    /process\.env/,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return { valid: false, error: 'Code contains potentially dangerous patterns' };
    }
  }

  return { valid: true };
}

/**
 * Auto-fix truncated code by adding missing closing parts
 */
function autoFixTruncatedCode(code) {
  let fixedCode = code;
  let wasFixed = false;

  // Check if generatePresentation function exists but is incomplete
  if (fixedCode.includes('async function generatePresentation') || fixedCode.includes('function generatePresentation')) {

    // Check if pptx.write is missing
    if (!fixedCode.includes('pptx.write')) {
      console.log('[Executor AutoFix] Adding missing pptx.write statement');

      // Clean up incomplete lines at the end
      const lines = fixedCode.trimEnd().split('\n');
      while (lines.length > 0) {
        const lastLine = lines[lines.length - 1].trim();
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

    // Check if module.exports is missing but pptx.write exists
    if (!fixedCode.includes('module.exports') && fixedCode.includes('pptx.write')) {
      console.log('[Executor AutoFix] Adding missing module.exports');
      fixedCode = fixedCode.trimEnd() + '\n\nmodule.exports = { generatePresentation };\n';
      wasFixed = true;
    }
  }

  if (wasFixed) {
    console.log('[Executor AutoFix] Code was auto-fixed for missing closing statements');
  }

  return fixedCode;
}

/**
 * Execute with validation (and auto-fix)
 */
async function executeValidatedPptxCode(code) {
  // Try to auto-fix truncated code first
  let fixedCode = autoFixTruncatedCode(code);

  const validation = validatePptxCode(fixedCode);
  if (!validation.valid) {
    throw new Error('Code validation failed: ' + validation.error);
  }

  return await executePptxCode(fixedCode);
}

module.exports = {
  executePptxCode,
  validatePptxCode,
  executeValidatedPptxCode,
  applyWavestoneThemeFonts,
  WAVESTONE_ASSETS,
};
