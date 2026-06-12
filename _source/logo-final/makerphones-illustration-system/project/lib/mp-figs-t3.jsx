// MakerPhones diagrams — FIG 19–22 (Tier 3 extensions)
// Line dialect · FIG 00 conventions.

const { MP, ML, Leader, FigHead, FigCaption, Arrow, sinePath, arcPath, zigzagPath, lgx, FrFrame, PlugBody, plugCenters, TRRS_SEGS } = window;

// circuit glyphs ─────────────────────────────────────────────────────────────
function Inductor({ x, y, n = 4, r = 9 }) {
  let d = '';
  for (let k = 0; k < n; k++) d += arcPath(x + r + k * 2 * r, y, r, 180, 360).replace('M', k ? 'L' : 'M').replace(/^L ([\d.]+) ([\d.]+) A/, (m, a, b) => `M ${a} ${b} A`);
  return <g>{Array.from({ length: n }).map((_, k) => (
    <path key={k} d={arcPath(x + r + k * 2 * r, y, r, 180, 360)} fill="none" stroke={MP.ink} strokeWidth="1.5" />
  ))}</g>;
}
function Capacitor({ x, y, gap = 8, len = 22 }) {
  return (
    <g>
      <line x1={x} y1={y - len / 2} x2={x} y2={y + len / 2} stroke={MP.ink} strokeWidth="1.8" />
      <line x1={x + gap} y1={y - len / 2} x2={x + gap} y2={y + len / 2} stroke={MP.ink} strokeWidth="1.8" />
    </g>
  );
}
function Resistor({ x, y, w = 54 }) {
  return <path d={zigzagPath(x, x + w, y, 6, 8)} fill="none" stroke={MP.ink} strokeWidth="1.5" />;
}

// ── FIG. 19 — Lumped-element acoustic model ─────────────────────────────────
function FigLumped() {
  const cy = 152;
  const wy = 354; // wire baseline
  return (
    <svg viewBox="0 0 760 500" width={760} height={500} style={{ display: 'block' }}>
      <FigHead n="19" title="ACOUSTIC MODEL — THE CIRCUIT ANALOGY" />

      {/* physical: driver + front cavity + rear cavity + port */}
      <g>
        {/* rear cavity */}
        <rect x={150} y={cy - 60} width={110} height={120} fill={MP.washInkSoft} stroke={MP.ink} strokeWidth="1.5" />
        {/* port */}
        <rect x={150 - 44} y={cy - 12} width={44} height={24} fill="none" stroke={MP.ink} strokeWidth="1.5" />
        {/* driver on the cavity's right wall */}
        <rect x={260} y={cy - 38} width={12} height={76} fill="none" stroke={MP.ink} strokeWidth="1.5" />
        <path d={`M 272 ${cy - 30} A 30 30 0 0 1 272 ${cy + 30}`} fill={MP.washAccent} stroke={MP.accent} strokeWidth="2.5" />
        {/* front cavity (to ear) */}
        <rect x={272} y={cy - 60} width={150} height={120} fill="none" stroke={MP.hair} strokeWidth="1.2" strokeDasharray="4 3" />
        <ML x={447} y={cy + 4} size={8.5}>TO EAR</ML>
        <Arrow x1={426} y1={cy} x2={442} y2={cy} color={MP.faint} width="1" head={5} />

        <ML x={92} y={cy - 76} size={8.5}>PORT — AIR MASS</ML>
        <Leader x1={116} y1={cy - 70} x2={126} y2={cy - 8} />
        <ML x={170} y={cy + 88} size={8.5}>REAR CAVITY — AIR SPRING</ML>
        <Leader x1={206} y1={cy + 80} x2={206} y2={cy + 30} />
        <ML x={300} y={cy - 76} size={8.5}>DIAPHRAGM — MOVING MASS + LOSS</ML>
        <Leader x1={308} y1={cy - 70} x2={290} y2={cy - 22} />
      </g>

      {/* mapping leaders */}
      {[[126, cy + 14, 196, wy - 26], [206, cy + 42, 330, wy - 26], [290, cy + 26, 436, wy - 26]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={MP.faint} strokeWidth="1" strokeDasharray="2 5" />
      ))}

      {/* circuit row */}
      <g>
        {/* source */}
        <circle cx={96} cy={wy} r="17" fill="none" stroke={MP.ink} strokeWidth="1.5" />
        <path d={sinePath(85, wy, 6, 11, 22)} fill="none" stroke={MP.accent} strokeWidth="1.8" />
        <ML x={96} y={wy + 42} size={8} anchor="middle">DRIVE P(t)</ML>
        <line x1={113} y1={wy} x2={160} y2={wy} stroke={MP.ink} strokeWidth="1.5" />
        {/* L1 port air mass */}
        <Inductor x={160} y={wy} n={4} r={9} />
        <ML x={196} y={wy - 24} size={8} anchor="middle" color={MP.dark} weight={600}>L₁</ML>
        <line x1={232} y1={wy} x2={296} y2={wy} stroke={MP.ink} strokeWidth="1.5" />
        {/* C cavity compliance, shunt to ground */}
        <line x1={330} y1={wy} x2={330} y2={wy + 26} stroke={MP.ink} strokeWidth="1.5" />
        <Capacitor x={326} y={wy + 34} gap={8} len={24} />
        <line x1={330} y1={wy + 42} x2={330} y2={wy + 58} stroke={MP.ink} strokeWidth="1.5" />
        <line x1={318} y1={wy + 58} x2={342} y2={wy + 58} stroke={MP.ink} strokeWidth="1.5" />
        <line x1={322} y1={wy + 63} x2={338} y2={wy + 63} stroke={MP.ink} strokeWidth="1.2" />
        <line x1={326} y1={wy + 68} x2={334} y2={wy + 68} stroke={MP.ink} strokeWidth="1" />
        <ML x={352} y={wy + 40} size={8} color={MP.dark} weight={600}>C</ML>
        <line x1={296} y1={wy} x2={364} y2={wy} stroke={MP.ink} strokeWidth="1.5" />
        {/* L2 moving mass */}
        <Inductor x={400} y={wy} n={4} r={9} />
        <ML x={436} y={wy - 24} size={8} anchor="middle" color={MP.dark} weight={600}>L₂</ML>
        <line x1={364} y1={wy} x2={400} y2={wy} stroke={MP.ink} strokeWidth="1.5" />
        <line x1={472} y1={wy} x2={500} y2={wy} stroke={MP.ink} strokeWidth="1.5" />
        {/* R loss */}
        <Resistor x={500} y={wy} w={54} />
        <ML x={527} y={wy - 24} size={8} anchor="middle" color={MP.dark} weight={600}>R</ML>
        <line x1={554} y1={wy} x2={600} y2={wy} stroke={MP.ink} strokeWidth="1.5" />
        <ML x={614} y={wy + 4} size={8.5}>OUT — SPL</ML>
      </g>

      {/* equivalence table */}
      <g>
        <ML x={560} y={120} size={9.5} color={MP.dark} weight={600}>THE DICTIONARY</ML>
        {[['AIR MASS', '↔ L · INDUCTOR'], ['COMPLIANCE', '↔ C · CAPACITOR'], ['LOSS / DAMPING', '↔ R · RESISTOR']].map(([a, b], i) => (
          <g key={a}>
            <ML x={560} y={144 + i * 22} size={8.5}>{a}</ML>
            <ML x={652} y={144 + i * 22} size={8.5} color={MP.accent} weight={600}>{b}</ML>
          </g>
        ))}
      </g>

      <FigCaption x={24} y={478}>SAME MATH AS A CIRCUIT — SOLVE THE NETWORK AND THE RESONANCES FALL OUT BEFORE YOU CUT WOOD.</FigCaption>
    </svg>
  );
}

// ── FIG. 20 — Channel matching & tolerance ──────────────────────────────────
function FigMatching() {
  const base = (f) => {
    const lg = Math.log10(f);
    return 4 / (1 + Math.exp((lg - 2.05) * 7)) + 5 * Math.exp(-Math.pow(lg - 3.45, 2) / (2 * 0.17 * 0.17)) - (lg > 3.8 ? (lg - 3.8) * 7 : 0);
  };
  const Panel = ({ x0, mismatched }) => {
    const W = 280, y0 = 330, yZ = 252, px = 6.5, H = 200;
    const path = (dev) => {
      const pts = [];
      for (let lg = Math.log10(20); lg <= Math.log10(20000) + 1e-9; lg += 0.015) {
        const f = Math.pow(10, lg);
        pts.push(`${lgx(f, x0, W).toFixed(1)} ${(yZ - (base(f) + dev(f, lg)) * px).toFixed(1)}`);
      }
      return 'M ' + pts.join(' L ');
    };
    const band = () => {
      const up = [], dn = [];
      for (let lg = Math.log10(20); lg <= Math.log10(20000) + 1e-9; lg += 0.03) {
        const f = Math.pow(10, lg);
        up.push(`${lgx(f, x0, W).toFixed(1)} ${(yZ - (base(f) + 1.5) * px).toFixed(1)}`);
        dn.unshift(`${lgx(f, x0, W).toFixed(1)} ${(yZ - (base(f) - 1.5) * px).toFixed(1)}`);
      }
      return 'M ' + up.join(' L ') + ' L ' + dn.join(' L ') + ' Z';
    };
    const devL = () => 0;
    const devR = mismatched
      ? (f, lg) => (lg > 3.4 ? Math.pow(lg - 3.4, 1.6) * 7 + 0.4 * Math.sin(lg * 12) : 0.3)
      : (f, lg) => 0.5 * Math.sin(lg * 5);
    return (
      <g>
        <path d={band()} fill={MP.washInkSoft} />
        <path d={path(devL)} fill="none" stroke={MP.ink} strokeWidth="1.8" />
        <path d={path(devR)} fill="none" stroke={MP.accent} strokeWidth="1.8" />
        <line x1={x0} y1={y0} x2={x0 + W} y2={y0} stroke={MP.ink} strokeWidth="1.5" />
        <line x1={x0} y1={y0} x2={x0} y2={y0 - H} stroke={MP.ink} strokeWidth="1.5" />
        {[[20, '20'], [200, '200'], [2000, '2k'], [20000, '20k']].map(([f, lab]) => (
          <g key={f}>
            <line x1={lgx(f, x0, W)} y1={y0} x2={lgx(f, x0, W)} y2={y0 + 5} stroke={MP.faint} strokeWidth="1" />
            <ML x={lgx(f, x0, W)} y={y0 + 19} size={8} anchor="middle">{lab}</ML>
          </g>
        ))}
        <ML x={x0} y={y0 + 42} size={9.5} color={MP.dark} weight={600}>{mismatched ? 'MISMATCHED — REJECT' : 'MATCHED — SHIP IT'}</ML>
        <ML x={x0} y={y0 + 57} size={8}>{mismatched ? 'R LEAVES THE BAND ABOVE 2 kHz — SWAP THE DRIVER' : 'BOTH CHANNELS INSIDE ±1.5 dB, 20 Hz – 20 kHz'}</ML>
        {mismatched && (() => {
          const lgF = Math.log10(9000);
          const fy = yZ - (base(9000) + devR(9000, lgF)) * px;
          const fx = lgx(9000, x0, W);
          return (
            <g>
              <circle cx={fx} cy={fy} r="4" fill="none" stroke={MP.accent} strokeWidth="1.5" />
              <Leader x1={fx - 4} y1={fy - 32} x2={fx - 1} y2={fy - 6} />
              <ML x={fx - 4} y={fy - 38} size={8} anchor="middle">OUT OF BAND</ML>
            </g>
          );
        })()}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 760 470" width={760} height={470} style={{ display: 'block' }}>
      <FigHead n="20" title="CHANNEL MATCHING — L / R INSIDE A TOLERANCE BAND" />
      <Panel x0={70} mismatched={false} />
      <Panel x0={420} mismatched={true} />
      {/* legend */}
      <line x1={70} y1={92} x2={94} y2={92} stroke={MP.ink} strokeWidth="1.8" />
      <ML x={102} y={95} size={8.5}>LEFT</ML>
      <line x1={150} y1={92} x2={174} y2={92} stroke={MP.accent} strokeWidth="1.8" />
      <ML x={182} y={95} size={8.5}>RIGHT</ML>
      <rect x={232} y={85} width={20} height={12} fill={MP.washInkSoft} />
      <ML x={260} y={95} size={8.5}>TOLERANCE — TARGET ±1.5 dB</ML>
      <FigCaption x={24} y={446}>MATCHING IS A SPEC, NOT LUCK — MEASURE EVERY PAIR; TREBLE MISMATCH DRAGS THE IMAGE SIDEWAYS.</FigCaption>
    </svg>
  );
}

// ── FIG. 21 — Reading a measurement (diagnosis) ─────────────────────────────
function FigDiagnosis() {
  const x0 = 90, W = 620, y0 = 380, yZ = 250, px = 6.8, H = 250;
  const healthy = (lg) => 4 / (1 + Math.exp((lg - 2.05) * 7)) + 4.5 * Math.exp(-Math.pow(lg - 3.45, 2) / (2 * 0.17 * 0.17)) - (lg > 3.8 ? (lg - 3.8) * 6 : 0);
  const measured = (lg) => healthy(lg)
    - 9 / (1 + Math.exp((lg - 1.78) * 10))                                  // seal-leak bass loss below ~60
    + 7 * Math.exp(-Math.pow(lg - 3.7, 2) / (2 * 0.045 * 0.045))            // sharp 5k resonance
    + 0.7 * Math.sin(lg * 14);                                              // hash
  const other = (lg) => measured(lg) + (lg > 3.9 ? (lg - 3.9) * 8 : 0);     // channel B diverges >8k
  const path = (fn) => {
    const pts = [];
    for (let lg = Math.log10(20); lg <= Math.log10(20000) + 1e-9; lg += 0.008) {
      pts.push(`${lgx(Math.pow(10, lg), x0, W).toFixed(1)} ${(yZ - fn(lg) * px).toFixed(1)}`);
    }
    return 'M ' + pts.join(' L ');
  };
  const flags = [
    { n: '01', f: 45, dy: -20, lab: 'BASS DOWN, LOW END ONLY', fix: 'SEAL LEAK — RE-SEAT PADS, RETEST', lx: 110, ly: 120 },
    { n: '02', f: 5000, dy: -14, lab: 'SHARP, HIGH-Q PEAK', fix: 'CAVITY RESONANCE — DAMP THE FRONT', lx: 360, ly: 110 },
    { n: '03', f: 13000, dy: -16, lab: 'CHANNELS DIVERGE UP TOP', fix: 'MISMATCH — RESEAT THE DRIVER', lx: 545, ly: 156 },
  ];
  return (
    <svg viewBox="0 0 760 480" width={760} height={480} style={{ display: 'block' }}>
      <FigHead n="21" title="READING A MEASUREMENT — DIAGNOSIS, NOT JUDGMENT" />

      <path d={path(healthy)} fill="none" stroke={MP.faint} strokeWidth="1.2" strokeDasharray="5 4" />
      <path d={path(other)} fill="none" stroke={MP.label} strokeWidth="1.4" opacity="0.85" />
      <path d={path(measured)} fill="none" stroke={MP.accent} strokeWidth="2.2" />
      <FrFrame x0={x0} y0={y0} W={W} H={H} dbTicks={[-10, 0, 10]} pxPerDb={px} yZero={yZ} />

      {flags.map((fl) => {
        const fx = lgx(fl.f, x0, W);
        const fy = yZ - measured(Math.log10(fl.f)) * px + fl.dy * 0; // anchor near curve
        const cyy = yZ - measured(Math.log10(fl.f)) * px;
        return (
          <g key={fl.n}>
            <circle cx={fx} cy={cyy} r="5" fill="none" stroke={MP.accent} strokeWidth="1.5" />
            <ML x={fl.lx} y={fl.ly} size={10} color={MP.accent} weight={700}>{fl.n}</ML>
            <ML x={fl.lx + 26} y={fl.ly} size={9} color={MP.dark} weight={600}>{fl.lab}</ML>
            <ML x={fl.lx + 26} y={fl.ly + 14} size={8}>{fl.fix}</ML>
            <Leader x1={fl.lx + 30} y1={fl.ly + 21} x2={fx} y2={cyy - 7} />
          </g>
        );
      })}

      {/* legend */}
      <line x1={x0} y1={428} x2={x0 + 24} y2={428} stroke={MP.accent} strokeWidth="2.2" />
      <ML x={x0 + 32} y={431} size={8.5}>MEASURED — L</ML>
      <line x1={x0 + 150} y1={428} x2={x0 + 174} y2={428} stroke={MP.label} strokeWidth="1.4" />
      <ML x={x0 + 182} y={431} size={8.5}>MEASURED — R</ML>
      <line x1={x0 + 300} y1={428} x2={x0 + 324} y2={428} stroke={MP.faint} strokeWidth="1.2" strokeDasharray="5 4" />
      <ML x={x0 + 332} y={431} size={8.5}>EXPECTED</ML>

      <FigCaption x={24} y={462}>EVERY WIGGLE HAS A CAUSE AND A FIX — READ WHERE, HOW SHARP, AND ONE CHANNEL OR BOTH.</FigCaption>
    </svg>
  );
}

// ── FIG. 22 — Mic wiring & placement ────────────────────────────────────────
function FigMicWiring() {
  const x = 96;
  const c = plugCenters(x, TRRS_SEGS);
  const row = (cy, std, items, legacy) => (
    <g>
      <ML x={42} y={cy - 30} size={10} color={MP.accent} weight={700}>{std}</ML>
      {legacy && <ML x={42} y={cy - 16} size={7.5}>LEGACY</ML>}
      <PlugBody x={x} cy={cy} segs={TRRS_SEGS} h={34} />
      {items.map(([cxp, lab, hot], i) => (
        <g key={i}>
          <Leader x1={cxp} y1={cy + 46} x2={cxp} y2={cy + 21} />
          <ML x={cxp} y={cy + 60} size={8} anchor="middle" color={hot ? MP.accent : MP.label} weight={hot ? 700 : 500}>{lab}</ML>
        </g>
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 760 480" width={760} height={480} style={{ display: 'block' }}>
      <FigHead n="22" title="MIC WIRING — CTIA VS OMTP · BOOM VS INLINE" />

      {row(120, 'CTIA', [[c[0], 'L'], [c[2], 'R'], [c[4], 'GND'], [c[6], 'MIC', true]])}
      {row(258, 'OMTP', [[c[0], 'L'], [c[2], 'R'], [c[4], 'MIC', true], [c[6], 'GND']], true)}
      {/* swap highlight */}
      <path d={`M ${c[4]} 158 C ${c[4] + 30} 196 ${c[6] - 30} 196 ${c[6]} 232`} fill="none" stroke={MP.accent} strokeWidth="1.2" strokeDasharray="3 3" />
      <path d={`M ${c[6]} 158 C ${c[6] + 26} 200 ${c[4] - 26} 200 ${c[4]} 232`} fill="none" stroke={MP.accent} strokeWidth="1.2" strokeDasharray="3 3" />
      <ML x={c[6] + 60} y={196} size={8.5} color={MP.accent} weight={600}>THE SWAP — MIC ↔ GND</ML>
      <ML x={c[6] + 60} y={210} size={7.5}>WRONG STANDARD = DEAD MIC + FAINT AUDIO</ML>

      {/* placement: boom vs inline */}
      <g>
        <ML x={70} y={372} size={9.5} color={MP.dark} weight={600}>BOOM — AT THE MOUTH</ML>
        <ML x={70} y={386} size={7.5}>CONSISTENT DISTANCE · BEST SNR</ML>
        {/* cup + boom arm + capsule */}
        <rect x={70} y={398} width={34} height={48} rx={12} fill="none" stroke={MP.ink} strokeWidth="1.5" />
        <path d="M 104 438 C 150 452 186 446 212 428" fill="none" stroke={MP.ink} strokeWidth="2" />
        <circle cx={218} cy={425} r="7" fill={MP.ground} stroke={MP.accent} strokeWidth="2" />
        <circle cx={218} cy={425} r="2" fill={MP.accent} />
      </g>
      <g>
        <ML x={430} y={372} size={9.5} color={MP.dark} weight={600}>INLINE — ON THE CABLE</ML>
        <ML x={430} y={386} size={7.5}>CONVENIENT · RUBS, DROOPS, NOISIER</ML>
        <path d="M 430 408 C 470 420 500 444 560 448 C 610 452 650 440 690 444" fill="none" stroke={MP.ink} strokeWidth="1.5" />
        <rect x={544} y={436} width={36} height={16} rx={5} fill={MP.ground} stroke={MP.accent} strokeWidth="1.8" />
        <circle cx={562} cy={444} r="2" fill={MP.accent} />
      </g>

      <FigCaption x={24} y={470}>SAME PLUG AS FIG. 13, ONE SWAPPED CONTACT — CHECK THE STANDARD BEFORE SOLDERING.</FigCaption>
    </svg>
  );
}

Object.assign(window, { FigLumped, FigMatching, FigDiagnosis, FigMicWiring });
