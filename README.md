# MakerPhones

**Version 1.0 · June 11, 2026**

The MakerPhones Reference Manual — an open reference for designing and
building your own headphones. Astro + Starlight, deployed to GitHub Pages
at [makerphones.com](https://makerphones.com).

**Resource mode:** the manual is the product. No commerce is built; the
content stays portable (clean Markdown + frontmatter) for a deterministic
Shopify conversion later. See `Project-Compass.md` for positioning, the
canonical author bio, and voice rules — it is authoritative.

## Layout

| Path | What |
| --- | --- |
| `src/content/docs/index.mdx` | Splash homepage (placeholder hero; bespoke design coming) |
| `src/content/docs/learn/<handle>.md` | Manual chapters — one file per chapter, frozen slugs |
| `src/content.config.ts` | Frontmatter schema (Starlight + chapter fields) |
| `src/components/ChapterMeta.astro` | Difficulty / read-time / prereqs / related row |
| `src/styles/theme.css` | Brand tokens (`--mp-*`) — restyle by swapping tokens |
| `scripts/check-no-chapter-numbers.mjs` | Quality gate: no visible "Chapter N" / "Part N" |
| `scripts/to-shopify/` | Shopify export bridge (stub — finished at store-launch) |
| `CONTENT-TODO.md` | Known stale facts for a later editorial pass |
| `project/` | Planning docs (ported from `_source/` once present) |

## Commands

```sh
npm install
npm run dev        # local dev at localhost:4321
npm run build      # static build to dist/
node scripts/check-no-chapter-numbers.mjs   # quality gate (after build)
```

Deploys on push to `main` via `.github/workflows/deploy.yml`
(build → quality gate → Pages). `public/CNAME` carries the custom domain.

## Content rules (non-negotiable)

- Part/Chapter numbers are **internal only** (frontmatter `part`/`chapter`) —
  never in visible titles or headings. The build's quality gate enforces this.
- Cross-references are natural language (`/learn/<handle>` links with the
  chapter title as text), never "Chapter 7."
- ~1,200–1,800 words per chapter; structure: why it matters → concept →
  technical detail → practical application → Common Mistakes (`:::caution`)
  → What's Next.
- Slugs are frozen — `_source/Website_URL_slug_Reference` verbatim.

## Pending: content migration

The 13 written chapters, the slug reference, and the planning docs migrate
from `_source/` (not yet in the repo). When they land:

1. Convert each chapter to `src/content/docs/learn/<handle>.md` per the
   schema in `src/content.config.ts`.
2. Add the chapter slugs to the sidebar groups in `astro.config.mjs`
   (Part 1: ch 1–6 → Fundamentals; Part 2: ch 7–12 → Components & Materials;
   Part 3: ch 13 → Design & Build).
3. Port planning docs into `project/`, pruned to resource mode
   (90-day launch calendar → `project/archive/`; status → 13/30; bio →
   Compass-canonical everywhere).
