# _source/ — migration inputs for the MakerPhones site build

Raw inputs the Claude Code session reads FROM. The session transforms them into the
live site (`src/content/docs/learn/*.md`) and the pruned archive (`project/`).
These are NOT the published source of truth — the repo output is.

## Authoritative (current — follow these for rules, bio, and handles)
- **Project-Compass.md** — positioning, canonical author bio, voice north star.
- **MakerPhones-Content-Style-Guide.md** — voice rules + frontmatter schema + frozen handles.
  Supersedes the old `CONTENT-CREATION-INSTRUCTIONS.md` and `Website_URL_slug_Reference`
  (intentionally NOT in this bundle). Use the Style Guide for content rules and handles.

## Migration source
- **maker-phones-chapters-1-13.html** — the 13 written chapters. Convert to Markdown +
  frontmatter; fold the internal "Part X | Chapter Y | Handle: …" lines and HTML metadata
  comments into frontmatter. Migrate FAITHFULLY. Known issues are fixed in a separate
  editorial pass tracked in `CONTENT-TODO.md`, not during migration:
  the outdated "30 years" bio in the driver-selection chapter, and stale sourcing facts
  (Zalytron, miniDSP EARS/UMIK pricing & availability, Dayton model numbers).

## Planning docs — port into project/, pruned to resource mode
- **makerphones-project-overview.md** — rewrite the commerce-forward sections to resource mode.
- **makerphones-site-structure.md**
- **makerphones-brand-identity.md** — voice section already absorbed into the two docs above; archive the rest.
- **headphone-research-summary.md** — dated reference; keep unchanged (prices are stale).
- **headphone-research-comprehensive.md** — dated reference; keep unchanged.

Across the port: update status everywhere from "11/30" to "13/30 (Parts 1–2 complete +
Design Methodology)", and fix the author bio everywhere to match Project-Compass.md
(25+ years; Grace Design employee #1, 1997–2001; HeadRoom VP Ops → President & CEO,
2003–2017; designed the Cosmic). Move the old 90-day launch calendar, if added later, to
`project/archive/`.
