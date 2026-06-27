# Publishing runbook — *The Art and Science of Headphone Design*

The exact, ordered path to get the paperback + ebook live on **Amazon KDP**
and **IngramSpark**, publishing under our own imprint and our own ISBNs.

This is an operational runbook: do the steps in order, honor the decision
gates, don't skip the proof. Specs verified late June 2026 — reconfirm the
two live calculators (KDP cover calculator, KDP/IngramSpark pricing/comp
calculators) at upload time, since printing costs changed in the Feb 2026
pricing update.

---

## 0. The book, in one block (paste-ready metadata)

Use this exact metadata everywhere. Keeping it identical across KDP and
Ingram is what makes the two listings merge cleanly on Amazon.

| Field | Value |
|---|---|
| **Title** | The Art and Science of Headphone Design |
| **Subtitle** | A bench guide to how headphones are designed, measured & built |
| **Author** | Jamey Warren |
| **Imprint / Publisher of record** | Warren Labs |
| **Publisher website** | warrenlabs.com |
| **Edition** | First Edition · 2026 |
| **Copyright** | © 2026 Jamey Warren |
| **Paperback ISBN** | 979-8-9968299-0-3 |
| **Ebook ISBN** | 979-8-9968299-1-0 |
| **Trim** | 7 × 10 in (178 × 229 mm) |
| **Page count** | ~282 pp |
| **Interior** | Premium color, print-on-demand |
| **Spine width (282 pp, KDP white)** | ≈ 0.635 in (recompute at final page count) |
| **Language** | English |
| **Audience** | Adult / professional / technical reference |
| **List price (paperback)** | TBD — see §7 pricing math; floor ≈ $34 |

**Categories / BISAC (pick 2–3, same on both platforms):**
- `TEC008000` TECHNOLOGY & ENGINEERING / Acoustics & Sound
- `TEC061000` TECHNOLOGY & ENGINEERING / Electronics / Circuits / General
  *(or `TEC067000` Signals & Signal Processing)*
- `CRA046000` CRAFTS & HOBBIES / Electronics *(DIY/maker shelf)*

**Keywords (7 slots, KDP):** headphone design; headphone measurement;
audio engineering; DIY headphones; frequency response tuning; acoustic
design; build your own headphones.

**Back-cover blurb + author bio:** already finalized in the right voice in
`project/book/cover/covers.js` (the `backCover()` and bio strings). The
short Amazon/Ingram **description** should be a trimmed version of that
blurb — do not write a new one from scratch; lift it so the cover and the
listing agree.

> **Note on the free online edition:** the full text is free at
> makerphones.com under CC BY-NC (text) — that is fine and does not block
> KDP/Ingram. The print + ebook are the *packaged* editions (typeset,
> indexed, covered). No exclusivity program (do **not** enroll in KDP
> Select / KDP Exclusive — that demands Amazon exclusivity and would
> conflict with both Ingram and the free web edition).

---

## 1. Files: what we have and where each one goes

All press files are produced from the single-source pipeline (see
`project/book/PLAN.md`). Generate them on the author's machine (the build
sandbox lacks Chromium + Ghostscript):

| Command | Output | Use |
|---|---|---|
| `npm run book:press:pdf` | `dist/book-press-cmyk.pdf` | **KDP interior** (CMYK, ~2 min) |
| `npm run book:press:pdfx` | `dist/book-press-pdfx1a.pdf` | **IngramSpark interior** (PDF/X-1a, embeds coated-CMYK output intent; ~40 min) |
| cover render (see §6) | `cover-kdp.pdf` / `cover-ingram.pdf` | full-wrap covers, one per platform (spine differs by paper) |

### File-routing table (read this twice)

| File | KDP paperback | IngramSpark paperback | KDP ebook |
|---|---|---|---|
| `book-press-cmyk.pdf` (interior, CMYK) | ✅ upload | — | — |
| `book-press-pdfx1a.pdf` (interior, PDF/X-1a) | — | ✅ upload | — |
| Full-wrap cover PDF (per-platform spine) | ✅ KDP wrap | ✅ Ingram wrap | — |
| Reflowable EPUB *(built separately, see §8)* | — | — | ✅ upload |
| Cover front-only JPG/PNG (≥ 1600×2560) | — | — | ✅ ebook cover |

**Why two interiors:** KDP accepts a standard CMYK PDF; IngramSpark
**requires PDF/X-1a:2001**. Same content, different wrapper. Don't send the
plain CMYK file to Ingram — it will reject.

**Why two covers:** spine width depends on the printer's paper. At 282 pp,
KDP white = 0.002252 in/page ≈ **0.635 in**; Ingram white ≈ 0.0025 in/page ≈
**0.705 in**. A KDP-spine cover sent to Ingram will have misaligned
fold/spine text. Generate each from its platform's own cover template/calc.

### File-spec checklist (must all be true before upload)

- [ ] Trim **7 × 10 in** on every interior page.
- [ ] Bleed **0.125 in (3 mm)** on the **outer three edges** of interior
      pages (top, bottom, outside — **not** the bind/inside edge). Cover
      bleed **0.125 in on all four sides**.
- [ ] Interior is **CMYK** (KDP) / **PDF/X-1a:2001, CMYK** (Ingram). No RGB
      images, no spot colors, no transparency live in the Ingram file
      (the `pdfx` flow flattens to PDF 1.3).
- [ ] **All fonts embedded** (the three faces are SIL OFL — Schibsted
      Grotesk etc. — licensing is cleared for embedding).
- [ ] **Spine width** computed from the **final** page count and the
      **chosen platform's** paper; cover is a single flat full-wrap
      (back · spine · front).
- [ ] All text/logos ≥ 0.25 in inside trim; ≥ 0.125 in off the spine folds.
- [ ] Page count matches between the PDF and the metadata you type in.
- [ ] Rasters (FR plots, parts stills) at **300 dpi** at print size.
- [ ] Cover **barcode area** reserved bottom-right of back panel (~2 × 1.2
      in); let the platform auto-place the ISBN barcode from our ISBN.

---

## 2. Order of operations & decision gates

**Publish KDP first, IngramSpark second.** Rationale:
1. KDP's previewer + cheap proofs ($-of-printing only) are the fastest way
   to catch interior/cover problems before paying Ingram's setup.
2. We control Amazon directly through KDP (better margin, faster live).
3. Ingram then carries **only** the bookstore/library/extended channel,
   with **Amazon distribution turned OFF** (see §5) so the two never fight
   over the Amazon buy box.

```
                         ┌─────────────────────────────────────────┐
 G0  Final files ───────▶│ press PDFs render clean, spine recomputed │
                         └─────────────────────────────────────────┘
                                          │
 G1  KDP paperback ─────▶ enter own ISBN ▶ upload interior+cover
                          ▶ ONLINE PREVIEWER passes ▶ ORDER PROOF ⏸  (GATE: hold ~1 wk for proof)
                                          │  proof good?
                          ┌───────────────┴───────────────┐
                          │ no → fix files → re-upload      │ yes
                          └───────────────┬───────────────┘
 G2  KDP ebook ─────────▶ EPUB + ebook ISBN ▶ Kindle Previewer ▶ publish
                                          │
 G3  Publish KDP paperback (Amazon live, Expanded Distribution = OFF)
                                          │
 G4  IngramSpark ───────▶ same own ISBN ▶ PDF/X-1a interior + Ingram-spine cover
                          ▶ Amazon distribution OFF ▶ proof ⏸ ▶ publish
                                          │
 G5  Verify both listings merge on Amazon product page; check library/store availability
```

**Gates that must not be skipped:**
- **G0** — never upload before the spine is recomputed from the *final*
  page count. A re-paginated book changes the spine and breaks the cover.
- **G1 proof** — order and hold a physical proof before clicking publish on
  the paperback. Color is the #1 surprise (the accent orange `#ea580c`
  shifts toward brick in CMYK — confirm the FR traces, difficulty marks,
  and part numbers still read).
- **G3 before G4** — KDP must be live *and* its Expanded Distribution OFF
  before Ingram goes live, or you risk a duplicate/conflicting Amazon
  listing during the window.

**Updates / re-uploads are non-destructive.** On both platforms you can
re-upload a corrected interior or cover to an existing title; it triggers
re-review and a new proof opportunity, and **does not change the ISBN**
(the ISBN identifies the *edition*, not the file). Fix-and-re-upload is the
normal loop — only a *content* change big enough to be a "second edition"
warrants a new ISBN.

---

## 3. Amazon KDP — paperback setup (author-only actions in **bold**)

1. **Create/sign in to the KDP account** at kdp.amazon.com under the
   Warren Labs identity. **Complete the Tax Interview (W-9/1099)** and
   **payment (bank/EFT) details** — KDP will not pay or fully publish
   without these. *(Author-only; Claude cannot touch accounts, tax, or
   banking.)*
2. **Bookshelf → Create → Create Paperback.**
3. **Paperback Details:** language English; **Title** + **Subtitle** exactly
   as §0; Author = Jamey Warren; **Publisher = Warren Labs**; paste the
   description (from the cover blurb); select **"I own the ISBN"** and enter
   **979-8-9968299-0-3**; set categories/BISAC + keywords from §0.
   - Leave "Large Print" off; "Adult content" off.
4. **Paperback Content:**
   - Print options: **Premium Color**, **white** paper, **glossy or matte**
     cover (matte suits a technical title), **7 × 10 in** trim, **bleed:
     yes**.
   - **Upload interior:** `dist/book-press-cmyk.pdf`.
   - **Upload cover:** the KDP full-wrap cover PDF (KDP spine ≈ 0.635 in).
   - Run the **Online Previewer** — page through *every* spread; confirm no
     content in the bleed-trim margin, figures intact, running heads
     correct, no blank-page drift. Fix and re-upload until clean.
5. **Paperback Rights & Pricing:** Territories = **All (Worldwide)**;
   set **list price** (see §7); royalty plan shows **60%** minus print cost.
   - **Expanded Distribution: leave OFF** (Ingram will own that channel).
6. **Order a proof** (printed) or at minimum approve the digital proof —
   *order the physical proof* given the color risk. **Hold the gate** until
   it arrives and the color/figures check out.
7. **Click Publish.** Goes to review (24–72 h), then live on Amazon.

---

## 4. Amazon KDP — Kindle ebook setup

KDP does **not require** an ISBN for Kindle, but **we have one** and should
use it for catalog consistency across retailers.

1. **Bookshelf → Create → Create eBook.**
2. **eBook Details:** identical Title/Subtitle/Author/**Publisher = Warren
   Labs**/description/categories/keywords as the paperback. Under ISBN,
   enter the **ebook ISBN 979-8-9968299-1-0** (optional field, fill it).
3. **eBook Content:** upload the **reflowable EPUB** (see §8 — a 282-page
   color technical book with vector figures needs a real EPUB build, not a
   PDF dump). Upload the **ebook cover** (front-only, ≥ 1600 × 2560 px).
   Run **Kindle Previewer**; confirm figures, tables, glossary, and the
   index/cross-refs behave when reflowed.
4. **DRM: your call** (recommend **No DRM** — consistent with the open CC
   BY-NC ethos). **Do NOT enroll in KDP Select** (exclusivity conflict).
5. **Rights & Pricing:** Worldwide; **70% royalty** tier requires list
   price **$2.99–$9.99** — a reference manual can sit above that and take
   35%, or price at $9.99 for 70%. Author's call.
6. **Publish.**

---

## 5. IngramSpark — paperback (extended/bookstore/library channel)

Do this **after** KDP paperback is live with Expanded Distribution OFF.

1. **Create/sign in to the IngramSpark account** under Warren Labs;
   **complete tax + banking + remittance** (author-only). Note Ingram
   charges a **title setup fee** per title (a single combined print+ebook
   setup is cheaper than separate) — reconfirm the current fee at checkout;
   it is sometimes waived via promo codes (e.g. IBPA/ALLi membership or
   periodic free-setup codes). *(Author-only payment.)*
2. **Add a new title → Print book** (and optionally combine with ebook).
   Enter the **same own ISBN 979-8-9968299-0-3** and the **identical
   metadata** from §0 (title, subtitle, author, **Warren Labs**,
   description, BISAC). Identical metadata + same ISBN is what makes Amazon
   *merge* the Ingram availability into the existing KDP product page rather
   than creating a duplicate.
3. **Specs:** 7 × 10 in trim, **Premium / Color** interior, white paper,
   paperback/perfect bound.
4. **Upload interior:** `dist/book-press-pdfx1a.pdf` (**must be
   PDF/X-1a:2001**). Upload the **Ingram-spine cover** (Ingram white ≈
   0.705 in spine — different from KDP). Ingram's automated check validates
   PDF/X compliance, bleed, and fonts on upload.
5. **Distribution & returns:**
   - **Turn OFF Amazon (US/EU) distribution** in Ingram — KDP serves
     Amazon. This is the key conflict-avoidance setting.
   - Keep **global wholesale / bookstore / library** channels ON.
   - **Wholesale discount:** 40% is the bookstore-standard that makes the
     title orderable by shops (55% if you want maximum stock-ability; less
     margin). **Returns:** "Yes — destroy" is the friendliest to retailers
     for a niche technical title (avoids returned-stock handling).
6. **Pricing:** set the **same list price** as KDP (price parity avoids
   buy-box weirdness); Ingram shows **publisher compensation** after the
   wholesale discount and print cost — verify in the Ingram comp calculator.
7. **Order a proof** (Ingram proof has a fee + shipping). Approve only after
   it checks out. **Publish / make available.**

---

## 6. Cover generation (both platforms)

The finished cover composition lives in `project/book/cover/` (`covers.js`
renders front/back/spine; `SPEC.md` carries the wrap math). Produce **two**
full-wrap PDFs because the spine differs:

```
wrap width  = 0.125 (bleed) + 7 (back) + SPINE + 7 (front) + 0.125 (bleed)
wrap height = 0.125 + 10 + 0.125 = 10.25 in

KDP   (282 pp, white, 0.002252/pg): SPINE ≈ 0.635 in → wrap ≈ 14.885 × 10.25 in
Ingram(282 pp, white, 0.0025/pg):   SPINE ≈ 0.705 in → wrap ≈ 14.955 × 10.25 in
```

- Render the wrap (`pagedjs-cli cover.html -o cover.pdf`), then convert to
  CMYK like the interior; for Ingram, output **PDF/X-1a** as well.
- **Always confirm spine against the live calculator** before upload: KDP
  cover calculator (kdp.amazon.com/cover-calculator) and Ingram's cover
  template generator (it issues an exact-size template per your page
  count/paper). If the final page count moves off 282, regenerate both.
- Reserve the back-bottom-right barcode zone; let each platform auto-place
  the barcode from our ISBN.

---

## 7. Pricing math (premium color, 7 × 10, 282 pp)

KDP 2026 premium-color print cost: **$0.85 fixed + $0.07/page**.
- 282 pp × $0.07 = $19.74 + $0.85 = **≈ $20.59 print cost** (US).
- Royalty 60%: **minimum list = print ÷ 0.60 = $34.32**. KDP enforces a
  floor at/above this.
- **Recommended list ≈ $39.99** → royalty ≈ (0.60 × $39.99) − $20.59 ≈
  **$3.40/copy** on Amazon.
- **Set the same $39.99 on Ingram.** After a 40% wholesale discount
  (−$16.00) and Ingram color print cost, comp is thin per copy — Ingram is
  for *reach* (libraries/stores), not margin. Verify exact numbers in each
  platform's calculator; print costs shifted in the Feb 2026 update.
- **Ebook:** $9.99 (70% tier) is a clean choice, or higher at 35% for a
  reference. Author's call.

---

## 8. The ebook (EPUB) — note

This is a 282-page color technical book with ~27 vector diagrams, an index,
and figure cross-references. **Do not upload the print PDF as the ebook.**
Build a **reflowable EPUB** from the same single source (the same
`learn/*.md{,x}` content the print pipeline consumes), with:
SVG figures inline, a navigable TOC, the glossary and index as linked
back-matter, and the **ebook ISBN** in the OPF metadata. KDP's Kindle
previewer will flag reflow problems with the wide FR plots — expect to set
those figures to scale-to-width. *(This EPUB build is a prep task Claude can
do from the existing pipeline; it is not yet wired as an `npm` target.)*

---

## 9. Common rejection reasons → how we avoid them

| Rejection | Cause | Our prevention |
|---|---|---|
| **Interior not PDF/X-1a** (Ingram) | sent plain CMYK PDF | use `book:press:pdfx` → `book-press-pdfx1a.pdf` for Ingram only |
| **RGB / spot color in file** | web RGB orange leaks through | CMYK render path; `#ea580c` remapped at token layer; verify no RGB images |
| **Fonts not embedded** | subsetting/licensing | all three faces SIL OFL, embedded by the render; check with `pdffonts` (all should say "emb yes") |
| **Spine width wrong / text on fold** | spine from stale page count or wrong paper | recompute from FINAL page count + the *platform's* paper; one cover per platform |
| **Content in the bleed/margin** | figure or running head too close to trim | KDP previewer + keep text ≥ 0.25 in inside trim; figures keep-together in `book.css` |
| **Bleed missing on interior** | exported without bleed | press render sets 0.125 in bleed on outer 3 edges |
| **Blank-page / pagination drift** | the 3D parts-viewer widget truncated the book at ~241 pp (already fixed) | parts-viewer stripped from print HTML; confirm full **282 pp** renders |
| **Cover too small / not full-wrap** | front-only file uploaded | upload the single flat back·spine·front wrap; front-only JPG is **ebook-only** |
| **Metadata mismatch KDP↔Ingram** | listings won't merge on Amazon | paste identical §0 metadata + same ISBN on both |
| **Low-res rasters** | FR plots/stills < 300 dpi | render rasters at 300 dpi at print size |
| **Duplicate Amazon listing** | Ingram Amazon channel left ON or KDP Expanded Dist ON | Ingram Amazon OFF **and** KDP Expanded Distribution OFF |

---

## 10. Who does what — author vs Claude Code

**Only the author (Jamey) can:**
- Create/own the KDP and IngramSpark **accounts**; complete **tax
  interviews and banking/remittance**.
- Type/own the **ISBN entry** ("I own the ISBN").
- **Order proofs**, pay **Ingram setup fees**, and **click Publish**.
- Approve color on the **physical proof** (judgment call).
- Final **list-price / royalty-tier / DRM / wholesale-discount** decisions.

**Claude Code can prep (everything up to the account):**
- Generate the press files (`book:press:pdf`, `book:press:pdfx`) and both
  spine-correct **cover wraps**; recompute spine at final page count.
- Build the **reflowable EPUB** from the single source with the ebook ISBN
  in metadata.
- Produce the **metadata block** (title/subtitle/description/BISAC/keywords)
  and the trimmed listing description from the cover blurb.
- Run the **pre-flight checklist** (`pdffonts` for embedding, page-count
  read, CMYK/RGB check, bleed/trim verification, spine math).
- Maintain this runbook and reconcile any stale numbers (page count, spine).

---

## 11. Quick command reference

```bash
# Interiors
npm run book:press:pdf     # → dist/book-press-cmyk.pdf      (KDP interior)
npm run book:press:pdfx    # → dist/book-press-pdfx1a.pdf    (Ingram interior, ~40 min)

# Pre-flight checks (run on the generated PDFs)
pdffonts dist/book-press-cmyk.pdf      # every font must show "emb yes" / "sub yes"
pdfinfo  dist/book-press-cmyk.pdf      # confirm page count (≈282) and page size 504×720 pt (7×10 in)

# Cover: edit spine in project/book/cover/cover.html per platform, then render + CMYK (see §6)
```

**Sources (reconfirm at upload time):**
- [KDP paperback submission guidelines](https://kdp.amazon.com/en_US/help/topic/G201857950) ·
  [KDP cover calculator](https://kdp.amazon.com/cover-calculator) ·
  [KDP paperback printing cost](https://kdp.amazon.com/en_US/help/topic/G201834340)
- [IngramSpark file requirements](https://www.ingramspark.com/blog/file-requirements-for-print-books) ·
  [IngramSpark file creation guide (PDF)](https://www.ingramspark.com/hubfs/downloads/file-creation-guide.pdf) ·
  [IngramSpark user guide v3.2 (PDF)](https://www.ingramspark.com/hubfs/downloads/user-guide.pdf)
- [Using KDP + IngramSpark together](https://selfpublishingadvice.org/how-authors-use-ingramspark-and-kdp-together/)
