# to-book — the book/PDF output target

Turns the manual into a single paginated document (`dist/book.html`) that you
can save as a PDF. It's the third projection of the one content source,
alongside the website and `scripts/to-shopify/`. Full plan:
[`project/book/PLAN.md`](../../project/book/PLAN.md).

## How it works

`collect.mjs` reads the **already-built** chapter HTML in `dist/learn/*`,
extracts each chapter's `<main>` (real prose + baked SVG figures), and
concatenates them in spine order — mirroring the `astro.config.mjs` sidebar —
into `dist/book.html`, with a title page, copyright page, and table of
contents. It reuses the site's real CSS bundle and fonts, forces the light
(print) colorway, and inlines [`src/styles/book.css`](../../src/styles/book.css)
for page geometry. [Paged.js](https://pagedjs.org) (loaded in the page)
paginates it.

`render.mjs` then serves `dist/` headlessly and prints the paginated book to
**`artifacts/`** (e.g. `artifacts/book.pdf`, `artifacts/book-press-cmyk.pdf`) —
a gitignored directory *outside* the `dist/` publish root. Keeping products out
of `dist/` means they're never served on makerphones.com and `astro build`
never wipes them. The book/ebook/print editions are paid; CI publishes only the
free web manual.

## Generate a PDF

**Option 1 — no new installs (recommended for v0.1):**

```bash
npm run book        # astro build && node scripts/to-book/collect.mjs
npm run preview     # serves dist/ at http://localhost:4321
```

Open <http://localhost:4321/book.html> in Chrome. Paged.js lays it out into
pages; then **Cmd-P → Save as PDF** (set margins to "None" — `book.css` owns
the page geometry).

**Option 2 — one command (headless, for automation):**

```bash
npm run book
npx serve dist -l 4321 &      # any static server at dist/ root
npx pagedjs-cli http://localhost:4321/book.html -o book.pdf
```

`pagedjs-cli` pulls a headless Chromium the first time. Serve from `dist/`
root so the `/_astro/...` asset paths resolve.

## Known v0.1 limitations

- **Spine is hand-mirrored** from `astro.config.mjs` — keep them in sync.
- **Parts viewer** (`daily-driver-parts`) prints a "see website" note instead
  of the live 3D widget; real stills are Phase 4.
- **TOC has no page numbers** yet; figure numbering is still page-local.
  Both land with the design system (Phase 2/3).
- Trim is Letter; the 7×10 print trim + CMYK come in Track 2.
