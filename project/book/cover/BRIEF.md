# Cover brief — The Art and Science of Headphone Design

> This brief lives **inside the Makerphones Design System project** — work
> here, you already have every asset. Companion to the interior print system
> (`print-tokens.json` + `book.css`, already delivered). The cover must be the
> same brand, finished as a book jacket.

## The one rule

Reuse this design system — same three fonts, same orange-on-warm-white
field-manual identity, same engineering-diagram motifs. The cover belongs on
the same shelf as the interior, not as separate marketing. Source files in this
project: `readme.md` (the design guide), `print-tokens.json` (tokens + CMYK
builds + export profile), `tokens/print.css`, `book.css`, `assets/fr-curve.svg`,
and `print/spec-sheet.html`.

## Deliverables

1. **Front cover** — RGB, 7 × 10 in proportions; also export a web/thumbnail
   PNG (for the site's `/book` page + store listings).
2. **Full-wrap print cover** — one flat sheet, back + spine + front, 7 × 10 trim,
   **0.125 in (3 mm) bleed** all four outer edges, **crop + registration marks**,
   CMYK, PDF/X-1a. Spine width = page count × paper thickness; the interior is
   currently **282 pp** → spine ≈ **0.635 in** on KDP white (0.002252 in/page).
   Confirm from the final press PDF.
3. Deliver as **HTML/CSS** (like the interior, so it renders through the same
   Paged.js/Chromium path) **and** a flat PDF.

## Palette → CMYK (from `print-tokens.json`)

Ink `#111827`, charcoal `#2d3748`, **accent `#ea580c`** (out of gamut — use the
`accent_cmyk` build, or the optional **PANTONE 165 C** spot for a vivid cover),
warm page `#faf8f5` (let warm stock carry it), hairline `#e7e5e0`. Text-bearing
orange uses the darker `#c2410c`. Fonts: **Schibsted Grotesk** (title/author),
**Source Serif 4** (blurb), **JetBrains Mono** (spine + technical chrome).

## Front cover carries

- **Title:** *The Art and Science of Headphone Design* (Schibsted Grotesk,
  dominant).
- **Author:** Jamey Warren. **Imprint:** Warren Labs (small).
- **A signature engineering motif as the hero** — pick one and make it the
  cover image: the **exploded headphone line drawing** (the site homepage's
  `HeroExploded` — instantly says "how it's built"), the **FR-curve plot**
  (`assets/fr-curve.svg`), or a **driver cross-section**. On the warm-white
  ground with the faint **blueprint grid** and a **ruler divider** + orange
  underline. No photography, no gradients.
- Optional mono kicker: `MAKERPHONES · FIELD MANUAL`, `FIRST EDITION · 2026`.

## Back cover

- **Blurb** (Source Serif 4) — 2–3 short paragraphs: what the book is, who it's
  for, what you can do after reading it (draft from the preface + site About;
  author finalizes).
- **Short author bio** + optional author mark.
- **ISBN barcode zone** bottom-right (reserve ~2 × 1.2 in; POD adds the barcode).
- **Imprint** (Warren Labs) + `makerphones.com`.

## Spine (≈ 0.635 in — confirm from final page count)

Title + author top-to-bottom; imprint mark at the foot. Keep ≥ 0.0625 in off
the fold lines.

## Export profile (from `print-tokens.json` → export_profile)

PDF/X-1a:2001 · CMYK only (+ optional PANTONE 165 C) · embed + subset all
fonts · 3 mm bleed + crop/registration marks · total ink ≤ 240% · flatten
transparency. A separate cover PDF from the interior.

## Avoid

Photographic heroes, gradients, glassmorphism, emoji, pure-black,
Inter/Roboto/Arial. Engineering-diagram restraint throughout.
