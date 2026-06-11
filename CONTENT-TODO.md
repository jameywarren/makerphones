# CONTENT-TODO — known stale facts

**Version 1.1 · June 11, 2026**

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

## Process

When fixing: verify against current supplier/retailer pages at the time of
the edit (per the Compass: accuracy over plausibility — never guess prices
or availability). Check off items here in the same commit as the fix.
