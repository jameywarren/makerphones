---
name: headphone-intake
description: Interactive intake that interviews the maker about a new headphone design and writes a structured BRIEF.md to seed a parametric build. Use when starting a NEW headphone (the Daily Driver is product #1 of a series). Invoke with /headphone-intake.
---

# Headphone design intake

You are running a guided intake to turn a fuzzy idea into a buildable **brief**.
The goal is a `BRIEF.md` that seeds a parametric CadQuery build (the same pipeline
as `builds/daily-driver`). Be a sharp, friendly design partner — ask, don't assume.

Reference: `builds/daily-driver/docs/new-build-intake.md` (the pipeline + template)
and `builds/daily-driver/docs/cadquery-build-notes.md` (kernel limits).

## How to run it

1. **Name + location.** Ask for a working name. The brief goes in the build dir:
   default `builds/<kebab-name>/BRIEF.md` (create the dir). If they're iterating an
   existing product, write/update its `BRIEF.md` instead.

2. **Interview through the 9 blocks below.** Move briskly. Use `AskUserQuestion`
   for the blocks with natural choices (use-case/vibe, mechanism, edge treatment,
   material) — offer 2–4 concrete options plus the implicit "Other". Use plain
   follow-up questions for free-form items (model names, measurements, references).
   Batch related questions so it doesn't feel like an interrogation.

3. **Record confidence, never invent.** For every dimension capture
   `MEASURED` / `ESTIMATE` / `TBD`. If they don't know a number, mark it `TBD` —
   do NOT fabricate a driver, pad, supplier, price, or spec (CLAUDE.md rule). Tell
   them which TBDs block a first build vs. which can wait for a measurement.

4. **Pull in references.** Ask them to drop reference photos/links in chat; note
   filenames in the brief. If they name a pad/driver/bow, you may look up published
   dimensions to PROPOSE values — but mark proposed numbers `ESTIMATE` and tell
   them to confirm with calipers.

5. **Write `BRIEF.md`** from the template in `new-build-intake.md`, filled with
   their answers + confidence tags + an "Open questions / next measurements" list.

6. **Offer the next step**, don't auto-run it: scaffold the build by copying the
   daily-driver skeleton and seeding `params.py` from the brief, or stop at the
   brief. Let them choose.

## The 9 blocks (what the brief must answer)

1. **Use-case & vibe** — open/closed back; studio/commute/desk/gaming; soft-rounded
   vs angular; reference headphones.
2. **Driver** — size, impedance, model/class. (Sets the baffle family via `driver_od`.)
3. **Earpad** — model + outer Ø, ear-opening ID, **mounting-skirt Ø** (what the cup
   lip wraps, not the ear hole), depth. (Drives cup OD + retaining lip.)
4. **Headband / bow** — bought spring band or DIY; relaxed radius, developed length,
   width, end-tab holes. (Worn radius sets ear spacing.)
5. **Mechanism** — pivot/swivel gimbal; band↔slider attach (bolt-on vs clamp) and
   which face the screws enter.
6. **Fit** — ear spacing, tilt range, clamp.
7. **Aesthetic** — grille pattern + open-area target, accent color, edge treatment
   (note: roundovers are limited by the kernel — see build-notes), signature mark.
8. **Constraints** — bed size, material, hardware on hand, license, target cost.
9. **Prior-art** — designs studied + their licenses; credit adopted ideas in
   DESIGN-LOG; never copy files/geometry from non-permissive projects.

## After the brief

Remind them of the loop: brief → `params.py` → `build.py` (8/8) → `gate.py`
(0 HARD) → DESIGN-LOG entry → **commit + push**. Real-part measurements overwrite
ESTIMATEs cleanly. Keep parts independently buildable; `params.py` is the only place
dimensions live.
