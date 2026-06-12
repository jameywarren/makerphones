// MakerPhones illustration system — MOTIFS & ICONS
// Quiet texture drawn from the diagram vocabulary + a small line icon set.

const { MP, ML, sinePath, arcPath } = window;

// ── Motif: waveform strip (section divider) ─────────────────────────────────
function MotifWave({ w = 1200, h = 72, activeStart = 0.42, activeEnd = 0.58 }) {
  const mid = h / 2;
  const composite = (x0, len) => {
    const pts = [];
    for (let x = 0; x <= len; x += 3) {
      const y = mid
        - 10 * Math.sin((2 * Math.PI * x) / 160)
        - 5 * Math.sin((2 * Math.PI * x) / 47 + 1.2);
      pts.push(`${(x0 + x).toFixed(1)} ${y.toFixed(1)}`);
    }
    return 'M ' + pts.join(' L ');
  };
  const ax = w * activeStart, aw = w * (activeEnd - activeStart);
  const clipId = 'mwClip' + Math.round(activeStart * 100);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', width: '100%' }} preserveAspectRatio="none">
      <defs><clipPath id={clipId}><rect x={ax} y={0} width={aw} height={h} /></clipPath></defs>
      <line x1="0" y1={mid} x2={w} y2={mid} stroke={MP.hair} strokeWidth="1" strokeDasharray="2 4" />
      <path d={composite(0, w)} fill="none" stroke={MP.faint} strokeWidth="1.2" />
      <g clipPath={`url(#${clipId})`}>
        <path d={composite(0, w)} fill="none" stroke={MP.accent} strokeWidth="2.2" />
      </g>
      <line x1={ax} y1={h * 0.18} x2={ax} y2={h * 0.82} stroke={MP.hair} strokeWidth="1" />
      <line x1={ax + aw} y1={h * 0.18} x2={ax + aw} y2={h * 0.82} stroke={MP.hair} strokeWidth="1" />
    </svg>
  );
}

// ── Motif: ruler strip (thin divider) ───────────────────────────────────────
function MotifRuler({ w = 1200, h = 28, step = 10 }) {
  const ticks = [];
  for (let x = 0, k = 0; x <= w; x += step, k++) {
    const major = k % 10 === 0, mid = k % 5 === 0;
    ticks.push(<line key={k} x1={x} y1={h} x2={x} y2={h - (major ? 16 : mid ? 10 : 5)}
      stroke={major ? MP.label : MP.hair} strokeWidth="1" />);
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', width: '100%' }} preserveAspectRatio="none">
      <line x1="0" y1={h - 0.5} x2={w} y2={h - 0.5} stroke={MP.label} strokeWidth="1" />
      {ticks}
    </svg>
  );
}

// ── Motif: FR curve backdrop (faint, large) ─────────────────────────────────
function MotifFR({ w = 880, h = 360, accent = true, opacity = 1 }) {
  const x0 = 0, y0 = h - 24, W = w, top = 24;
  const curve = (wob, off) => {
    const pts = [];
    for (let f = 0; f <= 1.0001; f += 0.02) {
      const y = y0 - (h - 60) * (0.52
        + 0.10 * Math.cos(3.0 * f * Math.PI + 0.4) * wob
        + 0.06 * Math.cos(7.5 * f * Math.PI + 1.1) * wob
        - 0.22 * Math.pow(f, 3)) + off;
      pts.push(`${(x0 + f * W).toFixed(1)} ${y.toFixed(1)}`);
    }
    return 'M ' + pts.join(' L ');
  };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', width: '100%', opacity }} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="0" y1={top + (y0 - top) * t} x2={w} y2={top + (y0 - top) * t} stroke={MP.hair} strokeWidth="1" opacity="0.6" />
      ))}
      <line x1="0" y1={y0} x2={w} y2={y0} stroke={MP.hair} strokeWidth="1" />
      <path d={curve(0.55, 0)} fill="none" stroke={MP.faint} strokeWidth="1.2" strokeDasharray="5 4" />
      <path d={curve(1, 6)} fill="none" stroke={accent ? MP.accent : MP.label} strokeWidth="2" />
    </svg>
  );
}

// ── Motif: concentric pressure arcs (corner piece) ──────────────────────────
function MotifArcs({ size = 220, n = 5, corner = 'tl', animated = false }) {
  const flip = {
    tl: '', tr: `scale(-1,1) translate(${-size},0)`,
    bl: `scale(1,-1) translate(0,${-size})`, br: `scale(-1,-1) translate(${-size},${-size})`,
  }[corner];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: 'block' }}>
      <g transform={flip}>
        <circle cx="0" cy="0" r="3" fill={MP.accent} />
        {Array.from({ length: n }).map((_, k) => {
          const r = 34 + k * ((size - 50) / n);
          const orange = k === 1;
          return <path key={k} className={animated ? 'mp-wave-out' : undefined}
            style={animated && k ? { animationDelay: `${-0.6 * k}s` } : null}
            d={arcPath(0, 0, r, 4, 86)} fill="none"
            stroke={orange ? MP.accent : MP.hair} strokeWidth={orange ? 1.8 : 1}
            opacity={1 - k * 0.13} />;
        })}
      </g>
    </svg>
  );
}

// ── Icon set — 24×24, stroke 1.6, round caps ───────────────────────────────
const MP_ICON_PATHS = {
  // six parts
  fundamentals: (s, a) => (
    <g>
      <path d="M 2.5 12 C 5.5 4.5 8.5 4.5 11.5 12 C 14.5 19.5 17.5 19.5 20.5 12" fill="none" stroke={s} />
      <circle cx="2.5" cy="12" r="1.4" fill={a} stroke="none" />
    </g>
  ),
  drivers: (s, a) => (
    <g>
      <rect x="3" y="8" width="6.5" height="8" fill="none" stroke={s} />
      <line x1="9.5" y1="10" x2="13" y2="10" stroke={s} />
      <line x1="9.5" y1="14" x2="13" y2="14" stroke={s} />
      <path d="M 14.5 5.5 A 8.5 8.5 0 0 1 14.5 18.5" fill="none" stroke={a} strokeWidth="2" />
    </g>
  ),
  enclosures: (s, a) => (
    <g>
      <path d="M 9.5 3.5 A 8.6 8.6 0 0 1 9.5 20.5" fill="none" stroke={s} strokeWidth="2" />
      <line x1="9.5" y1="4.5" x2="9.5" y2="19.5" stroke={s} />
      <circle cx="12.5" cy="12" r="1.6" fill={a} stroke="none" />
    </g>
  ),
  materials: (s, a) => (
    <g>
      <line x1="4.5" y1="4.5" x2="10" y2="10" stroke={s} strokeWidth="3.4" />
      <line x1="10" y1="10" x2="18.5" y2="18.5" stroke={s} />
      <circle cx="19.5" cy="19.5" r="1.5" fill={a} stroke="none" />
    </g>
  ),
  build: (s, a) => (
    <g>
      <line x1="12" y1="2.5" x2="12" y2="21.5" stroke={s} strokeDasharray="1.5 3" strokeWidth="1.1" />
      <line x1="6" y1="6.5" x2="18" y2="6.5" stroke={s} />
      <line x1="7.5" y1="12" x2="16.5" y2="12" stroke={a} strokeWidth="2" />
      <line x1="6.5" y1="17.5" x2="17.5" y2="17.5" stroke={s} />
    </g>
  ),
  measure: (s, a) => (
    <g>
      <path d="M 4 4 L 4 20 L 21 20" fill="none" stroke={s} />
      <path d="M 6.5 15.5 C 9.5 13 11 16.5 13.5 14 C 15.5 12 17.5 10.5 20 11.5" fill="none" stroke={a} strokeWidth="2" />
    </g>
  ),
  // wayfinding
  read: (s, a) => (
    <g>
      <path d="M 12 5.5 C 9.5 3.5 5.5 3.5 3.5 5 L 3.5 19.5 C 5.5 18 9.5 18 12 20 C 14.5 18 18.5 18 20.5 19.5 L 20.5 5 C 18.5 3.5 14.5 3.5 12 5.5 Z" fill="none" stroke={s} />
      <line x1="12" y1="5.5" x2="12" y2="20" stroke={s} />
    </g>
  ),
  contents: (s, a) => (
    <g>
      {[6, 12, 18].map((y, i) => (
        <g key={y}>
          <circle cx="4.5" cy={y} r="1.2" fill={i === 0 ? a : s} stroke="none" />
          <line x1="9" y1={y} x2="20.5" y2={y} stroke={s} />
        </g>
      ))}
    </g>
  ),
  arrow: (s, a) => (
    <g>
      <line x1="3.5" y1="12" x2="19.5" y2="12" stroke={s} />
      <path d="M 14 6.5 L 19.8 12 L 14 17.5" fill="none" stroke={s} />
    </g>
  ),
  // content kinds — completing the wayfinding taxonomy
  guide: (s, a) => (
    <g>
      <line x1="4.5" y1="19.5" x2="9.5" y2="14.5" stroke={s} strokeWidth="3.4" />
      <line x1="9.5" y1="14.5" x2="17.5" y2="6.5" stroke={s} />
      <circle cx="18.8" cy="5.2" r="1.5" fill={a} stroke="none" />
    </g>
  ),
  builds: (s, a) => (
    <g>
      <path d="M 5 13 A 7 7 0 0 1 19 13" fill="none" stroke={s} strokeWidth="2" />
      <rect x="3.5" y="12.5" width="4.5" height="7" rx="2" fill="none" stroke={s} />
      <rect x="16" y="12.5" width="4.5" height="7" rx="2" fill="none" stroke={s} />
      <circle cx="18.25" cy="16" r="1.2" fill={a} stroke="none" />
    </g>
  ),
  glossary: (s, a) => (
    <g>
      <path d="M 7 3.5 L 17 3.5 L 17 20.5 L 12 16 L 7 20.5 Z" fill="none" stroke={s} strokeLinejoin="round" />
      <circle cx="12" cy="8.5" r="1.4" fill={a} stroke="none" />
    </g>
  ),
  troubleshoot: (s, a) => (
    <g>
      <path d="M 3 15 L 8 15 L 11 6.5 L 14 18.5 L 16.5 15 L 21 15" fill="none" stroke={s} strokeLinejoin="round" />
      <circle cx="11" cy="6.5" r="2.4" fill="none" stroke={a} strokeWidth="1.6" />
    </g>
  ),
  resources: (s, a) => (
    <g>
      <rect x="4" y="4" width="16" height="16" fill="none" stroke={s} />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke={s} />
      <line x1="12" y1="4" x2="12" y2="7.8" stroke={s} strokeWidth="1.1" />
      <line x1="12" y1="16.2" x2="12" y2="20" stroke={s} strokeWidth="1.1" />
      <circle cx="12" cy="12" r="1.3" fill={a} stroke="none" />
    </g>
  ),
  suppliers: (s, a) => (
    <g>
      <path d="M 3.5 12.5 L 11.5 4.5 L 20.5 4.5 L 20.5 13.5 L 12.5 21.5 Z" fill="none" stroke={s} strokeLinejoin="round" />
      <circle cx="16.5" cy="8.5" r="1.6" fill="none" stroke={a} strokeWidth="1.6" />
    </g>
  ),
};

function MpIcon({ name, size = 24, color, accentColor, strokeWidth = 1.6 }) {
  const s = color || MP.ink;
  const a = accentColor || MP.accent;
  const draw = MP_ICON_PATHS[name];
  if (!draw) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      style={{ display: 'block' }} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {draw(s, a)}
    </svg>
  );
}

// Difficulty: dot + three radiating arcs; `level` of them are active.
function MpDifficulty({ level = 1, size = 22, color, dim }) {
  const c = color || MP.ink;
  const d = dim || MP.hair;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
      <circle cx="5" cy="19" r="1.8" fill={c} />
      {[1, 2, 3].map((k) => (
        <path key={k} d={arcPath(5, 19, 4.5 + k * 4.3, -78, -8)} fill="none"
          stroke={k <= level ? c : d} strokeWidth={k <= level ? 1.8 : 1.2} strokeLinecap="round" />
      ))}
    </svg>
  );
}

Object.assign(window, { MotifWave, MotifRuler, MotifFR, MotifArcs, MpIcon, MpDifficulty });
