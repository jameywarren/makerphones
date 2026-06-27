# Publishing status — *The Art and Science of Headphone Design*

Source of truth for ISBNs, pricing, and publishing progress. No credentials here
(Bowker/KDP logins live only in the author's password manager). Last updated 2026-06-27.

## ISBNs — Warren Labs block `979-8-9968299-x` (Bowker order #2531268)

| Edition | ISBN | Format | Price | Bowker |
|---|---|---|---|---|
| **Paperback** | 979-8-9968299-0-3 | Print / Paperback | $39.99 | ✅ assigned + complete |
| **Ebook** | 979-8-9968299-1-0 | EPUB (Electronic book text) | $9.99 | ✅ assigned + complete |

Unused ISBNs still in the block (for future editions/formats — e.g. hardcover, 2nd ed):
`-2-7`, `-3-4`, `-4-1`, `-5-8`, `-6-5`, `-7-2`, `-8-9`, `-9-6`.

## Bowker title records — both officially assigned 2026-06-27
- **Title:** The Art and Science of Headphone Design
- **Subtitle:** A bench guide to how headphones are designed, measured & built
- **Contributor:** Jamey Warren — Author
- **Publisher / imprint:** Warren Labs
- **Pub date:** June 26 2026 · **Status:** Active · **Audience:** Trade
- **Subjects:** Technology (primary) + Music (secondary)
- **Description:** ~180-word retail blurb (see `METADATA.md` §5)
- Everything stays editable on Bowker; only the ISBN↔format binding is locked.

## Names
- **Legal:** James A. (Arthur) Warren — copyright holder + Bowker registrant of record.
- **Pen name / byline:** Jamey Warren — on the cover and title page.
- In `scripts/to-book/collect.mjs`: `AUTHOR`, `COPYRIGHT_HOLDER`, `ISBN_PAPERBACK`, `ISBN_EBOOK`.

## Where it's sold
- **Free online** — makerphones.com (text CC BY-NC). The funnel, not a conflict.
- **Paid editions** — not yet live; see `RUNBOOK.md`:
  - [ ] **Amazon KDP** — paperback + Kindle ebook (biggest reach + margin)
  - [ ] **Apple Books** — ebook (via Apple Books Connect or through IngramSpark)
  - [ ] **IngramSpark** — extended print (bookstores/libraries) + wide ebook (Apple/Kobo/B&N)

## Press files (generated locally — `dist/` is gitignored, so they stay on the author's machine)

| File | What | Command |
|---|---|---|
| `dist/book-press-cmyk.pdf` | Interior, **282 pp**, CMYK — KDP paperback | `npm run book:press:pdf` |
| `dist/book-press-pdfx1a.pdf` | Interior, PDF/X-1a — IngramSpark (slow ~40 min) | `npm run book:press:pdfx` |
| `dist/cover-kdp.pdf` / `-cmyk.pdf` | Full-wrap cover, 14.885 × 10.25 in, spine 0.635 in | `npm run book:cover` |

Spine = page count × 0.002252 (KDP white). If the page count moves off 282,
recompute and update `--spine` in `project/book/cover/cover-print.html`.
**Still to build:** reflowable EPUB (`to-epub`) for Kindle + Apple/wide — see `EBOOK.md`.

## Companion docs
- `RUNBOOK.md` — step-by-step KDP + IngramSpark setup, file specs, decision gates.
- `METADATA.md` — BISAC codes, keywords, categories, description, comp titles.
- `EBOOK.md` — reflowable-EPUB strategy + `to-epub` build plan.

## Cover
- Engine: `../cover/covers.js`. Warren Labs W-sine-wave logo is inline SVG; recolored
  to warm charcoal. Spine = author (top) · title (center) · Warren Labs + mark (foot),
  evenly-spaced orange-dot separators.
- **Hero = the FR field plate** (FIG. 1, measured vs target; `fr-svgs.js`). Renders to
  both the KDP (0.635in spine) and Ingram (0.705in spine) wraps via `npm run book:cover`
  / `book:cover:ingram`. (A blowout-headphone hero was tried and reverted — see git
  history if revisiting.)

## KDP paperback — draft in progress (title id P7ACH508QJK)
Filled + saved: all Details (3 categories, 7 keywords), Content (own ISBN, Warren Labs,
premium color, 7×10, bleed, matte cover). **Author-only remaining:** upload the two KDP
files, answer the AI-content question, run the previewer, set price ($39.99 / all
territories / Expanded Distribution OFF — Pricing page is gated until the uploads land),
order proof / publish.
