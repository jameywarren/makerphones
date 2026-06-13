// MakerPhones homepage — three layout directions (1440px artboards).
// A · Refined Manual — same bones, better rhythm
// B · Field Guide — asymmetric editorial spread with marginalia
// C · Cover & Plates — frontispiece cover + plate system

const {
  MP, MP_CONTENT, MpNav, MpBio, MpPartsGrid, MpPartsIndex, MpBench, MpFooter,
  MpPhoto, Plate, MpIcon, MpDifficulty, MotifWave, MotifRuler, MotifArcs,
  HeroExploded, PoseListening, PoseBuilding, PoseReading, PoseInspecting,
} = window;

function CtaRow({ light }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <a className="mp-btn primary" href="#">{MP_CONTENT.ctaPrimary} <MpIcon name="arrow" size={14} color="currentColor" /></a>
      <a className="mp-btn" href="#">{MP_CONTENT.ctaSecondary}</a>
    </div>
  );
}

// ── A · REFINED MANUAL ──────────────────────────────────────────────────────
function HomeA({ t }) {
  return (
    <div className="mp-page" data-screen-label="Homepage A — Refined Manual" style={{ width: 1440 }}>
      <MpNav />

      <section className="mp-heroA">
        <div className="mp-heroA-copy">
          <p className="mono orange">{MP_CONTENT.eyebrow}</p>
          <h1 className="h-display" style={{ fontSize: 78, margin: '22px 0 26px' }}>
            {MP_CONTENT.title[0]}<br />{MP_CONTENT.title[1].replace('.', '')}<span style={{ color: 'var(--mp-accent, #ea580c)' }}>.</span>
          </h1>
          <p className="serif-lg" style={{ maxWidth: '46ch', marginBottom: 36 }}>{MP_CONTENT.intro}</p>
          <CtaRow />
          <p className="mono" style={{ marginTop: 36 }}>Six parts · Free · Written from the bench</p>
        </div>
        <div className="mp-heroA-fig">
          <Plate grid pad={20} label="FIG. H — DAILY DRIVER, EXPLODED · HOVER TO ASSEMBLE">
            <HeroExploded weight={t.heroWeight} motion={t.heroMotion} annotated={true} />
          </Plate>
        </div>
      </section>

      <MotifRuler w={1440} />

      <MpBio slotId="a-bio" />

      <section className="mp-sec">
        <div className="mp-sec-head">
          <div>
            <p className="mono orange">The manual</p>
            <h2 className="h-display" style={{ fontSize: 40, margin: '12px 0 14px' }}>Six parts, in order</h2>
            <p className="serif" style={{ maxWidth: '46ch' }}>Read it like a course or raid it like a reference — each part stands on its own.</p>
          </div>
          <div style={{ width: 230, flexShrink: 0 }}>
            <PoseReading anatomy="contour" face={t.face} annotated={false} />
          </div>
        </div>
        <MpPartsGrid />
      </section>

      <section className="mp-breakA">
        <div style={{ width: 280, flexShrink: 0 }}>
          <PoseListening anatomy="contour" face={t.face} annotated={false} />
        </div>
        <div style={{ flex: 1, alignSelf: 'center' }}>
          <MotifWave w={900} h={80} />
          <p className="mono" style={{ marginTop: 14 }}>INTERLUDE — WHAT IT IS ALL FOR</p>
        </div>
      </section>

      <MpBench slotId="a-bench" />
      <MpFooter />
    </div>
  );
}

// ── B · FIELD GUIDE ─────────────────────────────────────────────────────────
function HomeB({ t }) {
  return (
    <div className="mp-page mp-pageB" data-screen-label="Homepage B — Field Guide" style={{ width: 1440 }}>
      <aside className="mp-rail">
        <span className="mp-nav-mark" style={{ margin: '22px auto 0' }}></span>
        <span className="mono mp-rail-text">MakerPhones — An open reference manual · MP-2</span>
        <div className="mp-rail-nums">
          {MP_CONTENT.parts.map((p) => <span key={p.n} className="mono">{p.n}</span>)}
        </div>
      </aside>

      <div className="mp-pageB-main">
        <MpNav />

        <section className="mp-heroB mp-grid-bg">
          <div className="mp-heroB-marg">
            <p className="mono orange" style={{ marginBottom: 18 }}>{MP_CONTENT.eyebrow}</p>
            {[['01', 'A complete manual — driver physics to finished pair'],
              ['02', 'Measured, not vibes: every claim has a curve'],
              ['03', 'Daily Driver built in the open, below']].map(([n, txt]) => (
                <p key={n} className="mp-marginalia">
                  <span className="mono orange">{n}</span>
                  <span className="mono" style={{ textTransform: 'none', letterSpacing: '0.04em' }}>{txt}</span>
                </p>
              ))}
          </div>
          <div className="mp-heroB-stage">
            <h1 className="h-display mp-heroB-title">
              Build Your<br />Own Sound<span style={{ color: 'var(--mp-accent, #ea580c)' }}>.</span>
            </h1>
            <div className="mp-heroB-fig">
              <HeroExploded weight={t.heroWeight} motion={t.heroMotion} annotated={true} />
            </div>
            <div className="mp-heroB-foot">
              <p className="serif-lg" style={{ maxWidth: '40ch' }}>{MP_CONTENT.intro}</p>
              <CtaRow />
            </div>
          </div>
        </section>

        <section className="mp-sec">
          <div className="mp-secB-grid">
            <div>
              <p className="mono orange">Contents</p>
              <h2 className="h-display" style={{ fontSize: 38, margin: '12px 0 30px' }}>The manual in six parts</h2>
              <MpPartsIndex />
            </div>
            <div className="mp-secB-side">
              <div style={{ width: 330 }}>
                <PoseBuilding anatomy="contour" face={t.face} annotated={true} />
              </div>
              <p className="mono" style={{ marginTop: 8 }}>FIG. B — THE WORK, MID-ASSEMBLY</p>
            </div>
          </div>
        </section>

        <MpBio slotId="b-bio" variant="margin" />
        <MpBench slotId="b-bench" />
        <MpFooter />
      </div>
    </div>
  );
}

// ── C · COVER & PLATES ──────────────────────────────────────────────────────
function HomeC({ t }) {
  const poses = [
    { C: PoseListening, cap: 'PLATE I — THE LISTENER' },
    { C: PoseBuilding, cap: 'PLATE II — THE BUILDER' },
    { C: PoseInspecting, cap: 'PLATE III — THE INSPECTOR' },
  ];
  return (
    <div className="mp-page" data-screen-label="Homepage C — Cover & Plates" style={{ width: 1440 }}>
      <MpNav />

      <section className="mp-heroC mp-grid-bg">
        <div className="mp-coverplate">
          <span className="pt pt-tl"></span><span className="pt pt-tr"></span>
          <span className="pt pt-bl"></span><span className="pt pt-br"></span>
          <div className="mp-cover-toprow">
            <span className="mono">MP-2 · Field manual</span>
            <span className="mono orange">{MP_CONTENT.eyebrow}</span>
            <span className="mono">2026 · Open edition</span>
          </div>
          <h1 className="h-display mp-cover-title">Build Your Own Sound<span style={{ color: 'var(--mp-accent, #ea580c)' }}>.</span></h1>
          <div className="mp-cover-fig">
            <HeroExploded weight={t.heroWeight} motion={t.heroMotion} annotated={true} />
          </div>
          <div className="mp-cover-botrow">
            <span className="mono">J. Warren</span>
            <CtaRow />
            <span className="mono">Six parts · Free</span>
          </div>
        </div>
      </section>

      <section className="mp-sec">
        <div className="mp-platerow">
          {poses.map(({ C, cap }, i) => (
            <Plate key={cap} label={cap} pad={14}>
              <div style={{ width: '100%' }}><C anatomy="contour" face={t.face} annotated={i === 0} /></div>
            </Plate>
          ))}
        </div>
      </section>

      <section className="mp-sec" style={{ paddingTop: 0 }}>
        <div className="mp-sec-head" style={{ marginBottom: 36 }}>
          <div>
            <p className="mono orange">The manual</p>
            <h2 className="h-display" style={{ fontSize: 40, margin: '12px 0 0', whiteSpace: 'nowrap' }}>Six parts, in order</h2>
          </div>
        </div>
        <div className="mp-plates-grid">
          {MP_CONTENT.parts.map((p) => (
            <article key={p.n} className="mp-plate-card">
              <span className="mp-bignum h-display">{p.n}</span>
              <div className="mp-plate-card-in">
                <MpIcon name={p.icon} size={24} />
                <h3 className="h-display" style={{ fontSize: 20, margin: '14px 0 8px' }}>{p.title}</h3>
                <p className="serif mp-card-sum">{p.sum}</p>
                <div className="mp-card-foot" style={{ marginTop: 16 }}>
                  <MpDifficulty level={p.d} size={18} />
                  <span className="mono dark">Read</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <MpBench slotId="c-bench" variant="nophoto" />

      <section className="mp-sec">
        <p className="mono orange" style={{ marginBottom: 18 }}>From the community — finished builds</p>
        <div className="mp-platerow">
          <MpPhoto id="c-build-1" h={220} label="PLATE IV — BUILD 014" placeholder="Finished build photo" />
          <MpPhoto id="c-build-2" h={220} label="PLATE V — BUILD 022" placeholder="Finished build photo" />
          <MpPhoto id="c-build-3" h={220} label="PLATE VI — THE BENCH" placeholder="Workshop photo" />
        </div>
      </section>

      <MpFooter />
    </div>
  );
}

// ── D · FIELD MANUAL — merge of B + C ─────────────────────────────────────
// C's cover-plate framing + modern composition · B's contents/marginalia
// structure. No illustrated figures — the human element is real photography
// in the framed plates.
function HomeD({ t }) {
  return (
    <div className="mp-page" data-screen-label="Homepage D — Field Manual (B+C merge)" style={{ width: 1440 }}>
      <MpNav />

      <section className="mp-heroC mp-grid-bg">
        <div className="mp-coverplate">
          <span className="pt pt-tl"></span><span className="pt pt-tr"></span>
          <span className="pt pt-bl"></span><span className="pt pt-br"></span>
          <div className="mp-cover-toprow">
            <span className="mono">MP-2 · Field manual</span>
            <span className="mono orange">{MP_CONTENT.eyebrow}</span>
            <span className="mono">2026 · Open edition</span>
          </div>
          <div className="mp-heroD-grid">
            <div>
              <h1 className="h-display" style={{ fontSize: 74, margin: '0 0 24px' }}>
                Build Your<br />Own Sound<span style={{ color: 'var(--mp-accent, #ea580c)' }}>.</span>
              </h1>
              <p className="serif-lg" style={{ maxWidth: '42ch', marginBottom: 32 }}>{MP_CONTENT.intro}</p>
              <CtaRow />
              <div className="mp-heroD-marg">
                {[['01', 'A complete manual — driver physics to finished pair'],
                  ['02', 'Measured, not vibes: every claim has a curve'],
                  ['03', 'Daily Driver built in the open, below']].map(([n, txt]) => (
                    <p key={n} className="mp-marginalia" style={{ maxWidth: 360 }}>
                      <span className="mono orange">{n}</span>
                      <span className="mono" style={{ textTransform: 'none', letterSpacing: '0.04em' }}>{txt}</span>
                    </p>
                  ))}
              </div>
            </div>
            <div>
              <HeroExploded weight={t.heroWeight} motion={t.heroMotion} annotated={true} />
            </div>
          </div>
          <div className="mp-cover-botrow">
            <span className="mono">J. Warren</span>
            <span className="mono">Six parts · Free · Written from the bench</span>
            <span className="mono">FIG. H — DAILY DRIVER, EXPLODED</span>
          </div>
        </div>
      </section>

      <MotifRuler w={1440} />

      <section className="mp-sec">
        <div className="mp-secB-grid" style={{ alignItems: 'start' }}>
          <div>
            <p className="mono orange">Contents</p>
            <h2 className="h-display" style={{ fontSize: 38, margin: '12px 0 30px', whiteSpace: 'nowrap' }}>The manual in six parts</h2>
            <MpPartsIndex />
          </div>
          <div style={{ paddingTop: 86 }}>
            <MpPhoto id="d-bench" h={330} label="PLATE I — THE BENCH, TODAY" placeholder="Workshop photo" />
          </div>
        </div>
      </section>

      <MpBio slotId="d-bio" variant="margin" plateLabel="PLATE II — THE AUTHOR, AT THE BENCH" />

      <section className="mp-sec" style={{ paddingTop: 56 }}>
        <p className="mono orange" style={{ marginBottom: 18 }}>The record — prototypes & builds</p>
        <div className="mp-platerow">
          <MpPhoto id="d-proto" h={230} label="PLATE III — PROTOTYPE 04" placeholder="Prototype photo" />
          <MpPhoto id="d-build" h={230} label="PLATE IV — BUILD 022, COMMUNITY" placeholder="Finished build photo" />
          <MpPhoto id="d-pair" h={230} label="PLATE V — FINISHED PAIR" placeholder="Finished pair photo" />
        </div>
      </section>

      <MpBench slotId="d-shop" variant="nophoto" />
      <MpFooter />
    </div>
  );
}

Object.assign(window, { HomeA, HomeB, HomeC, HomeD });
