// RefineAI Content Script – Text Selection Detection

let lastSelectedText = '';

// Listen for text selection via mouseup
document.addEventListener('mouseup', (e) => {
    // Small delay to let selection finalize
    setTimeout(() => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText !== lastSelectedText && selectedText.length > 2) {
            lastSelectedText = selectedText;
            // Send to background/side panel
            chrome.runtime.sendMessage({
                type: 'SELECTED_TEXT_FROM_CONTENT',
                text: selectedText
            }).catch(() => {
                // Side panel might not be open yet, that's okay
            });
        }
    }, 50);
});

// Listen for keyboard selection (Shift+Arrow, Ctrl+A, etc.)
document.addEventListener('keyup', (e) => {
    if (e.shiftKey || e.ctrlKey) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText !== lastSelectedText && selectedText.length > 2) {
            lastSelectedText = selectedText;
            chrome.runtime.sendMessage({
                type: 'SELECTED_TEXT_FROM_CONTENT',
                text: selectedText
            }).catch(() => { });
        }
    }
});

// Listen for requests to replace selected text on the page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'REPLACE_SELECTED_TEXT') {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const activeElement = document.activeElement;

            // Check if selection is in an input/textarea
            if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;
                const value = activeElement.value;
                activeElement.value = value.substring(0, start) + message.text + value.substring(end);
                activeElement.selectionStart = start;
                activeElement.selectionEnd = start + message.text.length;
                // Dispatch input event so frameworks detect the change
                activeElement.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (activeElement && activeElement.isContentEditable) {
                // ContentEditable elements
                range.deleteContents();
                range.insertNode(document.createTextNode(message.text));
            } else {
                // Regular page text - can't really replace, but we can try
                range.deleteContents();
                range.insertNode(document.createTextNode(message.text));
            }
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, error: 'No selection found' });
        }
        return true;
    }
});
