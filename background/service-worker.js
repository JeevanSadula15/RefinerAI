// RefineAI Background Service Worker

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are an intelligent communication refinement assistant called RefineAI.

Your task: Rewrite the user's text based on the selected audience and tone.

Rules:
- Maintain original intent and meaning completely
- Improve professionalism, clarity, and impact
- Never add unnecessary information or filler content
- Keep responses concise, natural, and human-sounding
- Correct grammar and spelling automatically
- Avoid robotic or overly formal AI-sounding language
- Respect the selected audience context deeply
- Match the energy and expectations of the target audience
- Preserve any specific details, names, dates, or numbers from the original

Only output the refined text. No explanations, no quotes around it, no prefixes like "Here's the refined version:". Just the refined text itself.`;

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'refine-with-refineai',
    title: 'Refine with RefineAI ✨',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'refine-with-refineai') {
    // Open side panel
    chrome.sidePanel.open({ tabId: tab.id });

    // Send selected text to side panel after a brief delay
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: 'SELECTED_TEXT',
        text: info.selectionText
      });
    }, 500);
  }
});

// Handle clicking the extension icon - open side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Listen for messages from side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REFINE_TEXT') {
    handleRefinement(message)
      .then(result => sendResponse({ success: true, text: result.text, usage: result.usage }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }

  if (message.type === 'SELECTED_TEXT_FROM_CONTENT') {
    // Forward to side panel
    chrome.runtime.sendMessage({
      type: 'SELECTED_TEXT',
      text: message.text
    });
  }
});

async function handleRefinement({ text, audience, tone, modifier }) {
  // Get API key from storage
  const { groqApiKey } = await chrome.storage.local.get('groqApiKey');

  if (!groqApiKey) {
    throw new Error('Please set your Groq API key in the settings (⚙️ icon).');
  }

  // Build the user prompt
  let userPrompt = buildUserPrompt(text, audience, tone, modifier);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your Groq API key in settings.');
    }
    if (response.status === 429) {
      throw new Error('Rate limit reached. Please wait a moment and try again.');
    }
    throw new Error(errorData.error?.message || `API error (${response.status})`);
  }

  const data = await response.json();
  return {
    text: data.choices[0]?.message?.content?.trim() || 'No response generated.',
    usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
  };
}

function buildUserPrompt(text, audience, tone, modifier) {
  let prompt = '';

  if (modifier) {
    // This is a follow-up modification
    switch (modifier) {
      case 'shorter':
        prompt = `Make this text significantly shorter and more concise while keeping the same tone and meaning:\n\n${text}`;
        break;
      case 'more_professional':
        prompt = `Rewrite this text to be more professional and polished:\n\n${text}`;
        break;
      case 'more_casual':
        prompt = `Rewrite this text to be more casual and relaxed:\n\n${text}`;
        break;
      case 'regenerate':
        prompt = `Rewrite this text in a fresh way while keeping the same intent, audience, and tone:\n\nAudience: ${audience}\nTone: ${tone}\n\nText:\n${text}`;
        break;
      default:
        prompt = `Refine the following text:\n\n${text}`;
    }
  } else {
    // Standard refinement
    prompt = `Audience: ${audience}\nTone: ${tone}\n\nRefine the following text:\n\n${text}`;
  }

  return prompt;
}
