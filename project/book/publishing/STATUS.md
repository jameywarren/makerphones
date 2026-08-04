# Publishing status — *The Art and Science of Headphone Design*

Source of truth for ISBNs, pricing, and publishing progress. No credentials here
(Bowker/KDP logins live only in the author's password manager). Last updated 2026-08-04.

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
  - [x] **IngramSpark** — print + ebook **PUBLISHED** (pub date 26-JUN-26)
  - [~] **Apple Books / Kobo / Nook** — via IngramSpark ebook distribution. **Apple still not live
    as of 2026-08-04** — see "Apple Books — not live yet" below for the tripwire date

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
  for (1) crop marks / color bars (pp. 1–9) and (2) outside/top/bottom margins too small
  (pp. 272–280). **TWO real causes** (verified by rendering + a full 282-page pixel sweep):
  1. **Marks.** `book-press.css` added `@page { bleed: 3mm; marks: crop cross }`. The marks
     drew corner crop ticks **and** edge-midpoint registration targets into the bleed strip —
     KDP's crop-mark check caught them, and its margin check read those same edge marks as
     content in the margin. **Fix:** dropped bleed + marks → **no-bleed 7×10 interior**
     (MediaBox now exactly 504×720 pt = the selected trim; nothing actually bleeds —
     `.figure-bleed` is unused, the 8 part-openers carry only a near-white #fbeee6 wash).
  2. **Folio + running head too close to the trim.** Independently real: the bottom page
     number sat **0.22"** off the trim (under the 0.25" no-bleed min) and the running head
     **0.31"**. The body *text* was always fine (≥0.63"). `book.css`'s default
     `@bottom-center` had `margin-top: 6mm`, which pushed the folio *toward* the bottom edge.
     **Fix:** margin-box offsets only — folio `margin-bottom: 5mm`, running heads
     `margin-top: 4mm` (in the default, `:left`/`:right`, `chapter-opener`, `appendix`,
     `index` masters). These touch margin boxes, NOT the `@page` margin, so **pagination
     stays 282 pp and the cover spine is unaffected** (verified).
  - **Verified:** full 282-page sweep — no marks anywhere; the closest ink to any trim edge
    on *any* page is now **0.40"**, clearing both the 0.25" (no-bleed) and 0.375" (bleed)
    minimums. **Next: re-upload `artifacts/book-press-cmyk.pdf` (rendered 2026-06-28) to the
    KDP paperback; KDP re-reviews (~72h).**

## IngramSpark — published (acct #9945866)
Title fully set up (7×10 premium-color perfect-bound matte, 282 pp; $49.99 print / $9.99
ebook; wholesale 40%; returns yes-destroy; Sharjah skipped for negative comp; Amazon OFF —
KDP owns Amazon). New vector cover + EPUBCheck-clean EPUB uploaded; user proceeded past
the benign interior "high-res images" warning (Ingram auto-downsamples). eProof approved and
Confirmation completed; **title status = published, pub date 26-JUN-26.**

## Apple Books — not live yet (open item as of 2026-08-04)

**Verified absent from Apple's catalog**, not merely hard to find. Apple's public catalog API
returns nothing for the ebook ISBN or for a title/author search:

```
curl -s "https://itunes.apple.com/lookup?isbn=9798996829910&entity=ebook"   # → resultCount 0
curl -s "https://itunes.apple.com/search?term=Jamey+Warren&entity=ebook"    # → no match
```

Re-run either of those anytime — public, no login. A non-zero result means it went live.

**Ruled out:**
- *Apple wasn't selected.* The signed Ingram distribution agreement is in the author's files, so
  the channel was authorized at setup. (Note: that agreement proves **authorization**, not
  **delivery** — it is signed before any file ships. It does not confirm Apple received the EPUB.)
- *KDP exclusivity.* The Kindle edition is **not** in KDP Select, so nothing blocks Apple.
- *Previously published direct to Apple.* Never was — Ingram's "pull it from Apple first" rule
  doesn't apply.

**Not checkable by the author:** Ingram doesn't expose the per-retailer selection list after
setup, and gives no per-retailer ingestion status. Only Ingram support can see whether Apple
received / accepted / rejected the file.

**Timeline.** Real distribution started **~2026-07-02** (the cover re-upload after the glyph-drop
fix re-ran file processing) — *not* the 26-JUN-26 pub date, which is just on-sale metadata set at
Bowker. Ingram quotes 2–6 weeks to retailers; Apple sits at the slow end and adds its own
ingestion pass, so 6–8 weeks is unremarkable.

| Date | Meaning |
|---|---|
| ~Aug 13 2026 (6 wk) | Still normal. Keep waiting. |
| **~Aug 27 2026 (8 wk)** | **Tripwire — past normal. Act.** |

**At the tripwire:** contact IngramSpark support with the **ebook ISBN 979-8-9968299-1-0** and ask
specifically for the **Apple Books ingestion status** for that ISBN — received, accepted, or
rejected. A silent Apple rejection (metadata or EPUB) never resolves itself; waiting longer
cannot fix it.

**Fallback if Ingram's Apple pipe is the problem:** Draft2Digital for Apple/Kobo/Nook — typically
faster to Apple than Ingram. Would require pulling the ebook from Ingram's distribution to those
same retailers first to avoid a duplicate feed.
