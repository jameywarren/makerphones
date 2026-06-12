// MakerPhones logo system — marks, wordmark, lockups.
// Dialect: line-led, charcoal structure, orange = one small active element.
// All colors via tokens so dark mode + mono fall out of scoping.

const { MP, arcPath } = window;

// ── Symbol S1 — THE DRIVER (section mark) ───────────────────────────────────
// Concentric driver section: surround, voice coil ring, orange dome dot.
function MarkDriver({ size = 64, mono = false }) {
  const ink = 'currentColor';
  const dot = mono ? 'currentColor' : 'var(--mp-accent, #ea580c)';
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: 'block' }} aria-label="makerphones mark">
      <circle cx="32" cy="32" r="24" fill="none" stroke={ink} strokeWidth="5" />
      <circle cx="32" cy="32" r="13.5" fill="none" stroke={ink} strokeWidth="2.5" />
      <circle cx="32" cy="32" r="4.2" fill={dot} />
    </svg>
  );
}

// ── Symbol S2 — THE MONOGRAM (m as headphone) ──────────────────────────────
// Lowercase m: outer stems land in solid cups; the middle stem terminates
// in a leader dot — the annotation language, hiding in the letter.
function MarkMonogram({ size = 64, mono = false }) {
  const ink = 'currentColor';
  const dot = mono ? 'currentColor' : 'var(--mp-accent, #ea580c)';
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: 'block' }} aria-label="makerphones monogram">
      <path d="M 11 46 L 11 27 Q 11 13 23 13 Q 32 13 32 25 L 32 36 M 32 27 Q 32 13 44 13 Q 53 13 53 27 L 53 46"
        fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="40" width="11" height="16" rx="5" fill={ink} />
      <rect x="47.5" y="40" width="11" height="16" rx="5" fill={ink} />
      <circle cx="32" cy="44.5" r="2.6" fill={dot} />
    </svg>
  );
}

// ── Symbol S3 — THE CUP (sound leaving a cup) ──────────────────────────────
function MarkCup({ size = 64, mono = false }) {
  const ink = 'currentColor';
  const mid = mono ? 'currentColor' : 'var(--mp-accent, #ea580c)';
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: 'block' }} aria-label="makerphones mark">
      <rect x="9" y="19" width="17" height="26" rx="8" fill={ink} />
      <path d={arcPath(30, 32, 12, -38, 38)} fill="none" stroke={mid} strokeWidth="4.5" strokeLinecap="round" />
      <path d={arcPath(30, 32, 21, -38, 38)} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d={arcPath(30, 32, 30, -38, 38)} fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

const MP_MARKS = { driver: MarkDriver, monogram: MarkMonogram, cup: MarkCup };

// ── Wordmark ────────────────────────────────────────────────────────────────
// Schibsted Grotesk, lowercase, tight. detail: 'plain' | 'dot' | 'driver-o'
function Wordmark({ size = 40, detail = 'dot', mono = false }) {
  const accent = mono ? 'currentColor' : 'var(--mp-accent, #ea580c)';
  const base = {
    fontFamily: "'Schibsted Grotesk', system-ui, sans-serif",
    fontWeight: 700, letterSpacing: '-0.03em', fontSize: size,
    lineHeight: 1, color: 'currentColor', whiteSpace: 'nowrap', display: 'inline-block',
  };
  if (detail === 'driver-o') {
    return (
      <span style={base}>
        makerph<svg viewBox="0 0 56 56" style={{ height: '0.56em', width: '0.56em', margin: '0 0.015em', display: 'inline-block' }}>
          <circle cx="28" cy="28" r="23" fill="none" stroke="currentColor" strokeWidth="9.5" />
          <circle cx="28" cy="28" r="6.5" fill={accent} />
        </svg>nes
      </span>
    );
  }
  return (
    <span style={base}>
      makerphones
      {detail === 'dot' && (
        <span style={{ width: '0.115em', height: '0.115em', borderRadius: '50%', background: accent,
          display: 'inline-block', marginLeft: '0.09em' }}></span>
      )}
    </span>
  );
}

// ── Lockups ─────────────────────────────────────────────────────────────────
function Lockup({ symbol = 'monogram', detail = 'dot', layout = 'horizontal', size = 40, mono = false }) {
  const Mark = MP_MARKS[symbol] || MarkMonogram;
  if (layout === 'symbol') return <Mark size={size * 1.4} mono={mono} />;
  if (layout === 'stacked') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.45 }}>
        <Mark size={size * 1.55} mono={mono} />
        <Wordmark size={size * 0.92} detail={detail} mono={mono} />
      </div>
    );
  }
  if (layout === 'tagline') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: size * 0.34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.42 }}>
          <Mark size={size * 1.18} mono={mono} />
          <Wordmark size={size} detail={detail} mono={mono} />
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size * 0.26,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: mono ? 'currentColor' : 'var(--mp-meta, #6b7280)',
          marginLeft: size * 1.6 }}>Build your own sound</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.42 }}>
      <Mark size={size * 1.18} mono={mono} />
      <Wordmark size={size} detail={detail} mono={mono} />
    </div>
  );
}

Object.assign(window, { MarkDriver, MarkMonogram, MarkCup, MP_MARKS, Wordmark, Lockup });
