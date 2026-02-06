/**
 * Wavestone Presentation Studio
 * Premium chatbot interface with progress stepper & suggestion chips
 */

// ==========================================
// STATE
// ==========================================

let pptxGeneratedCode = '';
let pptxCodeSessionId = null;
let isGenerating = false;

// ==========================================
// DOM
// ==========================================

const chatForm = document.getElementById('chatForm');
const conversation = document.getElementById('conversation');
const emptyState = document.getElementById('emptyState');
const messagesEl = document.getElementById('messages');
const downloadToast = document.getElementById('downloadToast');
const promptInput = document.getElementById('promptInput');
const btnSend = document.getElementById('btnSend');
const progressStepper = document.getElementById('progressStepper');

// ==========================================
// INIT
// ==========================================

function init() {
    chatForm.addEventListener('submit', handleSubmit);
    promptInput.addEventListener('input', handleInputChange);
    promptInput.addEventListener('keydown', handleKeyDown);
    initScrollDetection();
    initSuggestionChips();
}

function handleInputChange() {
    promptInput.style.height = 'auto';
    promptInput.style.height = Math.min(promptInput.scrollHeight, 200) + 'px';
    btnSend.disabled = !promptInput.value.trim() || isGenerating;
}

function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (promptInput.value.trim() && !isGenerating) {
            chatForm.dispatchEvent(new Event('submit'));
        }
    }
}

function initSuggestionChips() {
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (prompt && !isGenerating) {
                promptInput.value = prompt;
                handleInputChange();
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
    });
}

// ==========================================
// SUBMIT
// ==========================================

function handleSubmit(e) {
    e.preventDefault();
    if (isGenerating) return;

    const prompt = promptInput.value.trim();
    if (!prompt) return;

    const data = {
        prompt,
        slideCount: parseInt(document.getElementById('slideCount').value, 10) || 12,
        language: document.getElementById('language').value || 'fr',
        deckType: document.getElementById('deckType').value || 'autre',
    };

    promptInput.value = '';
    handleInputChange();

    startGeneration(data);
}

// ==========================================
// PROGRESS STEPPER
// ==========================================

function showStepper() {
    progressStepper.classList.add('visible');
    resetStepper();
}

function hideStepper() {
    progressStepper.classList.remove('visible');
}

function resetStepper() {
    document.querySelectorAll('.stepper-step').forEach(s => {
        s.classList.remove('active', 'completed');
    });
    document.querySelectorAll('.stepper-line').forEach(l => {
        l.classList.remove('active', 'completed');
    });
}

function setStepActive(stepName) {
    const steps = ['plan', 'code', 'ready'];
    const lines = document.querySelectorAll('.stepper-line');
    const idx = steps.indexOf(stepName);

    steps.forEach((s, i) => {
        const el = document.querySelector(`.stepper-step[data-step="${s}"]`);
        if (!el) return;
        el.classList.remove('active', 'completed');
        if (i < idx) {
            el.classList.add('completed');
        } else if (i === idx) {
            el.classList.add('active');
        }
    });

    lines.forEach((l, i) => {
        l.classList.remove('active', 'completed');
        if (i < idx) {
            l.classList.add('completed');
        } else if (i === idx) {
            l.classList.add('active');
        }
    });
}

function setStepCompleted(stepName) {
    const el = document.querySelector(`.stepper-step[data-step="${stepName}"]`);
    if (el) {
        el.classList.remove('active');
        el.classList.add('completed');
    }
}

function completeAllSteps() {
    document.querySelectorAll('.stepper-step').forEach(s => {
        s.classList.remove('active');
        s.classList.add('completed');
    });
    document.querySelectorAll('.stepper-line').forEach(l => {
        l.classList.remove('active');
        l.classList.add('completed');
    });
}

// ==========================================
// GENERATION
// ==========================================

async function startGeneration(data) {
    pptxGeneratedCode = '';
    pptxCodeSessionId = null;
    isGenerating = true;
    btnSend.disabled = true;

    emptyState.classList.add('hidden');
    hideDownloadToast();
    resetScrollBehavior();

    addUserMessage(data.prompt, data);
    showStepper();
    setStepActive('plan');

    const assistantEl = addAssistantMessage();
    const thinkingBlock = createThinkingBlock();
    const codeBlock = createCodeBlock();

    assistantEl.appendChild(thinkingBlock.element);

    try {
        const initRes = await fetch('/api/generate-pptx-stream/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!initRes.ok) {
            const err = await initRes.json().catch(() => ({}));
            throw new Error(err.message || 'Erreur d\'initialisation');
        }

        const { sessionId } = await initRes.json();

        const eventSource = new EventSource(
            `/api/generate-pptx-stream?sessionId=${sessionId}&previewOnly=true`
        );

        let thinkingText = '';
        let codeText = '';
        let codeAdded = false;
        let lineCount = 0;

        eventSource.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);

                switch (msg.type) {
                    case 'phase':
                        addStatus(assistantEl, msg.message, 'phase');
                        break;

                    case 'thinking':
                        thinkingText += msg.content + ' ';
                        thinkingBlock.update(thinkingText, true);
                        scrollToBottom();
                        break;

                    case 'plan_complete':
                        thinkingBlock.finish(thinkingText, msg.plan.slides.length);
                        addStatus(assistantEl, `Plan cree \u00b7 ${msg.plan.slides.length} slides`, 'success');
                        setStepCompleted('plan');
                        setStepActive('code');
                        break;

                    case 'code_chunk':
                        if (!codeAdded) {
                            assistantEl.appendChild(codeBlock.element);
                            codeAdded = true;
                        }
                        codeText += msg.content;
                        pptxGeneratedCode = codeText;
                        lineCount = codeText.split('\n').length;
                        codeBlock.update(codeText, lineCount, true);
                        scrollToBottom();
                        break;

                    case 'code_complete':
                        pptxGeneratedCode = msg.code || msg.fullCode || pptxGeneratedCode;
                        pptxCodeSessionId = msg.codeSessionId;
                        lineCount = pptxGeneratedCode.split('\n').length;
                        codeBlock.finish(pptxGeneratedCode, lineCount);
                        addStatus(assistantEl, 'Code genere', 'success');
                        setStepCompleted('code');
                        setStepActive('ready');
                        break;

                    case 'preview_ready':
                        eventSource.close();
                        pptxCodeSessionId = msg.codeSessionId;
                        completeAllSteps();
                        showDownloadToast();
                        setTimeout(hideStepper, 2000);
                        finish();
                        break;

                    case 'pptx_ready':
                        eventSource.close();
                        completeAllSteps();
                        showDownloadToast();
                        setTimeout(hideStepper, 2000);
                        downloadFromBase64(msg.base64, msg.filename || 'presentation.pptx');
                        finish();
                        break;

                    case 'complete':
                        eventSource.close();
                        completeAllSteps();
                        showDownloadToast();
                        setTimeout(hideStepper, 2000);
                        finish();
                        break;

                    case 'error':
                        eventSource.close();
                        addStatus(assistantEl, msg.message, 'error');
                        hideStepper();
                        finish();
                        break;
                }
            } catch (e) {
                console.error('Parse error:', e);
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            addStatus(assistantEl, 'Connexion perdue', 'error');
            hideStepper();
            finish();
        };

    } catch (error) {
        addStatus(assistantEl, error.message, 'error');
        hideStepper();
        finish();
    }
}

function finish() {
    isGenerating = false;
    btnSend.disabled = !promptInput.value.trim();
}

// ==========================================
// UI COMPONENTS
// ==========================================

function addUserMessage(text, data) {
    const div = document.createElement('div');
    div.className = 'msg msg-user';

    const meta = `${data.slideCount} slides \u00b7 ${data.language === 'fr' ? 'FR' : 'EN'} \u00b7 ${getTypeLabel(data.deckType)}`;

    div.innerHTML = `
        <div class="msg-user-content">
            <div>${escapeHtml(text)}</div>
            <div class="msg-user-meta">${meta}</div>
        </div>
    `;

    messagesEl.appendChild(div);
    scrollToBottom(true);
}

function addAssistantMessage() {
    const div = document.createElement('div');
    div.className = 'msg msg-assistant';

    const content = document.createElement('div');
    content.className = 'msg-assistant-content';

    div.appendChild(content);
    messagesEl.appendChild(div);
    scrollToBottom();

    return content;
}

function createThinkingBlock() {
    const div = document.createElement('div');
    div.className = 'collapsible';
    div.innerHTML = `
        <div class="collapsible-header" onclick="toggleCollapsible(this.parentElement)">
            <div class="collapsible-info">
                <div class="collapsible-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                </div>
                <div class="collapsible-meta">
                    <div class="collapsible-title">
                        <span class="indicator-dot"></span>
                        Reflexion en cours
                    </div>
                    <div class="collapsible-subtitle">Analyse de votre demande...</div>
                </div>
            </div>
            <div class="collapsible-toggle">
                Voir
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </div>
        </div>
        <div class="collapsible-content">
            <div class="thinking-content">
                <div class="thinking-text"></div>
            </div>
        </div>
    `;

    const titleEl = div.querySelector('.collapsible-title');
    const subtitleEl = div.querySelector('.collapsible-subtitle');
    const textEl = div.querySelector('.thinking-text');
    const dotEl = div.querySelector('.indicator-dot');

    return {
        element: div,
        update(text, streaming) {
            textEl.innerHTML = escapeHtml(text) + (streaming ? '<span class="cursor"></span>' : '');
            const words = text.trim().split(/\s+/).length;
            subtitleEl.textContent = `${words} mots...`;
        },
        finish(text, slideCount) {
            textEl.innerHTML = escapeHtml(text);
            titleEl.innerHTML = `<span class="indicator-dot done"></span> Reflexion terminee`;
            subtitleEl.textContent = `Plan de ${slideCount} slides elabore`;
            dotEl?.classList.add('done');
        }
    };
}

function createCodeBlock() {
    const div = document.createElement('div');
    div.className = 'collapsible code-collapsible';
    div.innerHTML = `
        <div class="collapsible-header" onclick="toggleCollapsible(this.parentElement)">
            <div class="collapsible-info">
                <div class="collapsible-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="16 18 22 12 16 6"/>
                        <polyline points="8 6 2 12 8 18"/>
                    </svg>
                </div>
                <div class="collapsible-meta">
                    <div class="collapsible-title">
                        <span class="indicator-dot"></span>
                        Generation du code
                    </div>
                    <div class="collapsible-subtitle">JavaScript \u00b7 pptxgenjs</div>
                </div>
            </div>
            <div class="collapsible-toggle">
                Voir
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </div>
        </div>
        <div class="collapsible-content">
            <div class="code-inner">
                <div class="code-toolbar">
                    <button type="button" class="btn-copy" onclick="copyCode(event)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copier
                    </button>
                </div>
                <div class="code-scroll">
                    <pre></pre>
                </div>
            </div>
        </div>
    `;

    const titleEl = div.querySelector('.collapsible-title');
    const subtitleEl = div.querySelector('.collapsible-subtitle');
    const preEl = div.querySelector('pre');
    const scrollEl = div.querySelector('.code-scroll');
    const dotEl = div.querySelector('.indicator-dot');

    return {
        element: div,
        update(code, lines, streaming) {
            preEl.innerHTML = escapeHtml(code) + (streaming ? '<span class="code-cursor"></span>' : '');
            subtitleEl.textContent = `${lines} lignes \u00b7 JavaScript`;
            scrollEl.scrollTop = scrollEl.scrollHeight;
        },
        finish(code, lines) {
            preEl.innerHTML = escapeHtml(code);
            titleEl.innerHTML = `<span class="indicator-dot done"></span> Code genere`;
            subtitleEl.textContent = `${lines} lignes \u00b7 JavaScript \u00b7 pptxgenjs`;
            dotEl?.classList.add('done');
        }
    };
}

function toggleCollapsible(el) {
    el.classList.toggle('expanded');
    const toggleText = el.querySelector('.collapsible-toggle');
    if (toggleText) {
        const isExpanded = el.classList.contains('expanded');
        toggleText.innerHTML = `
            ${isExpanded ? 'Masquer' : 'Voir'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
            </svg>
        `;
    }
}

function addStatus(container, text, type) {
    const div = document.createElement('div');
    div.className = `status status-${type}`;

    const icons = {
        phase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    };

    div.innerHTML = (icons[type] || '') + `<span>${escapeHtml(text)}</span>`;
    container.appendChild(div);
    scrollToBottom();
}

// ==========================================
// DOWNLOAD
// ==========================================

function showDownloadToast() {
    downloadToast.classList.add('visible');
}

function hideDownloadToast() {
    downloadToast.classList.remove('visible');
}

async function downloadPptxFromCode() {
    if (!pptxCodeSessionId) {
        alert('Session expiree. Veuillez relancer la generation.');
        return;
    }

    const btn = document.getElementById('downloadBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Generation...';
    btn.disabled = true;

    try {
        const response = await fetch('/api/execute-pptx-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codeSessionId: pptxCodeSessionId }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Erreur de generation');
        }

        const blob = await response.blob();
        const disposition = response.headers.get('Content-Disposition');
        let filename = 'presentation.pptx';
        if (disposition) {
            const match = disposition.match(/filename="?([^"]+)"?/);
            if (match) filename = match[1];
        }

        downloadBlob(blob, filename);

        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Telecharge
        `;

        setTimeout(() => {
            btn.innerHTML = originalText;
            hideDownloadToast();
        }, 3000);

        pptxCodeSessionId = null;

    } catch (error) {
        alert('Erreur: ' + error.message);
        btn.innerHTML = originalText;
    } finally {
        btn.disabled = false;
    }
}

function downloadFromBase64(base64, filename) {
    const bytes = atob(base64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }
    const blob = new Blob([arr], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    });
    downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ==========================================
// COPY
// ==========================================

function copyCode(e) {
    if (e) e.stopPropagation();
    if (!pptxGeneratedCode) return;

    navigator.clipboard.writeText(pptxGeneratedCode).then(() => {
        const btn = document.querySelector('.btn-copy');
        if (btn) {
            const original = btn.innerHTML;
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copie
            `;
            setTimeout(() => {
                btn.innerHTML = original;
            }, 2000);
        }
    });
}

// ==========================================
// UTILS
// ==========================================

let userHasScrolledUp = false;

function initScrollDetection() {
    conversation.addEventListener('scroll', () => {
        const threshold = 100;
        const isAtBottom = conversation.scrollHeight - conversation.scrollTop - conversation.clientHeight < threshold;
        userHasScrolledUp = !isAtBottom;
    });
}

function scrollToBottom(force = false) {
    if (!userHasScrolledUp || force) {
        conversation.scrollTop = conversation.scrollHeight;
    }
}

function resetScrollBehavior() {
    userHasScrolledUp = false;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getTypeLabel(type) {
    return {
        formation: 'Formation',
        proposition: 'Proposition',
        rapport: 'Rapport',
        autre: 'General'
    }[type] || type;
}

// ==========================================
// EXPORTS
// ==========================================

window.downloadPptxFromCode = downloadPptxFromCode;
window.copyCode = copyCode;
window.toggleCollapsible = toggleCollapsible;

// Init
document.addEventListener('DOMContentLoaded', init);
