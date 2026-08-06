# The on-ear — pre-fork brief

**Status: greenlit 2026-08-06 as the flagship build, replacing Daily Driver in that role.
Design not settled. This is the document we argue with before forking.**

`builds/daily-driver/docs/starting-a-new-product.md` says fork first, then fill `BRIEF.md`.
Holding that step deliberately: the fork is a mechanical copy that takes minutes, and doing it
before the brief settles means arguing about geometry inside a repo that already has geometry.
This file is the pre-fork artifact. When the open questions below close, fork and this becomes
`BRIEF.md`.

---

## 1. Why this replaces Daily Driver as the flagship

Not because Daily Driver is wrong. Because it is the wrong *first* build, and MakerPhones is
explicitly a learning path — so the flagship should be the first rung, not the last.

**The barrier is the hardware, not the printing.** From `builds/daily-driver/BOM.md`, per pair:

| Item | Qty | Source |
|---|---|---|
| Beyerdynamic metal head bow | 1 | Beyerdynamic NA |
| ISO 7379 shoulder screw, Ø6×M5×50 | 2 | Mädler (~$6.65 ea) |
| Pivot shoulder screw, Ø4×M3×8 | 4 | Accu (~$5 ea) |
| Knurled thumb screw, 8-32 | 2 | Grand Brass |
| Wave spring washer M3 | 4 | BelMetric |
| Nylon flat washer M3 | 8 | Accu |
| M3 socket-head cap screws | 14 | FMW Fasteners |
| Heat-set inserts, **three different sizes** | 22 | Ruthex |

Roughly **$60–70 of hardware across eight suppliers**, several of them specialty fastener houses,
plus a soldering iron and heat-set-insert technique before anything can be assembled. The BOM's own
note that the Ø4-M3 pivot screw is "below the official ISO 7379 size sheet, so all suppliers brand
it *similar to*" is the tell: a first-timer is being asked to judge fastener equivalence on a part
that has to fit a printed bore.

That is a fine bill of materials for the person the manual creates. It is a wall for the person the
manual is trying to reach.

**Design constraint, stated as a target rather than an absolute:** printer, filament, drivers, and
one elastic element. Every fastener, insert, bearing and spring-steel part that survives to the
final BOM has to justify itself individually.

## 2. Why on-ear is genuinely easier, and what it costs

Three real reasons, not just "smaller":

- **No seal to achieve.** Circumaural bass depends on a pad seal, which depends on pad compliance
  and clamp force — the two hardest properties to hit with printed parts. A supra-aural leaks by
  design, so its bass is set by geometry you control instead of a seal you can't.
- **Far less bending load on the yoke.** Smaller, lighter cups mean less leverage, which is what
  makes a printed mechanism plausible at all (see §4).
- **The architecture is genuinely simple.** Driver on a ring, foam or printed pad, open rear,
  almost no cavity to resonate. Fewer variables to get wrong on a first build.

**The cost is bass, and it is not small.** Grado is the reference here and Grados are famously
bass-light and famously not fussy about placement — those are *the same fact*. Take the Daily
Driver README's posture and state it up front rather than discovering it in measurement.

**The lever that gets some of it back, and it is ours specifically:** on a supra-aural, front-cavity
volume and leak geometry are the dominant bass controls, and Grado's own flat/bowl/L-cush swap is
exactly that lever being pulled by hand. **If the pad is a printed part, bass tuning becomes a
reprint rather than a purchase.** That is a real advantage over the thing we are imitating, it is
parametric by nature, and it turns the design's biggest weakness into its most demonstrable feature.
Worth making `pad_*` a first-class taste block in `params.py` from day one.

## 3. The seating-sensitivity brief, stated correctly

The version worth designing to is **not** "minimise position sensitivity." That optimises toward the
wrong thing, because sensitivity can be low for two opposite reasons:

- **Good:** the acoustic design is robust — damping controls the modes, the response does not sit on
  a knife-edge seal, driver-to-ear distance moves little with placement.
- **Bad:** the response is already at its floor. A leaky on-ear is insensitive in the bass because
  there is no bass left to lose.

So the brief is: **hold a response you would actually choose, and be insensitive to placement at
that response.** Low sensitivity is only a virtue when it is not bought by giving up the thing you
were being sensitive about — which is exactly the trap this architecture walks into by default.

This is measurable with the house method (`warren-labs/MEASUREMENT-PIPELINE.md` §3.1) and, as far as
we know, nobody publishes it as a *design* goal. It is also the honest way to compete given §2: we
are not going to win on bass extension, and we can win on consistency.

### An on-ear is not less position-sensitive. It is sensitive somewhere else.

§2's "no seal to achieve" is true and it is also the easiest thing in this brief to oversell, so
correct it here before it becomes an assumption.

A sealed circumaural loses a lot of bass when the seal breaks, so its sensitivity concentrates
**below ~200 Hz**. A supra-aural is already leak-dominated down there, so moving it changes less —
but the driver now sits close to the ear and roughly on-axis with the canal, so **small changes in
where the pad lands move the mids and treble instead**. Grado's flat/bowl/L-cush behaviour is that
sensitivity being exercised deliberately: those pads change far more than bass.

So the trade is not "less fussy," it is **bass-seal sensitivity traded for mid/treble alignment
sensitivity** — and the second one is arguably the worse deal, because treble error reads as timbre
rather than as level and listeners do not adapt to it the way they adapt to a bass shelf.

Two consequences:

- The design brief in this section is *harder* to hit on an on-ear, not easier. Winning it is
  therefore worth more.
- **The pad's job is alignment, not just cushioning.** Whatever the pad geometry ends up being
  (§6 Q3), it has to locate the driver relative to the canal repeatably. That is a positioning
  requirement and it should be designed for on purpose, not left to whatever is comfortable.

### The fixture caveat, up front

The EARS Pro controls the on-ear's dominant variables **poorly**. A supra-aural's response is
governed by clamp force and by how the pinna compresses under it, and a silicone fixture pinna does
not compress like a real ear. Expect on-ear measurements to be systematically off in absolute terms
in a way over-ear measurements are not.

This does not block anything, for the reason that keeps recurring in this project: **design
iteration is delta work.** Same rig, same session, same fixture, same clamp — "does change A beat
change B" is answerable and the fixture error cancels. What is *not* answerable on this rig is "what
does this headphone objectively measure like," and we should not claim it. Compare with
`warren-labs/measurements/ACQUISITION.md` §0, where IEMs were dropped for the structurally identical
reason; the difference is that here the fixture is wrong by a bounded amount rather than absent, so
relative work survives and absolute work does not.

## 4. The mechanism — the actual engineering problem

**The failure mode to design around: printed plastics creep under sustained strain, and a headband
is a sustained-strain application.** PLA is worst and will visibly lose clamp force in weeks. PETG is
better, PC-blend and nylon better still, but no FDM plastic is a good spring. A printed headband
that works on day one and is loose by month three is the single most likely way this build
disappoints someone.

**So do not make the printed part be the spring.** Two ways out:

1. Keep exactly one metal element — a spring-steel strip — as the sole non-printed structural part.
   Honest, and much cheaper than Daily Driver's bow, but back to sourcing.
2. **Take clamp force from a replaceable elastic element** (shock cord / elastic) running in a
   printed channel, so every printed part works in tension and compression rather than sustained
   bending. Available in any hardware or fabric shop, and **"the spring is a consumable you replace"
   is a feature for a build-it-yourself product**, not an apology.

Recommend (2) as the design direction, with (1) kept as the fallback if clamp consistency proves
unreachable.

Three supporting decisions:

- **Friction slider with zero hardware:** a printed cantilever leaf with a detent bump riding a notch
  ladder. Prints support-free if oriented right, tunes by leaf thickness, and deletes the thumbscrew,
  the insert and the pressure shoe in one move.
- **Print orientation is the whole game on the yoke.** It carries bending load, layer adhesion is the
  weak axis, so the arms must print flat in-plane with layer lines running *along* the arm. This is
  the difference between a yoke that lasts and one that snaps. It belongs in `print-guide.md` as a
  hard requirement, not a suggestion.
- **Pivot without shoulder screws:** a printed snap-fit trunnion or a separately printed pin. Grado's
  own gimbal is a rod in a block — that is a two-part snap, not a fastener.

## 5. Tier 1 — what blocks the first print

Following the discipline in `builds/daily-driver/docs/measurement-priorities.md`: if a part
*regenerates from* the number it is Tier 1; if the number only *tunes* a part it is Tier 2.

| # | Measurement | Sets | Risk if wrong |
|---|---|---|---|
| 1 | **Driver OD + frame depth** (from the drivers actually on hand) | `driver_od` → aperture, recess, ring | Driver will not seat; everything downstream regenerates wrong |
| 2 | **Pad mounting geometry** — but see below, this may be ours to define | `pad_*`, ring OD | Pad will not mount, or bass target unreachable |
| 3 | **Target clamp force**, and the head-width range it must hold across | the elastic element's spec, `bow_*` equivalents | Too tight = unwearable; too loose = no bass and it falls off |

**#3 is new and has no Daily Driver equivalent** — Daily Driver inherits clamp from a purchased
Beyerdynamic bow, so it never had to choose a number. We do. This is the Tier-1 item most likely to
be skipped and most likely to sink the build.

**#2 may not be a measurement at all.** If the pad is printed (§2), we are not measuring someone
else's pad, we are choosing a geometry. That converts a Tier-1 measurement into a design decision —
which is better, but it means the bass target has to be settled earlier than Daily Driver settled
its own.

## 6. Open questions — Jamey

1. **Name.** Not proposing one. Naming is locked-by-decision in this org and it is his call.
2. **Which driver.** He has a handful on hand and OEM reach. The first Tier-1 number comes from
   whichever is chosen, so this is the gate on everything else. Candidates measured on the same
   fixture in one session (FR + distortion + impedance + Fs) is a day's work and the highest-leverage
   day in the project.
3. **Printed pad, or foam?** §2 argues printed, because it makes bass tuning a reprint. But a
   printed pad has to be *comfortable* on the ear, which is a much harder ask than sitting around it.
   Possibly: printed pad carrier + a cut foam disc the builder supplies.
4. **Elastic element or spring steel** (§4). Recommend elastic; wants a bench test before committing.
5. **What "pause Daily Driver" means concretely** — see §7.

## 7. What pausing Daily Driver actually touches

Not just hiding a page. Recorded so nothing breaks silently:

- **The manual's parts viewer** consumes `assembly.py`'s `SUBASSEMBLIES` node names as a public
  contract. If Daily Driver is hidden, the viewer either follows it or needs repointing.
- **The GitHub Pages GLB preview** (`makerphones.github.io/daily-driver/`) is linked from the build's
  README and from the site.
- **The manual's six build guides** reference it. Check which ones assume it is the flagship.
- **Do not delete anything.** It is a legitimate second product and the work is real; it is being
  resequenced, not abandoned.

## 8. Stale docs found while reading (fix on fork, or before)

`builds/daily-driver/README.md` and `CLAUDE.md` both describe `yoke.py` and `slider.py` as
**stubs**. They are not — `yoke.py` is a v0.4 lofted-arm fork and `slider.py` a v0.9
Beyerdynamic-style lozenge clamp. Anyone reading the docs to decide what needs doing would re-solve
finished work.
