// ============================================
// RefineAI – Side Panel Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Element References
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const toggleKeyVisibility = document.getElementById('toggleKeyVisibility');
    const saveApiKey = document.getElementById('saveApiKey');
    const inputText = document.getElementById('inputText');
    const pasteBtn = document.getElementById('pasteBtn');
    const clearBtn = document.getElementById('clearBtn');
    const audienceSelect = document.getElementById('audienceSelect');
    const customAudience = document.getElementById('customAudience');
    const toneGrid = document.getElementById('toneGrid');
    const refineBtn = document.getElementById('refineBtn');
    const outputSection = document.getElementById('outputSection');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const shorterBtn = document.getElementById('shorterBtn');
    const moreProfBtn = document.getElementById('moreProfBtn');
    const moreCasualBtn = document.getElementById('moreCasualBtn');
    const errorMsg = document.getElementById('errorMsg');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');

    // State
    let selectedTone = 'Professional';
    let isRefining = false;
    let lastOriginalText = '';
    let lastRefinedText = '';

    // ==================== INIT ====================
    loadApiKey();

    // ==================== SETTINGS ====================
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('visible');
        settingsPanel.classList.toggle('hidden');
    });

    toggleKeyVisibility.addEventListener('click', () => {
        const isPassword = apiKeyInput.type === 'password';
        apiKeyInput.type = isPassword ? 'text' : 'password';
    });

    saveApiKey.addEventListener('click', async () => {
        const key = apiKeyInput.value.trim();
        if (!key) {
            showToast('Please enter an API key', true);
            return;
        }
        await chrome.storage.local.set({ groqApiKey: key });
        showToast('API key saved!');
        // Close settings after saving
        setTimeout(() => {
            settingsPanel.classList.remove('visible');
            settingsPanel.classList.add('hidden');
        }, 800);
    });

    async function loadApiKey() {
        const { groqApiKey } = await chrome.storage.local.get('groqApiKey');
        if (groqApiKey) {
            apiKeyInput.value = groqApiKey;
        } else {
            // Auto-open settings if no key is set
            settingsPanel.classList.add('visible');
            settingsPanel.classList.remove('hidden');
        }
    }

    // ==================== TEXT INPUT ====================
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                inputText.value = text;
                inputText.focus();
                showToast('Pasted from clipboard');
            }
        } catch (err) {
            showToast('Unable to paste. Check permissions.', true);
        }
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        hideOutput();
        hideError();
        inputText.focus();
    });

    // ==================== SPEECH TO TEXT ====================
    const micBtn = document.getElementById('micBtn');
    const micBtnText = document.getElementById('micBtnText');
    let recognition = null;
    let isRecording = false;

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalTranscript = '';

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            // Show live transcription in the textarea
            const existingText = inputText.value.replace(/\s*🎤.*$/, ''); // Remove previous interim
            if (interimTranscript) {
                inputText.value = (existingText ? existingText + ' ' : '') + finalTranscript + '🎤 ' + interimTranscript;
            } else {
                inputText.value = (existingText ? existingText + ' ' : '') + finalTranscript;
            }
        };

        recognition.onend = () => {
            if (isRecording) {
                // Auto-restart if still recording (handles Chrome's auto-stop)
                recognition.start();
            } else {
                stopRecording();
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech') return; // Ignore no-speech
            stopRecording();
            if (event.error === 'not-allowed') {
                showToast('Microphone access denied. Check permissions.', true);
            } else {
                showToast('Speech recognition error: ' + event.error, true);
            }
        };

        micBtn.addEventListener('click', async () => {
            if (isRecording) {
                isRecording = false;
                recognition.stop();
                stopRecording();
            } else {
                // Explicitly request microphone permission first
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    // Stop the stream immediately — SpeechRecognition manages its own audio
                    stream.getTracks().forEach(track => track.stop());
                } catch (err) {
                    showToast('Microphone access denied. Please allow mic access.', true);
                    return;
                }
                finalTranscript = '';
                isRecording = true;
                micBtn.classList.add('recording');
                micBtnText.textContent = 'Stop';
                showToast('🎤 Listening... Speak now!');
                recognition.start();
            }
        });
    } else {
        // Browser doesn't support Speech Recognition
        micBtn.addEventListener('click', () => {
            showToast('Speech recognition not supported in this context.', true);
        });
    }

    function stopRecording() {
        isRecording = false;
        micBtn.classList.remove('recording');
        micBtnText.textContent = 'Speak';
        // Clean up any interim markers
        inputText.value = inputText.value.replace(/\s*🎤\s*/g, '').trim();
    }

    // ==================== AUDIENCE SELECTOR ====================
    audienceSelect.addEventListener('change', () => {
        if (audienceSelect.value === 'Custom') {
            customAudience.classList.remove('hidden');
            customAudience.focus();
        } else {
            customAudience.classList.add('hidden');
        }
    });

    // ==================== TONE SELECTOR ====================
    toneGrid.addEventListener('click', (e) => {
        const pill = e.target.closest('.tone-pill');
        if (!pill) return;

        // Remove active from all
        toneGrid.querySelectorAll('.tone-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedTone = pill.dataset.tone;
    });

    // ==================== REFINE ====================
    refineBtn.addEventListener('click', () => {
        refineText();
    });

    // Keyboard shortcut: Ctrl+Enter to refine
    inputText.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            refineText();
        }
    });

    async function refineText(modifier = null) {
        const text = modifier ? lastRefinedText : inputText.value.trim();

        if (!text) {
            showError('Please enter or select some text to refine.');
            return;
        }

        if (isRefining) return;

        isRefining = true;
        hideError();
        setRefineLoading(true);

        const audience = audienceSelect.value === 'Custom'
            ? (customAudience.value.trim() || 'General')
            : audienceSelect.value;

        try {
            const response = await chrome.runtime.sendMessage({
                type: 'REFINE_TEXT',
                text: text,
                audience: audience,
                tone: selectedTone,
                modifier: modifier
            });

            if (response.success) {
                lastOriginalText = inputText.value.trim();
                lastRefinedText = response.text;
                showOutput(response.text);
                if (response.usage) {
                    showTokenUsage(response.usage);
                }
            } else {
                showError(response.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            showError('Connection error. Please check your API key and try again.');
        } finally {
            isRefining = false;
            setRefineLoading(false);
        }
    }

    // ==================== OUTPUT ACTIONS ====================
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(lastRefinedText);
            showToast('Copied to clipboard!');
        } catch (err) {
            // Fallback copy
            const textarea = document.createElement('textarea');
            textarea.value = lastRefinedText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Copied to clipboard!');
        }
    });

    regenerateBtn.addEventListener('click', () => {
        refineText('regenerate');
    });

    shorterBtn.addEventListener('click', () => {
        refineText('shorter');
    });

    moreProfBtn.addEventListener('click', () => {
        refineText('more_professional');
    });

    moreCasualBtn.addEventListener('click', () => {
        refineText('more_casual');
    });

    // ==================== MESSAGE LISTENER ====================
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'SELECTED_TEXT') {
            inputText.value = message.text;
            // Auto-scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Pulse the input to draw attention
            inputText.style.borderColor = 'var(--accent-1)';
            inputText.style.boxShadow = '0 0 0 3px var(--accent-glow)';
            setTimeout(() => {
                inputText.style.borderColor = '';
                inputText.style.boxShadow = '';
            }, 1500);
        }
    });

    // ==================== HELPERS ====================
    function setRefineLoading(loading) {
        const content = refineBtn.querySelector('.btn-refine-content');
        const loadingEl = refineBtn.querySelector('.btn-refine-loading');

        if (loading) {
            content.classList.add('hidden');
            loadingEl.classList.remove('hidden');
            refineBtn.disabled = true;
        } else {
            content.classList.remove('hidden');
            loadingEl.classList.add('hidden');
            refineBtn.disabled = false;
        }
    }

    function showOutput(text) {
        outputText.textContent = text;
        outputSection.classList.remove('hidden');
        // Smooth scroll to output
        setTimeout(() => {
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    function showTokenUsage(usage) {
        const tokenUsage = document.getElementById('tokenUsage');
        document.getElementById('inputTokens').textContent = usage.prompt_tokens || 0;
        document.getElementById('outputTokens').textContent = usage.completion_tokens || 0;
        document.getElementById('totalTokens').textContent = usage.total_tokens || 0;
        tokenUsage.classList.remove('hidden');
    }

    function hideOutput() {
        outputSection.classList.add('hidden');
        outputText.textContent = '';
        lastRefinedText = '';
        document.getElementById('tokenUsage').classList.add('hidden');
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
    }

    function hideError() {
        errorMsg.classList.add('hidden');
        errorMsg.textContent = '';
    }

    function showToast(message, isError = false) {
        toastText.textContent = message;
        toast.style.borderColor = isError
            ? 'rgba(239, 68, 68, 0.3)'
            : 'rgba(34, 197, 94, 0.3)';
        toast.style.color = isError ? '#fca5a5' : '#86efac';
        toast.classList.remove('hidden');
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 2500);
    }
});
