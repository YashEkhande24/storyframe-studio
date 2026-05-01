# Changelog

## [2.0.0] - 2026-05-01

### Added
- **Multi-page workspace** with sidebar navigation (Storyboard, Image Studio, Gallery, Settings)
- **Dynamic model selectors** fetched live from the Pollinations API (30+ text models, 20+ image models)
- **Image Studio** mode for single image generation with dimension and seed controls
- **Session Gallery** with lightbox viewer for all generated images
- **BYOP OAuth integration** — sign in with Pollinations account
- **Manual API key entry** as alternative to OAuth
- **Toast notification system** for user feedback
- **Account balance display** showing pollen balance
- **User profile display** with avatar and tier information
- **8 art style presets** including Cinematic, Manga, Cyberpunk, Renaissance, Pixel Art
- **Variable panel count** — generate 4, 6, or 8 panel storyboards
- **Custom CSS design system** with glassmorphism, animations, and dark mode
- **SVG favicon** and meta tags for SEO
- **Responsive design** for mobile devices
- **Keyboard shortcuts** (Ctrl+Enter to generate)

### Changed
- Complete visual redesign from basic Tailwind to premium vanilla CSS
- Replaced hardcoded model list with dynamic API-fetched models
- Switched from localStorage to sessionStorage (zero persistence)
- Rewrote all JavaScript modules for modularity

### Removed
- Tailwind CSS CDN dependency
- Lucide Icons CDN dependency (replaced with inline SVG)
- localStorage persistence (now session-only)

## [1.0.0] - 2026-05-01

### Added
- Initial release: 4-panel storyboard generator
- Basic BYOK with API key input
- Hardcoded model selector (6 models)
- Simple grid layout
