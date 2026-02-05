/**
 * PDF Exporter
 * Uses Puppeteer to render HTML slides and export as PDF
 * Each slide becomes one 960x540 page
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Export slides HTML to PDF buffer
 * @param {string[]} slidesHtml - Array of slide HTML strings
 * @param {string} cssContent - The slides.css content
 * @returns {Buffer} PDF buffer
 */
async function exportSlidesToPdf(slidesHtml, cssContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Resolve CSS asset references (images + fonts) to base64 for Puppeteer
    const resolvedCss = resolveAssetPaths(cssContent);
    const fullHtml = buildPdfDocument(slidesHtml, resolvedCss);
    await page.setContent(fullHtml, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for fonts and a small extra delay for rendering
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 500));

    const pdf = await page.pdf({
      width: '960px',
      height: '540px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    // Ensure we return a proper Buffer (Puppeteer v23+ may return Uint8Array)
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

/**
 * Resolve relative CSS url() references to base64 data URIs
 * This ensures background images AND fonts work in Puppeteer which has no server context
 */
function resolveAssetPaths(cssContent) {
  const frontendDir = path.join(__dirname, '..', '..', 'frontend');

  return cssContent.replace(/url\(['"]?(assets\/[^'")\s]+)['"]?\)/g, (match, relPath) => {
    const absPath = path.join(frontendDir, relPath);
    try {
      const ext = path.extname(relPath).toLowerCase();
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif',
        '.ttf': 'font/ttf',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.otf': 'font/otf',
      };
      const mime = mimeTypes[ext] || 'application/octet-stream';
      const data = fs.readFileSync(absPath).toString('base64');
      return `url('data:${mime};base64,${data}')`;
    } catch (err) {
      console.warn(`Could not resolve asset: ${relPath}`, err.message);
      return match; // keep original if file not found
    }
  });
}

/**
 * Build complete HTML document for PDF rendering
 */
function buildPdfDocument(slidesHtml, cssContent) {
  const slidesMarkup = slidesHtml
    .map((html) => `<div class="pdf-page">${html}</div>`)
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${cssContent}

    /* PDF-specific styles — do NOT use universal reset, it breaks slide CSS */
    html, body { margin: 0; padding: 0; }

    .pdf-page {
      width: 960px;
      height: 540px;
      page-break-after: always;
      overflow: hidden;
      position: relative;
    }

    .pdf-page:last-child {
      page-break-after: avoid;
    }

    @media print {
      .pdf-page {
        page-break-after: always;
      }
      .pdf-page:last-child {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  ${slidesMarkup}
</body>
</html>`;
}

/**
 * Load the slides.css file content
 */
function loadSlidesCss() {
  const cssPath = path.join(__dirname, '..', '..', 'frontend', 'slides.css');
  return fs.readFileSync(cssPath, 'utf-8');
}

module.exports = {
  exportSlidesToPdf,
  loadSlidesCss,
};
