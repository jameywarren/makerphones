# Detent coupon — pick the slider's leaf thickness by feel

Pre-fork experiment for the on-ear build. Moves into `parts/` when the repo is forked.

**What it answers:** how thick the printed cantilever leaf must be for the slider detent
(`on-ear-brief.md` interface 2) to hold position without being unpleasant to adjust.

**Why it is an experiment and not a calculation.** The governing parameter is a spring force in a
printed part, and printed modulus varies with material batch, layer adhesion, infill, nozzle
temperature and orientation. A thickness derived from PETG's datasheet modulus would look rigorous
and be wrong. Five sleeves and ten minutes of clicking settles it properly.

```bash
../../../builds/daily-driver/.venv/bin/python detent_coupon.py   # -> output/*.stl + rail.step
../../../builds/daily-driver/.venv/bin/python verify.py          # geometry + fit checks
```

## Print

| | |
|---|---|
| Material | **PETG** — the real material. PLA is stiffer and would flatter the result |
| Sleeves | **Standing, bore vertical, as modelled.** Non-negotiable — see below |
| Rail | Flat, notched face up. Carries no bending load |
| Layers | 0.2 mm, 3 perimeters, ≥30% infill |
| Supports | None needed |

**Orientation is part of the experiment.** The leaf bends in the XY plane by design, so printed
standing the layer lines run *along* the leaf. Printed flat, the leaf bends exactly across the layer
boundaries where adhesion is weakest, and it will snap early — a result that reads as "the design is
wrong" when it only means "the orientation was wrong."

## Test

Slide each sleeve along the rail and rank them. What you are feeling for:

1. **Holds** — does it stay put when you push the rail sideways, the way a bow's spring load will?
2. **Adjusts** — can you move it deliberately without two hands, and does it click or mush?
3. **Doesn't creep** — leave the winner clicked mid-rail overnight and see if it has drifted.

Record the winner in `on-ear-brief.md` §5 with a sentence on *why*, not just the number.

## What this does not tell you

**Cycle life, which is the failure mode that will actually end this mechanism.** A coupon measures
adjustment one, not adjustment three hundred. The bump is a small feature under repeated local
strain — the same creep physics as the headband problem in §4, concentrated. Before committing the
number, leave the winning sleeve on the bench for a week of back-and-forth and check the detent still
holds. If it has softened, the answer is a thicker leaf with a shallower bump, not a bigger bump.

It also does not test the rail under the bow's real spring load, because the rail here is a
stand-in — the yoke rod's actual cross-section is set once the bow is measured (§5 #3/#4).

## Design notes worth keeping

**Engagement is not bump height.** The sleeve floats `clear` (0.25 mm) off the rod on every side, so
the bump spends the first 0.25 mm of its protrusion just crossing the gap. `Params.engagement`
computes the real figure and `__post_init__` gates it. A first pass used `bump_h = 0.65`, passed every
dimension check, and delivered 0.40 mm of actual engagement — 62% of what was intended. It would have
printed, assembled, felt weak, and sent us chasing leaf thickness for a fault that was never in the
leaf.

**The rail is rectangular on purpose, and it costs something.** A rectangular rod cannot rotate in
its sleeve, so it forces *both* of the cup's rotational axes (§4d #6) out to designed joints at the
yoke, rather than letting one hide as slop in the slider. Grado gets its rod-block swivel free from a
round rod; we are giving that up deliberately in exchange for a slider that cannot twist. If the
yoke turns out to be too crowded to carry both axes, this is the decision to revisit first.
