/**
 * Wavestone Presentation Generator v4.0
 * Flow: Form -> Generate Plan + HTML Slides -> Preview + Chatbot -> Export PDF
 * (Plan phase is internal — no user-facing plan review step)
 */

// ==========================================
// STATE
// ==========================================

let currentPlan = null;
let slidesHtml = [];        // Array of HTML strings
let currentSlideIndex = 0;
let isLoading = false;
let currentLanguage = 'fr';
let clientContext = {};
let chatHistory = {};        // Per-slide chat history: { slideIndex: [{role, content}] }

// PPTX Chat state
let pptxGeneratedCode = '';
let pptxCodeSessionId = null;
let pptxSlideCount = 0;

// Direct editing state
let currentScale = 1;
let editState = 'idle'; // 'idle' | 'selected' | 'editing'
let selectedElement = null;
let editingElement = null;

// Drag
let isDragging = false;
let dragTarget = null;
let dragStartX = 0, dragStartY = 0;
let dragOrigX = 0, dragOrigY = 0;
let dragIsAbsolute = false;
let dragPending = false;
let dragPendingTarget = null;
let dragPendingStartX = 0, dragPendingStartY = 0;
const DRAG_THRESHOLD = 3; // px before drag starts

// Resize
let isResizing = false;
let resizeTarget = null;
let resizeHandle = '';
let resizeStartX = 0, resizeStartY = 0;
let resizeOrigRect = null;

let undoStack = [];
let redoStack = [];

// ==========================================
// EDITING SELECTORS
// ==========================================

const EDITABLE_TEXT_SELECTORS = [
    '.slide-title', '.slide-subtitle',
    '.kpi-value', '.kpi-unit', '.kpi-label', '.kpi-trend',
    '.step-title', '.step-desc', '.step-number',
    '.card-title', '.card-desc',
    '.comparison-header', '.comparison-column li',
    '.quote-text', '.quote-author', '.quote-role',
    '.timeline-date', '.timeline-label', '.timeline-desc',
    '.callout',
    '.header-bar-left', '.header-bar-right',
    '.slide-footer',
    '.slide-bullets li', '.slide-list li',
    '.slide-table td', '.slide-table th',
    '.section-number',
];

const DRAGGABLE_SELECTORS = [
    // Existing
    '.kpi-card', '.icon-card', '.process-step',
    '.comparison-column', '.callout', '.quote-block',
    '.timeline-item', '.slide-sticker',
    // V2: complete containers
    '.slide-table',
    '.kpi-grid', '.card-grid',
    '.process-flow', '.comparison-grid', '.timeline',
    '.slide-bullets', '.slide-list',
    // V2: manually added elements
    '.slide-added',
];

// ==========================================
// DOM ELEMENTS
// ==========================================

const form = document.getElementById('generateForm');
const btnHtml = document.getElementById('btnHtml');
const btnPptx = document.getElementById('btnPptx');
const formSection = document.getElementById('formSection');
const previewSection = document.getElementById('previewSection');
const successSection = document.getElementById('successSection');
const progressPanel = document.getElementById('progressPanel');
const progressPanelContent = document.getElementById('progressPanelContent');
const progressPanelActive = document.getElementById('progressPanelActive');
const progressPanelPptx = document.getElementById('progressPanelPptx');
const errorSection = document.getElementById('errorSection');
// PPTX Chat elements - create dynamically if not exists
function getPptxChatElements() {
    let section = document.getElementById('pptxChatSection');
    let messages, actions;

    // Create the chat interface if it doesn't exist
    if (!section) {
        section = document.createElement('section');
        section.id = 'pptxChatSection';
        section.className = 'pptx-chat-section';
        section.style.display = 'none';
        section.innerHTML = `
            <div class="pptx-chat-container">
                <div class="pptx-chat-header">
                    <button type="button" class="btn-back" onclick="backToFormFromChat()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Retour
                    </button>
                    <h2>Génération PowerPoint</h2>
                    <div class="pptx-chat-actions" id="pptxChatActions" style="display: none;">
                        <button type="button" class="btn-secondary" onclick="copyGeneratedCode()" id="copyCodeBtn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                            Copier le code
                        </button>
                        <button type="button" class="btn-primary" onclick="downloadPptxFromCode()" id="downloadPptxBtnChat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Télécharger PPTX
                        </button>
                    </div>
                </div>
                <div class="pptx-chat-messages" id="pptxChatMessages"></div>
            </div>
        `;
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.appendChild(section);
        }
    }

    // Get elements from within the section (more reliable)
    messages = section.querySelector('#pptxChatMessages') || section.querySelector('.pptx-chat-messages');
    actions = section.querySelector('#pptxChatActions') || section.querySelector('.pptx-chat-actions');

    return { section, messages, actions };
}

// Track current generation mode
let currentMode = null; // 'html' or 'pptx'

// ==========================================
// INITIALIZATION
// ==========================================

async function init() {
    // Form submit is now handled by the two mode buttons
    form.addEventListener('submit', (e) => e.preventDefault());

    // Mode button handlers
    btnHtml.addEventListener('click', () => handleModeClick('html'));
    btnPptx.addEventListener('click', () => handleModeClick('pptx'));

    document.addEventListener('keydown', handleKeydown);
    initEditingListeners();
}

// ==========================================
// FORM HANDLING
// ==========================================

function handleModeClick(mode) {
    if (isLoading) return;

    const formData = new FormData(form);
    clientContext = {};

    const data = {
        prompt: formData.get('prompt').trim(),
        slideCount: parseInt(formData.get('slideCount'), 10),
        language: formData.get('language'),
        deckType: formData.get('deckType'),
    };

    if (!data.prompt) {
        showError('Veuillez entrer une description.');
        return;
    }

    currentLanguage = data.language;
    currentMode = mode;

    if (mode === 'html') {
        generatePresentation(data);
    } else if (mode === 'pptx') {
        generatePptxDirect(data);
    }
}

// ==========================================
// GENERATION: Plan + Slides in one flow
// ==========================================

async function generatePresentation(data) {
    setLoading(true, 'Connexion au serveur...');

    try {
        // Step 1: Initialize a session with POST (avoids URL length limits)
        const initResponse = await fetch('/api/generate-stream/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: data.prompt,
                slideCount: data.slideCount,
                language: data.language,
                deckType: data.deckType,
            }),
        });

        if (!initResponse.ok) {
            const errData = await initResponse.json().catch(() => ({}));
            throw new Error(errData.message || 'Erreur lors de l\'initialisation.');
        }

        const { sessionId } = await initResponse.json();

        // Step 2: Connect to SSE with just the session ID
        const eventSource = new EventSource(`/api/generate-stream?sessionId=${sessionId}`);

        let lastThinkingTime = 0;
        const THINKING_THROTTLE = 100; // ms between thinking updates

        eventSource.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);

                switch (msg.type) {
                    case 'phase':
                        setLoadingMessage(msg.message);
                        addProgressLog(msg.message);
                        break;

                    case 'thinking':
                        // Throttle thinking updates to avoid overwhelming the UI
                        const now = Date.now();
                        if (now - lastThinkingTime > THINKING_THROTTLE) {
                            updateThinkingDisplay(msg.content);
                            lastThinkingTime = now;
                        }
                        break;

                    case 'plan_complete':
                        currentPlan = msg.plan;
                        addProgressLog(`✓ ${msg.message}`);
                        clearThinkingDisplay();
                        break;

                    case 'slide_progress':
                        handleSlideProgress(msg);
                        break;

                    case 'complete':
                        eventSource.close();
                        slidesHtml = msg.slides;
                        chatHistory = {};
                        currentSlideIndex = 0;
                        addProgressLog('✓ ' + msg.message);
                        clearThinkingDisplay();
                        showPreview();
                        setLoading(false);
                        break;

                    case 'error':
                        eventSource.close();
                        showError(msg.message);
                        setLoading(false);
                        break;
                }
            } catch (e) {
                console.error('Error parsing SSE message:', e);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            eventSource.close();
            showError('Connexion perdue. Veuillez réessayer.');
            setLoading(false);
        };

    } catch (error) {
        console.error('Error generating presentation:', error);
        showError(error.message);
        setLoading(false);
    }
}

// ==========================================
// PPTX DIRECT GENERATION - CHAT INTERFACE
// ==========================================

async function generatePptxDirect(data) {
    // Reset state
    pptxGeneratedCode = '';
    pptxCodeSessionId = null;
    pptxSlideCount = 0;

    // Ensure chat elements exist first
    const chatElements = getPptxChatElements();

    // Show chat interface
    showSection('pptxChatSection');

    // Clear previous content
    if (chatElements.messages) chatElements.messages.innerHTML = '';
    if (chatElements.actions) chatElements.actions.style.display = 'none';

    // Add initial user message
    addChatMessage('user', `Génère une présentation PowerPoint : "${data.prompt}" (${data.slideCount} slides, ${data.language === 'fr' ? 'français' : 'anglais'})`);

    // Add loading message
    const loadingMsgId = addChatMessage('assistant', '<span class="chat-spinner">Connexion au serveur...</span>', 'phase');

    try {
        // Step 1: Initialize a session with POST
        const initResponse = await fetch('/api/generate-pptx-stream/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: data.prompt,
                slideCount: data.slideCount,
                language: data.language,
                deckType: data.deckType,
            }),
        });

        if (!initResponse.ok) {
            const errData = await initResponse.json().catch(() => ({}));
            throw new Error(errData.message || 'Erreur lors de l\'initialisation.');
        }

        const { sessionId } = await initResponse.json();

        // Update loading message
        updateChatMessage(loadingMsgId, '<span class="chat-spinner">Analyse de votre demande...</span>');

        // Step 2: Connect to SSE with preview mode
        const eventSource = new EventSource(`/api/generate-pptx-stream?sessionId=${sessionId}&previewOnly=true`);

        let currentThinkingMsgId = null;
        let thinkingBuffer = '';
        let codeMsgId = null;

        eventSource.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);

                switch (msg.type) {
                    case 'phase':
                        // Remove loading message on first phase
                        removeChatMessage(loadingMsgId);
                        addChatMessage('assistant', msg.message, 'phase');
                        break;

                    case 'thinking':
                        // Accumulate thinking and show in a single message
                        thinkingBuffer += msg.content + ' ';
                        if (!currentThinkingMsgId) {
                            currentThinkingMsgId = addChatMessage('assistant', thinkingBuffer, 'thinking');
                        } else {
                            updateChatMessage(currentThinkingMsgId, thinkingBuffer + '<span class="streaming-indicator"></span>');
                        }
                        scrollChatToBottom();
                        break;

                    case 'plan_complete':
                        // Finalize thinking
                        if (currentThinkingMsgId) {
                            updateChatMessage(currentThinkingMsgId, thinkingBuffer);
                            currentThinkingMsgId = null;
                            thinkingBuffer = '';
                        }
                        currentPlan = msg.plan;
                        addChatMessage('assistant', `Plan créé : ${msg.plan.slides.length} slides`, 'complete');
                        break;

                    case 'code_chunk':
                        // Add code to buffer
                        pptxGeneratedCode += msg.content;
                        // Create or update code message
                        if (!codeMsgId) {
                            codeMsgId = addCodeMessage(pptxGeneratedCode);
                        } else {
                            updateCodeMessage(codeMsgId, pptxGeneratedCode);
                        }
                        break;

                    case 'progress':
                        // Show progress updates as phase messages
                        if (msg.step === 'slide' || msg.step === 'code_start') {
                            // Don't spam with every slide
                        } else if (msg.step === 'warning') {
                            addChatMessage('assistant', msg.message, 'error');
                        }
                        break;

                    case 'code_complete':
                        // Store session ID
                        pptxCodeSessionId = msg.codeSessionId;
                        pptxSlideCount = msg.slideCount;
                        break;

                    case 'preview_ready':
                        eventSource.close();
                        // Show action buttons
                        const { actions } = getPptxChatElements();
                        if (actions) actions.style.display = 'flex';
                        addChatMessage('assistant', `Code JavaScript généré avec succès (${msg.slideCount} slides). Vous pouvez copier le code ou télécharger le fichier PPTX.`, 'complete');
                        scrollChatToBottom();
                        break;

                    case 'complete':
                        eventSource.close();
                        // Direct download mode (shouldn't happen in preview mode)
                        downloadPptxFromBase64(msg.pptxBase64, msg.filename);
                        addChatMessage('assistant', `Fichier téléchargé : ${msg.filename}`, 'complete');
                        break;

                    case 'error':
                        eventSource.close();
                        addChatMessage('assistant', msg.message, 'error');
                        break;
                }
            } catch (e) {
                console.error('Error parsing SSE message:', e);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            eventSource.close();
            addChatMessage('assistant', 'Connexion perdue. Veuillez réessayer.', 'error');
        };

    } catch (error) {
        console.error('Error generating PPTX Direct:', error);
        addChatMessage('assistant', error.message, 'error');
    }
}

// Chat message helpers
function addChatMessage(role, content, type = '') {
    const { messages: pptxChatMessages } = getPptxChatElements();
    if (!pptxChatMessages) {
        console.error('pptxChatMessages element not found');
        return null;
    }

    const msgId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const msg = document.createElement('div');
    msg.id = msgId;
    msg.className = `chat-message ${type}`;

    const icon = role === 'user' ?
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' :
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

    msg.innerHTML = `
        <div class="chat-message-header">
            ${icon}
            <span>${role === 'user' ? 'Vous' : 'Assistant'}</span>
        </div>
        <div class="chat-message-content">${content}</div>
    `;

    pptxChatMessages.appendChild(msg);
    scrollChatToBottom();
    return msgId;
}

function updateChatMessage(msgId, content) {
    const msg = document.getElementById(msgId);
    if (msg) {
        const contentEl = msg.querySelector('.chat-message-content');
        if (contentEl) {
            contentEl.innerHTML = content;
        }
    }
}

function removeChatMessage(msgId) {
    const msg = document.getElementById(msgId);
    if (msg) {
        msg.remove();
    }
}

function addCodeMessage(code) {
    const { messages: pptxChatMessages } = getPptxChatElements();
    if (!pptxChatMessages) {
        console.error('pptxChatMessages element not found');
        return null;
    }

    const msgId = 'code-' + Date.now();
    const msg = document.createElement('div');
    msg.id = msgId;
    msg.className = 'chat-message code';

    msg.innerHTML = `
        <div class="chat-message-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            <span>Code JavaScript (pptxgenjs)</span>
        </div>
        <div class="chat-message-content">
            <div class="chat-code-header">
                <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    presentation.js
                </span>
                <button class="chat-code-copy" onclick="copyCodeFromMessage('${msgId}')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copier
                </button>
            </div>
            <pre class="chat-code-block">${escapeHtml(code)}</pre>
        </div>
    `;

    pptxChatMessages.appendChild(msg);
    scrollChatToBottom();
    return msgId;
}

function updateCodeMessage(msgId, code) {
    const msg = document.getElementById(msgId);
    if (msg) {
        const codeBlock = msg.querySelector('.chat-code-block');
        if (codeBlock) {
            codeBlock.textContent = code;
            codeBlock.scrollTop = codeBlock.scrollHeight;
        }
    }
}

function scrollChatToBottom() {
    const { messages: pptxChatMessages } = getPptxChatElements();
    if (pptxChatMessages) {
        pptxChatMessages.scrollTop = pptxChatMessages.scrollHeight;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyCodeFromMessage(msgId) {
    const msg = document.getElementById(msgId);
    if (msg) {
        const codeBlock = msg.querySelector('.chat-code-block');
        if (codeBlock) {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                const btn = msg.querySelector('.chat-code-copy');
                if (btn) {
                    btn.classList.add('copied');
                    btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copié !';
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copier';
                    }, 2000);
                }
            });
        }
    }
}

function copyGeneratedCode() {
    if (pptxGeneratedCode) {
        navigator.clipboard.writeText(pptxGeneratedCode).then(() => {
            const btn = document.getElementById('copyCodeBtn');
            if (btn) {
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copié !';
                setTimeout(() => {
                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copier le code';
                }, 2000);
            }
        });
    }
}

async function downloadPptxFromCode() {
    if (!pptxCodeSessionId) {
        addChatMessage('assistant', 'Erreur: pas de code généré à exécuter.', 'error');
        return;
    }

    const btn = document.getElementById('downloadPptxBtnChat');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner spinner-small"></span> Création du fichier...';
    }

    addChatMessage('assistant', '<span class="chat-spinner">Création du fichier PowerPoint...</span>', 'phase');

    try {
        const response = await fetch('/api/execute-pptx-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codeSessionId: pptxCodeSessionId })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Erreur lors de la création du PPTX');
        }

        // Get filename from Content-Disposition header
        const disposition = response.headers.get('Content-Disposition');
        let filename = 'presentation.pptx';
        if (disposition) {
            const match = disposition.match(/filename="?([^"]+)"?/);
            if (match) filename = match[1];
        }

        // Download the file
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        addChatMessage('assistant', `Fichier "${filename}" téléchargé avec succès !`, 'complete');

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Téléchargé !';
            setTimeout(() => {
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Télécharger PPTX';
            }, 3000);
        }

    } catch (error) {
        console.error('Error downloading PPTX:', error);
        addChatMessage('assistant', error.message, 'error');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Réessayer';
        }
    }
}

function backToFormFromChat() {
    showSection('formSection');
    // Reset chat state
    pptxGeneratedCode = '';
    pptxCodeSessionId = null;
    pptxSlideCount = 0;
}

function setLoadingPptx(loading, message = 'Chargement...') {
    isLoading = loading;

    // Update button states
    const btnHtmlLoading = btnHtml.querySelector('.btn-mode-loading');
    const btnPptxLoading = btnPptx.querySelector('.btn-mode-loading');
    const btnHtmlLabel = btnHtml.querySelector('.btn-mode-label');
    const btnPptxLabel = btnPptx.querySelector('.btn-mode-label');

    if (loading) {
        btnPptxLoading.style.display = 'flex';
        btnPptxLabel.style.display = 'none';
        btnHtml.disabled = true;
        btnPptx.disabled = true;

        // Show PPTX progress panel
        progressPanelContent.style.display = 'none';
        progressPanelActive.style.display = 'none';
        progressPanelPptx.style.display = 'flex';
        document.getElementById('pptxProgressTitle').textContent = message;
        document.getElementById('pptxProgressLog').innerHTML = '';
        document.getElementById('codeStreamDisplay').textContent = '';
        document.getElementById('codeStreamContainer').style.display = 'none';
    } else {
        btnPptxLoading.style.display = 'none';
        btnPptxLabel.style.display = 'flex';
        btnHtml.disabled = false;
        btnPptx.disabled = false;

        // Show idle state
        progressPanelContent.style.display = 'flex';
        progressPanelActive.style.display = 'none';
        progressPanelPptx.style.display = 'none';
    }
}

function setPptxLoadingMessage(message) {
    document.getElementById('pptxProgressTitle').textContent = message;
}

function addPptxProgressLog(message) {
    const log = document.getElementById('pptxProgressLog');
    if (!log) return;

    // Remove thinking display when adding new log item
    const thinkingEl = document.getElementById('pptxThinkingDisplay');
    if (thinkingEl && !message.startsWith('⏳')) {
        thinkingEl.remove();
    }

    const item = document.createElement('div');
    item.className = 'progress-log-item';
    if (message.startsWith('✓')) {
        item.classList.add('completed');
    }
    item.textContent = message;
    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
}

function updatePptxThinkingDisplay(content) {
    let thinkingEl = document.getElementById('pptxThinkingDisplay');
    if (!thinkingEl) {
        const log = document.getElementById('pptxProgressLog');
        if (!log) return;
        thinkingEl = document.createElement('div');
        thinkingEl.id = 'pptxThinkingDisplay';
        thinkingEl.className = 'thinking-display';
        log.appendChild(thinkingEl);
    }

    const currentText = thinkingEl.textContent || '';
    const newText = currentText + ' ' + content;
    thinkingEl.textContent = newText.length > 500 ? '...' + newText.slice(-500) : newText;

    const log = document.getElementById('pptxProgressLog');
    if (log) log.scrollTop = log.scrollHeight;
}

function clearPptxThinkingDisplay() {
    const thinkingEl = document.getElementById('pptxThinkingDisplay');
    if (thinkingEl) {
        thinkingEl.remove();
    }
}

function updatePptxProgressBar(current, total) {
    let progressBar = document.getElementById('pptxProgressBar');
    if (!progressBar) {
        // Create progress bar if it doesn't exist
        const container = document.getElementById('pptxProgressLog');
        if (!container) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'pptx-progress-bar-wrapper';
        wrapper.innerHTML = `
            <div class="pptx-progress-bar-bg">
                <div id="pptxProgressBar" class="pptx-progress-bar-fill"></div>
            </div>
            <span id="pptxProgressText" class="pptx-progress-text">0/${total}</span>
        `;
        container.parentNode.insertBefore(wrapper, container);
        progressBar = document.getElementById('pptxProgressBar');
    }

    const percent = Math.round((current / total) * 100);
    progressBar.style.width = `${percent}%`;

    const progressText = document.getElementById('pptxProgressText');
    if (progressText) {
        progressText.textContent = `${current}/${total} slides`;
    }
}

function showCodeStream() {
    const container = document.getElementById('codeStreamContainer');
    if (container) {
        container.style.display = 'block';
    }
}

function appendCodeChunk(chunk) {
    const display = document.getElementById('codeStreamDisplay');
    if (display) {
        display.textContent += chunk;
        display.scrollTop = display.scrollHeight;
    }
}

function showDownloadButton(codeSessionId, slideCount) {
    // Remove spinner from PPTX progress panel
    const spinner = document.querySelector('#progressPanelPptx .progress-spinner-small');
    if (spinner) {
        spinner.style.display = 'none';
    }

    // Create download button container
    const container = document.getElementById('codeStreamContainer');
    if (!container) return;

    // Check if button already exists
    if (document.getElementById('downloadPptxBtn')) return;

    // Create button container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'download-btn-container';
    btnContainer.style.cssText = 'padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;';

    // Create download button
    const btn = document.createElement('button');
    btn.id = 'downloadPptxBtn';
    btn.className = 'btn-primary';
    btn.style.cssText = 'padding: 12px 32px; font-size: 16px; cursor: pointer; background: #451DC7; color: white; border: none; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px;';
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Télécharger PPTX (${slideCount} slides)
    `;

    btn.onclick = async () => {
        btn.disabled = true;
        btn.innerHTML = `
            <span class="spinner spinner-small"></span>
            Création du fichier...
        `;

        try {
            const response = await fetch('/api/execute-pptx-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codeSessionId: codeSessionId })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Erreur lors de la création du PPTX');
            }

            // Get filename from Content-Disposition header
            const disposition = response.headers.get('Content-Disposition');
            let filename = 'presentation.pptx';
            if (disposition) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match) filename = match[1];
            }

            // Download the file
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Show success
            addPptxProgressLog('✓ Fichier téléchargé !');
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Téléchargé !
            `;
            btn.style.background = '#04F06A';
            btn.style.color = '#000';

            // Reset after delay
            setTimeout(() => {
                setLoadingPptx(false);
                showPptxSuccess(filename, slideCount);
            }, 1500);

        } catch (error) {
            console.error('Error downloading PPTX:', error);
            btn.disabled = false;
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Erreur - Réessayer
            `;
            btn.style.background = '#dc2626';
            addPptxProgressLog(`❌ ${error.message}`);
        }
    };

    btnContainer.appendChild(btn);
    container.appendChild(btnContainer);

    // Re-enable form buttons
    btnHtml.disabled = false;
    btnPptx.disabled = false;
    const btnPptxLoading = btnPptx.querySelector('.btn-mode-loading');
    const btnPptxLabel = btnPptx.querySelector('.btn-mode-label');
    if (btnPptxLoading) btnPptxLoading.style.display = 'none';
    if (btnPptxLabel) btnPptxLabel.style.display = 'flex';
}

function downloadPptxFromBase64(base64Data, filename) {
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'presentation.pptx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function showPptxSuccess(filename, slideCount) {
    document.getElementById('successDetails').textContent =
        `Fichier "${filename}" téléchargé (${slideCount} slides).`;
    showSection('successSection');
}

function handleSlideProgress(msg) {
    const { slideNumber, totalSlides, slideType, status, message, thinking } = msg;

    if (status === 'generating') {
        setLoadingMessage(`Slide ${slideNumber}/${totalSlides}`);
        addProgressLog(`⏳ ${message}`);
    } else if (status === 'thinking' && thinking) {
        updateThinkingDisplay(thinking);
    } else if (status === 'complete') {
        // Mark the last generating item as complete
        markLastProgressComplete();
    } else if (status === 'error') {
        addProgressLog(`⚠️ ${message}`);
    }
}

function updateThinkingDisplay(content) {
    let thinkingEl = document.getElementById('thinkingDisplay');
    if (!thinkingEl) {
        const log = document.getElementById('progressLog');
        if (!log) return;
        thinkingEl = document.createElement('div');
        thinkingEl.id = 'thinkingDisplay';
        thinkingEl.className = 'thinking-display';
        log.appendChild(thinkingEl);
    }

    // Append new content, keeping last ~500 chars visible
    const currentText = thinkingEl.textContent || '';
    const newText = currentText + ' ' + content;
    thinkingEl.textContent = newText.length > 500 ? '...' + newText.slice(-500) : newText;

    // Scroll to bottom
    const log = document.getElementById('progressLog');
    if (log) log.scrollTop = log.scrollHeight;
}

function clearThinkingDisplay() {
    const thinkingEl = document.getElementById('thinkingDisplay');
    if (thinkingEl) {
        thinkingEl.remove();
    }
}

function markLastProgressComplete() {
    const log = document.getElementById('progressLog');
    if (!log) return;

    const items = log.querySelectorAll('.progress-log-item');
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (item.textContent.startsWith('⏳')) {
            item.textContent = item.textContent.replace('⏳', '✓');
            item.classList.add('completed');
            break;
        }
    }
}

// ==========================================
// UI STATE
// ==========================================

function setLoading(loading, message = 'Chargement...') {
    isLoading = loading;

    // Update button states
    const btnHtmlLoading = btnHtml.querySelector('.btn-mode-loading');
    const btnHtmlLabel = btnHtml.querySelector('.btn-mode-label');

    if (loading) {
        btnHtmlLoading.style.display = 'flex';
        btnHtmlLabel.style.display = 'none';
        btnHtml.disabled = true;
        btnPptx.disabled = true;

        // Show active progress panel
        progressPanelContent.style.display = 'none';
        progressPanelActive.style.display = 'flex';
        progressPanelPptx.style.display = 'none';
        document.getElementById('progressTitle').textContent = message;
        document.getElementById('progressLog').innerHTML = '';
    } else {
        btnHtmlLoading.style.display = 'none';
        btnHtmlLabel.style.display = 'flex';
        btnHtml.disabled = false;
        btnPptx.disabled = false;

        // Show idle state
        progressPanelContent.style.display = 'flex';
        progressPanelActive.style.display = 'none';
        progressPanelPptx.style.display = 'none';
    }
}

function setLoadingMessage(message) {
    document.getElementById('progressTitle').textContent = message;
}

function addProgressLog(message) {
    const log = document.getElementById('progressLog');
    if (!log) return;

    // Remove thinking display when adding new log item
    const thinkingEl = document.getElementById('thinkingDisplay');
    if (thinkingEl && !message.startsWith('⏳')) {
        thinkingEl.remove();
    }

    // Add new item
    const item = document.createElement('div');
    item.className = 'progress-log-item';
    if (message.startsWith('✓')) {
        item.classList.add('completed');
    }
    item.textContent = message;
    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
}

function showError(message) {
    errorSection.style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
}

function hideError() {
    errorSection.style.display = 'none';
}

function showSection(sectionId) {
    const mainContent = document.getElementById('mainContent');
    const { section: pptxChatSection } = getPptxChatElements();

    [formSection, previewSection, successSection, pptxChatSection].forEach(s => {
        if (s) s.style.display = 'none';
    });

    const section = document.getElementById(sectionId);
    if (sectionId === 'formSection') {
        section.style.display = 'flex';
        mainContent.classList.remove('editor-mode');
    } else if (sectionId === 'previewSection') {
        section.style.display = 'block';
        mainContent.classList.add('editor-mode');
    } else if (sectionId === 'successSection') {
        section.style.display = 'flex';
        mainContent.classList.remove('editor-mode');
    } else if (sectionId === 'pptxChatSection') {
        section.style.display = 'flex';
        mainContent.classList.remove('editor-mode');
    }
}

function backToForm() {
    showSection('formSection');
}

function resetAll() {
    currentPlan = null;
    slidesHtml = [];
    currentSlideIndex = 0;
    chatHistory = {};
    form.reset();
    showSection('formSection');
}

// ==========================================
// PREVIEW: RENDERING
// ==========================================

function showPreview() {
    showSection('previewSection');
    renderThumbnails();

    // Wait for the browser to reflow after display change
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scaleSlideViewport();
            goToSlide(0);
        });
    });
    window.addEventListener('resize', scaleSlideViewport);
}

function renderCurrentSlide(skipEnhance = false) {
    const viewport = document.getElementById('slideViewportInner');
    viewport.innerHTML = slidesHtml[currentSlideIndex] || '<div class="slide"><p>Slide vide</p></div>';

    // Update counter
    document.getElementById('slideCounter').textContent = `${currentSlideIndex + 1} / ${slidesHtml.length}`;

    // Update nav buttons
    document.getElementById('prevSlideBtn').disabled = currentSlideIndex === 0;
    document.getElementById('nextSlideBtn').disabled = currentSlideIndex === slidesHtml.length - 1;

    // Update active thumbnail
    document.querySelectorAll('.thumbnail-item').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentSlideIndex);
    });

    if (!skipEnhance) {
        // Wait for layout to complete before flattening
        // Use setTimeout to ensure CSS flexbox/grid has finished layout
        setTimeout(() => {
            requestAnimationFrame(() => {
                enhanceSlideForEditing();
            });
        }, 50);
    }
}

function scaleSlideViewport() {
    const viewport = document.getElementById('slideViewport');
    const inner = document.getElementById('slideViewportInner');
    if (!viewport || !inner) return;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;

    // Guard: if layout hasn't computed yet, retry
    if (vw === 0 || vh === 0) {
        requestAnimationFrame(scaleSlideViewport);
        return;
    }

    // 20px padding on each side (matches CSS)
    const pad = 20;
    const availW = vw - pad * 2;
    const availH = vh - pad * 2;

    // Calculate scale to fit slide (960x540) within available space
    const scaleX = availW / 960;
    const scaleY = availH / 540;
    // Allow scaling up to 1 (100%), but scale down if needed
    const scale = Math.min(scaleX, scaleY, 1);
    currentScale = scale;

    // Apply transform scale centered
    inner.style.transform = `scale(${scale})`;
    inner.style.transformOrigin = 'center center';

    // Center the slide in the viewport
    inner.style.position = 'absolute';
    inner.style.left = '50%';
    inner.style.top = '50%';
    inner.style.marginLeft = `-${960 / 2}px`;
    inner.style.marginTop = `-${540 / 2}px`;
}

// ==========================================
// PREVIEW: NAVIGATION
// ==========================================

function goToSlide(index) {
    if (index < 0 || index >= slidesHtml.length) return;
    deselectElement();
    // Save any in-progress edits on the current slide before navigating
    if (slidesHtml.length > 0) serializeSlide();
    currentSlideIndex = index;
    renderCurrentSlide();
    scaleSlideViewport();
}

function prevSlide() {
    goToSlide(currentSlideIndex - 1);
}

function nextSlide() {
    goToSlide(currentSlideIndex + 1);
}

function handleKeydown(event) {
    // Only handle keyboard nav when preview is visible
    if (previewSection.style.display === 'none') return;
    // Don't intercept when typing in inputs
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

    // Keyboard shortcuts with Ctrl/Cmd
    const isMod = event.ctrlKey || event.metaKey;

    if (isMod) {
        switch (event.key.toLowerCase()) {
            case 'z':
                event.preventDefault();
                if (event.shiftKey) {
                    redo();
                } else {
                    undo();
                }
                return;
            case 'y':
                event.preventDefault();
                redo();
                return;
            case 'b':
                if (editState === 'editing') {
                    event.preventDefault();
                    formatBold();
                }
                return;
            case 'i':
                if (editState === 'editing') {
                    event.preventDefault();
                    formatItalic();
                }
                return;
            case 'u':
                if (editState === 'editing') {
                    event.preventDefault();
                    formatUnderline();
                }
                return;
            case 'd':
                if (selectedElement) {
                    event.preventDefault();
                    duplicateSelected();
                }
                return;
        }
    }

    // In editing mode, let contenteditable handle everything except Escape
    if (editState === 'editing') {
        if (event.key === 'Escape') {
            event.preventDefault();
            exitEditMode();
        }
        return;
    }

    if (event.key === 'Escape') {
        deselectElement();
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedElement) {
            event.preventDefault();
            deleteSelected();
        }
    } else if (event.key === 'ArrowLeft' && !selectedElement) {
        prevSlide();
    } else if (event.key === 'ArrowRight' && !selectedElement) {
        nextSlide();
    }
}

// ==========================================
// PREVIEW: THUMBNAILS
// ==========================================

function renderThumbnails() {
    const container = document.getElementById('slideThumbnails');
    container.innerHTML = '';

    slidesHtml.forEach((html, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail-item' + (index === currentSlideIndex ? ' active' : '');
        thumb.onclick = () => goToSlide(index);

        // Use a wrapper with overflow hidden for the scaled slide
        thumb.innerHTML = `
            <div class="thumbnail-inner">${html}</div>
            <span class="thumbnail-number">${index + 1}</span>
        `;
        container.appendChild(thumb);
    });
}

function updateAllThumbnails() {
    slidesHtml.forEach((_, index) => {
        updateThumbnail(index);
    });
}

// ==========================================
// CHATBOT
// ==========================================

function handleChatKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message || isLoading) return;

    // Save any in-progress direct edits before chatbot modifies the slide
    deselectElement();
    serializeSlide();

    const sendBtn = document.getElementById('chatSendBtn');
    sendBtn.disabled = true;
    input.disabled = true;

    // Add user message to chat
    addChatMessage('user', message);
    input.value = '';

    // Initialize chat history for this slide if needed
    if (!chatHistory[currentSlideIndex]) chatHistory[currentSlideIndex] = [];
    chatHistory[currentSlideIndex].push({ role: 'user', content: message });

    try {
        const response = await fetch('/api/modify-slide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentHtml: slidesHtml[currentSlideIndex],
                instruction: message,
                context: {
                    deckTitle: currentPlan?.deck_title || '',
                    clientContext: clientContext.clientContext || '',
                },
            }),
        });

        if (!response.ok) throw new Error('Erreur modification');

        const result = await response.json();
        if (result.success && result.html) {
            // Update the slide
            slidesHtml[currentSlideIndex] = result.html;
            renderCurrentSlide();
            updateThumbnail(currentSlideIndex);
            addChatMessage('system', 'Slide mise a jour !');

            chatHistory[currentSlideIndex].push({
                role: 'assistant',
                content: 'Slide modifiee selon vos instructions.',
            });
        }
    } catch (error) {
        console.error('Chat error:', error);
        addChatMessage('assistant', 'Erreur: impossible de modifier la slide. Reessayez.');
    } finally {
        sendBtn.disabled = false;
        input.disabled = false;
        input.focus();
    }
}

function addChatMessage(role, content) {
    const container = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = `chat-message ${role}`;
    msg.textContent = content;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function updateThumbnail(index) {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    if (thumbnails[index]) {
        const inner = thumbnails[index].querySelector('.thumbnail-inner');
        if (inner) inner.innerHTML = slidesHtml[index];
    }
}

// ==========================================
// PDF EXPORT
// ==========================================

async function exportPdf() {
    if (!slidesHtml || slidesHtml.length === 0) {
        alert('Aucune slide a exporter.');
        return;
    }

    const btn = document.getElementById('exportPdfBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');

    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    btn.disabled = true;

    try {
        const response = await fetch('/api/export-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slides: slidesHtml }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Erreur export PDF');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(currentPlan?.deck_title || 'presentation').replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, '').replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Export error:', error);
        alert('Erreur export PDF: ' + error.message);
    } finally {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        btn.disabled = false;
    }
}

// ==========================================
// PPTX EXPORT
// ==========================================

async function exportPptx() {
    if (!slidesHtml || slidesHtml.length === 0) {
        alert('Aucune slide a exporter.');
        return;
    }

    const btn = document.getElementById('exportPptxBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');

    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    btn.disabled = true;

    try {
        const response = await fetch('/api/export-pptx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slides: slidesHtml }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Erreur export PPTX');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(currentPlan?.deck_title || 'presentation').replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, '').replace(/\s+/g, '_')}.pptx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Export PPTX error:', error);
        alert('Erreur export PPTX: ' + error.message);
    } finally {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        btn.disabled = false;
    }
}

// ==========================================
// DIRECT EDITING (text + drag)
// ==========================================

// Elements that should be flattened (extracted from containers)
const FLATTEN_SELECTORS = [
    '.kpi-card', '.icon-card', '.process-step',
    '.comparison-column', '.callout', '.quote-block',
    '.timeline-item', '.slide-sticker',
    '.slide-table', '.card-item',
    '.slide-title', '.slide-subtitle',
    '.slide-bullets', '.slide-list',
];

// Containers that should be removed after flattening
const CONTAINER_SELECTORS = [
    '.kpi-grid', '.card-grid', '.process-flow',
    '.comparison-grid', '.timeline', '.icon-grid',
];

// Elements to never flatten (keep in place)
const PRESERVE_SELECTORS = [
    '.header-bar', '.slide-footer', '.section-number',
    '.slide-bg', '.slide-background',
];

function flattenSlideForEditing() {
    const viewport = document.getElementById('slideViewportInner');
    if (!viewport) return;

    const slide = viewport.querySelector('.slide');
    if (!slide) return;

    const slideRect = slide.getBoundingClientRect();

    // Skip if slide has no dimensions yet (not rendered)
    if (slideRect.width === 0 || slideRect.height === 0) return;

    // Calculate actual scale from rendered dimensions
    // The slide is always 960x540 in CSS, so we can derive scale from actual rendered size
    const scale = slideRect.width / 960;
    if (scale <= 0) return;

    // STEP 1: Collect all elements and their positions BEFORE any DOM changes
    const elementsData = [];

    FLATTEN_SELECTORS.forEach(selector => {
        slide.querySelectorAll(selector).forEach(el => {
            // Skip if already direct child of slide
            if (el.parentElement === slide) return;
            // Skip if inside a preserved element
            if (el.closest(PRESERVE_SELECTORS.join(','))) return;
            // Skip if already processed
            if (el.hasAttribute('data-flattened')) return;

            const elRect = el.getBoundingClientRect();

            // Calculate position relative to slide
            elementsData.push({
                element: el,
                top: Math.round((elRect.top - slideRect.top) / scale),
                left: Math.round((elRect.left - slideRect.left) / scale),
                width: Math.round(elRect.width / scale),
                height: Math.round(elRect.height / scale),
            });
        });
    });

    // STEP 2: Now remove all elements from their containers
    elementsData.forEach(data => {
        data.element.remove();
    });

    // STEP 3: Remove empty containers
    CONTAINER_SELECTORS.forEach(selector => {
        slide.querySelectorAll(selector).forEach(container => {
            container.remove();
        });
    });

    // STEP 4: Add all elements back to slide with absolute positioning
    elementsData.forEach(data => {
        const el = data.element;

        el.setAttribute('data-flattened', 'true');
        el.style.position = 'absolute';
        el.style.top = data.top + 'px';
        el.style.left = data.left + 'px';
        el.style.width = data.width + 'px';
        el.style.height = data.height + 'px';
        el.style.margin = '0';
        el.style.transform = '';

        slide.appendChild(el);
    });
}

function enhanceSlideForEditing() {
    const viewport = document.getElementById('slideViewportInner');
    if (!viewport) return;

    // First, flatten the slide structure
    flattenSlideForEditing();

    // Mark text elements as text-editable (NOT contenteditable — that is set only on double-click)
    EDITABLE_TEXT_SELECTORS.forEach(selector => {
        viewport.querySelectorAll(selector).forEach(el => {
            el.setAttribute('data-text-editable', 'true');
            el.classList.add('slide-text-editable');
        });
    });

    // Add draggable to all flattened elements and containers
    DRAGGABLE_SELECTORS.forEach(selector => {
        viewport.querySelectorAll(selector).forEach(el => {
            el.setAttribute('data-draggable', 'true');
            el.classList.add('slide-draggable');
        });
    });

    // Also make all flattened elements draggable
    viewport.querySelectorAll('[data-flattened]').forEach(el => {
        el.setAttribute('data-draggable', 'true');
        el.classList.add('slide-draggable');
    });

    // V2: text content in added elements
    viewport.querySelectorAll('.slide-added-textbox').forEach(el => {
        el.setAttribute('data-text-editable', 'true');
        el.classList.add('slide-text-editable');
    });
    viewport.querySelectorAll('.slide-added.callout span:not(.callout-icon)').forEach(el => {
        el.setAttribute('data-text-editable', 'true');
        el.classList.add('slide-text-editable');
    });
    viewport.querySelectorAll('.slide-added.slide-sticker').forEach(el => {
        el.setAttribute('data-text-editable', 'true');
        el.classList.add('slide-text-editable');
    });
}

function initEditingListeners() {
    const viewport = document.getElementById('slideViewportInner');
    if (!viewport) return;

    // Keyboard handling inside contenteditable (editing mode)
    viewport.addEventListener('keydown', (e) => {
        if (!e.target.hasAttribute('contenteditable')) return;

        // Prevent arrow keys from navigating slides
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.stopPropagation();
        }

        // Enter inserts line break instead of new paragraph
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.execCommand('insertLineBreak');
        }
    }, true);

    // Paste as plain text only (editing mode)
    viewport.addEventListener('paste', (e) => {
        if (!e.target.hasAttribute('contenteditable')) return;
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    }, true);

    // === MOUSEDOWN: selection + drag/resize preparation ===
    viewport.addEventListener('mousedown', (e) => {
        // In editing mode: click inside editing element → let browser handle cursor;
        // click outside → exit edit mode and fall through
        if (editState === 'editing') {
            if (editingElement && (editingElement === e.target || editingElement.contains(e.target))) {
                return; // Let browser handle cursor placement in contenteditable
            }
            exitEditMode();
            // Fall through to process the target below
        }

        // Action buttons: let their onclick handlers fire
        if (e.target.closest('.slide-select-actions')) return;

        // Resize handle
        const handle = e.target.closest('.slide-resize-handle');
        if (handle && selectedElement) {
            e.preventDefault();
            startResize(e, handle);
            return;
        }

        // Find best target: prefer draggable containers, fallback to standalone text
        let target = e.target.closest('[data-draggable], .slide-added');
        if (!target) {
            target = e.target.closest('[data-text-editable]');
        }

        if (target) {
            e.preventDefault();
            if (selectedElement !== target) {
                selectElement(target);
            }
            // Prepare for potential drag (actual drag starts after threshold)
            dragPending = true;
            dragPendingTarget = selectedElement;
            dragPendingStartX = e.clientX;
            dragPendingStartY = e.clientY;
        } else if (e.target.closest('.slide')) {
            deselectElement();
        }
    });

    // === DBLCLICK: enter edit mode ===
    viewport.addEventListener('dblclick', (e) => {
        if (!selectedElement || editState === 'editing') return;

        // Find the text-editable target under the cursor
        let textTarget = e.target.closest('[data-text-editable]');
        // If the selected element itself is text-editable, allow editing it directly
        if (!textTarget && selectedElement.hasAttribute('data-text-editable')) {
            textTarget = selectedElement;
        }

        if (textTarget && (selectedElement === textTarget || selectedElement.contains(textTarget))) {
            e.preventDefault();
            enterEditMode(textTarget);
        }
    });

    // === MOUSEMOVE: drag threshold + drag/resize ===
    document.addEventListener('mousemove', (e) => {
        if (dragPending && dragPendingTarget) {
            const dx = e.clientX - dragPendingStartX;
            const dy = e.clientY - dragPendingStartY;
            if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
                beginDrag();
            }
        }
        if (isDragging) moveDrag(e);
        else if (isResizing) moveResize(e);
    });

    // === MOUSEUP: end drag/resize, cancel pending ===
    document.addEventListener('mouseup', () => {
        dragPending = false;
        dragPendingTarget = null;
        if (isDragging) endDrag();
        else if (isResizing) endResize();
    });
}

// ==========================================
// EDIT MODE (contenteditable on double-click)
// ==========================================

function enterEditMode(el) {
    editingElement = el;
    editState = 'editing';
    el.setAttribute('contenteditable', 'true');
    el.classList.add('slide-editing-text');
    el.focus();

    // Place cursor at end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
}

function exitEditMode() {
    if (!editingElement) return;
    editingElement.removeAttribute('contenteditable');
    editingElement.classList.remove('slide-editing-text');
    editingElement = null;
    editState = selectedElement ? 'selected' : 'idle';
    serializeSlide();
}

// ==========================================
// DRAG: start / move / end
// ==========================================

function beginDrag() {
    const el = dragPendingTarget;
    dragPending = false;
    dragPendingTarget = null;
    if (!el) return;

    isDragging = true;
    dragTarget = el;
    dragTarget.classList.add('slide-dragging');
    const vp = document.getElementById('slideViewportInner');
    if (vp) vp.classList.add('is-dragging');

    // All elements should now be absolute positioned after flattening
    dragIsAbsolute = true;
    dragOrigX = parseFloat(el.style.left) || 0;
    dragOrigY = parseFloat(el.style.top) || 0;

    dragStartX = dragPendingStartX / currentScale;
    dragStartY = dragPendingStartY / currentScale;
}

function moveDrag(e) {
    if (!isDragging || !dragTarget) return;

    const currentX = e.clientX / currentScale;
    const currentY = e.clientY / currentScale;
    const deltaX = currentX - dragStartX;
    const deltaY = currentY - dragStartY;

    dragTarget.style.left = (dragOrigX + deltaX) + 'px';
    dragTarget.style.top = (dragOrigY + deltaY) + 'px';
}

function endDrag() {
    if (!isDragging || !dragTarget) return;

    dragTarget.classList.remove('slide-dragging');
    const vp = document.getElementById('slideViewportInner');
    if (vp) vp.classList.remove('is-dragging');

    isDragging = false;
    dragTarget = null;

    serializeSlide();
}

// ==========================================
// RESIZE: start / move / end
// ==========================================

function startResize(e, handle) {
    isResizing = true;
    resizeTarget = selectedElement;
    resizeHandle = handle.getAttribute('data-resize-handle');

    const vp = document.getElementById('slideViewportInner');
    if (vp) vp.classList.add('is-dragging');
    resizeTarget.classList.add('slide-resizing');

    resizeStartX = e.clientX / currentScale;
    resizeStartY = e.clientY / currentScale;

    resizeOrigRect = {
        top: parseFloat(resizeTarget.style.top) || 0,
        left: parseFloat(resizeTarget.style.left) || 0,
        width: resizeTarget.offsetWidth,
        height: resizeTarget.offsetHeight,
    };
}

function moveResize(e) {
    if (!isResizing || !resizeTarget) return;

    const currentX = e.clientX / currentScale;
    const currentY = e.clientY / currentScale;
    const dX = currentX - resizeStartX;
    const dY = currentY - resizeStartY;

    let { top, left, width, height } = resizeOrigRect;
    const isAbsolute = getComputedStyle(resizeTarget).position === 'absolute';

    switch (resizeHandle) {
        case 'nw':
            width -= dX; height -= dY;
            if (isAbsolute) { top += dY; left += dX; }
            break;
        case 'n':
            height -= dY;
            if (isAbsolute) { top += dY; }
            break;
        case 'ne':
            width += dX; height -= dY;
            if (isAbsolute) { top += dY; }
            break;
        case 'e':
            width += dX;
            break;
        case 'se':
            width += dX; height += dY;
            break;
        case 's':
            height += dY;
            break;
        case 'sw':
            width -= dX; height += dY;
            if (isAbsolute) { left += dX; }
            break;
        case 'w':
            width -= dX;
            if (isAbsolute) { left += dX; }
            break;
    }

    // Enforce minimum dimensions
    width = Math.max(20, width);
    height = Math.max(20, height);

    resizeTarget.style.width = width + 'px';
    resizeTarget.style.height = height + 'px';

    if (isAbsolute) {
        resizeTarget.style.top = top + 'px';
        resizeTarget.style.left = left + 'px';
    }
}

function endResize() {
    if (!isResizing || !resizeTarget) return;

    resizeTarget.classList.remove('slide-resizing');
    const vp = document.getElementById('slideViewportInner');
    if (vp) vp.classList.remove('is-dragging');

    isResizing = false;
    resizeTarget = null;

    serializeSlide();
}

function serializeSlide() {
    const viewport = document.getElementById('slideViewportInner');
    if (!viewport || slidesHtml.length === 0) return;
    // Guard: ne pas sérialiser si le viewport n'a pas de slide rendue
    if (!viewport.querySelector('.slide')) return;

    pushUndo();

    const clone = viewport.cloneNode(true);

    // Remove editing attributes and classes
    clone.querySelectorAll('[contenteditable]').forEach(el => {
        el.removeAttribute('contenteditable');
    });
    clone.querySelectorAll('[data-draggable]').forEach(el => {
        el.removeAttribute('data-draggable');
    });
    clone.querySelectorAll('[data-text-editable]').forEach(el => {
        el.removeAttribute('data-text-editable');
    });
    clone.querySelectorAll('.slide-editable').forEach(el => {
        el.classList.remove('slide-editable');
    });
    clone.querySelectorAll('.slide-text-editable').forEach(el => {
        el.classList.remove('slide-text-editable');
    });
    clone.querySelectorAll('.slide-editing-text').forEach(el => {
        el.classList.remove('slide-editing-text');
    });
    clone.querySelectorAll('.slide-draggable').forEach(el => {
        el.classList.remove('slide-draggable');
    });
    clone.querySelectorAll('.slide-dragging').forEach(el => {
        el.classList.remove('slide-dragging');
    });
    clone.querySelectorAll('.slide-resizing').forEach(el => {
        el.classList.remove('slide-resizing');
    });
    clone.classList.remove('is-dragging');
    // V2: clean selection, action overlays, and resize handles
    clone.querySelectorAll('.slide-selected').forEach(el => {
        el.classList.remove('slide-selected');
    });
    clone.querySelectorAll('.slide-select-actions').forEach(el => {
        el.remove();
    });
    clone.querySelectorAll('.slide-resize-handle').forEach(el => {
        el.remove();
    });
    // Clean flattened attribute
    clone.querySelectorAll('[data-flattened]').forEach(el => {
        el.removeAttribute('data-flattened');
    });

    // Save clean HTML (transforms and positions are preserved intentionally)
    slidesHtml[currentSlideIndex] = clone.innerHTML;
    updateThumbnail(currentSlideIndex);
}

function pushUndo() {
    undoStack.push({
        index: currentSlideIndex,
        html: slidesHtml[currentSlideIndex],
    });
    if (undoStack.length > 30) undoStack.shift();
    // Clear redo stack when new action is performed
    redoStack = [];
}

function undo() {
    if (undoStack.length === 0) return;
    // Deselect before undo since the DOM will be rebuilt
    deselectElement();

    // Save current state to redo stack
    redoStack.push({
        index: currentSlideIndex,
        html: slidesHtml[currentSlideIndex],
    });
    if (redoStack.length > 30) redoStack.shift();

    const entry = undoStack.pop();
    slidesHtml[entry.index] = entry.html;
    if (entry.index === currentSlideIndex) {
        renderCurrentSlide();
    }
    updateThumbnail(entry.index);
}

function redo() {
    if (redoStack.length === 0) return;
    deselectElement();

    // Save current state to undo stack
    undoStack.push({
        index: currentSlideIndex,
        html: slidesHtml[currentSlideIndex],
    });

    const entry = redoStack.pop();
    slidesHtml[entry.index] = entry.html;
    if (entry.index === currentSlideIndex) {
        renderCurrentSlide();
    }
    updateThumbnail(entry.index);
}

function addSlide() {
    // Create a blank slide based on current slide template
    const blankSlide = `<div class="slide">
        <div class="header-bar">
            <span class="header-bar-left"></span>
            <span class="header-bar-right"></span>
        </div>
        <h1 class="slide-title">Nouvelle slide</h1>
        <div class="slide-footer">© Wavestone</div>
    </div>`;

    slidesHtml.push(blankSlide);
    renderThumbnails();
    goToSlide(slidesHtml.length - 1);
}

// ==========================================
// V2: ELEMENT INSERTION
// ==========================================

function addElement(type) {
    const viewport = document.getElementById('slideViewportInner');
    const slide = viewport.querySelector('.slide');
    if (!slide) return;

    pushUndo();
    const el = document.createElement('div');
    el.classList.add('slide-added');

    switch (type) {
        case 'textbox':
            el.classList.add('slide-added-textbox');
            el.textContent = 'Texte ici';
            el.style.cssText = 'position:absolute;top:220px;left:300px;padding:8px 12px;font-size:16px;';
            break;
        case 'rect':
            el.classList.add('slide-added-rect');
            el.style.cssText = 'position:absolute;top:200px;left:300px;width:200px;height:100px;';
            break;
        case 'callout':
            el.classList.add('callout', 'info');
            el.innerHTML = '<span class="callout-icon">&#8505;</span><span>Information</span>';
            el.style.cssText = 'position:absolute;top:200px;left:200px;width:500px;';
            break;
        case 'line':
            el.classList.add('slide-added-line');
            el.innerHTML = `<svg width="100%" height="100%" preserveAspectRatio="none"><line x1="0" y1="50%" x2="100%" y2="50%" stroke="#451DC7" stroke-width="2"/></svg>`;
            el.style.cssText = 'position:absolute;top:270px;left:200px;width:200px;height:10px;';
            break;
        case 'arrow':
            el.classList.add('slide-added-arrow');
            el.innerHTML = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 200 20"><line x1="0" y1="10" x2="180" y2="10" stroke="#451DC7" stroke-width="2"/><polygon points="175,4 190,10 175,16" fill="#451DC7"/></svg>`;
            el.style.cssText = 'position:absolute;top:270px;left:200px;width:200px;height:20px;';
            break;
        case 'circle':
            el.classList.add('slide-added-circle');
            el.style.cssText = 'position:absolute;top:200px;left:400px;width:100px;height:100px;';
            break;
        case 'sticker':
            el.classList.add('slide-sticker');
            el.textContent = 'DRAFT';
            el.style.cssText = 'position:absolute;top:35px;right:33px;';
            break;
        case 'image':
            // Create file input to select image
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const imgEl = document.createElement('div');
                    imgEl.classList.add('slide-added', 'slide-added-image');
                    imgEl.style.cssText = 'position:absolute;top:150px;left:350px;width:260px;height:180px;background-size:cover;background-position:center;';
                    imgEl.style.backgroundImage = `url(${ev.target.result})`;
                    slide.appendChild(imgEl);
                    enhanceSlideForEditing();
                    selectElement(imgEl);
                    serializeSlide();
                };
                reader.readAsDataURL(file);
            };
            input.click();
            return; // Don't add the placeholder element for images
    }

    slide.appendChild(el);
    enhanceSlideForEditing();
    selectElement(el);
    serializeSlide();
}

// ==========================================
// V2: SELECTION SYSTEM
// ==========================================

function selectElement(el) {
    if (selectedElement === el) return; // Already selected
    deselectElement();
    selectedElement = el;
    editState = 'selected';
    el.classList.add('slide-selected');

    // Add 8 resize handles
    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    handles.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `slide-resize-handle slide-resize-${pos}`;
        handle.setAttribute('data-resize-handle', pos);
        el.appendChild(handle);
    });

    // Add action overlay
    const actions = document.createElement('div');
    actions.className = 'slide-select-actions';
    actions.innerHTML = `
        <button type="button" onclick="duplicateSelected()" title="Dupliquer">\u29C9</button>
        <button type="button" onclick="deleteSelected()" title="Supprimer">\u2715</button>
    `;
    el.appendChild(actions);

    // Update properties panel
    updatePropertiesPanel();
}

function deselectElement() {
    if (editState === 'editing') exitEditMode();
    if (!selectedElement) return;
    selectedElement.classList.remove('slide-selected');
    // Remove resize handles
    selectedElement.querySelectorAll('.slide-resize-handle').forEach(h => h.remove());
    // Remove action overlay
    const actions = selectedElement.querySelector('.slide-select-actions');
    if (actions) actions.remove();
    selectedElement = null;
    editState = 'idle';

    // Update properties panel
    updatePropertiesPanel();
}

function deleteSelected() {
    if (!selectedElement) return;

    // Don't delete preserved elements (header, footer)
    if (selectedElement.closest('.header-bar') ||
        selectedElement.classList.contains('header-bar') ||
        selectedElement.classList.contains('slide-footer')) {
        return;
    }

    if (editState === 'editing') exitEditMode();
    pushUndo();
    selectedElement.remove();
    selectedElement = null;
    editState = 'idle';
    updatePropertiesPanel();
    serializeSlide();
}

function duplicateSelected() {
    if (!selectedElement) return;

    // Don't duplicate preserved elements
    if (selectedElement.closest('.header-bar') ||
        selectedElement.classList.contains('header-bar') ||
        selectedElement.classList.contains('slide-footer')) {
        return;
    }

    pushUndo();
    const clone = selectedElement.cloneNode(true);
    clone.classList.remove('slide-selected');
    const actions = clone.querySelector('.slide-select-actions');
    if (actions) actions.remove();
    clone.querySelectorAll('.slide-resize-handle').forEach(h => h.remove());
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    clone.classList.remove('slide-editing-text');

    // Offset the copy
    const style = clone.style;
    const top = parseInt(style.top) || 0;
    const left = parseInt(style.left) || 0;
    style.top = (top + 20) + 'px';
    style.left = (left + 20) + 'px';

    // Ensure absolute positioning
    style.position = 'absolute';

    selectedElement.parentElement.appendChild(clone);

    // Re-enhance to mark as draggable
    clone.setAttribute('data-draggable', 'true');
    clone.classList.add('slide-draggable');

    selectElement(clone);
    serializeSlide();
}

// ==========================================
// TEXT FORMATTING
// ==========================================

function formatBold() {
    if (editState !== 'editing') return;
    document.execCommand('bold', false, null);
    serializeSlide();
}

function formatItalic() {
    if (editState !== 'editing') return;
    document.execCommand('italic', false, null);
    serializeSlide();
}

function formatUnderline() {
    if (editState !== 'editing') return;
    document.execCommand('underline', false, null);
    serializeSlide();
}

function formatFontSize(size) {
    if (!size) return;
    if (editState === 'editing' && editingElement) {
        editingElement.style.fontSize = size;
        serializeSlide();
    } else if (selectedElement) {
        selectedElement.style.fontSize = size;
        serializeSlide();
    }
}

function formatFontFamily(value) {
    if (!value) return;
    // Parse the value which might contain font-weight
    let fontFamily = value;
    let fontWeight = '';

    if (value.includes('font-weight:')) {
        const parts = value.split(';');
        fontFamily = parts[0].trim();
        const weightPart = parts.find(p => p.includes('font-weight'));
        if (weightPart) {
            fontWeight = weightPart.split(':')[1].trim();
        }
    }

    if (editState === 'editing' && editingElement) {
        editingElement.style.fontFamily = fontFamily;
        if (fontWeight) editingElement.style.fontWeight = fontWeight;
        serializeSlide();
    } else if (selectedElement) {
        selectedElement.style.fontFamily = fontFamily;
        if (fontWeight) selectedElement.style.fontWeight = fontWeight;
        serializeSlide();
    }
}

// Color picker state
let activeColorPicker = null; // 'text' or 'bg'

function openColorPicker(type) {
    activeColorPicker = type;
    const popup = document.getElementById('colorPickerPopup');
    const title = document.getElementById('colorPickerTitle');
    const wrapper = document.getElementById(type === 'text' ? 'textColorWrapper' : 'bgColorWrapper');

    title.textContent = type === 'text' ? 'Couleur du texte' : 'Couleur de fond';

    // Position popup below the button
    const rect = wrapper.getBoundingClientRect();
    popup.style.left = rect.left + 'px';
    popup.style.top = (rect.bottom + 4) + 'px';
    popup.style.display = 'block';

    // Close when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeColorPickerOnOutsideClick);
    }, 0);
}

function closeColorPicker() {
    const popup = document.getElementById('colorPickerPopup');
    popup.style.display = 'none';
    activeColorPicker = null;
    document.removeEventListener('click', closeColorPickerOnOutsideClick);
}

function closeColorPickerOnOutsideClick(e) {
    const popup = document.getElementById('colorPickerPopup');
    if (!popup.contains(e.target) && !e.target.closest('.color-picker-wrapper')) {
        closeColorPicker();
    }
}

function selectColor(color) {
    if (activeColorPicker === 'text') {
        formatTextColor(color);
    } else if (activeColorPicker === 'bg') {
        formatBgColor(color);
    }
    closeColorPicker();
}

function formatTextColor(color) {
    const bar = document.getElementById('textColorBar');
    if (color === 'transparent') {
        bar.style.background = 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)';
        bar.style.backgroundSize = '6px 6px';
        bar.style.backgroundPosition = '0 0, 3px 3px';
    } else {
        bar.style.background = color;
        bar.style.backgroundSize = '';
        bar.style.backgroundPosition = '';
    }

    if (editState === 'editing' && editingElement) {
        editingElement.style.color = color === 'transparent' ? 'transparent' : color;
        serializeSlide();
    } else if (selectedElement) {
        selectedElement.style.color = color === 'transparent' ? 'transparent' : color;
        serializeSlide();
    }
}

function formatBgColor(color) {
    const bar = document.getElementById('bgColorBar');
    if (color === 'transparent') {
        bar.style.background = 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)';
        bar.style.backgroundSize = '6px 6px';
        bar.style.backgroundPosition = '0 0, 3px 3px';
    } else {
        bar.style.background = color;
        bar.style.backgroundSize = '';
        bar.style.backgroundPosition = '';
    }

    if (selectedElement) {
        selectedElement.style.backgroundColor = color === 'transparent' ? 'transparent' : color;
        serializeSlide();
    }
}

// ==========================================
// ICON PICKER
// ==========================================

const ICONS = {
    'check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    'x': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    'x-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    'alert-triangle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'info': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    'arrow-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    'arrow-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
    'arrow-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
    'chevron-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
    'star': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'heart': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    'zap': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'target': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    'flag': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
    'award': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    'user': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'users': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'message-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    'briefcase': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    'trending-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    'trending-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
    'dollar-sign': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    'clock': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'calendar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    'settings': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    'lock': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    'shield': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'globe': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
};

function openIconPicker() {
    const popup = document.getElementById('iconPickerPopup');
    const toolbar = document.getElementById('insertToolbar');
    const rect = toolbar.getBoundingClientRect();

    popup.style.left = Math.max(10, rect.left) + 'px';
    popup.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    popup.style.top = 'auto';
    popup.style.display = 'block';

    setTimeout(() => {
        document.addEventListener('click', closeIconPickerOnOutsideClick);
    }, 0);
}

function closeIconPicker() {
    const popup = document.getElementById('iconPickerPopup');
    popup.style.display = 'none';
    document.removeEventListener('click', closeIconPickerOnOutsideClick);
}

function closeIconPickerOnOutsideClick(e) {
    const popup = document.getElementById('iconPickerPopup');
    if (!popup.contains(e.target) && !e.target.closest('.insert-btn')) {
        closeIconPicker();
    }
}

function insertIcon(iconName) {
    const viewport = document.getElementById('slideViewportInner');
    const slide = viewport.querySelector('.slide');
    if (!slide || !ICONS[iconName]) return;

    pushUndo();

    const el = document.createElement('div');
    el.classList.add('slide-added', 'slide-added-icon');
    el.innerHTML = ICONS[iconName];
    el.style.cssText = 'position:absolute;top:200px;left:400px;width:48px;height:48px;color:#451DC7;';

    slide.appendChild(el);

    el.setAttribute('data-draggable', 'true');
    el.classList.add('slide-draggable');

    selectElement(el);
    serializeSlide();
    closeIconPicker();
}

// ==========================================
// SHADOW CONTROL
// ==========================================

function toggleShadow(enabled) {
    if (!selectedElement) return;
    pushUndo();

    if (enabled) {
        selectedElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
        selectedElement.style.boxShadow = 'none';
    }
    serializeSlide();
    updatePropertiesPanel();
}

function setShadowIntensity(intensity) {
    if (!selectedElement) return;
    pushUndo();

    const shadows = {
        'none': 'none',
        'sm': '0 1px 3px rgba(0,0,0,0.1)',
        'md': '0 4px 12px rgba(0,0,0,0.15)',
        'lg': '0 8px 24px rgba(0,0,0,0.2)',
        'xl': '0 12px 40px rgba(0,0,0,0.25)',
    };

    selectedElement.style.boxShadow = shadows[intensity] || 'none';
    serializeSlide();
}

// ==========================================
// STROKE WIDTH (for lines/arrows/icons)
// ==========================================

function setStrokeWidth(width) {
    if (!selectedElement) return;
    pushUndo();

    const svg = selectedElement.querySelector('svg');
    if (svg) {
        svg.querySelectorAll('line, polyline, path, circle, rect, polygon').forEach(el => {
            el.setAttribute('stroke-width', width);
        });
    }
    serializeSlide();
}

function setStrokeColor(color) {
    if (!selectedElement) return;
    pushUndo();

    const svg = selectedElement.querySelector('svg');
    if (svg) {
        svg.querySelectorAll('line, polyline, path, circle, rect, polygon').forEach(el => {
            el.setAttribute('stroke', color);
        });
        svg.querySelectorAll('polygon').forEach(el => {
            el.setAttribute('fill', color);
        });
    }
    // Also set color for icon containers
    selectedElement.style.color = color;
    serializeSlide();
}

function formatAlign(alignment) {
    if (editState === 'editing' && editingElement) {
        editingElement.style.textAlign = alignment;
        serializeSlide();
    } else if (selectedElement) {
        selectedElement.style.textAlign = alignment;
        serializeSlide();
    }
}

// ==========================================
// LAYER CONTROLS
// ==========================================

function bringToFront() {
    if (!selectedElement) return;
    const slide = selectedElement.closest('.slide');
    if (!slide) return;
    pushUndo();
    slide.appendChild(selectedElement);
    serializeSlide();
}

function sendToBack() {
    if (!selectedElement) return;
    const slide = selectedElement.closest('.slide');
    if (!slide) return;
    pushUndo();
    slide.insertBefore(selectedElement, slide.firstChild);
    serializeSlide();
}

function bringForward() {
    if (!selectedElement) return;
    const next = selectedElement.nextElementSibling;
    if (next && !next.classList.contains('slide-resize-handle') && !next.classList.contains('slide-select-actions')) {
        pushUndo();
        next.after(selectedElement);
        serializeSlide();
    }
}

function sendBackward() {
    if (!selectedElement) return;
    const prev = selectedElement.previousElementSibling;
    if (prev) {
        pushUndo();
        prev.before(selectedElement);
        serializeSlide();
    }
}

// ==========================================
// PROPERTIES PANEL
// ==========================================

function updatePropertiesPanel() {
    const content = document.getElementById('propertiesContent');
    const title = document.getElementById('propertiesTitle');

    if (!content || !title) return;

    if (!selectedElement) {
        title.textContent = 'Propriétés';
        content.innerHTML = `
            <div class="properties-empty">
                <p>Sélectionnez un élément pour modifier ses propriétés</p>
            </div>
        `;
        return;
    }

    // Determine element type
    let elementType = 'Élément';
    let isLineOrArrow = false;
    let isIcon = false;

    if (selectedElement.classList.contains('slide-added-textbox')) elementType = 'Zone de texte';
    else if (selectedElement.classList.contains('slide-added-rect')) elementType = 'Rectangle';
    else if (selectedElement.classList.contains('slide-added-circle')) elementType = 'Cercle';
    else if (selectedElement.classList.contains('slide-added-arrow')) { elementType = 'Flèche'; isLineOrArrow = true; }
    else if (selectedElement.classList.contains('slide-added-line')) { elementType = 'Ligne'; isLineOrArrow = true; }
    else if (selectedElement.classList.contains('slide-added-icon')) { elementType = 'Icône'; isIcon = true; }
    else if (selectedElement.classList.contains('callout')) elementType = 'Encadré';
    else if (selectedElement.classList.contains('slide-sticker')) elementType = 'Étiquette';
    else if (selectedElement.classList.contains('kpi-card')) elementType = 'KPI';
    else if (selectedElement.classList.contains('slide-table')) elementType = 'Tableau';

    title.textContent = elementType;

    const style = selectedElement.style;
    const computed = getComputedStyle(selectedElement);

    const bgColor = style.backgroundColor || computed.backgroundColor || '#ffffff';
    const textColor = style.color || computed.color || '#000000';
    const borderColor = style.borderColor || computed.borderColor || '#cccccc';
    const width = parseInt(style.width || computed.width) || '';
    const height = parseInt(style.height || computed.height) || '';

    // Check current shadow
    const currentShadow = style.boxShadow || computed.boxShadow || 'none';
    const hasShadow = currentShadow && currentShadow !== 'none';

    // Get current stroke width for lines/arrows/icons
    let currentStrokeWidth = 2;
    let currentStrokeColor = '#451DC7';
    const svg = selectedElement.querySelector('svg');
    if (svg) {
        const strokeEl = svg.querySelector('[stroke-width]');
        if (strokeEl) currentStrokeWidth = parseFloat(strokeEl.getAttribute('stroke-width')) || 2;
        const colorEl = svg.querySelector('[stroke]');
        if (colorEl) currentStrokeColor = colorEl.getAttribute('stroke') || '#451DC7';
    }

    let html = `
        <div class="property-section">
            <div class="property-section-title">Taille</div>
            <div class="property-row">
                <span class="property-label">Largeur</span>
                <input type="number" class="property-input" id="propWidth" value="${width}" onchange="updateProperty('width', this.value + 'px')">
            </div>
            <div class="property-row">
                <span class="property-label">Hauteur</span>
                <input type="number" class="property-input" id="propHeight" value="${height}" onchange="updateProperty('height', this.value + 'px')">
            </div>
        </div>
    `;

    // Stroke controls for lines, arrows, icons
    if (isLineOrArrow || isIcon) {
        html += `
        <div class="property-section">
            <div class="property-section-title">Trait</div>
            <div class="property-row">
                <span class="property-label">Épaisseur</span>
                <select class="property-input" onchange="setStrokeWidth(this.value)">
                    <option value="1" ${currentStrokeWidth == 1 ? 'selected' : ''}>1px</option>
                    <option value="2" ${currentStrokeWidth == 2 ? 'selected' : ''}>2px</option>
                    <option value="3" ${currentStrokeWidth == 3 ? 'selected' : ''}>3px</option>
                    <option value="4" ${currentStrokeWidth == 4 ? 'selected' : ''}>4px</option>
                    <option value="5" ${currentStrokeWidth == 5 ? 'selected' : ''}>5px</option>
                    <option value="6" ${currentStrokeWidth == 6 ? 'selected' : ''}>6px</option>
                    <option value="8" ${currentStrokeWidth == 8 ? 'selected' : ''}>8px</option>
                </select>
            </div>
            <div class="property-row">
                <span class="property-label">Couleur</span>
                <input type="color" class="property-color" value="${currentStrokeColor}" onchange="setStrokeColor(this.value)">
            </div>
        </div>
        `;
    } else {
        html += `
        <div class="property-section">
            <div class="property-section-title">Couleurs</div>
            <div class="property-row">
                <span class="property-label">Fond</span>
                <input type="color" class="property-color" value="${rgbToHex(bgColor)}" onchange="updateProperty('backgroundColor', this.value)">
                <button type="button" class="property-btn-small" onclick="updateProperty('backgroundColor', 'transparent')">∅</button>
            </div>
            <div class="property-row">
                <span class="property-label">Texte</span>
                <input type="color" class="property-color" value="${rgbToHex(textColor)}" onchange="updateProperty('color', this.value)">
            </div>
            <div class="property-row">
                <span class="property-label">Bordure</span>
                <input type="color" class="property-color" value="${rgbToHex(borderColor)}" onchange="updateProperty('borderColor', this.value)">
                <button type="button" class="property-btn-small" onclick="updateProperty('borderColor', 'transparent')">∅</button>
            </div>
        </div>
        `;
    }

    html += `
        <div class="property-section">
            <div class="property-section-title">Ombre</div>
            <div class="property-row">
                <select class="property-input" style="width:100%" onchange="setShadowIntensity(this.value)">
                    <option value="none" ${!hasShadow ? 'selected' : ''}>Aucune</option>
                    <option value="sm" ${currentShadow.includes('1px') ? 'selected' : ''}>Légère</option>
                    <option value="md" ${currentShadow.includes('4px') ? 'selected' : ''}>Moyenne</option>
                    <option value="lg" ${currentShadow.includes('8px') ? 'selected' : ''}>Forte</option>
                    <option value="xl" ${currentShadow.includes('12px') ? 'selected' : ''}>Très forte</option>
                </select>
            </div>
        </div>

        <div class="property-section">
            <div class="property-section-title">Disposition</div>
            <div class="layer-controls">
                <button type="button" class="layer-btn" onclick="bringToFront()" title="Premier plan">↑↑ Devant</button>
                <button type="button" class="layer-btn" onclick="sendToBack()" title="Arrière-plan">↓↓ Derrière</button>
                <button type="button" class="layer-btn" onclick="bringForward()" title="Avancer">↑ Avancer</button>
                <button type="button" class="layer-btn" onclick="sendBackward()" title="Reculer">↓ Reculer</button>
            </div>
        </div>

        <div class="property-section">
            <div class="property-actions">
                <button type="button" class="property-btn" onclick="duplicateSelected()">Dupliquer</button>
                <button type="button" class="property-btn danger" onclick="deleteSelected()">Supprimer</button>
            </div>
        </div>
    `;

    content.innerHTML = html;
}

function updateProperty(property, value) {
    if (!selectedElement) return;
    pushUndo();
    selectedElement.style[property] = value;
    serializeSlide();
}

function rgbToHex(color) {
    if (!color || color === 'transparent') return '#ffffff';
    if (color.startsWith('#')) return color.length === 7 ? color : '#ffffff';

    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }
    return '#ffffff';
}

// ==========================================
// UTILITIES
// ==========================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================

window.hideError = hideError;
window.backToForm = backToForm;
window.resetAll = resetAll;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide;
window.sendChatMessage = sendChatMessage;
window.handleChatKeydown = handleChatKeydown;
window.exportPdf = exportPdf;
window.exportPptx = exportPptx;
window.undo = undo;
window.redo = redo;
window.addElement = addElement;
window.addSlide = addSlide;
window.deleteSelected = deleteSelected;
window.duplicateSelected = duplicateSelected;
window.addProgressLog = addProgressLog;
window.updateThinkingDisplay = updateThinkingDisplay;
window.clearThinkingDisplay = clearThinkingDisplay;

// PPTX Direct mode
window.generatePptxDirect = generatePptxDirect;
window.handleModeClick = handleModeClick;
window.downloadPptxFromBase64 = downloadPptxFromBase64;

// Text formatting
window.formatBold = formatBold;
window.formatItalic = formatItalic;
window.formatUnderline = formatUnderline;
window.formatFontSize = formatFontSize;
window.formatFontFamily = formatFontFamily;
window.formatTextColor = formatTextColor;
window.formatBgColor = formatBgColor;
window.formatAlign = formatAlign;

// Color picker
window.openColorPicker = openColorPicker;
window.closeColorPicker = closeColorPicker;
window.selectColor = selectColor;

// Icon picker
window.openIconPicker = openIconPicker;
window.closeIconPicker = closeIconPicker;
window.insertIcon = insertIcon;

// Shadow & Stroke
window.toggleShadow = toggleShadow;
window.setShadowIntensity = setShadowIntensity;
window.setStrokeWidth = setStrokeWidth;
window.setStrokeColor = setStrokeColor;

// Layer controls
window.bringToFront = bringToFront;
window.sendToBack = sendToBack;
window.bringForward = bringForward;
window.sendBackward = sendBackward;

// Properties
window.updateProperty = updateProperty;

// Initialize
document.addEventListener('DOMContentLoaded', init);
