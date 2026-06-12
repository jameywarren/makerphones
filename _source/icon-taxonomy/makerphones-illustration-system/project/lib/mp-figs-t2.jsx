// MakerPhones diagrams — FIG 15–18 (Tier 2 extensions)
// Line dialect · FIG 00 conventions.

const { MP, ML, Leader, FigHead, FigCaption, Arrow, sinePath, arcPath, zigzagPath, HatchV, Pinna } = window;

// ── FIG. 15 — Design process flow ───────────────────────────────────────────
function FigProcess() {
  const phases = [
    ['01', 'DEFINE', 'TARGETS, CONSTRAINTS'],
    ['02', 'INITIAL DESIGN', 'TOPOLOGY, PARTS'],
    ['03', 'PROTOTYPE & TEST', 'BUILD, MEASURE'],
    ['04', 'ITERATE & REFINE', 'TUNE, REMEASURE'],
    ['05', 'DOCUMENT', 'PUBLISH THE RECORD'],
  ];
  const w = 122, h = 66, gap = 22, x0 = 40, y = 160;
  return (
    <svg viewBox="0 0 760 420" width={760} height={420} style={{ display: 'block' }}>
      <FigHead n="15" title="THE DESIGN PROCESS — FIVE PHASES, ONE LOOP" />
      {phases.map(([n, name, sub], i) => {
        const x = x0 + i * (w + gap);
        return (
          <g key={n}>
            <rect x={x} y={y} width={w} height={h} fill={i === 2 || i === 3 ? MP.washInkSoft : 'none'} stroke={MP.ink} strokeWidth="1.5" />
            <ML x={x + 10} y={y - 10} size={9} color={MP.accent} weight={700}>{n}</ML>
            <ML x={x + w / 2} y={y + 30} size={8.6} anchor="middle" color={MP.dark} weight={600}>{name}</ML>
            <ML x={x + w / 2} y={y + 47} size={7.4} anchor="middle">{sub}</ML>
            {i < 4 && <Arrow x1={x + w + 3} y1={y + h / 2} x2={x + w + gap - 3} y2={y + h / 2} color={MP.ink} width="1.5" head={6} />}
          </g>
        );
      })}
      {/* iterate-back loop: 04 → 03 */}
      {(() => {
        const x3 = x0 + 2 * (w + gap) + w / 2, x4 = x0 + 3 * (w + gap) + w / 2;
        return (
          <g>
            <path d={`M ${x4} ${y + h} C ${x4} ${y + h + 64} ${x3} ${y + h + 64} ${x3} ${y + h + 10}`}
              fill="none" stroke={MP.accent} strokeWidth="2" />
            <polygon points={`0,0 -7,3 -7,-3`} transform={`translate(${x3} ${y + h + 8}) rotate(-90)`} fill={MP.accent} />
            <ML x={(x3 + x4) / 2} y={y + h + 80} size={9} anchor="middle" color={MP.accent} weight={600}>THE LOOP — EXPECT 3–6 PASSES</ML>
          </g>
        );
      })()}
      <FigCaption x={24} y={396}>THE LOOP IS THE METHOD — MOST OF THE WORK IS 03 ↔ 04. DOCUMENT LAST, BUT TAKE NOTES THE WHOLE WAY THROUGH.</FigCaption>
    </svg>
  );
}

// ── FIG. 16 — Wireless signal chain ─────────────────────────────────────────
function FigWireless() {
  const box = (x, y, w, lab, sub, active) => (
    <g>
      <rect x={x} y={y} width={w} height={48} fill={active ? MP.washAccent : 'none'} stroke={active ? MP.accent : MP.ink} strokeWidth="1.5" />
      <ML x={x + w / 2} y={y + 22} size={8.4} anchor="middle" color={MP.dark} weight={600}>{lab}</ML>
      {sub && <ML x={x + w / 2} y={y + 37} size={7} anchor="middle">{sub}</ML>}
    </g>
  );
  const arr = (x1, x2, y) => <Arrow x1={x1} y1={y + 24} x2={x2} y2={y + 24} color={MP.ink} width="1.2" head={5} />;
  const yW = 120, yB = 282;
  return (
    <svg viewBox="0 0 760 470" width={760} height={470} style={{ display: 'block' }}>
      <FigHead n="16" title="SIGNAL CHAIN — WIRED VS BLUETOOTH" />

      <ML x={40} y={yW - 14} size={9.5} color={MP.dark} weight={600}>WIRED</ML>
      {box(40, yW, 96, 'SOURCE', 'FILE / STREAM')}
      {arr(140, 168, yW)}
      {box(172, yW, 96, 'DAC', 'D → A', true)}
      {arr(272, 300, yW)}
      {box(304, yW, 96, 'AMP', 'ANALOG GAIN')}
      {arr(404, 432, yW)}
      {box(436, yW, 96, 'DRIVER', 'AIR')}
      {/* signal-type underline */}
      <line x1={40} y1={yW + 64} x2={220} y2={yW + 64} stroke={MP.faint} strokeWidth="1.2" strokeDasharray="3 4" />
      <line x1={220} y1={yW + 64} x2={532} y2={yW + 64} stroke={MP.faint} strokeWidth="1.2" />
      <ML x={128} y={yW + 80} size={7.5} anchor="middle">DIGITAL</ML>
      <ML x={376} y={yW + 80} size={7.5} anchor="middle">ANALOG</ML>
      <ML x={566} y={yW + 28} size={8.5}>ONE CONVERSION,</ML>
      <ML x={566} y={yW + 41} size={8.5}>OUT IN THE OPEN</ML>

      <ML x={40} y={yB - 14} size={9.5} color={MP.dark} weight={600}>BLUETOOTH</ML>
      {box(40, yB, 86, 'SOURCE', 'FILE / STREAM')}
      {arr(130, 152, yB)}
      {box(156, yB, 96, 'CODEC', 'SBC · AAC · APTX · LDAC', true)}
      {/* RF link */}
      <path d={zigzagPath(258, 322, yB + 24, 5, 9)} fill="none" stroke={MP.accent} strokeWidth="1.8" />
      <ML x={290} y={yB - 8} size={7.5} anchor="middle" color={MP.accent} weight={600}>RF — LOSSY</ML>
      {box(326, yB, 86, 'RECEIVER', 'IN THE CUP')}
      {arr(416, 438, yB)}
      {box(442, yB, 76, 'DAC', 'D → A', true)}
      {arr(522, 544, yB)}
      {box(548, yB, 76, 'AMP', 'TINY, BATTERY')}
      {arr(628, 650, yB)}
      {box(654, yB, 76, 'DRIVER', 'AIR')}
      <line x1={40} y1={yB + 64} x2={490} y2={yB + 64} stroke={MP.faint} strokeWidth="1.2" strokeDasharray="3 4" />
      <line x1={490} y1={yB + 64} x2={730} y2={yB + 64} stroke={MP.faint} strokeWidth="1.2" />
      <ML x={262} y={yB + 80} size={7.5} anchor="middle">DIGITAL — QUALITY SET BY THE CODEC</ML>
      <ML x={610} y={yB + 80} size={7.5} anchor="middle">ANALOG</ML>

      {/* boundary of the headphone */}
      <rect x={318} y={yB - 32} width={420} height={124} fill="none" stroke={MP.hair} strokeWidth="1" strokeDasharray="5 4" />
      <ML x={728} y={yB - 40} size={7.5} anchor="end">INSIDE THE HEADPHONE</ML>

      <FigCaption x={24} y={446}>BLUETOOTH MOVES THE DAC AND AMP INTO THE CUP — THE CODEC SETS THE CEILING.</FigCaption>
    </svg>
  );
}

// ── FIG. 17 — ANC mic topology ──────────────────────────────────────────────
function FigANC() {
  const cy = 180;
  const Mic = ({ x, y }) => (
    <g>
      <circle cx={x} cy={y} r="6" fill={MP.ground} stroke={MP.accent} strokeWidth="2" />
      <circle cx={x} cy={y} r="1.8" fill={MP.accent} />
    </g>
  );
  const Cup = ({ x, ff, fb }) => (
    <g>
      {/* shell + baffle + driver + ear line */}
      <path d={`M ${x} ${cy - 74} C ${x - 104} ${cy - 74} ${x - 104} ${cy + 74} ${x} ${cy + 74}`}
        fill={MP.washInkSoft} stroke={MP.ink} strokeWidth="2" />
      <line x1={x} y1={cy - 74} x2={x} y2={cy + 74} stroke={MP.ink} strokeWidth="2.5" />
      <path d={`M ${x} ${cy - 20} A 22 22 0 0 1 ${x} ${cy + 20}`} fill={MP.washAccent} stroke={MP.accent} strokeWidth="2" />
      <line x1={x + 52} y1={cy - 74} x2={x + 52} y2={cy + 74} stroke={MP.hair} strokeWidth="1.2" />
      <HatchV x={x + 52} y0={cy - 66} y1={cy + 66} side={1} n={6} len={6} />
      {ff && <Mic x={x - 86} y={cy - 44} />}
      {fb && <Mic x={x + 24} y={cy - 30} />}
    </g>
  );
  const panels = [
    { x: 170, name: 'FEEDFORWARD', sub: 'MIC OUTSIDE — PREDICTS', ff: true, fb: false },
    { x: 410, name: 'FEEDBACK', sub: 'MIC AT THE EAR — CORRECTS', ff: false, fb: true },
    { x: 650, name: 'HYBRID', sub: 'BOTH — PREDICT + CORRECT', ff: true, fb: true },
  ];
  return (
    <svg viewBox="0 0 760 480" width={760} height={480} style={{ display: 'block' }}>
      <FigHead n="17" title="ANC — WHERE THE MICROPHONES SIT" />
      {panels.map((p) => (
        <g key={p.name}>
          <Cup x={p.x} ff={p.ff} fb={p.fb} />
          <ML x={p.x - 50} y={cy + 112} size={9.5} anchor="middle" color={MP.dark} weight={600}>{p.name}</ML>
          <ML x={p.x - 50} y={cy + 128} size={7.2} anchor="middle">{p.sub}</ML>
        </g>
      ))}
      <ML x={84} y={108} size={8.5}>EXTERNAL MIC</ML>
      <Leader x1={92} y1={114} x2={84} y2={cy - 48} />
      <ML x={470} y={108} size={8.5}>INTERNAL MIC — IN THE FRONT CAVITY</ML>
      <Leader x1={478} y1={114} x2={436} y2={cy - 34} />

      {/* anti-noise summing */}
      <g>
        <path d={sinePath(120, 404, 14, 64, 180)} fill="none" stroke={MP.ink} strokeWidth="1.5" strokeDasharray="4 3" />
        <ML x={120} y={376} size={8.5}>NOISE</ML>
        <path d={sinePath(120, 404, 14, 64, 180, Math.PI)} fill="none" stroke={MP.accent} strokeWidth="2" />
        <ML x={196} y={440} size={8.5} color={MP.accent} weight={600}>ANTI-NOISE — INVERTED</ML>
        <circle cx={356} cy={404} r="13" fill="none" stroke={MP.ink} strokeWidth="1.5" />
        <ML x={356} y={408.5} size={11} anchor="middle" color={MP.dark} weight={600}>Σ</ML>
        <Arrow x1={306} y1={404} x2={341} y2={404} color={MP.ink} width="1.2" head={5} />
        <Arrow x1={371} y1={404} x2={436} y2={404} color={MP.ink} width="1.2" head={5} />
        <line x1={444} y1={404} x2={560} y2={404} stroke={MP.ink} strokeWidth="1.5" />
        <ML x={576} y={408} size={8.5}>RESIDUAL ≈ 0 — SILENCE</ML>
      </g>

      <FigCaption x={24} y={470}>JUST MIC PLACEMENT — FEEDFORWARD PREDICTS, FEEDBACK CORRECTS, HYBRID DOES BOTH AND COSTS BOTH.</FigCaption>
    </svg>
  );
}

// ── FIG. 18 — IEM cross-section ─────────────────────────────────────────────
function FigIEM() {
  const cy = 240;
  return (
    <svg viewBox="0 0 760 470" width={760} height={470} style={{ display: 'block' }}>
      <FigHead n="18" title="IEM — INSIDE THE SHELL, INSIDE THE CANAL" />

      {/* canal walls */}
      <line x1={430} y1={cy - 42} x2={700} y2={cy - 56} stroke={MP.ink} strokeWidth="1.5" />
      <line x1={430} y1={cy + 42} x2={700} y2={cy + 56} stroke={MP.ink} strokeWidth="1.5" />
      {Array.from({ length: 7 }).map((_, k) => {
        const t = k / 6, x = 520 + t * 168;
        return (
          <g key={k}>
            <line x1={x} y1={cy - 47 - t * 9} x2={x + 9} y2={cy - 56 - t * 9} stroke={MP.faint} strokeWidth="1" />
            <line x1={x} y1={cy + 47 + t * 9} x2={x + 9} y2={cy + 56 + t * 9} stroke={MP.faint} strokeWidth="1" />
          </g>
        );
      })}
      <ML x={650} y={cy - 70} size={9.5} anchor="end">EAR CANAL</ML>

      {/* shell */}
      <path d={`M 420 ${cy - 36}
                C 420 ${cy - 96} 350 ${cy - 110} 280 ${cy - 96}
                C 200 ${cy - 80} 182 ${cy + 30} 240 ${cy + 78}
                C 300 ${cy + 124} 408 ${cy + 64} 420 ${cy + 36} Z`}
        fill={MP.washInkSoft} stroke={MP.ink} strokeWidth="2" />
      {/* nozzle */}
      <rect x={420} y={cy - 22} width={56} height={44} rx={6} fill={MP.ground} stroke={MP.ink} strokeWidth="1.5" />
      {/* bore */}
      <line x1={426} y1={cy} x2={472} y2={cy} stroke={MP.accent} strokeWidth="2.5" />
      {/* ear-tip flanges */}
      <path d={`M 452 ${cy - 22} Q 492 ${cy - 40} 496 ${cy - 4} L 496 ${cy + 4} Q 492 ${cy + 40} 452 ${cy + 22}`}
        fill={MP.washInk} stroke={MP.ink} strokeWidth="1.5" />
      {/* drivers */}
      <circle cx={350} cy={cy + 18} r="30" fill="none" stroke={MP.ink} strokeWidth="1.5" />
      <circle cx={350} cy={cy + 18} r="10" fill={MP.washAccent} stroke={MP.accent} strokeWidth="2" />
      <rect x={262} y={cy - 64} width={42} height={26} rx={3} fill="none" stroke={MP.ink} strokeWidth="1.5" />
      <rect x={262} y={cy - 28} width={42} height={26} rx={3} fill="none" stroke={MP.ink} strokeWidth="1.5" />
      {/* crossover */}
      <rect x={236} y={cy + 22} width={34} height={22} rx={3} fill={MP.washInk} stroke={MP.ink} strokeWidth="1.5" />
      {/* tubes to bore */}
      <path d={`M 304 ${cy - 50} C 370 ${cy - 50} 400 ${cy - 18} 426 ${cy - 6}`} fill="none" stroke={MP.label} strokeWidth="1.4" />
      <path d={`M 380 ${cy + 16} C 404 ${cy + 12} 414 ${cy + 6} 426 ${cy + 4}`} fill="none" stroke={MP.label} strokeWidth="1.4" />
      {/* wiring from crossover */}
      <path d={`M 270 ${cy + 22} C 280 ${cy + 4} 300 ${cy - 6} 320 ${cy - 10}`} fill="none" stroke={MP.hair} strokeWidth="1.2" strokeDasharray="2 3" />

      {/* sound exiting bore */}
      {[14, 26].map((r, i) => (
        <path key={r} className="mp-wave-out2" style={i ? { animationDelay: '-1.2s' } : null}
          d={arcPath(500, cy, r, -50, 50)} fill="none" stroke={MP.accent} strokeWidth="1.6" opacity={0.7 - i * 0.3} />
      ))}

      <ML x={150} y={108} size={9.5}>BALANCED ARMATURES — HIGHS</ML>
      <Leader x1={236} y1={114} x2={282} y2={cy - 56} />
      <ML x={96} y={cy + 116} size={9.5}>CROSSOVER</ML>
      <Leader x1={136} y1={cy + 110} x2={248} y2={cy + 40} />
      <ML x={328} y={cy + 106} size={9.5}>DYNAMIC DRIVER — LOWS</ML>
      <Leader x1={372} y1={cy + 98} x2={356} y2={cy + 44} />
      <ML x={430} y={120} size={9.5}>SOUND BORE</ML>
      <Leader x1={452} y1={126} x2={446} y2={cy - 8} />
      <ML x={556} y={150} size={9.5}>EAR-TIP — THE SEAL</ML>
      <Leader x1={566} y1={156} x2={488} y2={cy - 26} />

      <FigCaption x={24} y={446}>THE SEAL IS THE BASS — A LEAKING TIP COSTS MORE LOW END THAN ANY DRIVER UPGRADE BUYS BACK.</FigCaption>
    </svg>
  );
}

Object.assign(window, { FigProcess, FigWireless, FigANC, FigIEM });
