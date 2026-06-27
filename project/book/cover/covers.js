/* The Art and Science of Headphone Design — final cover (Direction A: field plate).
 * Published by Warren Labs · written by Jamey Warren · © Jamey Warren.
 *
 * Warren Labs logo = the official W-sine-wave mark + tracked wordmark, from
 * warren-labs/warrenlabs-site/assets/brand/svg (wl-mark / wl-lockup_horizontal).
 * Recolored from the native near-black graphite (#16181B) to the book's warm
 * charcoal (--mp-charcoal #2d3748) so it reads as a quiet imprint on the warm
 * cover; wordmark set in the cover's Schibsted Grotesk (the native Barlow isn't
 * loaded here). Rendered by JS because the front composition appears twice
 * (standalone front frame + the wrap's front panel) — one source of truth. */
(function () {
  const TITLE_LINES = ['The Art and', 'Science of', 'Headphone', 'Design'];
  const EDITION = 'FIRST EDITION · 2026';

  /* Warren Labs mark — the W sine wave (official path; do not redraw).
   * `rot` rotates the mark (used on the spine to match the vertical imprint). */
  function wlMark(px, rot) {
    const w = px || 20, h = Math.round((w * 80) / 120);
    const t = rot ? 'transform:rotate(' + rot + 'deg);' : '';
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 120 80" aria-hidden="true" ' +
      'style="display:inline-block;flex:none;vertical-align:middle;' + t + '">' +
      '<path d="M16 16 C20 38 28 62 39 62 C48 62 53 46 58 38 C63 30 70 30 76 38 C81 44 84 54 92 54 C99 54 103 46 106 40" ' +
      'fill="none" stroke="var(--mp-charcoal,#2d3748)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function wlLogo() {
    return '<span class="logo logo-wl" data-logo="warren-labs">' +
      wlMark(22) +
      '<span class="logo-name" style="font-weight:600;font-size:12px;letter-spacing:.2em;' +
      'text-transform:uppercase;color:var(--mp-charcoal)">Warren Labs</span></span>';
  }
  const titleHTML = () => TITLE_LINES.map((l) => '<span class="tl">' + l + '</span>').join('');
  function plate(figId) {
    return '<figure class="fr-plate">' +
      '<span class="tick tl"></span><span class="tick tr"></span>' +
      '<span class="tick bl"></span><span class="tick br"></span>' +
      '<div class="fr-holder">' + window.FR_PLATE_SVG + '</div>' +
      '<figcaption class="fr-cap"><b>' + figId + '</b> &mdash; measured response (orange) vs target (charcoal, dashed)</figcaption>' +
      '</figure>';
  }

  /* ── front cover ────────────────────────────────────────────────────── */
  function front() {
    return '<div class="cf cf-a">' +
      '<div class="blueprint"></div>' +
      '<div class="cf-inner">' +
        '<div class="cf-top">' +
          '<div class="ruler"></div>' +
          '<h1 class="cf-title">' + titleHTML() + '</h1>' +
          '<p class="cf-tag">A bench guide to how headphones are designed, measured &amp; built</p>' +
        '</div>' +
        plate('FIG. 1') +
        '<div class="cf-foot">' +
          '<div class="byline"><span class="by-label mono">BY</span><span class="author">Jamey Warren</span></div>' +
          '<div class="foot-r">' + wlLogo() + '<span class="kicker-foot mono">' + EDITION + '</span></div>' +
        '</div>' +
      '</div></div>';
  }
  window.front = front;

  /* ── back cover ─────────────────────────────────────────────────────── */
  function backCover() {
    return '<div class="cb">' +
      '<div class="blueprint"></div>' +
      '<div class="cb-inner">' +
        '<div class="cb-top">' +
          '<div class="ruler"></div>' +
          '<p class="cb-lead">A headphone is a small, stubborn acoustic system &mdash; a driver, a sealed cavity, a pad against your skull &mdash; and every decision you make about it shows up in the measurement.</p>' +
          '<p class="cb-body">This is the bench guide to those decisions: how sound is made, how it is measured, and how to read the curve every reviewer reaches for and most read wrong. It works from first principles to a finished tuning &mdash; driver excursion, the physics of the sealed cavity, frequency response and the target you tune toward, distortion, and the build steps that hold it together.</p>' +
          '<p class="cb-body">Every figure is drawn, not photographed &mdash; one you could redraw at the bench. Written for the people who actually open the cup: DIY builders, audio engineers, and anyone who wants to stop trusting graphs they cannot interpret. Read it once and the line stops being a mystery; you will know what to change, and why.</p>' +
        '</div>' +
        '<div class="cb-bio">' +
          '<p class="cb-bio-txt"><b>Jamey Warren</b> designs and measures headphones, and has spent years tuning them on the bench &mdash; mostly where the coffee is cold and the seal is never quite right.</p>' +
        '</div>' +
        '<div class="cb-foot">' +
          '<div class="cb-foot-l">' + wlLogo() +
            '<span class="cb-url mono">warrenlabs.com</span>' +
            '<span class="cb-copy mono">© 2026 Jamey Warren</span>' +
          '</div>' +
          '<div class="isbn">' +
            '<div class="isbn-bars" aria-hidden="true"></div>' +
            '<span class="isbn-cap mono">ISBN / BARCODE · placed by printer</span>' +
          '</div>' +
        '</div>' +
      '</div></div>';
  }
  window.backCover = backCover;

  /* ── spine ──────────────────────────────────────────────────────────── */
  function spineEl() {
    // Exact spine geometry: author pinned at the head, title locked to the true
    // centre, Warren Labs + mark at the foot, orange dots at the 1/4 & 3/4 marks
    // so they sit evenly between the three elements. Each run is rotated to read
    // top→bottom down the spine.
    var vt = 'writing-mode:vertical-rl;white-space:nowrap;';
    var ctr = 'position:absolute;left:50%;';
    var dot = function (top) {
      return '<span style="' + ctr + 'top:' + top + ';transform:translate(-50%,-50%) rotate(180deg);' +
        'color:var(--cover-accent);font-weight:700;font-size:13px;line-height:1">&bull;</span>';
    };
    return '<div class="sp-inner" style="position:absolute;inset:0">' +
      '<span class="sp-author mono" style="' + ctr + 'top:0.4in;transform:translateX(-50%) rotate(180deg);' + vt +
        'font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--mp-meta)">Jamey Warren</span>' +
      dot('25%') +
      '<span class="sp-title" style="' + ctr + 'top:50%;transform:translate(-50%,-50%) rotate(180deg);' + vt +
        'font-family:var(--sans);font-weight:700;font-size:15px;letter-spacing:-.01em;color:var(--mp-charcoal)">' +
        'The Art and Science of Headphone Design</span>' +
      dot('75%') +
      '<span class="sp-imprint mono" style="' + ctr + 'bottom:0.4in;transform:translateX(-50%) rotate(180deg);' + vt +
        'display:flex;align-items:center;gap:8px;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--mp-meta)">' +
        wlMark(20, 90) + 'Warren Labs</span>' +
    '</div>';
  }
  window.spineEl = spineEl;

  /* ── render ─────────────────────────────────────────────────────────── */
  function init() {
    const f = document.getElementById('front-main'); if (f) f.innerHTML = front();
    const wf = document.getElementById('wrap-front'); if (wf) wf.innerHTML = front();
    const wb = document.getElementById('wrap-back'); if (wb) wb.innerHTML = backCover();
    const ws = document.getElementById('wrap-spine'); if (ws) ws.innerHTML = spineEl();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
