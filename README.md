# Storyframe Studio

**AI-Powered Creative Workspace** — Generate multi-panel storyboards and stunning images using 30+ AI models through the [Pollinations API](https://gen.pollinations.ai/docs).

![Version](https://img.shields.io/badge/version-2.0.0-8b5cf6)
![License](https://img.shields.io/badge/license-MIT-06b6d4)
![BYOK](https://img.shields.io/badge/BYOK-Bring%20Your%20Own%20Key-green)

## Features

### 🎬 Storyboard Mode
- Generate 4, 6, or 8 panel visual narratives from a text description
- AI-powered scene decomposition using 30+ language models
- Multiple art styles: Cinematic, Graphic Novel, Manga, Cyberpunk, Noir, Ghibli, Renaissance, Pixel Art
- Download individual panels

### 🖼️ Image Studio
- Single image generation with fine-grained control
- Choose from 20+ image generation models (Flux, GPT Image, NanoBanana, Kontext, and more)
- Custom dimensions (512–1536px)
- Reproducible results with seed control

### 🗂️ Session Gallery
- All generated images collected in a browsable gallery
- Lightbox viewer with metadata
- Session-scoped — no server storage, no costs

### 🔐 BYOK / BYOP Architecture
- **Bring Your Own Key**: Paste your API key or sign in via OAuth
- Zero server costs — users pay for their own AI usage
- Session-only storage — nothing persists after closing the tab
- Your key never leaves your browser

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS (no frameworks, no build step) |
| Design | Custom CSS design system with glassmorphism, CSS custom properties |
| API | [Pollinations API](https://gen.pollinations.ai/docs) (OpenAI-compatible) |
| Auth | Pollinations OAuth + manual key entry |
| Hosting | Firebase Hosting |
| Storage | `sessionStorage` (browser session only) |

## Architecture

```
storyframe-studio/
├── index.html              # Main app shell (single page)
├── css/
│   ├── design-system.css   # Design tokens, components, animations
│   └── styles.css          # Page layouts and component styles
├── js/
│   ├── storage.js          # Session storage manager
│   ├── auth.js             # BYOP OAuth + key management
│   ├── models.js           # Dynamic model fetcher
│   ├── api.js              # API client (text + image generation)
│   ├── gallery.js          # Gallery module with lightbox
│   ├── ui.js               # UI manager (toasts, navigation, rendering)
│   └── app.js              # Application controller
├── assets/
│   └── favicon.svg         # App icon
├── firebase.json           # Firebase Hosting config
├── README.md
├── LICENSE
└── CHANGELOG.md
```

## Getting Started

### Prerequisites
- A [Pollinations API key](https://enter.pollinations.ai/)

### Run Locally
No build step required. Just serve the files:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

### Deploy to Firebase
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

## API Reference

This application uses the [Pollinations API](https://gen.pollinations.ai/docs):

- **Text Generation**: `POST /v1/chat/completions` (OpenAI-compatible)
- **Image Generation**: `GET /image/{prompt}` with model, size, and seed params
- **Models**: `GET /text/models` and `GET /image/models` (no auth required)
- **Auth**: OAuth flow via `enter.pollinations.ai/authorize`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

Built with the [Pollinations API](https://pollinations.ai) · Zero server costs · Your key, your pollen, your art.
