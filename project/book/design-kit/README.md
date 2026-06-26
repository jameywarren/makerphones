# design-kit — hand this to Claude Design

A small, curated folder for commissioning the **print/book design system**.
Everything a design tool needs to produce a press-native sibling of the
website, and nothing it doesn't.

## What's here

| File | What it is |
|------|------------|
| `BRIEF.md` | The directions. Start here — it's the actual ask. |
| `tokens.json` | The token source of truth: web tokens to mirror + the print layer to fill in. |
| `SAMPLES.md` | Live pages + the generated `book.html` to design against. |
| `reference/theme.css` | The live web design system (token snapshot). |
| `reference/diagrams.css` | The figure/diagram motif system + FIG numbering. |
| `reference/book.css` | Our working v0.1 print layer — the floor to beat. |
| `reference/Figure.astro` | How figures are structured + captioned. |
| `reference/*.astro` (3 diagrams) | Representative figures (FR curve, two cross-sections). |

The `reference/` files are **point-in-time snapshots** of files in the main
repo (`src/styles/`, `src/components/`). They're copied here so the folder is
self-contained for upload; the originals are authoritative.

## How to use it — and a note on "Claude Design"

I (Claude Code) can't verify the exact upload mechanics of whatever
"Claude Design" surface you're using — those product details change, and I'd
rather not guess. But the **method is the same regardless of surface**, and
the principle is the thing that matters:

> **Give it this curated folder, not the whole repo.** A design tool reasoning
> over `node_modules/` and build output is noise; these ~9 files are signal.
> You said you didn't want to overcomplicate — this is the simple version.

**Recommended: upload the folder.** Drag `design-kit/` into a Claude Project
(or attach its files to a design conversation), then paste or point to
`BRIEF.md` as the prompt. A folder upload is a clean snapshot with no access
setup — best for a focused, one-shot design task like this.

**Alternative: connect the GitHub repo.** Only worth it if the designer needs
to browse the live repo or track changes over several rounds. It pulls in the
whole tree (more noise) and needs repo access set up. For this task, the
folder is simpler and I'd start there. If you do connect GitHub, still point
it at `project/book/design-kit/BRIEF.md` as the entry point.

**Either way, the entry point is `BRIEF.md`.**

## When it comes back

Claude Design should return `print-tokens.json` + `book.css` + a spec sheet.
Drop the new `book.css` over `src/styles/book.css`, wire `print-tokens.json`
into `scripts/to-book/collect.mjs` (inline its values as `:root` custom
properties), and re-run `npm run book`. Same pipeline — polished output.
