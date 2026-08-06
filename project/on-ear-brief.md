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

### The suspension strap is OUT — reversed 2026-08-06

An earlier draft of this section claimed a self-adjusting strap could replace the slider outright
and called it the largest part-count win available. **Maker's call, from having handled the
category: no.** A suspension strap is a *comfort addition*, not a fit mechanism; the headphones that
delete the slider this way "aren't a great solution."

Recording the reversal rather than quietly deleting it, because the argument was superficially
strong and will be re-proposed by anyone who reads about the K240 and reasons from first principles.
The counter-evidence is wear experience across the category, which is not reachable from a datasheet.

**Consequence: the slider is back, and with it the whole subsystem.** The printable friction slider
from §4 matters again — a printed cantilever leaf with a detent bump riding a notch ladder, which
prints support-free and tunes by leaf thickness. That is now load-bearing work rather than a
nice-to-have, and it is the part of the mechanism with the least prior art in printed form.

Honest accounting of what simplification actually survives: **the Grado pad interface (§4d #3) is
now the big win, not the mechanism.** The mechanism is roughly Grado's, and roughly Daily Driver's.

### Forming our own bow is ruled out — by experiment, not by analysis

**Maker has already tried this and it failed**, using 3D-printed forming jigs. Spring steel does not
cooperate: it springs back, the jig deflects before the stock does, and printed tooling is nowhere
near stiff enough. Recorded here permanently so it is not re-attempted from an armchair — the DIY
route listed in Daily Driver's BOM (1095 blue-tempered strip, or laser-cut and formed) is a
*sourcing* suggestion, not a shop-floor one.

**Direction instead: an off-the-shelf bow, or a stocked custom part made to our spec and used
line-wide across every Warren Labs headphone.** The second is the better long-term answer — it
decouples us from one manufacturer's spare-parts channel and lets the arc be designed for *our*
geometry rather than inherited from a DT770 — and it is a sourcing conversation, not a design task.
Until then the Beyer bow is the default and **we are knowingly inheriting a circumaural's arc.**

**Proposed architecture:** sprung steel bow (purchased) + printed slider + printed yoke + printed
cup and baffle + commodity Grado-pattern pads. Screws are allowed at the bow joint (§4d #1).

## 4d. Settled by the maker, 2026-08-06

Seven decisions from the design conversation. Each closes a question the rest of the brief was
holding open.

**1. Screws are allowed at the bow joint.** The fastener-free through-post sandwich is dropped. The
Beyer bow has end-tab holes and is designed to be screwed; we use them. This keeps a small number of
M3s in the BOM at the *one* joint that carries sustained spring load — which is the right place to
spend them, and it retires interface 1 as a research problem.

**2. Clamp target: the HD 600 / DT 770 class.** Explicitly *not* Grado — a Grado's light clamp is
not the goal.

> **Watch item, not a challenge to the call.** HD 600 and DT 770 are both circumaural, so their
> clamp force spreads around the ear onto the skull. The same *force* on a supra-aural concentrates
> on the ear itself, so the **pressure** is much higher. Expect the first wear test to be the
> arbiter, and expect pad compliance (§4d #3) to be the mitigation rather than backing the force off.

**3. Grado-pattern pads — commodity, not designed.** Multiple aftermarket manufacturers exist and end
users can buy Grado pads directly. We design a rim the foam stretches over and ship no pad at all.

> **This is now the single largest constraint in the build, and it points inward.** The cup rim OD is
> fixed *from outside* by the pad's relaxed ID — it is no longer ours to choose. And it likely runs
> **smaller than the 54 mm** the concept assumed, which tightens the annulus between the driver seat
> and the outer wall. §4a's boss-clearance finding was already marginal at 54 mm with a 40 mm driver;
> at a Grado-sized rim it gets worse. Independent confirmation that fasteners do not belong in that
> wall — see #7.

**4. Suspension strap: dropped.** See §4b.

**5. Separate baffle — confirmed**, and for a better reason than the print-flatness argument that
prompted the question: **manufacturing, tweaking and repair.** A separate baffle is the part a
builder iterates on.

**6. Two degrees of freedom at the cup — confirmed.** "The pads need to swivel a little bit as well
as go up and down, it does matter." *(One clarification outstanding — see §6 Q6.)*

**7. Clamp ring for driver retention**, and the framing that comes with it is a design principle
worth generalising:

> *"Not ideal for a manufactured model, but for a tweaker/DIY it's great."*

**Adopt that as the tie-breaker for this whole build: when serviceability and manufacturability
conflict, serviceability wins, because the user is a tweaker.** It resolves #5 and #7 the same way
and it will resolve future trade-offs without re-litigating them.

## 4c. The parts list, and the seven interfaces

Deleting the slider (§4b) changes the entire upper assembly, and nothing has drawn what replaces it.
This is the gap: not dimensions, **parts and interfaces**. Both the next concept pass and the first
line of CadQuery need it, and neither can produce it.

*Revised after §4d — the strap is out, the slider is back, and the pad is no longer ours to design.*

### Parts

| Part | Per | Made | Notes |
|---|---|---|---|
| `bow` | 1 | **purchased** | Sprung steel arch. Beyer default; stocked-custom is the goal (§4b) |
| `slider_L/R` | 2 | printed | Screws to the bow, carries height adjustment + the yoke swivel |
| `yoke_L/R` | 2 | printed | Slider to cup |
| `cup_shell_L/R` | 2 | printed | Open back, integral grille, **rim OD set by the pad** |
| `baffle_L/R` | 2 | printed | Driver seat. Separate, per §4d #5 |
| `clamp_ring_L/R` | 2 | printed | Driver retention, per §4d #7 |
| `driver_L/R` | 2 | **purchased** | Reference geometry only |
| pads | — | **commodity** | Grado-pattern. **Not designed, not shipped, not in the repo** |

### The interfaces — this is the actual design work

| # | Interface | Status | The question |
|---|---|---|---|
| 1 | `bow` ↔ `slider` | **settled** | Screws through the bow's end-tab holes (§4d #1). Hole Ø + pitch is now Tier 1 |
| 2 | `slider` height adjustment | **the hard one now** | Printed cantilever leaf + detent ladder. Prints support-free, tunes by leaf thickness. Least prior art in printed form; has to survive hundreds of cycles |
| 3 | `slider` ↔ `yoke` | open | Swivel. Printed snap or captured post |
| 4 | `yoke` ↔ `cup` | open | Tilt. Printed trunnion or pin |
| 5 | `cup` ↔ `baffle` | exists by decision | Serviceable joint — the builder iterates on the baffle |
| 6 | `baffle` ↔ `driver` ↔ `clamp_ring` | settled in principle | Recess + printed clamp ring, no adhesive |
| 7 | `cup` rim ↔ pad | **externally constrained** | Rim OD set by the commodity pad's relaxed ID. Also has to locate the driver relative to the canal repeatably (§3) |
| 8 | cable entry | open | Fixed or detachable; strain relief |

**Interface 2 replaced interface 1 as the one to solve first.** Screws retired the bow joint as a
research problem; the printed friction slider is now the mechanism's real unknown, and it is the
part with the least precedent — printed detents that still hold after a few hundred adjustments are
not a solved problem in the maker literature.

**Interface 7 is the tightest constraint in the build** and it propagates inward, not outward: the
pad fixes the rim OD, the rim OD fixes the annulus available between the driver seat and the outer
wall, and that annulus is what §4a already showed to be marginal for anything living in the cup
wall. Measure it first (§5).

## 5. Tier 1 — what blocks the first print

Following the discipline in `builds/daily-driver/docs/measurement-priorities.md`: if a part
*regenerates from* the number it is Tier 1; if the number only *tunes* a part it is Tier 2.

**All of Tier 1 is now measurable on the bench — the Grado and the Beyer bow are both in hand
(2026-08-06). Nothing here waits on a supplier.**

| # | Measurement | From | Sets | Risk if wrong |
|---|---|---|---|---|
| **1** | **Grado cup rim OD** — the diameter the pad's relaxed ID stretches over. Plus the rim profile: plain cylinder, lip, or groove, and what actually retains the pad | Grado on bench | `cup_outer_diameter` → cascades to the whole cup, the annulus, and every feature in the wall | The pad does not stay on, or the cup is the wrong size and everything downstream regenerates wrong |
| **2** | **Pad relaxed ID + stretched ID + thickness** (flat and bowl if both are to hand) | Grado pads | the fit envelope, and the bass-tuning range we can promise | Over- or under-stretched pad; wrong bass expectation set in the docs |
| **3** | **Bow end-tab hole Ø + centre pitch**, and bow width + thickness | Beyer bow | the `slider` screw pattern and the bow pocket | Bow will not mount — and this is now a *screwed* joint (§4d #1), so it is Tier 1, not Tier 2 |
| **4** | **Bow relaxed radius + developed length** | Beyer bow | ear spacing, slider travel, worn arc | Wrong ear spacing; on an on-ear this lands the pad off the ear |
| **5** | **Driver OD + frame depth** | drivers on hand | `driver_od` → aperture, recess, clamp ring | Driver will not seat |
| 5b | *Working assumption: **40 mm**, pending current supplier specs. Everything derived carries `ESTIMATE` until a real driver is chosen.* | | | |

### First bench numbers — Grado rim, 2026-08-06 (TAPE MEASURE, provisional)

| Feature | As read | Metric |
|---|---|---|
| Rim / lip outer diameter | 2 ⅛ in | **53.98 mm** |
| Lip depth | ~⅛ in | ~3.18 mm |
| Cup steps inward behind the lip by | ~⅛ in | ~3.18 mm |

**Precision, stated because this number regenerates the entire model.** A tape measure on a curved
cup, read to the nearest ⅛ in, is ±1/16 in at best — **53.98 ± 1.6 mm**. That is a 3 mm span on the
one dimension everything else derives from. Good enough to build the parametric skeleton against;
**not good enough to print.** `measurement-priorities.md`'s rule stands: caliper readings beat
everything, and this gets re-taken before the first load-bearing part.

Flag as `ESTIMATE` in `params.py`, and note that the concept mesh's 54 mm (§4a) was a lucky guess
rather than a derived number — do not let the agreement read as corroboration.

### The profile, resolved (maker, 2026-08-06)

The step is **radial**, and the geometry is simpler than the ambiguity suggested:

    baffle / front plate    Ø 53.98  (2⅛ in), 3.18 thick — this is the face that was measured
    steps in 3.18 per side
    cup body                Ø 47.625 (1⅞ in)

**The "lip" is not a feature on the cup — it is the baffle overhanging the body.** That single
reading explains the whole profile, and it explains pad retention for free: the foam stretches over
the Ø53.98 plate rim and grips the Ø47.625 body behind it. Confirmed against a section drawing.

**Driver: 40 mm, confirmed — it is the standard and we are not designing around a non-standard part.**

    baffle OD                                    53.98
    driver seat (40 + 0.6 clearance)             40.60
    radial ledge = (53.98 − 40.60)/2           =  6.69 mm

### Correction — the "nothing fastened in that wall" claim was wrong

The previous revision of this section computed the driver ledge against the *cup body* and got
4.69 mm, then declared it "settled" that no fastener could live there, citing three independent
routes agreeing. **That was an over-claim built on a misread profile.** The driver mounts in the
*baffle*, which is the Ø53.98 plate, not in the body bore — so the real figure is **6.69 mm**, which
is comfortably enough for an M3 boss and heat-set insert.

What actually happened: the concept mesh (§4a) also assumed a ~54 mm cup and also found the ledge
marginal, and the agreement felt like corroboration. It was not — the concept had no baffle
overhang modelled at all, so both of us were making the same mistake about the same part.

**The clamp ring (§4d #7) still stands, but it stands as a design *choice* — serviceability for a
tweaker — not as something geometry forced.** That distinction matters: if a later revision needs
fasteners there, geometry does not forbid it, and this section should not be quoted as if it does.

### The measurement worth inventing: turn the clamp target into a number

§4d #2 sets the target as "HD 600 / DT 770 class," which is a *feel*, not a spec — and Daily Driver
never had to convert it because it inherited clamp from the purchased bow. We now need it as a
number, and it is cheap to get:

> Spread the headphone across two blocks at a known separation (a head-width proxy), rest one arm on
> a kitchen scale, and read the force. Repeat at the ends of the head-size range. Do the same with
> the HD 600 and the DT 770 as references.

That converts a subjective target into `bow_*` spec and gives us the number to hand a stocked-part
supplier later (§4b). It also produces the reference data for the §4d #2 watch item — the same force
on a supra-aural is a much higher *pressure*, and we will want the before/after when the first wear
test disagrees.

## 6. Open questions — Jamey

1. **Name.** Not proposing one. Naming is locked-by-decision in this org and it is his call.
2. **Which driver.** He has a handful on hand and OEM reach. The first Tier-1 number comes from
   whichever is chosen, so this is the gate on everything else. Candidates measured on the same
   fixture in one session (FR + distortion + impedance + Fs) is a day's work and the highest-leverage
   day in the project.
3. ~~Printed pad, or foam?~~ — **settled: commodity Grado-pattern, §4d #3.** Note this reverses §2's
   "the pad is a printed part, so bass tuning is a reprint" argument: bass tuning is now a $10
   aftermarket purchase instead, which is *better* for the builder and removes the lever from our
   parametric model. §2's framing should be read as superseded.
4. ~~Elastic element or spring steel~~ — **settled: spring steel, line-wide (§4b).** Forming our own
   is ruled out by experiment. Live follow-on, and it is *sourcing* not design: find an off-the-shelf
   bow we are happy to standardise on, or a supplier who will make and stock a bow to our spec for
   every Warren Labs headphone.
6. ~~Two DoF — which two?~~ — **settled 2026-08-06: all three.** Two rotational axes at the cup
   (swivel + tilt) *plus* the slider's vertical travel.

   Consequence, and it is not free: the detent coupon's rail is **rectangular**, so it cannot rotate
   in its sleeve. That pushes **both** rotational axes out to designed joints at the yoke, where
   Grado gets one of them free from a round rod. Interface 3 and interface 4 now each carry a real
   axis and the yoke is the crowded part. If it will not take both, the first thing to revisit is
   the rectangular rail — a round rod returns the swivel to the slider at the cost of letting the
   cup twist under load.
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
