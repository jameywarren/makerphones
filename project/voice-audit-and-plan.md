# MakerPhones — Voice Audit & De-AI Remediation Plan

**June 26, 2026 · v1.0**

A read-only audit of all 48 substantive manual articles for "AI tells" — places where re-writes
drifted from Jamey's workshop voice into generic LLM cadence — plus a systematic plan to fix them
without flattening the voice in the process.

Method: one independent reader per article scored against the Project Compass + Content & Style
Guide voice rules, with a controlled tell vocabulary. Findings were aggregated deterministically,
synthesized into a plan, then **adversarially re-checked** by a skeptic pass whose only job was to
catch over-flagging. The skeptic corrections below are load-bearing — they're what keeps the cure
from being worse than the disease.

---

## Headline

**This is drift, not rot.** Corpus average tell score is **3.6/10**. The engineering — real specs,
real anecdotes (HeadRoom cables, the $200-vs-$15 driver, felt on a ringing cup, gating/calibration
tricks) — is genuinely Jamey. The tells cluster in the *connective tissue*: intros, section-closers,
and transitions. The body prose is mostly fine.

Score distribution (0 = your voice, 10 = heavy AI):

| Score | Count | Articles |
|------:|------:|----------|
| 6/10 | 3 | active-noise-cancelling, custom-iem-design, why-measure-headphones |
| 5/10 | 9 | benchmarking, community-builds, designing-with-ai, driver-technologies, how-headphones-create-sound, impedance-and-sensitivity, open-vs-closed-back, professional-design-insights, tuning-with-damping |
| 4/10 | 8 | acoustic-modeling, damping-materials, manufacturing-for-consistency, simple-open-back-build, supplier-directory, taking-and-interpreting-measurements, understanding-frequency-response, your-first-build |
| 3/10 | 21 | the long tail (mostly bookend tells only) |
| 2–2.5/10 | 7 | **cleanest:** about, daily-driver-design-spec, glossary, measuring-raw-drivers, troubleshooting-guide, design-resources, listening-safely |

**The most important finding:** the skeptic pass returned **MIXED on all 8 top patterns — none was a
clean "genuine AI tell."** Several flagged patterns are actually *on-voice*: the Content & Style
Guide itself uses the "X, not Y" construction five times ("The credibility is the engineering, not
the adjectives"). So the strategy is **thin, don't kill** — break the metronome, keep the music.

---

## The corpus fingerprint (most prevalent first)

What makes the manual read as partly machine-written isn't any one sentence — it's the same handful
of stamped patterns recurring across dozens of articles. Fix each pattern once, everywhere, and the
"generated pulse" largely disappears.

1. **The "X, not Y" / "isn't just X, it's Y" antithesis reframe** — ~78–106 instances across ~35–37
   of 48 articles. The single biggest fingerprint. Most mechanical as bolded principle headers
   ("**AI helps with mechanics, not judgment.**") and as chained section openers (troubleshooting-guide
   opens nearly every section with one: "The chamber, not the damping." / "The cure is stiffness, not
   absorption.").
2. **Aphoristic mic-drop closers** — short rhythmic zingers ending sections instead of a concrete
   handoff. The genuinely bad part is *verbatim recurrence*: the map/territory/compass metaphor
   appears 3 ways in 3 articles; "the rest is reps" (expanded to "build, measure, listen, and build
   again") appears in 3; "a graph you can't read is just a wiggly line" appears verbatim in 2 adjacent
   measurement chapters.
3. **Restated-conclusion transitions** — explicitly *banned* by the Style Guide. Signature form: a
   "What's Next" opening with "Now that you understand X, you're ready to learn about Y…" in ~11
   files. "With this chapter, the measurement section is complete" is a textbook academic summary.
4. **Recurring lexical tics** — "Let me walk you through" in 5 chapter intros (the densest, cleanest
   tell); "earns its keep / earns its place / pays off"; "genuinely useful"; "Trust your ears"; "the
   fun part."
5. **Balanced both-sides symmetry** — mirrored two-clause sentences ("trusting only your ears… and
   trusting only the graph…"), worst when the same ears-vs-graph seesaw is restated across articles.
6. **Comma/colon-splice run-ons** standing in for an em-dash — concentrated in the measurement
   appendices (why-measure-headphones, budget-measurement-setup) and supplier-directory.
7. **"This is where ___" transition frame** — 18× across 14 files (the skeptic's correction to a
   mis-labeled "abstract-then-concrete" flag). Note: "This is where it gets interesting" is a
   *sanctioned* phrase — the issue is the repetition of the frame, not any single use.
8. **Rule-of-three roadmap openers** — bare "Three things…" scene-setters under a heading. Mild; the
   manual already varies its counts (two/four/several), which is good and on-voice.

---

## Skeptic-refined edit targets (the real worklist)

The raw counts overstate the job. Here's what to *actually* change, with the test that separates a
genuine tic from on-voice usage. **When in doubt, leave it** — flattening Jamey's voice costs more
than one surviving tic.

| Pattern | Raw count | Real edits | Keep / how to tell |
|---|---:|---:|---|
| Antithesis "X, not Y" | ~106 | **~25–35** (down to style-guide density) | KEEP any instance where "not Y" names a specific wrong thing a maker would actually do/believe ("the energy is in the plastic, not the air"). FIX structural placements — bolded headers, section openers/closers — and de-chain troubleshooting-guide. Cap ~1 per 400–600 words. |
| Aphoristic closers | 43 | **~5–6** (verbatim recurrences only) | KEEP singletons that land ("That loop is the whole game"). FIX only phrases that grep to 2+ articles: keep one map/compass, one "rest is reps," one "wiggly line"; vary the twins. |
| Restated-conclusion transitions | 23 | **~10–12** | The "What's Next" section is *required* by the Style Guide. FIX only the mechanical restatements — cut "Now that you understand…/you're ready to learn about…" and lead with the forward hook + one concrete reason. KEEP openers that already ask a real question (how-headphones-create-sound:103, acoustic-modeling:72). |
| "Let me walk you through" | 5 | **5** (fix all) | Content-free template in a fixed slot. Vary or delete in all 5 intros (headphone-form-factors, driver-selection-guide, open-vs-closed-back, driver-technologies, damping-materials). Densest clean win. |
| "earns its keep/place / pays off" | 9 | **~2–3** | KEEP the strongest (closed-back-studio-build is its natural home). Reword the rest to plain claims. |
| Balanced symmetry | 21 | **~3–5** | KEEP the terse corrective punch ("Fix the design, not the damping") — that IS the voice. FIX only long word-for-word mirrored sentences, and only when the same idea-shape repeats nearby (dedupe the ears-vs-graph seesaw to one strong statement). |
| Comma/colon splices | 23 | **~6–8** | KEEP colons that introduce a list/name/definition. FIX colons joining two independent full-thought clauses, and any paragraph carrying 2+ of them (why-measure:23, budget-measurement:51, supplier-directory:11/:53). |
| "This is where ___" frame | 18 | **~6–8** | KEEP the sanctioned "this is where it gets interesting" + 1–2 strongest. Rewrite generic ones ("This is where theory meets reality") to lead with the concrete noun. |
| Rule-of-three openers | 37 | **~3** | KEEP honest three-item lists (the count tracks content). FIX only the near-identical bare "Three [noun]…" scene-setter formula; vary the shape. |
| Banned words (simply, fundamentally, robust, crucial-as-filler) | ~8 | **all** | Cut on sight; these are explicit Style-Guide "don'ts." |

Net: roughly **70–95 real edits across the corpus**, not the ~290 raw flags — concentrated in the
bookends of ~30 articles.

---

## Worst offenders (fix first — scaffolding has spread into the body)

1. **active-noise-cancelling** (6) — "partners, not rivals," "The idea is elegant," "with clear
   eyes" tic, First/Second/Third/Finally spine, "for none of the complexity"/"pays off"/"the fun
   part." Convert the enumeration spine to bolded leads or prose.
2. **custom-iem-design** (6) — "where the magic lives" hollow-enthusiasm, multiple antithesis
   reframes, "isn't just X, it's Y," "the rest is reps" closer lifted near-verbatim.
3. **why-measure-headphones** (6) — heaviest antithesis density + the stacked colon-splice
   paragraph. The rhythm is the problem throughout, not just the edges.
4. **benchmarking-with-public-measurements** (5) — map/compass closer + rule-of-three spine + banned "simply."
5. **how-headphones-create-sound** (5) — "So let's start at the beginning," "Let's break it down
   together," "Here's the thing" + restated closer (3 violations).
6. **impedance-and-sensitivity** (5) — the full "Now that you understand…you're ready to learn"
   wrap-up, "crucial" inflation, "dive deeper" signpost.
7. **professional-design-insights** (5) — antithesis as nearly every section's closer + mic-drops.
8. **driver-technologies** (5) — uniform "appeal/advantages then DIY-challenge bullets" template;
   de-template and vary section openers.
9. **designing-headphones-with-ai** (5) — bolded "X, not Y" principle headers, "honest version"
   restatement, "doesn't need a fancy name" closer.
10. **open-vs-closed-back-design** (5) — "isn't just X, it fundamentally changes Y" framing,
    colon-splices, hedge-stacks, "audiophile summit" closer, banned restated "What's Next."

---

## The plan

### Phase 0 — Build the grep harness and kill-lists
Make the mechanical passes deterministic and reviewable *before* touching prose.
- Assemble a regex harness for the top tells: `, not \w`, `isn't just`, `not just`, `the map`,
  `the territory`, `the compass`, `Now that you understand`, `you're ready to learn`, `Let me walk
  you through`, `Let's break`, `Let's dive`, `dive deeper`, `earns its keep`, `earns its place`,
  `pays off`, `best of both worlds`, `the fun part`, `here's the thing`, `This is where`, `simply`,
  `fundamentally`, `robust`, `the magic`.
- Generate a per-article hit report so every fix is a reviewed diff, never a blind replace.
- Lock the brand-sanctioned whitelist into the harness so blessed phrases never auto-flag.

### Phase 1 — Corpus-wide mechanical kills (highest leverage)
Fix each stamped pattern once, everywhere. This is where the needle moves most.
- Delete banned restated-conclusion transitions; replace with a bare forward pointer + one concrete reason.
- Kill the map/territory/compass metaphor down to one instance.
- Thin antithesis to ~style-guide density; convert bolded-header and chained-opener uses first; keep the disambiguating mid-paragraph ones.
- Cut/vary recurring tics to one surviving instance each; cut "best of both worlds," "dive deeper," "robust," "simply," "fundamentally" on sight.
- Delete generic signposts ("Let's break it down together," "Let's dive into," "Let me walk you through").

### Phase 2 — Hand-rewrite the 10 worst offenders
Where scaffolding spread from bookends into the body, find/replace won't cut it.
- Rewrite intros, closers, transitions in Jamey's voice using the per-article fixes.
- Convert ANC's First/Second/Third/Finally spine to prose/bolded leads.
- De-template driver-technologies.
- Re-ground the theory explainers (why-measure, how-headphones-create-sound, impedance, understanding-frequency-response): split comma-splices, lead with the concrete.

### Phase 3 — The long tail (score 3–4)
Lighter articles with tells in a handful of known spots.
- Apply per-article topTells fixes (intros, stage framing, closers).
- Split appendix splices (supplier-directory, budget-measurement-setup); restore contractions and first-person where the essay register crept in.
- Convert bench-notes' stacked passive voice to first-person active.

### Phase 4 — Lock it in
Stop the drift from recurring on future writes.
- Append the pre-ship AI-tell checklist (below) to the Content & Style Guide.
- Add the grep harness as a pre-ship lint step against any new/edited chapter.
- Document the whitelist and the "one deliberate antithesis per article" rule so editors don't over-correct.
- Spot-check the clean score-2 articles only for their one or two flagged items — do **not** over-edit.

---

## Pre-ship AI-tell checklist (append to the Content & Style Guide)

1. **Antithesis:** search "not X, it's Y" / "isn't just X" / "not just." Keep at most ONE deliberate beat per article; rewrite the rest as plain declaratives.
2. **Closers:** does any section end on a rhythmic zinger or metaphor (map/territory, floor/ceiling)? Replace with a concrete next step or a real workshop aside. No mic-drops.
3. **Transitions:** no "Now that you understand X, you're ready to learn Y." Use a bare "Next up: X" + one concrete reason. Never summarize what was just read.
4. **Tics:** grep earns its keep/place, pays off, best of both worlds, the fun part, Let me walk you through, dive deeper, here's the thing, Trust your ears. Each survives in at most one article.
5. **Banned words:** simply, fundamentally, robust, revolutionary, game-changing, seamless, leverage, unlock, elevate, delve, cutting-edge, crucial-as-filler. Cut on sight.
6. **Intensifiers:** actually, genuinely, incredibly, dramatically, significantly — delete or replace with a real number/magnitude.
7. **Hollow enthusiasm:** "where the magic is," "the clever part" — name the concrete thing instead.
8. **Signposts:** cut "Let's break it down," "Let's dive into," "Let me show you." Start with the claim.
9. **Run-ons:** any comma/colon splice joining two full clauses gets a period or em-dash. Read aloud — out of breath = break it.
10. **Rule-of-three:** don't pre-announce "three things." Loosen rhythmic triplets so they read talky.
11. **Voice:** contractions present? First-person experience? At least one real tradeoff or "what I'd do differently"? If it reads like a polished encyclopedia entry, it's drifted.
12. **Credibility:** is the authority coming from the engineering and real specs, or from adjectives? Delete every superlative — does the claim still stand? It should.

---

## Over-correction guardrails (what NOT to strip)

- **Don't flag a sanctioned phrase on a single use:** "Here's what I learned the hard way…," "This is where it gets interesting," "Your first build won't be perfect — and that's fine." Only flag when the same phrase recurs across many articles.
- **Keep** contractions, direct "you"/"we," the occasional rhetorical question, mild profanity. These ARE the voice — roughing prose up with them is often the fix, not the tell.
- **Never strip real anecdotes or named specifics:** the HeadRoom cables story, $200-vs-$15 driver, Dayton CE warning, felt-on-a-ringing-cup, gating/calibration tricks, heat-set temps, X-pattern screws. These do the credibility work — the opposite of an AI tell.
- **Preserve technical precision and real numbers.** Invented specs are the problem; real ones are the point. Don't soften concrete specs into vague language chasing "false certainty."
- **Keep honest hedging** where the uncertainty is genuine. Only cut STACKED hedges (generally/tends to/usually piled together).
- **Keep one deliberate antithesis or earned aphorism per article** if it lands and sounds like him. Break the metronome, don't ban the device — uniform flattening would homogenize the voice as badly as the AI cadence did.
- **Don't over-edit the clean score-2 articles** (about, glossary, daily-driver-design-spec, measuring-raw-drivers, troubleshooting-guide). Fix only the one or two flagged items each.
- **Terse genre conventions are fine:** the glossary's fragments and the supplier directory's list format suit their form. Remove the actual tells, don't "fix" them into conversational prose.

---

*Full per-article findings (every flagged quote, line number, and suggested fix for all 48 articles)
were produced by the audit and can be regenerated. This document is the actionable summary.*
