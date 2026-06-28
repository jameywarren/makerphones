# Publishing status — *The Art and Science of Headphone Design*

Source of truth for ISBNs, pricing, and publishing progress. No credentials here
(Bowker/KDP logins live only in the author's password manager). Last updated 2026-06-28.

## ISBNs — Warren Labs block `979-8-9968299-x` (Bowker order #2531268)

| Edition | ISBN | Format | Price | Bowker |
|---|---|---|---|---|
| **Paperback** | 979-8-9968299-0-3 | Print / Paperback | $49.99 | ✅ assigned + complete |
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
- **Paid editions** — see `RUNBOOK.md`:
  - [~] **Amazon KDP** — Kindle ebook **PUBLISHED 2026-06-27** ($9.99); **paperback REJECTED in review 2026-06-28** (interior: crop marks + margins) → **fixed, awaiting re-upload** ($49.99)
  - [x] **IngramSpark** — print + ebook **set up 2026-06-27; eProof review pending** → Confirmation → Complete
  - [ ] **Apple Books / Kobo / Nook** — via IngramSpark ebook distribution (or Draft2Digital)

## Press files (generated locally — `dist/` is gitignored, so they stay on the author's machine)

| File | What | Command |
|---|---|---|
| `artifacts/book-press-cmyk.pdf` | Interior, **282 pp**, CMYK, **7×10 no-bleed, no marks** — KDP paperback | `npm run book:press:pdf` |
| `artifacts/book-press-pdfx1a.pdf` | Interior, PDF/X-1a — IngramSpark (slow ~40 min) | `npm run book:press:pdfx` |
| `artifacts/cover-kdp.pdf` / `-cmyk.pdf` | Full-wrap cover, 14.885 × 10.25 in, spine 0.635 in | `npm run book:cover` |
| `artifacts/book.epub` | Reflowable **EPUB 3** — Kindle + Apple/Kobo (via Ingram) | `npm run epub` |

> Book products now render to `artifacts/` (gitignored), not `dist/` — `astro build`
> no longer wipes them. Older builds may still sit in `dist/`; the **current** KDP
> interior to upload is `artifacts/book-press-cmyk.pdf` (rendered 2026-06-28).

Spine = page count × 0.002252 (KDP white). If the page count moves off 282,
recompute and update `--spine` in `project/book/cover/cover-print.html`.

> ⚠️ **`astro build` wipes `dist/`.** Astro clears the whole `dist/` on every build
> (`npm run dev` / `build` / `preview` all trigger it), deleting these gitignored
> artifacts — a concurrent session did this twice on 2026-06-27. Regenerate with the
> `book:*` / `epub` commands (covers + epub in seconds; `book:press:pdfx` Ingram interior
> ~25 min). Don't run a website build in parallel with a book render. **Durable fix TODO:**
> write the book outputs to a directory outside `dist/` so Astro can't delete them.

**EPUB v0.2 — BUILT + Ingram-validated.** `npm run epub` → `dist/book.epub`: reflowable EPUB 3, 47 chapters,
inline-SVG figures, 3 embedded fonts, front/back matter, navigable TOC + landmarks, the
ebook ISBN in the OPF, and the FR-graph cover as the raster cover image. Built by
`scripts/to-epub/build.mjs`, which reuses the to-book spine + chapter assembly (one
source). Every XHTML/OPF/NCX is validated **XML-well-formed** at build time (Java EPUBCheck
isn't available locally). **IngramSpark's strict EPUBCheck initially rejected v0.1; fixed in
commit 49beb94** — flatten Expressive Code blocks (they nest `<div>` in `<pre><code>`),
strip body `<link>`, externalize off-EPUB links, add nav to spine — now **validates clean on
Ingram**. See `EBOOK.md`.

## Companion docs
- `RUNBOOK.md` — step-by-step KDP + IngramSpark setup, file specs, decision gates.
- `METADATA.md` — BISAC codes, keywords, categories, description, comp titles.
- `EBOOK.md` — reflowable-EPUB strategy + `to-epub` build plan.

## Cover — redesigned + hardened to pure-vector 2026-06-27 (commit 7dfef66)
- Engine: `../cover/covers.js` + `cover-print.html` + `fr-svgs.js`. Warren Labs
  W-sine-wave logo inline SVG (warm charcoal). Spine = author (top) · title (center) ·
  Warren Labs + mark (foot), evenly-spaced orange dots.
- **Hero = the FR field plate** (FIG. 1, measured vs target), now elevated: plate bleeds
  past the text column, bolder orange curve (2.6→3.4) + subtle tinted response fill,
  shadow-free crisp plate.
- **100% vector** — grid + ruler are explicit SVG `<line>`s / solid rules, NOT CSS
  gradients or SVG `<pattern>`s (Chrome rasterizes both in print-to-PDF). The CMYK wrap
  now has **0 raster images + no transfer curves**, clearing both IngramSpark cover
  warnings. `render-cover.mjs` gs step gained `-dTransferFunctionInfo=/Remove`.
- KDP (0.635in spine) + Ingram (0.705in spine) via `npm run book:cover` /
  `book:cover:ingram`. KDP's live covers still show the pre-redesign art (optional update).

## KDP — Kindle live; paperback rejected → fixed (2026-06-28)
- **Kindle eBook** (id A3ULIJX13WJU86): **PUBLISHED** 2026-06-27, $9.99, 70%, all
  territories, NOT in KDP Select. Carries the pre-redesign cover (optional to update).
- **Paperback** (title id P7ACH508QJK): **REJECTED in review** — KDP flagged the interior
  for (1) crop marks / color bars (example pp. 1–9) and (2) outside/top/bottom margins too
  small (example pp. 272–280). **Root cause = one thing:** `book-press.css` added
  `@page { bleed: 3mm; marks: crop cross }`. The marks drew corner crop ticks **and**
  edge-midpoint registration targets into the bleed strip — KDP's crop-mark check caught the
  marks, and its margin check read those same edge-midpoint marks as content in the margin.
  The text block was never the problem (≥16mm / 0.63" off the trim everywhere).
  **Fix (commit on 2026-06-28):** dropped bleed + marks → **no-bleed 7×10 interior**
  (MediaBox exactly 504×720 pt = the selected trim; nothing in the book actually bleeds —
  `.figure-bleed` is unused and the 8 part-openers carry only a near-white #fbeee6 wash).
  No-bleed also drops the margin minimum to 0.25", which the 16mm margins clear by 2.5×.
  Re-rendered + verified (no marks, correct geometry). **Next: re-upload
  `artifacts/book-press-cmyk.pdf` to the KDP paperback; KDP re-reviews (~72h).**

## IngramSpark — eProof pending 2026-06-27 (acct #9945866)
Title fully set up (7×10 premium-color perfect-bound matte, 282 pp; $49.99 print / $9.99
ebook; wholesale 40%; returns yes-destroy; Sharjah skipped for negative comp; Amazon OFF —
KDP owns Amazon). New vector cover + EPUBCheck-clean EPUB uploaded; user proceeded past
the benign interior "high-res images" warning (Ingram auto-downsamples). **Next: review +
approve the eProof, then Confirmation → Complete.**
