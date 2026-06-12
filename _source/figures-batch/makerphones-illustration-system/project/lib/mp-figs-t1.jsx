// MakerPhones diagrams — FIG 09–14 (Tier 1 extensions)
// Line dialect · FIG 00 conventions: uppercase mono +8% tracking, 2px leader
// dots, structure 1.5 / active 2.5 / hairline 1, orange = the active element.

const { MP, ML, Leader, FigHead, FigCaption, Arrow, ArrowHead, sinePath, arcPath, zigzagPath, HatchV } = window;

// log-frequency x position: 20 Hz → 20 kHz over W px (3 decades)
function lgx(f, x0, W) { return x0 + (Math.log10(f / 20) / 3) * W; }

const FR_TICKS = [[20, '20'], [50, '50'], [100, '100'], [200, '200'], [500, '500'],
  [1000, '1k'], [2000, '2k'], [5000, '5k'], [10000, '10k'], [20000, '20k']];

function FrFrame({ x0, y0, W, H, dbTicks, pxPerDb, yZero }) {
  return (
    <g>
      <line x1={x0} y1={y0} x2={x0 + W} y2={y0} stroke={MP.ink} strokeWidth="1.5" />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - H} stroke={MP.ink} strokeWidth="1.5" />
      {FR_TICKS.map(([f, lab]) => {
        const x = lgx(f, x0, W);
        return (
          <g key={f}>
            <line x1={x} y1={y0} x2={x} y2={y0 + 5} stroke={MP.faint} strokeWidth="1" />
            <ML x={x} y={y0 + 20} size={8.5} anchor="middle">{lab}</ML>
          </g>
        );
      })}
      {dbTicks && dbTicks.map((db) => {
        const y = yZero - db * pxPerDb;
        return (
          <g key={db}>
            <line x1={x0 - 5} y1={y} x2={x0} y2={y} stroke={MP.faint} strokeWidth="1" />
            <ML x={x0 - 10} y={y + 3.5} size={8.5} anchor="end">{db > 0 ? `+${db}` : db}</ML>
          </g>
        );
      })}
      <ML x={x0 + W / 2} y={y0 + 38} size={9} anchor="middle">FREQUENCY (Hz) — LOG</ML>
    </g>
  );
}

// ── FIG. 09 — Understanding frequency response ──────────────────────────────
function FigFR() {
  const x0 = 90, W = 620, y0 = 396, yZero = 268, px = 7.5, H = 290;
  const xB = lgx(300, x0, W), xM = lgx(4000, x0, W);
  const target = (f) => {
    const lg = Math.log10(f);
    const shelf = 6 / (1 + Math.exp((lg - 2.05) * 7));            // bass shelf below ~110 Hz
    const presence = 7.5 * Math.exp(-Math.pow(lg - 3.48, 2) / (2 * 0.16 * 0.16)); // ~3 kHz lift
    const tilt = lg > 3.85 ? -(lg - 3.85) * 9 : 0;                // gentle HF roll past 7 kHz
    return shelf + presence + tilt;
  };
  const pts = [];
  for (let lg = Math.log10(20); lg <= Math.log10(20000) + 1e-9; lg += 0.01) {
    const f = Math.pow(10, lg);
    pts.push(`${lgx(f, x0, W).toFixed(1)} ${(yZero - target(f) * px).toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 760 500" width={760} height={500} style={{ display: 'block' }}>
      <FigHead n="09" title="READING A FREQUENCY-RESPONSE CURVE" />

      {/* regions */}
      <rect x={x0} y={y0 - H} width={xB - x0} height={H} fill={MP.washInkSoft} />
      <rect x={xM} y={y0 - H} width={x0 + W - xM} height={H} fill={MP.washInkSoft} />
      <line x1={xB} y1={y0} x2={xB} y2={y0 - H} stroke={MP.hair} strokeWidth="1" strokeDasharray="2 4" />
      <line x1={xM} y1={y0} x2={xM} y2={y0 - H} stroke={MP.hair} strokeWidth="1" strokeDasharray="2 4" />
      <ML x={(x0 + xB) / 2} y={y0 - H + 18} size={9} anchor="middle" color={MP.dark} weight={600}>BASS</ML>
      <ML x={(x0 + xB) / 2} y={y0 - H + 32} size={8}  anchor="middle">20 – 300 Hz</ML>
      <ML x={(xB + xM) / 2} y={y0 - H + 18} size={9} anchor="middle" color={MP.dark} weight={600}>MIDRANGE</ML>
      <ML x={(xB + xM) / 2} y={y0 - H + 32} size={8} anchor="middle">300 Hz – 4 kHz</ML>
      <ML x={(xM + x0 + W) / 2} y={y0 - H + 18} size={9} anchor="middle" color={MP.dark} weight={600}>TREBLE</ML>
      <ML x={(xM + x0 + W) / 2} y={y0 - H + 32} size={8} anchor="middle">4 – 20 kHz</ML>

      {/* flat reference */}
      <line x1={x0} y1={yZero} x2={x0 + W} y2={yZero} stroke={MP.faint} strokeWidth="1.2" strokeDasharray="5 4" />
      {/* target */}
      <path d={'M ' + pts.join(' L ')} fill="none" stroke={MP.accent} strokeWidth="2.5" />

      <FrFrame x0={x0} y0={y0} W={W} H={H} dbTicks={[-10, 0, 10]} pxPerDb={px} yZero={yZero} />
      <ML x={x0 - 52} y={y0 - H + 8} size={9} transform={`rotate(-90 ${x0 - 52} ${y0 - H + 8})`} anchor="end">LEVEL (dB)</ML>

      <ML x={148} y={188} size={9.5}>BASS SHELF — FELT, NOT HEARD</ML>
      <Leader x1={156} y1={194} x2={146} y2={yZero - target(60) * px - 6} />
      <ML x={478} y={150} size={9.5}>PRESENCE LIFT ≈ 3 kHz</ML>
      <Leader x1={486} y1={156} x2={lgx(3000, x0, W)} y2={yZero - target(3000) * px - 6} />
      <ML x={398} y={300} size={9.5}>FLAT (0 dB) — REFERENCE</ML>
      <Leader x1={406} y1={294} x2={430} y2={yZero + 2} />
      <ML x={622} y={236} size={9.5} anchor="end">TARGET — AT-EAR</ML>
      <Leader x1={626} y1={240} x2={lgx(9000, x0, W)} y2={yZero - target(9000) * px - 4} />

      <FigCaption x={24} y={476}>FLAT ≠ NEUTRAL — AT THE EARDRUM, NEUTRAL TAKES A BASS SHELF AND A PRESENCE LIFT. THE TARGET IS THE GOAL.</FigCaption>
    </svg>
  );
}

// ── FIG. 10 — Impedance & sensitivity ───────────────────────────────────────
function FigImpedance() {
  const x0 = 84, W = 430, y0 = 372, H = 240;
  const pxOhm = 2.0; // y = y0 - Z*px
  const Z = (f) => {
    const lg = Math.log10(f);
    return 32 + 58 * Math.exp(-Math.pow(lg - 1.95, 2) / (2 * 0.13 * 0.13))
      + (lg > 3.1 ? (lg - 3.1) * 26 : 0);
  };
  const pts = [];
  for (let lg = Math.log10(20); lg <= Math.log10(20000) + 1e-9; lg += 0.01) {
    const f = Math.pow(10, lg);
    pts.push(`${lgx(f, x0, W).toFixed(1)} ${(y0 - Z(f) * pxOhm).toFixed(1)}`);
  }
  const xPeak = lgx(89, x0, W);
  return (
    <svg viewBox="0 0 760 470" width={760} height={470} style={{ display: 'block' }}>
      <FigHead n="10" title="IMPEDANCE & SENSITIVITY — AMP MATCHING" />

      {/* nominal line */}
      <line x1={x0} y1={y0 - 32 * pxOhm} x2={x0 + W} y2={y0 - 32 * pxOhm} stroke={MP.faint} strokeWidth="1.2" strokeDasharray="5 4" />
      <path d={'M ' + pts.join(' L ')} fill="none" stroke={MP.accent} strokeWidth="2.5" />
      <FrFrame x0={x0} y0={y0} W={W} H={H} dbTicks={null} />
      {[0, 40, 80, 120].map((z) => (
        <g key={z}>
          <line x1={x0 - 5} y1={y0 - z * pxOhm} x2={x0} y2={y0 - z * pxOhm} stroke={MP.faint} strokeWidth="1" />
          <ML x={x0 - 10} y={y0 - z * pxOhm + 3.5} size={8.5} anchor="end">{z}</ML>
        </g>
      ))}
      <ML x={x0 - 48} y={y0 - H + 4} size={9} transform={`rotate(-90 ${x0 - 48} ${y0 - H + 4})`} anchor="end">IMPEDANCE (Ω)</ML>

      <ML x={xPeak + 16} y={y0 - 90 * pxOhm - 14} size={9.5}>f₀ — RESONANCE PEAK</ML>
      <Leader x1={xPeak + 22} y1={y0 - 90 * pxOhm - 8} x2={xPeak + 2} y2={y0 - Z(89) * pxOhm - 4} />
      <ML x={330} y={328} size={9.5}>NOMINAL — 32 Ω (QUOTED AT 1 kHz)</ML>
      <Leader x1={338} y1={322} x2={310} y2={y0 - 32 * pxOhm - 2} />
      <ML x={448} y={188} size={9.5} anchor="end">COIL INDUCTANCE — Z RISES</ML>
      <Leader x1={452} y1={192} x2={500} y2={y0 - Z(14000) * pxOhm + 4} />

      {/* sensitivity / matching panel */}
      <g>
        <rect x={556} y={92} width={180} height={280} fill="none" stroke={MP.hair} strokeWidth="1" />
        <ML x={570} y={118} size={9.5} color={MP.dark} weight={600}>SENSITIVITY</ML>
        <ML x={570} y={140} size={13} color={MP.accent} weight={700}>98 dB / mW</ML>
        <ML x={570} y={156} size={8.5}>AT 1 kHz — LOUDNESS PER mW</ML>
        <line x1={570} y1={176} x2={722} y2={176} stroke={MP.hair} strokeWidth="1" />
        <ML x={570} y={200} size={9.5} color={MP.dark} weight={600}>LOW Z (&lt; 50 Ω)</ML>
        <ML x={570} y={216} size={8.5}>WANTS CURRENT —</ML>
        <ML x={570} y={229} size={8.5}>PHONES & DONGLES OK</ML>
        <line x1={570} y1={249} x2={722} y2={249} stroke={MP.hair} strokeWidth="1" />
        <ML x={570} y={273} size={9.5} color={MP.dark} weight={600}>HIGH Z (&gt; 250 Ω)</ML>
        <ML x={570} y={289} size={8.5}>WANTS VOLTAGE —</ML>
        <ML x={570} y={302} size={8.5}>NEEDS A REAL AMP</ML>
        <line x1={570} y1={322} x2={722} y2={322} stroke={MP.hair} strokeWidth="1" />
        <ML x={570} y={346} size={8.5}>Z SWINGS WITH f — A HIGH-Z</ML>
        <ML x={570} y={359} size={8.5}>SOURCE RESHAPES THE RESPONSE</ML>
      </g>

      <FigCaption x={24} y={446}>IMPEDANCE IS A CURVE, NOT A NUMBER — THE PEAK AND THE HF RISE ARE WHY SOURCES CHANGE THE SOUND.</FigCaption>
    </svg>
  );
}

// ── shared ear glyph (profile, facing left) ────────────────────────────────
function Pinna({ cx, cy, s = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <path d="M 2 -30 C 24 -32 30 -12 26 4 C 23 18 14 28 0 32" fill="none" stroke={MP.ink} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 4 -16 C 16 -16 18 -4 14 6" fill="none" stroke={MP.ink} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="2" y1="-2" x2="-14" y2="-2" stroke={MP.ink} strokeWidth="1.2" strokeDasharray="3 3" />
    </g>
  );
}

// ── FIG. 11 — Ear-pad cross-section ────────────────────────────────────────
function FigPad() {
  const bx = 196, cy = 252;             // baffle right face x, centerline y
  const depth = 122, face = bx + 18 + depth; // pad front face (head side)
  return (
    <svg viewBox="0 0 760 470" width={760} height={470} style={{ display: 'block' }}>
      <FigHead n="11" title="EAR PAD — CROSS-SECTION & FRONT CAVITY" />

      {/* baffle */}
      <rect x={bx} y={104} width={18} height={296} fill={MP.washInk} stroke={MP.ink} strokeWidth="1.5" />
      {/* driver on baffle */}
      <rect x={bx + 18} y={cy - 36} width={12} height={72} fill="none" stroke={MP.ink} strokeWidth="1.5" />
      <path d={`M ${bx + 30} ${cy - 30} A 34 34 0 0 1 ${bx + 30} ${cy + 30}`} fill={MP.washAccent} stroke={MP.accent} strokeWidth="2" />

      {/* pad lobes (sectioned annulus) */}
      {[[-1, 110], [1, 394]].map(([sg, yc0]) => {
        const yc = cy + sg * 110;
        return (
          <g key={sg}>
            <rect x={bx + 18} y={yc - 38} width={depth} height={76} rx={30}
              fill={MP.washInkSoft} stroke={MP.ink} strokeWidth="1.5" />
            <path d={`M ${bx + 40} ${yc - 18} q 14 ${18 * -sg * 0 + 14} 0 28 M ${bx + 72} ${yc - 18} q 14 14 0 28`}
              fill="none" stroke={MP.hair} strokeWidth="1" />
          </g>
        );
      })}

      {/* head side: skin line + pinna */}
      <line x1={face} y1={104} x2={face} y2={400} stroke={MP.hair} strokeWidth="1.2" />
      <HatchV x={face} y0={116} y1={392} side={1} n={9} len={8} />
      <Pinna cx={face - 34} cy={cy} s={1.15} />

      {/* front cavity */}
      <rect x={bx + 30} y={cy - 72} width={face - bx - 30} height={144} fill={MP.washAccent} opacity="0.7" />
      <ML x={face + 26} y={cy + 62} size={9.5} color={MP.accent} weight={600}>FRONT CAVITY</ML>
      <Leader x1={face + 32} y1={cy + 54} x2={face - 38} y2={cy + 44} />

      {/* ghost: shallower pad */}
      <line x1={face - 40} y1={104} x2={face - 40} y2={400} stroke={MP.accent} strokeWidth="1" strokeDasharray="3 5" opacity="0.7" />
      <ML x={face + 26} y={132} size={9.5}>SHALLOWER PAD — SMALLER CAVITY,</ML>
      <ML x={face + 26} y={146} size={9.5}>MORE BASS, CLOSER IMAGE</ML>
      <Leader x1={face + 32} y1={152} x2={face - 38} y2={170} />

      {/* dimensions */}
      <Arrow x1={bx + 60} y1={cy - 24} x2={bx + 60} y2={cy - 68} color={MP.faint} width="1" head={5} />
      <Arrow x1={bx + 60} y1={cy + 24} x2={bx + 60} y2={cy + 68} color={MP.faint} width="1" head={5} />
      <ML x={bx + 74} y={cy + 24} size={8.5} transform={`rotate(-90 ${bx + 74} ${cy + 24})`}>INNER Ø</ML>
      <Arrow x1={bx - 22} y1={cy - 50} x2={bx - 22} y2={104} color={MP.faint} width="1" head={5} />
      <Arrow x1={bx - 22} y1={cy + 50} x2={bx - 22} y2={400} color={MP.faint} width="1" head={5} />
      <ML x={bx - 28} y={cy + 4} size={8.5} anchor="end" transform={`rotate(-90 ${bx - 28} ${cy + 4})`} >OUTER Ø</ML>
      <line x1={bx + 18} y1={84} x2={bx + 18} y2={96} stroke={MP.faint} strokeWidth="1" />
      <line x1={face} y1={84} x2={face} y2={96} stroke={MP.faint} strokeWidth="1" />
      <Arrow x1={(bx + 18 + face) / 2 - 16} y1={90} x2={bx + 24} y2={90} color={MP.faint} width="1" head={5} />
      <Arrow x1={(bx + 18 + face) / 2 + 16} y1={90} x2={face - 6} y2={90} color={MP.faint} width="1" head={5} />
      <ML x={(bx + 18 + face) / 2} y={93} size={8.5} anchor="middle">DEPTH</ML>

      <ML x={56} y={170} size={9.5} anchor="start">BAFFLE</ML>
      <Leader x1={86} y1={176} x2={bx + 8} y2={196} />
      <ML x={56} y={cy + 130} size={9.5}>DRIVER</ML>
      <Leader x1={86} y1={cy + 124} x2={bx + 34} y2={cy + 24} />
      <ML x={face + 26} y={cy - 8} size={9.5}>EAR</ML>
      <Leader x1={face + 32} y1={cy - 14} x2={face - 16} y2={cy - 24} />

      <FigCaption x={24} y={446}>PADS ARE A TUNING PARAMETER — DEPTH SETS FRONT-CAVITY VOLUME; VOLUME SETS THE RESPONSE.</FigCaption>
    </svg>
  );
}

// ── FIG. 12 — Damping placement map ────────────────────────────────────────
function FigDamping() {
  const bx = 430, cy = 250;
  const zones = [
    { n: '01', name: 'REAR CHAMBER', fx: 'ABSORBS THE BACK WAVE — KILLS BOXINESS', lx: 60, ly: 130, tx: 300, ty: 196 },
    { n: '02', name: 'DRIVER FRONT', fx: 'FELT DISC — TAMES TREBLE PEAKS', lx: 545, ly: 130, tx: 472, ty: cy - 14, anchor: 'start' },
    { n: '03', name: 'CUP WALLS', fx: 'MASS + FOAM LINING — STOPS SHELL RING', lx: 60, ly: 390, tx: 252, ty: 330 },
    { n: '04', name: 'BAFFLE', fx: 'SEAL & STIFFEN — STOPS PANEL RING', lx: 545, ly: 390, tx: bx + 9, ty: 330, anchor: 'start' },
  ];
  return (
    <svg viewBox="0 0 760 470" width={760} height={470} style={{ display: 'block' }}>
      <FigHead n="12" title="DAMPING — THE FOUR PLACEMENT ZONES" />

      {/* shell */}
      <path d={`M ${bx} 110 C 240 110 240 390 ${bx} 390`} fill={MP.washInkSoft} stroke={MP.ink} strokeWidth="2" />
      {/* wall lining (zone 03) */}
      <path d={`M ${bx - 10} 124 C 262 126 262 374 ${bx - 10} 376`} fill="none" stroke={MP.label} strokeWidth="1.2" strokeDasharray="4 3" />
      {/* baffle */}
      <rect x={bx} y={104} width={16} height={292} fill={MP.washInk} stroke={MP.ink} strokeWidth="1.5" />
      {/* driver */}
      <rect x={bx - 14} y={cy - 34} width={14} height={68} fill="none" stroke={MP.ink} strokeWidth="1.5" />
      <path d={`M ${bx + 16} ${cy - 26} A 28 28 0 0 1 ${bx + 16} ${cy + 26}`} fill={MP.washAccent} stroke={MP.accent} strokeWidth="2" />
      {/* felt disc (zone 02) */}
      <line x1={bx + 52} y1={cy - 26} x2={bx + 52} y2={cy + 26} stroke={MP.label} strokeWidth="2" strokeDasharray="3 3" />
      {/* pad lobes + ear */}
      {[-1, 1].map((sg) => (
        <rect key={sg} x={bx + 16} y={cy + sg * 110 - 30} width={64} height={60} rx={24}
          fill="none" stroke={MP.ink} strokeWidth="1.5" />
      ))}
      <line x1={bx + 80} y1={110} x2={bx + 80} y2={390} stroke={MP.hair} strokeWidth="1.2" />
      <Pinna cx={bx + 52} cy={cy} s={0.92} />

      {/* back wave */}
      {[26, 46, 66].map((r, i) => (
        <path key={r} className="mp-wave-front" style={i ? { animationDelay: `${-0.87 * i}s` } : null}
          d={arcPath(bx - 16, cy, r, 128, 232)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity={0.7 - i * 0.22} />
      ))}
      <ML x={300} y={cy + 4} size={8.5}>BACK WAVE</ML>

      {/* zone callouts */}
      {zones.map((z) => (
        <g key={z.n}>
          <ML x={z.lx} y={z.ly} size={10} color={MP.accent} weight={700}>{z.n}</ML>
          <ML x={z.lx + 28} y={z.ly} size={9.5} color={MP.dark} weight={600}>{z.name}</ML>
          <ML x={z.lx} y={z.ly + 15} size={8.5}>{z.fx}</ML>
          <Leader x1={z.anchor === 'start' ? z.lx + 4 : z.lx + 30} y1={z.ly + (z.ly < 200 ? 22 : -14)} x2={z.tx} y2={z.ty} />
        </g>
      ))}

      <FigCaption x={24} y={446}>EACH ZONE SOLVES A DIFFERENT PROBLEM — WORK 01 → 04 AND MEASURE AFTER EACH CHANGE.</FigCaption>
    </svg>
  );
}

// ── shared plug section (FIG 13 + FIG 22) ──────────────────────────────────
// segs: [{ w, kind: 'tip'|'contact'|'ins' }...] drawn left→right from x
function PlugBody({ x, cy, segs, h = 40 }) {
  let cx = x;
  const out = [];
  segs.forEach((s, i) => {
    if (s.kind === 'tip') {
      out.push(<path key={i} d={`M ${cx + s.w} ${cy - h / 2} L ${cx + 12} ${cy - h / 2} Q ${cx - 2} ${cy} ${cx + 12} ${cy + h / 2} L ${cx + s.w} ${cy + h / 2} Z`}
        fill={MP.washInk} stroke={MP.ink} strokeWidth="1.5" />);
    } else if (s.kind === 'ins') {
      out.push(<rect key={i} x={cx} y={cy - h / 2} width={s.w} height={h} fill={MP.dark} />);
    } else if (s.kind === 'body') {
      out.push(<rect key={i} x={cx} y={cy - h / 2 - 8} width={s.w} height={h + 16} rx={4} fill="none" stroke={MP.ink} strokeWidth="1.5" />);
    } else {
      out.push(<rect key={i} x={cx} y={cy - h / 2} width={s.w} height={h} fill={MP.washInk} stroke={MP.ink} strokeWidth="1.5" />);
    }
    s.cx = cx + s.w / 2; // record center for leaders
    cx += s.w;
  });
  return <g>{out}</g>;
}

function plugCenters(x, segs) {
  let cx = x; return segs.map((s) => { const c = cx + s.w / 2; cx += s.w; return c; });
}

const TRS_SEGS = [{ w: 46, kind: 'tip' }, { w: 7, kind: 'ins' }, { w: 36, kind: 'contact' }, { w: 7, kind: 'ins' }, { w: 116, kind: 'contact' }, { w: 54, kind: 'body' }];
const TRRS_SEGS = [{ w: 46, kind: 'tip' }, { w: 7, kind: 'ins' }, { w: 32, kind: 'contact' }, { w: 7, kind: 'ins' }, { w: 32, kind: 'contact' }, { w: 7, kind: 'ins' }, { w: 84, kind: 'contact' }, { w: 54, kind: 'body' }];

// ── FIG. 13 — Connector & wiring ────────────────────────────────────────────
function FigConnector() {
  const x = 120;
  const cTRS = plugCenters(x, TRS_SEGS);
  const cTRRS = plugCenters(x, TRRS_SEGS);
  const map = (cy, items) => items.map(([cxp, lab, sub, below], i) => (
    <g key={i}>
      <Leader x1={cxp} y1={below ? cy + 56 - 10 : cy - 64 + 10} x2={cxp} y2={below ? cy + 24 : cy - 24} />
      <ML x={cxp} y={below ? cy + 68 : cy - 72} size={9.5} anchor="middle" color={MP.dark} weight={600}>{lab}</ML>
      <ML x={cxp} y={below ? cy + 81 : cy - 59} size={8.5} anchor="middle">{sub}</ML>
    </g>
  ));
  return (
    <svg viewBox="0 0 760 470" width={760} height={470} style={{ display: 'block' }}>
      <FigHead n="13" title="CONNECTORS — TRS / TRRS WIRING MAP" />

      <ML x={42} y={150} size={10} color={MP.accent} weight={700}>TRS</ML>
      <ML x={42} y={165} size={8.5}>3 CONTACTS</ML>
      <PlugBody x={x} cy={172} segs={TRS_SEGS} />
      {map(172, [[cTRS[0], 'TIP', 'LEFT'], [cTRS[2], 'RING', 'RIGHT'], [cTRS[4], 'SLEEVE', 'GROUND']])}

      <ML x={42} y={330} size={10} color={MP.accent} weight={700}>TRRS</ML>
      <ML x={42} y={345} size={8.5}>4 CONTACTS</ML>
      <PlugBody x={x} cy={352} segs={TRRS_SEGS} />
      {map(352, [[cTRRS[0], 'TIP', 'LEFT'], [cTRRS[2], 'RING 1', 'RIGHT', true], [cTRRS[4], 'RING 2', 'GROUND'], [cTRRS[6], 'SLEEVE', 'MIC (CTIA)', true]])}

      <ML x={560} y={150} size={9.5} color={MP.dark} weight={600}>ALWAYS TRUE</ML>
      <ML x={560} y={168} size={8.5}>TIP = LEFT · METER IT</ML>
      <ML x={560} y={181} size={8.5}>BEFORE YOU CLOSE THE CUP</ML>
      <line x1={560} y1={200} x2={722} y2={200} stroke={MP.hair} strokeWidth="1" />
      <ML x={560} y={222} size={9.5} color={MP.dark} weight={600}>WATCH FOR</ML>
      <ML x={560} y={240} size={8.5}>OMTP (LEGACY) SWAPS</ML>
      <ML x={560} y={253} size={8.5}>GROUND ↔ MIC — SEE FIG. 22</ML>

      <FigCaption x={24} y={446}>TIP IS ALWAYS LEFT — TIN, SOLDER, METER, THEN STRAIN-RELIEVE. A SWAPPED RING REVERSES THE IMAGE.</FigCaption>
    </svg>
  );
}

// ── FIG. 14 — Form-factor comparison ────────────────────────────────────────
function FigFormFactor() {
  const panels = [
    { x: 130, name: 'OVER-EAR', sub: 'CIRCUMAURAL — SEALS AROUND THE PINNA', note: 'LARGEST CAVITY · MOST STABLE SEAL' },
    { x: 380, name: 'ON-EAR', sub: 'SUPRA-AURAL — RESTS ON THE PINNA', note: 'LEAK-PRONE — CLAMP SETS THE BASS' },
    { x: 630, name: 'IN-EAR', sub: 'INTRA-AURAL — SEALS THE CANAL', note: 'TINY CAVITY · SEAL IS EVERYTHING' },
  ];
  const cy = 240;
  return (
    <svg viewBox="0 0 760 470" width={760} height={470} style={{ display: 'block' }}>
      <FigHead n="14" title="FORM FACTORS — HOW EACH ONE COUPLES TO THE EAR" />
      {panels.map((p, i) => (
        <g key={p.name}>
          {/* head skin line + pinna (same in all three) */}
          <line x1={p.x + 26} y1={cy - 110} x2={p.x + 26} y2={cy + 110} stroke={MP.hair} strokeWidth="1.2" />
          <HatchV x={p.x + 26} y0={cy - 100} y1={cy + 100} side={1} n={7} len={7} />
          <Pinna cx={p.x} cy={cy} s={1} />

          {i === 0 && (
            <g>
              <path d={`M ${p.x + 24} ${cy - 78} C ${p.x - 110} ${cy - 78} ${p.x - 110} ${cy + 78} ${p.x + 24} ${cy + 78}`}
                fill="none" stroke={MP.ink} strokeWidth="2" />
              {[-1, 1].map((sg) => (
                <rect key={sg} x={p.x - 6} y={cy + sg * 62 - 12} width={30} height={24} rx={10}
                  fill={MP.washInkSoft} stroke={MP.ink} strokeWidth="1.5" transform={`rotate(${sg * 4} ${p.x + 8} ${cy + sg * 62})`} />
              ))}
              <rect x={p.x - 44} y={cy - 50} width={30} height={100} rx={4} fill={MP.washAccent} opacity="0.85" />
            </g>
          )}
          {i === 1 && (
            <g>
              <path d={`M ${p.x - 4} ${cy - 52} C ${p.x - 88} ${cy - 52} ${p.x - 88} ${cy + 52} ${p.x - 4} ${cy + 52}`}
                fill="none" stroke={MP.ink} strokeWidth="2" />
              <rect x={p.x - 18} y={cy - 44} width={22} height={88} rx={11} fill={MP.washInkSoft} stroke={MP.ink} strokeWidth="1.5" />
              <rect x={p.x - 2} y={cy - 30} width={14} height={60} rx={4} fill={MP.washAccent} opacity="0.85" />
            </g>
          )}
          {i === 2 && (
            <g>
              <path d={`M ${p.x - 36} ${cy - 18} C ${p.x - 58} ${cy - 24} ${p.x - 58} ${cy + 24} ${p.x - 36} ${cy + 18} Z`}
                fill={MP.washInkSoft} stroke={MP.ink} strokeWidth="1.5" />
              <rect x={p.x - 36} y={cy - 9} width={26} height={18} rx={4} fill="none" stroke={MP.ink} strokeWidth="1.5" />
              {/* tip flange sealing canal entry */}
              <path d={`M ${p.x - 12} ${cy - 13} Q ${p.x + 4} ${cy - 13} ${p.x + 6} ${cy - 4} L ${p.x + 6} ${cy + 4} Q ${p.x + 4} ${cy + 13} ${p.x - 12} ${cy + 13}`}
                fill={MP.washInkSoft} stroke={MP.ink} strokeWidth="1.2" />
              <rect x={p.x + 6} y={cy - 4} width={18} height={8} fill={MP.washAccent} />
            </g>
          )}

          <ML x={p.x - 20} y={cy + 150} size={10} anchor="middle" color={MP.dark} weight={600}>{p.name}</ML>
          <ML x={p.x - 20} y={cy + 166} size={8} anchor="middle">{p.sub}</ML>
          <ML x={p.x - 20} y={cy + 184} size={8} anchor="middle" color={MP.accent} weight={600}>{p.note}</ML>
        </g>
      ))}
      {/* shared legend for the accent wash */}
      <rect x={24} y={88} width={12} height={12} fill={MP.washAccent} />
      <ML x={44} y={98} size={8.5}>COUPLING VOLUME — THE AIR THE DRIVER ACTUALLY SEES</ML>

      <FigCaption x={24} y={446}>SAME DRIVER, THREE INSTRUMENTS — THE COUPLING VOLUME, AND HOW IT SEALS, IS THE FORM FACTOR.</FigCaption>
    </svg>
  );
}

Object.assign(window, { FigFR, FigImpedance, FigPad, FigDamping, FigConnector, FigFormFactor, Pinna, PlugBody, plugCenters, lgx, FrFrame, TRRS_SEGS });
