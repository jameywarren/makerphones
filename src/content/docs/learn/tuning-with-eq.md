---
title: Tuning with EQ
handle: tuning-with-eq
part: 4
chapter: 22
difficulty: Intermediate
prerequisites: [taking-and-interpreting-measurements, tuning-with-damping]
related: [tuning-with-damping, advanced-measurement-topics, understanding-frequency-response, benchmarking-with-public-measurements, why-measure-headphones]
read_time: 9
tags: [tuning, eq, equalization, measurement, frequency-response, dsp]
description: "Where physical damping ends, EQ begins: how to correct the residual frequency-response errors in your build with parametric EQ, what EQ can and can't fix, and why you fix resonances acoustically first."
excerpt: "Damping gets you most of the way. EQ handles what's left, but only the part of it that's actually a frequency-response problem. Here's where that line is."
---

You've tuned with damping as far as it sensibly goes, and the curve is close but not quite: a broad dip here, a little too much energy there. EQ closes that gap. It's the most accessible tuning tool you have, and the easiest to misuse, because it fixes some problems completely and others not at all. Knowing which is which is the whole point of this chapter.

## What EQ actually does

Equalization adjusts the level of specific frequency ranges in the signal before it ever reaches the driver. Parametric EQ, the kind worth using, lets you place a filter at a frequency you choose, set how much to cut or boost, and set how wide a band it affects (the Q). You're reshaping the frequency-magnitude curve electronically instead of acoustically.

Where damping changes the physics inside the cup, EQ changes the signal going into it. The curve can end up looking identical either way. But "looking identical" is exactly where people get into trouble, because the two are not the same underneath.

## What EQ fixes well

EQ is genuinely good at broad tonal balance. If your build measures a touch bright, or the bass shelf is a couple dB light, or there's a gentle dip through the lower treble, a few wide parametric filters will bring the magnitude response right where you want it. It's also how you land precisely on a target after you've gotten close acoustically, which is exactly what tools like AutoEq automate, computing filters from a measurement to a chosen target. (Using those databases and targets is what the [benchmarking](/learn/benchmarking-with-public-measurements) chapter is about.)

For getting the overall tonal shape onto a target, EQ is fast, reversible, and free. Damping can't be undone once you've over-stuffed a cup. An EQ filter is a slider you can pull right back.

## What EQ can't fix — and this is the important part

EQ moves the magnitude curve, but it does not change the physical behavior underneath it. Nobody tells you that part.

A **resonance** is the clearest example. You can pull the *level* of a resonant peak down with a narrow filter, and the magnitude curve will look flat right there. But the resonance is still a resonance: it still stores energy and rings after the signal stops, which you'd see on the decay plots in [advanced measurement topics](/learn/advanced-measurement-topics). A sharp resonance EQ'd flat in magnitude can still sound wrong. That's why the order is acoustic first, then electronic: you fix resonances with damping, not with a filter.

**Distortion and breakup** are the same story. If a driver is being pushed past its limits, EQ can't clean that up — turning a band down a little doesn't restore linearity, and turning it up makes things worse.

A **broken seal or a comfort problem** can be papered over on the graph, EQ a seal-related bass loss back up and the curve looks fine, but the seal is still leaking and still unstable from one wearing to the next. Fix the mechanical cause.

**Channel imbalance from mismatched cups** is the last trap. You *can* EQ each channel separately, but if your two builds don't match mechanically, you're chasing a moving target every time the seal shifts. Match them at the bench first, then EQ the pair together.

EQ corrects frequency-response magnitude. Ringing, distortion, leaks — none of those are magnitude problems, so EQ is the wrong tool.

## Acoustic first, EQ last

So the workflow that actually works puts EQ at the end. Get the structure, the seal, the chamber, and the damping right, so the headphone is physically good on its own. *Then* reach for EQ to clean up the residual broadband tilt and settle precisely onto your target. Every time I've leaned on heavy correction to flatten a rough build, it's come out worse than a build that measured well and just needed a little polish.

## Doing it without wrecking the signal

A couple of practical points. Boosting a band raises the overall level and can clip your source, so favor cutting over boosting where you can, and when you do boost, pull the overall preamp or gain down to leave yourself headroom. Apply your filters, then *remeasure with the EQ engaged* so you're checking what the build actually does, not what the filter math predicts. And as always, the graph serves the sound: if a filter measures right but sounds wrong, trust your ears, same as with damping.

One more thing worth keeping straight. EQ lives in your source: the player, the operating system, a little DSP box. It doesn't travel with the headphone. Plug into a different device and your correction is gone. That's perfectly fine for personal listening; just know the EQ isn't *in* the headphone the way damping is.

## Common Mistakes

:::caution
- **EQ-ing down a resonance and calling it fixed.** The peak's level drops; the ringing stays. Fix sharp resonances with damping first, then EQ whatever's left.
- **Big boosts that clip.** Boosting eats headroom and can drive your source into distortion. Cut instead of boost where you can, and use a negative preamp when you must boost.
- **EQ-ing on a bad measurement.** A correction is only as trustworthy as the curve underneath it. Re-seat and remeasure before you build a filter on a feature that might be an artifact.
- **Chasing a flat graph until it sounds dead.** The same trap as over-damping. Magnitude-flat isn't the goal, sounding right is.
- **Forgetting it doesn't travel.** The headphone itself is unchanged. Anything you need baked in has to be done acoustically.
:::

## What's Next

EQ is the electronic half of tuning; [tuning with damping](/learn/tuning-with-damping) is the acoustic half, and you'll almost always use them together: damping for the physical problems, EQ for the residual shape. To see the time-domain problems EQ can't touch, [advanced measurement topics](/learn/advanced-measurement-topics) covers decay and distortion plots. And both [understanding frequency response](/learn/understanding-frequency-response) and the [benchmarking](/learn/benchmarking-with-public-measurements) chapter cover the targets you're aiming all of this at.
