# The Art and Science of Headphone Design — book plan

**Working title:** *The Art and Science of Headphone Design*
**Author:** Jamey Warren
**Status:** Track 1 (PDF) — scaffolding in place, v0.1 generating.
**Last updated:** 2026-06-26

This is the living tracking doc for turning the makerphones reference manual
into (1) a downloadable PDF and (2) a printed, published book. Update the
**Status board** at the bottom as phases move. Everything here defers to
`Project-Compass.md` for voice/positioning.

---

## 1. The core idea

The manual is **one structured content source**
(`src/content/docs/learn/*.md{,x}`, sequenced by the `astro.config.mjs`
sidebar) that already projects to one output — the live website — and has a
proven second projection stubbed in `scripts/to-shopify/`. **The book is a
third output target**, alongside web and Shopify: same Markdown/MDX, same
SVG figures, same `--mp-*` tokens, run through a new build script that emits
a paginated PDF instead of HTML pages. Edit a chapter once; the site, the
store, and the book all update.

This dictates the toolchain: anything that forces re-authoring the ~27
hand-built SVG diagrams (LaTeX, Typst, InDesign) breaks the single-source
model. Anything that runs the real Astro-built HTML through a browser engine
(Paged.js, Prince/DocRaptor) preserves it. **We use the browser-engine
path.**

```
src/content/docs/learn/*  ──[astro build]──┬──▶  website (live)
                                            ├──▶  shopify (stub)
                                            └──▶  scripts/to-book ──▶ dist/book.html
                                                       │
                                          Paged.js ────┤
                                                       ├──▶ screen PDF      (Track 1)
                                                       └──▶ CMYK PDF/X ─▶ POD book (Track 2)
```

---

## 2. Reality check — what's done vs missing

**Done (the manuscript is complete — this is a typeset job, not a writing job):**

- **33 chapters written, zero stubs**, across 6 parts; plus **7 appendices**
  and **7 build guides** = **47 content files**, ≈ 61.5k words ≈ 175–240
  printed pages.
- **Figures are vector-native and ~80–85% print-free.** ~27 diagram
  components in `src/components/diagrams/*.astro` are static SVG built at
  SSG time (`geometry.ts` runs at build, not runtime); animations are CSS
  gated behind `prefers-reduced-motion` and read correctly as stills.
- **The light theme is already the print colorway.** The default `:root` in
  `src/styles/theme.css` is light (ink `#111827` on warm white `#faf8f5`).
  Print just pins light-mode tokens — no dark→light inversion needed.
- **Back-matter raw material exists:** `learn/sources-and-further-reading.md`
  (annotated bibliography), `learn/glossary.md`, `about.md` (bio),
  `license.md` (CC BY-NC 4.0 prose / MIT design files).

**Missing — the real work (none of it is writing chapters):**

1. **Back-of-book index** — none exists; the web leans on search + the
   `related`/`prerequisites` frontmatter graph. This is the single largest
   net-new editorial task.
2. **Document-wide figure numbering** — the ~22 `<Figure>` instances are
   page-local ("Fig. 1" repeated). Needs chapter-scoped numbering
   (`Fig. 4.2`) to drive a List of Figures.
3. **Front/back matter** — title page, formatted copyright page, preface
   ("how to use this book"), dedication, colophon, designed part dividers.
4. **CMYK colorway** — `--mp-accent #ea580c` is a vivid RGB orange that
   dulls toward brick in CMYK, and it's load-bearing (every measured trace,
   part number, difficulty mark). Remap once at the token layer (Track 2).
5. **Parts-viewer render** — `PartsViewer.astro` + `parts-viewer.js` is live
   WebGL with no static fallback (only in `learn/daily-driver-parts.mdx`).
   Needs headless GLB → 2–4 stills + a "see website" callout. v0.1 hides it
   and prints a note.

**Stale numbers to reconcile (Phase 0):** `manual.ts`'s dead
`WORKING_TITLES` constant lists 17 "unwritten" handles that all now have
files; `contents.mdx` / `about.md` say "32 chapters" (it's 33);
`Project-Compass.md` says "13 of 30".

---

## 3. Track 1 — the downloadable PDF (do first)

**Toolchain:** Paged.js (open source, MIT) running the real Astro-built
HTML. Because Paged.js *is* a browser, `var()`, `color-mix()`, and inline
SVG render verbatim — zero diagram re-authoring.

**Where it lives:**
- `scripts/to-book/collect.mjs` — assembles `dist/book.html` from the built
  chapters in spine order (mirrors the `astro.config.mjs` sidebar). Reuses
  the real `_astro/*.css` bundle + fonts; forces `data-theme="light"`; adds
  a title page, copyright page, and table of contents; hides web-only chrome
  (`.mp-foot`, feedback, parts-viewer canvas); loads the Paged.js polyfill.
- `src/styles/book.css` — the print-only `@page` layer (trim, margins,
  running heads, page breaks, figure keep-together). Inlined into
  `dist/book.html` by the collect step.
- `npm run book` → `astro build && node scripts/to-book/collect.mjs`.

**Generate a PDF (two ways):**
1. **No new installs (recommended for v0.1):** `npm run book`, then
   `npm run preview`, open `http://localhost:4321/book.html` in Chrome →
   Paged.js paginates → Cmd-P → "Save as PDF".
2. **One command (automation):** `npx pagedjs-cli` against the served
   `book.html` → `book.pdf`. Pulls headless Chromium; wire up once the
   weekend MVP is proven.

**v0.1 is deliberately ugly-but-complete:** every chapter in order, real
figures, generated TOC, page numbers, embedded fonts, letter size, default
margins, placeholder part dividers, parts-viewer replaced by a note. A real,
readable, shareable PDF that proves the pipeline before any design polish.

**Polished v1:** swap in the Track-5 design system (`book.css` from Claude
Design) — 7×10 trim, mirrored margins, part-opener spreads, running heads,
figure numbering + List of Figures, real front matter. Same pipeline.

---

## 4. Track 2 — the printed book

Shares Track 1's `book.html` + `book.css`; change the renderer flags and add
the color/press layer. Migration cost ≈ near-zero while we stay in the
HTML-engine category.

- **Trim:** 7×10 in (178×229 mm) — technical-book standard; room for FR
  plots and exploded views (6×9 is cramped).
- **Color tier:** premium color (clean saturation for flat vector fills, not
  photo-grade). ~250pp ≈ **$19–20/unit** on KDP.
- **POD:** KDP **+** IngramSpark — KDP for Amazon reach/margin, Ingram for
  the bookstore/library/academic channel a technical title benefits from.
- **ISBN:** buy a Bowker 10-block (~$295) and publish under an own imprint
  (e.g. "Warren Labs" / "makerphones Press"). Each format needs its own ISBN
  (paperback / optional hardcover / PDF). A free KDP ISBN locks to Amazon.
- **Press file:** PDF/X-1a, all-CMYK (the `#ea580c` remap pays off here),
  300dpi rasters, 0.125″ bleed, embedded fonts (all three are SIL OFL,
  cleared), separate full-wrap cover (spine width from page count). Produce
  via Ghostscript after Paged.js (free, approximate) **or** DocRaptor
  (hosted Prince, native PDF/X + CMYK in one step).

---

## 5. The design-system ask (Claude Design)

Deliver `project/book/design-kit/` to a Claude Project (curated folder, not
the whole repo). The brief and curated assets live in
`project/book/design-kit/BRIEF.md`. Ask for: `print-tokens.json` (mirrors
`--mp-*` 1:1 + print-only tokens), `book.css` (Paged.js `@page` stylesheet
consuming those tokens, 7 page masters), and a one-page spec sheet. Reuse the
existing three fonts and palette; the only new color decision is the CMYK
build for `#ea580c`.

---

## 6. Open decisions (author calls)

1. **Ship v0.1 now vs polish first** → recommend ship; the manuscript is
   complete, don't let polish gate "complete."
2. **Print cross-reference style** — the style guide bans "Chapter N" and
   uses natural-language refs. Print needs page numbers. Recommend keeping
   the phrasing but resolving to page cites ("the driver selection guide,
   p. 84").
3. **PDF-only vs commit to POD** → do Track 1 unconditionally; decide POD
   after holding the v0.1 PDF.
4. **Title + imprint** — keep the title; pick a short imprint name for the
   spine/ISBN.
5. **Toolchain for the press file** — Paged.js + Ghostscript (free) vs
   DocRaptor (paid, native CMYK). Decide at Phase 5.

---

## 7. Status board

| Phase | What | Effort | State |
|-------|------|--------|-------|
| 0 | Reconcile stale numbers (`WORKING_TITLES`, "32"→33, Compass) | ½ day | ✅ done |
| 1 | PDF v0.1 — `scripts/to-book/` + `book.css` + `npm run book` | 1 weekend | ✅ done |
| 2 | Editorial prep — figure numbering ✅, front/back matter ✅, **index** ✅, page numbers ✅, cross-refs ✅ | 1–2 wk | ✅ done |
| 3 | Design system — imported from Claude Design, `book.css` + tokens wired in, renders | parallel | ✅ done |
| 4 | Print colorways + parts stills — press geometry ✅, interim CMYK accent ✅, stills ☐ | 3–5 d | ◑ stills left |
| 5 | Press file + POD — `render.mjs --cmyk` + cover scaffold ✅; gs+ICC, accounts, ISBN ☐ | 1 wk | ◑ accounts left |
| 6 | Proof, correct, publish | 1–2 wk | ☐ todo |

**What's built (2026-06-26):** the whole pipeline runs. `npm run book` →
`dist/book.html` (Letter, all 47 chapters, Fig. 1–23 + List of Figures,
title/copyright/contents/preface/colophon). `npm run book:press` →
`dist/book-press.html` (7×10, 3 mm bleed, crop marks, CMYK-tamed accent).
`npm run book:pdf` / `book:press:pdf` drive a headless render via
`scripts/to-book/render.mjs` (needs Chromium via npx + Ghostscript for CMYK —
not available in the build sandbox, runs on your machine). Cover scaffold +
spine math in `project/book/cover/`. **Left, and they're the author's calls:**
the back-of-book **index**, parts-viewer **stills** (GLBs are in
`builds/daily-driver/docs/models/`), the **real CMYK build** + POD **accounts
/ ISBN**, and the **design system** (kit is ready to hand off).

**Calendar to first printed proof:** ~3–6 weeks, dominated by the index,
CMYK figure proofing, and proof shipping — not platform setup.
**Cost to first proof:** ~$30 (proof only) to ~$325 (with the Bowker block).

### Changelog
- 2026-06-26 — Cover + press + parts. **Cover brief** pushed into the
  Makerphones Design System Claude project (`cover/BRIEF.md`) — design the
  cover there, no folder upload. **CMYK press** is the default press file
  (`book:press:pdf` → `book-press-cmyk.pdf`, KDP-ready, ~2 min); **PDF/X-1a**
  wired as a separate slow flag (`book:press:pdfx` → `book-press-pdfx1a.pdf`,
  embeds a coated-CMYK output intent via `scripts/to-book/pdfx/`; ~40 min as
  it flattens transparency to PDF 1.3 — run only when uploading to
  IngramSpark). **Parts-stills harness** (`book:parts`, render-parts.mjs):
  headless three.js renders the daily-driver GLB → `public/book/parts/`;
  collect.mjs embeds the assembled still automatically (the exploded view is
  `--explode`, off until the groups-manifest node names are reconciled with
  the GLB). Stills are baseline — hand-replace with nicer renders.
- 2026-06-26 — Editorial pass: TOC + List of Figures now carry real **page
  numbers** (Paged.js target-counter); in-prose **cross-references** resolve
  to "(Chapter N)" (186 of them); a glossary-seeded **index** (53 terms,
  chapter-referenced); rewritten **preface**, **about-the-author** page, and
  **Warren Labs** imprint on the copyright/colophon. Fixed a pagination stall:
  the daily-driver parts-viewer / parts-gallery (3D widgets + inline scripts)
  were silently truncating the book at ~241 pp — now stripped from the print
  HTML; the full book renders to **282 pp**. Cover brief drafted
  (`project/book/design-kit/COVER-BRIEF.md`).
- 2026-06-26 — Plan documented; Track 1 scaffold created
  (`scripts/to-book/collect.mjs`, `src/styles/book.css`, `npm run book`);
  design-kit brief drafted.
- 2026-06-26 — Integrated the **Makerphones Design System** (Claude Design
  project `6a763286`): `src/styles/book.css` is now the delivered Paged.js
  stylesheet (seven page masters), `collect.mjs` emits the design's markup
  (part openers with the big accent numeral; chapter openers with
  `Chapter N` eyebrow + lede + meta rule + ruler divider; appendix/guide
  masters); **book-only derived chapter numbers (1–33)** and chapter-scoped
  figures (`Fig. N.m`) per the locked decision. Headless render works
  end-to-end → **240-page PDF** (puppeteer-core + system Chrome,
  `protocolTimeout: 0`, stability wait). Fixes: strip `:is()`/`:where()` from
  inlined CSS (Paged.js 0.4.3 can't parse them); inject figure numbers
  (Paged.js drops CSS-counter state across page fragments). Design system
  mirrored to `project/book/design-system/`.
- 2026-06-26 — Pushed both tracks: Phase 0 count reconciliation (dead
  `WORKING_TITLES` removed; "32"→33 in `contents.mdx` / `about.md` /
  Compass v1.5); document-wide figure numbering (Fig. 1–23) + List of
  Figures; preface + colophon + enriched copyright; press mode
  (`book-press.css`, `npm run book:press`); headless render +
  CMYK helper (`render.mjs`, `book:pdf` / `book:press:pdf`); cover scaffold
  (`project/book/cover/`).
