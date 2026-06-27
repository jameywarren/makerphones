# Retail Metadata Package

*The Art and Science of Headphone Design* — ready-to-paste listing copy for
**Amazon KDP** and **IngramSpark**. Last updated 2026-06-26.

How to use this file: each section is copy-paste-ready at upload time. Where
KDP and IngramSpark diverge (BISAC handling, category pickers, keyword
formatting), the difference is called out inline. Platform behaviors verified
against current KDP/IngramSpark docs (June 2026) — see Sources at the bottom.

---

## 1. Core bibliographic record

| Field | Value |
|-------|-------|
| **Title** | The Art and Science of Headphone Design |
| **Subtitle** | A bench guide to how headphones are designed, measured & built |
| **Author** | Jamey Warren |
| **Imprint / Publisher of record** | Warren Labs (warrenlabs.com) |
| **ISBN — Paperback** | 979-8-9968299-0-3 |
| **ISBN — Ebook** | 979-8-9968299-1-0 |
| **Edition** | First Edition (2026) |
| **Trim / format** | 7 × 10 in, ~282 pp, premium color interior, perfect-bound paperback (POD) + ebook |
| **Copyright** | © 2026 Jamey Warren. Text CC BY-NC 4.0; design files MIT. |

**Note on each platform's ISBN handling:**
- **IngramSpark** — enter the **paperback** ISBN (979-8-9968299-0-3) for the
  print title and the **ebook** ISBN (979-8-9968299-1-0) on the EPUB title.
  Each format is its own title record. The book's own ISBN (not a
  Spark-assigned one) keeps the imprint "Warren Labs" on the record.
- **Amazon KDP** — supply the **paperback** ISBN under "Use my own ISBN" so the
  publisher reads **Warren Labs**, not "Independently published." For the Kindle
  edition KDP does **not** use an ISBN (it assigns an ASIN); keep the
  979-8-9968299-1-0 ISBN reserved for the EPUB you distribute through Ingram /
  other ebook channels so the two ebook editions stay distinct.

---

## 2. BISAC subject codes

BISAC is the field you fill in on **IngramSpark** (and any wide ebook
distributor). Ingram requires at least two and recommends three, most-specific
first. On **KDP you no longer pick BISAC directly** — since 2023 KDP derives it
from the Amazon browse categories you choose (Section 4); these codes are still
the right mental model and map cleanly to those categories.

**PRIMARY — TEC008000 · TECHNOLOGY & ENGINEERING / Electronics / Audio**
The exact center of the book: transducer electronics, frequency response,
distortion, measurement, and tuning. This is an audio-engineering reference
first; lead with it.

**SECONDARY 1 — MUS052000 · MUSIC / Recording & Reproduction**
Captures the listening/reproduction and measurement-of-sound audience (the
reviewer-graph reader, the audiophile-adjacent buyer) and places the book in a
populated, on-topic music-tech shelf alongside acoustics and reproduction titles.

**SECONDARY 2 — CRA046000 · CRAFTS & HOBBIES / Electronics**
Hooks the DIY-build buyer — the "people who actually open the cup." The 7 build
guides and the bench/maker voice make this a genuine fit, and it widens reach
into the maker/hobbyist channel without diluting the core technical positioning.

*Alternates if a slot needs swapping:* TEC007000 (TECHNOLOGY & ENGINEERING /
Electrical) or CRA005000 (CRAFTS & HOBBIES / General). Avoid anything
"…/General" in the lead slot — Ingram explicitly discourages it as a wasted slot.

---

## 3. Amazon keywords (7 slots)

Seven backend keyword slots, up to 50 characters each, long-tail and
buyer-intent. Do **not** repeat words already in the title/subtitle/category —
Amazon indexes those automatically. Paste one phrase per slot.

1. `headphone design and measurement guide`
2. `how to build DIY headphones from scratch`
3. `frequency response curve explained audio`
4. `headphone tuning and voicing harman target`
5. `audio engineering reference for makers`
6. `open back headphone driver acoustics book`
7. `read headphone measurements graphs FR plots`

**IngramSpark keyword field:** Ingram takes the same seven as a single
semicolon-separated string. Paste:

```
headphone design and measurement guide; how to build DIY headphones from scratch; frequency response curve explained audio; headphone tuning and voicing harman target; audio engineering reference for makers; open back headphone driver acoustics book; read headphone measurements graphs FR plots
```

---

## 4. Amazon browse categories (newer category picker)

KDP gives **3 category slots per format**; pick from Amazon's store-category
tree (the post-2023 picker, not BISAC). Recommended paths:

1. **Books › Engineering & Transportation › Engineering › Electrical &
   Electronics**
   *(primary — matches the TEC008000 core)*
2. **Books › Arts & Photography › Music › Musical Genres › [Recording] /
   Books › Crafts, Hobbies & Home › Crafts & Hobbies › Electronics**
   *(reproduction + the DIY/maker audience)*
3. **Kindle Store › Kindle eBooks › Engineering & Transportation › Engineering
   › Electrical & Electronics**
   *(the Kindle-side mirror of path 1 for the ebook listing)*

Tip: after publishing, use KDP's "request additional categories" path or let
the backend keywords (Section 3) pull the book into adjacent shelves
(Acoustics, Sound Recording) beyond the three you set directly.

---

## 5. Retail description + tagline

**Tagline (1 line):**
> Read it once and the line stops being a mystery — you'll know what to change, and why.

**Description (~185 words):**

A headphone is a small, stubborn acoustic system — a driver, a sealed cavity, a
pad against your skull — and every decision you make about it shows up in the
measurement. This is the bench guide to those decisions: how sound is made, how
it's measured, and how to read the frequency-response curve every reviewer
reaches for and most read wrong.

It works from first principles to a finished tuning — driver excursion, the
physics of the sealed cavity, the target you voice toward, distortion, and the
build steps that hold it together. Thirty-three chapters across six parts, plus
seven hands-on build guides and seven appendices, including a glossary and
supplier lists. Every figure is drawn, not photographed — diagrams you could
redraw at the bench.

Written by an engineer who has spent 25+ years in pro audio and tuned headphones
where the coffee is cold and the seal is never quite right. For the people who
actually open the cup: DIY builders, audio engineers, and anyone who wants to
stop trusting graphs they can't interpret.

---

## 6. Author bio (~60 words)

> **Jamey Warren** has spent 25+ years in professional audio. He was employee #1
> at Grace Design, then VP and later CEO of HeadRoom, where he relaunched the
> headphone-amplifier line and tested thousands of headphones. He now designs
> the open-back "Daily Driver" in the open. He writes down the manufacturer
> knowledge usually locked behind NDAs — for makers instead.

---

## 7. Comparable / competitive titles

Real, in-market titles (confirmed June 2026). Use 2–3 as KDP "customers also
bought"-style positioning and in jacket/marketing copy.

1. **Loudspeaker and Headphone Handbook** — John Borwick (Routledge/Focal
   Press). The closest reference by title, but a multi-author academic handbook
   spanning loudspeakers; headphones are a chapter, not the spine. *This book is
   headphone-first and written by one bench engineer, not a committee.*

2. **Designing Audio Power Amplifiers** — Bob Cordell (McGraw-Hill/Routledge).
   The genre model: six parts, comprehensive, engineer-authored. *Cordell builds
   the amp; this book builds the transducer on the other end of the cable — and
   teaches you to measure it.*

3. **Audio Power Amplifier Design Handbook** — Douglas Self (Focal Press). The
   canonical "working engineer, measurement-driven" audio title. *Same
   rigor and bench voice, aimed at the headphone instead of the amplifier, and
   priced/scoped for makers rather than career amp designers.*

4. **Master Handbook of Acoustics** — F. Alton Everest & Ken Pohlmann
   (McGraw-Hill). The standard on measuring and interpreting sound. *Everest
   covers rooms; this covers the 2cc cavity an inch from your ear — the same
   physics at headphone scale, with the response curve decoded.*

5. **Headset: A Design Handbook for Sound and Shape** — Roger Ball et al. *That
   book leans industrial-design and ergonomics; this one leans
   acoustics, electronics, measurement, and tuning — how it sounds, not how it
   wears.*

---

## 8. Audience, language & contributor metadata

| Field | Value |
|-------|-------|
| **Primary audience** | DIY headphone builders & makers; audio/acoustic engineers; serious audiophiles who want to read measurements correctly; audio-engineering students |
| **Reading level / age range** | Adult (18+); also suitable for college-level / advanced-hobbyist readers. Ingram "Adult"; KDP audience = Non-children's. |
| **Grade range (Ingram, if asked)** | College / Trade — Professional & Scholarly |
| **Language** | English |
| **Edition** | First Edition (2026) |
| **Contributor** | Jamey Warren — Author (role A01). Sole author; no editor/illustrator credit (figures are the author's own vector work). |
| **Series** | None (standalone). |
| **Adult content flag** | No |
| **Territory / rights** | Worldwide, all markets (POD via KDP + IngramSpark). |
| **Also available** | Free to read online at makerphones.com (text CC BY-NC 4.0). The print and ebook are the packaged, typeset editions. |

**Thema (Ingram international, optional but recommended):**
- **TJF** — Electronics & communications engineering (maps to TEC008000)
- **AVR** — Music recording & reproduction, equipment & technology (maps to MUS052000)
- **WFW** — Hobbies / handicrafts, electronics (maps to CRA046000)

---

### Sources (platform specs verified June 2026)
- KDP keywords/categories/BISAC handling — [manuscriptreport.com](https://manuscriptreport.com/blog/amazon-kdp-keywords), [ebookpbook.com](https://www.ebookpbook.com/2026/06/01/kdp-categories-keywords-explained/), [vappingo.com](https://www.vappingo.com/word-blog/kdp-categories-vs-bisac/)
- IngramSpark BISAC/keyword requirements — [ingramspark.com/blog/bisac-subject-codes](https://www.ingramspark.com/blog/bisac-subject-codes), [ingramspark.com title-metadata guide](https://www.ingramspark.com/hubfs/downloads/title-metadata-guide.pdf)
- Comparable titles — [Loudspeaker and Headphone Handbook (Borwick)](https://www.amazon.com/Loudspeaker-Headphone-Handbook-Third-Borwick/dp/0240515781), [Designing Audio Power Amplifiers (Cordell)](https://www.amazon.com/Designing-Audio-Power-Amplifiers-Cordell/dp/1138555444), [Audio Power Amplifier Design Handbook (Self)](https://www.amazon.com/Audio-Power-Amplifier-Design-Handbook/dp/0240521625), [Master Handbook of Acoustics (Everest/Pohlmann)](https://www.amazon.com/Master-Handbook-Acoustics-Seventh-Everest/dp/1260473597), [Headset (Ball et al.)](https://www.amazon.com/Headset-design-handbook-sound-shape/dp/9881583195)
