# MakerPhones — Project Compass

**Version 1.1 · June 11, 2026** *(1.1: numbering rule updated for the v2 design — decimal numbers allowed in nav chrome)*

*The single source of positioning, voice, and author bio for chat sessions. The repo is the source of truth for everything else (content, site, detailed docs). Keep only this + the voice/content rules + the slug reference in project knowledge; everything else lives in git.*

---

## What it is

MakerPhones is Jamey Warren's open reference for designing and building your own headphones — real engineering explained plainly enough that a first-time builder can follow it and trust it. Its own brand (makerphones.com) and a project of Warren Labs. **Resource mode:** the Reference Manual is the product right now — published openly, genuinely useful, credible because of who wrote it. Not a marketing brand.

## Who it's for

DIY makers and hobbyist headphone builders who want to understand how headphones work and build their own, from a first pair on up. (Industry peers are the Warren Labs audience, not this one. No customers yet.)

## Author bio — canonical, use this exact framing

25+ years in professional audio and the headphone industry:
- **Grace Design** — employee #1 (1997–2001)
- **HeadRoom** — VP of Operations → President & CEO (2003–2017); relaunched the entire headphone-amplifier line
- Designed his own headphone, the **Cosmic**

*This supersedes older project docs that say "30 years" or "Grace Design employee #3." The credibility rests on the bio being exactly right and identical everywhere — reconcile older copies to this.*

## Voice

Clear, approachable, credible — readable by a first-time builder, grounded in real engineering. **The credibility is the engineering, not the adjectives:** no hype, no padding, no audiophile-marketing voice. Honest about what's proven vs. a judgment call vs. a tradeoff. **Accuracy over plausibility — never invent drivers, parts, suppliers, prices, or specs; when unsure, say so or check.** Conversational workshop tone, short paragraphs.

## Content rules that don't change

- Chapter titles (H1) stay **clean — no numbers**. Decimal numbers (1.1–6.4, Part.WithinPartIndex) appear in **nav chrome only**: sidebar, contents, breadcrumb, prev/next, on-page TOC. No numbers or part-references in body prose. (The frontmatter `chapter` field is the internal global 1–30 index — never displayed.)
- Cross-references use **natural language**, never "Chapter 7" or "see 2.3."
- Target **~1,200–1,800 words** per chapter.
- Structure: why it matters → concept → technical detail → practical application → **Common Mistakes** → **What's Next**.
- Footer: difficulty, prerequisites, related links.
- Canonical content format is **Markdown + YAML frontmatter** (frontmatter carries the Shopify mapping). Slugs are frozen — see the slug reference.

## The manual

30 chapters in six parts — Fundamentals → Components & Materials → Design & Build → Measurement & Tuning → Advanced → Special Topics — plus five appendices. **State: 30 of 30 written — the manual is complete.** Remaining: the five appendices.

## Relationship to Warren Labs

MakerPhones is a sibling project referenced from warrenlabs.com. The deep headphone R&D lives in the Warren Labs lab (and feeds the Old Faithful headphone); MakerPhones is where that knowledge becomes a build-focused resource for makers. Same person, two audiences — keep MakerPhones written for the builder.

## Parked — don't build or steer toward unless reactivated

- The **parts/kit store, pricing, commerce** — deferred until wholesale suppliers exist. The store may take the root domain later; the manual stays portable for a clean Shopify import when it's time.
- The **Warren Labs commercial playbook** (cable Parts+Labor ×3.0, Stage/Studio/Master tiers, storefront frameworks) — hardware-specific, doesn't fit a manual brand.

## Where things live

- **Repo (source of truth):** all content, the Astro + Starlight site, and the full planning/reference docs. → `[github.com/<org>/<repo> — fill in once created]`
- **Project knowledge (thin, to prevent drift):** this compass, the voice/content rules, the slug reference. Nothing else.
- **Site:** Astro + Starlight → GitHub Pages on makerphones.com. Discussion in chat; implementation in Claude Code. Version-stamp every doc (version + date at top; bump on revision).
