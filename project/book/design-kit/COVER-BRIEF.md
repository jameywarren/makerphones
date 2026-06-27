# Design brief — book cover

**Project:** the cover for *The Art and Science of Headphone Design* by Jamey
Warren — the print + digital edition of the Makerphones reference manual.
**Companion to:** [`BRIEF.md`](BRIEF.md) (the interior print system, already
delivered as `book.css` + `print-tokens.json`). The cover must be the same
brand, finished as a book jacket.

## The one rule (same as the interior)

Reuse the **Makerphones Design System** — same three fonts, same
orange-on-warm-white field-manual identity, same engineering-diagram motif
language. The cover should look like it belongs on the same shelf as the
interior, not like separate marketing. Tokens + motifs:
[`tokens.json`](tokens.json), `reference/theme.css`, `reference/diagrams.css`,
and the signature figure [`reference/`](reference) / `assets/fr-curve.svg`.

## Deliverables

1. **Front cover** — RGB, 7 × 10 in proportions (also export a web/thumbnail
   PNG for the `/book` landing page and store listings).
2. **Full-wrap print cover** — one flat sheet: back + spine + front, 7 × 10 in
   trim, **0.125 in (3 mm) bleed** all four outer edges, **crop + registration
   marks**, CMYK, PDF/X-1a. Spine width = page count × paper thickness — the
   interior is **~250 pp** right now (finalize from the press PDF; ≈ 0.56 in on
   KDP white). See `project/book/cover/SPEC.md` for the exact wrap math.
3. Deliver as **HTML/CSS** (like the interior, so it renders through the same
   Paged.js/Chromium path) **and** a flat PDF, plus the spec.

## The brand palette → CMYK (from print-tokens.json)

Ink `#111827`, charcoal `#2d3748`, **accent `#ea580c`** (out of gamut — use the
`accent_cmyk` build, or the optional **PANTONE 165 C** spot for a vivid cover),
warm page `#faf8f5` (let warm stock carry it), hairline `#e7e5e0`. Text-bearing
orange uses the darker `#c2410c`. Fonts: **Schibsted Grotesk** (title/author),
**Source Serif 4** (blurb), **JetBrains Mono** (spine + technical chrome).

## Front cover — what it carries

- **Title:** *The Art and Science of Headphone Design* (Schibsted Grotesk,
  the dominant element).
- **Author:** Jamey Warren.
- **Imprint:** Warren Labs (small).
- **A signature engineering motif as the hero** — pick one and make it the
  cover image (these are the brand's "iconography"):
  - the **exploded headphone line drawing** (see the site homepage's
    `HeroExploded` — strong, instantly says "how it's built"), **or**
  - the **frequency-response plot** (`fr-curve.svg` — the book's signature
    figure), **or** a **driver cross-section**.
  - On the warm-white field-manual ground, with the faint **blueprint grid**
    and a **ruler divider** + orange underline. No photography, no gradients.
- Optional small mono kicker (e.g. `MAKERPHONES · FIELD MANUAL`,
  `FIRST EDITION · 2026`).

## Back cover

- **Blurb** (Source Serif 4) — 2–3 short paragraphs: what the book is, who it's
  for, what you can do after reading it. (Draft from the preface + the site
  About page; the author finalizes.)
- **Short author bio** + optional small author mark.
- **ISBN barcode zone** bottom-right (reserve ~2 × 1.2 in; POD usually adds the
  barcode).
- **Imprint** (Warren Labs) + `makerphones.com`.

## Spine (≈ 0.56 in — confirm from final page count)

Title + author, reading top-to-bottom; imprint mark at the foot. Mono or sans;
keep ≥ 0.0625 in off the fold lines.

## Constraints / export profile

- **Avoid:** photographic heroes, gradients, glassmorphism, emoji, pure-black,
  Inter/Roboto/Arial. Engineering-diagram restraint throughout.
- **Press:** PDF/X-1a, CMYK (+ optional PANTONE 165 C), all fonts embedded,
  3 mm bleed + marks, total ink ≤ 240%. A separate cover PDF from the interior.

## What to look at

`tokens.json`, `BRIEF.md`, `reference/theme.css` + `reference/diagrams.css`,
`assets/fr-curve.svg`, the live site homepage (the exploded-headphone hero),
`project/book/cover/SPEC.md` (wrap math + the working `cover.html` scaffold).
