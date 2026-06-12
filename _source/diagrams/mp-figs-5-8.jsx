// MakerPhones diagrams — FIG 05–08
const { MP, ML, Leader, FigHead, FigCaption, Arrow, ArrowHead, sinePath, arcPath, HatchV } = window;

// ── FIG. 05 — Standing waves & resonance (animated) ─────────────────────────
function FigStanding() {
  const xL = 158, xR = 562, cy = 232, A = 78, L = xR - xL, xm = (xL + xR) / 2;
  const env = (sign) => {
    const pts = [];
    for (let x = xL; x <= xR; x += 4) {
      const y = cy - sign * A * Math.sin((Math.PI * (x - xL)) / L);
      pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return 'M ' + pts.join(' L ');
  };
  const origin = { transformOrigin: `${xm}px ${cy}px`, transformBox: 'view-box' };
  return (
    <svg viewBox="0 0 720 430" width={720} height={430} style={{ display: 'block' }}>
      <FigHead n="05" title="STANDING WAVES & RESONANCE" />

      {/* rigid walls + hatching */}
      <rect x="146" y="120" width="12" height="215" fill={MP.dark} />
      <rect x="562" y="120" width="12" height="215" fill={MP.dark} />
      <HatchV x={146} y0={128} y1={318} side={-1} n={7} />
      <HatchV x={574} y0={128} y1={318} side={1} n={7} />

      <line x1={xL} y1={cy} x2={xR} y2={cy} stroke={MP.hair} strokeWidth="1" strokeDasharray="2 4" />

      {/* reflections */}
      <Arrow x1={210} y1={128} x2={335} y2={128} color={MP.faint} width="1.2" head={6} />
      <Arrow x1={510} y1={140} x2={385} y2={140} color={MP.faint} width="1.2" head={6} />

      {/* standing wave: builds up, oscillates between mirror states */}
      <g className="sw-build" style={origin}>
        <path d={env(1)} fill="none" stroke={MP.faint} strokeWidth="1" strokeDasharray="4 4" />
        <path d={env(-1)} fill="none" stroke={MP.faint} strokeWidth="1" strokeDasharray="4 4" />
        <g className="sw-osc" style={origin}>
          <path d={env(1)} fill="none" stroke={MP.accent} strokeWidth="2.5" />
        </g>
      </g>

      {/* nodes / antinode */}
      <circle cx={xL} cy={cy} r="3" fill={MP.dark} />
      <circle cx={xR} cy={cy} r="3" fill={MP.dark} />
      <ML x={152} y={358} size={9} anchor="middle">NODE</ML>
      <ML x={568} y={358} size={9} anchor="middle">NODE</ML>
      <ML x={xm} y={96} size={9} anchor="middle">ANTINODE</ML>
      <Leader x1={xm} y1={104} x2={xm} y2={148} />

      {/* dimension L */}
      <line x1={xL} y1={378} x2={xL} y2={390} stroke={MP.faint} strokeWidth="1" />
      <line x1={xR} y1={378} x2={xR} y2={390} stroke={MP.faint} strokeWidth="1" />
      <Arrow x1={345} y1={384} x2={xL + 6} y2={384} color={MP.faint} width="1" head={6} />
      <Arrow x1={375} y1={384} x2={xR - 6} y2={384} color={MP.faint} width="1" head={6} />
      <ML x={xm} y={388} size={10.5} anchor="middle" color={MP.dark} weight={600}>L</ML>

      <FigCaption x={xm} y={418} anchor="middle">REFLECTIONS REINFORCE AT f₀ ≈ c / 2L (AND MULTIPLES) — AMPLITUDE BUILDS WITH EACH PASS</FigCaption>
    </svg>
  );
}

// ── FIG. 06 — Energy decay over time / CSD waterfall (animated) ─────────────
function FigCSD() {
  const x0 = 110, W = 520, y0 = 395, H = 125, dx = 13, dy = 24, N = 9;
  const base = (f) => 0.42 + 0.16 * Math.cos(3.2 * f + 0.6) + 0.1 * Math.cos(8.5 * f + 1.8);
  const gauss = (f) => Math.exp(-Math.pow(f - 0.62, 2) / (2 * 0.035 * 0.035));
  const lvl = (f, i) => base(f) * Math.exp(-i * 0.55) + 0.9 * gauss(f) * 0.95 * Math.exp(-i * 0.1);

  const slices = [];
  for (let i = N - 1; i >= 0; i--) {
    const bx = x0 + i * dx, by = y0 - i * dy;
    const pts = [];
    for (let f = 0; f <= 1.0001; f += 0.01) {
      pts.push(`${(bx + f * W).toFixed(1)} ${(by - H * lvl(f, i)).toFixed(1)}`);
    }
    const d = `M ${bx} ${by} L ` + pts.join(' L ') + ` L ${bx + W} ${by} Z`;
    slices.push(
      <path key={i} d={d} fill={MP.ground} stroke={MP.ink} strokeWidth={i === 0 ? 2 : 1.1}
        className={i === 0 ? undefined : 'csd-slice'}
        style={i === 0 ? undefined : { animationDelay: `${i * 0.32 - 4.2}s` }}
        opacity={i === 0 ? 1 : 0.9} />
    );
  }

  const ridgePts = [];
  for (let i = 0; i < N; i++) {
    ridgePts.push([x0 + i * dx + 0.62 * W, y0 - i * dy - H * lvl(0.62, i)]);
  }

  return (
    <svg viewBox="0 0 760 470" width={760} height={470} style={{ display: 'block' }}>
      <FigHead n="06" title="ENERGY DECAY OVER TIME — WATERFALL" />
      {slices}
      <polyline points={ridgePts.map((p) => p.join(',')).join(' ')} fill="none" stroke={MP.accent} strokeWidth="2" />
      {ridgePts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.2" fill={MP.accent} />)}

      {/* axes */}
      <line x1={x0} y1={y0} x2={x0 + W} y2={y0} stroke={MP.ink} strokeWidth="1.5" />
      <ML x={x0} y={y0 + 24} size={9}>20 Hz</ML>
      <ML x={x0 + W / 2} y={y0 + 24} size={9.5} anchor="middle">FREQUENCY →</ML>
      <ML x={x0 + W} y={y0 + 24} size={9} anchor="end">20 kHz</ML>
      <Arrow x1={x0 + W + 14} y1={y0 - 6} x2={x0 + W + 14 + (N - 1) * dx} y2={y0 - 6 - (N - 1) * dy} color={MP.faint} width="1.2" head={6} />
      <ML x={0} y={0} size={9} transform={`translate(${x0 + W + 34} ${y0 - 104}) rotate(-61.6)`} anchor="middle">TIME (ms)</ML>

      {/* callouts */}
      <ML x={446} y={118} size={9.5}>RESONANCE — KEEPS RINGING</ML>
      <Leader x1={520} y1={126} x2={536} y2={148} />
      <ML x={140} y={150} size={9.5}>CLEAN, FAST DECAY</ML>
      <Leader x1={210} y1={158} x2={290} y2={194} />

      <FigCaption x={24} y={452}>EACH SLICE IS THE RESPONSE A FEW MS AFTER THE SIGNAL STOPS — GOOD DAMPING DROPS FAST AT EVERY FREQUENCY</FigCaption>
    </svg>
  );
}

// ── FIG. 07 — Measurement chain & tuning loop (static) ──────────────────────
function FigChain() {
  const lc = { x: 440, y: 318, r: 46 };
  const tip = (a) => [lc.x + lc.r * Math.cos((a * Math.PI) / 180), lc.y + lc.r * Math.sin((a * Math.PI) / 180)];
  const [t1x, t1y] = tip(110), [t2x, t2y] = tip(290);
  return (
    <svg viewBox="0 0 880 420" width={880} height={420} style={{ display: 'block' }}>
      <FigHead n="07" title="MEASUREMENT CHAIN & TUNING LOOP" />
      <ML x={50} y={64} size={9.5}>SIGNAL PATH</ML>

      {/* boxes */}
      <rect x="50" y="80" width="130" height="96" rx="3" fill="none" stroke={MP.ink} strokeWidth="1.5" />
      <rect x="235" y="80" width="110" height="96" rx="3" fill="none" stroke={MP.ink} strokeWidth="1.5" />
      <rect x="400" y="80" width="200" height="96" rx="3" fill="none" stroke={MP.ink} strokeWidth="1.5" />
      <rect x="665" y="80" width="170" height="96" rx="3" fill="none" stroke={MP.ink} strokeWidth="1.5" />

      {/* glyphs */}
      <path d={sinePath(75, 128, 13, 32, 80)} fill="none" stroke={MP.ink} strokeWidth="1.5" />
      <polygon points="266,104 266,152 316,128" fill="rgba(45,55,72,0.06)" stroke={MP.ink} strokeWidth="1.5" />
      {/* headphone cup on coupler plate, mic below */}
      <path d="M 470 138 Q 468 96 500 94 Q 532 96 530 138" fill="none" stroke={MP.ink} strokeWidth="2" />
      <line x1="474" y1="132" x2="526" y2="132" stroke={MP.hair} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="455" y1="138" x2="545" y2="138" stroke={MP.ink} strokeWidth="2.5" />
      <rect x="494" y="140" width="12" height="18" fill={MP.dark} />
      <ML x={556} y={162} size={8.5}>MIC</ML>
      <Leader x1={552} y1={158} x2={508} y2={152} />
      {/* mini FR screen */}
      <line x1="685" y1="112" x2="815" y2="112" stroke={MP.hair} strokeWidth="0.75" />
      <line x1="685" y1="136" x2="815" y2="136" stroke={MP.hair} strokeWidth="0.75" />
      <path d="M 685 134 C 705 120 725 118 748 122 C 772 126 792 112 815 124" fill="none" stroke={MP.accent} strokeWidth="1.8" />

      {/* names */}
      <ML x={115} y={198} size={10} anchor="middle" color={MP.dark} weight={600}>SOURCE / DAC</ML>
      <ML x={115} y={214} size={8.5} anchor="middle">SINE SWEEP</ML>
      <ML x={290} y={198} size={10} anchor="middle" color={MP.dark} weight={600}>AMPLIFIER</ML>
      <ML x={290} y={214} size={8.5} anchor="middle">CLEAN GAIN</ML>
      <ML x={500} y={198} size={10} anchor="middle" color={MP.dark} weight={600}>HEADPHONE ON COUPLER</ML>
      <ML x={750} y={198} size={10} anchor="middle" color={MP.dark} weight={600}>COMPUTER — FR / CSD</ML>

      {/* flow */}
      <Arrow x1={180} y1={128} x2={233} y2={128} color={MP.ink} width="1.5" />
      <Arrow x1={345} y1={128} x2={398} y2={128} color={MP.ink} width="1.5" />
      <Arrow x1={600} y1={128} x2={663} y2={128} color={MP.ink} width="1.5" />

      {/* tuning loop */}
      <line x1="50" y1="234" x2="830" y2="234" stroke="#e5e7eb" strokeWidth="1" />
      <ML x={50} y={262} size={9.5}>TUNING LOOP</ML>
      <path d={arcPath(lc.x, lc.y, lc.r, -50, 110)} fill="none" stroke={MP.accent} strokeWidth="2" />
      <ArrowHead x={t1x} y={t1y} angle={110 + 90} color={MP.accent} size={7} />
      <path d={arcPath(lc.x, lc.y, lc.r, 130, 290)} fill="none" stroke={MP.accent} strokeWidth="2" />
      <ArrowHead x={t2x} y={t2y} angle={290 + 90} color={MP.accent} size={7} />
      <ML x={lc.x} y={lc.y - lc.r - 14} size={10.5} anchor="middle" color={MP.dark} weight={600}>MEASURE</ML>
      <ML x={lc.x} y={lc.y + lc.r + 24} size={10.5} anchor="middle" color={MP.dark} weight={600}>CHANGE ONE THING</ML>
      <ML x={560} y={314} size={9.5}>ONE VARIABLE PER PASS —</ML>
      <ML x={560} y={330} size={9.5}>MEASURE AGAIN, COMPARE CURVES</ML>
    </svg>
  );
}

// ── FIG. 08 — Driver technologies at a glance (static) ──────────────────────
function MpTechPanel({ cx, name, desc, children }) {
  return (
    <g>
      {children}
      <ML x={cx} y={368} size={10.5} anchor="middle" color={MP.dark} weight={600}>{name}</ML>
      <ML x={cx} y={390} size={9} anchor="middle">{desc}</ML>
    </g>
  );
}

function FigTech() {
  const cxs = [138, 390, 642, 894];
  const lightFill = 'rgba(45,55,72,0.1)';
  const c0 = cxs[0], c1 = cxs[1], c2 = cxs[2], c3 = cxs[3];
  return (
    <svg viewBox="0 0 1040 430" width={1040} height={430} style={{ display: 'block' }}>
      <FigHead n="08" title="DRIVER TECHNOLOGIES AT A GLANCE" />
      {[264, 516, 768].map((x) => <line key={x} x1={x} y1={80} x2={x} y2={340} stroke="#e5e7eb" strokeWidth="1" />)}

      {/* DYNAMIC */}
      <MpTechPanel cx={c0} name="DYNAMIC" desc="COIL-DRIVEN RIGID PISTON">
        <rect x={c0 - 42} y={282} width="84" height="34" fill={MP.dark} />
        <rect x={c0 - 42} y={272} width="26" height="10" fill={lightFill} stroke={MP.ink} strokeWidth="1.2" />
        <rect x={c0 + 16} y={272} width="26" height="10" fill={lightFill} stroke={MP.ink} strokeWidth="1.2" />
        <rect x={c0 - 15} y={254} width="7" height="26" fill={MP.ink} />
        <rect x={c0 + 8} y={254} width="7" height="26" fill={MP.ink} />
        <line x1={c0 - 42} y1={272} x2={c0 - 66} y2={222} stroke={MP.ink} strokeWidth="1.5" />
        <line x1={c0 + 42} y1={272} x2={c0 + 66} y2={222} stroke={MP.ink} strokeWidth="1.5" />
        <line x1={c0 - 12} y1={256} x2={c0 - 58} y2={218} stroke={MP.accent} strokeWidth="2" />
        <line x1={c0 + 12} y1={256} x2={c0 + 58} y2={218} stroke={MP.accent} strokeWidth="2" />
        <path d={`M ${c0 - 12} 256 A 14 14 0 0 0 ${c0 + 12} 256`} fill="none" stroke={MP.accent} strokeWidth="2" />
        <Arrow x1={c0} y1={200} x2={c0} y2={158} color={MP.accent} width="1.5" both head={6} />
      </MpTechPanel>

      {/* PLANAR MAGNETIC */}
      <MpTechPanel cx={c1} name="PLANAR MAGNETIC" desc="WHOLE FILM DRIVEN BY MAGNET ARRAY">
        {[-44, 0, 44].map((o) => <rect key={'t' + o} x={c1 + o - 12} y={200} width="24" height="14" fill={MP.dark} />)}
        {[-44, 0, 44].map((o) => <rect key={'b' + o} x={c1 + o - 12} y={258} width="24" height="14" fill={MP.dark} />)}
        <line x1={c1 - 66} y1={236} x2={c1 + 66} y2={236} stroke={MP.accent} strokeWidth="2.5" />
        {[-50, -30, -10, 10, 30, 50].map((o) => <circle key={o} cx={c1 + o} cy={236} r="2.4" fill={MP.dark} />)}
        <Arrow x1={c1} y1={192} x2={c1} y2={152} color={MP.accent} width="1.5" both head={6} />
      </MpTechPanel>

      {/* BALANCED ARMATURE */}
      <MpTechPanel cx={c2} name="BALANCED ARMATURE" desc="REED PIVOTS IN COIL — PIN DRIVES FILM">
        <rect x={c2 - 78} y={168} width="156" height="140" rx="3" fill="none" stroke={MP.ink} strokeWidth="1.5" />
        <rect x={c2 - 12} y={152} width="24" height="16" fill={lightFill} stroke={MP.ink} strokeWidth="1.2" />
        <Arrow x1={c2} y1={146} x2={c2} y2={118} color={MP.accent} width="1.5" head={6} />
        <line x1={c2 - 70} y1={200} x2={c2 + 70} y2={200} stroke={MP.accent} strokeWidth="2" />
        <line x1={c2 + 44} y1={200} x2={c2 + 44} y2={252} stroke={MP.ink} strokeWidth="1.5" />
        <rect x={c2 - 70} y={244} width="8" height="16" fill={MP.dark} />
        <line x1={c2 - 62} y1={252} x2={c2 + 44} y2={252} stroke={MP.ink} strokeWidth="2.5" />
        <rect x={c2 - 40} y={238} width="36" height="28" fill="rgba(45,55,72,0.06)" stroke={MP.ink} strokeWidth="1.2" />
        <rect x={c2 + 4} y={234} width="32" height="12" fill={MP.dark} />
        <rect x={c2 + 4} y={258} width="32" height="12" fill={MP.dark} />
        <Arrow x1={c2 + 58} y1={240} x2={c2 + 58} y2={264} color={MP.accent} width="1.2" both head={5} />
      </MpTechPanel>

      {/* ELECTROSTATIC */}
      <MpTechPanel cx={c3} name="ELECTROSTATIC" desc="CHARGED FILM BETWEEN PERFORATED STATORS">
        <line x1={c3 - 66} y1={206} x2={c3 + 66} y2={206} stroke={MP.ink} strokeWidth="5" strokeDasharray="9 7" />
        <line x1={c3 - 66} y1={266} x2={c3 + 66} y2={266} stroke={MP.ink} strokeWidth="5" strokeDasharray="9 7" />
        <line x1={c3 - 66} y1={236} x2={c3 + 66} y2={236} stroke={MP.accent} strokeWidth="2" />
        <ML x={c3 - 84} y={210} size={10} anchor="middle">−</ML>
        <ML x={c3 - 84} y={270} size={10} anchor="middle">+</ML>
        <ML x={c3 + 84} y={240} size={8} anchor="middle">BIAS</ML>
        <Arrow x1={c3} y1={224} x2={c3} y2={248} color={MP.accent} width="1.2" both head={5} />
        <Arrow x1={c3 + 30} y1={196} x2={c3 + 30} y2={170} color={MP.faint} width="1" head={5} />
      </MpTechPanel>
    </svg>
  );
}

Object.assign(window, { FigStanding, FigCSD, FigChain, FigTech });
