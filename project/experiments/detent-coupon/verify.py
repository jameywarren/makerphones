import math, cadquery as cq
from detent_coupon import Params, make_rail, make_sleeve
p=Params(); fails=0
print(f"engagement = bump_h {p.bump_h} - clear {p.clear} = {p.engagement:.2f} mm "
      f"into a {p.notch_depth} mm notch\n")
rail=make_rail(p); bb=rail.val().BoundingBox()
print("rail bbox:", [round(v,2) for v in (bb.xlen,bb.ylen,bb.zlen)])
for t in p.leaf_thicknesses:
    s=make_sleeve(p,t); bb=s.val().BoundingBox()
    outer_y=p.bore_y+p.wall+t
    # label adds 0.6 on -Y; nothing may protrude on +Y
    y_ok = abs(bb.ylen-(outer_y+0.6))<0.05
    xz_ok = abs(bb.xlen-p.outer_x)<0.05 and abs(bb.zlen-p.sleeve_len)<0.05
    # fit: only the bump may sit in the rod's swept path
    rod=cq.Workplane("XY").box(p.rod_w,p.rod_t,p.sleeve_len+10,centered=(True,True,False))\
          .translate((0,(p.wall-t)/2.0,-5))
    inter=s.val().intersect(rod.val()); v=inter.Volume() if inter else 0.0
    r,h=p.bump_r,p.engagement
    seg=r*r*math.acos((r-h)/r)-(r-h)*math.sqrt(2*r*h-h*h)
    exp=seg*p.leaf_w
    fit_ok=abs(v-exp)/exp<0.15
    ok=y_ok and xz_ok and fit_ok
    fails+= 0 if ok else 1
    print(f"leaf {t}: bbox {round(bb.xlen,2)}x{round(bb.ylen,2)}x{round(bb.zlen,2)} "
          f"(exp y {outer_y+0.6:.2f}) | bump-in-rod {v:.2f} exp {exp:.2f} mm3  "
          f"{'OK' if ok else 'FAIL'}")
print("\nALL PASS" if not fails else f"\n{fails} FAILED")
