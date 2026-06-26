# Cover spec — full-wrap, print-on-demand

The interior is one PDF; the cover is a **separate full-wrap PDF** (back +
spine + front as one flat sheet). This is a scaffold — the finished cover is
a design task (hand it to Claude Design alongside the interior brief). The
math here is what makes it press-correct.

## Trim & bleed

- **Trim:** 7 × 10 in (matches the interior).
- **Bleed:** 0.125 in (3 mm) on all four outer edges.

## Spine width — depends on final page count

Spine width = **page count × paper thickness per page**.

| Paper (POD) | Thickness / page | Example: 220 pp | 260 pp |
|-------------|------------------|-----------------|--------|
| KDP white   | 0.002252 in      | 0.495 in        | 0.586 in |
| KDP cream   | 0.0025 in        | 0.550 in        | 0.650 in |
| IngramSpark white (groundwood/standard) | ~0.0025 in | 0.550 in | 0.650 in |

Use the **final** interior page count (Paged.js reports it; or read it from
the rendered `book-press.pdf`). KDP and IngramSpark also publish exact
calculators — confirm against the one for your chosen platform/paper before
uploading.

> Note: most POD printers require a **minimum page count** before the spine
> is wide enough to carry text (KDP ≈ 80 pp, IngramSpark ≈ 48 pp). At
> ~175–240 pp this manual clears that easily.

## Full-wrap dimensions

```
wrap width  = bleed + trim(back) + spine + trim(front) + bleed
            = 0.125 + 7 + spine + 7 + 0.125
            = 14.25 + spine        (e.g. 14.836 in at 260 pp KDP white)

wrap height = bleed + trim + bleed
            = 0.125 + 10 + 0.125 = 10.25 in
```

Keep all text and logos ≥ 0.25 in inside the trim and ≥ 0.125 in off the
spine folds. Barcode goes bottom-right of the **back** panel (POD usually
adds it, or reserve ~2 × 1.2 in clear).

## Files

- `cover.html` — a parametric wrap template. Set `--spine` (and the page
  count comment) to your final number; it lays out back · spine · front with
  the brand palette. Render with `pagedjs-cli cover.html -o cover.pdf`, then
  CMYK like the interior.
