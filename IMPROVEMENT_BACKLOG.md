# Site Improvement Backlog

**Audit Date:** 2026-10-13  
**Auditor:** Front-End Architecture & QA Specialist  
**Build Target:** Next.js Static Export (`out/`) on GitHub Pages  
**Target URL:** https://parthparthu.github.io/  

---

## Severity Classification
- **P0 (Critical / Blocker):** Deployment 404, build breakage, runtime crashes, route failures, core non-negotiable regressions.
- **P1 (High):** Parallax gaps vs spec, touch target accessibility failures (<44px), contrast violations, mobile usability flaws.
- **P2 (Medium):** Spacing rhythm, optical alignment, text widow balance, layout shifts on edge viewports.
- **P3 (Low / Polish):** Micro-interaction polish, spring parameter tuning, subtle specular highlights.

---

## Impact-Ranked Backlog

### P0 (Critical - Resolved in Phase 0)
1. **GitHub Pages Root User Site 404**  
   - **File:** Repository Settings / `.github/workflows/deploy.yml`  
   - **Root Cause:** Repository was named `me`, forcing deployment to `https://parthparthu.github.io/me/` and leaving the root URL `https://parthparthu.github.io/` at 404.  
   - **Fix Applied:** Renamed repository to `parthparthu.github.io` via GitHub API, pinned official Pages actions (`configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`), set `NEXT_PUBLIC_BASE_PATH: ''`.  
   - **Status:** **RESOLVED**

2. **Serverless API Route on Static Hosting**  
   - **File:** `app/api/contact/route.ts`  
   - **Root Cause:** Serverless route was incompatible with Next.js static export on GitHub Pages.  
   - **Fix Applied:** Removed `app/api/contact/route.ts`. Refactored `components/sections/ContactSection.tsx` to handle submissions client-side via Formspree (`NEXT_PUBLIC_FORMSPREE_ID`) or Web3Forms (`NEXT_PUBLIC_WEB3FORMS_KEY`), with spam honeypot and client-side validation, falling back cleanly to user `mailto:` client.  
   - **Status:** **RESOLVED**

3. **Client-Side Deep Link Trailing Slash 404 Handling**  
   - **File:** `app/not-found.tsx`, `public/.nojekyll`, `next.config.ts`  
   - **Root Cause:** Direct navigation to routes without trailing slashes could 404 on static servers without rewrite rules.  
   - **Fix Applied:** Added `.nojekyll` to bypass Jekyll asset filtering, ensured `trailingSlash: true` in Next.js config, and added automatic trailing-slash recovery logic in `app/not-found.tsx`.  
   - **Status:** **RESOLVED**

---

### P1 (High Impact - Implementation Required)

4. **Multi-Layer Parallax System Incomplete (FOUND-WEAK)**  
   - **Files:** `components/sections/HeroSection.tsx`, `components/canvas/CameraRig.tsx`, all section components  
   - **Evidence:** Runtime scroll inspection shows hero elements clamp at fixed pixel offsets (70px, 45px, 20px) after modest scroll distance. Section cards in `ProjectsSection`, `SkillsSection`, and `AchievementsSection` scroll at 1:1 speed with zero alternating depth. No continuous vertical SVG spine connects sections. No background color crossfades. Project cards lack internal image parallax (`overflow: hidden` container moving at ~0.9x scroll rate). Contact section lacks settling/convergence physics.  
   - **Required Solution:**  
     - Create centralized `lib/parallax-config.ts` exporting `PARALLAX_CONFIG`.  
     - Implement high-performance `ParallaxLayer` and `useSectionProgress` using composite-only properties (`transform: translate3d`, `opacity`).  
     - Build 4-layer hero depth (far atmosphere glow, mid geometric contours, 3D canvas interaction, foreground typography with exit fade).  
     - Implement alternating card depth offsets (4-8% variance).  
     - Add animated continuous SVG spine tracking scroll progress.  
     - Add subtle background crossfades across section boundaries.  
     - Implement internal card image parallax.  
     - Implement contact card settling effect.  
     - Add dev-only debug overlay (`?parallax-debug=true`) stripped in production.  
   - **Status:** **IN PROGRESS (Phase 3)**

5. **Touch / Click Target Accessibility Violations (<44px on Mobile)**  
   - **Files:** `components/layout/Header.tsx`, `components/ui/CommandPalette.tsx`  
   - **Evidence:** Browser audit found:  
     - Desktop header logo link (`P.`): 31x32px.  
     - Command palette trigger button (`⌘ K`): 37x36px.  
     - Mobile touch target minimum rule requires >= 44x44px.  
   - **Required Solution:** Expand hit area using CSS `::after` hit-target expanders or minimum dimensions `min-h-[44px] min-w-[44px]` with flex alignment.  
   - **Status:** **SCHEDULED (Phase 4)**

6. **Prefers-Reduced-Motion & Low Power Parallax Fallback**  
   - **Files:** `lib/parallax-config.ts`, `components/canvas/CameraRig.tsx`  
   - **Evidence:** Must guarantee all scroll-linked layer translations clamp to 0 and fall back to static opacity when `prefers-reduced-motion` is active or GPU tier is low.  
   - **Status:** **SCHEDULED (Phase 3 / 4)**

---

### P2 (Medium Impact)

7. **Squircle Border Radius Hierarchy (Parent >= Child)**  
   - **Files:** `components/glass/GlassVariants.tsx`, `components/sections/ProjectsSection.tsx`  
   - **Evidence:** Certain nested badges inside glass cards share equal radii (8px child within 16px parent), which violates concentric nested radii guidelines.  
   - **Required Solution:** Enforce child radius <= parent radius (e.g. 6px badge inside 16px card).  
   - **Status:** **SCHEDULED (Phase 4)**

8. **Heading Text Balance & Widow Prevention**  
   - **Files:** `components/sections/HeroSection.tsx`, `components/sections/AboutSection.tsx`  
   - **Evidence:** Multi-line section subtitles can leave single orphan words on mobile.  
   - **Required Solution:** Add `text-wrap: balance` to all section headers and subtitles.  
   - **Status:** **SCHEDULED (Phase 4)**

---

### P3 (Low Impact / Polish)

9. **Layered Ambient & Direct Drop Shadows**  
   - **Files:** `app/globals.css`, `components/glass/LiquidGlass.tsx`  
   - **Evidence:** Cards currently use two shadow passes; add subtle direct specular rim light on hover for enhanced optical depth.  
   - **Status:** **SCHEDULED (Phase 4)**

10. **Parallax Debug HUD Polish**  
    - **Files:** `components/common/ParallaxDebugOverlay.tsx`  
    - **Evidence:** Provide a clean HUD enabled with `?parallax-debug=true` displaying current scroll percentage, active section, layer translation offsets, and live scroll FPS.  
    - **Status:** **SCHEDULED (Phase 3)**
