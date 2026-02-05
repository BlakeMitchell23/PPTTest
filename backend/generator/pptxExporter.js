/**
 * Wavestone PPTX Exporter - Template-based XML approach
 *
 * Uses the official Wavestone template and manipulates OOXML directly
 * to create slides that use the real slideLayouts and theme.
 *
 * This approach:
 * - Uses the official Wavestone .pptx template
 * - Fills placeholders in the slideLayouts
 * - Adds custom shapes/text using proper OOXML
 * - Preserves all theme colors, fonts, and styles
 */

const JSZip = require('jszip');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// ============================================================
// CONSTANTS
// ============================================================

// EMU (English Metric Units): 914400 EMU = 1 inch
const EMU_PER_INCH = 914400;
const EMU_PER_PT = 12700; // For font sizes
const EMU_PER_PX = 914400 / 72; // ~12700

// Slide dimensions in EMU (16:9 = 12192000 x 6858000)
const SLIDE_W = 12192000;
const SLIDE_H = 6858000;

// Convert pixels (960x540 base) to EMU
const pxToEmu = (px) => Math.round(px * SLIDE_W / 960);

// Layout zones (from CSS, converted to EMU)
const MARGIN = pxToEmu(33);
const BODY_Y = pxToEmu(122);
const BODY_W = pxToEmu(893);
const BODY_H = pxToEmu(394);

// SlideLayout mapping
const LAYOUTS = {
  cover: 2,        // Cover full blue without picture
  section: 12,     // Chapter gradient blue
  content: 5,      // General content without picture
  end: 22,         // End page blue
  quote: 17,       // Quote with people picture
  blank: 18,       // Blank page
};

// Wavestone colors (from theme)
const COLORS = {
  violet: '451DC7',
  indigo: '250F6B',
  green: '04F06A',
  greenDark: '02B84F',
  white: 'FFFFFF',
  black: '000000',
  gray100: 'F1F3F5',
  gray200: 'E9ECEF',
  gray600: '868E96',
  gray700: '495057',
  accent6: 'F6F6F6',
  success: '2E7D32',
  danger: 'C62828',
  warning: 'F57F17',
  info: '1565C0',
};

// ============================================================
// MAIN EXPORT FUNCTION
// ============================================================

async function exportSlidesToPptx(slidesHtml) {
  // Load the template
  const templatePath = path.join(__dirname, '..', '..', 'theme', 'Template WAvestone.pptx');
  const templateData = fs.readFileSync(templatePath);
  const zip = await JSZip.loadAsync(templateData);

  // Parse presentation.xml to understand structure
  const presentationXml = await zip.file('ppt/presentation.xml').async('string');

  // Remove existing slides from the template
  await removeExistingSlides(zip);

  // Track slide info for relationships
  const slideInfos = [];

  // Process each HTML slide
  for (let i = 0; i < slidesHtml.length; i++) {
    console.log(`[PPTX] Processing slide ${i + 1}/${slidesHtml.length}`);
    const $ = cheerio.load(slidesHtml[i]);
    const slideInfo = await addSlide(zip, $, i + 1);
    slideInfos.push(slideInfo);
  }

  // Update presentation.xml with new slides
  await updatePresentationXml(zip, slideInfos);

  // Update [Content_Types].xml
  await updateContentTypes(zip, slideInfos);

  // Generate the final PPTX
  return await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

// ============================================================
// SLIDE MANAGEMENT
// ============================================================

async function removeExistingSlides(zip) {
  // Get list of existing slide files
  const files = Object.keys(zip.files);
  const slideFiles = files.filter(f =>
    f.startsWith('ppt/slides/slide') && f.endsWith('.xml') ||
    f.startsWith('ppt/slides/_rels/slide') && f.endsWith('.xml.rels') ||
    f.startsWith('ppt/notesSlides/')
  );

  // Remove them
  for (const file of slideFiles) {
    zip.remove(file);
  }
}

async function addSlide(zip, $, slideNum) {
  const slideEl = $('.slide');
  let slideType = 'content';
  let layoutNum = LAYOUTS.content;

  // Detect slide type
  if (slideEl.hasClass('slide-cover')) {
    slideType = 'cover';
    layoutNum = LAYOUTS.cover;
  } else if (slideEl.hasClass('slide-section')) {
    slideType = 'section';
    layoutNum = LAYOUTS.section;
  } else if (slideEl.hasClass('slide-end')) {
    slideType = 'end';
    layoutNum = LAYOUTS.end;
  }

  // Generate slide XML based on type
  let slideXml;
  if (slideType === 'cover') {
    slideXml = generateCoverSlide($);
  } else if (slideType === 'section') {
    slideXml = generateSectionSlide($);
  } else if (slideType === 'end') {
    slideXml = generateEndSlide($);
  } else {
    slideXml = generateContentSlide($);
  }

  // Add slide to zip
  const slidePath = `ppt/slides/slide${slideNum}.xml`;
  zip.file(slidePath, slideXml);

  // Create slide relationships
  const slideRelsXml = generateSlideRels(layoutNum);
  const slideRelsPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`;
  zip.file(slideRelsPath, slideRelsXml);

  return {
    num: slideNum,
    layoutNum: layoutNum,
    type: slideType,
  };
}

function generateSlideRels(layoutNum) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout${layoutNum}.xml"/>
</Relationships>`;
}

// ============================================================
// SLIDE GENERATORS
// ============================================================

function generateCoverSlide($) {
  const title = escapeXml($('.slide-title').text().trim());
  const subtitle = escapeXml($('.slide-subtitle').text().trim());

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld>
<p:spTree>
<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
${title ? `<p:sp>
<p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>
<p:spPr/>
<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="fr-FR" dirty="0"/><a:t>${title}</a:t></a:r></a:p></p:txBody>
</p:sp>` : ''}
${subtitle ? `<p:sp>
<p:nvSpPr><p:cNvPr id="3" name="Subtitle"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="15"/></p:nvPr></p:nvSpPr>
<p:spPr/>
<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="fr-FR" dirty="0"/><a:t>${subtitle}</a:t></a:r></a:p></p:txBody>
</p:sp>` : ''}
</p:spTree>
</p:cSld>
<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

function generateSectionSlide($) {
  const sectionNum = escapeXml($('.section-number').text().trim());
  const title = escapeXml($('.slide-title').text().trim());

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld>
<p:spTree>
<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
${sectionNum ? `<p:sp>
<p:nvSpPr><p:cNvPr id="2" name="Section Number"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="13"/></p:nvPr></p:nvSpPr>
<p:spPr/>
<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="fr-FR" dirty="0"/><a:t>${sectionNum}</a:t></a:r></a:p></p:txBody>
</p:sp>` : ''}
${title ? `<p:sp>
<p:nvSpPr><p:cNvPr id="3" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>
<p:spPr/>
<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="fr-FR" dirty="0"/><a:t>${title}</a:t></a:r></a:p></p:txBody>
</p:sp>` : ''}
</p:spTree>
</p:cSld>
<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

function generateEndSlide($) {
  // End slide uses the layout background, minimal content needed
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld>
<p:spTree>
<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
</p:spTree>
</p:cSld>
<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

function generateContentSlide($) {
  const headerLeft = escapeXml($('.header-bar-left').text().trim());
  const headerRight = escapeXml($('.header-bar-right').text().trim());
  const title = escapeXml($('.slide-title').text().trim());

  // Build body content
  const bodyContent = buildBodyContent($);

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld>
<p:spTree>
<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
${headerLeft ? `<p:sp>
<p:nvSpPr><p:cNvPr id="2" name="Header Left"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" sz="quarter" idx="13"/></p:nvPr></p:nvSpPr>
<p:spPr/>
<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="fr-FR" dirty="0"/><a:t>${headerLeft}</a:t></a:r></a:p></p:txBody>
</p:sp>` : ''}
${headerRight ? `<p:sp>
<p:nvSpPr><p:cNvPr id="3" name="Header Right"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" sz="quarter" idx="15"/></p:nvPr></p:nvSpPr>
<p:spPr/>
<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="fr-FR" dirty="0"/><a:t>${headerRight}</a:t></a:r></a:p></p:txBody>
</p:sp>` : ''}
${title ? `<p:sp>
<p:nvSpPr><p:cNvPr id="4" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>
<p:spPr/>
<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="fr-FR" dirty="0"/><a:t>${title}</a:t></a:r></a:p></p:txBody>
</p:sp>` : ''}
${bodyContent}
</p:spTree>
</p:cSld>
<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

// ============================================================
// BODY CONTENT BUILDER
// ============================================================

function buildBodyContent($) {
  const body = $('.slide-body');
  if (!body.length) return '';

  let shapes = [];
  let shapeId = 10; // Start IDs after placeholders

  // Check for different component types
  const kpiGrid = body.find('.kpi-grid');
  const processFlow = body.find('.process-flow');
  const comparisonGrid = body.find('.comparison-grid');
  const table = body.find('table, .slide-table');
  const timeline = body.find('.timeline');
  const quoteBlock = body.find('.quote-block');
  const cardGrid = body.find('.card-grid');
  const bullets = body.find('.slide-bullets');
  const simpleList = body.find('.slide-list');
  const callout = body.find('.callout');

  // Position tracking
  let currentY = BODY_Y;

  if (kpiGrid.length) {
    const result = buildKpiGridXml($, kpiGrid, shapeId, currentY);
    shapes.push(result.xml);
    shapeId = result.nextId;
    currentY = result.nextY;
  }

  if (processFlow.length) {
    const result = buildProcessFlowXml($, processFlow, shapeId, currentY);
    shapes.push(result.xml);
    shapeId = result.nextId;
    currentY = result.nextY;
  }

  if (comparisonGrid.length) {
    const result = buildComparisonGridXml($, comparisonGrid, shapeId, currentY);
    shapes.push(result.xml);
    shapeId = result.nextId;
    currentY = result.nextY;
  }

  if (table.length) {
    const result = buildTableXml($, table, shapeId, currentY);
    shapes.push(result.xml);
    shapeId = result.nextId;
    currentY = result.nextY;
  }

  if (bullets.length) {
    const result = buildBulletsXml($, bullets, shapeId, currentY);
    shapes.push(result.xml);
    shapeId = result.nextId;
    currentY = result.nextY;
  }

  if (simpleList.length) {
    const result = buildSimpleListXml($, simpleList, shapeId, currentY);
    shapes.push(result.xml);
    shapeId = result.nextId;
    currentY = result.nextY;
  }

  if (callout.length) {
    const result = buildCalloutXml($, callout, shapeId, currentY);
    shapes.push(result.xml);
    shapeId = result.nextId;
  }

  return shapes.join('\n');
}

// ============================================================
// COMPONENT BUILDERS (XML)
// ============================================================

function buildKpiGridXml($, el, startId, startY) {
  const cards = el.find('.kpi-card');
  if (!cards.length) return { xml: '', nextId: startId, nextY: startY };

  let xml = '';
  let id = startId;
  const count = cards.length;
  const cols = Math.min(count, 4);
  const rows = Math.ceil(count / cols);
  const gap = pxToEmu(12);
  const cardW = Math.floor((BODY_W - (cols - 1) * gap) / cols);
  const cardH = pxToEmu(140);

  cards.each((i, card) => {
    const $card = $(card);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = MARGIN + col * (cardW + gap);
    const y = startY + row * (cardH + gap);

    // Determine accent color
    let accentColor = COLORS.violet;
    let valueColor = COLORS.violet;
    if ($card.hasClass('trend-up')) {
      accentColor = COLORS.success;
      valueColor = COLORS.success;
    } else if ($card.hasClass('trend-down')) {
      accentColor = COLORS.danger;
      valueColor = COLORS.danger;
    }

    // Background shape
    xml += createRoundRectXml(id++, x, y, cardW, cardH, COLORS.accent6, 80000);

    // Left accent bar
    xml += createRectXml(id++, x, y, pxToEmu(4), cardH, accentColor);

    // KPI Value
    const value = $card.find('.kpi-value').text().trim();
    if (value) {
      xml += createTextBoxXml(id++, x + pxToEmu(10), y + pxToEmu(16), cardW - pxToEmu(20), pxToEmu(40), value, {
        fontSize: 3200, bold: true, color: valueColor, align: 'ctr'
      });
    }

    // KPI Unit
    const unit = $card.find('.kpi-unit').text().trim();
    if (unit) {
      xml += createTextBoxXml(id++, x + pxToEmu(10), y + pxToEmu(55), cardW - pxToEmu(20), pxToEmu(20), unit, {
        fontSize: 1300, bold: true, color: COLORS.gray600, align: 'ctr'
      });
    }

    // KPI Label
    const label = $card.find('.kpi-label').text().trim();
    if (label) {
      xml += createTextBoxXml(id++, x + pxToEmu(10), y + pxToEmu(75), cardW - pxToEmu(20), pxToEmu(35), label, {
        fontSize: 1200, color: COLORS.gray700, align: 'ctr'
      });
    }

    // KPI Trend
    const trend = $card.find('.kpi-trend').text().trim();
    if (trend) {
      let trendColor = COLORS.gray600;
      if ($card.find('.kpi-trend').hasClass('up')) trendColor = COLORS.success;
      else if ($card.find('.kpi-trend').hasClass('down')) trendColor = COLORS.danger;

      xml += createTextBoxXml(id++, x + pxToEmu(10), y + pxToEmu(110), cardW - pxToEmu(20), pxToEmu(20), trend, {
        fontSize: 1100, bold: true, color: trendColor, align: 'ctr'
      });
    }
  });

  return {
    xml,
    nextId: id,
    nextY: startY + rows * (cardH + gap),
  };
}

function buildProcessFlowXml($, el, startId, startY) {
  const steps = el.find('.process-step');
  if (!steps.length) return { xml: '', nextId: startId, nextY: startY };

  let xml = '';
  let id = startId;
  const count = steps.length;
  const connectorW = pxToEmu(30);
  const stepW = Math.floor((BODY_W - (count - 1) * connectorW) / count);
  const stepH = pxToEmu(150);

  steps.each((i, step) => {
    const $step = $(step);
    const x = MARGIN + i * (stepW + connectorW);

    // Step number circle
    const number = $step.find('.step-number').text().trim();
    if (number) {
      const circleSize = pxToEmu(36);
      const circleX = x + Math.floor((stepW - circleSize) / 2);
      xml += createEllipseXml(id++, circleX, startY, circleSize, circleSize, COLORS.violet);
      xml += createTextBoxXml(id++, circleX, startY, circleSize, circleSize, number, {
        fontSize: 1600, bold: true, color: COLORS.white, align: 'ctr', valign: 'ctr'
      });
    }

    // Step title
    const title = $step.find('.step-title').text().trim();
    if (title) {
      xml += createTextBoxXml(id++, x, startY + pxToEmu(45), stepW, pxToEmu(30), title, {
        fontSize: 1400, bold: true, color: COLORS.indigo, align: 'ctr'
      });
    }

    // Step description
    const desc = $step.find('.step-desc').text().trim();
    if (desc) {
      xml += createTextBoxXml(id++, x, startY + pxToEmu(75), stepW, pxToEmu(60), desc, {
        fontSize: 1100, color: COLORS.gray600, align: 'ctr'
      });
    }

    // Connector arrow (except after last step)
    if (i < count - 1) {
      const arrowX = x + stepW + Math.floor((connectorW - pxToEmu(20)) / 2);
      xml += createTextBoxXml(id++, arrowX, startY + pxToEmu(8), pxToEmu(20), pxToEmu(30), '→', {
        fontSize: 2200, color: COLORS.violet, align: 'ctr', valign: 'ctr'
      });
    }
  });

  return {
    xml,
    nextId: id,
    nextY: startY + stepH,
  };
}

function buildComparisonGridXml($, el, startId, startY) {
  const columns = el.find('.comparison-column');
  if (!columns.length) return { xml: '', nextId: startId, nextY: startY };

  let xml = '';
  let id = startId;
  const count = columns.length;
  const gap = pxToEmu(16);
  const colW = Math.floor((BODY_W - (count - 1) * gap) / count);
  const colH = pxToEmu(280);

  columns.each((i, col) => {
    const $col = $(col);
    const x = MARGIN + i * (colW + gap);

    // Determine variant
    let borderColor = COLORS.violet;
    let bulletChar = '•';
    let bulletColor = COLORS.violet;

    if ($col.hasClass('before')) {
      borderColor = COLORS.danger;
      bulletChar = '✗';
      bulletColor = COLORS.danger;
    } else if ($col.hasClass('after')) {
      borderColor = COLORS.success;
      bulletChar = '✓';
      bulletColor = COLORS.success;
    }

    // Background
    xml += createRoundRectXml(id++, x, startY, colW, colH, COLORS.accent6, 80000);

    // Top border
    xml += createRectXml(id++, x, startY, colW, pxToEmu(4), borderColor);

    // Header
    const header = $col.find('.comparison-header').text().trim();
    if (header) {
      xml += createTextBoxXml(id++, x + pxToEmu(12), startY + pxToEmu(12), colW - pxToEmu(24), pxToEmu(25), header, {
        fontSize: 1600, bold: true, color: COLORS.indigo
      });
    }

    // List items
    const items = [];
    $col.find('li').each((j, item) => {
      const text = $(item).text().trim();
      if (text) items.push(text);
    });

    if (items.length) {
      const listText = items.map(item => `${bulletChar} ${item}`).join('\n');
      xml += createTextBoxXml(id++, x + pxToEmu(12), startY + pxToEmu(45), colW - pxToEmu(24), colH - pxToEmu(60), listText, {
        fontSize: 1400, color: COLORS.black
      });
    }
  });

  return {
    xml,
    nextId: id,
    nextY: startY + colH + gap,
  };
}

function buildTableXml($, el, startId, startY) {
  const rows = [];
  el.find('tr').each((i, tr) => {
    const cells = [];
    $(tr).find('th, td').each((j, cell) => {
      cells.push({
        text: $(cell).text().trim(),
        isHeader: cell.tagName.toLowerCase() === 'th',
      });
    });
    if (cells.length) rows.push(cells);
  });

  if (!rows.length) return { xml: '', nextId: startId, nextY: startY };

  const colCount = Math.max(...rows.map(r => r.length));
  const rowH = pxToEmu(30);
  const tableH = rows.length * rowH;
  const colW = Math.floor(BODY_W / colCount);

  // Build table XML
  let xml = `<p:graphicFrame>
<p:nvGraphicFramePr><p:cNvPr id="${startId}" name="Table"/><p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr><p:nvPr/></p:nvGraphicFramePr>
<p:xfrm><a:off x="${MARGIN}" y="${startY}"/><a:ext cx="${BODY_W}" cy="${tableH}"/></p:xfrm>
<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">
<a:tbl><a:tblPr firstRow="1" bandRow="1"><a:tableStyleId>{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}</a:tableStyleId></a:tblPr>
<a:tblGrid>${Array(colCount).fill(`<a:gridCol w="${colW}"/>`).join('')}</a:tblGrid>`;

  rows.forEach((row, rowIdx) => {
    xml += `<a:tr h="${rowH}">`;
    row.forEach((cell, colIdx) => {
      const bgColor = cell.isHeader ? COLORS.violet : (rowIdx % 2 === 0 ? COLORS.white : COLORS.accent6);
      const textColor = cell.isHeader ? COLORS.white : COLORS.black;
      xml += `<a:tc>
<a:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="fr-FR" sz="1200" ${cell.isHeader ? 'b="1"' : ''} dirty="0"><a:solidFill><a:srgbClr val="${textColor}"/></a:solidFill></a:rPr><a:t>${escapeXml(cell.text)}</a:t></a:r></a:p></a:txBody>
<a:tcPr><a:solidFill><a:srgbClr val="${bgColor}"/></a:solidFill></a:tcPr>
</a:tc>`;
    });
    // Fill empty cells if row is short
    for (let k = row.length; k < colCount; k++) {
      xml += `<a:tc><a:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="fr-FR"/></a:p></a:txBody><a:tcPr/></a:tc>`;
    }
    xml += '</a:tr>';
  });

  xml += '</a:tbl></a:graphicData></a:graphic></p:graphicFrame>';

  return {
    xml,
    nextId: startId + 1,
    nextY: startY + tableH + pxToEmu(12),
  };
}

function buildBulletsXml($, el, startId, startY) {
  const paragraphs = [];

  function walkList($ul, level) {
    $ul.children('li').each((i, li) => {
      const $li = $(li);
      let text = '';
      $li.contents().each((j, node) => {
        if (node.type === 'text') text += $(node).text();
        else if (node.name !== 'ul') text += $(node).text();
      });
      text = text.trim();

      if (text) {
        paragraphs.push({ text, level });
      }

      $li.children('ul').each((k, nestedUl) => {
        walkList($(nestedUl), level + 1);
      });
    });
  }

  walkList(el, 0);
  if (!paragraphs.length) return { xml: '', nextId: startId, nextY: startY };

  const bulletH = pxToEmu(Math.min(paragraphs.length * 28, 350));

  // Build paragraphs with proper bullet hierarchy
  let pXml = paragraphs.map(p => {
    const indent = p.level * 457200; // ~0.5 inch per level
    const bullet = p.level === 0 ? '' : `<a:buChar char="${p.level === 1 ? '•' : p.level === 2 ? '–' : '○'}"/>`;
    const fontSize = p.level === 0 ? 1600 : p.level === 1 ? 1600 : p.level === 2 ? 1400 : 1200;

    return `<a:p><a:pPr lvl="${p.level}" indent="${indent}">${bullet}</a:pPr><a:r><a:rPr lang="fr-FR" sz="${fontSize}" ${p.level === 0 ? 'b="1"' : ''} dirty="0"/><a:t>${escapeXml(p.text)}</a:t></a:r></a:p>`;
  }).join('');

  const xml = createTextBoxXmlRaw(startId, MARGIN, startY, BODY_W, bulletH, pXml);

  return {
    xml,
    nextId: startId + 1,
    nextY: startY + bulletH + pxToEmu(12),
  };
}

function buildSimpleListXml($, el, startId, startY) {
  const items = [];
  el.find('li').each((i, li) => {
    const text = $(li).text().trim();
    if (text) items.push(text);
  });

  if (!items.length) return { xml: '', nextId: startId, nextY: startY };

  const listH = pxToEmu(Math.min(items.length * 28, 300));

  const pXml = items.map(item =>
    `<a:p><a:pPr><a:buChar char="•"/></a:pPr><a:r><a:rPr lang="fr-FR" sz="1600" dirty="0"/><a:t>${escapeXml(item)}</a:t></a:r></a:p>`
  ).join('');

  const xml = createTextBoxXmlRaw(startId, MARGIN, startY, BODY_W, listH, pXml);

  return {
    xml,
    nextId: startId + 1,
    nextY: startY + listH + pxToEmu(12),
  };
}

function buildCalloutXml($, el, startId, startY) {
  // Determine variant
  let bgColor = 'E3F2FD';
  let borderColor = COLORS.info;
  let textColor = '0D47A1';
  let icon = 'ℹ';

  if (el.hasClass('warning')) {
    bgColor = 'FFF8E1';
    borderColor = COLORS.warning;
    textColor = 'E65100';
    icon = '⚠';
  } else if (el.hasClass('success')) {
    bgColor = 'E8F5E9';
    borderColor = COLORS.success;
    textColor = '1B5E20';
    icon = '✓';
  } else if (el.hasClass('danger')) {
    bgColor = 'FFEBEE';
    borderColor = COLORS.danger;
    textColor = 'B71C1C';
    icon = '✗';
  }

  let text = '';
  el.contents().each((i, node) => {
    if (node.type === 'text') text += $(node).text();
    else if (!$(node).hasClass('callout-icon')) text += $(node).text();
  });
  text = text.trim();

  const calloutH = pxToEmu(50);
  let xml = '';

  // Background
  xml += createRoundRectXml(startId, MARGIN, startY, BODY_W, calloutH, bgColor, 50000);

  // Left border
  xml += createRectXml(startId + 1, MARGIN, startY, pxToEmu(4), calloutH, borderColor);

  // Text with icon
  xml += createTextBoxXml(startId + 2, MARGIN + pxToEmu(14), startY + pxToEmu(10), BODY_W - pxToEmu(28), calloutH - pxToEmu(20), `${icon}  ${text}`, {
    fontSize: 1400, color: textColor
  });

  return {
    xml,
    nextId: startId + 3,
    nextY: startY + calloutH + pxToEmu(12),
  };
}

// ============================================================
// XML SHAPE HELPERS
// ============================================================

function createRectXml(id, x, y, w, h, fillColor) {
  return `<p:sp>
<p:nvSpPr><p:cNvPr id="${id}" name="Rectangle ${id}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
<p:spPr>
<a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm>
<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
<a:solidFill><a:srgbClr val="${fillColor}"/></a:solidFill>
<a:ln><a:noFill/></a:ln>
</p:spPr>
</p:sp>`;
}

function createRoundRectXml(id, x, y, w, h, fillColor, radius = 80000) {
  return `<p:sp>
<p:nvSpPr><p:cNvPr id="${id}" name="RoundRect ${id}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
<p:spPr>
<a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm>
<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val ${radius}"/></a:avLst></a:prstGeom>
<a:solidFill><a:srgbClr val="${fillColor}"/></a:solidFill>
<a:ln><a:noFill/></a:ln>
</p:spPr>
</p:sp>`;
}

function createEllipseXml(id, x, y, w, h, fillColor) {
  return `<p:sp>
<p:nvSpPr><p:cNvPr id="${id}" name="Ellipse ${id}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
<p:spPr>
<a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm>
<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>
<a:solidFill><a:srgbClr val="${fillColor}"/></a:solidFill>
<a:ln><a:noFill/></a:ln>
</p:spPr>
</p:sp>`;
}

function createTextBoxXml(id, x, y, w, h, text, opts = {}) {
  const fontSize = opts.fontSize || 1400;
  const bold = opts.bold ? 'b="1"' : '';
  const color = opts.color || COLORS.black;
  const align = opts.align || 'l';
  const valign = opts.valign === 'ctr' ? 'ctr' : 't';

  return `<p:sp>
<p:nvSpPr><p:cNvPr id="${id}" name="TextBox ${id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
<p:spPr>
<a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm>
<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
<a:noFill/>
</p:spPr>
<p:txBody>
<a:bodyPr wrap="square" anchor="${valign}"/>
<a:lstStyle/>
<a:p><a:pPr algn="${align}"/><a:r><a:rPr lang="fr-FR" sz="${fontSize}" ${bold} dirty="0"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill></a:rPr><a:t>${escapeXml(text)}</a:t></a:r></a:p>
</p:txBody>
</p:sp>`;
}

function createTextBoxXmlRaw(id, x, y, w, h, paragraphsXml) {
  return `<p:sp>
<p:nvSpPr><p:cNvPr id="${id}" name="TextBox ${id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
<p:spPr>
<a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm>
<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
<a:noFill/>
</p:spPr>
<p:txBody>
<a:bodyPr wrap="square"/>
<a:lstStyle/>
${paragraphsXml}
</p:txBody>
</p:sp>`;
}

// ============================================================
// PRESENTATION.XML UPDATE
// ============================================================

async function updatePresentationXml(zip, slideInfos) {
  let xml = await zip.file('ppt/presentation.xml').async('string');

  // Build new slide list
  const slideListXml = slideInfos.map((info, i) =>
    `<p:sldId id="${256 + i}" r:id="rId${10 + i}"/>`
  ).join('');

  // Replace existing sldIdLst
  xml = xml.replace(/<p:sldIdLst>[\s\S]*?<\/p:sldIdLst>/, `<p:sldIdLst>${slideListXml}</p:sldIdLst>`);

  zip.file('ppt/presentation.xml', xml);

  // Update presentation.xml.rels
  let relsXml = await zip.file('ppt/_rels/presentation.xml.rels').async('string');

  // Remove old slide relationships
  relsXml = relsXml.replace(/<Relationship[^>]*Target="slides\/slide\d+\.xml"[^>]*\/>/g, '');

  // Add new slide relationships before closing tag
  const newRels = slideInfos.map((info, i) =>
    `<Relationship Id="rId${10 + i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${info.num}.xml"/>`
  ).join('');

  relsXml = relsXml.replace('</Relationships>', newRels + '</Relationships>');

  zip.file('ppt/_rels/presentation.xml.rels', relsXml);
}

// ============================================================
// CONTENT_TYPES UPDATE
// ============================================================

async function updateContentTypes(zip, slideInfos) {
  let xml = await zip.file('[Content_Types].xml').async('string');

  // Remove old slide overrides
  xml = xml.replace(/<Override[^>]*PartName="\/ppt\/slides\/slide\d+\.xml"[^>]*\/>/g, '');

  // Add new slide overrides
  const newOverrides = slideInfos.map(info =>
    `<Override PartName="/ppt/slides/slide${info.num}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
  ).join('');

  xml = xml.replace('</Types>', newOverrides + '</Types>');

  zip.file('[Content_Types].xml', xml);
}

// ============================================================
// UTILITIES
// ============================================================

function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = { exportSlidesToPptx };
