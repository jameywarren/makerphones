# SPDX-FileCopyrightText: 2026 Jamey Warren
# SPDX-License-Identifier: MIT
"""
Detent coupon — find the leaf thickness for the on-ear's printed slider.

WHY THIS EXISTS. Dropping the suspension strap (on-ear-brief.md §4b) put the slider back, which
makes interface 2 — a printed cantilever leaf riding a notch ladder — the mechanism's real unknown.
It is the part of this build with the least prior art: printed detents that still hold after a few
hundred adjustments are not a solved problem, and the governing parameter (leaf thickness) sets a
spring force we cannot calculate to any useful accuracy. Print modulus varies with material batch,
layer adhesion, infill and print temperature, so a number derived from PETG's datasheet modulus
would be honest-looking and wrong.

So: measure it. One rail plus a ladder of sleeves at graduated leaf thicknesses, small enough to
print all at once. Slide each, keep the one that feels right, and that number goes into params.py
with a real justification instead of an ESTIMATE flag.

This deliberately follows Daily Driver's existing `coupon.py` convention — test one interface in
isolation, on its own, before anything downstream depends on it.

WHAT IT DOES NOT TEST. Cycle life. A coupon tells you the force on adjustment one, not on adjustment
three hundred, and creep at the bump is the failure mode that will actually end this mechanism
(same physics as §4's headband creep, concentrated at a smaller feature). Pick a thickness here,
then leave the winner clicked back and forth on the bench for a week before committing.

PRINT ORIENTATION IS PART OF THE EXPERIMENT, NOT A DETAIL.
The leaf bends in the XY plane by design, so print the sleeves STANDING (bore vertical, as modelled)
and the layer lines run along the leaf rather than across it. Printed flat, the leaf is being asked
to bend exactly where layer adhesion is weakest and it will snap early — a result that would look
like "the design is wrong" rather than "the orientation was wrong". Print in the real material
(PETG), not PLA: PLA is stiffer and would flatter the result.

    ../../../builds/daily-driver/.venv/bin/python detent_coupon.py
"""

import math
from dataclasses import dataclass, field

import cadquery as cq


@dataclass
class Params:
    # --- the rail (stands in for the yoke rod) --------------------------------------------------
    # RECTANGULAR, not round, and that is an architectural choice worth noticing: a rectangular rod
    # cannot rotate in its sleeve, so it forces BOTH of the cup's rotational axes (brief §4d #6) out
    # to designed joints at the yoke instead of letting one hide as slop in the slider. Grado gets
    # its rod-block swivel from a round rod; we would be giving that up on purpose.
    rod_w: float = 10.0
    rod_t: float = 5.0
    rod_len: float = 70.0

    notch_pitch: float = 4.0        # adjustment granularity — 4 mm is ~8 usable steps over 32 mm
    notch_r: float = 1.6            # groove radius; must exceed bump_r or the bump cannot seat
    notch_depth: float = 0.70       # how far the groove cuts into the face
    n_notches: int = 13

    # --- the sleeve (stands in for the slider body) ---------------------------------------------
    clear: float = 0.25             # bore clearance per side — a printed sliding fit
    wall: float = 2.0               # the three structural walls
    sleeve_len: float = 18.0

    # --- the cantilever ------------------------------------------------------------------------
    leaf_w: float = 6.0             # tongue width
    slot_w: float = 1.2             # slot that frees the tongue on each side
    root_z: float = 5.0             # tongue is anchored below this, free above it
    bump_r: float = 1.30
    # Protrusion of the bump below the bore surface. NOT the same as how far it engages the rod —
    # see `engagement` below, which is the number that actually matters and is smaller.
    bump_h: float = 0.80

    # THE VARIABLE. Everything else is held constant so the comparison means something.
    leaf_thicknesses: list = field(default_factory=lambda: [0.8, 1.0, 1.2, 1.4, 1.6])

    @property
    def engagement(self) -> float:
        """How far the bump ACTUALLY reaches into the rod — the number that sets detent feel.

        THE TRAP THIS PROPERTY EXISTS TO CLOSE. The sleeve floats `clear` away from the rod on
        every side, so the bump spends the first `clear` of its protrusion just crossing the gap.
        A first pass here used bump_h = 0.65 with clear = 0.25 and looked correct in every
        dimension check, while delivering only 0.40 mm of real engagement — 62% of the intended
        detent. It would have printed, assembled, felt weak, and sent us chasing leaf thickness
        for a fault that was never in the leaf.
        """
        return self.bump_h - self.clear

    def __post_init__(self):
        if self.bump_r > self.notch_r:
            raise ValueError(
                f"bump_r {self.bump_r} > notch_r {self.notch_r}: the bump cannot seat in the groove, "
                "so every sleeve would ride over the ladder without detenting and the coupon would "
                "measure nothing."
            )
        if self.engagement <= 0:
            raise ValueError(
                f"bump_h {self.bump_h} <= clear {self.clear}: the bump never reaches the rod at all."
            )
        if self.engagement >= self.notch_depth:
            raise ValueError(
                f"engagement {self.engagement:.2f} >= notch_depth {self.notch_depth}: the bump bottoms "
                "out in the groove instead of being held by its flanks, which turns a detent into a "
                "hard stop."
            )
        if self.engagement < 0.35:
            raise ValueError(
                f"engagement {self.engagement:.2f} mm is under ~0.35: below roughly two extrusion "
                "widths the detent is inside print tolerance and the coupon measures noise."
            )

    # bore and shell, derived so nothing is hardcoded twice
    @property
    def bore_x(self): return self.rod_w + 2 * self.clear

    @property
    def bore_y(self): return self.rod_t + 2 * self.clear

    @property
    def outer_x(self): return self.bore_x + 2 * self.wall


def make_rail(p: Params) -> cq.Workplane:
    """The notched rod. Print FLAT — it carries no bending load, only the grooves matter."""
    rail = cq.Workplane("XY").box(p.rod_w, p.rod_t, p.rod_len, centered=(True, True, False))

    # Semicircular grooves across the +Y face. Built as explicit solids rather than workplane
    # gymnastics — orientation bugs in a swept cut are invisible until you print it.
    y_c = p.rod_t / 2.0 + p.notch_r - p.notch_depth
    z0 = (p.rod_len - (p.n_notches - 1) * p.notch_pitch) / 2.0

    cutters = []
    for i in range(p.n_notches):
        z = z0 + i * p.notch_pitch
        cutters.append(
            cq.Solid.makeCylinder(
                p.notch_r, p.rod_w + 2.0,
                cq.Vector(-(p.rod_w / 2.0 + 1.0), y_c, z),
                cq.Vector(1, 0, 0),
            )
        )
    for c in cutters:
        rail = rail.cut(cq.Workplane(obj=c))

    # A foot, so the rail can be clamped in a vice while the sleeves are worked back and forth.
    foot = cq.Workplane("XY").box(p.rod_w + 12.0, p.rod_t + 8.0, 3.0, centered=(True, True, False))
    return rail.union(foot)


def make_sleeve(p: Params, leaf_t: float) -> cq.Workplane:
    """One sleeve at a given leaf thickness. Print STANDING — see the module docstring."""
    outer_y = p.bore_y + p.wall + leaf_t

    # The bore sits off-centre in Y so the +Y wall is the (thin) leaf and -Y stays structural.
    bore_y_c = (p.wall - leaf_t) / 2.0
    bore_top = outer_y / 2.0 - leaf_t

    sleeve = cq.Workplane("XY").box(p.outer_x, outer_y, p.sleeve_len, centered=(True, True, False))
    bore = cq.Workplane("XY").box(
        p.bore_x, p.bore_y, p.sleeve_len + 2.0, centered=(True, True, False)
    ).translate((0, bore_y_c, -1.0))
    sleeve = sleeve.cut(bore)

    # Free the tongue: two slots through the +Y wall only, from root_z up through the top face.
    # Cantilever anchored below root_z, free above it.
    slot_h = p.sleeve_len - p.root_z + 2.0
    for sx in (-1, 1):
        slot = cq.Workplane("XY").box(
            p.slot_w, leaf_t + 2.0, slot_h, centered=(True, True, False)
        ).translate((sx * (p.leaf_w / 2.0 + p.slot_w / 2.0), bore_top + leaf_t / 2.0, p.root_z))
        sleeve = sleeve.cut(slot)

    # The bump: a rounded ridge protruding INTO the bore, on the tongue's inner face near its free
    # end. Clipped to the bore side — an unclipped cylinder of radius 1.3 punches straight through
    # a 0.8 mm leaf and out the back of the sleeve, which is exactly what the first version did.
    # The dimension check missed it (Y grew by a constant, so every variant looked equally wrong);
    # a fit test against a rod-shaped prism is what caught it.
    bump_z = p.sleeve_len - 4.0
    bump = cq.Solid.makeCylinder(
        p.bump_r, p.leaf_w,
        cq.Vector(-p.leaf_w / 2.0, bore_top - p.bump_h + p.bump_r, bump_z),
        cq.Vector(1, 0, 0),
    )
    keep = cq.Workplane("XY").box(
        p.leaf_w, p.bump_h, p.bump_r * 3.0, centered=(True, True, True)
    ).translate((0, bore_top - p.bump_h / 2.0, bump_z))
    sleeve = sleeve.union(cq.Workplane(obj=bump).intersect(keep))

    # Emboss the thickness on the solid (-Y) face so a handful of printed sleeves stay identifiable.
    # Guarded: a missing system font must not cost us the geometry.
    try:
        label = (
            cq.Workplane("XZ")
            .transformed(offset=(0, p.sleeve_len / 2.0, outer_y / 2.0))
            .text(f"{leaf_t:.1f}", 4.0, 0.6, combine=False)
        )
        sleeve = sleeve.union(label)
    except Exception as exc:                                    # noqa: BLE001 — cosmetic only
        print(f"  (label skipped for {leaf_t:.1f}: {exc})")

    return sleeve


def main():
    p = Params()
    out = __import__("pathlib").Path(__file__).parent / "output"
    out.mkdir(exist_ok=True)

    rail = make_rail(p)
    cq.exporters.export(rail, str(out / "rail.stl"))
    cq.exporters.export(rail, str(out / "rail.step"))
    print(f"rail.stl          rod {p.rod_w}x{p.rod_t}x{p.rod_len}, "
          f"{p.n_notches} notches @ {p.notch_pitch} mm")

    for t in p.leaf_thicknesses:
        s = make_sleeve(p, t)
        name = f"sleeve_{str(t).replace('.', 'p')}"
        cq.exporters.export(s, str(out / f"{name}.stl"))
        print(f"{name}.stl   leaf {t} mm")

    print(f"\n{1 + len(p.leaf_thicknesses)} parts -> {out}")
    print("Print the sleeves STANDING (bore vertical) in PETG. See the docstring.")


if __name__ == "__main__":
    main()
