# AISSS visual identity reference

Source of the on-screen system: https://www.aisafetysaidsimply.com/

Core colors are taken from the live site. Extended colors are part of this identity for video, diagrams, and print. Do not push extended colors into the website unless the codebase adopts them.

CMYK figures are process approximations, not press-certified mixes.

## Primary

Use first. A page that works with these three does not need the rest.

| Name | Hex | RGB | CMYK | Token | Use |
|---|---|---|---|---|---|
| Ink | `#111111` | 17, 17, 17 | 0 / 0 / 0 / 93 | `--color-ink` | Text, logo, dark fields, primary buttons |
| Paper | `#FFFFFF` | 255, 255, 255 | 0 / 0 / 0 / 0 | `--color-paper` | Default ground. Type and logo on Ink |
| Strand | `#C64D0A` | 198, 77, 10 | 0 / 61 / 95 / 22 | `--color-hero-orange` | One word, one short rule, or one mark |

`--color-accent` is Ink. `--color-cream` is Paper. A primary button is an Ink square with Paper type. `--radius-card` is `0`.

Proportion: about nine parts Ink and Paper, one part Strand. Strand is not a full-bleed background and not body copy.

## Neutrals

The website’s working greys. Do not add pure black beside Ink.

| Name | Hex | RGB | Token | Use |
|---|---|---|---|---|
| Ink 2 | `#262626` | 38, 38, 38 | `--color-ink-2` | Secondary headlines, decks |
| Muted | `#595959` | 89, 89, 89 | `--color-muted` | Captions, metadata, supporting copy |
| Line 2 | `#858585` | 133, 133, 133 | `--color-line-2` | Disabled labels and quiet icons only. Fails body contrast on Paper |
| Line | `#D4D4D4` | 212, 212, 212 | `--color-line` | Hairlines, borders, dividers |
| Paper 3 | `#EBEBEB` | 235, 235, 235 | `--color-paper-3` | Inactive cards |
| Paper 2 | `#F5F5F5` | 245, 245, 245 | `--color-paper-2` | Alternate bands, secondary buttons |

## Extended

Not for restyling the live site.

### Warm grounds

Pick one ground per piece. Do not mix Warm Paper and Paper in the same frame.

| Name | Hex | RGB | Use |
|---|---|---|---|
| Warm Paper | `#F4EFE6` | 244, 239, 230 | Video grounds and long documents |
| Wool | `#E3D5C3` | 227, 213, 195 | Panels, lower thirds |
| Wheat | `#CDBBA4` | 205, 187, 164 | Second panel or chart band. Not text |
| Bark | `#5C534C` | 92, 83, 76 | Captions and axes on warm grounds |

### Strand family

Same dye, three jobs. Ember is a state, not a brand color.

| Name | Hex | RGB | Token | Use |
|---|---|---|---|---|
| Clay | `#8C3410` | 140, 52, 16 | — | Small labels and icons in the orange family |
| Live | `#FF8A3D` | 255, 138, 61 | `--color-library-live` | Large fills for “available”. Ink type on top |
| Ember | `#F57828` | 245, 120, 40 | `--color-library-live-hover` | Hover of Live only |

### Signals

Diagrams only. One signal per figure, plus Ink. They do not share a headline with Strand.

| Name | Hex | RGB | Use |
|---|---|---|---|
| Indigo | `#1B3A4B` | 27, 58, 75 | Structure, document links |
| Moss | `#1E5C44` | 30, 92, 68 | Confirmed node, tag, or correct path |
| Saffron | `#E2A100` | 226, 161, 0 | Tick or short underline. Not a fill, not a sentence |

## Approved type pairings

Use a pairing only at the size its grade allows. AAA and AA are fine for body copy. Large only means at least 18pt, or 14pt bold, and a short line.

- Ink on Paper, Paper 2, Warm Paper, Wool, and Live — body.
- Paper on Ink, Indigo, and Moss — reversed labels and the logo on Ink.
- Muted on Paper, Bark on Warm Paper — captions.
- Clay on Paper — small Strand-family labels.
- Strand on Paper — title-size emphasis only, even if the ratio clears AA. Not paragraphs.
- Do not set Live, Ember, Wheat, or Saffron as text on Paper.
- Do not run body copy on Strand, Live, or Saffron.

## Typography

Text face: Inter (open source, SIL OFL). Static files: `branding/guide/fonts/Inter-Regular.ttf`, `Inter-Medium.ttf`, `Inter-SemiBold.ttf`, `Inter-Bold.ttf`. No substitute is needed. Do not fall back to Inter or Arial.

Title face: Baskerville Bold for heading 1 and heading 2. Baskerville Regular for heading 3 and captions. This PDF uses Libre Baskerville. Production files name Baskerville.

Quote face: Baskerville Italic. Inter stays roman in this system.

Accent face: Inter Bold, small caps, for labels. Navigation is Inter Semibold, small caps.

Website-hero face: Redaction 35 Regular, one clause. Missing font: Inter Regular. Do not draw fake bars.

| Role | Face | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Heading 1 | Baskerville | 30px and up | Bold 700 | −0.02em | 1.05 |
| Heading 2 | Baskerville | 18–24px | Bold 700 | −0.01em | 1.15 |
| Heading 3 | Baskerville | 14–16px | Regular 400 | 0 | 1.25 |
| Quote | Baskerville Italic | 18–22px | Regular 400 | 0 | 1.35 |
| Caption | Baskerville | 12–14px | Regular 400 | 0 | 1.35 |
| Accent | Inter small caps | 11px | Bold 700 | 0.14em | 1.4 |
| Body | Inter | 16px | Regular 400 | 0 | 1.625 |
| Button | Inter | 14–16px | Medium 500 | 0 | 1.2 |
| Navigation | Inter small caps | 12px | Semibold 600 | 0.06em | 1.33 |
| Wordmark | Inter | 29px at a 36px mark | Bold 700 | −0.055em | 1 |
| Website hero | Inter, with the opening clause in Redaction | 52–120px | Medium 500; Redaction 400 | −0.06em; Redaction −0.035em | 0.98 |

Website hero order: Redaction clause, then the plain words in Strand Inter Medium, then an Ink period. Example: "Complex AI safety topics, " in Redaction, "said simply" in Strand, "." in Ink.

Rules:

- Sentence case for Baskerville headlines.
- Small caps are Inter, for labels and navigation.
- Left align. Do not justify. Do not center a paragraph.
- Body lines run about 60 to 75 characters.
- Bold Inter is the wordmark and the small caps, not a paragraph.

## Logo

The SVGs are in `motion/public/brand/` (and a copy in `branding/guide/logos/`).

| File | Use |
|---|---|
| `AISSS-logo-black.svg` | Ink lockup on Paper, Paper 2, Paper 3, Warm Paper |
| `AISSS-logo-white.svg` | Paper lockup on Ink |
| `yarn-mark-black.svg` | Mark alone on light grounds |
| `yarn-mark-white.svg` | Mark alone on Ink |

- Only horizontal lockup. No stacked logo.
- Clear space = height of the yarn mark, all sides.
- Web gap inside the rebuilt lockup: 3px at a 36px mark. Do not invent a third spacing. Prefer the SVG for video and print.
- Minimum lockup width 128px or 32mm. Minimum mark 28px or 8mm.
- Do not stretch, rotate, flip, crop, outline, shadow, recolor, or place on a photograph or pattern.
- Accessible name is “AI Safety Said Simply.” Visible wordmark is AISSS.

## Graphics

| File | Role |
|---|---|
| `branding/guide/graphics/strand-drift.svg` | Single loop, horizontal |
| `branding/guide/graphics/strand-double.svg` | Two loops, still one element |
| `branding/guide/graphics/strand-corner.svg` | Enters from the top, leaves at the bottom. Covers and end cards |

Stroke uses `currentColor`. Set Ink, Paper, or Strand.

- One loop per layout. The double file counts as the one.
- Scale uniformly, including stroke weight. Do not stretch.
- Ends leave the frame or pass behind a solid panel.
- Do not trace the logo, tile a pattern, or stop the line mid-sentence.
- A Strand underline is a straight rule, 1.5–2pt, about the length of the word, not a loop.

## UI

- Primary button: Ink fill, Paper type, Medium or the site’s button weight, square, no border, no shadow.
- Secondary button: Paper 2 fill, Ink type, square.
- Cards: square, no shadow. Live cards use `#FF8A3D` with Ink type. Inactive cards use Paper 3.
- Focus ring stays Ink.

## Video and documents

- Title card: Ink field, Inter small-cap label, Baskerville Bold headline in Paper, optional one-line deck in a gray no lighter than `#C8C8C8` on Ink, white lockup, one Strand loop.
- Lower third: Wool `#E3D5C3`, 4px Strand bar at the left edge, Ink label and title, black mark at the right.
- Captions: Inter, Ink on Paper or Paper on Ink.
- End card: Ink, white lockup, `aisafetysaidsimply.com`, optional `strand-corner.svg` in Strand, kept clear of the lockup.
- Document ground is Paper or Warm Paper, not both. Lockup at top, one Strand rule under the title.
- Title-safe margin about 8% of the frame. Logo clear space still applies inside it.

## Contact

aisafetysaidsimply.com · contact@aisafetysaidsimply.com
