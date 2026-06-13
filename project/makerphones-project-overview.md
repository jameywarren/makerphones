# MakerPhones — Project Overview

**Version 2.0 · June 11, 2026**

*Ported from the January 2026 planning doc and rewritten to resource mode. The original (commerce-forward) version is preserved verbatim in `_source/makerphones-project-overview.md`. Positioning, the canonical bio, and voice rules live in `Project-Compass.md` — that doc wins on any conflict.*

---

## Mission

**Make DIY headphone design accessible to anyone with curiosity and a 3D printer by providing the comprehensive education and resources that don't currently exist.**

## Current mode: resource mode

**The Reference Manual is the product.** Published openly at makerphones.com, genuinely useful, credible because of who wrote it. Not a marketing brand, and not a store.

The parts/kit store, pricing, and all commerce are **parked** — deferred until wholesale suppliers exist. The manual's content stays portable (Markdown + frontmatter with frozen handles) so a Shopify cutover is a deterministic conversion plus a redirect map when that day comes. Nothing on the site should build toward, hint at, or depend on commerce until it's reactivated.

**Status: complete — 30 of 30 chapters plus all five appendices written and live.**

## The core problem

For decades, anyone who wanted to build their own headphones faced:

- Scattered tutorials with no coherent learning path
- Forums full of expert jargon, intimidating for beginners
- No organized knowledge about acoustic design fundamentals
- Unclear component sourcing (where do you even buy drivers?)
- Expensive measurement equipment ($10,000+) or nothing
- Trial and error with no guidance on what actually matters

The existing resources — Instructables one-offs, Head-Fi's scattered depth, Homebrew Headphones' single excellent build, DIY Open Headphone's academic minimalism, random YouTube — all leave the same gap: **a complete, beginner-to-expert resource that teaches WHY things work, not just HOW to copy a build.**

## The solution (resource mode)

1. **The Reference Manual** — 30 chapters in six parts (Fundamentals → Components & Materials → Design & Build → Measurement & Tuning → Advanced → Special Topics) plus five appendices. A structured learning path from first principles to original designs.
2. **Practical sourcing knowledge** — actual suppliers, actual parts, budget measurement setups ($100–500 instead of $10k). Verified, never invented.
3. **Professional knowledge synthesis** — best practices from forums, papers, and manufacturers, filtered through real industry experience and explained plainly.

Community features, design-file libraries, videos, and products are all future phases — see "Parked," below.

## What makes this credible

**Jamey Warren's background** (canonical — per Project-Compass.md):

- 25+ years in professional audio and the headphone industry
- **Grace Design** — employee #1 (1997–2001)
- **HeadRoom** — VP of Operations → President & CEO (2003–2017); relaunched the entire headphone-amplifier line
- Now designing his own open-back headphone, the **Daily Driver**, in the open — with AI as a design partner

This means: production experience at scale, thousands of headphones tested, manufacturer relationships most DIYers never get, and the ability to explain professional concepts accessibly. Building for himself first — an authentic use case.

### vs. the alternatives

| Resource | Strength | Weakness | MakerPhones advantage |
|----------|----------|----------|----------------------|
| Homebrew Headphones | Excellent single build | One design only | Full learning path + theory |
| Head-Fi forums | Deep expertise | Scattered, intimidating | Organized, accessible |
| DIY Open Headphone | Academic rigor | Minimal practical support | Maker-focused guidance |
| Instructables | Easy to follow | Surface-level one-offs | Professional depth |

**Positioning: professional audio knowledge made accessible to makers.**

## Target audience

**Primary — "curious builders":** makers, tinkerers, and DIY enthusiasts (own or can access a 3D printer) who want to understand how headphones work and build their own, from a first pair on up. Interested in audio but not necessarily audiophiles; value learning over buying.

**Secondary — "modders & upgraders":** already own headphones, want to improve them (pads, damping, cables) and understand what they're doing.

**Tertiary — "audio students & enthusiasts":** may never build; here for the educational content.

(Industry peers are the Warren Labs audience, not this one. No customers yet — and that's by design in resource mode.)

## How the work happens

- **Stack:** Astro + Starlight static site, deployed via GitHub Actions to GitHub Pages at makerphones.com. The repo is the source of truth for everything.
- **Content:** one Markdown file per chapter under `src/content/docs/learn/<handle>.md`, frontmatter carries the manual metadata and the future Shopify mapping. Handles are frozen (see the Content & Style Guide appendix).
- **Quality gates:** no visible "Chapter N"/"Part N" anywhere (build-enforced); cross-links in natural language; 1,200–1,800 words per chapter; every supplier/part/price verified, never invented.
- **Editorial debt** is tracked in `CONTENT-TODO.md` — known stale facts get fixed in deliberate passes, not silently.

## Operating principles

1. **Education first** — always explain why, not just how; assume curiosity, not existing knowledge.
2. **Transparency** — share failures and iterations openly; honest about limitations and tradeoffs; no hype.
3. **Accessible but not dumbed down** — serious technical content explained clearly; respect the reader's intelligence.
4. **Accuracy over plausibility** — never invent drivers, parts, suppliers, prices, or specs. When unsure, check or say so.
5. **Sustainable pace** — long-term project, not a sprint. Quality over quantity.

## Measures of success (resource mode)

Resource mode succeeds on usefulness and credibility, not revenue:

- The manual gets finished — 30 chapters plus appendices, every one meeting the style guide.
- Readers report actually learning and building successfully.
- External sites and communities link to it as the reference for DIY headphone design.
- The content holds up — facts verified, corrections tracked, nothing rotting silently.
- Search presence for "DIY headphones," "build your own headphones," and related terms grows organically from content quality.

Traffic and email-list milestones from the original plan are parked along with commerce; they become relevant again if/when the store reactivates.

## Parked — don't build or steer toward unless reactivated

- The parts/kit store, component marketplace, kits, design-file sales, memberships, consulting — all commerce.
- Community forum / build gallery infrastructure.
- The original phased revenue model and its metrics (preserved in `_source/makerphones-project-overview.md`).
- The Warren Labs commercial playbook (hardware-specific; doesn't fit a manual brand).

The store may take the root domain later; the manual lives under `/learn/` with frozen handles precisely so that cutover is a redirect map, not a migration.

## Why this matters (personal)

From Jamey's perspective:

"Every time I wanted to build my own headphones, I hit the same walls: information scattered across forums, manufacturers who wouldn't share, DIY resources that assumed expertise I didn't have. Even with my background at Grace Design and HeadRoom, even after visiting manufacturers, it took years to understand what actually matters in headphone design.

Most people don't have access to manufacturers. They don't have decades to figure it out. They just want to build something cool and understand how it works.

MakerPhones is the resource I wish existed when I started. It's sharing the knowledge that's usually locked behind NDAs and corporate walls. And honestly? I'm building this for myself too — documenting my own learning, organizing my knowledge, for people who geek out about this stuff the way I do."

---

**Project start:** January 2026
**Project lead:** Jamey Warren
**Legal entity:** Free River Studios LLC
**Status:** Resource mode — manual complete: 30/30 chapters + 5/5 appendices live
