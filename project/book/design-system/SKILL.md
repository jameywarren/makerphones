---
name: makerphones-design
description: Use this skill to generate well-branded interfaces and assets for Makerphones / "The Art and Science of Headphone Design" by Jamey Warren — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, the FR-curve asset, reusable UI components, a web UI kit, and the print/book design system (page masters, CMYK builds).
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, spec sheets, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Where things are
- `readme.md` — the design guide: context, content/voice rules, visual foundations, iconography, and a full index.
- `styles.css` + `tokens/` — link `styles.css` for every `--mp-*` token and the three webfonts (Schibsted Grotesk, Source Serif 4, JetBrains Mono).
- `components/` — React primitives (Button, Eyebrow, Badge, RulerDivider, Callout, SpecBlock, Figure, DifficultyDots). Each has a `.prompt.md` with usage.
- `ui_kits/makerphones-learn/` — the documentation-site UI kit (home, contents, chapter).
- `print-tokens.json` + `book.css` + `print/` — the print/book system (7 page masters, CMYK builds, PDF/X-1a profile).
- `assets/fr-curve.svg` — the signature frequency-response figure.

## The non-negotiables (see readme.md for the full set)
- Three fonts, three jobs: sans = display, serif = body, mono = technical chrome.
- Orange is load-bearing. Text-bearing orange = `#c2410c`; raw `#ea580c` for non-text marks only.
- Warm off-white grounds, dark-slate ink (never pure black), hairline cards, one warm shadow.
- Engineering-diagram motifs (blueprint grid, ruler divider, plate frames + corner ticks). No emoji, no gradients, no photographic heroes.
- Sentence case in prose; UPPERCASE only for mono labels.
