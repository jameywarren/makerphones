---
title: Tuning with Damping
handle: tuning-with-damping
part: 4
chapter: 21
difficulty: Intermediate
prerequisites: [why-measure-headphones, damping-strategy-and-application]
related: [damping-strategy-and-application, why-measure-headphones, damping-materials, acoustic-chamber-design, understanding-frequency-response]
read_time: 10
tags: [tuning, damping, measurement, frequency-response]
description: "The measurement-driven tuning loop: read the curve, make one targeted change, remeasure, repeat. How to turn a measurement into a fix, and when to stop."
excerpt: "This is where measurement and damping meet: a tight loop of measure, change one thing, measure again. Here's how to read the curve and act on it without chasing your tail."
---

With a rig you can trust and some damping material on the bench, you can tune by data instead of by guess. The loop itself is simple, almost embarrassingly so. The discipline to run it cleanly is the entire game, and it's where most builders trip, by changing too much at once and learning nothing from any of it.

Everything in [damping strategy and application](/learn/damping-strategy-and-application) about where damping goes and what it does still applies here. This chapter just adds a measurement at every step, so you're acting on what you can see rather than what you hope is true.

## The loop

Measure. Read the curve. Make one targeted change. Remeasure. Compare. Repeat.

That's the whole method. The skill that makes it work is changing a single variable at a time, so that when the curve moves, you know exactly what moved it. Change three things between measurements and you're back to the same guessing game you were trying to escape, only now there's a graph to make you feel productive.

## Measure honestly before you start

A measurement-driven loop is only as good as the measurement. Before you trust any curve, take it a few times, re-seating the headphone between each, and see what stays put and what jumps around. The features that survive re-seating are real and worth chasing. The ones that move are positional artifacts, usually up in the top octave, and chasing them is how you waste an evening tuning something that was never there. Establish your repeatable baseline first, then start changing things.

## Reading the curve and acting on it

**A peak.** A sharp bump usually means a resonance. Address it with damping behind the driver or on the wall nearest it, or with venting if it sits low. Add material in small amounts and watch the peak shrink. When it stops shrinking for the felt you're adding, you've found the limit of that placement.

**Boomy or excessive bass.** Often a chamber resonance or just too much low-end energy. Try opening or adding resistance to a vent, reducing rear fill, or adding targeted damping. The bass region responds strongly to small changes, so move in small steps and remeasure often.

**Ringing.** Energy that hangs on after the signal stops. You'd see it most clearly on a decay plot, which the advanced measurement chapter covers. Wall lining and rear fill are your tools, and the payoff is a cleaner, less hard sound even when the frequency response barely moves.

**A treble peak.** A thin damping ring in the front cavity, applied sparingly. Treble is where over-damping does the most audible damage, so make small changes and check both the curve and your ears after each one.

**Channel mismatch.** Overlay the left and right curves and match the damping and seal until they sit on top of each other. This is pure mechanical matching, same material, same placement, both sides, and the graph makes a mismatch you'd never hear plainly visible.

## Reading the problem, choosing the material

The advice above tells you *which way* to move; this table tells you *what to reach for*. Different frequency problems respond to different materials in different places, and reaching for the wrong one wastes an evening. Match what you measure to the first thing worth trying, then run the loop.

| What you measure | What to try first |
| --- | --- |
| Boomy / elevated bass (`80–300Hz`) | Foam on the rear chamber walls: start with one wall. An alternative for excess mid-bass is a small amount of cotton fill in the rear chamber, acting as an acoustic mass that smooths the resonance. |
| Hollow / boxy midrange (`300Hz–1kHz`) | Chamber standing waves. Thin felt on the interior side walls often helps more than foam here: felt absorbs well in the mids without killing everything else. Try one wall at a time. |
| Forward / intense upper mids (`1–4kHz`) | Swap to pads with a more absorptive inner surface (velour over pleather), or add padding on the front baffle around, not over, the driver to cut reflections. |
| Harsh / sibilant treble (`4–8kHz`) | Thin felt in front of the driver, applied sparingly. Start small: a `2cm` circle of craft felt across part of the driver face is enough to see an effect. This spot is sensitive, so go slowly. |
| Narrow resonance spike (anywhere) | Find the source first. Tap the cup with the driver out and listen for a tonal ring. That's the mode. Treat it at the chamber, or in front of the driver if the break-up is in the driver itself. |

:::caution
A *dip* is usually not a damping problem. Damping removes energy; it can't add it, so no amount of foam will fill a hole in the response. A thin low end means the headphone isn't producing enough down there: check the seal, the chamber volume, and the pad depth, or change the driver. That's a design fix, and no amount of damping substitutes for it.
:::

## What one pass actually looks like

Say your build measures with a tall, narrow peak in the upper bass and an otherwise reasonable curve. You take it three times, re-seating between each, and the peak holds steady every time, so it's real, not an artifact. You add a small amount of fill behind the driver, nothing else, and remeasure with the same seating routine. The peak drops by a few decibels and widens slightly; the rest of the curve barely moves. Good. That's the placement working. You note the change in your log, listen to confirm the boom has eased without the bass going lifeless, and decide whether the remaining peak is worth another small pass or whether you've reached the point of diminishing returns.

String a handful of those clean passes together and you've tuned a headphone deliberately instead of by luck. The temptation is always to skip the remeasure, or to add felt in two places at once "to save time," and both shortcuts cost you far more time than they save, because they take away your ability to know what worked.

## One change at a time

This is the rule that makes the whole method work, so it bears repeating: change one thing, then measure. Overlay the new curve on the previous one and look only at the difference. If you change three things between measurements, you've learned nothing reliable about any of them, and you'll drift toward over-damping, because each individual change felt harmless on its own.

## Knowing when to stop

Stop when the curve is close to your target *and* it sounds right to you. Both conditions have to be met together; either one alone will mislead you. Chasing the last decibel on the graph past the point where it sounds good is exactly how you over-damp a build into lifelessness: the graph improves while the music gets worse.

The first few changes do most of the work, and after that you hit diminishing returns fast. Obsessing over tiny wiggles isn't worth it, especially since many of those wiggles are your rig's artifacts rather than anything a listener would ever notice. Knowing when a build is *done* is as much a skill as knowing what to change, and it's mostly the discipline to stop when both your eyes and your ears agree.

:::tip
Keep a log. Name each measurement file with what you changed: "rear-fill-2g," "wall-felt," "front-ring-thin." Three sessions in, that log is how you remember what worked, avoid repeating a change that didn't, and stop going in circles. It's the cheapest tool in the whole process and the one builders most often skip, right up until the night they wish they hadn't.
:::

## Common Mistakes

:::caution
- **Changing multiple things between measurements.** The cardinal sin. You can't attribute the result to any one change. One variable at a time, every time.
- **Tuning to the graph until it's flat.** If it measures great and sounds dull, the graph won the argument it shouldn't have. Your ears make the final call.
- **Chasing artifacts.** Before you act on a tiny feature, re-seat the headphone and remeasure. If it moves, it wasn't real. Leave it alone.
- **Over-damping to kill a small peak.** Sometimes a minor peak is better tolerated than smothered. Weigh what the fix costs the rest of the sound.
- **Not matching left and right changes.** Every change you make to one channel, make identically to the other, and confirm it on the overlay.
:::

## What's Next

Damping is the acoustic half of tuning; the electronic half, correcting the residual shape in the signal itself, is covered in [tuning with EQ](/learn/tuning-with-eq/). And frequency response is the headline, but it isn't the whole picture. Decay plots, impulse response, and distortion measurements reveal problems that a frequency-response curve alone hides: the advanced measurement topics that round out this section and explain why two headphones with nearly identical curves can still sound clearly different from each other.
