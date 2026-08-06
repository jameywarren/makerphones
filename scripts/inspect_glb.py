#!/usr/bin/env python3
"""Inspect a GLB: part hierarchy, real dimensions, materials, triangle budget.

Why this exists. Concept meshes now arrive from outside the repo (Claude Design,
and previously the FAL pipeline), and the first question about any of them is
always the same: what parts are in here, how big are they really, and is the
scale what the sender claimed? Opening it in a viewer answers none of those
reliably -- a viewer will happily show you a beautiful headphone that is 54
metres wide.

    python scripts/inspect_glb.py path/to/model.glb
    python scripts/inspect_glb.py model.glb --filter cup,pad,driver

UNITS. glTF's convention is METRES, so a correctly-authored 54 mm cup is 0.054
in the file. This script reports millimetres throughout (x1000). If a model
really were authored in millimetre units it would report 54000.0 mm here, which
is the tell -- and it matters, because most slicers assume millimetres and will
import a correct metre-based GLB at 1/1000 scale.

Pure stdlib: no trimesh, no pygltflib, nothing to install.
"""

import json
import struct
import sys


def load_gltf(path):
    """Return the JSON chunk of a .glb (or the parsed .gltf)."""
    data = open(path, "rb").read()
    if data[:4] != b"glTF":
        return json.loads(data.decode("utf-8"))       # plain .gltf

    magic, version, _ = struct.unpack("<III", data[:12])
    if version != 2:
        raise SystemExit(f"glTF version {version} — this reader handles 2.0 only")

    off, gltf = 12, None
    while off < len(data):
        clen, ctype = struct.unpack("<II", data[off:off + 8])
        if ctype == 0x4E4F534A:                       # 'JSON'
            gltf = json.loads(data[off + 8:off + 8 + clen])
        off += 8 + clen + ((4 - clen % 4) % 4 if clen % 4 else 0)
    if gltf is None:
        raise SystemExit("no JSON chunk found")
    return gltf


def mesh_bounds(gltf, mesh_index):
    """Local-space bbox from the accessors' own min/max — no buffer decoding needed."""
    lo, hi = [float("inf")] * 3, [float("-inf")] * 3
    for prim in gltf["meshes"][mesh_index]["primitives"]:
        acc = gltf["accessors"][prim["attributes"]["POSITION"]]
        for i in range(3):
            lo[i] = min(lo[i], acc["min"][i])
            hi[i] = max(hi[i], acc["max"][i])
    return lo, hi


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    path = sys.argv[1]
    keep = None
    if "--filter" in sys.argv:
        keep = [s.strip().lower() for s in sys.argv[sys.argv.index("--filter") + 1].split(",")]

    gltf = load_gltf(path)
    nodes = gltf.get("nodes", [])
    materials = gltf.get("materials", [])

    tris = sum(
        gltf["accessors"][p["indices"]]["count"] // 3
        for m in gltf.get("meshes", []) for p in m["primitives"] if "indices" in p
    )

    print(f"generator : {gltf.get('asset', {}).get('generator', '?')}")
    print(f"parts     : {len(gltf.get('meshes', []))} meshes / {len(nodes)} nodes / {tris:,} triangles")
    print(f"materials : {', '.join(m.get('name', '(unnamed)') for m in materials) or '(none)'}")
    print()

    extents = [[float("inf")] * 3, [float("-inf")] * 3]

    def walk(idx, depth, ptrans, pscale):
        node = nodes[idx]
        name = node.get("name", "(unnamed)")
        t = node.get("translation", [0, 0, 0])
        s = node.get("scale", [1, 1, 1])
        # Rotations are ignored: they do not change a part's own size, and this
        # tool answers "how big is each part", not "where exactly does it sit".
        wt = [ptrans[i] + t[i] * pscale[i] for i in range(3)]
        ws = [pscale[i] * s[i] for i in range(3)]

        if "mesh" in node:
            lo, hi = mesh_bounds(gltf, node["mesh"])
            for i in range(3):
                extents[0][i] = min(extents[0][i], wt[i] + lo[i] * ws[i])
                extents[1][i] = max(extents[1][i], wt[i] + hi[i] * ws[i])
            if keep is None or any(k in name.lower() for k in keep):
                d = [(hi[i] - lo[i]) * ws[i] * 1000.0 for i in range(3)]
                mats = sorted({
                    materials[p["material"]].get("name", "?")
                    for p in gltf["meshes"][node["mesh"]]["primitives"] if "material" in p
                })
                print(f"{'  ' * depth}{name:<22} {d[0]:7.1f} x {d[1]:7.1f} x {d[2]:7.1f} mm   {'/'.join(mats)}")
        elif keep is None:
            print(f"{'  ' * depth}{name}")

        for child in node.get("children", []):
            walk(child, depth + 1, wt, ws)

    for root in gltf["scenes"][gltf.get("scene", 0)]["nodes"]:
        walk(root, 0, [0, 0, 0], [1, 1, 1])

    span = [(extents[1][i] - extents[0][i]) * 1000.0 for i in range(3)]
    print(f"\nassembly  : {span[0]:.1f} x {span[1]:.1f} x {span[2]:.1f} mm")
    if max(span) > 5000:
        print("  ** scale warning: this reads as metres-as-millimetres. Divide by 1000. **")
    elif max(span) < 5:
        print("  ** scale warning: assembly under 5 mm — is this authored in metres-of-metres? **")


if __name__ == "__main__":
    main()
