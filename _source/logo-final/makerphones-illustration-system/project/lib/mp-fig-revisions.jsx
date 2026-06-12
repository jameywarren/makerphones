// MakerPhones diagrams — requested revisions to FIG 05 + FIG 06
// FigStandingV2: adds harmonic={1|2}. FigCSDv2: denser ridge (dense={true}).

const { MP, ML, Leader, FigCaption, Arrow, HatchV } = window;

// ── FIG. 05 rev — standing wave, fundamental or second harmonic ─────────────
function FigStandingV2({ harmonic = 2 }) {
  const xL = 158, xR = 562, cy = 232, L = xR - xL, xm = (xL + xR) / 2;
  const A = harmonic === 2 ? 62 : 78;
  const env = (sign) => {
    const pts = [];
    for (let x = xL; x <= xR; x += 4) {
      const y = cy - sign * A * Math.sin((harmonic * Math.PI * (x - xL)) / L);
      pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return 'M ' + pts.join(' L ');
  };
  const origin = { transformOrigin: `${xm}px ${cy}px`, transformBox: 'view-box' };
  return (
    <svg viewBox="0 0 720 430" width={720} height={430} style={{ display: 'block' }}>
      <g>
        <ML x={24} y={34} color={MP.accent} weight={700}>FIG. 05{harmonic === 2 ? 'b' : ''}</ML>
        <ML x={harmonic === 2 ? 112 : 102} y={34} color={MP.dark} weight={600}>
          {harmonic === 2 ? 'STANDING WAVES — SECOND HARMONIC' : 'STANDING WAVES & RESONANCE'}
        </ML>
      </g>

      <rect x="146" y="120" width="12" height="215" fill={MP.dark} />
      <rect x="562" y="120" width="12" height="215" fill={MP.dark} />
      <HatchV x={146} y0={128} y1={318} side={-1} n={7} />
      <HatchV x={574} y0={128} y1={318} side={1} n={7} />

      <line x1={xL} y1={cy} x2={xR} y2={cy} stroke={MP.hair} strokeWidth="1" strokeDasharray="2 4" />

      <Arrow x1={210} y1={128} x2={335} y2={128} color={MP.faint} width="1.2" head={6} />
      <Arrow x1={510} y1={140} x2={385} y2={140} color={MP.faint} width="1.2" head={6} />

      <g className="sw-build" style={origin}>
        <path d={env(1)} fill="none" stroke={MP.faint} strokeWidth="1" strokeDasharray="4 4" />
        <path d={env(-1)} fill="none" stroke={MP.faint} strokeWidth="1" strokeDasharray="4 4" />
        <g className="sw-osc" style={origin}>
          <path d={env(1)} fill="none" stroke={MP.accent} strokeWidth="2.5" />
        </g>
      </g>

      {/* nodes / antinodes */}
      <circle cx={xL} cy={cy} r="3" fill={MP.dark} />
      <circle cx={xR} cy={cy} r="3" fill={MP.dark} />
      <ML x={152} y={358} size={9} anchor="middle">NODE</ML>
      <ML x={568} y={358} size={9} anchor="middle">NODE</ML>

      {harmonic === 2 ? (
        <g>
          <circle cx={xm} cy={cy} r="3" fill={MP.dark} />
          <ML x={xm} y={358} size={9} anchor="middle">NODE — λ = L</ML>
          <Leader x1={xm} y1={346} x2={xm} y2={cy + 8} />
          <ML x={xL + L / 4} y={96} size={9} anchor="middle">ANTINODE</ML>
          <Leader x1={xL + L / 4} y1={104} x2={xL + L / 4} y2={cy - A - 6} />
          <ML x={xL + (3 * L) / 4} y={96} size={9} anchor="middle">ANTINODE</ML>
          <Leader x1={xL + (3 * L) / 4} y1={104} x2={xL + (3 * L) / 4} y2={cy - A - 6} />
        </g>
      ) : (
        <g>
          <ML x={xm} y={96} size={9} anchor="middle">ANTINODE</ML>
          <Leader x1={xm} y1={104} x2={xm} y2={148} />
        </g>
      )}

      {/* dimension L */}
      <line x1={xL} y1={378} x2={xL} y2={390} stroke={MP.faint} strokeWidth="1" />
      <line x1={xR} y1={378} x2={xR} y2={390} stroke={MP.faint} strokeWidth="1" />
      <Arrow x1={345} y1={384} x2={xL + 6} y2={384} color={MP.faint} width="1" head={6} />
      <Arrow x1={375} y1={384} x2={xR - 6} y2={384} color={MP.faint} width="1" head={6} />
      <ML x={xm} y={388} size={10.5} anchor="middle" color={MP.dark} weight={600}>L</ML>

      <FigCaption x={xm} y={418} anchor="middle">
        {harmonic === 2
          ? 'THE NEXT MODE UP — f₂ = c / L · TWICE THE FREQUENCY, WITH A DEAD SPOT AT CENTRE'
          : 'REFLECTIONS REINFORCE AT f₀ ≈ c / 2L (AND MULTIPLES) — AMPLITUDE BUILDS WITH EACH PASS'}
      </FigCaption>
    </svg>
  );
}

// ── FIG. 06 rev — denser waterfall ridge ────────────────────────────────────
function FigCSDv2({ dense = true }) {
  const x0 = 110, W = 520, y0 = 395, H = 125;
  const N = dense ? 14 : 9, dx = dense ? 9 : 13, dy = dense ? 16.5 : 24;
  const decay = dense ? 0.38 : 0.55, ringDecay = dense ? 0.07 : 0.1;
  const base = (f) => 0.42 + 0.16 * Math.cos(3.2 * f + 0.6) + 0.1 * Math.cos(8.5 * f + 1.8);
  const gauss = (f) => Math.exp(-Math.pow(f - 0.62, 2) / (2 * 0.035 * 0.035));
  const lvl = (f, i) => base(f) * Math.exp(-i * decay) + 0.9 * gauss(f) * 0.95 * Math.exp(-i * ringDecay);

  const slices = [];
  for (let i = N - 1; i >= 0; i--) {
    const bx = x0 + i * dx, by = y0 - i * dy;
    const pts = [];
    for (let f = 0; f <= 1.0001; f += 0.01) {
      pts.push(`${(bx + f * W).toFixed(1)} ${(by - H * lvl(f, i)).toFixed(1)}`);
    }
    const d = `M ${bx} ${by} L ` + pts.join(' L ') + ` L ${bx + W} ${by} Z`;
    slices.push(
      <path key={i} d={d} fill={MP.ground} stroke={MP.ink} strokeWidth={i === 0 ? 2 : 1}
        className={i === 0 ? undefined : 'csd-slice'}
        style={i === 0 ? undefined : { animationDelay: `${i * (4.2 / N) - 4.2}s` }}
        opacity={i === 0 ? 1 : 0.92} />
    );
  }

  const ridgePts = [];
  for (let i = 0; i < N; i++) {
    ridgePts.push([x0 + i * dx + 0.62 * W, y0 - i * dy - H * lvl(0.62, i)]);
  }

  return (
    <svg viewBox="0 0 760 470" width={760} height={470} style={{ display: 'block' }}>
      <g>
        <ML x={24} y={34} color={MP.accent} weight={700}>FIG. 06{dense ? 'b' : ''}</ML>
        <ML x={dense ? 112 : 102} y={34} color={MP.dark} weight={600}>
          {dense ? 'ENERGY DECAY — DENSE WATERFALL' : 'ENERGY DECAY OVER TIME — WATERFALL'}
        </ML>
      </g>
      {slices}
      <polyline points={ridgePts.map((p) => p.join(',')).join(' ')} fill="none" stroke={MP.accent} strokeWidth="2" />
      {ridgePts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={dense ? 1.7 : 2.2} fill={MP.accent} />)}

      <line x1={x0} y1={y0} x2={x0 + W} y2={y0} stroke={MP.ink} strokeWidth="1.5" />
      <ML x={x0} y={y0 + 24} size={9}>20 Hz</ML>
      <ML x={x0 + W / 2} y={y0 + 24} size={9.5} anchor="middle">FREQUENCY →</ML>
      <ML x={x0 + W} y={y0 + 24} size={9} anchor="end">20 kHz</ML>
      <Arrow x1={x0 + W + 14} y1={y0 - 6} x2={x0 + W + 14 + (N - 1) * dx} y2={y0 - 6 - (N - 1) * dy} color={MP.faint} width="1.2" head={6} />
      <ML x={0} y={0} size={9} transform={`translate(${x0 + W + 34} ${y0 - 104}) rotate(${dense ? -61.4 : -61.6})`} anchor="middle">TIME (ms)</ML>

      <ML x={446} y={108} size={9.5}>RESONANCE — KEEPS RINGING</ML>
      <Leader x1={520} y1={116} x2={536} y2={140} />
      <ML x={140} y={150} size={9.5}>CLEAN, FAST DECAY</ML>
      <Leader x1={210} y1={158} x2={290} y2={194} />

      <FigCaption x={24} y={452}>
        {dense
          ? 'FINER TIME SLICES — THE RESONANT RIDGE READS AS A CONTINUOUS WALL OF STORED ENERGY'
          : 'EACH SLICE IS THE RESPONSE A FEW MS AFTER THE SIGNAL STOPS — GOOD DAMPING DROPS FAST AT EVERY FREQUENCY'}
      </FigCaption>
    </svg>
  );
}

Object.assign(window, { FigStandingV2, FigCSDv2 });
