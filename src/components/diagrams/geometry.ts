/**
 * Shared path-geometry helpers for the diagram system — ported from
 * the Claude Design handoff (_source/diagrams/mp-theme.jsx) so every
 * figure computes identical geometry to the designed set.
 */

/** Polyline sine: x0 = left edge, yMid = centerline, wl = wavelength px. */
export function sinePath(
  x0: number,
  yMid: number,
  amp: number,
  wl: number,
  length: number,
  phase = 0,
  step = 3
): string {
  const pts: string[] = [];
  for (let x = 0; x <= length; x += step) {
    const y = yMid - amp * Math.sin((2 * Math.PI * x) / wl + phase);
    pts.push(`${(x0 + x).toFixed(1)} ${y.toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
}

/** Circular arc, angles in degrees (0° = +x, y-down), sweep positive. */
export function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const rad = (a: number) => (a * Math.PI) / 180;
  const x0 = cx + r * Math.cos(rad(a0));
  const y0 = cy + r * Math.sin(rad(a0));
  const x1 = cx + r * Math.cos(rad(a1));
  const y1 = cy + r * Math.sin(rad(a1));
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

export function zigzagPath(x0: number, x1: number, y: number, n = 7, amp = 12): string {
  const pts = [`M ${x0} ${y}`];
  for (let k = 1; k <= n; k++) {
    const x = x0 + (k * (x1 - x0)) / (n + 1);
    pts.push(`L ${x.toFixed(1)} ${(y + (k % 2 ? -amp : amp)).toFixed(1)}`);
  }
  pts.push(`L ${x1} ${y}`);
  return pts.join(' ');
}

/** Arrowhead polygon points + transform for a heading angle. */
export function arrowHead(x: number, y: number, angle: number, size = 7) {
  return {
    points: `0,0 ${-size},${size * 0.42} ${-size},${-size * 0.42}`,
    transform: `translate(${x} ${y}) rotate(${angle})`,
  };
}

export function angleDeg(x1: number, y1: number, x2: number, y2: number): number {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

/** Vertical-wall hatching line coordinates. */
export function hatchV(x: number, y0: number, y1: number, side = 1, n = 7, len = 10) {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let k = 0; k < n; k++) {
    const y = y0 + (k * (y1 - y0)) / (n - 1);
    lines.push({ x1: x, y1: y, x2: x + side * len, y2: y + len });
  }
  return lines;
}
