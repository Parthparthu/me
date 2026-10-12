# Parallax Audit Report

**Status:** **FOUND-WEAK**  
**Date:** 2026-10-13  
**Audit Method:** Code analysis + Chrome DevTools Protocol runtime scroll testing at 0px, 300px, 800px, 1500px  

---

## 1. Classification
The current parallax implementation is classified as **FOUND-WEAK**.

While early foundations exist in `HeroSection.tsx` and `CameraRig.tsx`, the depth effect is severely constrained and missing across all subsequent sections:
- The hero layers clamp to small static offsets (`[0, 70px]`, `[0, 45px]`, `[0, 20px]`) and freeze completely once the user scrolls beyond the hero fold (~800px).
- The rest of the site (`ProjectsSection`, `SkillsSection`, `AchievementsSection`, `AboutSection`, `ContactSection`) executes with **uniform 1:1 scroll speed**, with no alternating card depth, no continuous vertical SVG spine, no section background crossfades, no internal card image parallax, and no contact card settling effect.

---

## 2. Layer-by-Layer Evidence

| Layer / Element | Location | Status | Observed Behavior |
| :--- | :--- | :--- | :--- |
| **Hero Far Background Glow** | `HeroSection.tsx:29` | Weak | Translates `[0, 70px]` with opacity `[0.8, 0]`. Clamps at 800px scroll; lacks continuous depth. |
| **Hero Midground Grid/Coords** | `HeroSection.tsx:33` | Weak | Translates `[0, 45px]` with opacity `[0.65, 0]`. Clamps at 800px scroll. |
| **Hero Foreground Text** | `HeroSection.tsx:37` | Weak | Translates `[0, 20px]` with opacity `[1, 0]`. Clamps at 800px scroll; lacks exit scale/blur shift. |
| **3D Canvas Camera Rig** | `CameraRig.tsx:78` | Working | Responsive pointer parallax tilt + room-to-room transitions via `useScrollStore.getState().progress`. |
| **Section Grid Cards** | `ProjectsSection.tsx`, `SkillsSection.tsx`, `AchievementsSection.tsx` | Missing | Odd and even cards scroll uniformly. Zero alternating depth offsets (0%). |
| **Continuous SVG Spine Line** | Between sections | Missing | No vertical accent line or glowing dot connecting sections and tracking scroll progress. |
| **Background Crossfades** | Section boundaries | Missing | Page background remains static; no ambient smooth color transition as sections scroll into view. |
| **Project Card Image Parallax** | `ProjectCard.tsx` / `ProjectsSection.tsx` | Missing | Card images scroll 1:1 with card containers without internal overflow offset. |
| **Contact Settling Effect** | `ContactSection.tsx` | Missing | Contact cards do not converge or settle into place upon reaching the viewport. |
| **Dev Debug Overlay** | Entire app | Missing | No `?parallax-debug=true` HUD exists to inspect layer offsets, scroll percentage, and FPS. |

---

## 3. Runtime Test Measurements (Chrome CDP)
Measurements captured during runtime execution:

```json
{
  "scrollY_0": {
    "layer1_bgGlow": "matrix(1, 0, 0, 1, 0, 0)",
    "layer2_midField": "matrix(1, 0, 0, 1, 0, 0)",
    "layer3_fgText": "matrix(1, 0, 0, 1, 0, 0)",
    "sectionCards": "none"
  },
  "scrollY_300": {
    "layer1_bgGlow": "matrix(1, 0, 0, 1, 0, 29.0055)",
    "layer2_midField": "matrix(1, 0, 0, 1, 0, 18.6464)",
    "layer3_fgText": "matrix(1, 0, 0, 1, 0, 8.28729)",
    "sectionCards": "none"
  },
  "scrollY_800": {
    "layer1_bgGlow": "matrix(1, 0, 0, 1, 0, 70)",
    "layer2_midField": "matrix(1, 0, 0, 1, 0, 45)",
    "layer3_fgText": "matrix(1, 0, 0, 1, 0, 20)",
    "sectionCards": "none"
  },
  "scrollY_1500": {
    "layer1_bgGlow": "matrix(1, 0, 0, 1, 0, 70)",
    "layer2_midField": "matrix(1, 0, 0, 1, 0, 45)",
    "layer3_fgText": "matrix(1, 0, 0, 1, 0, 20)",
    "sectionCards": "none"
  }
}
```

---

## 4. Remediation Plan (Phase 3 Build)
1. **Config Architecture (`lib/parallax-config.ts`)**:
   - Single central configuration exporting speeds, scales, mobile multipliers, and reduced-motion zeroing.
2. **Core Components (`components/parallax/`)**:
   - `ParallaxLayer`: Composite-only (`transform: translate3d`, `opacity`), zero layout shifts.
   - `useSectionProgress`: Efficient window scroll intersection tracking.
   - `SectionSpine`: Animated vertical SVG thread with glowing position dot.
   - `SectionBackgroundCrossfade`: Smooth atmospheric color transition as sections scroll.
   - `InternalImageParallax`: Subtle inner image parallax within project cards.
   - `ContactSettling`: Converging settle animation for contact section elements.
   - `ParallaxDebugOverlay`: Toggleable HUD enabled via `?parallax-debug=true` showing live scroll %, active section, layer offsets, and FPS.
