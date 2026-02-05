/**
 * PPTX Code Executor
 * Executes generated pptxgenjs JavaScript code in a sandboxed environment
 * Returns the PPTX buffer
 */

const PptxGenJS = require('pptxgenjs');

/**
 * Execute pptxgenjs code and return the PPTX buffer
 * @param {string} code - The JavaScript code to execute
 * @returns {Promise<Buffer>} The PPTX file as a buffer
 */
async function executePptxCode(code) {
  try {
    // Create a sandboxed environment with PptxGenJS available
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

    // Remove the require statement from the generated code since we inject PptxGenJS
    let cleanedCode = code
      .replace(/const\s+PptxGenJS\s*=\s*require\s*\(\s*['"]pptxgenjs['"]\s*\)\s*;?/g, '')
      .replace(/module\.exports\s*=\s*\{[^}]*\}\s*;?/g, '');

    // Wrap the code to inject PptxGenJS and execute generatePresentation
    const wrappedCode = `
      const PptxGenJS = this.PptxGenJS;

      ${cleanedCode}

      // Call the generatePresentation function and return the result
      return await generatePresentation();
    `;

    // Create the async function with PptxGenJS in its context
    const fn = new AsyncFunction(wrappedCode);

    // Execute with PptxGenJS bound to this
    const buffer = await fn.call({ PptxGenJS });

    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Generated code did not return a valid buffer');
    }

    return buffer;
  } catch (error) {
    console.error('Error executing pptx code:', error);

    // Provide more helpful error messages
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
 * @param {string} code - The JavaScript code to validate
 * @returns {Object} Validation result { valid: boolean, error?: string }
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

  // Check for common dangerous patterns (basic security)
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
 * Execute with validation
 * @param {string} code - The JavaScript code to execute
 * @returns {Promise<Buffer>} The PPTX file as a buffer
 */
async function executeValidatedPptxCode(code) {
  const validation = validatePptxCode(code);
  if (!validation.valid) {
    throw new Error('Code validation failed: ' + validation.error);
  }

  return await executePptxCode(code);
}

module.exports = {
  executePptxCode,
  validatePptxCode,
  executeValidatedPptxCode,
};
