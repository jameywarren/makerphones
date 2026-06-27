---
title: Troubleshooting Guide
handle: troubleshooting-guide
type: appendix
description: "The common things that go wrong in a build and how to fix them, organized by symptom, from no bass to a dead channel to a rattle, with the usual cause and the cure."
excerpt: "Something's wrong with your build? Start here. Organized by what you're hearing, with the most likely cause and the fix for each, and a link to the chapter that goes deeper."
related: [driver-mounting-and-assembly, damping-strategy-and-application, acoustic-chamber-design, tuning-with-damping]
tags: [troubleshooting, reference, appendix, problems]
---

When a build sounds wrong, the cause is usually one of a handful of familiar culprits. This guide is organized by what you're hearing, so you can jump to your symptom, find the likely cause, and fix it. Each points back to the chapter that goes deeper.

## No bass, or thin and hollow sound

Almost always one of two things. First, **reversed polarity**: if one channel is wired out of phase, the two cancel in the bass and the stereo image goes vague and hollow. Play a mono track; it should image as a single point dead center. If it sounds wide or sucked-out, swap the leads on one channel. Second, a **broken seal**: air leaking around the driver-to-baffle joint or between the cup and your head collapses the low end. Press the cups gently harder; if the bass swells, you have a leak to chase. See [driver mounting and assembly](/learn/driver-mounting-and-assembly).

## Boomy, one-note, or boxy bass

This one lives in the chamber. A **rear chamber that's too small** is the classic cause: the trapped air stiffens and piles the bass onto one frequency. The fix is volume or venting, not foam: open a vent, or move to a larger rear volume. A small, pluggable vent opened one hole at a time is the cheapest way to dial it in. See [acoustic chamber design](/learn/acoustic-chamber-design).

## One channel dead or quiet

A wiring fault. Check the **solder joints** at the driver and the connector: a cracked joint at the driver is the single most common long-term failure, usually from cable flex with no strain relief. A multimeter helps you find the break. Re-solder, and add strain relief at both ends so it doesn't happen again.

## Left and right sound different

A **channel mismatch**, and it's mechanical as often as electrical. Confirm both cups have the same damping (weigh the fill), the same seal, the same pads, and matched drivers. The reliable cure is to rebuild both channels identically, in one session, and a quick measurement overlay makes a mismatch you can hear but can't place obvious. See [manufacturing for consistency](/learn/manufacturing-for-consistency).

## Harsh, hard, or fatiguing treble

Usually a **resonance** ringing somewhere. If it's a sharp peak, a thin ring of damping in the front cavity can tame it, but apply it sparingly, because too much dulls the whole top end. If the hardness is more of a smear, it's often the cup walls or reflections; line the walls with felt. See [damping strategy and application](/learn/damping-strategy-and-application).

## Dead, lifeless, no air

You've **over-damped it**. The beginner instinct is to stuff the cup full "to be safe," and it drains the life out of the sound. Pull material back out until the sparkle returns. You want the smallest amount of damping that solves the actual problem, and no more.

## A buzz or rattle

This is mechanical, so put the graph away. Something is loose: a **slack lead** touching the diaphragm, a part not seated, a bit of print debris in the cup, or the **driver being pushed past its limits**. With the cup open, play a sweep and listen for where it buzzes, then find and secure the loose element. On a measurement rig, a rattle shows up as a spike in the distortion plot. See [advanced measurement topics](/learn/advanced-measurement-topics).

## The plastic cup itself rings

A **structural resonance**: thin printed walls ring like a drum, and no amount of felt fixes it, because the energy is in the plastic, not the air. Tap the empty cup: a sharp "ting" confirms it. You can't absorb your way out of this one; you have to stiffen the cup. Thicker walls, internal ribs, more infill, or a less ringy plastic. See [resonance control](/learn/resonance-control).

## It measures fine but sounds wrong

You've been **tuning to the graph instead of your ears**. A technically flat curve isn't the goal, and a "correct" measurement can still sound off. Trust your ears for the final verdict and use the graph to understand what's happening, not as a score to maximize. See [tuning with damping](/learn/tuning-with-damping).

## The bass changes every time you put them on

That's **seating and seal variation**, and it's normal to a degree, but if it's dramatic, your seal is marginal. Check the pad-to-head seal and the driver-to-baffle seal. On a measurement rig, this shows up as scatter between re-seatings; establish a repeatable seal before you trust any measurement.

## Measurements that don't match anyone else's

Expected, and not a fault. Different rigs aren't comparable, and a hobby rig isn't an industry-standard head: it's reliable to roughly 10 kHz and reads relative, not absolute. Use your measurements to track *your* changes and match *your* channels, not to chase someone else's graph. See [budget measurement setup](/learn/budget-measurement-setup).

## When in doubt

Check the boring things first, in this order: is the seal good, is the polarity right, are the pads fresh and matched, is the fit right on your head. The large majority of mystery problems are one of those four, and chasing them in the tuning, when the real cause is a leak or a worn pad, is how you lose a weekend to the wrong problem.
