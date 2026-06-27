# Makerphones Design System — design guide

> Mirror of the project's `readme.md` (renamed to avoid a case-insensitive
> collision with this folder's `README.md` manifest).

**The Art and Science of Headphone Design** — by Jamey Warren.

A warm field-manual identity for an engineering reference work about how
headphones are designed, measured, and built. This system is the shared
foundation behind two surfaces: the **Makerphones Learn** documentation
website ("Claude Design v2") and **the printed book** — a press-native sibling
that reuses the exact same fonts, palette, and diagram motifs.

> One rule, inherited from the brief: **the book and the site never drift.**
> Same three fonts, same orange-on-warm-white field-manual look, same
> engineering-diagram motif language. Print adds the paged layer (trim, grid,
> CMYK); it does not reinvent the brand.

## Content fundamentals — how the brand writes

The voice is a **working engineer talking across a bench** — precise, plain,
quietly opinionated. It teaches by correcting received wisdom.

- **Person:** addresses the reader as **"you"**; the author appears as **"I"**
  only in framing/credits. Instructions are imperative — *"Seat the pad fully,"
  "measure twice," "treat that range as a suggestion."*
- **Tone:** confident and de-mystifying, with a dry edge. It names the common
  mistake out loud (*"the line every reviewer reaches for — and most read
  wrong," "A flat line is not a goal."*). Never hype, never marketing adjectives.
- **Casing:** sentence case everywhere in prose and headings. UPPERCASE is
  reserved for mono technical chrome — eyebrows, diagram labels, table heads,
  folios, tags (`FROM THE BENCH`, `FRONT CAVITY`, `MEASURED`).
- **Numbers & units:** always specific and unit-bearing (`32 Ω`, `+4 dB @ 60 Hz`,
  `±1.5 dB`, `10.5/14 pt`). A non-breaking space sits between value and unit.
- **Figures:** every diagram earns a chapter-scoped label and a one-line caption
  that states what it shows, not what it is (*"Measured response vs target."*).
- **Two recurring callout voices:** **"From the bench"** (warm, hands-on tips)
  and **"Common mistakes"** (the charcoal caution bar).
- **No emoji, ever.** No exclamation marks in body copy. Em dashes and the
  occasional semicolon carry the rhythm.

## Visual foundations

**Palette.** A barely-warm off-white page (`#faf8f5`) under dark-slate ink
(`#111827`, never pure black) and structural charcoal (`#2d3748`). One
load-bearing accent: **orange `#ea580c`**. The contrast split is a rule —
text-bearing orange uses the darker `#c2410c` (5.2:1); raw `#ea580c` is for
non-text marks only (traces, part numbers, dots, ticks, rules). The single dark
moment is the "Daily Driver" band (`#243140`/`#2d3748`) with a lifted orange
(`#fb923c`).

**Type.** Three families, three jobs, strictly kept: **Schibsted Grotesk**
(display/headings, 600–700, tight negative tracking) · **Source Serif 4**
(running body, 1.65 leading, 68ch measure) · **JetBrains Mono** (all technical
chrome, 0.14em uppercase tracking for labels).

**Backgrounds.** Mostly flat warm fills and white cards — **no photographic or
gradient hero washes.** The two textures are deliberate and faint: a **blueprint
graph-paper grid** (28px, 5%-opacity charcoal lines over the warm tint) behind
hero/plate areas, and the **ruler divider** (tick-marked hairline with a 56px
orange underline at the left). Imagery is **vector engineering diagrams**, not
photos — dark-ink-on-warm-white, no grain, no color photography.

**Diagrams.** The signature asset is the **frequency-response plot** (charcoal
dashed target vs solid-orange measured trace on a measurement grid). Other
figures are cross-sections with mono letter-spaced leader labels. Every figure
reads correctly as a static still — motion is gated behind
`prefers-reduced-motion` and is never required.

**Borders, radii & cards.** Restrained, engineering-not-consumer. Radii are
small: `4px` tags, `6px` controls/specs, `8px` cards/figures. Cards are a white
surface with a 1px warm hairline (`#e7e5e0`) and **at most one shadow** —
`--mp-shadow-warm`, a burnt-umber-tinted (never gray) `0 6px 20px rgba(124,45,18,0.06)`.
Figures are "plates": bordered cards, often with orange **corner ticks**.

**Motion & states.** Quiet. Transitions ~0.12–0.14s ease on color only. Hover =
darken; press = deepest orange; no scale/bounce, no spring physics.

**Layout.** A `max 80rem` splash column; long-form prose caps at 68ch. In print
the same identity becomes 7×10 in pages with mirrored margins on a 14pt
baseline grid.

**Avoid:** purple/blue gradients, emoji, glassmorphism, photographic heroes,
heavy drop shadows, pure-black text, rounded-pill "left-accent-border" cards,
Inter/Roboto/Arial.

## Iconography

The brand **does not use a general-purpose icon font or icon set.** Its visual
language is bespoke **engineering diagrams** (hand-built inline SVG, in
`src/components/`) and a small kit of CSS-drawn motifs (blueprint grid, ruler
divider, figure corner ticks, difficulty dots). The one self-contained figure —
the FR curve — is `assets/fr-curve.svg`. No emoji; arrows use the literal `→`.
If UI icons are genuinely needed, keep them 1.5px-stroke, square-cut,
monochrome (Lucide is closest in spirit) and flag the substitution.

## Index — what's in this system

See [`README.md`](README.md) (this folder's manifest) for the full file list,
what's mirrored locally vs in the Claude Design project, and re-sync steps.
