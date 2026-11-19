# to-book — the book/PDF output target

Turns the manual into one paginated document and prints it to PDF. It is the
third projection of the one content source, alongside the website and
`scripts/to-shopify/`. The EPUB (`scripts/to-epub/`) reuses this spine and
chapter assembly. Plan and history: [`project/book/PLAN.md`](../../project/book/PLAN.md).
Upload steps: [`project/book/publishing/RUNBOOK.md`](../../project/book/publishing/RUNBOOK.md).

## How it works

`collect.mjs` reads the **already-built** chapter HTML in `dist/learn/*`, takes
each page's content block (`.sl-markdown-content`: real prose and baked SVG
figures), cleans out web-only markup, and concatenates the pages in spine
order into `dist/book.html` (or `dist/book-press.html` with `--press`). It
adds the front and back matter: title page, copyright page, dedication,
contents and list of figures (both with page numbers), preface,
acknowledgments, index, about the author, colophon. It derives chapter
numbers and `Fig. N.m` numbers from spine position, tags chapter links with
"(Chapter N)", inlines the site CSS plus [`src/styles/book.css`](../../src/styles/book.css)
(7×10 trim, page masters), and loads [Paged.js](https://pagedjs.org) from
`node_modules` to paginate.

`render.mjs` serves `dist/`, opens the book in a system Chrome, waits for
Paged.js, and prints to **`artifacts/`** (gitignored, outside the `dist/`
publish root, so the paid editions are never served on makerphones.com and
`astro build` never wipes them).

`scripts/lib/edition.mjs` holds the title, author, ISBNs, edition statement,
the `REVISION` printing line and the page count the cover spine was built for.

## Commands

```bash
npm run book             # astro build + collect            -> dist/book.html
npm run book:pdf         # ...then render                   -> artifacts/book.pdf
npm run book:press:pdf   # press build + render + CMYK      -> artifacts/book-press-cmyk.pdf  (KDP)
npm run book:press:pdfx  # press build + render + PDF/X-1a  -> artifacts/book-press-pdfx1a.pdf (IngramSpark, ~40 min)
npm run book:parts       # daily-driver still               -> public/book/parts/daily-driver.png
npm run book:cover       # KDP full-wrap cover              -> artifacts/cover-kdp-cmyk.pdf
npm run book:cover:ingram
npm run epub             # astro build + cover PNG + EPUB   -> artifacts/book.epub
```

Use the `npm run` scripts. They build first. Rendering needs Google Chrome
(or `CHROME_PATH`); CMYK and PDF/X need Ghostscript.

## Guards (each stops the run with a message)

- **Stale build.** `collect.mjs` and the EPUB build refuse to run when any
  file under `src/`, `public/` or `astro.config.mjs` is newer than
  `dist/index.html`. `--allow-stale` overrides. (`book.css` and
  `book-press.css` are read directly, so editing them does not count.)
- **Spine.** The spine in `collect.mjs` is the book's own list. Every manual
  page the site knows (the lists in `src/data/manual.ts`, plus every
  `learn/*.md(x)` file) must be in `SPINE` or in `WEB_ONLY`. A spine page
  with no built page is an error, not a skipped chapter.
- **Clipped text.** After pagination `render.mjs` checks every page for text
  outside its page box and fails before the CMYK / PDF-X step if it finds
  any. `--allow-clipped` overrides.

`paged-guards.js` is inlined into the book and runs in the browser. It keeps
Paged.js from splitting a word across a page break (it did that one letter
late, and on left-hand pages the fragment fell off the page), and it provides
the clipped-text check.

## Known limitations

- **The index refers to chapters, not pages**, and only covers glossary
  headwords found in the 33 numbered chapters.
- **Links to build guides and appendices print with no locator.** Only links
  to numbered chapters get "(Chapter N)".
- **Parts viewer:** `daily-driver-parts` prints one assembled still plus a
  note pointing to the website. There is no exploded still (`book:parts`
  does not pass `--explode`).
- **Front and back matter is written twice**, once here and once in
  `scripts/to-epub/build.mjs`. A wording change goes into both.
- **The cover is separate** (`project/book/cover/`). Its spine width is typed
  by hand from the page count; `render.mjs` tells you when the count moves.
