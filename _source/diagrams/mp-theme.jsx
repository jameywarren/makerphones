// MakerPhones diagram system — shared tokens + helpers
// Restrained, blueprint-flavored: charcoal structure, orange = the active element,
// mono labels, leader lines with 2px dots.

const MP = {
  ink: '#2d3748',     // structure
  accent: '#ea580c',  // active / moving / highlighted — used sparingly
  dark: '#111827',    // dark mass (magnets, walls)
  label: '#6b7280',   // label text
  faint: '#9ca3af',   // leader lines
  hair: '#d1d5db',    // hairlines, air
  ground: '#f9fafb',  // off-white ground
  mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
};

// SVG <text> can't contain <span> wrappers (they render as nothing), so
// flatten whatever children arrive into a plain string before rendering.
function mlText(children) {
  let out = '';
  React.Children.forEach(children, (c) => {
    if (c == null || c === false) return;
    if (typeof c === 'string' || typeof c === 'number') out += c;
    else if (c.props) out += mlText(c.props.children);
  });
  return out;
}

function ML({ x, y, children, anchor = 'start', size = 11, color = MP.label, weight = 500, opacity = 1, transform }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={MP.mono} fontSize={size}
      letterSpacing="0.08em" fill={color} fontWeight={weight} opacity={opacity} transform={transform}>{mlText(children)}</text>
  );
}

function Leader({ x1, y1, x2, y2 }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MP.faint} strokeWidth="1" />
      <circle cx={x2} cy={y2} r="2.2" fill={MP.faint} />
    </g>
  );
}

function FigHead({ n, title, x = 24, y = 34 }) {
  return (
    <g>
      <ML x={x} y={y} color={MP.accent} weight={700}>FIG. {n}</ML>
      <ML x={x + 78} y={y} color={MP.dark} weight={600}>{title}</ML>
    </g>
  );
}

function FigCaption({ x, y, children, anchor = 'start' }) {
  return <ML x={x} y={y} size={10} anchor={anchor} color={MP.label} opacity={0.9}>{children}</ML>;
}

function ArrowHead({ x, y, angle, size = 7, color = MP.ink }) {
  return (
    <polygon points={`0,0 ${-size},${size * 0.42} ${-size},${-size * 0.42}`}
      transform={`translate(${x} ${y}) rotate(${angle})`} fill={color} />
  );
}

function Arrow({ x1, y1, x2, y2, color = MP.ink, width = 1.5, both = false, head = 7 }) {
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} />
      <ArrowHead x={x2} y={y2} angle={ang} color={color} size={head} />
      {both && <ArrowHead x={x1} y={y1} angle={ang + 180} color={color} size={head} />}
    </g>
  );
}

// Polyline sine: x0 = left edge, yMid = centerline, wl = wavelength px
function sinePath(x0, yMid, amp, wl, length, phase = 0, step = 3) {
  const pts = [];
  for (let x = 0; x <= length; x += step) {
    const y = yMid - amp * Math.sin((2 * Math.PI * x) / wl + phase);
    pts.push(`${(x0 + x).toFixed(1)} ${y.toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
}

// Circular arc, angles in degrees (0° = +x, y-down screen coords), sweep positive
function arcPath(cx, cy, r, a0, a1) {
  const rad = (a) => (a * Math.PI) / 180;
  const x0 = cx + r * Math.cos(rad(a0)), y0 = cy + r * Math.sin(rad(a0));
  const x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

function zigzagPath(x0, x1, y, n = 7, amp = 12) {
  const pts = [`M ${x0} ${y}`];
  for (let k = 1; k <= n; k++) {
    const x = x0 + (k * (x1 - x0)) / (n + 1);
    pts.push(`L ${x.toFixed(1)} ${(y + (k % 2 ? -amp : amp)).toFixed(1)}`);
  }
  pts.push(`L ${x1} ${y}`);
  return pts.join(' ');
}

// Boundary hatching along a vertical wall face
function HatchV({ x, y0, y1, side = 1, n = 7, len = 10 }) {
  const lines = [];
  for (let k = 0; k < n; k++) {
    const y = y0 + (k * (y1 - y0)) / (n - 1);
    lines.push(<line key={k} x1={x} y1={y} x2={x + side * len} y2={y + len} stroke={MP.faint} strokeWidth="1" />);
  }
  return <g>{lines}</g>;
}

// ── FIG. 00 — system notes card ─────────────────────────────────────────────
function FigNotes() {
  const chips = [
    { c: MP.ink, role: 'STRUCTURE', hex: '#2D3748' },
    { c: MP.accent, role: 'ACTIVE', hex: '#EA580C' },
    { c: MP.dark, role: 'MASS', hex: '#111827' },
    { c: MP.label, role: 'LABELS', hex: '#6B7280' },
    { c: MP.ground, role: 'GROUND', hex: '#F9FAFB', border: true },
  ];
  return (
    <svg viewBox="0 0 560 380" width={560} height={380} style={{ display: 'block' }}>
      <FigHead n="00" title="SYSTEM NOTES" />
      {chips.map((ch, i) => {
        const x = 24 + i * 106;
        return (
          <g key={i}>
            <rect x={x} y={66} width={36} height={36} fill={ch.c} stroke={ch.border ? MP.hair : 'none'} strokeWidth="1" />
            <ML x={x} y={124} size={9.5} color={MP.dark} weight={600}>{ch.role}</ML>
            <ML x={x} y={139} size={9}>{ch.hex}</ML>
          </g>
        );
      })}
      <line x1={24} y1={196} x2={144} y2={196} stroke={MP.hair} strokeWidth="1" />
      <ML x={24} y={216} size={9}>HAIRLINE · 1</ML>
      <line x1={216} y1={196} x2={336} y2={196} stroke={MP.ink} strokeWidth="1.5" />
      <ML x={216} y={216} size={9}>STRUCTURE · 1.5</ML>
      <line x1={408} y1={196} x2={528} y2={196} stroke={MP.accent} strokeWidth="2.5" />
      <ML x={408} y={216} size={9}>ACTIVE · 2.5</ML>
      <ML x={24} y={266} size={10.5} color={MP.dark} weight={600}>JETBRAINS MONO · 11 PX · TRACKING +8% · UPPERCASE</ML>
      <ML x={24} y={286} size={9.5}>LEADERS #9CA3AF · 1 PX + 2 PX DOT AT TARGET</ML>
      <ML x={24} y={330} size={9.5}>MOTION: CSS KEYFRAMES ONLY · LOOPS · HONORS PREFERS-REDUCED-MOTION</ML>
      <ML x={24} y={348} size={9.5}>EVERY FIGURE READS AS A STATIC STILL — MOTION IS AN AID, NOT A REQUIREMENT</ML>
    </svg>
  );
}

Object.assign(window, { MP, ML, Leader, FigHead, FigCaption, ArrowHead, Arrow, sinePath, arcPath, zigzagPath, HatchV, FigNotes });
