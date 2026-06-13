// MakerPhones homepage — shared content + section components.
// All color via --mp-* tokens (see mp-theme.jsx). Copy marked ⚠ in the notes
// artboard is placeholder — real titles/copy come from the site.

const { MP, ML, MotifWave, MotifRuler, MotifFR, MotifArcs, MpIcon, MpDifficulty } = window;

const MP_CONTENT = {
  nav: ['The Manual', 'Bench Notes', 'Builds', 'About'],
  eyebrow: 'An open reference manual for headphone builders',
  title: ['Build Your Own', 'Sound.'],
  intro: 'A field guide to building headphones you can trust your ears to — how drivers make sound, why enclosures behave the way they do, and how to measure, tune, and prove the result.',
  ctaPrimary: 'Start the manual',
  ctaSecondary: 'Follow the build',
  parts: [
    { n: '01', icon: 'fundamentals', title: 'How Headphones Work', sum: 'Sound, pressure, and the moving parts between a signal and your ear.', d: 1 },
    { n: '02', icon: 'drivers', title: 'Drivers', sum: 'Dynamic, planar, electrostatic — the physics of moving air on purpose.', d: 2 },
    { n: '03', icon: 'enclosures', title: 'Cups & Cavities', sum: 'Open vs closed, air springs, standing waves. Enclosure acoustics, tamed.', d: 2 },
    { n: '04', icon: 'materials', title: 'Tools & Materials', sum: 'The bench, the parts bin, and what is actually worth buying well.', d: 1 },
    { n: '05', icon: 'build', title: 'The Build', sum: 'From a box of parts to a finished pair — assembly, wiring, sealing.', d: 3 },
    { n: '06', icon: 'measure', title: 'Measure & Tune', sum: 'Rigs, FR curves, decay plots — closing the loop between ear and data.', d: 3 },
  ],
  bio: {
    name: 'Jamey Warren',
    text: 'Twenty-five years designing pro audio — Grace Design, HeadRoom — now designing the Daily Driver, an open-back headphone, in the open. Every chapter in this manual comes off that bench.',
    meta: ['25+ YRS PRO AUDIO', 'GRACE DESIGN · HEADROOM', 'NOW — DAILY DRIVER'],
  },
  bench: {
    eyebrow: 'From the bench',
    title: 'Daily Driver',
    text: 'A closed-back studio headphone, designed and measured in public. Follow the prototypes, the dead ends, and the curves as they happen.',
    meta: [['STATUS', 'PROTOTYPE 04'], ['TARGET', 'CLOSED-BACK STUDIO REFERENCE'], ['LAST PASS', 'BAFFLE REV — REMEASURE']],
    cta: 'Read the bench notes',
    note: 'FR — ILLUSTRATIVE, NOT A PUBLISHED CURVE',
  },
};

// ── plate frame with corner ticks ───────────────────────────────────────────
function Plate({ children, label, pad = 0, grid = false, style }) {
  return (
    <figure className="mp-plate-fig" style={style}>
      <div className={'mp-plate' + (grid ? ' mp-grid-bg' : '')} style={{ padding: pad }}>
        <span className="pt pt-tl"></span><span className="pt pt-tr"></span>
        <span className="pt pt-bl"></span><span className="pt pt-br"></span>
        {children}
      </div>
      {label && <figcaption className="mono" style={{ marginTop: 10 }}>{label}</figcaption>}
    </figure>
  );
}

function MpPhoto({ id, h = 240, label, placeholder }) {
  return (
    <Plate label={label}>
      <image-slot id={id} shape="rect" placeholder={placeholder || 'Drop a photo'}
        style={{ width: '100%', height: h, display: 'block' }}></image-slot>
    </Plate>
  );
}

// ── nav ─────────────────────────────────────────────────────────────────────
function MpNav() {
  return (
    <header className="mp-nav">
      <div className="mp-nav-brand">
        <span className="mp-nav-mark"></span>
        <span className="mp-nav-word">MakerPhones</span>
      </div>
      <nav className="mp-nav-links">
        {MP_CONTENT.nav.map((l, i) => (
          <a key={l} className={'mono' + (i === 0 ? ' dark' : '')} href="#">{l}</a>
        ))}
      </nav>
      <span className="mono">v2 · Open manual</span>
    </header>
  );
}

// ── author strip ────────────────────────────────────────────────────────────
function MpBio({ slotId, variant = 'strip', plateLabel }) {
  const b = MP_CONTENT.bio;
  if (variant === 'margin') {
    return (
      <section className="mp-bio-margin">
        <div>
          <MpPhoto id={slotId} h={170} label={plateLabel || 'PLATE A — THE AUTHOR, AT THE BENCH'} placeholder="Bench portrait" />
        </div>
        <div>
          <p className="mono orange" style={{ marginBottom: 14 }}>Who is writing this</p>
          <p className="serif-lg" style={{ maxWidth: '46ch' }}>{b.text}</p>
          <div className="mp-meta-row">
            {b.meta.map((m) => <span key={m} className="mono">{m}</span>)}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="mp-bio-strip">
      <MpPhoto id={slotId} h={196} label="PLATE A — THE AUTHOR" placeholder="Bench portrait" />
      <div>
        <h3 className="h-display" style={{ fontSize: 26, marginBottom: 12 }}>{b.name}</h3>
        <p className="serif" style={{ maxWidth: '52ch' }}>{b.text}</p>
      </div>
      <div className="mp-meta-col">
        {b.meta.map((m) => <span key={m} className="mono">{m}</span>)}
      </div>
    </section>
  );
}

// ── part card / row ─────────────────────────────────────────────────────────
function MpPartCard({ part, hover = false, big = false }) {
  return (
    <article className={'mp-card' + (hover ? ' is-hover' : '') + (big ? ' is-big' : '')}>
      <div className="mp-card-top">
        <MpIcon name={part.icon} size={26} />
        <span className="mono orange">Part {part.n}</span>
        <span className="mp-card-diff"><MpDifficulty level={part.d} size={20} /></span>
      </div>
      <h3 className="h-display mp-card-title">{part.title}</h3>
      <p className="serif mp-card-sum">{part.sum}</p>
      <div className="mp-card-foot">
        <span className="mono dark">Read</span>
        <MpIcon name="arrow" size={15} />
      </div>
    </article>
  );
}

function MpPartsGrid({ withHover = true }) {
  return (
    <div className="mp-parts-grid">
      {MP_CONTENT.parts.map((p, i) => <MpPartCard key={p.n} part={p} hover={withHover && i === 1} />)}
    </div>
  );
}

// contents-list treatment (direction B)
function MpPartsIndex() {
  return (
    <div className="mp-toc">
      {MP_CONTENT.parts.map((p) => (
        <a key={p.n} className="mp-toc-row" href="#">
          <span className="mono orange" style={{ width: 76 }}>Part {p.n}</span>
          <MpIcon name={p.icon} size={20} />
          <span className="h-display mp-toc-title">{p.title}</span>
          <span className="mp-toc-dots"></span>
          <MpDifficulty level={p.d} size={18} />
          <span className="mono" style={{ width: 52, textAlign: 'right' }}>{p.d === 1 ? 'BASICS' : p.d === 2 ? 'INTERM.' : 'ADV.'}</span>
        </a>
      ))}
    </div>
  );
}

// ── bench band (dark, token re-scope demo) ──────────────────────────────────
function MpBench({ slotId, variant = 'split' }) {
  const b = MP_CONTENT.bench;
  return (
    <section className="mp-bench" style={{ background: 'var(--mp-ink, #111827)' }}>
      <div className="mp-darkscope mp-bench-in">
        <div className="mp-bench-copy">
          <p className="mono orange">{b.eyebrow}</p>
          <h2 className="h-display" style={{ fontSize: 46, margin: '14px 0 18px' }}>{b.title}</h2>
          <p className="serif-lg" style={{ maxWidth: '44ch' }}>{b.text}</p>
          <dl className="mp-bench-meta">
            {b.meta.map(([k, v]) => (
              <div key={k}><dt className="mono">{k}</dt><dd className="mono dark">{v}</dd></div>
            ))}
          </dl>
          <a className="mp-btn" href="#">{b.cta} <MpIcon name="arrow" size={14} color="currentColor" /></a>
        </div>
        <div className="mp-bench-fig">
          <div className="mp-plate" style={{ padding: '20px 16px 8px' }}>
            <span className="pt pt-tl"></span><span className="pt pt-tr"></span>
            <span className="pt pt-bl"></span><span className="pt pt-br"></span>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 6px' }}>
              <span className="mono orange">MEASURED — P04</span>
              <span className="mono">TARGET · DASHED</span>
            </div>
            <MotifFR w={620} h={250} />
            <p className="mono" style={{ padding: '8px 8px 6px', opacity: 0.75 }}>{b.note}</p>
          </div>
          {variant === 'split' && (
            <MpPhoto id={slotId} h={180} label="PLATE B — THE WORKSHOP" placeholder="Workshop / bench photo" />
          )}
        </div>
      </div>
    </section>
  );
}

// ── footer ──────────────────────────────────────────────────────────────────
function MpFooter() {
  return (
    <footer className="mp-footer">
      <span className="mono dark">MakerPhones</span>
      <span className="mono">Build your own sound.</span>
      <nav style={{ display: 'flex', gap: 28 }}>
        {['Manual', 'Bench notes', 'RSS', 'Contact'].map((l) => <a key={l} className="mono" href="#">{l}</a>)}
      </nav>
    </footer>
  );
}

Object.assign(window, { MP_CONTENT, Plate, MpPhoto, MpNav, MpBio, MpPartCard, MpPartsGrid, MpPartsIndex, MpBench, MpFooter });
