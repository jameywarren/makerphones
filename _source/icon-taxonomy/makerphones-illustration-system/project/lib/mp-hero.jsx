// MakerPhones illustration system — HERO EXPLODED HEADPHONE
// Showpiece figure: right cup assembled + playing, left cup exploded along a
// dash-dot axis. weight='mass' (filled magnets/walls, heavy shells — new-set
// dialect) or weight='line' (airy pure line-work — old ExplodedHeadphone dialect).
// Motion via data-motion on the wrapper: 'settle' | 'breathe' | 'hover'.

const { MP, ML, Leader, arcPath } = window;

// straight explode axis: A (at the band's left end) → B (pad, far out)
const HX_A = { x: 412, y: 216 };
const HX_B = { x: 60, y: 548 };
const HX_TARGET = { x: 420, y: 252 }; // assembled cup centre under left band end

function hxPos(u) {
  return { x: HX_A.x + u * (HX_B.x - HX_A.x), y: HX_A.y + u * (HX_B.y - HX_A.y) };
}

const HX_PARTS = [
  { id: 'yoke', u: 0.08, label: 'YOKE' },
  { id: 'shell', u: 0.26, label: 'CUP SHELL' },
  { id: 'damping', u: 0.44, label: 'DAMPING' },
  { id: 'driver', u: 0.62, label: 'DRIVER' },
  { id: 'baffle', u: 0.81, label: 'BAFFLE' },
  { id: 'pad', u: 1.0, label: 'EAR PAD' },
];

function HxPart({ u, i, children }) {
  const p = hxPos(u);
  const style = {
    '--tx': `${(HX_TARGET.x - p.x).toFixed(1)}px`,
    '--ty': `${(HX_TARGET.y - p.y).toFixed(1)}px`,
    '--i': i,
  };
  return <g className="hx-part" style={style}>{children}</g>;
}

function HxYoke({ cx, cy, mass }) {
  const w = mass ? 4 : 2.2;
  const ac = { x: cx, y: cy + 20 }, r = 42;
  return (
    <g>
      <line x1={cx} y1={cy - 32} x2={cx} y2={cy - 8} stroke={MP.ink} strokeWidth={w} strokeLinecap="round" />
      <circle cx={cx} cy={cy - 4} r="4" fill="none" stroke={MP.ink} strokeWidth="1.5" />
      <path d={arcPath(ac.x, ac.y, r, -160, -20)} fill="none" stroke={MP.ink} strokeWidth={w} strokeLinecap="round" />
      <circle cx={ac.x - 39.5} cy={ac.y - 14.4} r={mass ? 3.4 : 2.6} fill={mass ? MP.dark : 'none'} stroke={MP.ink} strokeWidth="1.5" />
      <circle cx={ac.x + 39.5} cy={ac.y - 14.4} r={mass ? 3.4 : 2.6} fill={mass ? MP.dark : 'none'} stroke={MP.ink} strokeWidth="1.5" />
    </g>
  );
}

function HxShell({ cx, cy, mass }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="46" fill={mass ? MP.washInk : 'none'} stroke={MP.ink} strokeWidth={mass ? 4 : 2.2} />
      <circle cx={cx} cy={cy} r="37" fill="none" stroke={MP.hair} strokeWidth="1" />
      {/* grain hints */}
      <path d={arcPath(cx, cy, 28, -140, -40)} fill="none" stroke={MP.hair} strokeWidth="1" />
      <path d={arcPath(cx, cy, 20, 30, 130)} fill="none" stroke={MP.hair} strokeWidth="1" />
      <circle cx={cx} cy={cy} r="2.5" fill={MP.ink} />
    </g>
  );
}

function HxDamping({ cx, cy, mass }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="33" fill={mass ? MP.washInkSoft : 'none'} stroke={MP.label} strokeWidth="1.5" strokeDasharray="1 0" />
      {[-12, 0, 12].map((dy) => (
        <path key={dy}
          d={`M ${cx - 24} ${cy + dy} q 6 -5 12 0 t 12 0 t 12 0`}
          fill="none" stroke={MP.faint} strokeWidth="1.2" />
      ))}
    </g>
  );
}

function HxDriver({ cx, cy, mass }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="40" fill={mass ? MP.ground : 'none'} stroke={MP.ink} strokeWidth="2" />
      {/* magnet ring */}
      {mass ? (
        <path d={`M ${cx} ${cy - 32} A 32 32 0 1 0 ${cx + 0.01} ${cy - 32} Z
                  M ${cx} ${cy - 24} A 24 24 0 1 1 ${cx - 0.01} ${cy - 24} Z`}
          fill={MP.dark} fillRule="evenodd" />
      ) : (
        <g>
          <circle cx={cx} cy={cy} r="32" fill="none" stroke={MP.ink} strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r="24" fill="none" stroke={MP.ink} strokeWidth="1.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r1 = 24, r2 = 32, rad = (a * Math.PI) / 180;
            return <line key={a}
              x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
              x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
              stroke={MP.hair} strokeWidth="1" />;
          })}
        </g>
      )}
      {/* surround + dome — the active element */}
      <circle cx={cx} cy={cy} r="17.5" fill="none" stroke={MP.hair} strokeWidth="1" />
      <circle className="hx-dome" cx={cx} cy={cy} r="13" fill={MP.washAccent} stroke={MP.accent} strokeWidth="2.5"
        style={{ transformOrigin: 'center', transformBox: 'fill-box' }} />
      {/* terminals */}
      <circle cx={cx - 6} cy={cy + 37} r="1.6" fill={MP.dark} />
      <circle cx={cx + 6} cy={cy + 37} r="1.6" fill={MP.dark} />
    </g>
  );
}

function HxBaffle({ cx, cy, mass }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="42" fill={mass ? MP.tint : 'none'} stroke={MP.ink} strokeWidth="2" />
      <circle cx={cx} cy={cy} r="14" fill={mass ? MP.ground : 'none'} stroke={MP.ink} strokeWidth="1.5" />
      {[45, 135, 225, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <circle key={a} cx={cx + 33 * Math.cos(rad)} cy={cy + 33 * Math.sin(rad)} r="2" fill={MP.dark} />;
      })}
      {/* port slots */}
      {[78, 90, 102].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <line key={a}
          x1={cx + 20 * Math.cos(rad)} y1={cy + 20 * Math.sin(rad)}
          x2={cx + 27 * Math.cos(rad)} y2={cy + 27 * Math.sin(rad)}
          stroke={MP.ink} strokeWidth="1.5" strokeLinecap="round" />;
      })}
    </g>
  );
}

function HxPad({ cx, cy, mass }) {
  return (
    <g>
      {mass ? (
        <path d={`M ${cx} ${cy - 45} A 45 45 0 1 0 ${cx + 0.01} ${cy - 45} Z
                  M ${cx} ${cy - 24} A 24 24 0 1 1 ${cx - 0.01} ${cy - 24} Z`}
          fill={MP.washInk} fillRule="evenodd" stroke="none" />
      ) : null}
      <circle cx={cx} cy={cy} r="45" fill="none" stroke={MP.ink} strokeWidth="2.2" />
      <circle cx={cx} cy={cy} r="24" fill="none" stroke={MP.ink} strokeWidth="1.5" />
      {Array.from({ length: 12 }).map((_, k) => {
        const rad = (k * 30 * Math.PI) / 180;
        return <line key={k}
          x1={cx + 39 * Math.cos(rad)} y1={cy + 39 * Math.sin(rad)}
          x2={cx + 45 * Math.cos(rad)} y2={cy + 45 * Math.sin(rad)}
          stroke={MP.hair} strokeWidth="1" />;
      })}
    </g>
  );
}

// Assembled right cup, worn position, playing.
function HxAssembled({ cx, cy, mass }) {
  return (
    <g>
      {/* yoke around the cup */}
      <path d={arcPath(cx, cy, 58, -165, -15)} fill="none" stroke={MP.ink} strokeWidth={mass ? 4 : 2.2} strokeLinecap="round" />
      <circle cx={cx - 56} cy={cy - 15} r={mass ? 3.2 : 2.4} fill={mass ? MP.dark : 'none'} stroke={MP.ink} strokeWidth="1.5" />
      <circle cx={cx + 56} cy={cy - 15} r={mass ? 3.2 : 2.4} fill={mass ? MP.dark : 'none'} stroke={MP.ink} strokeWidth="1.5" />
      {/* cup */}
      <circle cx={cx} cy={cy} r="48" fill={mass ? MP.washInk : 'none'} stroke={MP.ink} strokeWidth={mass ? 4 : 2.2} />
      <circle cx={cx} cy={cy} r="38" fill="none" stroke={MP.hair} strokeWidth="1" />
      <circle cx={cx} cy={cy} r="3" fill={MP.accent} className="hx-dome"
        style={{ transformOrigin: 'center', transformBox: 'fill-box' }} />
      {/* pressure waves — playing */}
      {[64, 88, 112].map((r, i) => (
        <path key={r} className="mp-wave-out" style={i ? { animationDelay: `${-0.8 * i}s` } : null}
          d={arcPath(cx, cy, r, -42, 42)} fill="none" stroke={MP.accent} strokeWidth="1.8" opacity={0.8 - i * 0.25} />
      ))}
    </g>
  );
}

function HeroExploded({ weight = 'mass', motion = 'settle', annotated = true, header = null, caption = null }) {
  const mass = weight === 'mass';
  const cup = { x: 688, y: 252 };
  const partCmp = { yoke: HxYoke, shell: HxShell, damping: HxDamping, driver: HxDriver, baffle: HxBaffle, pad: HxPad };
  return (
    <div className="hero-x" data-motion={motion} style={{ width: '100%' }}>
      <svg viewBox="0 0 900 640" style={{ display: 'block', overflow: 'visible' }}>
        {header && (
          <g>
            <ML x={24} y={30} color={MP.accent} weight={700} size={11}>FIG. H</ML>
            <ML x={94} y={30} color={MP.dark} weight={600} size={11}>{header}</ML>
          </g>
        )}

        {/* explode axis */}
        <line x1={HX_A.x + 14} y1={HX_A.y - 12} x2={HX_B.x - 18} y2={HX_B.y + 28}
          stroke={MP.faint} strokeWidth="1" strokeDasharray="2 6" className="hx-axis" />

        {/* headband */}
        <path d={`M 420 210 C 426 104 478 78 554 78 C 630 78 682 104 688 204`}
          fill="none" stroke={MP.ink} strokeWidth={mass ? 7 : 2.5} strokeLinecap="round" />
        <path d={`M 488 92 C 510 84 598 84 620 92`}
          fill="none" stroke={mass ? MP.hair : MP.hair} strokeWidth="1" />
        {/* adjuster ticks on the band, near its left end */}
        {[[414, 181, 430, 179], [415.5, 166, 431.5, 164], [417, 151, 433, 149]].map((t, k) => (
          <line key={k} x1={t[0]} y1={t[1]} x2={t[2]} y2={t[3]}
            stroke={mass ? MP.ground : MP.ink} strokeWidth="1.5" opacity={mass ? 1 : 0.45} />
        ))}

        <HxAssembled cx={cup.x} cy={cup.y} mass={mass} />

        {/* cable from the assembled cup */}
        <path className="hx-cable" d={`M ${cup.x} ${cup.y + 48} C ${cup.x + 4} 380 ${cup.x - 46} 430 ${cup.x - 40} 500 C ${cup.x - 36} 560 ${cup.x + 14} 580 ${cup.x + 18} 640`}
          fill="none" stroke={MP.accent} strokeWidth="1.5" opacity="0.85" />

        {/* exploded parts */}
        {HX_PARTS.map((p, i) => {
          const Cmp = partCmp[p.id];
          const c = hxPos(p.u);
          return (
            <HxPart key={p.id} u={p.u} i={HX_PARTS.length - i}>
              <Cmp cx={c.x} cy={c.y} mass={mass} />
            </HxPart>
          );
        })}

        {annotated && (
          <g className="hx-callouts">
            <ML x={554} y={44} size={9.5} anchor="middle">HEADBAND</ML>
            <Leader x1={554} y1={50} x2={554} y2={74} />
            <ML x={812} y={170} size={9.5}>ASSEMBLED — R</ML>
            <Leader x1={818} y1={176} x2={730} y2={216} />
            {(() => {
              const cfg = {
                yoke:    { lx: 452, ly: 240, anchor: 'start', tx: 430, ty: 247 },
                shell:   { lx: 208, ly: 288, anchor: 'end',  tx: 268, ty: 300 },
                damping: { lx: 304, ly: 388, anchor: 'start', tx: 284, ty: 372 },
                driver:  { lx: 86,  ly: 412, anchor: 'end',  tx: 150, ty: 420 },
                baffle:  { lx: 190, ly: 498, anchor: 'start', tx: 173, ty: 488 },
                pad:     { lx: 126, ly: 560, anchor: 'start', tx: 109, ty: 552 },
              };
              return HX_PARTS.map((p, i) => {
                const c = cfg[p.id];
                return (
                  <g key={p.id}>
                    <ML x={c.lx} y={c.ly} size={9.5} anchor={c.anchor}>{`0${i + 1} — ${p.label}`}</ML>
                    <Leader x1={c.anchor === 'end' ? c.lx + 6 : c.lx - 6} y1={c.ly - 4} x2={c.tx} y2={c.ty} />
                  </g>
                );
              });
            })()}
          </g>
        )}

        {caption && (
          <ML x={24} y={628} size={10} opacity={0.9}>{caption}</ML>
        )}
      </svg>
    </div>
  );
}

Object.assign(window, { HeroExploded, HX_PARTS });
