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

## 4a. Concept input — the Claude Design mesh (2026-08-06)

First outside concept for this build: `printable-headphone.glb`, produced by Claude Design from a
one-paragraph prompt with no dimensions supplied. Inspected with `scripts/inspect_glb.py`.

**69 named meshes, 75 nodes, 34k triangles, 6 named materials, clean L/R symmetry.** The naming is
real and usable — `cup_housing`, `driver_baffle`, `rod_block`, `pivot_pin`, `slider_rod`,
`rod_detent_0..4`, `grille_spoke_0..11`. This is a categorically better artifact than an image: it
carries hierarchy, so it can be *read* rather than merely looked at.

| Part | Measured | Read |
|---|---|---|
| `cup_housing` | 54.0 ⌀ × 20.0 deep | Sane for a 40 mm driver — Grado's are ~50 mm |
| `ear_pad` | 60.0 ⌀ × 17.6 thick | 60 mm OD is right; 17.6 mm is **bowl-thickness, not flat** (Grado flats ~8–10 mm). That is a bass decision made by accident |
| `driver_baffle` | 50.4 ⌀ × 2.2 thick | 2.2 mm is a plausible printed wall |
| `driver_dome` | 27.0 ⌀ | **Placeholder, not a 40 mm driver.** The baffle is not derived from a real driver |
| `headband_arch` | 172.5 span | Relaxed span; needs to be *narrower* than head breadth (~145–160 mm) to clamp. Unverified guess |
| `pivot_pin` | 5.2 ⌀ × 33, brass | **Reintroduces a metal part.** One 5 mm pin is a far better BOM than Daily Driver's eight suppliers, but it is not zero |
| assembly | 175.6 × 199.6 × 54.0 | Plausible overall envelope |

**Scale gotcha, recorded so it does not bite later:** the file is in glTF's standard **metres**
(0.054 = 54 mm). The claim of "real millimeters" is true in intent and the file is correctly
authored — but most slicers assume millimetres and will import it at 1/1000 scale. Multiply by 1000
on import.

### Capability map (probe run 2026-08-06, with the 3D design skill selected)

Answers below are from Claude Design directly, verified against its test part (`earcup_housing_40.glb`
— 1 unit = 1 mm as claimed, names `cup_R` / `cup_shell_R` / `boss_m3_1..4_R` matching the
`SUBASSEMBLIES` contract exactly, 5 meshes / 3,392 triangles).

| Capability | Verdict |
|---|---|
| Parametric persistence | **No kernel.** Regenerates from source each turn; the *script* is the state. "A person editing a script, not a solver" — nothing propagates unless it edits it |
| Binding parameters | **Yes** — conforms or says a number does not close |
| Naming schema | **Yes, exactly.** Its output lands against `SUBASSEMBLIES` unchanged |
| Boolean cuts / CSG | **None. This is the hard ceiling** — a hole in an arbitrary place on a curved wall is impossible |
| Fillets | **No operator.** Roundness only if built into a lathe profile |
| Revolves, extrusions, draft, wall thickness as solid | Yes — real modeled material, not shading |
| Threads, snap-fit undercuts | Cosmetic / approximate (both want booleans) |
| Tolerance semantics, GD&T, fit checking | **None.** `gate.py` does work it cannot |
| Round-trip (import GLB/STEP and modify) | **No.** Round-trip is through *source*, not geometry |
| Export | OBJ+MTL / GLB only, always tessellated. No STEP, no B-rep, no feature tree |
| Units | Author-controlled. **Convention set: 1 unit = 1 mm** (matches CadQuery and every slicer; `inspect_glb.py` warns on either failure) |
| Documentation figures | **Its strongest mode**, and it argued for the right workflow unprompted — we export views from CadQuery/OCP, it composes/annotates/typesets, rather than re-modelling at lower fidelity to draw a picture of geometry we already hold |

**The handoff line is now settled and needs no per-part judgement: no CSG means nothing printable can
originate there. Form and figures upstream, engineering in CadQuery.** Which is exactly where
`design-pipeline.md` already drew it — now confirmed from the other side rather than assumed.

**Transport: GLB only, not OBJ.** OBJ has no scene graph — it carries groups, not parent/child
nodes — so it structurally cannot express the `SUBASSEMBLIES` hierarchy that makes the output
valuable. GLB carries geometry, materials and hierarchy in one file.

**Verdict: good enough to be the form reference, and it correctly stays on its side of the line.**
Claude Design described it itself as "industrial-design intent, not a print-ready CAD part," which
is exactly the boundary `builds/daily-driver/docs/design-pipeline.md` already draws between
generated references and engineered CAD. Both sides agreeing on that boundary unprompted is the
reason this is safe to adopt.

### Pipeline change: this replaces FAL

The FAL pipeline was Stage 1 text→concept image, Stage 2 image→reference mesh — a two-stage lossy
path whose output was images we did not want to build (maker's assessment, and the reason it was
abandoned rather than finished). Claude Design does both stages in one, and returns **named,
hierarchical, correctly-scaled geometry instead of a picture**. That is not an incremental
improvement; an image has to be re-interpreted by a human before it can become parameters, and a
named part list can be read straight into `params.py`.

Recommend retiring `pipeline/` for this build and routing concept work through Claude Design, with
`design-pipeline.md`'s taste-vs-convention boundary carried over unchanged.

## 4b. Architecture decision — spring steel, and delete the slider

Maker's call (2026-08-06): **spring steel is the default clamp element across all Warren Labs
headphones.** It solves the creep problem in §4 outright rather than working around it, and the
Beyerdynamic bow is a proven, purchasable default. §4's elastic-element proposal is withdrawn as the
primary and kept only as a fallback if sourcing ever becomes the constraint.

**But the suspension-strap idea attached to that decision is worth more than the spring question,
and it is a different mechanism.** In the AKG K240/K7xx pattern the sprung outer arch still supplies
*all* the clamp; the strap supplies **comfort, weight distribution, and self-adjustment**. So a
strap does not replace the spring — it replaces the **slider**.

That is the big part-count win available to this design:

> A self-adjusting suspension strap deletes `slider_rod`, `rod_detent_0..4`, the friction mechanism,
> the thumbscrew, and the head-size adjustment problem **entirely**. Head size is absorbed by the
> strap stretching, not by a mechanism the builder has to print to tolerance and that has to keep
> working after a hundred cycles.

Compare with the concept mesh in §4a, which models a rod block, a slider rod and five detents *per
side* — the very subsystem this deletes.

Costs, honestly: a suspension strap has a narrower fit range than a slider and sits poorly at the
extremes of head size; and the strap is a fabric/elastic consumable. The second is acceptable on the
same logic §4 already accepted for the spring ("a consumable you can replace is a feature for a
build-it-yourself product"). The first is a real limit and needs the head-size range in §5 #3
settled before committing.

**Proposed architecture:** sprung steel arch (clamp) + self-adjusting suspension strap (fit,
comfort) + printed cups, baffle, grille, gimbal. No slider, no detents, no thumbscrew, no inserts in
the mechanism.

## 4c. The parts list, and the seven interfaces

Deleting the slider (§4b) changes the entire upper assembly, and nothing has drawn what replaces it.
This is the gap: not dimensions, **parts and interfaces**. Both the next concept pass and the first
line of CadQuery need it, and neither can produce it.

### Parts

| Part | Per | Made | Notes |
|---|---|---|---|
| `bow` | 1 | **purchased** | Sprung steel arch — the one metal structural part (§4b). Beyer bow as default |
| `bow_cap_L/R` | 2 | printed | **The new part with no Daily Driver analogue.** See below |
| `strap` | 1 | **consumable** | Suspension strap — fabric/elastic. Absorbs head size |
| `yoke_L/R` | 2 | printed | Cup to bow_cap |
| `cup_shell_L/R` | 2 | printed | Open back, integral grille |
| `baffle_L/R` | 2 | printed | Driver seat — or merged into the shell, see interface 5 |
| `pad_L/R` | 2 | printed + foam? | Open question (§6 Q3) |
| `driver_L/R` | 2 | **purchased** | Reference geometry only |

**`bow_cap` does three jobs at once** — captures the steel bow, anchors the strap, and carries the
yoke swivel. That concentration is the whole benefit of deleting the slider (one printed part
replaces a rod, a shoe, five detents, a thumbscrew and an insert) and it is also the single part
most likely to be under-designed. It is where the effort goes.

### The seven interfaces — this is the actual design work

| # | Interface | The question | Fastener-free? |
|---|---|---|---|
| 1 | `bow` ↔ `bow_cap` | How is a steel strip captured in a printed part under sustained load? Slot + interference, slot + crimp, or slot + one screw | **Hardest.** Sustained load into plastic — the §4 creep problem relocated, not removed |
| 2 | `bow_cap` ↔ `strap` | Anchor geometry; strap must be replaceable without tools | Probably — a slot and a bar-tack |
| 3 | `bow_cap` ↔ `yoke` | Swivel (rotation about the vertical axis) | Printed snap / captured post |
| 4 | `yoke` ↔ `cup` | Tilt pivot | Printed trunnion or pin |
| 5 | `cup` ↔ `baffle` | Driver retention. **Merging the baffle into the shell deletes this interface entirely** — worth considering, since an on-ear has almost no rear cavity to service | n/a if merged |
| 6 | `cup` ↔ `pad` | Pad mount, and it must locate the driver relative to the canal repeatably (§3) | Yes — lip/groove |
| 7 | cable entry | Fixed or detachable; strain relief | Yes |

**Interface 1 is the one to solve first.** It inherits the creep problem: a sprung steel strip
pulling on a printed pocket is exactly sustained load into plastic. Spring steel solved creep in the
*band*; it did not solve creep at the *joint*. If this cannot be made to hold, the architecture is
wrong and we would rather know before any geometry exists.

### One open architecture question

Grado uses rod-block rotation **plus** gimbal tilt — two degrees of freedom. With a suspension strap
carrying fit, one of those may be unnecessary: the strap accommodates head height, so the cup may
only need tilt. **Dropping a DoF deletes a whole interface.** Worth deciding deliberately rather
than inheriting Grado's answer.

## 5. Tier 1 — what blocks the first print

Following the discipline in `builds/daily-driver/docs/measurement-priorities.md`: if a part
*regenerates from* the number it is Tier 1; if the number only *tunes* a part it is Tier 2.

| # | Measurement | Sets | Risk if wrong |
|---|---|---|---|
| 1 | **Driver OD + frame depth** (from the drivers actually on hand) | `driver_od` → aperture, recess, ring | Driver will not seat; everything downstream regenerates wrong |
| 1b | *Working assumption 2026-08-06: **40 mm**, pending current supplier quotes. Every dimension derived from it carries an `ESTIMATE` flag until a real driver is in hand.* | | |
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
4. ~~Elastic element or spring steel~~ — **settled 2026-08-06: spring steel, line-wide. See §4b.**
   The live question is now the *suspension strap*, which deletes the slider subsystem: what
   head-size range must it cover, and is that range reachable without a slider?
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
