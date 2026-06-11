# MakerPhones — Site Structure & Content Strategy

**Version 2.0 · June 11, 2026**

*Ported from the January 2026 planning doc, pruned to resource mode. The original (with monetization, launch plan, and platform evaluation) is preserved verbatim in `_source/makerphones-site-structure.md`.*

**What supersedes what:** the manual's six-part, 30-chapter structure with frozen handles (Project-Compass.md + the Content & Style Guide) supersedes this doc's original three-tier site map. The actual platform is **Astro + Starlight on GitHub Pages** (not the Ghost/WordPress evaluation in the original). Voice and article-structure rules live in the Content & Style Guide. What remains here: the gaps analysis, the long-range content map (useful when writing Parts 3–6 and the appendices), and the differentiation framing.

---

## What's missing in DIY headphone resources

### What currently exists

- **Scattered tutorials** — Instructables projects, random forum posts, GitHub repos
- **DIY Open Headphone project** — academic paper, 3D files, minimal assembly guidance
- **Homebrew Headphones** — best existing resource, focuses on one Bluetooth build
- **Head-Fi forums** — deep technical discussions but intimidating for beginners
- **Measurement databases** — Crinacle, InnerFidelity (archived), but no "how to measure" for DIYers

### Critical gaps MakerPhones fills

1. **Organized, progressive learning path** — beginner → intermediate → expert
2. **Acoustic design fundamentals explained accessibly** — most resources assume knowledge
3. **Component sourcing guide** — where to actually buy drivers and parts
4. **Measurement on a budget** — how to test without $10k+ equipment
5. **Material science for audio** — why certain materials, foams, damping work
6. **Design trade-offs explained** — not just "here's a build," but WHY decisions matter
7. **Community knowledge synthesis** — best practices scattered across forums, organized

## Site structure (as built)

- **Homepage** — splash landing: "Build Your Own Sound," one honest line, CTA into the manual. (A bespoke visual design is being explored; the original three-pathway-card concept is an option for that pass.)
- **/learn/<handle>** — the Reference Manual, one route per chapter, six sidebar groups in manual order. Difficulty, read time, prerequisites, and related links surface from frontmatter on every chapter.
- Search (Pagefind), on-page TOC, and prev/next navigation are on throughout.

The manual's structure is fixed: **Fundamentals → Components & Materials → Design & Build → Measurement & Tuning → Advanced → Special Topics**, plus five appendices (glossary, supplier directory, design resources, troubleshooting, community builds). Status: **13/30 written (Parts 1–2 complete + Design Methodology).**

## Long-range content map

The original doc's detailed page inventory, reorganized as input for the unwritten chapters. Treat as raw material, not commitments — the frozen handle list governs what actually gets written.

### Feeds Part 3 — Design & Build (Ch 14–17 pending)

- 3D design for headphones: printing materials (PLA, PETG, ASA), print settings for audio, CAD templates and standard dimensions
- Acoustic chamber design: volume/bass relationship, shape and soundstage, ventilation and ports *(keep scope distinct from Part 2's acoustic-chambers-and-enclosures)*
- Driver mounting and assembly: baffle design, mounting techniques, stereo-pair driver matching
- Damping strategy: iterative damping workflow, port tuning, where and how much

### Feeds Part 4 — Measurement & Tuning

- Why measure: objective vs. subjective, what measurements can and can't tell you, target curves
- Budget setups: ~$100–200 (UMIK-1 + DIY rig + REW) and ~$500 tiers; DIY alternatives (in-ear mic technique, flat-plate, relative comparisons) — *pricing/availability must be re-verified at writing time; see CONTENT-TODO.md*
- REW guide: setup, calibration, sweeps, interpreting graphs
- Taking and interpreting measurements: repeatability, smoothing, resonance peaks, channel balance
- Advanced topics: impulse response, CSD/waterfall plots, THD and distortion troubleshooting

### Feeds Part 5 — Advanced

- Lumped-parameter modeling: Thiele-Small for headphones, equivalent circuits, predicting bass response, free software tools
- Resonance control: driver Fs, cup resonances, diaphragm break-up
- Psychoacoustics: equal-loudness curves, why headphones need bass boost, Harman target, soundstage, transient response
- Multi-driver systems, planar-magnetic DIY, custom driver design (when to buy vs. build)
- Manufacturing for consistency: tolerances, repeatability, driver matching

### Feeds Part 6 — Special Topics

- Bluetooth/wireless integration (the Homebrew Headphones model as reference)
- Active noise cancelling, microphone integration, custom IEMs

### Feeds the appendices

- Glossary: every technical term, cross-referenced, beginner-friendly
- Supplier directory: verified sources, international options *(every entry re-verified at writing time)*
- Further reading: books, accessible papers, channels, communities
- Troubleshooting guide: common problems and fixes
- Community builds: user submissions, lessons learned *(requires community infrastructure — parked)*

## Differentiation

- **vs. Homebrew Headphones** — they focus on one Bluetooth build; MakerPhones is a full learning path with acoustic theory.
- **vs. Head-Fi forums** — deep but scattered and intimidating; MakerPhones is organized, progressive, approachable.
- **vs. DIY Open Headphone** — academic with minimal assembly support; MakerPhones is maker-focused and practical.
- **vs. Instructables** — one-off projects of varying quality; MakerPhones is curated, explained, and supported.

**Unique position:** the only comprehensive, beginner-to-expert resource for DIY headphone design, backed by 25+ years of professional audio and headphone-industry experience (Grace Design employee #1; HeadRoom VP Ops → President & CEO; designer of the Cosmic).

## Parked (from the original doc)

Preserved in `_source/makerphones-site-structure.md`; not built in resource mode:

- Monetization tiers, premium memberships, kits, consulting
- Community forum, build gallery, comment systems
- Email capture/newsletter funnels and the SEO/launch promotion calendar
- Design-file library with downloads (the three starter designs: Simple Open-Back, Closed-Back Studio, Ultra-Light Open)
- Video series strategy
