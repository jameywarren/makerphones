# Ebook / EPUB strategy — *The Art and Science of Headphone Design*

**Book:** *The Art and Science of Headphone Design* — *A bench guide to how
headphones are designed, measured & built*
**Author / imprint:** Jamey Warren · Warren Labs (warrenlabs.com)
**Ebook ISBN:** 979-8-9968299-1-0 (paperback 979-8-9968299-0-3)
**Format facts that drive every decision below:** 7×10 in trim, ~282 pp,
premium-color interior, ~27 hand-drawn inline-SVG diagrams + FR plots + spec
blocks, a 3-font system (Schibsted Grotesk sans / Source Serif 4 body /
JetBrains Mono mono — all self-hosted variable woff2 via `@fontsource`), built
from Astro/Starlight markdown+MDX and paginated to PDF with Paged.js (see
`project/book/PLAN.md`, `scripts/to-book/`).
**Status of this doc:** strategy + plan. No build step exists yet; this
defines the `to-epub` target and the interim ship.
**Last updated:** 2026-06-26.

---

## TL;DR (the three lines)

1. **Ship the existing 7×10 print/screen PDF as the "ebook" on KDP and Ingram
   *now*** — it is done, it preserves every figure and the design system, and
   it is a legitimate ebook product today. This unblocks the listing.
2. **Then build a *reflowable* EPUB 3** (not fixed-layout, not PDF-as-EPUB) as
   the real Kindle/Apple/Kobo edition — reflowable is the only format those
   stores render well, is accessible/searchable, and our figures are already
   **scalable inline SVG** so they survive reflow as full-width plates.
3. **Generate it with a new `scripts/to-epub/` step that reuses the built
   `dist/` HTML + SVG + the three woff2 fonts** (the same collect→assemble
   pattern as `to-book`), packaged via a thin EPUB writer (or pandoc as a
   v0.1 shortcut). The design *system* (tokens, type, accent) carries; the
   *fixed page geometry* (7×10 `@page`, running heads, mirrored margins) is
   deliberately dropped — it has no meaning in a reflowable reader.

---

## 1. Decision: reflowable EPUB 3, with PDF as the interim ebook

### The three candidates, scored against *this* book

| Option | Figures (SVG/FR plots) | 3-font system | Kindle | Apple Books | Kobo | Accessibility / search | Verdict |
|---|---|---|---|---|---|---|---|
| **Reflowable EPUB 3** | SVG scales to any screen as a full-width plate; stays crisp | All 3 embed as woff2/ttf | First-class (KFX) | First-class | First-class | Resizable text, reflow, screen-reader order, full-text search | **Chosen** |
| **Fixed-layout EPUB** | Pixel-perfect to the 7×10 page | Embeds | Supported but second-class on KDP; no font resize | OK but no aggregator distribution (direct upload only) | Image-based FXL only | **Bad** — no resize, weak screen-reader order, EAA-hostile | Rejected |
| **PDF-as-ebook** | Perfect — it *is* the print file | Perfect | Not a Kindle format; sold only as a PDF download | Sideload only | Sideload only | Two-column 7×10 PDF is miserable on a 6″ phone | **Interim only** |

### Why reflowable wins for a figure-heavy technical book

The instinct with a 282-page, figure-dense, tightly-designed book is
fixed-layout — "keep it looking exactly like the print." For *this* book that
instinct is wrong, for four concrete reasons:

- **Our figures are vector, not raster.** Fixed-layout exists to protect
  designs where text and image positions are load-bearing and pixel-locked
  (children's books, comics, cookbooks). Our diagrams are **inline SVG built
  at SSG time** (`src/components/diagrams/*.astro`, `geometry.ts` runs at
  build) — they are *resolution-independent by construction*. A reflowable
  EPUB can drop each SVG in as a `width:100%` block plate that scales sharp
  from a 6″ Kindle to an iPad. We get fixed-layout's main benefit (crisp
  figures) without fixed-layout's costs. Fixed-layout would actually *rasterize
  away* the thing that makes our figures good.
- **Kindle treats fixed-layout as a second-class citizen and forbids font
  resizing**, which kills the book for low-vision readers and is exactly what
  the now-in-force European Accessibility Act pushes publishers away from
  ([KDP fixed-layout guidance](https://kdp.amazon.com/en_US/help/topic/GEGU359TQLKDJZZH),
  [reflowable-vs-FXL, 2026](https://www.ebookpbook.com/2026/02/23/reflowable-vs-fixed-layout-epub/)).
  A reference book people read *to look things up* must be searchable and
  resizable. Fixed-layout is neither.
- **Fixed-layout fragments distribution.** Apple won't take FXL through
  aggregators (direct iTunes Producer only); Kobo renders FXL as image-based;
  KDP's converter is finicky with it
  ([Kobo EPUB spec](https://github.com/kobolabs/epub-spec),
  [Foglio: reflow vs FXL](https://www.foglioprint.com/blog/reflow-vs-fixed-layout-ebooks)).
  Reflowable EPUB 3 is the **one file every store ingests cleanly** — Amazon,
  Apple, Kobo, Google, Nook all consume reflowable EPUB and Amazon converts it
  to KFX.
- **The 7×10 page geometry has no meaning on a phone.** Running heads,
  mirrored margins, part-opener spreads, and folio page numbers are *print*
  affordances. Reflowing the prose and letting each figure float as a plate is
  the *correct* reading experience on a handheld — not a compromise.

**What we give up by going reflowable, and why it's fine:** exact page
fidelity (irrelevant on reflow), side-by-side figure+caption spreads (we make
captions follow the figure as a block), and the designed part-opener spread
(we render it as a styled section head, not a full-bleed page). The
pixel-perfect artifact already exists — it's the **print PDF**, which is the
interim ebook and the canonical "see it exactly as designed" edition. We are
not losing fidelity; we're *splitting* it into the right container.

> **One caveat to watch, not to fear:** a few diagrams are CSS-animated stills
> gated on `prefers-reduced-motion`. They already read correctly as static SVG
> in the print pipeline; the EPUB step must inline the *resolved static* SVG
> (no `<script>`, no CSS animation) — which is exactly what the built `dist/`
> HTML already contains. The interactive parts-viewer (WebGL) has no place in
> an EPUB and gets the same treatment as in print: a baked still + a
> "see the website" callout (the `partsBlock()` logic in `collect.mjs`).

---

## 2. Generation path: reuse the built `dist/` HTML, not re-author, not raw-markdown

There are two honest paths from the existing source. We pick the second, with
the first as a v0.1 fallback.

### Path A — pandoc straight from `src/content/docs/learn/*.md{,x}` (fallback / spike)

Pandoc reads markdown → EPUB 3, embeds fonts with `--epub-embed-font`, and can
inline SVG ([pandoc EPUB guide](https://pandoc.org/epub.html),
[customizing pandoc](https://learnbyexample.github.io/customizing-pandoc/)).

- **Why it's tempting:** one command, no new code, proven for prose books.
- **Why it's *not* our primary path:** our figures are **not** markdown
  images — they are Astro/MDX components (`<DiaphragmExcursion/>`,
  `<Figure>`, etc.) that only become SVG *after `astro build`*. Pandoc sees
  the MDX component tags, not the rendered SVG, and either drops them or emits
  raw JSX. It also doesn't know our `--mp-*` tokens, chapter-scoped figure
  numbering (`Fig. N.m`), cross-reference resolution, or the spine order
  (that lives in `astro.config.mjs` + `collect.mjs`'s `SPINE`). Going from raw
  MDX means **re-implementing everything `to-book` already solved.**
- **Verdict:** keep pandoc in the back pocket for a *prose-only* sanity check
  or if Path B slips, but it is not the real pipeline.

### Path B — `scripts/to-epub/`: collect the built HTML, the same way `to-book` does (**chosen**)

`scripts/to-book/collect.mjs` already does the hard 80%: it reads the
**post-`astro build` `dist/` chapter HTML** in `SPINE` order, extracts the
`<div class="sl-markdown-content">` body, strips web-only chrome, resolves
chapter numbers (1–33), numbers figures `Fig. N.m`, rewrites cross-references,
and builds the index/glossary. **The SVG is already inline and final in that
HTML.** An EPUB writer wants exactly that per-chapter HTML — just packaged as
separate XHTML files in a zip instead of concatenated into one `book.html`.

So `to-epub` is **`collect.mjs`'s front half + an EPUB packager**, sharing a
refactored-out chapter-assembly core. Concretely:

```
src/content/docs/learn/*  ──[astro build]──▶ dist/<chapter>/index.html  (inline SVG, real CSS, woff2)
                                                   │
                  shared collect core ────────────┤  (spine order, body extract,
                  (factored from collect.mjs)      │   Fig. N.m, xrefs, index)
                                                   ├──▶ to-book   ──▶ dist/book.html ──▶ Paged.js ──▶ PDF
                                                   └──▶ to-epub   ──▶ one XHTML per chapter
                                                                        + epub.css (tokens, no @page)
                                                                        + 3 fonts (woff2 → +ttf fallback)
                                                                        + nav.xhtml (ToC) + OPF + cover
                                                                        └──▶ book.epub  (EPUB 3, reflowable)
```

**How each asset carries over:**

- **SVG diagrams → carry cleanly.** They're already inline `<svg>` in `dist/`.
  EPUB 3 renders inline SVG natively on Kindle/Apple/Kobo
  ([Kobo: SVG supported](https://github.com/kobolabs/epub-spec)). Wrap each
  figure block in `figure{ width:100%; page-break-inside:avoid }` and let the
  SVG's own `viewBox` scale it. Add `role="img"` + the existing `<figcaption>`
  text as the accessible description. **Best practice we'll follow:** keep SVG
  inline (not `<img src=data:>`) so it scales and stays selectable, and ensure
  each `<svg>` has a `viewBox` and *no* fixed pixel `width/height` attribute so
  reflowable readers shrink it to fit
  ([SVG sizing in reflow](https://community.adobe.com/questions-671/how-to-control-images-sizes-in-a-reflowable-epub-843448),
  [EPUB 3.3](https://w3c.github.io/epub-specs/epub33/core/)).
- **The 3 fonts → carry, with a fallback caveat.** We already self-host the
  variable woff2 (`dist/_astro/schibsted-grotesk-*.woff2`,
  `source-serif-4-*.woff2`, `jetbrains-mono-*.woff2`). Embed them via
  `@font-face` in `epub.css` and list them in the OPF manifest. **Caveat:**
  some e-ink Kindle firmware and older readers don't load *variable* woff2 and
  may ignore woff2 entirely — so **ship a static-weight `.ttf`/`.woff`
  fallback** for at least body + a bold, and accept that some readers will
  substitute their system serif (the reader's font-override setting wins on
  Kindle anyway). All three families are SIL OFL — embedding is licensed and
  already cleared in `PLAN.md`. This is the one place the design "softens":
  on devices that override fonts, the *content* survives, the *typeface*
  may not. That's correct for a reflowable book.
- **The `--mp-*` tokens / accent → carry as a flattened stylesheet.** Reuse
  the **light colorway** (already the print/`:root` default: ink `#111827` on
  warm white) but write the EPUB CSS with **resolved hex values, not
  `var()`/`color-mix()`** — many e-ink readers have weak CSS-variable support,
  and most render grayscale anyway, so the load-bearing orange accent
  (`#ea580c`) must degrade legibly to gray (it does; it's used with
  redundant labels/dashes, never color-alone). Keep the existing
  `stripModernSelectors()` discipline from `collect.mjs` (no `:is()`/`:where()`)
  — EPUB engines are as fussy as Paged.js 0.4.3.

**What breaks / needs handling (the honest list):**

- `@page`, running heads, mirrored margins, folio page numbers, part-opener
  *spreads* → **dropped** (no concept of a page in reflow). Part openers
  become styled section headings.
- `target-counter()` page references in the ToC/List-of-Figures and the
  page-cited cross-refs ("p. 84") → **dropped**; EPUB ToC uses hyperlinks
  (`nav.xhtml`), and in-text cross-refs become internal anchors ("see the
  driver-selection guide" → link), not page numbers. The index becomes a
  linked term list (we already only reference chapters, not pages — good).
- The **back-of-book index** maps naturally to a linked nav list (the
  glossary-seeded 53-term index from Phase 2 reuses directly).
- MDX interactive widgets (parts-viewer WebGL, parts-gallery, feedback) →
  **stripped**, same as print, replaced by baked stills + "see the website"
  callout. `collect.mjs` already strips these.
- Spec blocks / tables → fine; they're HTML tables, which reflow.
- FR plots → they're SVG, so same path as diagrams; verify the thinnest
  trace strokes survive at phone width (bump min stroke to ~0.75px in the
  EPUB colorway if any vanish).

---

## 3. Implementation plan — a `to-epub` step, sized like `to-book`

Effort target: **one weekend for v0.1, ~1 week to polished v1** — the same
shape as `to-book` Phase 1, because it reuses that pipeline's hard parts.

### Phase E0 — factor the shared collect core (½ day)

Extract from `scripts/to-book/collect.mjs` the chapter-assembly functions that
are output-format-agnostic into `scripts/to-book/lib/assemble.mjs`:
`SPINE`, `headOf`/`divInner`/`sanitizeBody`, `processFigures` (Fig. N.m),
`linkChapterRefs`, `buildIndex`, `partsBlock`, `stripModernSelectors`. Both
`collect.mjs` (PDF) and the new `to-epub/build.mjs` import it. Non-destructive:
`to-book` keeps working byte-for-byte (run `npm run book` before/after and diff
`dist/book.html`).

### Phase E1 — EPUB v0.1 (1 weekend)

New: `scripts/to-epub/build.mjs` + `src/styles/epub.css`. Steps:

1. `astro build` (reuse existing `dist/`).
2. Import the shared core; for each `SPINE` entry emit a standalone
   `OEBPS/ch-NN.xhtml` (XHTML-valid: self-close tags, namespaced SVG) carrying
   the inline SVG and the chapter body.
3. Write `OEBPS/epub.css` — the flattened, hex-resolved, `@page`-free
   stylesheet derived from `book.css`'s type/spacing rules.
4. Copy the three woff2 (+ generated ttf fallbacks) into `OEBPS/fonts/`,
   reference via `@font-face`, list in the OPF.
5. Generate `nav.xhtml` (EPUB 3 ToC + landmarks + List of Figures as links),
   `content.opf` (metadata: title, subtitle, author "Jamey Warren",
   publisher "Warren Labs", **ISBN 979-8-9968299-1-0**, language, the
   `rendition:flow` reflowable hints), `toc.ncx` (EPUB 2 fallback for old
   readers), and front matter (title, copyright with the ISBN + CC BY-NC
   note, preface — reuse the Phase-2 front matter, minus page-number cites).
6. Cover: render the front-cover composition from
   `project/book/cover/covers.js` to a **1600×2560 PNG/JPEG** (Kindle wants
   ≥1.6:1, ≥1200px wide) for the EPUB cover image (EPUB cover must be raster,
   not the SVG wrap).
7. Zip per EPUB OCF rules (`mimetype` first, stored/uncompressed).

**Two ways to actually produce the zip (mirrors `to-book`'s "two ways"):**
- **v0.1 shortcut:** hand the assembled per-chapter HTML + media to
  **pandoc** (`pandoc --to epub3 --epub-embed-font ... --css epub.css
  --epub-cover-image ...`) to do OPF/nav/zip plumbing. Fast to stand up;
  good enough to validate the figure/font carry-over.
- **v1 (full control):** write the OPF/nav/zip directly (small, no heavy dep —
  a ~150-line packager or the `epub-gen`-style approach) so we own figure
  numbering, the List of Figures, landmarks, and accessibility metadata
  exactly. This is the analog of owning `collect.mjs` instead of leaning on a
  converter.

8. **Validate** (non-negotiable gate, the EPUB equivalent of "open book.html
   in Chrome"): run **EPUBCheck → zero errors**, open in **Thorium Reader**
   (reflow sanity), and run **Kindle Previewer 3** (Amazon's KFX conversion
   surfaces hidden issues) — the 2026 standard QA loop
   ([EPUB 3 creation/fixing 2026](https://triomarketers.medium.com/epub-3-creation-and-fixing-the-complete-guide-for-self-published-authors-2026-882f7e8fd91e)).

### Phase E2 — polish (parallel / ~½ week)

Tune figure plate sizing at phone width, confirm thin FR traces survive,
add per-figure `aria` alt text from captions, test font-override behavior on
e-ink, set EPUB accessibility metadata (`schema:accessibilityFeature`, etc.)
for EAA/store compliance, and check the accent's grayscale fallback. Optional:
Google Play Books and Nook spot-checks.

### Package scripts (matches the existing `book:*` convention)

```jsonc
"epub":        "astro build && node scripts/to-epub/build.mjs",
"epub:check":  "npm run epub && epubcheck dist/book.epub"
```

### What's non-destructive / regenerable

- **Everything regenerates from source.** `dist/book.epub` is a build
  artifact (gitignore it like `dist/book.pdf`); the inputs are the same
  markdown/MDX + SVG + tokens that feed web and print. Edit a chapter once →
  web, PDF, and EPUB all update.
- `to-epub` **adds**, never mutates: new `scripts/to-epub/`, new
  `src/styles/epub.css`, two new package scripts. The factored
  `lib/assemble.mjs` is the only touch to existing code, and `to-book` output
  is diff-verified unchanged.
- No re-authoring of figures, fonts, or prose. The fonts and SVG are *copied*
  from the build, not hand-edited.

---

## 4. Interim recommendation — what to upload *now*

**Now (this week): upload the existing print/screen PDF as the ebook, on a
separate ISBN, and don't block the listing on the EPUB.**

- The **7×10 press PDF already exists and is done** (`npm run book:press:pdf`
  → CMYK; or the screen `book:pdf`). It preserves every figure and the full
  design system perfectly. It is a *legitimate* ebook deliverable — many
  technical/standards publishers sell exactly this.
- **Where it goes:**
  - **IngramSpark / direct PDF sale (Warren Labs site, Gumroad/Payhip):** PDF
    ebooks are accepted and natural there. Use **ISBN 979-8-9968299-1-0** for
    this ebook edition.
  - **KDP:** KDP does **not** sell PDFs as Kindle ebooks — it wants EPUB and
    converts to KFX. So **do not** wait on KDP for the ebook; launch the
    **paperback** on KDP now (979-8-9968299-0-3, the print pipeline is ready)
    and add the Kindle EPUB edition when E1 lands. A two-column 7×10 PDF would
    be a poor Kindle product anyway.
- **Why a stopgap and not the end state:** the 7×10 two-column PDF is rough on
  a phone (zoom-and-pan), not resizable, weakly accessible. Good as a "buy the
  exact designed artifact" download; not good as *the Kindle reading
  experience*. The reflowable EPUB is what makes the book pleasant on a 6″
  screen and searchable as a reference.

**Sequence:**
1. **Today:** KDP **paperback** live (ready) + PDF ebook on Ingram/direct
   under the ebook ISBN. The book is buyable.
2. **+1 weekend:** EPUB v0.1 (Path B, pandoc shortcut) passing EPUBCheck →
   upload to KDP (Kindle), Apple Books, Kobo. The PDF stays as the
   "designer's edition" direct download.
3. **+1 week:** EPUB v1 (owned packager, polished plates, accessibility
   metadata) replaces v0.1 across stores.

This way the listing is never blocked, the figure-perfect artifact ships
immediately, and the genuinely good reflowable Kindle/Apple/Kobo edition
follows on the same single-source pipeline that already produces the website
and the print book.

---

## Sources

- [KDP — Creating Fixed-Layout Books Without Pop-Ups](https://kdp.amazon.com/en_US/help/topic/GEGU359TQLKDJZZH)
- [KDP — Creating Reflowable Books](https://kdp.amazon.com/en_US/help/topic/GPNJPYK298J8TRRV)
- [Reflowable vs Fixed-Layout ePub (ebookpbook, 2026)](https://www.ebookpbook.com/2026/02/23/reflowable-vs-fixed-layout-epub/)
- [Reflowable vs Fixed Layout EPUB (Foglio)](https://www.foglioprint.com/blog/reflow-vs-fixed-layout-ebooks)
- [Kobo EPUB spec (SVG + FXL support)](https://github.com/kobolabs/epub-spec)
- [Pandoc — Creating an ebook with pandoc](https://pandoc.org/epub.html)
- [Customizing pandoc for beautiful PDF/EPUB](https://learnbyexample.github.io/customizing-pandoc/)
- [Controlling image/SVG sizes in reflowable EPUB (Adobe community)](https://community.adobe.com/questions-671/how-to-control-images-sizes-in-a-reflowable-epub-843448)
- [EPUB 3.3 spec (W3C)](https://w3c.github.io/epub-specs/epub33/core/)
- [EPUB 3 creation & fixing — 2026 guide (EPUBCheck/Thorium/Kindle Previewer QA loop)](https://triomarketers.medium.com/epub-3-creation-and-fixing-the-complete-guide-for-self-published-authors-2026-882f7e8fd91e)
