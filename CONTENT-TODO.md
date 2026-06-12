# CONTENT-TODO — known stale facts & pending assets

**Version 1.2 · June 11, 2026**

Facts known to be stale in the written chapters. Migration is faithful —
these are **not** fixed during migration; they're fixed in a deliberate
editorial pass, one commit per correction, so the change history is clean.

## Sourcing chapter

- [x] **Zalytron** removed from the supplier list *(fixed June 11, 2026)*.
- [x] **miniDSP EARS** — sourcing-components no longer carries its own
      measurement-gear recommendations; it points to Budget Measurement
      Setup (4.2), the single source of truth for measurement gear
      *(fixed June 11, 2026)*.
- [x] **miniDSP UMIK-1** — supply-constraint note + keep-an-alternative
      advice added to sourcing-components, folded into the pointer to
      4.2; the price now lives only in 4.2 *(fixed June 11, 2026)*.
- [x] **Dayton in sourcing-components** — verified against the Parts
      Express catalog: the generic "excellent selection of Dayton
      drivers" framing replaced with the one genuinely
      headphone-applicable part, the CE38MB-32 (# 285-131, 38 mm/32 Ω,
      ~$3.49, bass-heavy closed-back caveat) *(fixed June 11, 2026)*.
- [ ] **Dayton in driver-selection-guide** — still pending verification:
      it lists the CE38MB-32 (fine) but also CE50MB-32 and "PS95-8 and
      similar" as headphone drivers; the PS95-8 is a 3" full-range
      loudspeaker driver. Verify each model and price against the
      current catalog before editing — out of scope of the June 11
      sourcing-components fix.

## Outdated author bio in chapter bodies

The canonical bio (Project-Compass.md) is **25+ years; Grace Design
employee #1, 1997–2001; HeadRoom VP Ops → President & CEO, 2003–2017;
now building Old Faithful in the open**. These chapters carried older "30 years"
framing in body copy (migrated faithfully):

- [x] `how-headphones-create-sound` — opening, "I've built headphones
      for 30 years," and the excerpt (the visible chapter lede) — all
      reconciled to "25+ years" *(fixed June 11, 2026)*.
- [x] `driver-selection-guide` — body + excerpt reconciled to
      "25+ years" *(fixed June 11, 2026)*.
- [x] `design-methodology` — reconciled to "25+ years"
      *(fixed June 11, 2026)*.

## Cross-links to non-frozen handles (migration report)

`your-first-build` and `troubleshooting-guide` are referenced but are
not in the frozen 30-chapter handle list (troubleshooting is a planned
appendix, handle TBD). Decide in the editorial pass: re-point, rewrite,
or hold until the target exists.

- [x] `your-first-build` — now exists as a build guide; the body
      links in four chapters and the `related` references in six
      resolve automatically *(June 11, 2026)*.
- [x] `troubleshooting-guide` — now exists as an appendix; the
      `related` references in `cables-connectors-hardware` and
      `design-methodology` resolve automatically *(June 11, 2026)*.
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
- [x] `cables-connectors-hardware` — What's Next prose reworded to
      natural language (no part references); the gate's allowlist entry
      for this page is removed, so it's enforced strictly again
      *(fixed June 11, 2026)*.

## Real assets needed (v2 design placeholders)

The v2 design ships with styled placeholders — swap in real assets:

- [ ] **Bench portrait** of Jamey — homepage credibility strip
      (`src/components/home/CredStrip.astro`).
- [ ] **Workshop photo** — About page (`src/content/docs/about.md`).
- [ ] **Old Faithful's real measurement plot** — the homepage band
      (`src/components/home/OldFaithfulBand.astro`) uses an illustrative
      FR curve, captioned as such. Replace with the actual measured-vs-
      target plot as the open build progresses (per the Compass: never
      present invented data as measurement).
- The hero exploded-headphone diagram, FR-grid, and driver cutaway are
  real vector art from the design handoff — no replacement needed.

## Process

When fixing: verify against current supplier/retailer pages at the time of
the edit (per the Compass: accuracy over plausibility — never guess prices
or availability). Check off items here in the same commit as the fix.
