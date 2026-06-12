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
| `scripts/migrate-chapters.mjs` | One-time HTML→Markdown chapter migration (kept for provenance) |
| `CONTENT-TODO.md` | Known stale facts + migration anomalies for a later editorial pass |
| `project/` | Planning docs, ported from `_source/` and pruned to resource mode |
| `_source/` | Raw migration inputs (originals, untouched) |

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

## Status

**18 of 30 chapters live** under `/learn/` — Parts 1–2 complete, Part 3
complete except 3D Design for Headphones, and Part 4 started (Why
Measure Headphones, Tuning with Damping). Handles are frozen per the Content &
Style Guide appendix (`_source/MakerPhones-Content-Style-Guide.md`).

To add a chapter: write `src/content/docs/learn/<handle>.md` with the
frontmatter schema from `src/content.config.ts`, then add
`'learn/<handle>'` to its part's sidebar group in `astro.config.mjs`.
