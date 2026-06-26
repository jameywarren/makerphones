# Samples — what the system looks like in the wild

Design against real pages, not just the CSS. These show the range the print
system has to handle.

## The generated book (the thing we're styling)

`scripts/to-book/collect.mjs` produces `dist/book.html` — all 47 chapters in
spine order, title page, copyright, and TOC, ready for Paged.js. Run
`npm run book` then `npm run preview` and open
<http://localhost:4321/book.html>. That file **is** the canvas: your `book.css`
restyles it. (It's gitignored build output, so it's not in this kit — generate
it locally, or ask for the latest copy.)

## Live pages — representative figure load

| Page | Why it's a good test |
|------|----------------------|
| [understanding-frequency-response](https://makerphones.com/learn/understanding-frequency-response) | The FR curve / plot system — the signature figure. |
| [how-headphones-create-sound](https://makerphones.com/learn/how-headphones-create-sound) | Driver cross-sections; figure-dense intro chapter. |
| [ear-pads-and-comfort](https://makerphones.com/learn/ear-pads-and-comfort) | Cross-section detail + comfort diagrams. |
| [taking-and-interpreting-measurements](https://makerphones.com/learn/taking-and-interpreting-measurements) | Measurement chain + diagnosis diagrams, spec blocks. |
| [daily-driver-design-spec](https://makerphones.com/learn/daily-driver-design-spec) | Spec blocks + the dark "Daily Driver" band (rich-black test). |
| [glossary](https://makerphones.com/learn/glossary) | Dense reference layout — appendix/index master test. |
| [supplier-directory](https://makerphones.com/learn/supplier-directory) | Comparison tables — table master test. |

## Toggle the theme

The site has a light/dark switch (top of any page). **The light theme is the
print colorway** — design for that. Confirm every figure reads correctly as
dark-ink-on-warm-white; that's the target surface.

## The motifs to honor

- Blueprint graph-paper grid behind hero/plate areas.
- Ruler dividers with an accent underline.
- Plate frames with corner ticks around figures.
- FIG-numbered diagrams with JetBrains Mono, letter-spaced labels.
- The one dark moment: the "Daily Driver" band (needs a rich-black build in
  print, not flat 100% K).
