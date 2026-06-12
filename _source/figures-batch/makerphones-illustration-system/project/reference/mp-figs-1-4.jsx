// MakerPhones diagrams — FIG 01–04
const { MP, ML, Leader, FigHead, FigCaption, Arrow, ArrowHead, sinePath, arcPath, zigzagPath } = window;

// ── FIG. 01 — Dynamic driver cross-section (animated) ──────────────────────
function FigDriver() {
  const cy = 240;
  const lightFill = 'rgba(45,55,72,0.08)';
  return (
    <svg viewBox="0 0 720 440" width={720} height={440} style={{ display: 'block' }}>
      <FigHead n="01" title="DYNAMIC DRIVER — CROSS-SECTION" />

      {/* motor: back plate, pole piece, magnets, front plates */}
      <rect x="140" y="140" width="18" height="200" fill={lightFill} stroke={MP.ink} strokeWidth="1.5" />
      <rect x="158" y="212" width="80" height="56" fill={lightFill} stroke={MP.ink} strokeWidth="1.5" />
      <rect x="158" y="140" width="56" height="48" fill={MP.dark} />
      <rect x="158" y="292" width="56" height="48" fill={MP.dark} />
      <rect x="214" y="140" width="24" height="48" fill={lightFill} stroke={MP.ink} strokeWidth="1.5" />
      <rect x="214" y="292" width="24" height="48" fill={lightFill} stroke={MP.ink} strokeWidth="1.5" />

      {/* basket */}
      <line x1="238" y1="150" x2="322" y2="108" stroke={MP.ink} strokeWidth="2" />
      <line x1="238" y1="330" x2="322" y2="372" stroke={MP.ink} strokeWidth="2" />
      <circle cx="322" cy="108" r="2.5" fill={MP.ink} />
      <circle cx="322" cy="372" r="2.5" fill={MP.ink} />

      {/* surround (flexes; drawn at rest) */}
      <path d="M 322 108 Q 338 120 320 132" fill="none" stroke={MP.ink} strokeWidth="1.5" />
      <path d="M 322 372 Q 338 360 320 348" fill="none" stroke={MP.ink} strokeWidth="1.5" />

      {/* moving assembly: coil + former + diaphragm */}
      <g className="mp-osc">
        <rect x="222" y="190" width="12" height="22" fill={MP.ink} />
        <rect x="222" y="268" width="12" height="22" fill={MP.ink} />
        <line x1="234" y1="196" x2="258" y2="196" stroke={MP.ink} strokeWidth="1.5" />
        <line x1="234" y1="284" x2="258" y2="284" stroke={MP.ink} strokeWidth="1.5" />
        <path d="M 258 196 Q 286 172 320 132" fill="none" stroke={MP.accent} strokeWidth="2.5" />
        <path d="M 258 284 Q 286 308 320 348" fill="none" stroke={MP.accent} strokeWidth="2.5" />
        <path d="M 258 196 A 46 46 0 0 1 258 284" fill="rgba(234,88,12,0.06)" stroke={MP.accent} strokeWidth="2.5" />
      </g>

      {/* excursion arrow */}
      <Arrow x1="300" y1={cy} x2="336" y2={cy} color={MP.accent} width="1.5" both head={6} />

      {/* radiating pressure waves */}
      <path className="mp-wave-out" d={arcPath(348, cy, 30, -52, 52)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity="0.85" />
      <path className="mp-wave-out" style={{ animationDelay: '-0.8s' }} d={arcPath(348, cy, 58, -52, 52)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity="0.55" />
      <path className="mp-wave-out" style={{ animationDelay: '-1.6s' }} d={arcPath(348, cy, 86, -52, 52)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity="0.3" />

      {/* labels */}
      <ML x={360} y={84}>BASKET</ML>
      <Leader x1={356} y1={88} x2={292} y2={123} />
      <ML x={420} y={128}>DIAPHRAGM</ML>
      <Leader x1={414} y1={124} x2={307} y2={146} />
      <ML x={62} y={168}>MAGNET</ML>
      <Leader x1={120} y1={164} x2={160} y2={162} />
      <ML x={40} y={246}>MAGNET GAP</ML>
      <Leader x1={114} y1={250} x2={218} y2={276} />
      <ML x={300} y={400}>VOICE COIL</ML>
      <Leader x1={296} y1={396} x2={231} y2={293} />
      <ML x={468} y={328}>PRESSURE WAVES</ML>
      <Leader x1={462} y1={324} x2={412} y2={304} />

      <FigCaption x={24} y={430}>ALTERNATING COIL CURRENT FORCES THE DIAPHRAGM IN AND OUT — AIR BECOMES SOUND</FigCaption>
    </svg>
  );
}

// ── FIG. 02 — Phase & cancellation (animated) ───────────────────────────────
function FigPhase() {
  const wl = 75, amp = 20, W = 300;
  const yA = 125, yB = 200, ySum = 315;
  const panels = [
    { x: 70, clip: 'mpClipPhL', title: 'IN PHASE — 0°', phaseB: 0, bLabel: 'WAVE B', note: 'PEAKS ALIGN — PRESSURES ADD (+6 dB)' },
    { x: 420, clip: 'mpClipPhR', title: 'OUT OF PHASE — 180°', phaseB: Math.PI, bLabel: 'WAVE B — INVERTED', note: 'PEAK MEETS TROUGH — PRESSURES CANCEL' },
  ];
  return (
    <svg viewBox="0 0 760 420" width={760} height={420} style={{ display: 'block' }}>
      <defs>
        {panels.map((p) => (
          <clipPath id={p.clip} key={p.clip}><rect x={p.x} y={88} width={W} height={272} /></clipPath>
        ))}
      </defs>
      <FigHead n="02" title="PHASE & CANCELLATION" />
      {panels.map((p, i) => (
        <g key={i}>
          <ML x={p.x} y={74} color={MP.dark} weight={600} size={12}>{p.title}</ML>
          {/* row centerlines */}
          {[yA, yB, ySum].map((y, k) => (
            <line key={k} x1={p.x} y1={y} x2={p.x + W} y2={y} stroke={MP.hair} strokeWidth="1" strokeDasharray="2 4" />
          ))}
          <ML x={p.x} y={yA - 30} size={9}>WAVE A</ML>
          <ML x={p.x} y={yB - 30} size={9}>{p.bLabel}</ML>
          <ML x={p.x} y={ySum - 54} size={9}>SUM A + B</ML>
          <line x1={p.x} y1={246} x2={p.x + W} y2={246} stroke={MP.hair} strokeWidth="1" />
          <g clipPath={`url(#${p.clip})`}>
            <path className="mp-scroll" d={sinePath(p.x - wl, yA, amp, wl, W + 2 * wl, 0)} fill="none" stroke={MP.label} strokeWidth="1.5" />
            <path className="mp-scroll" d={sinePath(p.x - wl, yB, amp, wl, W + 2 * wl, p.phaseB)} fill="none" stroke={MP.ink} strokeWidth="1.5" strokeDasharray="5 4" />
            {p.phaseB === 0 ? (
              <path className="mp-scroll" d={sinePath(p.x - wl, ySum, amp * 2, wl, W + 2 * wl, 0)} fill="none" stroke={MP.accent} strokeWidth="2.5" />
            ) : (
              <line x1={p.x} y1={ySum} x2={p.x + W} y2={ySum} stroke={MP.accent} strokeWidth="2.5" />
            )}
          </g>
          {p.phaseB !== 0 && <ML x={p.x + W / 2} y={ySum - 12} size={9} anchor="middle">SILENCE</ML>}
          <FigCaption x={p.x} y={392}>{p.note}</FigCaption>
        </g>
      ))}
    </svg>
  );
}

// ── FIG. 03 — Open back vs closed back (animated) ──────────────────────────
function MpCup({ cx, open }) {
  const cy = 245, R = 130;
  return (
    <g>
      {/* shell */}
      <path d={arcPath(cx, cy, R, -90, -32)} fill="none" stroke={MP.ink} strokeWidth="9" />
      <path d={arcPath(cx, cy, R, 32, 90)} fill="none" stroke={MP.ink} strokeWidth="9" />
      {open ? (
        <path d={arcPath(cx, cy, R, -28, 28)} fill="none" stroke={MP.ink} strokeWidth="9" strokeDasharray="13 10" />
      ) : (
        <path d={arcPath(cx, cy, R, -32, 32)} fill="none" stroke={MP.ink} strokeWidth="9" />
      )}
      {/* baffle + driver */}
      <line x1={cx} y1={115} x2={cx} y2={375} stroke={MP.ink} strokeWidth="5" />
      <rect x={cx + 3} y={cy - 22} width="15" height="44" fill={MP.dark} />
      <path className="mp-osc-s" d={`M ${cx + 1} ${cy - 26} Q ${cx - 17} ${cy} ${cx + 1} ${cy + 26}`} fill="none" stroke={MP.accent} strokeWidth="2.5" />

      {/* front wave → ear */}
      <path className="mp-wave-front" d={arcPath(cx - 12, cy, 34, 130, 230)} fill="none" stroke={MP.label} strokeWidth="1.5" opacity="0.7" />
      <path className="mp-wave-front" style={{ animationDelay: '-0.87s' }} d={arcPath(cx - 12, cy, 60, 130, 230)} fill="none" stroke={MP.label} strokeWidth="1.5" opacity="0.45" />
      <path className="mp-wave-front" style={{ animationDelay: '-1.73s' }} d={arcPath(cx - 12, cy, 86, 130, 230)} fill="none" stroke={MP.label} strokeWidth="1.5" opacity="0.25" />

      {/* rear wave */}
      {open ? (
        <g>
          <path className="mp-wave-out" d={arcPath(cx + 12, cy, 34, -48, 48)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity="0.85" />
          <path className="mp-wave-out" style={{ animationDelay: '-0.8s' }} d={arcPath(cx + 12, cy, 62, -48, 48)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity="0.6" />
          <path className="mp-wave-out" style={{ animationDelay: '-1.6s' }} d={arcPath(cx + 12, cy, 90, -48, 48)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity="0.4" />
          <path className="mp-wave-out" style={{ animationDelay: '-0.4s' }} d={arcPath(cx + 12, cy, 152, -24, 24)} fill="none" stroke={MP.accent} strokeWidth="1.4" opacity="0.35" />
          <path className="mp-wave-out" style={{ animationDelay: '-1.2s' }} d={arcPath(cx + 12, cy, 180, -24, 24)} fill="none" stroke={MP.accent} strokeWidth="1.4" opacity="0.2" />
        </g>
      ) : (
        <g>
          <path className="mp-wave-out2" d={arcPath(cx + 12, cy, 30, -48, 48)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity="0.85" />
          <path className="mp-wave-out2" style={{ animationDelay: '-0.8s' }} d={arcPath(cx + 12, cy, 56, -48, 48)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity="0.6" />
          <path className="mp-wave-out2" style={{ animationDelay: '-1.6s' }} d={arcPath(cx + 12, cy, 82, -48, 48)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity="0.4" />
          {/* reflected energy traveling back */}
          <path className="mp-wave-back" d={arcPath(cx + 150, cy, 44, 132, 228)} fill="none" stroke={MP.accent} strokeWidth="1.4" strokeDasharray="5 4" opacity="0.5" />
          <path className="mp-wave-back" style={{ animationDelay: '-1.3s' }} d={arcPath(cx + 150, cy, 76, 132, 228)} fill="none" stroke={MP.accent} strokeWidth="1.4" strokeDasharray="5 4" opacity="0.3" />
        </g>
      )}

      {/* ear direction */}
      <Arrow x1={cx - 150} y1={cy} x2={cx - 185} y2={cy} color={MP.faint} width="1.2" head={6} />
      <ML x={cx - 168} y={cy - 14} size={9} anchor="middle">TO EAR</ML>
    </g>
  );
}

function FigBack() {
  const cx1 = 230, cx2 = 650;
  return (
    <svg viewBox="0 0 880 440" width={880} height={440} style={{ display: 'block' }}>
      <FigHead n="03" title="OPEN BACK VS CLOSED BACK" />
      <ML x={cx1} y={68} anchor="middle" color={MP.dark} weight={600} size={12}>OPEN BACK</ML>
      <ML x={cx2} y={68} anchor="middle" color={MP.dark} weight={600} size={12}>CLOSED BACK</ML>
      <MpCup cx={cx1} open={true} />
      <MpCup cx={cx2} open={false} />
      <ML x={cx1 + 150} y={380} size={9.5}>REAR WAVE ESCAPES</ML>
      <Leader x1={cx1 + 160} y1={368} x2={cx1 + 150} y2={310} />
      <ML x={cx2 + 60} y={398} size={9.5}>REFLECTED INSIDE</ML>
      <Leader x1={cx2 + 80} y1={386} x2={cx2 + 80} y2={290} />
      <FigCaption x={cx1} y={428} anchor="middle">LESS PRESSURE BUILD-UP · LESS ISOLATION</FigCaption>
      <FigCaption x={cx2} y={428} anchor="middle">ISOLATION — BUT REFLECTIONS RETURN</FigCaption>
    </svg>
  );
}

// ── FIG. 04 — The air spring (animated) ─────────────────────────────────────
function MpAirPanel({ x0, chamW, title, sub, clsAir, clsCham }) {
  const baffleX = x0 + 120, backX = baffleX + chamW, cy = 250;
  const airLines = [];
  for (let x = baffleX + 20; x <= backX - 12; x += 13) {
    airLines.push(<line key={x} x1={x} y1={148} x2={x} y2={352} stroke={MP.hair} strokeWidth="1" />);
  }
  const origin = { transformOrigin: `${backX}px ${cy}px`, transformBox: 'view-box' };
  return (
    <g>
      <ML x={x0 + 26} y={84} color={MP.dark} weight={600} size={12}>{title}</ML>
      <ML x={x0 + 26} y={102} size={9.5}>{sub}</ML>

      {/* air (density lines) + spring — compress toward the back wall */}
      <g className={clsCham} style={origin}>{airLines}</g>
      <g className={clsCham} style={origin}>
        <path d={zigzagPath(baffleX + 12, backX - 10, cy, 8, 13)} fill="none" stroke={MP.ink} strokeWidth="2" strokeLinejoin="round" />
      </g>

      {/* shell, open toward the ear */}
      <path d={`M ${x0 + 26} 132 L ${backX - 14} 132 Q ${backX} 132 ${backX} 146 L ${backX} 354 Q ${backX} 368 ${backX - 14} 368 L ${x0 + 26} 368`} fill="none" stroke={MP.ink} strokeWidth="6" />
      {/* ear pads */}
      <rect x={x0 + 6} y={132} width="22" height="64" rx="5" fill="rgba(45,55,72,0.08)" stroke={MP.ink} strokeWidth="1.5" />
      <rect x={x0 + 6} y={304} width="22" height="64" rx="5" fill="rgba(45,55,72,0.08)" stroke={MP.ink} strokeWidth="1.5" />

      {/* diaphragm */}
      <rect x={baffleX - 6} y={156} width="12" height="14" fill={MP.ink} />
      <rect x={baffleX - 6} y={330} width="12" height="14" fill={MP.ink} />
      <line className={clsAir} x1={baffleX} y1={170} x2={baffleX} y2={330} stroke={MP.accent} strokeWidth="3" />
      <Arrow x1={baffleX - 44} y1={cy} x2={baffleX - 12} y2={cy} color={MP.accent} width="1.5" both head={6} />

      {/* labels */}
      <ML x={x0 + 73} y={122} size={9} anchor="middle">FRONT CAVITY</ML>
      <Leader x1={x0 + 73} y1={128} x2={x0 + 73} y2={178} />
      <ML x={(baffleX + backX) / 2} y={122} size={9} anchor="middle">REAR CHAMBER</ML>
      <Leader x1={(baffleX + backX) / 2} y1={128} x2={(baffleX + backX) / 2} y2={170} />
      <ML x={x0 - 14} y={232} size={8.5} anchor="middle">TO EAR</ML>
      <Arrow x1={x0 + 2} y1={250} x2={x0 - 30} y2={250} color={MP.faint} width="1.2" head={6} />
    </g>
  );
}

function FigAirSpring() {
  return (
    <svg viewBox="0 0 880 470" width={880} height={470} style={{ display: 'block' }}>
      <FigHead n="04" title="THE AIR SPRING" />
      <MpAirPanel x0={50} chamW={110} title="SMALL REAR VOLUME" sub="STIFF AIR SPRING" clsAir="mp-air-s" clsCham="mp-cham-s" />
      <MpAirPanel x0={430} chamW={250} title="LARGE REAR VOLUME" sub="SOFTER AIR SPRING" clsAir="mp-air-l" clsCham="mp-cham-l" />
      <ML x={380} y={418} size={9.5}>DIAPHRAGM</ML>
      <Leader x1={420} y1={406} x2={548} y2={318} />
      <FigCaption x={50} y={452}>SEALED AIR BEHIND THE DRIVER ACTS AS A SPRING — A LARGER REAR VOLUME IS A SOFTER SPRING, SO BASS MOVES MORE FREELY</FigCaption>
    </svg>
  );
}

Object.assign(window, { FigDriver, FigPhase, FigBack, FigAirSpring });
