# Plaimanas — Frontend Developer Assessment

A responsive single-page website for a fashion brand, built with vanilla HTML, CSS, and JavaScript.

## 📸 Preview

The site includes a hero video banner, collection showcases, FAQ accordion, contact form, and a newsletter footer.

## 🗂 Project Structure

```
Frontend-Test/
├── index.html            # Main HTML page
├── css/
│   └── style.css         # All styles (desktop + mobile responsive)
├── js/
│   └── main.js           # All interactive logic
└── assets/
    ├── icons/             # SVG icons, favicon, logo
    ├── images/hero/       # Hero banner, collection images
    │   └── mobile/        # Mobile-specific images
    └── videos/            # Hero banner & collection videos
```

## ✨ Features

| Section | Description |
|---------|-------------|
| **Navbar** | Fixed navigation with language dropdown, editorial submenu, and hamburger for mobile |
| **Logo** | Full-width SVG logo that scales down on scroll (desktop only) |
| **Hero** | Image fallback with autoplay video overlay |
| **Collections** | Sticky text overlay that follows scroll position, image/video hover swap |
| **Collection Grid** | Responsive 2-column grid with hover-to-reveal image & video effects |
| **Scrolling Text** | Infinite marquee animation with reverse direction |
| **Feature Quotes** | 3-column grid highlighting brand values |
| **FAQ** | Badge-based category filter with accordion toggle |
| **Contact Form** | Floating label inputs, custom select dropdown, radio & checkbox controls |
| **Footer** | 5-column grid with newsletter subscription input |

## 🛠 Tech Stack

- **HTML5** — Semantic markup, `<picture>` for responsive images
- **CSS3** — CSS custom properties, Grid, Flexbox, keyframe animations, media queries
- **JavaScript (ES6)** — DOM manipulation, `requestAnimationFrame` scroll throttling, event delegation

## 🚀 Getting Started

No build tools required. Open the project with any local server:

```bash
# Using VS Code Live Server
# Right-click index.html → "Open with Live Server"

# Or with Python
python3 -m http.server 8000

# Or with Node.js
npx serve .
```

Then open `http://localhost:8000` in your browser.

## 📱 Responsive Design

The site is responsive with a breakpoint at **768px**:

- **Desktop** — Full navigation, 3-column feature grid, side-by-side form layout
- **Mobile** — Hamburger menu with slide-down panel, single-column layouts, smaller typography

## 📂 Key Implementation Details

### Scroll-based Logo Scaling
The logo shrinks proportionally as the user scrolls past the hero video midpoint, using `requestAnimationFrame` for smooth 60fps animation.

### Sticky Collection Text
Text overlays on collection images follow the user's scroll position, clamped between the image's vertical center and bottom edge.

### FAQ Accordion
Categories are filtered via badge buttons. Clicking a question toggles its answer with a max-height CSS transition. Only one answer is open at a time.

### Custom Select Dropdown
A fully custom `<select>` replacement with floating label animation, built entirely with HTML/CSS/JS — no library dependencies.
