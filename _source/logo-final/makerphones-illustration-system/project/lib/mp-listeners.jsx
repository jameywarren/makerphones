// MakerPhones illustration system — THE LISTENERS
// Human figures in the FIG diagram language: charcoal structure lines,
// orange strictly for headphones + sound, optional drafted annotations.
// Anatomy: 'contour' | 'fill' | 'drafted'   Face: 'none' | 'line' | 'soft'

const { MP, ML, Leader } = window;

function figTone(anatomy) {
  return anatomy === 'fill' ? MP.tint : MP.ground;
}

// Outlined limb: wide ink stroke under a narrower ground/tint stroke.
function Limb({ d, tone }) {
  return (
    <g>
      <path d={d} fill="none" stroke={MP.ink} strokeWidth="11.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={MP.ground} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
      {tone !== MP.ground && (
        <path d={d} fill="none" stroke={tone} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </g>
  );
}

function JointDots({ pts }) {
  return <g>{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.2" fill={MP.faint} />)}</g>;
}

// Head in profile. dir: -1 faces left, +1 faces right. tilt in degrees (+ = chin up).
function ListenerHead({ cx, cy, dir = -1, tilt = 0, face = 'line', eye = 'closed', tone }) {
  const r = 17;
  return (
    <g transform={`rotate(${tilt * -dir} ${cx} ${cy})`}>
      <circle cx={cx} cy={cy} r={r} fill={tone} stroke={MP.ink} strokeWidth="2" />
      {/* nose — small wedge on the facing side */}
      <path
        d={`M ${cx + dir * (r - 3)} ${cy - 4.5} L ${cx + dir * (r + 3.5)} ${cy + 0.5} L ${cx + dir * (r - 3.5)} ${cy + 3.5}`}
        fill={tone} stroke={MP.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      {face !== 'none' && (
        eye === 'closed' ? (
          <path d={`M ${cx + dir * 8.5} ${cy - 3.5} Q ${cx + dir * 12} ${cy - 0.5} ${cx + dir * 15.5} ${cy - 3.5}`}
            fill="none" stroke={MP.ink} strokeWidth="1.8" strokeLinecap="round" />
        ) : (
          <circle cx={cx + dir * 12} cy={cy - 3.5} r="1.7" fill={MP.ink} />
        )
      )}
      {face === 'soft' && (
        <g>
          <path d={`M ${cx + dir * 7.5} ${cy - 9.5} Q ${cx + dir * 11.5} ${cy - 11.5} ${cx + dir * 15} ${cy - 9}`}
            fill="none" stroke={MP.ink} strokeWidth="1.5" strokeLinecap="round" />
          <path d={`M ${cx + dir * 10.5} ${cy + 7.5} Q ${cx + dir * 13} ${cy + 9} ${cx + dir * 15.5} ${cy + 7}`}
            fill="none" stroke={MP.ink} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

// Headphones worn on a head. Band over the top, one visible cup at the ear.
function FigPhones({ cx, cy, dir = -1, tilt = 0, waves = false }) {
  const bandR = 24;
  return (
    <g transform={`rotate(${tilt * -dir} ${cx} ${cy})`}>
      {/* band */}
      <path d={`M ${cx - bandR} ${cy + 3} A ${bandR} ${bandR} 0 0 1 ${cx + bandR} ${cy + 3}`}
        fill="none" stroke={MP.ink} strokeWidth="4.5" strokeLinecap="round" />
      <path d={`M ${cx - bandR + 3.5} ${cy} A ${bandR - 3.5} ${bandR - 3.5} 0 0 1 ${cx + bandR - 3.5} ${cy}`}
        fill="none" stroke={MP.hair} strokeWidth="1" />
      {/* stem band → cup */}
      <line x1={cx} y1={cy - bandR + 2} x2={cx} y2={cy - 8} stroke={MP.ink} strokeWidth="2.5" />
      {/* visible cup over the ear */}
      <rect x={cx - 6.5} y={cy - 8.5} width="13" height="21" rx="6"
        fill={MP.ground} stroke={MP.accent} strokeWidth="2.5" />
      <circle cx={cx} cy={cy + 2.5} r="2" fill={MP.accent} />
      {waves && (
        <g>
          {[28, 42, 56].map((rr, i) => (
            <path key={rr} className={dir === -1 ? 'mp-wave-front' : 'mp-wave-out'}
              style={i ? { animationDelay: `${-0.87 * i}s` } : null}
              d={window.arcPath(cx + dir * 4, cy + 2, rr, dir === -1 ? -178 : -82, dir === -1 ? -98 : -2)}
              fill="none" stroke={MP.accent} strokeWidth="1.8" opacity={0.75 - i * 0.25} />
          ))}
        </g>
      )}
    </g>
  );
}

// ── POSE 01 — THE LISTENER (seated, eyes closed, lost in sound) ────────────
function PoseListening({ anatomy = 'contour', face = 'line', annotated = false }) {
  const tone = figTone(anatomy);
  return (
    <svg viewBox="0 0 360 440" style={{ display: 'block', overflow: 'visible' }}>
      {/* floor + stool */}
      <line x1="36" y1="412" x2="324" y2="412" stroke={MP.hair} strokeWidth="1" />
      <line x1="120" y1="324" x2="214" y2="324" stroke={MP.ink} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="132" y1="327" x2="124" y2="410" stroke={MP.ink} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="202" y1="327" x2="212" y2="410" stroke={MP.ink} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="128" y1="372" x2="208" y2="372" stroke={MP.hair} strokeWidth="1.5" />

      {/* far leg behind torso */}
      <Limb tone={tone} d="M 176 310 L 104 318 L 116 402 M 116 402 L 90 406" />
      {/* neck */}
      <Limb tone={tone} d="M 164 162 L 162 190" />
      {/* torso — leaning back a touch */}
      <path d={`M 159 190
                C 147 200 144 228 146 254
                C 147 276 142 290 139 302
                Q 136 318 150 320
                L 192 320
                Q 202 318 200 304
                C 197 272 197 234 193 206
                Q 191 190 178 185
                Q 165 182 159 190 Z`}
        fill={tone} stroke={MP.ink} strokeWidth="2" strokeLinejoin="round" />
      {/* near leg */}
      <Limb tone={tone} d="M 160 308 L 88 304 L 98 400 M 98 400 L 70 404" />
      {/* near arm — hangs along the back, hand resting on thigh */}
      <Limb tone={tone} d="M 182 206 L 191 264 L 134 300" />
      {anatomy === 'drafted' && (
        <g>
          <line x1="166" y1="120" x2="166" y2="412" stroke={MP.faint} strokeWidth="1" strokeDasharray="1 5" />
          <JointDots pts={[[182, 206], [191, 264], [160, 308], [88, 304], [98, 400]]} />
        </g>
      )}
      {/* head — tilted back, eyes closed */}
      <ListenerHead cx={163} cy={146} dir={-1} tilt={9} face={face} eye="closed" tone={tone} />
      {/* cable — falls behind the back, exits at floor */}
      <path className="mp-cable" d="M 170 164 C 202 228 206 282 200 322 C 196 362 200 386 198 410"
        fill="none" stroke={MP.accent} strokeWidth="1.5" opacity="0.8" />
      <FigPhones cx={163} cy={146} dir={-1} tilt={9} waves={true} />

      {annotated && (
        <g className="mp-callouts">
          <ML x={36} y={84} size={9.5}>EYES CLOSED</ML>
          <Leader x1={66} y1={92} x2={149} y2={138} />
          <ML x={250} y={104} size={9.5}>BAND — STRUCTURE</ML>
          <Leader x1={258} y1={110} x2={177} y2={122} />
          <ML x={236} y={330} size={9.5}>SIGNAL</ML>
          <Leader x1={234} y1={326} x2={202} y2={300} />
        </g>
      )}
    </svg>
  );
}

// ── POSE 02 — THE BUILDER (at the bench, mid-assembly) ─────────────────────
function PoseBuilding({ anatomy = 'contour', face = 'line', annotated = false }) {
  const tone = figTone(anatomy);
  return (
    <svg viewBox="0 0 520 440" style={{ display: 'block', overflow: 'visible' }}>
      {/* floor */}
      <line x1="30" y1="412" x2="500" y2="412" stroke={MP.hair} strokeWidth="1" />
      {/* lamp — anglepoise clamped to the bench */}
      <g>
        <line x1="470" y1="294" x2="442" y2="190" stroke={MP.ink} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="442" y1="190" x2="374" y2="150" stroke={MP.ink} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="442" cy="190" r="3" fill={MP.ink} />
        <path d="M 374 142 L 352 178 L 398 182 Z" fill={tone} stroke={MP.ink} strokeWidth="2" strokeLinejoin="round" />
        <line x1="368" y1="184" x2="336" y2="288" stroke={MP.hair} strokeWidth="1" strokeDasharray="3 5" />
        <line x1="384" y1="185" x2="404" y2="288" stroke={MP.hair} strokeWidth="1" strokeDasharray="3 5" />
        <rect x="458" y="290" width="24" height="7" rx="2" fill={MP.ink} />
      </g>
      {/* stool */}
      <line x1="64" y1="334" x2="152" y2="334" stroke={MP.ink} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="76" y1="337" x2="70" y2="410" stroke={MP.ink} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="337" x2="148" y2="410" stroke={MP.ink} strokeWidth="2.5" strokeLinecap="round" />

      {/* far arm — steadying the cup */}
      <Limb tone={tone} d="M 196 216 L 244 260 L 286 290" />
      {/* far leg */}
      <Limb tone={tone} d="M 122 322 L 186 340 L 180 404 M 180 404 L 204 408" />
      {/* neck */}
      <Limb tone={tone} d="M 220 174 L 206 198" />
      {/* torso — leaning into the work */}
      <path d={`M 196 198
                C 178 216 162 248 150 274
                C 142 290 130 300 120 308
                Q 108 318 118 328
                L 152 332
                Q 164 332 170 318
                C 182 290 200 254 212 226
                Q 220 208 213 199
                Q 205 191 196 198 Z`}
        fill={tone} stroke={MP.ink} strokeWidth="2" strokeLinejoin="round" />
      {/* near leg */}
      <Limb tone={tone} d="M 130 320 L 196 332 L 192 404 M 192 404 L 218 408" />
      {/* near arm — driving the screw */}
      <Limb tone={tone} d="M 206 210 L 260 246 L 308 276" />
      {anatomy === 'drafted' && (
        <g>
          <JointDots pts={[[206, 210], [260, 246], [130, 320], [196, 332], [192, 404]]} />
        </g>
      )}
      {/* screwdriver in hand */}
      <line x1="308" y1="276" x2="326" y2="284" stroke={MP.ink} strokeWidth="5" strokeLinecap="round" />
      <line x1="326" y1="284" x2="346" y2="292" stroke={MP.ink} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="347.5" cy="292.5" r="2.4" fill={MP.accent} />
      {/* head — looking down at the work */}
      <ListenerHead cx={228} cy={156} dir={1} tilt={-14} face={face} eye="closed" tone={tone} />
      <FigPhones cx={228} cy={156} dir={1} tilt={-14} waves={false} />

      {/* bench — drawn over the legs */}
      <line x1="150" y1="298" x2="502" y2="298" stroke={MP.ink} strokeWidth="5" strokeLinecap="round" />
      <line x1="166" y1="303" x2="174" y2="410" stroke={MP.ink} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="478" y1="303" x2="486" y2="410" stroke={MP.ink} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="172" y1="364" x2="482" y2="364" stroke={MP.hair} strokeWidth="1.5" />

      {/* the work: cup shell under the driver hand, loose driver, screws, wire */}
      <path d="M 326 296 A 28 17 0 0 1 382 296" fill={tone} stroke={MP.ink} strokeWidth="2" />
      <path d="M 336 296 A 18 10 0 0 1 372 296" fill="none" stroke={MP.hair} strokeWidth="1" />
      <g className="mp-pulse-soft">
        <circle cx="414" cy="284" r="12.5" fill={MP.ground} stroke={MP.ink} strokeWidth="1.8" />
        <circle cx="414" cy="284" r="6" fill={MP.washAccent} stroke={MP.accent} strokeWidth="2.2" />
      </g>
      {[438, 448, 458].map((x) => <circle key={x} cx={x} cy="292" r="1.8" fill={MP.dark} />)}

      {annotated && (
        <g className="mp-callouts">
          <ML x={290} y={102} size={9.5}>WORK LIGHT</ML>
          <Leader x1={318} y1={108} x2={368} y2={146} />
          <ML x={404} y={246} size={9.5}>DRIVER — SET ASIDE</ML>
          <Leader x1={426} y1={252} x2={416} y2={270} />
          <ML x={56} y={236} size={9.5}>SEATED · LEAN 20°</ML>
          <Leader x1={118} y1={242} x2={160} y2={262} />
        </g>
      )}
    </svg>
  );
}

// ── POSE 03 — THE READER (studying a measurement on the wall) ──────────────
function PoseReading({ anatomy = 'contour', face = 'line', annotated = false }) {
  const tone = figTone(anatomy);
  return (
    <svg viewBox="0 0 420 440" style={{ display: 'block', overflow: 'visible' }}>
      <line x1="40" y1="412" x2="390" y2="412" stroke={MP.hair} strokeWidth="1" />
      {/* wall chart */}
      <g>
        <rect x="246" y="84" width="140" height="108" fill={MP.ground} stroke={MP.ink} strokeWidth="1.5" />
        <circle cx="316" cy="76" r="1.8" fill={MP.label} />
        <line x1="316" y1="78" x2="316" y2="84" stroke={MP.faint} strokeWidth="1" />
        <line x1="258" y1="176" x2="374" y2="176" stroke={MP.hair} strokeWidth="1" />
        <line x1="258" y1="100" x2="258" y2="176" stroke={MP.hair} strokeWidth="1" />
        <path d="M 258 142 C 280 138 296 148 314 144 C 334 140 352 122 372 126"
          fill="none" stroke={MP.faint} strokeWidth="1.2" strokeDasharray="4 3" />
        <path d="M 258 148 C 282 146 298 156 316 150 C 336 144 352 130 372 136"
          fill="none" stroke={MP.accent} strokeWidth="2" />
        <ML x={258} y={188} size={6.5}>FR — MEASURED VS TARGET</ML>
      </g>

      {/* far arm — holds the rolled print, hangs */}
      <Limb tone={tone} d="M 162 206 L 154 258 L 158 298" />
      {/* far leg */}
      <Limb tone={tone} d="M 176 304 L 182 356 L 186 402 M 186 402 L 208 406" />
      {/* neck */}
      <Limb tone={tone} d="M 169 158 L 171 192" />
      {/* torso — standing */}
      <path d={`M 162 190
                C 153 198 152 226 154 254
                C 156 276 154 290 153 302
                Q 152 314 164 316
                L 182 316
                Q 193 315 193 302
                C 193 274 196 240 194 212
                Q 193 194 182 188
                Q 170 184 162 190 Z`}
        fill={tone} stroke={MP.ink} strokeWidth="2" strokeLinejoin="round" />
      {/* near leg */}
      <Limb tone={tone} d="M 164 306 L 160 358 L 156 402 M 156 402 L 178 406" />
      {/* near arm — raised, hand at chin */}
      <Limb tone={tone} d="M 180 204 L 217 250 L 191 168" />
      {anatomy === 'drafted' && (
        <g>
          <JointDots pts={[[180, 204], [214, 246], [164, 306], [160, 358]]} />
          <line x1="172" y1="110" x2="172" y2="412" stroke={MP.faint} strokeWidth="1" strokeDasharray="1 5" />
        </g>
      )}
      {/* rolled measurement print in the far hand */}
      <line x1="140" y1="286" x2="180" y2="308" stroke={MP.ink} strokeWidth="5.5" strokeLinecap="round" />
      <line x1="140" y1="286" x2="180" y2="308" stroke={tone} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="140" cy="286" r="2.6" fill="none" stroke={MP.ink} strokeWidth="1.2" />
      {/* head — chin up a touch, eyes open, reading */}
      <ListenerHead cx={168} cy={140} dir={1} tilt={6} face={face} eye="open" tone={tone} />
      {/* headphones around the neck */}
      <g>
        <path d="M 150 184 A 19 17 0 0 0 188 184" fill="none" stroke={MP.ink} strokeWidth="4" strokeLinecap="round" />
        <rect x="142" y="176" width="15" height="21" rx="7" fill={MP.ground} stroke={MP.accent} strokeWidth="2.2" />
        <rect x="182" y="176" width="15" height="21" rx="7" fill={MP.ground} stroke={MP.accent} strokeWidth="2.2" />
      </g>

      {annotated && (
        <g className="mp-callouts">
          <ML x={56} y={84} size={9.5}>SIGHT LINE</ML>
          <Leader x1={86} y1={92} x2={182} y2={136} />
          <line x1="186" y1="134" x2="252" y2="116" stroke={MP.faint} strokeWidth="1" strokeDasharray="3 4" />
          <ML x={228} y={232} size={9.5}>PHONES — AT REST</ML>
          <Leader x1={236} y1={226} x2={194} y2={188} />
        </g>
      )}
    </svg>
  );
}

// ── POSE 04 — THE INSPECTOR (driver held to the light) ─────────────────────
function PoseInspecting({ anatomy = 'contour', face = 'line', annotated = false }) {
  const tone = figTone(anatomy);
  return (
    <svg viewBox="0 0 360 440" style={{ display: 'block', overflow: 'visible' }}>
      <line x1="30" y1="412" x2="330" y2="412" stroke={MP.hair} strokeWidth="1" />

      {/* far arm */}
      <Limb tone={tone} d="M 200 212 L 162 252 L 130 178" />
      {/* far leg */}
      <Limb tone={tone} d="M 196 306 L 200 358 L 204 402 M 204 402 L 226 406" />
      {/* neck */}
      <Limb tone={tone} d="M 190 162 L 191 192" />
      {/* torso */}
      <path d={`M 182 192
                C 173 200 172 228 174 256
                C 176 278 174 292 173 304
                Q 172 316 184 318
                L 202 318
                Q 213 317 213 304
                C 213 276 216 242 214 214
                Q 213 196 202 190
                Q 190 186 182 192 Z`}
        fill={tone} stroke={MP.ink} strokeWidth="2" strokeLinejoin="round" />
      {/* near leg */}
      <Limb tone={tone} d="M 184 308 L 180 360 L 176 402 M 176 402 L 198 406" />
      {/* near arm — holding the cup up */}
      <Limb tone={tone} d="M 192 206 L 148 248 L 114 172" />
      {anatomy === 'drafted' && (
        <g>
          <JointDots pts={[[192, 206], [150, 250], [184, 308], [180, 360]]} />
          <line x1="192" y1="110" x2="192" y2="412" stroke={MP.faint} strokeWidth="1" strokeDasharray="1 5" />
        </g>
      )}
      {/* the cup, held at eye level — driver seated, examined */}
      <g className="mp-pulse-soft">
        <circle cx="104" cy="148" r="25" fill={tone} stroke={MP.ink} strokeWidth="2.2" />
        <circle cx="104" cy="148" r="16.5" fill={MP.ground} stroke={MP.ink} strokeWidth="1.4" />
        <circle cx="104" cy="148" r="7.5" fill={MP.washAccent} stroke={MP.accent} strokeWidth="2.4" />
        {[45, 135, 225, 315].map((a) => {
          const rad = (a * Math.PI) / 180;
          return <circle key={a} cx={104 + 21 * Math.cos(rad)} cy={148 + 21 * Math.sin(rad)} r="1.5" fill={MP.dark} />;
        })}
      </g>
      {/* head — facing the part */}
      <ListenerHead cx={190} cy={142} dir={-1} tilt={0} face={face} eye="open" tone={tone} />
      {/* headphones around the neck */}
      <path d="M 172 190 A 19 17 0 0 0 210 190" fill="none" stroke={MP.ink} strokeWidth="4" strokeLinecap="round" />
      <rect x="164" y="182" width="15" height="21" rx="7" fill={MP.ground} stroke={MP.accent} strokeWidth="2.2" />

      {annotated && (
        <g className="mp-callouts">
          <ML x={32} y={84} size={9.5}>DRIVER — SEATED</ML>
          <Leader x1={66} y1={92} x2={100} y2={126} />
          <ML x={244} y={120} size={9.5}>QC — BY EYE</ML>
          <Leader x1={252} y1={126} x2={208} y2={140} />
        </g>
      )}
    </svg>
  );
}

const MP_POSES = {
  listening: PoseListening,
  building: PoseBuilding,
  reading: PoseReading,
  inspecting: PoseInspecting,
};

function ListenerFig({ pose = 'listening', anatomy = 'contour', face = 'line', annotated = false, width }) {
  const Cmp = MP_POSES[pose] || PoseListening;
  return (
    <div style={{ width: width || '100%' }}>
      <Cmp anatomy={anatomy} face={face} annotated={annotated} />
    </div>
  );
}

Object.assign(window, {
  ListenerFig, PoseListening, PoseBuilding, PoseReading, PoseInspecting,
  ListenerHead, FigPhones, Limb,
});
