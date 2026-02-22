<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" />
  <img src="https://img.shields.io/badge/Manifest-V3-34A853?style=for-the-badge&logo=googlechrome&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Groq%20API-F55036?style=for-the-badge&logo=lightning&logoColor=white" />
  <img src="https://img.shields.io/badge/Model-LLaMA%203.3%2070B-7C3AED?style=for-the-badge" />
</p>

<h1 align="center">✨ RefineAI – Smart Text Refinement</h1>

<p align="center">
  <b>A Chrome Extension that instantly refines, rewrites, and optimizes any selected text for different communication contexts using AI.</b>
</p>

<p align="center">
  <i>Your personal communication assistant — convert rough text into professional, casual, friendly, or platform-specific messages in seconds.</i>
</p>

---

## 🚀 What It Does

Select any text on any webpage → open RefineAI → choose your audience & tone → get a polished, refined version instantly.

| Feature | Description |
|---------|-------------|
| 🎯 **12 Refinement Styles** | Professional, Casual, Friendly, Formal, Student Message, Corporate Email, LinkedIn Style, WhatsApp Style, Polite Request, Short & Crisp, Confident Tone, Grammar Fix Only |
| 👥 **9 Audience Presets** | Teacher, Friend, Manager, Client, Team Member, Social Media, Student Group, HR/Recruiter + Custom |
| 🎤 **Speech-to-Text** | Speak your text instead of typing — uses Chrome's built-in speech recognition |
| 📊 **Token Usage Tracker** | See input/output/total tokens used per refinement |
| ⚡ **Action Buttons** | Copy, Regenerate, Shorter, More Professional, More Casual |
| 🖱️ **Context Menu** | Right-click selected text → "Refine with RefineAI" |
| ⌨️ **Keyboard Shortcut** | Ctrl+Enter to quickly refine |

---

## 🎯 Target Users

- 🎓 **Students** — Refine messages to professors, write better emails
- 💼 **Professionals** — Polish corporate communications
- 🚀 **Founders** — Craft impactful LinkedIn posts and investor emails
- 👨‍💻 **Developers** — Write clearer documentation and Slack messages
- 💬 **Everyone** — Improve any text for any context

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Chrome Manifest V3** | Extension framework |
| **JavaScript (Vanilla)** | Core logic — no frameworks, ultra-lightweight |
| **Groq API** | AI inference (blazing fast) |
| **LLaMA 3.3 70B Versatile** | Language model for text refinement |
| **Chrome Side Panel API** | Persistent right-side panel UI |
| **Web Speech API** | Speech-to-text (built-in, no extra API) |

---

## 📁 Project Structure

```
RefinerAI/
├── manifest.json              # Chrome Manifest V3 config
├── icons/
│   ├── icon16.png             # Toolbar icon
│   ├── icon48.png             # Extension page icon
│   └── icon128.png            # Chrome Web Store icon
├── background/
│   └── service-worker.js      # Groq API calls, context menu, message routing
├── content/
│   └── content.js             # Text selection detection on web pages
└── sidepanel/
    ├── sidepanel.html         # Side panel UI structure
    ├── sidepanel.css          # Premium dark theme styles
    └── sidepanel.js           # UI logic, speech-to-text, state management
```

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/JeevanSadula15/RefinerAI.git
```

### 2. Load in Chrome
1. Open Chrome → navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the cloned `RefinerAI` folder

### 3. Set Up API Key
1. Click the **RefineAI** icon in Chrome toolbar
2. The side panel opens → Settings auto-opens on first launch
3. Get a free API key from [console.groq.com/keys](https://console.groq.com/keys)
4. Paste your key → click **Save**
5. Done! You only need to do this once.

---

## 🎮 How to Use

### Method 1: Right-Click Context Menu
1. **Select text** on any webpage
2. **Right-click** → click **"Refine with RefineAI ✨"**
3. Side panel opens with text pre-filled
4. Choose **audience** and **tone**
5. Click **Refine Text**

### Method 2: Manual Input
1. Click the RefineAI icon to open the side panel
2. **Paste** or **type** your text (or use 🎤 **Speak**)
3. Select audience & tone → click **Refine Text**

### Method 3: Speech-to-Text
1. Open the side panel
2. Click the **🎤 Speak** button
3. Allow microphone access when prompted
4. Speak your message — it transcribes live!
5. Click **Stop** → then refine

---

## 🎨 UI Design

- **Theme**: Premium dark mode with blue/purple gradient accents
- **Font**: Inter (Google Fonts)
- **Style**: Glassmorphism cards, smooth transitions, micro-animations
- **Layout**: Full-height side panel (right side of Chrome)
- **Components**: Pill-style tone selectors, gradient CTA button with shimmer, frosted glass output card

---

## 🧠 AI System Prompt

The AI is configured with a specialized system prompt:

> *You are an intelligent communication refinement assistant. Rewrite the user's text based on the selected audience and tone. Maintain original intent, improve clarity and impact, correct grammar automatically, avoid robotic language, and keep responses concise and natural.*

---

## 📊 Token Usage

After each refinement, RefineAI displays:
- **Input Tokens** — tokens sent to the AI (your text + instructions)
- **Output Tokens** — tokens in the AI's response
- **Total Tokens** — combined usage

This helps you monitor your Groq API usage in real-time.

---

## 🗺️ Roadmap

### Phase 2 — Studio Mode
- **Student Studio** — auto-configured for academic communication
- **Professional Studio** — corporate tone presets
- **Creator Studio** — social media optimized
- **Developer Studio** — technical writing mode

### Future Features
- 🌍 Multi-language translation
- 📧 One-click email drafting
- 💬 WhatsApp reply suggestions
- 📝 Resume bullet improver
- 🧠 Context memory across sessions
- ⌨️ AI keyboard assistant
- 🔌 Offline mode

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Jeevan Sadula**
- GitHub: [@JeevanSadula15](https://github.com/JeevanSadula15)

---

<p align="center">
  <b>⭐ Star this repo if RefineAI helps you communicate better!</b>
</p>
