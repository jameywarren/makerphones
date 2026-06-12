---
title: Benchmarking Your Build with Public Measurements
handle: benchmarking-with-public-measurements
part: 4
chapter: 23
difficulty: Intermediate
prerequisites: [taking-and-interpreting-measurements, understanding-frequency-response]
related: [taking-and-interpreting-measurements, understanding-frequency-response, budget-measurement-setup, tuning-with-damping, sources-and-further-reading]
read_time: 9
tags: [measurement, tuning, benchmarking, frequency-response, data]
description: "How to use public headphone measurement databases — oratory1990, Crinacle, squig.link, AutoEq — to benchmark your build and learn what good sounds like, and why your budget rig's numbers won't match theirs."
excerpt: "There's an enormous free library of rigorous headphone measurements out there. Here's how to use it to guide your build — and the one comparison trap that catches everyone."
---

You don't have to design in the dark. Some of the most useful headphone data in the world is free and public — thousands of commercial headphones measured carefully on reference rigs — and you can use all of it to figure out what you're aiming for and how close you've gotten. The catch is knowing how to compare honestly, because the numbers off your bench won't line up with theirs, and that's not a mistake on your end. It's the whole thing nobody explains.

## What's actually out there

Over the last decade a handful of people quietly built public measurement libraries that have become the reference for the entire hobby.

- **oratory1990** measures over-ears and IEMs on a GRAS rig — the gold-standard hardware — with results referenced to the Harman target. It's widely treated as the most trustworthy single source.
- **Crinacle** runs one of the largest public databases anywhere, especially deep on IEMs, with interactive graphs you can overlay.
- **squig.link** is a whole family of those graphing tools, hosted by different reviewers, all letting you stack measurements on top of each other to compare.
- **AutoEq** is open source. It aggregates measurements from oratory1990, Crinacle, and others and computes the EQ needed to hit a target. Even if you never touch the EQ, it's a clean way to see how a real measurement relates to a target curve.

What nearly all of them measure is frequency response — the same graph you've been learning to read. So you already have the skill. What you don't have yet is the habit of using theirs.

## Why this is a gift for a builder

Three things become possible that you simply can't do alone at a bench.

You can **learn what good looks like.** Scroll through measurements of headphones people love, then ones they don't, and the patterns start surfacing on their own — the gentle bass lift, the rise through the presence region, the way a harsh headphone shows a spike where your ears already told you it would be. You're training your eye against a few thousand data points instead of your own two or three builds.

You can **borrow a voicing you admire.** Find a headphone whose sound you love — or one you wish you could afford — pull up its shape relative to the target, and use *that* as your build's goal instead of guessing what "good" means. You're reverse-engineering a tuning that already won people over.

And you can **set honest expectations.** Look at what real bass extension looks like for an open-back versus a sealed design, and you'll stop chasing sub-bass your open build was never going to make. The data tells you what's physically on the table for the kind of headphone you're building.

## The one trap: you can't compare the raw numbers

Here's what trips up nearly everyone the first time. oratory1990's curves come off a GRAS rig with a calibrated ear simulator — a precision coupler built to an international standard, designed to mimic the acoustics of a real ear and canal. Your budget rig doesn't have that. It's a different cavity, a different mic, and no standardized ear. So your raw curve and their raw curve of the *exact same headphone* will look meaningfully different — especially up high, past a few kHz, where the ear-canal resonance that a proper simulator models just isn't present the same way on your setup.

This isn't your rig being wrong. It's a different instrument measuring a related thing. (The measurement chapters go deep on why couplers matter; this is the practical consequence of all that.)

So do not lay your curve over an oratory1990 graph and try to match it decibel for decibel. You'll chase ghosts up in the treble for a week and learn nothing.

What you *can* compare is **shape and relative balance** — how far the bass sits above the mids, where the big peaks and dips land, the overall tilt from low to high. Those survive the difference in rigs reasonably well. Better still, compare **deltas to a target**: their headphone's distance from the Harman curve, and your build's distance from that same curve measured on your own rig. Two error curves are far more comparable than two raw curves, because each one already has its own rig's signature partly subtracted out.

## A workflow that actually works

1. **Pick a reference.** Find a headphone in the database with a voicing you're after — and match the form factor to your build, because an open-back and a sealed can won't share a bass shelf. Note its shape relative to the target.
2. **Set your target.** Use that shape, or the Harman target itself, as your goal. The frequency-response chapter covers what the target means and where it came from.
3. **Measure your build on your own rig** — the same way, the same seating routine, every single time. Consistency on your bench matters more than agreement with theirs.
4. **Compare shapes and distance-from-target, never raw level.** Where's your bass relative to your mids? Where are your problem peaks? How does that compare to the reference's relationship to the same target?
5. **Tune toward the shape, re-measure, repeat.** Damping is how you move the curve once you know which direction it needs to go.

The database is the map; your rig is the compass. They don't read in the same units, but used together they'll get you where you're going.

## Common Mistakes

:::caution
- **Matching absolute decibels across rigs.** Your 8 kHz peak and theirs aren't measuring the same thing. Compare shape and distance-from-target — never raw level. This is the single biggest mistake, and it sends people down rabbit holes that don't exist.
- **Treating one measurement as gospel.** Even on a GRAS rig, a single seating shifts the result, and unit-to-unit variation between two copies of the same headphone is real. The good public measurers average several seatings; your numbers deserve the same respect before you trust them.
- **Chasing an exact copy of a database curve.** It was measured on different hardware, on a different physical unit, maybe with different pads than yours. Aim for the shape, not the squiggle.
- **Forgetting it's data, not preference.** A target tells you what most listeners prefer on average. It doesn't tell you what *you* prefer. Use the databases as a starting line, then trust your own ears to make the last calls.
:::

## What's Next

If those graphs still look like noise, go back to [understanding frequency response](/learn/understanding-frequency-response) — everything here is built on reading that shape, and on the Harman target it explains. To get your own measurements trustworthy enough to compare against anything, [taking and interpreting measurements](/learn/taking-and-interpreting-measurements) and the [budget measurement setup](/learn/budget-measurement-setup) are the foundation, and [tuning with damping](/learn/tuning-with-damping) is how you actually move your curve once the data shows you where it needs to go. The [sources and further reading](/learn/sources-and-further-reading) page links straight to the databases themselves.
