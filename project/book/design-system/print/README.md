# The Book — print/book design system

The press-native sibling of the Makerphones website. Same fonts, palette, and
diagram motifs; adds the paged-print layer the web tokens don't cover.

## Files (deliverables)
- **`../print-tokens.json`** — print token source of truth. Mirrors the `--mp-*`
  web tokens 1:1 and fills the print block: 7×10 in trim, mirrored margins,
  10.5/14 pt baseline, 3 mm bleed, and CMYK builds (incl. the out-of-gamut
  accent + optional PANTONE 165 C spot, and the rich-black band). Inline its
  values to `:root` at book-build time.
- **`../book.css`** — Paged.js (CSS Paged Media) stylesheet. Defines the seven
  named page masters, mirrored `:left`/`:right` margins, mono running heads +
  folios, and chapter-scoped figure numbering (`Fig. 4.2`) that drives a List
  of Figures. Plain CSS — no build step of its own.
- **`page-masters.html`** — the seven masters previewed at thumbnail scale.
- **`spec-sheet.html`** — a PDF-ready one-page spec: trim/margins diagram,
  baseline grid, CMYK color builds, font roles, export profile, and the master
  gallery.

## The seven page masters
1. **Part opener** — recto, blueprint wash, large accent part number, no folio.
2. **Chapter opener** — recto, drop folio, sans title, serif lede, mono meta rule.
3. **Body / running** — baseline-gridded serif, running heads + folios, spec blocks, callouts.
4. **Figure — full-bleed** — runs to trim, 3 mm bleed, mono FIG number over the image.
5. **Figure — inline** — plate frame + corner ticks, mono caption, keeps with text.
6. **Appendix / reference** — denser grid, comparison-table master (repeating heads).
7. **Index** — multi-column, mono entry numbers, hairline letter-group heads.

## Export profile
PDF/X-1a:2001 · CMYK only (optional PANTONE 165 C) · embed + subset all fonts ·
3 mm bleed + crop/registration marks · max total ink 240% · flatten transparency.

> Implementation note (repo): `book.css` lives at `src/styles/book.css`
> (adapted) and is consumed by `scripts/to-book/collect.mjs`. The CSS-counter
> figure numbering was replaced with injected numbers (Paged.js drops counter
> state across page-break fragments) — same `Fig. N.m` result. See the
> stylesheet header and `project/book/PLAN.md`.
