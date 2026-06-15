---
title: "Measuring a Raw Driver on the Bench"
handle: measuring-raw-drivers
part: 4
difficulty: Intermediate
prerequisites: [understanding-frequency-response, impedance-and-sensitivity]
related: [why-measure-headphones, budget-measurement-setup, taking-and-interpreting-measurements, acoustic-chamber-design, driver-selection-guide]
read_time: 9
tags: [measurement, drivers, REW, impedance, distortion, testing]
description: "Build a simple test baffle and use REW to measure raw headphone drivers — frequency response, impedance, and distortion — before you build."
excerpt: "A few quick measurements on the bench tell you whether a driver is healthy, consistent, and in range, long before you build a headphone around it."
---

Before a driver ever goes into a cup, you can learn a surprising amount about it on the bench. A few quick measurements tell you whether a driver is healthy, how two samples compare, and whether a candidate is even in the ballpark for what you're building. Spend ten minutes here and you'll stop wasting whole builds on a driver that was never going to work.

## What a bench measurement actually tells you

A raw driver measured in open air is a characterization, not a prediction. It won't tell you how the driver will sound on a head — that comes from the cup, the pads, the leak around your ears, and the small trapped volume at the eardrum, none of which exist on the bench. The bass especially is a product of that coupling, so don't read much into the low end of a free-air curve.

What it does tell you is plenty: the general shape of the midrange and treble, where the main resonance sits, where the cone or dome starts to break up, how sensitive the driver is, and — maybe most useful — how consistent two samples are. That's your baseline. Everything you do later is measured relative to it.

Think of it as triage. You're not voicing anything yet. You're answering one question: is this driver healthy, and is it in range?

## A simple test baffle you can build

The rig is a baffle — a flat panel with the driver firing through it and the back open to free air. The one I use is two layers of half-inch Baltic birch glued into a roughly one-inch slab, about a foot square, raised up on legs.

It's thick and laminated for a reason. A thin panel rings, and that ringing lands right in your measurement. Mass and stiffness keep the baffle quiet so the only thing you're measuring is the driver.

The center has a removable plate, around five inches across, that the driver mounts to from underneath. That drop-in plate is the whole trick: you can swap drivers in seconds and keep everything else identical. Mount the driver airtight to the plate, and seal the plate to the baffle — any leak moves the low end around and quietly ruins a comparison.

Round over or chamfer the edges, especially where the plate meets the panel. A hard ninety-degree edge causes diffraction that ripples your response; a forty-five-degree bevel or a generous roundover tames it. Then raise the whole thing on legs, out in the open and away from walls. The higher and clearer it sits, the longer you get before the first reflection arrives — which matters for the next step.

Don't bother going bigger. A larger baffle buys you trustworthy response a little lower in frequency, but that's not the range that sorts good drivers from bad, and free-air bass doesn't predict headphone bass anyway. If you ever want a clean low end, measure nearfield — mic a few millimeters off the dome — instead of building a bigger panel.

## The measurement chain

You need three things: the baffle, a measurement mic, and [REW](https://www.roomeqwizard.com) (Room EQ Wizard, free). A USB measurement mic keeps it simple — plug it in, no audio interface required.

Calibrate the mic first. This is the step people skip and then chase problems that were never real. Your mic shipped with a calibration file matched to its serial number; load it into REW's mic settings before you measure anything. Without it, the top octave will lie to you.

Then lock your geometry down and don't touch it. Pick a mic distance and an on-axis spot over the driver and keep it identical for every driver you test. For comparison work, repeatability beats absolute accuracy every single time.

Set your levels so REW's input peaks land around −12 dBFS, and drive every driver at the same level — otherwise the sensitivity numbers aren't comparable. Run a log sweep from 20 Hz to 20 kHz.

Last, gate the measurement. Open the impulse response REW captured and set the window to end just before the first reflection shows up. That window sets the lowest frequency your gated curve is honest down to, and the higher your baffle sits, the lower that limit goes.

## Two measurements worth adding

Frequency response is only part of the story. Two more cheap measurements do most of the actual screening work.

Impedance is the big one. An impedance sweep is repeatable and doesn't care about your room or your mic. It hands you the free-air resonance (Fs), the voice-coil DC resistance, and the height and sharpness of the impedance peak. A driver with a rubbing or off-center coil gives itself away immediately as a ragged or doubled peak. The easy way to measure it is a Dayton DATS — a little USB pod you clip the driver leads to; it runs a sweep and reads out the numbers. You can also do it in REW with an interface and a sense resistor, but that's more fiddling and you have to mind your levels.

Distortion is the other. REW reports harmonic distortion straight from the same sweep you already ran. A driver with a pinched surround, a rub, or a rough batch lights up with distortion a clean sample doesn't. That's your dud filter, in numbers.

## Putting it to use

Overlay everything in REW. Stack several samples of the same driver on one graph and watch how tightly they track through the midrange and treble. For a left/right pair, pick two that sit within a decibel or so of each other — mismatched channels are something you'll hear, and something you can't easily fix later.

Then compare different candidates against each other and against whatever you were hoping for. You're not looking for perfection; you're looking for healthy, consistent, and roughly in range. A driver with a wild peak, a ragged impedance curve, or high distortion is telling you something. Believe it, and set it aside.

That's the entire point of the bench: ten minutes here means you'll never again find out a driver was a dud *after* you've built a headphone around it.

## Common Mistakes to Avoid

**Mounting the driver loose.** A leaky or rattling mount shifts the low end and adds noise. Seal it and snug it, every time.

**Skipping the mic calibration file.** Your treble will look wrong and you'll burn an afternoon trying to fix a driver that was fine all along.

**Expecting real bass from a small baffle.** Below a few hundred hertz the panel stops loading the driver properly. That roll-off is the fixture talking, not the driver.

**Comparing measurements taken differently.** Different mic distance, different drive level, different setup — and the comparison means nothing. Lock it down and leave it.

**Treating a free-air curve as the final sound.** It's a baseline. The cup, the pads, and your ear reshape all of it, the bass most of all.

## What's Next

Once you can trust a driver, the next step is measuring it loaded — in a cup, with pads, the way it'll actually be heard. That's where a coupler or chamber comes in, and it's covered in [acoustic chamber design](/learn/acoustic-chamber-design).

If you're still assembling your bench, the [budget measurement setup](/learn/budget-measurement-setup) walks through the gear, and [taking and interpreting measurements](/learn/taking-and-interpreting-measurements) goes deeper on reading the curves. And if you're not yet sure which driver to put on the baffle in the first place, start with the [driver selection guide](/learn/driver-selection-guide).

---

**Difficulty:** Intermediate
**Prerequisites:** a working handle on [frequency response](/learn/understanding-frequency-response) and [impedance and sensitivity](/learn/impedance-and-sensitivity)

**Related articles:**

- [Why measure headphones](/learn/why-measure-headphones)
- [Budget measurement setup](/learn/budget-measurement-setup)
- [Taking and interpreting measurements](/learn/taking-and-interpreting-measurements)
- [Acoustic chamber design](/learn/acoustic-chamber-design)
- [Driver selection guide](/learn/driver-selection-guide)

### Put a driver on the bench

Build the baffle, load your calibration file into REW, and measure the first driver in your parts bin. Then measure a second one and overlay them — that single graph is the start of everything that follows.
