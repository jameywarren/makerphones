# MakerPhones — Project Compass

**Version 1.5 · June 26, 2026** *(1.5: chapter count corrected to 33 — `measuring-raw-drivers` is counted in the numbered chain (manual.ts / astro.config), so Part 4 is eight chapters and the manual is 33; index range 1–33. 1.4: build-guide count updated to 7 — added the "Choosing a 3D Printer for Headphones" buying guide. 1.3: content-format line updated to the current Astro + Starlight / GitHub Pages stack — Shopify mapping marked parked, not current; slug pointer aimed at the Content & Style Guide handle appendix. 1.2: "The manual" counts reconciled to the filesystem — 32 chapters, 6 appendices, 6 build guides; chapter index range corrected to 1–32. 1.1: numbering rule updated for the v2 design — decimal numbers allowed in nav chrome)*

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
- Now designing his own open-back headphone, the **Daily Driver**, in the open — with AI as a design partner

*This supersedes older project docs that say "30 years" or "Grace Design employee #3." The credibility rests on the bio being exactly right and identical everywhere — reconcile older copies to this.*

## Voice

Clear, approachable, credible — readable by a first-time builder, grounded in real engineering. **The credibility is the engineering, not the adjectives:** no hype, no padding, no audiophile-marketing voice. Honest about what's proven vs. a judgment call vs. a tradeoff. **Accuracy over plausibility — never invent drivers, parts, suppliers, prices, or specs; when unsure, say so or check.** Conversational workshop tone, short paragraphs.

## Content rules that don't change

- Chapter titles (H1) stay **clean — no numbers**. Decimal numbers (1.1–6.4, Part.WithinPartIndex) appear in **nav chrome only**: sidebar, contents, breadcrumb, prev/next, on-page TOC. No numbers or part-references in body prose. (The frontmatter `chapter` field is the internal global 1–32 index — never displayed.)
- Cross-references use **natural language**, never "Chapter 7" or "see 2.3."
- Target **~1,200–1,800 words** per chapter.
- Structure: why it matters → concept → technical detail → practical application → **Common Mistakes** → **What's Next**.
- Footer: difficulty, prerequisites, related links.
- Canonical content format is **Markdown + YAML frontmatter**, built with Astro + Starlight and deployed to GitHub Pages. Frontmatter carries the manual metadata; it also pre-maps cleanly onto Shopify page fields, kept ready for the *parked* store migration. Slugs are frozen — see the handle appendix in the Content & Style Guide.

## The manual

33 chapters in six parts — Fundamentals → Components & Materials → Design & Build → Measurement & Tuning → Advanced → Special Topics — plus six appendices. **State: complete — 33 of 33 chapters, all six appendices, and seven build guides written and live.**

## Relationship to Warren Labs

MakerPhones is a sibling project referenced from warrenlabs.com. The deep headphone R&D lives in the Warren Labs lab (and feeds the Daily Driver headphone); MakerPhones is where that knowledge becomes a build-focused resource for makers. Same person, two audiences — keep MakerPhones written for the builder.

## Naming the builds — the convention (locked 2026-08-06)

**Name a build for the ROLE it plays**, not for what it is made of, how hard it is, or where it sits in a sequence. Loosely musical is preferred but not required.

| Build | Name | Status |
|---|---|---|
| On-ear, open-back — the first build, teaches the whole method | **First Chair** | locked |
| Over-ear, open-back — the one you live with | **Daily Driver** | exists; keep as is |
| Closed-back — isolating, for monitoring | **Session** | reserved |
| The hard one, when you're ready | **Encore** | reserved |

Held unassigned: **Knockabout**, **Workhorse**. Both mean "the durable one you don't fuss over", so they collide with each other and with Session. Keeping one strong name in reserve beats forcing it into a slot.

**Rule 1 — never use the Warren Labs plugin register.** Those are short concrete craft nouns: Level, Square, Bevel, Brace, Pare, Scribe, Temper, Ripple, Wake. Two brands drawing on one namespace blurs both and spends it twice. This rules out Primer, Pattern, Blank, Grain, Proof and Perch, however well any of them reads in isolation.

**Rule 2 — never name a build for its difficulty or its position in the line.** "Starter", "Primer", "Day One" all say *this is the beginner one*, which is permanent undersell for something that is also the flagship. First Chair works precisely because it means best-in-section, not first-in-line.

**Rule 3 — don't promise portability the product doesn't have.** Walkabout, Daily Carry, Jaunt and Ramble were all rejected on this: an open-back leaks both ways and is a home headphone. Daily Driver survives because "driver" is about *frequency of use*, not location.

**Rule 4 — check in-category before locking.** Lark was killed at the last step by KBEAR Lark, an IEM with its own Head-Fi showcase page. A collision on the forum we sell into is disqualifying, the same way "Press" was for the plugin line.

**No speakers.** Off brand. House Band and Fireside were good names for a category we are not entering.

## Parked — don't build or steer toward unless reactivated

- The **parts/kit store, pricing, commerce** — deferred until wholesale suppliers exist. The store may take the root domain later; the manual stays portable for a clean Shopify import when it's time.
- The **Warren Labs commercial playbook** (cable Parts+Labor ×3.0, Stage/Studio/Master tiers, storefront frameworks) — hardware-specific, doesn't fit a manual brand.

## Where things live

- **Repo (source of truth):** all content, the Astro + Starlight site, and the full planning/reference docs. → `[github.com/<org>/<repo> — fill in once created]`
- **Project knowledge (thin, to prevent drift):** this compass, the voice/content rules, the slug reference. Nothing else.
- **Site:** Astro + Starlight → GitHub Pages on makerphones.com. Discussion in chat; implementation in Claude Code. Version-stamp every doc (version + date at top; bump on revision).
