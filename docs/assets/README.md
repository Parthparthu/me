# Documentation Assets

This directory contains self-hosted SVG graphics, icons, and real screenshots for `README.md`.

## Color Palette

All assets adhere strictly to the repository visual palette:
- **Primary Sky Blue**: `#0ea5e9`, `#0284c7`, `#38bdf8`
- **Supporting Emerald**: `#10b981`, `#059669`, `#34d399`
- **Supporting Amber**: `#f59e0b`, `#d97706`, `#fbbf24`
- **Dark Neutral Base**: `#080c14`, `#0f172a`, `#1e293b`
- **Light Neutral Base**: `#f8fafc`, `#f1f5f9`, `#cbd5e1`

## Regenerating Visuals

### 1. Generating Screenshots

Screenshots are captured automatically from a running production build using Chrome / Edge DevTools Protocol (CDP):

```bash
# Step 1: Ensure the production build is served locally on port 3000
npm run build
npx serve out -l 3000

# Step 2: In a separate terminal, execute the capture script
node scripts/capture-readme-assets.mjs
```

The script captures:
- `screenshot-dark-hero.png` (Desktop 1440x900 Dark Mode)
- `screenshot-light-hero.png` (Desktop 1440x900 Light Mode)
- `screenshot-dark-palette.png` (Command Palette Dark Mode)
- `screenshot-light-palette.png` (Command Palette Light Mode)
- `screenshot-dark-projects.png` (Projects Grid Dark Mode)
- `screenshot-light-projects.png` (Projects Grid Light Mode)
- `screenshot-mobile-dark.png` (Mobile 390x844 Dark Mode)
- `screenshot-mobile-light.png` (Mobile 390x844 Light Mode)

### 2. SVG Vectors and Icons

All SVGs (`hero-banner-*.svg`, `architecture-*.svg`, `divider-*.svg`, and `icons/*.svg`) are authored as pure vector code. They contain zero external dependencies and render responsively in GitHub dark and light modes.
