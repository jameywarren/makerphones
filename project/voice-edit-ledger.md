# Voice De-AI — Edit Ledger (execution record)

**June 26, 2026** · companion to [voice-audit-and-plan.md](voice-audit-and-plan.md)

The operational record for the de-AI pass: the central cross-article decisions (made once, by one
hand, so the fixes stay coherent), the per-file worklist, and the guardrails every edit obeys.
Mechanical hits come from `scripts/voice-lint.mjs`; judgment comes from the audit + skeptic pass.

## Baseline (from `node scripts/voice-lint.mjs`)

45 files with hits · 45 HARD · 191 soft · 180 intensifiers. Pattern totals: antithesis 111,
lexical-tic 32, banned-word 22, this-is-where 16, isnt-just 16, restated-conclusion 14,
aphorism-metaphor 10, signpost 9, rule-of-three 4, hollow-enthusiasm 2.

## Central cross-article decisions (keep ONE, vary/cut the rest)

These are the verbatim recurrences the skeptic flagged as the genuine tell. Resolve them globally so
the same image never reads as a template.

- **map / compass / territory metaphor** — KEEP `benchmarking-with-public-measurements.md:56` ("The
  database is the map; your rig is the compass" — load-bearing). CUT the filler "here's the map"
  excerpt closers in `bluetooth-integration.mdx:12` and `custom-iem-design.mdx:12`. REWORD
  `community-builds.md:61` ("manual is the map; builds are the territory") and
  `sources-and-further-reading.md:14` ("the map we wish we'd had"). LEAVE `simple-open-back-build.md:53`
  ("stages are the map; this is the turn-by-turn") — different, working idiom.
- **"a graph you can't read is just a wiggly line"** — KEEP `taking-and-interpreting-measurements.mdx:18`
  (the hook). VARY `budget-measurement-setup.mdx:75`.
- **"The rest is reps" / "build, measure, listen, and build again"** — KEEP `your-first-build.md:65`
  ("The rest is reps." — its natural home). REWORD the two near-verbatim capstones at
  `professional-design-insights.md:87` and `custom-iem-design.mdx:82`.
- **"Let me walk you through"** — CUT/vary in all 5 intros: headphone-form-factors, damping-materials,
  driver-selection-guide, open-vs-closed-back-design, driver-technologies. Content-free template;
  start with the substance instead.
- **"best of both worlds"** — REWORD both: `bluetooth-integration.mdx:56`, `microphone-integration.mdx:63`.
- **"Now that you understand/know …, you're ready to learn …"** — restated-conclusion openers in ~11
  "What's Next" sections. Cut the restatement, lead with the forward hook + one concrete reason.
  LEAVE openers that already ask a real question (how-headphones-create-sound).
- **"This is where ___"** (13×) — KEEP the sanctioned "this is where it gets interesting" + the 1–2
  strongest; rewrite generic ones to lead with the concrete noun.
- **"earns its keep/place" / "pays off"** — keep the strongest 1–2 (closed-back-studio-build is the
  natural home for "earns its keep"); reword the rest to plain claims.
- **"Trust your ears"** — deliberate motif of the measurement chapters. LEAVE (thin only if 4+ in one file).
- **"genuinely useful"** — the Compass's own phrase; keep 1, vary the rest toward concrete.

## Guardrails (every edit obeys these)

- **Thin, don't kill.** Break the metronome, keep the device. At most ONE deliberate antithesis /
  earned aphorism per article if it lands like him.
- **KEEP "X, not Y" when "not Y" names a real mistake** a maker would make ("the energy is in the
  plastic, not the air"). FIX structural placements: bolded headers, section openers/closers, chains.
- **Never touch** real anecdotes/specs (HeadRoom cables, $200-vs-$15 driver, Dayton CE warning, felt
  on a ringing cup, heat-set temps, X-pattern screws, gating/calibration). These do the credibility work.
- **Preserve technical precision and real numbers.** Don't soften specs chasing "false certainty."
- **Keep** contractions, "you"/"we", the occasional question, mild profanity, genuine hedging.
- **Don't over-edit** the clean score-2 articles (about, glossary, daily-driver-design-spec,
  measuring-raw-drivers, troubleshooting-guide) — fix only their one or two flagged items.
- **"elevated [frequency region]" is technical, not hype** — the lint flags it; keep it.
- Frontmatter: fix tells in `excerpt`/`description` prose, keep YAML keys/structure intact.

## Execution

Per-file bundles (harness hits + audit fixes per file) drove a one-agent-per-file pass; each made
surgical edits to its own file under the guardrails above, then returned an edit log. Central
verification re-ran the harness and diffed the worst offenders.

## Results (de-AI pass, June 26, 2026)

- **224 edits across 45 files; 190 flagged items deliberately left** (the kept "X, not Y" that name
  real mistakes, real anecdotes, honest hedging) — the thin-don't-kill ratio held.
- **Harness, before → after:** HARD 45 → 0 · soft 191 → 95 (the survivors are legitimate
  corrective "X, not Y") · restated-conclusion 14 → 0 · signpost 9 → 0 · this-is-where 16 → 1 ·
  banned-word 22 → 0 (4 "elevated" were technical false positives; lint regex tightened to exclude
  them). **Recurrence ledger: empty — no phrase recurs across 2+ files. The fingerprint is gone.**
- **Central decisions verified by grep:** "Let me walk you through" → 0; "Now that you understand/
  know" → 0; "best of both worlds" → 0; map/compass/territory reworded everywhere (benchmarking's
  became "the database tells you where good headphones land; your rig tells you where yours lands");
  "The rest is reps" survives only in your-first-build; "wiggly line" only in
  taking-and-interpreting-measurements.
- **Structural integrity:** no import/callout/component lines touched; `:::` callouts balanced; no
  broken links; all frontmatter intact (only `excerpt`/`description` *prose* changed, by design).
- **Spot-read diffs** (why-measure-headphones, professional-design-insights, active-noise-cancelling,
  benchmarking, community-builds, sources-and-further-reading, troubleshooting-guide,
  impedance-and-sensitivity, custom-iem-design): voice preserved, every spec/number/anecdote/link
  intact, troubleshooting-guide's antithesis *chain* de-chained while its real distinctions stayed.
- **Lock-in:** "Avoiding AI tells" checklist appended to the Content & Style Guide (v1.4);
  `scripts/voice-lint.mjs` is the runnable gate (`--ci` fails on HARD tells).
- **Deferred:** full `astro build` validation until the concurrent book-PDF render released `dist/`.
