---
name: aisss-visual-identity
description: >-
  Applies the AI Safety Said Simply (AISSS) visual identity: logo, Ink/Paper/Strand
  colors, extended palette, Inter, Baskerville, and Redaction type, and
  strand-loop graphics. Use for videos, title cards, captions, thumbnails, slides,
  documents, and web, and when reviewing branded work for AISSS, AI Safety Said
  Simply, or aisafetysaidsimply.com.
---

# AISSS visual identity

Apply this whenever the output is a branded artifact for AI Safety Said Simply. The full token tables, type scale, and contrast pairs are in [reference.md](reference.md). Worked layouts are in [examples.md](examples.md). The print guide is `branding/AISSS-Visual-Identity.pdf`.

## Voice of the system

The company explains ideas and does not lobby. Sentence case. One Strand job per frame. Ink on Paper is the default.

## Non-negotiables

- Logo files only. Do not redraw the yarn. Mark and wordmark are the same color, Ink `#111111` or Paper `#FFFFFF`. Never Strand.
- Primary lockup is horizontal: `AISSS-logo-black.svg` or `AISSS-logo-white.svg`. No stacked lockup. Mark alone (`yarn-mark-*.svg`) only when the name is already present.
- Clear space equals the yarn-mark height on every side. Minimum lockup 128px / 32mm wide. Minimum mark 28px / 8mm.
- Wordmark letters are `AISSS`. In sentences write "AI Safety Said Simply."
- Corners are square (`--radius-card: 0`). No drop shadows, glows, outlines, or gradients.
- Inter for body, buttons, navigation, the wordmark, and small-cap labels. Static files are in `branding/guide/fonts` (Inter-Regular, Medium, SemiBold, Bold; open source, SIL OFL). No Inter, Arial, or Roboto.
- Baskerville Bold for heading 1 and heading 2. Baskerville Regular for heading 3 and captions. Quotes are Baskerville italic. Inter stays roman. Libre Baskerville is the stand-in in the brand PDF.
- Small-cap accent text stays Inter Bold, tracking 0.14em. Do not set those labels in Baskerville.
- Redaction 35 Regular is the website hero's opening clause only. Missing font: Inter Regular. Do not draw fake bars.
- At most one strand loop per layout. Stroke color is Ink, Paper, or Strand. A Strand loop means the headline is not Strand. Files: `branding/guide/graphics/strand-drift.svg`, `strand-double.svg`, `strand-corner.svg`. Scale evenly. Ends leave the frame.
- Website UI stays on the core palette (Ink, Paper, Strand, and the neutrals). Extended colors are for video, diagrams, and print.

## Color, short form

| Name | Hex | Use |
|---|---|---|
| Ink | `#111111` | Text, logo, dark fields, primary buttons |
| Paper | `#FFFFFF` | Default ground; type on Ink |
| Strand | `#C64D0A` | One word, one 1.5–2pt rule, or one mark. Not body text |
| Muted | `#595959` | Captions |
| Live | `#FF8A3D` | Large available fills only, Ink type on top |
| Clay | `#8C3410` | Small orange-family labels |
| Warm Paper | `#F4EFE6` | Video and long documents. Do not mix with Paper in one frame |
| Wool | `#E3D5C3` | Lower thirds and panels |

Signals (diagrams only, one per figure): Indigo `#1B3A4B`, Moss `#1E5C44`, Saffron `#E2A100` (a tick, not a sentence). Ember `#F57828` is the Live hover and nothing else.

Most of a frame is Ink and Paper. Strand is the short share.

## Type, short form

- Heading 1: Baskerville Bold. Sentence case.
- Heading 2: Baskerville Bold, smaller than heading 1.
- Heading 3: Baskerville Regular, smaller than heading 2.
- Quote: Baskerville Italic. No quotation marks in the type if the italic already sets it off; if you use marks, use straight quotes.
- Caption: Baskerville Regular, smaller than heading 3.
- Body: Inter Regular, 16px, leading 1.625, left aligned, about 60–75 characters.
- Accent label: Inter Bold small caps, 11px, tracking 0.14em.
- Navigation: Inter Semibold 600, 12px, small caps, tracking 0.06em.
- Buttons: Inter Medium 500.
- Wordmark: Inter Bold 700, 29px, tracking −0.055em, 3px from a 36px mark. Video and print use the SVG lockup.
- Website hero only: Redaction 35 Regular on the opening clause, then Inter Medium in Strand for the plain words, then an Ink period.

## Video

- Title card: Ink field, Inter small-cap label, Baskerville Bold title in Paper, one Strand loop, white lockup inside clear space, square frame.
- Lower third: Wool bar, 4px Strand rule on the left, Ink type, mark at the right. No outline.
- Captions: Inter, Ink on Paper or Paper on Ink. Never Strand, Live, or Saffron.
- End card: Ink, white lockup, URL, optional corner loop in Strand.
- Keep type inside an 8% title-safe margin. Do not place the logo on a moving image without a solid field.

## Before delivering

Check the artifact against [reference.md](reference.md): one Strand moment, logo unedited, square corners, type face correct, and any text color pairing marked AA or better. Fix failures rather than noting them.
