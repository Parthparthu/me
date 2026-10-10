# Pradyumna: Personal Developer Portfolio

> Engineering portfolio developed using Next.js 15, React 19, TypeScript, and Three.js.

## Overview
This repository contains the source code for Pradyumna's personal portfolio website, deployed via GitHub Actions to GitHub Pages.

- **Developer**: Pradyumna
- **Status**: First-Year B.Tech Student, Computer Science & Engineering (AI/ML) at GL Bajaj Institute of Technology and Management, Greater Noida (2026-Present)
- **Distinction**: World Memory Championship Bronze Medalist (2023)
- **Website URL**: https://parthparthu.github.io/me/
- **Contact**: pradyumna05@outlook.in

---

## Technical Stack
- **Framework**: Next.js 15 (App Router, Static Export)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS, CSS Custom Properties
- **3D Graphics**: Three.js, React Three Fiber, Drei (Ambient rendering, pause when offscreen)
- **Motion**: Framer Motion (respects prefers-reduced-motion)
- **Icons**: Lucide React
- **Typography**: Inter (Body), Space Grotesk (Display), JetBrains Mono (Code/Metrics)

---

## Architecture and Design Principles
1. **Calm and Restrained Aesthetics**: One neutral slate family (`#0b0f17` background) paired with a technical sky-blue accent (`#0ea5e9`). Zero purple or AI gradient schemes.
2. **Accessible Interfaces**: WCAG AA contrast on all glass surfaces, full keyboard navigation with visible focus rings (`:focus-visible`), native system cursor, and strict 8px to 14px border radii.
3. **Static Export**: Pre-rendered at build time with `output: 'export'` for fast delivery over GitHub Pages.
4. **Verifiable Information**: Factually accurate project case studies, real GitHub repository references, and verified achievements.

---

## Project Structure
```text
Portfolio/
├── app/
│   ├── api/contact/        # Contact route (serverless)
│   ├── privacy/            # Privacy Policy page
│   ├── terms/              # Terms and Conditions page
│   ├── projects/           # Project directory and individual case studies
│   ├── resume/             # Interactive Curriculum Vitae
│   ├── globals.css         # Design tokens and utilities
│   ├── layout.tsx          # Root layout and metadata
│   ├── page.tsx            # Main single-page scroll layout
│   └── sitemap.ts          # XML sitemap generator
├── components/
│   ├── canvas/             # Ambient Three.js 3D background
│   ├── common/             # Client overlays and smooth scroll provider
│   ├── glass/              # LiquidGlass components and SVG refraction filters
│   ├── layout/             # Header dock navigation and Footer
│   ├── sections/           # Hero, Work, About, Skills, Journey, Contact
│   └── ui/                 # Command palette, Theme toggle, Back to top
├── data/
│   ├── achievements.ts     # Verified honors and milestones
│   ├── journey.ts          # Engineering timeline
│   ├── profile.ts          # Core biography and background facts
│   ├── projects.ts         # 9 production projects with case studies
│   ├── skills.ts           # Technical competencies and toolchains
│   └── socials.ts          # Confirmed contact channels
├── public/                 # Favicons, vector assets, and web manifest
└── scripts/                # Automated verification suites
```

---

## Verification Suites
Automated scripts are included to guarantee code standards, accessibility, and content integrity:

```bash
# Run standards check (em dashes, banned phrases, color tokens, button radii)
node scripts/verify-standards.cjs

# Run full project scan
node scripts/verify-all.cjs

# Run TypeScript type check
npm run typecheck

# Run production build
npm run build
```

---

## License
Original code and documentation copyright &copy; Pradyumna. Case studies and open-source project repositories are licensed under their respective repository terms.
