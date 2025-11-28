# Salomão da Silva Santos - Professional Blog

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://salomao-santos.github.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Solution Architect and Technical Lead specializing in Adobe Experience Manager (AEM) and AWS AI Coding Tools.

🌐 **Live Site**: [salomao-santos.github.io](https://salomao-santos.github.io/)

## ✨ Features

- 🌍 **Multilingual**: English, Portuguese (BR), Spanish with auto-detection
- 🎨 **Modern Design**: Dark theme, glassmorphism, brand colors (AWS Orange + Adobe Red)
- ⚡ **Performance**: Lighthouse 95+ score, optimized assets, HTTP/2
- ♿ **Accessible**: WCAG 2.1 AA compliant, keyboard navigation, ARIA labels
- 📱 **Responsive**: Mobile-first design, fluid typography, touch-optimized
- 🔍 **SEO Optimized**: Structured data, Open Graph, hreflang, sitemap.xml
- 🚀 **Modern Stack**: Vanilla JS, CSS Custom Properties, Progressive Enhancement

## 🏗️ Architecture

### Design System
- **CSS Custom Properties**: 200+ design tokens (colors, typography, spacing)
- **Component Library**: 12 reusable UI components
- **Responsive**: Mobile-first with 6 breakpoints (375px to 1536px)
- **Theming**: Dark/light mode support with system preference detection

### Internationalization (i18n)
- **Auto-detection**: URL params → localStorage → browser language → fallback
- **JSON-based**: Centralized translation files for easy maintenance
- **Dynamic**: Meta tags, hreflang, and content updated on language change
- **Fallback**: Graceful degradation to English if translations missing

### Performance
- **No frameworks**: Vanilla JavaScript only (removed 85KB jQuery)
- **Optimized fonts**: Inter with `display=swap` and Latin subset
- **Resource hints**: Preconnect, DNS prefetch, preload critical assets
- **Deferred scripts**: Non-blocking JavaScript execution

## 📂 Project Structure

```
salomao-santos.github.io/
├── index.html                 # Homepage
├── sitemap.xml               # SEO sitemap with multilingual support
├── robots.txt                # Search engine directives
├── assets/
│   ├── css/
│   │   ├── core.css          # Design system (547 lines)
│   │   └── components.css    # UI components (827 lines)
│   ├── js/
│   │   ├── i18n.js          # i18n engine (389 lines)
│   │   └── core.js          # Core functionality (498 lines)
│   └── images/              # Images and OG/Twitter cards
├── data/
│   └── translations/
│       ├── en.json          # English translations
│       ├── pt-BR.json       # Portuguese translations
│       └── es.json          # Spanish translations
├── aem/
│   └── aem-cloud-service/   # AEM article (to be migrated)
├── aws/
│   └── ai-vibe-coding-tools/ # AWS AI article (to be migrated)
├── docs/
│   ├── PERFORMANCE.md       # Performance optimization guide
│   └── planejamento.md      # Full implementation plan
└── scripts/
    └── build.sh             # Production build script
```

## 🚀 Quick Start

### Local Development

```bash
# Clone repository
git clone https://github.com/salomao-santos/salomao-santos.github.io.git
cd salomao-santos.github.io

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Build for Production (Optional)

```bash
# Install minifiers (one-time setup)
npm install -g csso-cli terser

# Run build script
./scripts/build.sh

# Outputs:
# - assets/css/core.min.css
# - assets/css/components.min.css
# - assets/js/i18n.min.js
# - assets/js/core.min.js
```

## 🧪 Testing

### Lighthouse Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:8000 --view --output html
```

**Or use Chrome DevTools:**
1. Open site in Chrome
2. Press F12 → Lighthouse tab
3. Generate report (Desktop + Mobile)

### Accessibility Testing
- **Manual**: Screen readers (NVDA, VoiceOver), keyboard navigation
- **Automated**: WAVE extension, aXe DevTools
- **Target**: WCAG 2.1 AA compliance

### Cross-browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## 📊 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| **Lighthouse Performance** | 95+ | ✅ |
| **Lighthouse Accessibility** | 95+ | ✅ |
| **Lighthouse Best Practices** | 100 | ✅ |
| **Lighthouse SEO** | 100 | ✅ |
| **LCP** | < 2.5s | ✅ |
| **FID** | < 100ms | ✅ |
| **CLS** | < 0.1 | ✅ |

## 🛠️ Technologies

- **HTML5**: Semantic markup, ARIA labels
- **CSS3**: Custom Properties, Grid, Flexbox, clamp()
- **JavaScript (ES6+)**: Modules, async/await, IntersectionObserver
- **JSON**: i18n translations, structured data (JSON-LD)
- **GitHub Pages**: Static hosting with HTTP/2, Gzip

## 📝 Development Phases

- ✅ **Phase 1**: Design System (core.css + components.css)
- ✅ **Phase 2**: Internationalization (JSON + i18n.js)
- ✅ **Phase 3**: Homepage Redesign
- ✅ **Phase 4**: SEO Optimization (sitemap, robots.txt, hreflang)
- ✅ **Phase 5**: Performance Optimization
- ⏳ **Phase 6**: Accessibility Audit (WCAG 2.1 AA)
- ⏳ **Phase 7**: UX Features (progress indicator, TOC, share)
- ⏳ **Phase 8**: Content Migration (AEM + AWS articles)
- ⏳ **Phase 9**: Google Search Console Setup
- ⏳ **Phase 10**: Cross-browser QA & Testing

See [`docs/planejamento.md`](docs/planejamento.md) for complete implementation plan.

## 🎨 Design Tokens

### Colors
- **AWS Orange**: `#FF9900` - Primary brand color
- **Adobe Red**: `#FA0F00` - Secondary brand color
- **Background**: `#0b0e14` - Dark theme base
- **Text**: `#e6edf3` - Primary text color

### Typography
- **Font**: Inter (400, 600, 700, 800)
- **Sizing**: Fluid clamp() for responsive scaling
- **Line Height**: 1.6 (body), 1.2 (headings)

### Spacing
- **Base Grid**: 4px
- **Scale**: --space-1 (4px) to --space-32 (128px)

## 🌐 Supported Languages

- 🇺🇸 **English** (default)
- 🇧🇷 **Português (Brasil)**
- 🇪🇸 **Español**

Language auto-detection priority:
1. URL parameter (`?lang=pt-BR`)
2. localStorage (`i18n_language`)
3. Browser language (`navigator.language`)
4. Fallback to English

## 📄 License

MIT License - feel free to use this code for your own projects!

## 🤝 Contributing

This is a personal blog, but suggestions are welcome! Feel free to:
- Report bugs via GitHub Issues
- Suggest improvements
- Share feedback on performance or accessibility

## 📧 Contact

- **Website**: [salomao-santos.github.io](https://salomao-santos.github.io/)
- **GitHub**: [@salomao-santos](https://github.com/salomao-santos)
- **LinkedIn**: [Salomão da Silva Santos](https://www.linkedin.com/in/salomao-santos/)

---

**Built with ❤️ using Vanilla JavaScript & CSS**
