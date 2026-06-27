---
title: Glossary
handle: glossary
type: appendix
description: "Plain-language definitions of the terms used throughout the manual, drivers, acoustics, measurement, and electronics, in one place to look up as you read."
excerpt: "Every term the manual leans on, defined plainly and in one place. Keep it open in a tab while you read the chapters."
tags: [glossary, reference, appendix, terminology]
---

The manual uses a fair amount of vocabulary, and it's all defined where it first comes up, but here it is collected in one place to look up as you go.

**AAC**: A Bluetooth audio codec that performs well on Apple devices; one of several codecs a source and headphone may share.

**aptX**: A family of Qualcomm Bluetooth codecs (aptX, aptX HD, aptX Adaptive, aptX Lossless) offering better quality than the SBC baseline, provided both ends support it.

**Baffle**: The plate the driver mounts to, separating the front of the diaphragm from the rear. The driver-to-baffle joint is a critical seal.

**ABS**: Acrylonitrile butadiene styrene, a common engineering thermoplastic with good mechanical properties and temperature resistance. Difficult to FDM print due to warping, but vapor-smoothable with acetone.

**Balanced armature (BA)**: A small, efficient driver type that covers a limited frequency band, common in in-ear monitors where several are combined with a crossover.

**Bass reflex**: An enclosure design that uses a tuned port to extend bass response below the driver's sealed-box rolloff. Also called a vented enclosure.

**Break-up mode**: A condition where different parts of the diaphragm move non-uniformly, producing resonances typically above 5 kHz.

**Boundary element method (BEM)**: A simulation technique that solves the wave equation across a 3D mesh, used for radiation and diffraction. More accurate and more demanding than lumped-element modeling.

**Channel matching**: How closely the left and right channels agree. Poor matching smears the stereo image; it's both a mechanical and an electrical concern.

**Closed-back**: A design with a sealed rear chamber, giving isolation and stronger low bass at the cost of a more closed-in sound.

**CLD (Constrained Layer Damping)**: A damping technique using a viscoelastic material (like Dynamat) bonded to a vibrating structure to convert vibration to heat.

**Codec**: The compression scheme used to send audio over Bluetooth (SBC, AAC, aptX, LDAC, LHDC, LC3). Both the source and the headphone must support a codec to use it.

**Coupler**: An artificial ear canal with a microphone, used in a measurement rig. The IEC 60318-4 standard defines the common type.

**Compliance**: A measure of springiness, how easily something (a suspension, a volume of trapped air) yields to force. Larger compliance is a softer spring.

**CSD (cumulative spectral decay)**: A "waterfall" plot showing how energy at each frequency decays over time, revealing resonances that ring on after the signal stops.

**Damping**: Material (felt, foam, fiber fill) added to absorb acoustic energy, used to tame resonances, reflections, and excess bass.

**Diaphragm**: The thin membrane that moves to push air and create sound. The heart of any driver.

**Diffraction**: The bending of sound waves around obstacles (like a baffle edge), creating interference patterns that affect frequency response.

**Driver**: The transducer that turns an electrical signal into sound. Dynamic, planar magnetic, balanced armature, and electrostatic are the main types.

**Dynamat**: Brand name for constrained layer damping material (butyl rubber plus aluminum foil), applied to cup interiors to damp structural vibrations. It is not acoustic absorption.

**Dynamic driver**: The most common driver type: a voice coil attached to a diaphragm, moving in a magnetic gap. Simple, hard to break, good bass.

**Electrostatic**: A driver type using a charged film between electrodes; very low distortion, but requiring special high-voltage amplification.

**Frequency response (FR)**: How loud a headphone plays at each frequency, the single most-used measurement. Usually shown as a curve.

**Front chamber**: The acoustic space between the driver face and the ear. Its volume is set primarily by ear pad depth, and it affects high-frequency response and soundstage character.

**Fs**: A driver's free-air resonance frequency, one of its Thiele-Small parameters.

**Group delay**: The time delay experienced by each frequency in a system. Non-uniform group delay means different frequencies arrive at the ear at different times.

**Harman target**: A research-based preference curve describing how a neutral-sounding headphone tends to measure on a standard rig. A common reference target, not a law.

**IEC 60318-4**: The standard (often called "711") for the coupler used in headphone and IEM measurement. Reliable to roughly 10 kHz.

**Impedance**: The driver's opposition to current, in ohms, and how it varies with frequency. Affects how it pairs with an amplifier.

**Impulse response**: A measurement showing how a headphone responds to an instantaneous transient. Reveals ringing, resonances, and time-domain behavior not visible in frequency response alone.

**LC3**: The codec for Bluetooth LE Audio, more efficient than older codecs and the basis for broadcast features like Auracast.

**LDAC**: Sony's high-bitrate Bluetooth codec aimed at high-resolution audio.

**LiPo (Lithium Polymer)**: A rechargeable battery chemistry used in wireless audio devices, with a nominal voltage of 3.7 V. Requires a dedicated charging circuit and protection against over-discharge.

**Lumped-element method (LEM)**: Modeling a driver-and-chamber system as an equivalent electrical circuit of masses, compliances, and resistances. The tractable approach for headphone simulation.

**Mass loading**: Adding mass to a vibrating structure to lower its resonant frequency and damp structural vibrations. Different from acoustic damping: it affects the structure, not the air.

**Nominal impedance**: A single representative impedance value for a driver, typically measured at 1 kHz. The actual impedance varies with frequency.

**Open-back**: A design with a vented or open rear, giving a more spacious, natural sound but little isolation and bass that leaks out both ways.

**PETG (Polyethylene Terephthalate Glycol)**: A 3D printing filament with better impact resistance and temperature tolerance than PLA. Recommended for structural headphone components.

**Pinna**: The fleshy outer ear. In a measurement rig, a silicone pinna sits in front of the coupler to load over-ear headphones realistically.

**PLA (Polylactic Acid)**: The most common 3D printing filament. Easy to print but brittle under repeated stress, with a low glass transition temperature (~60°C). Good for prototyping; switch to PETG for final builds.

**Planar magnetic**: A driver type using a flat diaphragm with an embedded conductor between magnet arrays; even, low-distortion sound, usually heavier and less efficient.

**Polarity**: Which way a driver moves for a given signal. Both channels must be in phase, or the bass cancels and the image collapses.

**PPI (Pores Per Inch)**: A specification for acoustic foam density. Higher PPI means smaller pores and more absorption of higher frequencies. Typical range for headphone use is 20–60 PPI.

**Q factor (Qts, Qtc)**: A dimensionless parameter describing the damping of a resonance. High Q means a sharp, peaked resonance; low Q means a broad, well-damped one. Qts is for the driver in free air; Qtc is for the driver in a closed enclosure.

**Rear chamber**: The enclosed volume behind the driver in a closed-back headphone. Its volume directly affects bass extension and resonance behavior.

**Resonance**: A frequency at which something naturally wants to vibrate, where energy piles up and rings. Sources include the driver, the air cavities, and the structure.

**REW (Room EQ Wizard)**: The free, de facto standard measurement software used across the hobby.

**SBC**: The baseline Bluetooth audio codec that every device supports; the guaranteed fallback when nothing better is shared.

**Sealed**: Fully closed, with no leak. A sealed rear chamber maximizes isolation and bass but can produce a resonance peak.

**Sensitivity**: How loud a driver plays for a given input, often quoted in dB per milliwatt or per volt. Together with impedance, it tells you how easy a headphone is to drive.

**Sorbothane**: A proprietary viscoelastic material used for vibration isolation and damping. Effective for reducing the mechanical transmission of vibrations.

**Soundstage**: The perceived sense of space and width in the sound, influenced strongly by open versus closed design.

**SPL (sound pressure level)**: Loudness, measured in decibels. Calibrating SPL lets a measurement read absolute levels.

**Standing wave**: A resonance in a cavity where a reflected wave reinforces itself at a particular frequency, building a fixed pattern of loud and quiet regions.

**Thiele-Small parameters**: A driver's key electro-mechanical numbers (resonance, compliance, moving mass, motor strength, and more) used to model and predict its behavior.

**THD (total harmonic distortion)**: How much a driver adds harmonics not in the original signal. Usually low; a sudden spike often signals a mechanical fault.

**TP4056**: A widely used single-cell LiPo battery charging IC, available as inexpensive module boards. The standard DIY choice for Bluetooth headphone charging circuits.

**TRRS**: A four-conductor plug (tip, ring, ring, sleeve) carrying left, right, ground, and mic, the single-jack headset standard. The CTIA pinout is the modern standard.

**TRS**: A three-conductor plug (tip, ring, sleeve) carrying left, right, and ground, the standard stereo audio connector, with no microphone contact.

**Vas (equivalent compliance volume)**: The volume of air with the same acoustic compliance as the driver's suspension. A larger Vas means more compliance and benefits from a larger enclosure.

**Voice coil**: The coil of wire attached to a dynamic driver's diaphragm; current through it in the magnetic gap is what moves the diaphragm.
