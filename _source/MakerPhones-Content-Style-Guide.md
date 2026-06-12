# MakerPhones — Content & Style Guide

**Version 1.1 · June 11, 2026**

*The working "how to write a chapter" guide. Positioning, the canonical author bio, and the voice north star live in **Project-Compass.md** — read that first; this expands the mechanics. Full historical/planning docs live in the repo, which is the source of truth.*

---

## Voice in practice

Per the Compass: clear, approachable, credible — a working professional explaining things to a friend in the workshop. The credibility is the engineering, not the adjectives.

**Do**
- Use contractions (we're, you'll, it's).
- Share real experience — what worked, what didn't, what you'd do differently.
- Admit when something is a judgment call, a tradeoff, or genuinely uncertain.
- Use "you" and "we"; ask the occasional question to keep the reader with you.
- Explain every technical term on first use; use everyday analogies.

**Don't**
- Reach for marketing hype ("revolutionary," "game-changing," "industry-leading").
- Pretend to certainty you don't have, or invent specifics.
- Talk down to beginners or gatekeep.
- Pad. If a sentence isn't doing work, cut it.

**On-brand**: "Here's what I learned the hard way so you don't have to." · "This is where it gets interesting." · "Your first build won't be perfect — and that's fine." · "Here's the thing nobody tells you about driver selection…"

**Off-brand**: "Leverage synergistic solutions." · "Industry-leading performance." · "You absolutely must…" · "Simply just…" · "Everyone knows that…"

Occasional mild profanity ("damn," "hell") is fine and authentic; keep it workshop-appropriate, never forced.

---

## Length & rhythm

- **1,200–1,800 words** per chapter (≈8–12 min read). Keep need-to-know, cut nice-to-know. One clear example per concept, not three.
- Paragraphs **2–4 sentences**, rarely five. People scan — long paragraphs get skipped.
- A descriptive subheading every ~200–300 words.
- Minimal formatting. Bullets only for genuine steps, distinct options, specs, or comparisons — not to break up prose.

---

## Chapter structure

1. **Opening** (2–3 sentences) — why this matters / what problem it solves.
2. **Core sections** — concept → technical detail → practical application, under clear subheads.
3. **Common Mistakes** — real, specific, problem → fix.
4. **What's Next** — natural-language links onward, logical progression.
5. **Footer** — difficulty, prerequisites, related links.

**Never include**: a table of contents, verbose "in this chapter we will…" intros, academic abstracts or summaries, restated conclusions, or hype.

---

## The non-negotiables

- **Clean chapter titles (H1) — no number.** Decimal numbers (1.1, 2.2) are allowed in **navigation chrome only** — sidebar, contents, breadcrumb, prev/next, on-page ToC — and never in headings or body prose.
- **Cross-references in natural language** — "the driver selection guide," never "see 2.3" or "Part 2."
- **Accuracy over plausibility** — never invent drivers, parts, suppliers, prices, or specs. When unsure, check or say so. A sourcing-and-build resource lives or dies on this.
- **Use the bio sparingly** — the canonical framing (Compass) when credentials genuinely add weight, not in every chapter.

---

## Canonical format: Markdown + frontmatter

One source of truth per chapter: a Markdown file under `src/content/docs/learn/<handle>.md`, route `/learn/<handle>`. Frontmatter carries the manual metadata and the Shopify mapping:

```yaml
---
title: Sourcing Components            # clean — no "Chapter N"
handle: sourcing-components           # = filename; frozen identity (see appendix)
part: 2                               # internal only
chapter: 8                            # internal only
difficulty: Beginner                  # Beginner | Intermediate | Advanced
prerequisites: [driver-selection-guide]
related: [driver-selection-guide, acoustic-chambers-and-enclosures]
read_time: 9
tags: [components, sourcing, suppliers]
description: "..."                     # Starlight meta + Shopify SEO description
excerpt: "..."                        # Shopify excerpt
---
```

- `title` and `description` are Starlight-native; the rest are custom fields (the content schema is extended to allow them).
- Callouts use Starlight asides: `:::caution` for Common Mistakes, `:::tip` for insights.
- Specs, measurements, and parameters go in monospace / code blocks.
- Markdown → Shopify HTML is deterministic; the frontmatter maps straight onto Shopify page fields at migration time.

---

## Quality checklist (before a chapter ships)

- [ ] Title clean — no "Chapter N."
- [ ] Under ~1,800 words.
- [ ] Reads aloud like you talking, not a textbook.
- [ ] Paragraphs 2–4 sentences; subheads every ~250 words.
- [ ] Every supplier, part, price, and spec verified — nothing invented.
- [ ] Cross-links are natural language, pointing to real handles.
- [ ] Has a real Common Mistakes section and a What's Next.
- [ ] Footer: difficulty, prerequisites, related.
- [ ] Every sentence earns its place.

---

## Appendix: chapter handle reference

Frozen handles — use these verbatim for filenames and cross-links. Live source of truth is the repo (`src/content/docs/learn/`). Routes are `/learn/<handle>`; at Shopify migration these become `/pages/<handle>` with identical handles. **✓ = written (32 of 32 — complete).**

**Part 1 — Fundamentals**
- ✓ how-headphones-create-sound
- ✓ understanding-frequency-response
- ✓ impedance-and-sensitivity
- ✓ open-vs-closed-back-design
- ✓ headphone-form-factors
- ✓ driver-technologies

**Part 2 — Components & Materials**
- ✓ driver-selection-guide
- ✓ sourcing-components
- ✓ acoustic-chambers-and-enclosures
- ✓ ear-pads-and-comfort
- ✓ damping-materials
- ✓ cables-connectors-hardware

**Part 3 — Design & Build Process**
- ✓ design-methodology
- ✓ 3d-design-for-headphones
- ✓ acoustic-chamber-design  *(note: close to Part 2's acoustic-chambers-and-enclosures — keep scopes distinct when written)*
- ✓ driver-mounting-and-assembly
- ✓ damping-strategy-and-application

**Part 4 — Measurement & Tuning**
- ✓ why-measure-headphones
- ✓ budget-measurement-setup
- ✓ taking-and-interpreting-measurements
- ✓ tuning-with-damping
- ✓ tuning-with-eq
- ✓ benchmarking-with-public-measurements
- ✓ advanced-measurement-topics

**Part 5 — Advanced Topics**
- ✓ acoustic-modeling
- ✓ resonance-control
- ✓ manufacturing-for-consistency
- ✓ professional-design-insights

**Part 6 — Special Topics**
- ✓ bluetooth-integration
- ✓ active-noise-cancelling
- ✓ microphone-integration
- ✓ custom-iem-design

**Build guides** (type: build-guide; no nav numbering; outside the chapter chain)
- ✓ your-first-build
- ✓ simple-open-back-build
- ✓ closed-back-studio-build

**Appendices** (no nav numbering; outside the chapter chain)
- ✓ glossary
- ✓ supplier-directory
- ✓ design-resources
- ✓ sources-and-further-reading
- ✓ troubleshooting-guide
- ✓ community-builds
