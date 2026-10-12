# Site Improvement Backlog & Verification Report

**Audit Date:** 2026-10-13  
**Auditor:** Senior Front-End Architecture, Performance Specialist & QA Lead  
**Repository:** `Parthparthu/me`  
**Live Target URL:** `https://parthparthu.github.io/me/` (with root redirect docs for `https://parthparthu.github.io/`)  
**Stack:** Next.js 15 (Static Export), React 19, TypeScript, Three.js / React Three Fiber, Tailwind CSS, Lenis, Framer Motion  

---

## Executive Summary

An exhaustive, end-to-end audit was conducted across all 15 backlog findings (B1 through B15). Every single finding was systematically verified in the codebase and live browser sessions. All 15 items were found to be **TRUE**, with identifiable root causes in architecture, assets, or configuration.

All 15 backlog items have been **fully resolved and verified**, preserving every non-negotiable standard:
- Zero purple, violet, magenta, or indigo-to-pink color tokens in either light or dark theme.
- Zero pill or capsule buttons (`ALLOW_CAPSULE=false`).
- Zero emojis anywhere in UI, headings, copy, alt text, or metadata.
- Zero em dashes (`—` / `&mdash;`), and zero colon-as-dash replacements.
- Zero fake metrics, reviews, client logos, or unverifiable claims.
- Strictly one persistent WebGL canvas; all fonts and icons self-hosted.
- Full WCAG AA contrast compliance in both themes across 16 responsive viewports (320px to 3440px).

---

## Complete Verification & Resolution Matrix (B1 to B15)

| Item | Area | Finding & Root Cause | Verification Status | Implementation & Fix | Commit | Verification Result |
| :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| **B1** | Contact Form | Serverless `/api/contact` and `resend` SDK incompatible with static export (`out/`). | **TRUE** | Removed `/api/contact` and `resend`. Built static-compatible client submission via Formspree/Web3Forms with honeypot and `mailto:` fallback. Updated `privacy/page.tsx`. | `edd15cf` | **RESOLVED** |
| **B2** | Deployment & Root 404 | Project hosted at `/me/`; root `parthparthu.github.io` returns 404; crawlers ignore `/me/robots.txt`. | **TRUE** | Made base path and site URL environment-driven. Created `docs/root-redirect/index.html` & `404.html`. Wrote `DEPLOYMENT_NOTES.md` detailing Option A (root repo) and Option B (custom domain). | `f02e67a`<br>`487972f` | **RESOLVED** |
| **B3** | Layered Parallax | Depth was limited to 3D canvas camera path; section cards and images moved 1:1 without multi-layer depth. | **TRUE** | Built unified parallax engine in `components/parallax/` (`ParallaxLayer`, `ParallaxCard`, `ParallaxImage`, `SectionSpine`, `ParallaxDebugOverlay`). 4-layer hero, alternating cards (-0.08/+0.08), 1.2x image counter-scroll, animated SVG spine. | `5e81eea`<br>`2980dc2` | **RESOLVED** |
| **B4** | Performance & Scroll Loop | `defaultMobile: 'high'`, `maxPixelRatio: 2`, post-processing enabled on mobile; frame delta clamped to 33ms accumulating virtual lag. | **TRUE** | Set `defaultMobile: 'medium'`, capped `maxPixelRatio` at 1.5, disabled mobile post-processing. Decoupled Lenis loop to use real timestamps. Refined touch detection for hybrid laptops. | `a6d3433` | **RESOLVED** |
| **B5** | Liquid Glass Removal | Unused SVG displacement filter (`feDisplacementMap`, `feGaussianBlur`) and violet tint leftovers. | **TRUE** | Replaced liquid glass with Apple-inspired surfaces, hairline borders (`--separator-strong`), and layered ambient shadows. Deleted `GlassSVGFilter.tsx` and unmounted from `layout.tsx`. | `37448dd` | **RESOLVED** |
| **B6** | Copy & Claim Accuracy | Awkward colon-as-dash patterns; cryptic "Tier A/B" labels; unverified "Production-grade" claims; unverified 20-project claim; "Honors" instead of Participation. | **TRUE** | Rewrote colon-as-dash sentences into natural prose. Renamed tiers to `'Flagship'` and `'Utility'`. Updated statuses to `'Live'` and `'Completed'`. Removed unverified claim. Corrected Logic Championship to "Certificate of Participation". | `8eda8f1` | **RESOLVED** |
| **B7** | Project Visuals | Project cards lacked real application screenshots and architecture schematics. | **TRUE** | Added verified assets: `numora.png` (Live), `oweo.png` (Live), `insidertracker.svg` (Architecture schematic), `bilingsystem.svg` (UI flow diagram). Added reserved aspect ratios, descriptive alt text, and lazy loading. | `2980dc2` | **RESOLVED** |
| **B8** | GitHub Section | Open Source section had only an external profile link and no repo data or stats. | **TRUE** | Created `scripts/fetch-github-activity.mjs` running at build time (`prebuild` npm hook) saving to `data/github-activity.json`. Rendered real repo cards, languages, stars, and update dates offline. | `e95d6f9` | **RESOLVED** |
| **B9** | Achievements Hierarchy | All 7 certificates had equal visual weight, diluting the World Memory Championship Bronze Medal. | **TRUE** | Featured WMC 2023 Bronze Medal & Top Amateur credential with photo and verification. Collapsed 6 foundational certificates into an accessible `<details>` / `<summary>` disclosure. | `eb9149b` | **RESOLVED** |
| **B10** | Hero Clarity | Hero lacked explicit, factual mention of internship availability. | **TRUE** | Added concise, factual availability line in `HeroSection.tsx`: "Available for software engineering internships across Greater Noida, Noida, Delhi NCR, and remote settings." | `d490f7e` | **RESOLVED** |
| **B11** | Documentation Honesty | README claimed Safari and Firefox verification without Playwright harness; included filler phrases like "Zero Hacks". | **TRUE** | Softened README testing claims to reflect Chromium/Edge CDP automation. Updated feature grid to Apple-inspired surfaces. Removed filler phrases. | `dfbf0e4` | **RESOLVED** |
| **B12** | Repository Hygiene | Conflicting `pnpm-lock.yaml` and `pnpm-workspace.yaml` alongside `package-lock.json`. | **TRUE** | Removed unused pnpm lock and workspace files to ensure a single, clean lockfile matching CI workflow (`package-lock.json`). | `fd0a526` | **RESOLVED** |
| **B13** | Metadata & Icons | Base path and canonical URLs did not align with `/me/` project subpath hosting. | **TRUE** | Aligned `siteUrl` fallback to `https://parthparthu.github.io/me/` across `layout.tsx`, `robots.ts`, `sitemap.ts`. Verified static favicon set, manifest, theme-colors, and Open Graph tags. | `487972f` | **RESOLVED** |
| **B14** | Light Mode & Accessibility | Muted text color had 4.33:1 contrast ratio (< 4.5:1 AA); footer links had 41px width (< 44px mobile touch target). | **TRUE** | Darkened `--label-quaternary` in light mode to `#546073` (contrast ratio 5.99:1 PASS). Expanded touch targets in `Footer.tsx` (`min-w-[44px] px-2`) and `SelectedWork.tsx` (`before:absolute before:-inset-y-2 before:inset-x-0`). | Working tree | **RESOLVED** |
| **B15** | Loading Screen Fallback | Visible spinner and "Loading..." text in `app/loading.tsx` caused flashing during route transitions. | **TRUE** | Replaced `app/loading.tsx` with a silent `return null;` fallback, eliminating visual loading flashes while maintaining Instant Landing standards. | `72cacb3` | **RESOLVED** |

---

## Detailed Item Verification & Evidence

### B1. Contact Form on Static Hosting
- **Initial Finding:** `app/api/contact/route.ts` used `resend` SDK, which crashes on static export hosting.
- **Evidence:** `app/api/contact/route.ts` required a Node runtime; GitHub Pages only serves static files (`out/`).
- **Resolution:** Removed `app/api/contact/route.ts` and `resend` dependency. Refactored `components/sections/ContactSection.tsx` to post client-side to Formspree or Web3Forms with honeypot spam protection, Zod validation, and `mailto:` fallback. Updated `app/privacy/page.tsx` with explicit disclosure.

### B2. Root URL 404 & Crawler Scope
- **Initial Finding:** `https://parthparthu.github.io/` returned 404 because the repository is named `me`. `robots.txt` at `/me/robots.txt` is out of scope for root domain crawlers.
- **Evidence:** Tested live URL returned HTTP 404 on root domain.
- **Resolution:** Configured `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` in `next.config.ts` and `.github/workflows/deploy.yml`. Created `docs/root-redirect/index.html` and `404.html` with canonical link and instant meta refresh. Wrote complete setup guide in `DEPLOYMENT_NOTES.md`.

### B3. Restrained Layered Parallax System
- **Initial Finding:** Prior depth was limited to 3D canvas camera movement; DOM elements moved 1:1.
- **Evidence:** Scroll inspection showed zero alternating depth offsets on project cards and no continuous spine.
- **Resolution:** Created `components/parallax/` containing `ParallaxLayer`, `ParallaxCard`, `ParallaxImage`, `SectionSpine`, and `ParallaxDebugOverlay`. Connected to Lenis ticker using composite-only properties (`translate3d`). 4-layer hero, alternating card translation rates (-0.08 / +0.08), 1.20x overflow image counter-scroll, animated vector SVG spine, contact convergence settling, and debug HUD. Full `prefers-reduced-motion` compliance.

### B4. Performance Config & Scroll Loop
- **Initial Finding:** `lib/config.ts` set mobile to high with pixel ratio 2 and postprocessing enabled; frame delta clamped to 33ms.
- **Evidence:** `lib/config.ts` lines 42-49; `SmoothScrollProvider.tsx` clamped delta.
- **Resolution:** Set `defaultMobile: 'medium'`, capped `maxPixelRatio` at 1.5, disabled postprocessing on mobile and medium/low tiers. Decoupled Lenis ticker from virtual accumulator to use real timestamps. Refined touch detection for hybrid laptop touchscreens.

### B5. Liquid Glass Removal
- **Initial Finding:** Codebase had SVG displacement filters (`feDisplacementMap`, `feGaussianBlur`) and violet gradient tint classes.
- **Evidence:** `components/glass/LiquidGlass.tsx` and `GlassSVGFilter.tsx`.
- **Resolution:** Refactored surfaces to Apple-inspired solid/subtle tinted backgrounds, hairline borders (`--separator-strong`), and layered ambient shadows. Deleted `GlassSVGFilter.tsx` and unmounted from `layout.tsx`.

### B6. Copy & Claim Accuracy
- **Initial Finding:** Awkward colon-as-dash prose patterns, cryptic tier labels, unverified production claims, unverified 20-project claim, Logic Championship honors wording.
- **Evidence:** `data/profile.ts`, `data/journey.ts`, `data/projects.ts`.
- **Resolution:** Rewrote colon-as-dash sentences into natural prose. Renamed tiers to `'Flagship'` and `'Utility'`. Updated statuses to `'Live'` and `'Completed'`. Removed unverified claim. Corrected Logic Championship to "Certificate of Participation". Extended `scripts/verify-standards.cjs`.

### B7. Project Visuals
- **Initial Finding:** Project cards showed fallback patterns rather than real screenshots or schematics.
- **Evidence:** `components/sections/SelectedWork.tsx` had pattern fallbacks for all cards.
- **Resolution:** Added real project screenshots and vector schematics (`numora.png`, `oweo.png`, `insidertracker.svg`, `bilingsystem.svg`). Configured reserved aspect ratios, descriptive alt text, and lazy loading.

### B8. GitHub Activity Section
- **Initial Finding:** Open Source section contained only an external link with no repo data.
- **Evidence:** `components/sections/GitHubSection.tsx` lacked repository data.
- **Resolution:** Created `scripts/fetch-github-activity.mjs` executed during build (`prebuild` npm hook) saving live repo data to `data/github-activity.json`. Rendered real repo cards, languages, stars, and update dates offline.

### B9. Achievements Hierarchy & Privacy
- **Initial Finding:** 7 certificates had equal visual weight, diluting the World Memory Championship Bronze Medal.
- **Evidence:** `components/sections/AchievementsSection.tsx` rendered all 7 credentials in a flat grid.
- **Resolution:** Featured WMC 2023 Bronze Medal & Top Amateur credential with photo and verification. Collapsed 6 foundational certificates into an accessible `<details>` / `<summary>` disclosure. Documented certificate PDF privacy review in NEEDS FROM ME.

### B10. Hero Clarity
- **Initial Finding:** Hero lacked explicit mention of internship availability.
- **Evidence:** `components/sections/HeroSection.tsx` omitted role availability.
- **Resolution:** Added concise, factual availability line: "Available for software engineering internships across Greater Noida, Noida, Delhi NCR, and remote settings."

### B11. Documentation Honesty
- **Initial Finding:** README claimed multi-browser verification without Playwright test harness; included filler phrases.
- **Evidence:** `README.md` lines 180-210.
- **Resolution:** Softened README testing claims to reflect Chromium/Edge CDP automation. Updated feature grid from "liquid glass" to Apple-inspired surfaces. Removed filler phrases.

### B12. Repository Hygiene
- **Initial Finding:** Conflicting lockfiles (`package-lock.json` and `pnpm-lock.yaml`) in root directory.
- **Evidence:** Both lockfiles present in repository root.
- **Resolution:** Removed `pnpm-lock.yaml` and `pnpm-workspace.yaml`. Confirmed `npm ci` and `npm run build` pass cleanly with single `package-lock.json`.

### B13. Metadata & Icons
- **Initial Finding:** Base path and canonical URLs did not align with `/me/` project subpath hosting.
- **Evidence:** `layout.tsx`, `robots.ts`, `sitemap.ts` lacked `/me/` base path alignment.
- **Resolution:** Aligned `siteUrl` fallback to `https://parthparthu.github.io/me/` across all metadata files with trailing slashes. Verified static favicon set, manifest, theme-colors, and Open Graph tags.

### B14. Light Mode & Accessibility
- **Initial Finding:** Light mode muted text color (`#6B7686`) had 4.33:1 contrast ratio (< 4.5:1 AA); footer links had 41px width (< 44px mobile touch target).
- **Evidence:** Browser audit via `scripts/verify-responsive-matrix.mjs`.
- **Resolution:** Darkened `--label-quaternary` in light mode to `#546073` (contrast ratio 5.99:1 PASS). Expanded touch targets in `Footer.tsx` (`min-w-[44px] px-2`) and `SelectedWork.tsx` (`before:absolute before:-inset-y-2 before:inset-x-0`). Verified keyboard focus rings, mobile menu focus trap, and Escape key handling across all 16 viewport sizes (320px to 3440px).

### B15. Loading Screen Fallback
- **Initial Finding:** Visible spinner and "Loading..." text in `app/loading.tsx` caused flashing during route transitions.
- **Evidence:** `app/loading.tsx` rendered visible animated spinner and text.
- **Resolution:** Replaced `app/loading.tsx` with a silent `return null;` fallback, eliminating visual loading flashes while maintaining Instant Landing standards.

---

## Automated Verification Suite Results

1. **Standards Enforcement (`node scripts/verify-standards.cjs`):**
   - Em dashes: **0**
   - Colon-as-dash replacements: **0**
   - Unexplained Tier labels: **0**
   - Banned phrases: **0**
   - Banned color tokens: **0**
   - Pill buttons/badges: **0**
   - Emojis: **0**
   - Custom cursor: **0**
   - **Result: PASS (0 violations across 68 files)**

2. **TypeScript Validity (`npm run typecheck`):**
   - **Result: PASS (0 errors)**

3. **ESLint Code Quality (`npm run lint`):**
   - **Result: PASS (0 warnings, 0 errors)**

4. **Production Build & Static Export (`npm run build`):**
   - Build-time GitHub activity fetched: **PASS (`data/github-activity.json`)**
   - Static pages generated: **21/21 static pages generated in `out/`**
   - **Result: PASS (Code 0)**

5. **Smooth Scroll & Navigation Glide (`node scripts/verify-nav-scroll.mjs`):**
   - Nav click to "About": **PASS (smooth glide, 2643px target)**
   - Logo click to "Top": **PASS (smooth glide, 0px target)**
   - **Result: PASS**

6. **Parallax Depth & Diagnostics (`node scripts/verify-parallax-full.mjs`):**
   - SectionSpine SVG rendered: **PASS**
   - Alternating card depth transforms: **PASS (`matrix(1, 0, 0, 1, 0, 24)`)**
   - Parallax Debug HUD: **PASS (`?parallax-debug=true`)**
   - Contact settling convergence: **PASS**
   - **Result: PASS**

7. **Responsive & Contrast Matrix (`node scripts/verify-responsive-matrix.mjs`):**
   - 16 Viewports (320px to 3440px): **16/16 PASS (0 horizontal overflows)**
   - Light Mode Body/Card Text Contrast: **5.99:1 (WCAG AA PASS)**
   - Hero Title Contrast: **17.6:1 (WCAG AAA PASS)**
   - Section Subtitle Contrast: **7.07:1 (WCAG AAA PASS)**
   - Mobile Menu Focus Trap & Escape: **PASS**
   - **Result: PASS**
