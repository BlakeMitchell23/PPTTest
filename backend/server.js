/**
 * Wavestone Presentation Generator - Backend Server
 * Express server: Plan -> HTML Slides -> Preview + Chatbot -> PDF Export
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { generatePlan, generatePlanStreaming, SLIDE_TYPES } = require('./generator/planGenerator');
const { generateAllSlidesHtml, generateAllSlidesHtmlStreaming, modifySlideHtml } = require('./generator/slideHtmlGenerator');
const { exportSlidesToPdf, loadSlidesCss } = require('./generator/pdfExporter');
const { exportSlidesToPptx } = require('./generator/pptxExporter');
const { generatePptxCodeStreaming } = require('./generator/pptxCodeGenerator');
const { executeValidatedPptxCode } = require('./generator/pptxCodeExecutor');

const app = express();
const PORT = process.env.PORT || 3000;

// Store for pending generation sessions (to avoid URL length issues with SSE)
const pendingSessions = new Map();

// Store for PPTX Direct generation sessions
const pptxSessions = new Map();

// Store for generated code awaiting execution (for code preview feature)
const pendingCodeSessions = new Map();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Wavestone Presentation Generator is running' });
});

/**
 * Get available slide types
 */
app.get('/api/slide-types', (req, res) => {
  res.json({ slideTypes: SLIDE_TYPES });
});

/**
 * Generate a slide plan
 * POST /api/generate-plan
 */
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { prompt, slideCount, language = 'fr', deckType = 'autre', clientContext = {} } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Le prompt est requis.',
      });
    }

    const numSlides = parseInt(slideCount, 10);
    if (isNaN(numSlides) || numSlides < 3 || numSlides > 50) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Le nombre de slides doit etre entre 3 et 50.',
      });
    }

    console.log(`[${new Date().toISOString()}] Generating plan...`);

    const plan = await generatePlan({
      prompt: prompt.trim(),
      slideCount: numSlides,
      language,
      deckType,
      clientContext,
    });

    res.json({
      success: true,
      plan: plan,
      slideCount: plan.slides.length,
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Erreur lors de la generation du plan.',
    });
  }
});

/**
 * Initialize a streaming generation session
 * POST /api/generate-stream/init
 * Returns a session ID to use with the SSE endpoint
 */
app.post('/api/generate-stream/init', (req, res) => {
  const { prompt, slideCount, language = 'fr', deckType = 'autre' } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Le prompt est requis.',
    });
  }

  // Generate a unique session ID
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Store the session data
  pendingSessions.set(sessionId, {
    prompt: prompt.trim(),
    slideCount: parseInt(slideCount, 10) || 12,
    language,
    deckType,
    createdAt: Date.now(),
  });

  // Clean up old sessions (older than 5 minutes)
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  for (const [id, session] of pendingSessions) {
    if (session.createdAt < fiveMinutesAgo) {
      pendingSessions.delete(id);
    }
  }

  res.json({ sessionId });
});

/**
 * STREAMING: Generate plan + slides with real-time progress
 * GET /api/generate-stream (SSE endpoint)
 */
app.get('/api/generate-stream', async (req, res) => {
  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const sendEvent = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  try {
    let prompt, slideCount, language, deckType;

    // Check if using session-based approach (new)
    const sessionId = req.query.sessionId;
    if (sessionId) {
      const session = pendingSessions.get(sessionId);
      if (!session) {
        sendEvent('error', { message: 'Session expirée. Veuillez réessayer.' });
        res.end();
        return;
      }
      prompt = session.prompt;
      slideCount = session.slideCount;
      language = session.language;
      deckType = session.deckType;
      // Remove the session after use
      pendingSessions.delete(sessionId);
    } else {
      // Legacy URL params approach (for backwards compatibility)
      try {
        prompt = req.query.prompt ? decodeURIComponent(req.query.prompt) : '';
      } catch (e) {
        prompt = req.query.prompt || '';
      }
      slideCount = parseInt(req.query.slideCount || '12', 10);
      language = req.query.language || 'fr';
      deckType = req.query.deckType || 'autre';
    }

    if (!prompt || prompt.trim().length === 0) {
      sendEvent('error', { message: 'Le prompt est requis.' });
      res.end();
      return;
    }

    prompt = prompt.trim();

    console.log(`[${new Date().toISOString()}] Starting streaming generation...`);

    // Step 1: Generate plan with streaming
    sendEvent('phase', { phase: 'plan', message: 'Analyse de votre demande...' });

    const plan = await generatePlanStreaming({
      prompt,
      slideCount,
      language,
      deckType,
      clientContext: {},
    }, (thinking) => {
      sendEvent('thinking', { content: thinking });
    });

    sendEvent('plan_complete', {
      message: `Plan créé : ${plan.slides.length} slides`,
      plan: plan
    });

    // Step 2: Generate HTML slides with streaming
    sendEvent('phase', { phase: 'slides', message: 'Génération des slides...' });

    const slides = await generateAllSlidesHtmlStreaming(plan, language, {}, (progress) => {
      sendEvent('slide_progress', progress);
    });

    // Done
    sendEvent('complete', {
      message: 'Génération terminée !',
      slides: slides
    });

    console.log(`[${new Date().toISOString()}] Streaming generation complete: ${slides.length} slides`);
  } catch (error) {
    console.error('Streaming generation error:', error);
    sendEvent('error', { message: error.message || 'Erreur lors de la génération.' });
  } finally {
    res.end();
  }
});

/**
 * Generate HTML slides from an approved plan
 * POST /api/generate-slides-html
 */
app.post('/api/generate-slides-html', async (req, res) => {
  try {
    const { plan, language = 'fr', clientContext = {} } = req.body;

    if (!plan || !plan.slides || plan.slides.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Plan invalide.',
      });
    }

    console.log(`[${new Date().toISOString()}] Generating ${plan.slides.length} HTML slides...`);

    const slides = await generateAllSlidesHtml(plan, language, clientContext);

    console.log(`[${new Date().toISOString()}] Generated ${slides.length} slides`);

    res.json({
      success: true,
      slides: slides,
    });
  } catch (error) {
    console.error('Error generating slides HTML:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Erreur lors de la generation des slides.',
    });
  }
});

/**
 * Modify a single slide via chatbot instruction
 * POST /api/modify-slide
 */
app.post('/api/modify-slide', async (req, res) => {
  try {
    const { currentHtml, instruction, context = {} } = req.body;

    if (!currentHtml || !instruction) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'HTML actuel et instruction requis.',
      });
    }

    console.log(`[${new Date().toISOString()}] Modifying slide: "${instruction.substring(0, 60)}..."`);

    const newHtml = await modifySlideHtml(currentHtml, instruction, context);

    res.json({
      success: true,
      html: newHtml,
    });
  } catch (error) {
    console.error('Error modifying slide:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Erreur lors de la modification de la slide.',
    });
  }
});

/**
 * Export slides to PDF
 * POST /api/export-pdf
 */
app.post('/api/export-pdf', async (req, res) => {
  try {
    const { slides } = req.body;

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Slides HTML requises.',
      });
    }

    console.log(`[${new Date().toISOString()}] Exporting ${slides.length} slides to PDF...`);

    const cssContent = loadSlidesCss();
    const pdfBuffer = await exportSlidesToPdf(slides, cssContent);

    console.log(`[${new Date().toISOString()}] PDF generated: ${pdfBuffer.length} bytes`);

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': 'attachment; filename="presentation-wavestone.pdf"',
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Erreur lors de l\'export PDF.',
    });
  }
});

/**
 * Export slides to PPTX
 * POST /api/export-pptx
 */
app.post('/api/export-pptx', async (req, res) => {
  try {
    const { slides } = req.body;

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Slides HTML requises.',
      });
    }

    console.log(`[${new Date().toISOString()}] Exporting ${slides.length} slides to PPTX...`);

    const pptxBuffer = await exportSlidesToPptx(slides);

    console.log(`[${new Date().toISOString()}] PPTX generated: ${pptxBuffer.length} bytes`);

    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Length': pptxBuffer.length,
      'Content-Disposition': 'attachment; filename="presentation-wavestone.pptx"',
    });
    res.end(pptxBuffer);
  } catch (error) {
    console.error('Error exporting PPTX:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Erreur lors de l\'export PPTX.',
    });
  }
});

/**
 * Initialize a PPTX Direct streaming generation session
 * POST /api/generate-pptx-stream/init
 */
app.post('/api/generate-pptx-stream/init', (req, res) => {
  const { prompt, slideCount, language = 'fr', deckType = 'autre' } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Le prompt est requis.',
    });
  }

  // Generate a unique session ID
  const sessionId = `pptx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Store the session data
  pptxSessions.set(sessionId, {
    prompt: prompt.trim(),
    slideCount: parseInt(slideCount, 10) || 12,
    language,
    deckType,
    createdAt: Date.now(),
  });

  // Clean up old sessions (older than 10 minutes)
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [id, session] of pptxSessions) {
    if (session.createdAt < tenMinutesAgo) {
      pptxSessions.delete(id);
    }
  }

  res.json({ sessionId });
});

/**
 * STREAMING: Generate plan + pptxgenjs code + execute and return PPTX
 * GET /api/generate-pptx-stream (SSE endpoint)
 * Events: phase, thinking, code_chunk, code_complete, complete, error
 */
app.get('/api/generate-pptx-stream', async (req, res) => {
  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const sendEvent = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  try {
    const sessionId = req.query.sessionId;
    if (!sessionId) {
      sendEvent('error', { message: 'Session ID requis.' });
      res.end();
      return;
    }

    const session = pptxSessions.get(sessionId);
    if (!session) {
      sendEvent('error', { message: 'Session expirée. Veuillez réessayer.' });
      res.end();
      return;
    }

    const { prompt, slideCount, language, deckType } = session;
    const previewOnly = req.query.previewOnly === 'true';
    pptxSessions.delete(sessionId);

    console.log(`[${new Date().toISOString()}] Starting PPTX Direct generation...`);

    // Phase 1: Generate plan with streaming
    sendEvent('phase', { phase: 'plan', message: 'Analyse de votre demande...' });

    let lastThinkingTime = 0;
    const THINKING_THROTTLE = 100;

    const plan = await generatePlanStreaming({
      prompt,
      slideCount,
      language,
      deckType,
      clientContext: {},
    }, (thinking) => {
      const now = Date.now();
      if (now - lastThinkingTime > THINKING_THROTTLE) {
        sendEvent('thinking', { content: thinking });
        lastThinkingTime = now;
      }
    });

    sendEvent('plan_complete', {
      message: `Plan créé : ${plan.slides.length} slides`,
      plan: plan
    });

    // Phase 2: Generate pptxgenjs code with streaming and detailed progress
    sendEvent('phase', { phase: 'code', message: 'Génération du code PowerPoint...' });

    let fullCode = '';
    let lastProgressTime = 0;
    const PROGRESS_THROTTLE = 300;

    const code = await generatePptxCodeStreaming(plan, language,
      // onThinking callback
      (thinking) => {
        const now = Date.now();
        if (now - lastThinkingTime > THINKING_THROTTLE) {
          sendEvent('thinking', { content: thinking });
          lastThinkingTime = now;
        }
      },
      // onCodeChunk callback
      (codeChunk) => {
        fullCode += codeChunk;
        sendEvent('code_chunk', { content: codeChunk });
      },
      // onProgress callback - NEW: detailed progress feedback
      (progress) => {
        const now = Date.now();
        if (now - lastProgressTime > PROGRESS_THROTTLE) {
          sendEvent('progress', {
            step: progress.step,
            message: progress.message,
            details: progress.details || '',
            current: progress.current || 0,
            total: progress.total || plan.slides.length
          });
          lastProgressTime = now;
        }
      }
    );

    // Generate a code session ID for later execution
    const codeSessionId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store the code for later execution
    pendingCodeSessions.set(codeSessionId, {
      code: code,
      plan: plan,
      createdAt: Date.now()
    });

    // Clean up old code sessions (older than 30 minutes)
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    for (const [id, sess] of pendingCodeSessions) {
      if (sess.createdAt < thirtyMinutesAgo) {
        pendingCodeSessions.delete(id);
      }
    }

    sendEvent('code_complete', {
      message: 'Code généré avec succès',
      code: code,
      codeSessionId: codeSessionId,
      slideCount: plan.slides.length
    });

    // If preview mode, stop here and let user review the code
    if (previewOnly) {
      sendEvent('preview_ready', {
        message: 'Code prêt pour révision. Utilisez /api/execute-pptx-code pour exécuter.',
        codeSessionId: codeSessionId,
        slideCount: plan.slides.length
      });
      console.log(`[${new Date().toISOString()}] PPTX code preview ready: ${plan.slides.length} slides, session ${codeSessionId}`);
      return;
    }

    // Phase 3: Execute code and generate PPTX
    sendEvent('phase', { phase: 'execute', message: 'Création du fichier PowerPoint...' });

    const pptxBuffer = await executeValidatedPptxCode(code);

    // Convert buffer to base64 for transmission
    const pptxBase64 = pptxBuffer.toString('base64');

    // Generate filename
    const filename = `${(plan.deck_title || 'presentation')
      .replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50)}.pptx`;

    // Send complete event with base64 PPTX
    sendEvent('complete', {
      message: 'Présentation PowerPoint générée !',
      pptxBase64: pptxBase64,
      filename: filename,
      slideCount: plan.slides.length
    });

    console.log(`[${new Date().toISOString()}] PPTX Direct generation complete: ${plan.slides.length} slides, ${pptxBuffer.length} bytes`);

  } catch (error) {
    console.error('PPTX Direct generation error:', error);
    sendEvent('error', { message: error.message || 'Erreur lors de la génération.' });
  } finally {
    res.end();
  }
});

/**
 * Execute previously generated PPTX code
 * POST /api/execute-pptx-code
 * Body: { codeSessionId: string } OR { code: string, deckTitle?: string }
 */
app.post('/api/execute-pptx-code', async (req, res) => {
  try {
    const { codeSessionId, code: directCode, deckTitle } = req.body;

    let code, plan;

    if (codeSessionId) {
      // Use stored code from preview session
      const session = pendingCodeSessions.get(codeSessionId);
      if (!session) {
        return res.status(404).json({
          error: 'Session expired',
          message: 'Session de code expirée. Veuillez régénérer le code.'
        });
      }
      code = session.code;
      plan = session.plan;
      pendingCodeSessions.delete(codeSessionId);
    } else if (directCode) {
      // Use directly provided code
      code = directCode;
      plan = { deck_title: deckTitle || 'presentation', slides: [] };
    } else {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'codeSessionId ou code requis.'
      });
    }

    console.log(`[${new Date().toISOString()}] Executing PPTX code...`);

    const pptxBuffer = await executeValidatedPptxCode(code);

    // Generate filename
    const filename = `${(plan.deck_title || 'presentation')
      .replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50)}.pptx`;

    console.log(`[${new Date().toISOString()}] PPTX executed: ${pptxBuffer.length} bytes`);

    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Length': pptxBuffer.length,
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.end(pptxBuffer);

  } catch (error) {
    console.error('Error executing PPTX code:', error);
    res.status(500).json({
      error: 'Execution Error',
      message: error.message || 'Erreur lors de l\'exécution du code.'
    });
  }
});

/**
 * Get pending code session (for debugging)
 * GET /api/code-session/:sessionId
 */
app.get('/api/code-session/:sessionId', (req, res) => {
  const session = pendingCodeSessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({
    code: session.code,
    plan: session.plan,
    createdAt: session.createdAt
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('=====================================================================');
  console.log('  WAVESTONE Presentation Generator v4.0 - HTML/CSS + Chatbot + PDF/PPTX');
  console.log('=====================================================================');
  console.log(`  Server: http://localhost:${PORT}`);
  console.log('');
  console.log('  Endpoints:');
  console.log('    POST /api/generate-plan             Generate slide plan');
  console.log('    POST /api/generate-slides-html      Generate HTML slides');
  console.log('    POST /api/modify-slide              Chatbot: modify a slide');
  console.log('    POST /api/export-pdf                Export slides to PDF');
  console.log('    POST /api/export-pptx               Export slides to PPTX');
  console.log('    POST /api/generate-pptx-stream/init PPTX Direct: init session');
  console.log('    GET  /api/generate-pptx-stream      PPTX Direct: SSE stream (?previewOnly=true)');
  console.log('    POST /api/execute-pptx-code         Execute generated code');
  console.log('    GET  /api/code-session/:id          Get code session (debug)');
  console.log('');
  console.log('  Quality: Titres=Assertions, Contenu specifique, Pas de bullshit');
  console.log('=====================================================================');
  console.log('');
});

module.exports = app;
