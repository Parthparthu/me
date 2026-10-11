# Design Notes: Apple-Inspired Restyling

> This file was written as part of Section 2 of the design brief, before any code changes.
> It captures the extracted principles and specifies the token system and palette rationale.

---

## 1. Principles Extracted From Apple Public Design Resources

Studied sources: Apple Human Interface Guidelines (HIG), apple.com layout and motion patterns.

### Clarity
- **One idea per section.** Each screen/section communicates a single concept before moving on.
- **Information hierarchy through scale and weight**, not color. Large, confident headings; secondary
  text steps down in both size and contrast. Color is never the only signal.
- **Generous negative space** creates focus. Content is not stacked edge-to-edge.

### Deference
- The UI should not compete with content. Backgrounds are quiet; surfaces are low-contrast fills,
  not theatrical glass or heavy gradients.
- **Restraint with decoration**: hairline borders and soft layered shadows replace hard outlines.
  No glow effects on resting surfaces; subtle lift only on interaction.

### Depth
- Depth is expressed through **layered surfaces** (slightly different fill values), not blur or
  refraction. A card sits visually above the page because it has a shadow and a hairline border,
  not because it is frosted.
- Motion implies depth: entrances rise slightly from below; exits recede. Springs make surfaces
  feel physical.

### Continuous Corners (Squircle)
- Apple uses a superellipse (squircle) for all rounded UI elements. It reads as softer and more
  cohesive than a simple circular arc. Implemented via `corner-shape: squircle` (feature-query)
  with a close `border-radius` approximation as fallback.

### Typography
- System font stack renders San Francisco on Apple devices and Inter on others.
- **Tight letter spacing on large headlines** (around -0.03 em), normal on body.
- **Line length 45 to 75 characters** on prose blocks.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.

### Motion
- **Springs** for entrances and layout changes: they feel physical and are interruptible.
- **Ease-out** for opacity fades.
- **Short, purposeful** durations: 150 ms fast, 250 ms standard, 450 ms slow reveals.
- `prefers-reduced-motion`: instant transitions.
- No scroll-jacking; scrolling stays native.

### Navigation
- Floating, inset nav bar: not attached to viewport edges.
- Shrinks on scroll with hysteresis (does not flicker near threshold).
- Active section gets a sliding rounded-rectangle indicator.

---

## 2. Token Tables

### Color Tokens (Semantic)

| Token | Dark | Light | Purpose |
|---|---|---|---|
| `--bg-primary` | #0a0e1a | #f5f7fa | Page background |
| `--bg-secondary` | #111827 | #ffffff | Card/surface background |
| `--bg-grouped` | #0d1220 | #eef1f6 | Grouped list inset |
| `--bg-elevated` | #1c2740 | #ffffff | Elevated surface (modal) |
| `--bg-hover` | rgba(255,255,255,0.06) | rgba(0,0,0,0.04) | Hover state fill |
| `--bg-active` | rgba(255,255,255,0.10) | rgba(0,0,0,0.07) | Active state fill |
| `--separator` | rgba(255,255,255,0.08) | rgba(0,0,0,0.09) | Hairline dividers |
| `--label-primary` | #f8fafc | #0f172a | Headings, body text (14:1 contrast) |
| `--label-secondary` | #cbd5e1 | #334155 | Supporting text (7:1 contrast) |
| `--label-tertiary` | #94a3b8 | #475569 | Placeholders, hints (5.5:1 contrast) |
| `--label-quaternary` | #7888a5 | #64748b | Footnotes, muted metadata (4.7:1 contrast) |
| `--accent` | #0ea5e9 | #0369a1 | Primary actions, links (6.1:1 contrast) |
| `--accent-subtle` | rgba(14,165,233,0.12) | rgba(3,105,161,0.09) | Tinted fills |
| `--accent-border` | rgba(14,165,233,0.28) | rgba(3,105,161,0.22) | Tinted borders |
| `--success` | #10b981 | #059669 | Success states |
| `--warning` | #f59e0b | #d97706 | Warning/achievement |
| `--destructive` | #ef4444 | #dc2626 | Error/destructive |
| `--focus-ring` | #0ea5e9 | #0369a1 | Focus ring color |

### Spacing Scale (8-point)

`--sp-1` 4px / `--sp-2` 8px / `--sp-3` 12px / `--sp-4` 16px / `--sp-6` 24px /
`--sp-8` 32px / `--sp-12` 48px / `--sp-16` 64px / `--sp-24` 96px / `--sp-32` 128px

### Radius Scale (Continuous Corners)

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Badges, chips, inner elements |
| `--radius-md` | 12px | Buttons, inputs, small cards |
| `--radius-lg` | 20px | Cards, nav bar |
| `--radius-xl` | 28px | Sheets, modals |

Concentric radius rule: inner element radius = outer radius minus padding.

### Shadow Scale (Layered, Low Opacity)

| Token | Usage |
|---|---|
| `--shadow-sm` | Resting cards: 0 1px 2px + 0 2px 4px |
| `--shadow-md` | Lifted cards on hover |
| `--shadow-lg` | Modals, command palette |
| `--shadow-nav` | Floating navigation bar |

### Typography Scale (Fluid, clamp-based)

Display / Large Title / Title 1 / Title 2 / Title 3 / Headline / Body / Callout / Subhead / Footnote / Caption

System font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", system-ui, sans-serif`

### Motion Tokens

| Token | Value |
|---|---|
| `--dur-fast` | 150ms |
| `--dur-base` | 250ms |
| `--dur-slow` | 450ms |
| `--ease-out` | cubic-bezier(0.4,0,0.2,1) |
| `--ease-spring` | cubic-bezier(0.34,1.56,0.64,1) |
| `--ease-standard` | cubic-bezier(0.16,1,0.3,1) |

---

## 3. Palette Justification

**Accent: Sky Blue.** Not purple, not indigo, not violet. Blue is universally professional and
trusted. Sky-500 (#0ea5e9) on dark, Sky-600 (#0284c7) on light, both exceeding WCAG AA contrast.

**Neutral grays: cool-leaning blue-gray slate tones.** Never pure black on pure white. Dark
background (#0a0e1a) has a faint blue cast for OLED quality. Light (#f5f7fa) has the same.

**Supporting: Emerald (success), Amber (warnings/achievements).** Semantic only.

**Zero purple. No indigo-to-pink gradients. No violet.**

---

## 4. Component Audit

### Glass patterns to REMOVE
- `backdrop-filter: blur(...)` on all surface elements (except nav when `NAV_BLUR=true`)
- `url(#glass-distort)` refraction filter references
- Specular radial-gradient overlay spans inside LiquidGlass
- Top-edge rim highlight spans  
- `--glass-blur-*`, `--glass-alpha-*`, `--glass-border-*` CSS tokens
- `GlassSVGFilter` (removed from layout render tree; file kept)

### What STAYS
- All component logic, framer-motion animations, 3D scene
- CommandPalette, ThemeToggle, ScrollProgress (restyled)
- Instant Direct Landing (Preloader and Enter Gate removed; hero renders immediately on first paint)
- LiquidGlass API surface (internals replaced with solid Surface renderer)

### Surface replacement strategy
`LiquidGlass` is rewritten as a thin wrapper that renders:
- Solid fill from `--bg-secondary` (or tinted variant)
- 1px hairline border from `--separator`
- Layered soft shadow from `--shadow-sm`/`--shadow-md`
- Continuous-corner radius
- Optional hover lift (scale 1.01 + shadow-md)
- No backdrop-filter, no SVG filters, no specular overlays

---

## 5. Config Flags (lib/config.ts)

```ts
export const NAV_BLUR = false;          // backdrop-filter on nav
export const ALLOW_CAPSULE = false;     // capsule buttons
export const POINTER_REACTIVE_3D = true; // keep 3D pointer reactivity
export const ALLOW_EMOJI = false;       // no emoji icons
```

---

## 6. Implementation Order

1. Update `lib/config.ts` with NAV_BLUR, ALLOW_CAPSULE flags
2. Rewrite `globals.css` with Apple token set and squircle corners
3. Replace `LiquidGlass` internals with solid Surface renderer
4. Rewrite `Header` as floating scroll-shrinking nav with sliding indicator
5. Update all sections, `ScrollProgress`, `Footer`
6. Run build and verify
