# CONTENT-TODO — known stale facts & pending assets

**Version 1.2 · June 11, 2026**

Facts known to be stale in the written chapters. Migration is faithful —
these are **not** fixed during migration; they're fixed in a deliberate
editorial pass, one commit per correction, so the change history is clean.

## Sourcing chapter

- [ ] **Zalytron** is listed as a "Canadian supplier." It was actually in
      Mineola, NY, and is long defunct. Remove it from the supplier list.
- [ ] **miniDSP EARS** is listed at ~$300. It launched at $199, is now out
      of stock at major retailers, and has been superseded by the EARS Pro.
      This recommendation needs a rework, not just a price fix.
- [ ] **miniDSP UMIK-1** at ~$120 is roughly right, but the mic is currently
      supply-constrained. Add a backup measurement-mic recommendation.
- [ ] **Dayton driver model numbers and prices** — verify every Dayton
      reference against the current Parts Express catalog before the
      editorial pass closes.

## Outdated author bio in chapter bodies

The canonical bio (Project-Compass.md) is **25+ years; Grace Design
employee #1, 1997–2001; HeadRoom VP Ops → President & CEO, 2003–2017;
designed the Cosmic**. These chapters still carry older "30 years"
framing in body copy (migrated faithfully):

- [ ] `how-headphones-create-sound` — "After 30 years working with
      headphones — from manufacturing at Grace Design to running
      HeadRoom" (opening) and "I've built headphones for 30 years."
      **Note:** this chapter's `excerpt` also says "After 30 years in
      professional audio…" and the v2 design renders excerpts as the
      visible chapter lede — fixing the excerpt is now reader-facing,
      not just metadata.
- [ ] `driver-selection-guide` — "30 years" mention.
- [ ] `design-methodology` — "30 years" mention.

## Cross-links to non-frozen handles (migration report)

`your-first-build` and `troubleshooting-guide` are referenced but are
not in the frozen 30-chapter handle list (troubleshooting is a planned
appendix, handle TBD). Decide in the editorial pass: re-point, rewrite,
or hold until the target exists.

- [ ] `your-first-build` — body links in `how-headphones-create-sound`,
      `open-vs-closed-back-design`, `cables-connectors-hardware`,
      `design-methodology`; in `related` frontmatter of those plus
      `headphone-form-factors` and `driver-selection-guide`.
- [ ] `troubleshooting-guide` — in `related` frontmatter of
      `cables-connectors-hardware` and `design-methodology`.
- Links to frozen-but-unwritten chapters (e.g. `budget-measurement-setup`,
  `3d-design-for-headphones`, `tuning-with-damping`) 404 until those
  chapters ship — expected; no action needed.

## Migration coercions to revisit

- [ ] `cables-connectors-hardware` and `design-methodology` were
      "Beginner to Intermediate" in the source; coerced to
      `Intermediate` (schema enum). Confirm or simplify in editorial.
- [ ] `cables-connectors-hardware` had a free-text prerequisite
      ("Basic understanding of headphone components") that maps to no
      handle — frontmatter has `prerequisites: []`. Decide if a real
      prerequisite chapter applies.
- [ ] Length vs. style guide (1,200–1,800 words):
      `headphone-form-factors` is ~760 words;
      `design-methodology` is ~1,920. Flag for editorial, not urgent.
- [ ] `cables-connectors-hardware` — the What's Next prose says "You've
      now completed Part 2: Components & Materials" and "Next up is
      **Part 3: Design & Build Process**". The build's quality gate only
      covers titles/headings (per spec), but visible part numbers in body
      copy violate the spirit of the internal-only rule — rewrite to
      natural language ("the components and materials chapters") in the
      editorial pass.

## Real assets needed (v2 design placeholders)

The v2 design ships with styled placeholders — swap in real assets:

- [ ] **Bench portrait** of Jamey — homepage credibility strip
      (`src/components/home/CredStrip.astro`).
- [ ] **Workshop photo** — About page (`src/content/docs/about.md`).
- [ ] **The Cosmic's real measurement plot** — the homepage Cosmic band
      (`src/components/home/CosmicBand.astro`) uses an illustrative FR
      curve, captioned as such. Replace with the actual measured-vs-
      target plot (per the Compass: never present invented data as
      measurement).
- The hero exploded-headphone diagram, FR-grid, and driver cutaway are
  real vector art from the design handoff — no replacement needed.

## Process

When fixing: verify against current supplier/retailer pages at the time of
the edit (per the Compass: accuracy over plausibility — never guess prices
or availability). Check off items here in the same commit as the fix.
