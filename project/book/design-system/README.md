# Makerphones Design System — local mirror & manifest

The **"Makerphones Design System"** Claude Design project — the shared visual
foundation behind both the website ("Claude Design v2") and the printed book.
This folder mirrors the book-relevant + foundation files for offline reference
and version control; the full project (including the React/web UI kit and
component previews) lives in Claude Design and is re-syncable.

- **Source project:** Claude Design `6a763286-6fa7-481a-8e1a-a60cb819f4ea`
  ("Makerphones Design System", owner Jamey Warren), type `DESIGN_SYSTEM`.
- **Re-sync:** use the `DesignSync` MCP (claude_design) — `list_files` /
  `get_file` to pull, the `/design-sync` skill to push a local component
  library back. Auth via the claude.ai login or `/design-login`.
- **Where it's used:** the print system drives the book build —
  `src/styles/book.css` is the delivered `book.css` (adapted; see its header),
  consumed by `scripts/to-book/collect.mjs`. See `project/book/PLAN.md`.

## What's mirrored here

| Path | What it is |
|------|------------|
| `readme.md` | The full design guide — voice, palette, type, motifs, iconography, index. |
| `SKILL.md` | Agent-Skills entry point for designing with the brand. |
| `styles.css` | Global entry point — an `@import` manifest of the token files. |
| `tokens/colors.css` | The `--mp-*` palette (mirrors theme.css light theme 1:1). |
| `tokens/typography.css` | Type families, scale, weights, tracking. |
| `tokens/fonts.css` | `@import` the three webfonts (Google Fonts; the repo self-hosts via @fontsource). |
| `tokens/spacing.css` | Spacing, radii, the one warm shadow, blueprint + ruler motifs. |
| `tokens/print.css` | Print geometry tokens (trim, margins, baseline) + CMYK builds as comments. |
| `print-tokens.json` | **Print token source of truth** — web mirror + CMYK builds + export profile. |
| `print/README.md` | The seven page masters + the PDF/X-1a export profile. |
| `templates/chapter-page/ChapterPage.dc.html` | The chapter-page markup spec (implemented in collect.mjs). |
| `assets/fr-curve.svg` | The signature frequency-response figure. |

## In the project, not mirrored here (re-sync with DesignSync `get_file`)

These are the **web** design system (React previews for Claude Design) and
build artifacts — not consumed by the Astro site or the book build, and
safely versioned in the project:

- `book.css` — the print stylesheet, delivered. Lives adapted at
  `src/styles/book.css` (only change: font stacks mapped to the self-hosted
  `* Variable` names + a small "project glue" section + two Paged.js-compat
  fixes, all documented in that file's header).
- `print/page-masters.html`, `print/spec-sheet.html` — the seven masters at
  thumbnail scale and a PDF-ready one-page spec sheet (trim/grid/CMYK/master
  gallery). Worth pulling when commissioning print revisions.
- `components/core/{Button,Eyebrow,Badge,RulerDivider}.{jsx,d.ts,prompt.md}`
  + `core.card.html` — React UI primitives.
- `components/content/{Callout,SpecBlock,Figure,DifficultyDots}.{jsx,d.ts,prompt.md}`
  + `content.card.html` — React content components.
- `ui_kits/makerphones-learn/{Home,Contents,Chapter}Screen.jsx`,
  `LearnHeader.jsx`, `index.html`, `README.md` — the documentation-site UI kit
  (a React rendering of the live Astro site, for design iteration).
- `guidelines/*.card.html` (13) — foundation specimen cards (color, type,
  spacing, brand).
- `scraps/0{1,2}-chapter-mid.png` — design screenshots.
- `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json` —
  Claude Design runtime/index/lint artifacts.
- `templates/chapter-page/{ds-base.js,support.js}` — the `<x-dc>`/`<x-import>`
  preview runtime for the `.dc.html` template (not needed to build the book).

## How the book uses it

The book build does **not** consume the JSX components or `styles.css`
directly (the Astro site already ships the same tokens via `@fontsource` +
`theme.css`). The book pulls:
1. **`print-tokens.json` / `tokens/print.css`** → the values are reflected in
   `src/styles/book.css`'s `:root` and `book-press.css`'s CMYK accent.
2. **`book.css`** → `src/styles/book.css` (the seven page masters).
3. **`ChapterPage.dc.html`** → the chapter-opener markup (`ch-eyebrow` /
   `ch-lede` / `ch-meta` / `ch-rule`) that `collect.mjs` emits.

To refresh after a design update: re-pull the changed files with DesignSync,
re-apply the two documented edits to `book.css`, and run `npm run book`.
