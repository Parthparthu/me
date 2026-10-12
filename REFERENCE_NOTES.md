# Reference Site Analysis: Design Observations

> Reference URL: `https://3d-portfolio-rouge-seven.vercel.app/`
> Inspected via headless Chrome CDP at desktop (1920x1080) and mobile (390x844).
> Note: Design observations only. In accordance with the non-negotiables, no text, assets, personal details, or banned aesthetics (purple/violet accents, percentage loaders, AI-slop copy) are adopted.

---

## 1. Computed Colors and Surface Styles

| Element / Role | Reference Computed Value | Reference Notes | Our Refined Palette Mapping (Non-Purple) |
|---|---|---|---|
| **Page Background** | `linear-gradient(90deg, #181826, #202032 50%, #181826)` | Deep midnight slate with horizontal variation | Dark: `#060B18` (deep ink navy); Light: `#F6F8FB` |
| **Card Surface** | `rgba(255, 255, 255, 0.05)` | Semi-transparent dark fill | Dark: `#0E1626` / Elevated `#152033`; Light: `#FFFFFF` |
| **Card Gradient Overlay**| `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))` | Soft subtle top-left sheen | Subtle navy-tinted sheen without purple |
| **Borders** | `rgba(255, 255, 255, 0.10)` (`1px solid`) | Hairline border outlining surfaces | Dark: `rgba(255, 255, 255, 0.08)`; Light: `rgba(11, 18, 32, 0.10)` |
| **Text Primary** | `#ffffff` / `#e5e6e9` | High contrast headings and titles | Dark: `#F2F5FA`; Light: `#0B1220` |
| **Text Secondary / Subtitles**| `#d1d5db` / `#7e8c9f` | Muted descriptions and categories | Dark: `#A9B4C7`; Light: `#4A5568` |
| **Text Muted** | `#6b7280` / `#9ca3af` | Small tags, dates | Dark: `#6F7B91`; Light: `#6B7686` |
| **Accent Colors** | `#6b21a8`, `#804dee`, `rgb(128, 77, 238)` (Violet/Purple) | **BANNED IN OUR SITE** | Dark: `#22D3EE` (cyan), hover `#67E8F9`; Light: `#0369A1`, hover `#075985` |
| **Highlight Color** | Pink / Magenta blobs (`bg-pink-500`) | **BANNED IN OUR SITE** | Optional rare highlight: `#F59E0B` (amber) |
| **Card Box Shadow** | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px` | Soft elevation drop shadow | Layered ambient + direct shadow |

---

## 2. Parallax and Motion Mechanics

- **Hero Parallax Layers**:
  - Reference employs multiple SVG mountain layers (`mountain1_svg`, `mountain2_svg`, `mountain3_svg`, `mountain5_svg`) that transform on scroll at differing matrix translations.
  - Floating background gradient blur orbs transform and scale subtly on scroll.
  - 3D Canvas element sits alongside or behind foreground content.
- **Card Tilt & Hover**:
  - Cards in the Overview and Project sections use interactive 3D tilt effects responding to pointer coordinates.
- **Section Transitions**:
  - Vertical timeline elements animate into view with Framer Motion scroll projections.

---

## 3. Section Architecture & Ideas

1. **Hero**: Title, tagline, 3D interactive model, and background parallax layers.
2. **Overview / Focus Cards**: 3 to 4 focus role cards ("what I do") with icon, title, and short plain explanation.
3. **Experience / Journey**: Chronological milestones with timeline connector.
4. **Skills**: Categorized grouping into distinct tabs / sections:
   - Languages
   - Frameworks & Libraries
   - Databases & Systems
   - Tools & Workflow
5. **Projects**: Featured cards highlighting problem, solution, tech stack chips, and direct links.
6. **Certifications / Achievements**: Compact grid of verifiable credentials and hackathons.
7. **Contact**: Direct form + verified social handles.

---

## 4. What We Will NOT Adopt (Violations / Anti-Patterns Identified)

- **AI-Slop Copy**: Reference uses `"Breaking Bugs & Building Dreams🔥"`, `"passionate"`, etc. We use only verified, plain, concrete engineering facts about Pradyumna.
- **Banned Purple & Pink Gradients**: Reference relies heavily on `#804dee`, `#6b21a8`, and `bg-pink-500`. We strictly adhere to deep ink navy (`#060B18`) and cyan (`#22D3EE` / `#0369A1`) with rare amber highlight (`#F59E0B`).
- **Emoji**: Reference has `🔥` and other emojis. Strictly forbidden by our non-negotiables.
- **Preloader Percentage**: Reference displays `2%` canvas loader. Forbidden by our non-negotiables.
- **Multiple Canvases**: Reference mounts separate canvases across hero and contact. We maintain strictly ONE persistent canvas.
