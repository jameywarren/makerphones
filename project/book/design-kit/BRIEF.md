# Design brief — print/book design system

**Project:** *The Art and Science of Headphone Design* by Jamey Warren — the
print and PDF edition of the makerphones reference manual.
**You are designing:** an importable **print design system** that is the
press-native sibling of the existing makerphones web design system
("Claude Design v2", `reference/theme.css`).

## The one rule

**Stay visually coherent with the website — do not redesign the brand.** Same
three fonts, same orange-on-warm-white field-manual identity, same
engineering-diagram motif language. Your job is to add the *paged-print
layer* the web tokens don't cover (trim, margins, grid, page masters, CMYK),
not to reinvent the look. The web tokens in `tokens.json` → `web` are the
bridge; mirror them, don't replace them.

## Deliverables

1. **`print-tokens.json`** — the print token layer. Mirror every `--mp-*`
   name from `tokens.json` → `web` **1:1**, and fill in the `print` block
   (trim, mirrored margins, baseline grid, bleed, and the CMYK builds —
   especially `accent_cmyk`). This is the importable source of truth the CSS
   consumes. Keeping web names and print names in lockstep is what stops the
   book and site from drifting.
2. **`book.css`** — a Paged.js (CSS Paged Media) stylesheet consuming those
   tokens, defining the seven page masters below. It replaces the placeholder
   geometry in `reference/book.css` (which is our ugly-but-working v0.1).
3. **A one-page spec sheet (PDF)** — trim, margins, grid, color builds, and a
   thumbnail gallery of the seven page masters.

## Reuse these exact values (the bridge — see `tokens.json`)

- **Fonts** (all SIL OFL 1.1, cleared for print embedding): **Schibsted
  Grotesk** = display/headings; **Source Serif 4** = body; **JetBrains Mono**
  = technical chrome (eyebrows, captions, spec blocks, folios, diagram
  labels). Keep the role split exactly.
- **Palette → translate to CMYK:** ink `#111827`, charcoal `#2d3748`, accent
  `#ea580c` (+ darker text variant `#c2410c`), warm tint `#fff4ec`, page
  `#faf8f5`, hairlines `#e7e5e0` / `#d1d5db`, meta `#6b7280`.
  - **Flag `#ea580c` as out-of-gamut** — propose a CMYK build (and an optional
    Pantone spot). It's load-bearing: every measured trace, part number,
    difficulty mark, and link. Fix it once at the token layer; every figure
    inherits it.
  - **Preserve the contrast split:** text-bearing orange uses the darker
    `#c2410c` build (5.2:1); raw `#ea580c` only for non-text marks.
  - Let warm **paper stock** carry the `#faf8f5` warmth rather than printing a
    flat tint.
- **Motifs to port** (see `reference/diagrams.css`, `reference/FRCurve.astro`,
  `reference/DriverCrossSection.astro`, `reference/EarPadCrossSection.astro`):
  blueprint graph-paper grid, ruler divider with accent underline, plate
  frames with corner ticks, FIG-numbered diagrams with mono letter-spaced
  labels. Diagrams are **static SVG** — design for the still, no motion.

## Define the print-only layer (the gap to fill)

- **Trim 7×10 in**; **mirrored margins** (inside/gutter > outside for
  binding); verso/recto specified.
- **Baseline grid** — Source Serif 4 ≈ 10.5/14 pt; all leading a multiple of
  the 14 pt baseline; headings snap to grid.
- **3 mm bleed** on full-bleed masters; **widows/orphans = 2**; heading
  keep-with-next; serif hyphenation policy.
- **Running heads + folios** — verso = book title, recto = chapter title,
  in JetBrains Mono small-caps; folios in mono. (Our v0.1 `book.css` already
  wires these via `@top-left` / `@top-right` / `@bottom-center` and
  `string-set` — keep that mechanism.)
- **Side/foot notes** — a sidenote master in the outside margin, with a
  numbered-footnote fallback.
- **Document-wide figure numbering** — chapter-scoped (`Fig. 4.2`) to replace
  the ~22 duplicate "Fig. 1" labels and drive a **List of Figures**.

## The seven page masters (each as a named Paged.js `@page` + a thumbnail)

1. **Part opener** — recto, blueprint-wash or dark band, large accent part
   number.
2. **Chapter opener** — recto, drop folio, sans title, serif lede, mono
   chapter-meta rule, ruler divider.
3. **Body / running page** — baseline-gridded serif, running heads + folios,
   mono spec blocks, caution/tip callouts (port from `.starlight-aside` in
   `reference/theme.css`).
4. **Figure — full-bleed** — 3 mm bleed, mono FIG number + caption.
5. **Figure — inline** — plate frame + corner ticks, mono caption.
6. **Appendix / reference** — denser grid, comparison-table master (port
   `.sl-markdown-content table`).
7. **Index** — multi-column, mono entry numbers, hairline letter-group heads.

## Toolchain integration (so it drops straight into our pipeline)

The book is built by `scripts/to-book/collect.mjs`: it concatenates the real
Astro-built chapter HTML (with baked SVG figures) into one `dist/book.html`,
forces the light colorway, inlines `book.css`, and Paged.js paginates it. So:

- Your `book.css` must be **plain CSS that Paged.js understands** (`@page`
  margin boxes, `string-set` / `string()`, `counter(page)`, named pages,
  `break-*`). No build step of its own.
- Consume tokens as CSS custom properties whose names mirror `--mp-*`. We
  inline `print-tokens.json` → `:root` custom properties at build time.
- Provide a short **PDF/X-1a export profile note** (CMYK, embedded fonts,
  bleed, no stray RGB/transparency) so the press file is printer-ready.

## What to look at

- `tokens.json` — the values, with notes.
- `reference/theme.css`, `reference/diagrams.css` — the live web system
  (tokens, motifs, the FIG diagram system, callouts, tables).
- `reference/Figure.astro` + the three diagram components — how figures are
  structured and captioned.
- `reference/book.css` — our working v0.1 print layer; treat it as the floor
  to beat, and keep its running-head/`@page` mechanism.
- `SAMPLES.md` — live pages and the generated `book.html` to design against.
