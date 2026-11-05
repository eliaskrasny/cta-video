# Colour [PDF p.6–9, p.14]

Ink and Paper fill most of a page. Strand is the strong colour, and a page gets a little of it. Proportion: about nine parts Ink and Paper to one part Strand. Strand is not a full-bleed background and not body copy.

Core values match the website. Extended values are for video, diagrams and print: don't push them into the website UI. CMYK figures are process approximations for print. Machine-readable: [../tokens.json](../tokens.json).

## Primary [p.6]

These three come first. A page that works with these doesn't need the rest.

| Name | Hex | RGB | CMYK | Site token | Use |
|---|---|---|---|---|---|
| **Ink** | `#111111` | 17, 17, 17 | 0 / 0 / 0 / 93 | `--color-ink` | Text, the logo, dark fields, primary buttons |
| **Paper** | `#FFFFFF` | 255, 255, 255 | 0 / 0 / 0 / 0 | `--color-paper` | Default ground. Also type and the logo when they sit on Ink |
| **Strand** | `#C64D0A` | 198, 77, 10 | 0 / 61 / 95 / 22 | `--color-hero-orange` | A word or a short rule. Not body text |

On the site `--color-cream` is white (Paper) and `--color-accent` is Ink. A primary button is an Ink square with Paper type. Corners stay at 0.

## Neutrals [p.7]

Greys from the website. They separate a headline from a caption. Do not add pure black beside Ink.

| Name | Hex | RGB | CMYK | Site token | Use |
|---|---|---|---|---|---|
| Ink 2 | `#262626` | 38, 38, 38 | 0 / 0 / 0 / 85 | `--color-ink-2` | Secondary headlines and the deck under a title |
| Muted | `#595959` | 89, 89, 89 | 0 / 0 / 0 / 65 | `--color-muted` | Supporting copy, captions, metadata |
| Line 2 | `#858585` | 133, 133, 133 | 0 / 0 / 0 / 48 | `--color-line-2` | Disabled labels and quiet icons. **Not for sentences** |
| Line | `#D4D4D4` | 212, 212, 212 | 0 / 0 / 0 / 17 | `--color-line` | Hairlines, field borders, dividers |
| Paper 3 | `#EBEBEB` | 235, 235, 235 | 0 / 0 / 0 / 8 | `--color-paper-3` | Inactive cards and topics still in production |
| Paper 2 | `#F5F5F5` | 245, 245, 245 | 0 / 0 / 0 / 4 | `--color-paper-2` | Alternate bands and secondary buttons |

Line 2 `#858585` fails ordinary contrast on Paper. Reading text is Muted or darker.

## Extended palette [p.8]

### Warm grounds
One ground per piece. Warm Paper and Paper do not share a frame.

| Name | Hex | RGB | CMYK | Use |
|---|---|---|---|---|
| Warm Paper | `#F4EFE6` | 244, 239, 230 | 0 / 2 / 6 / 4 | Video and long documents. Don't mix with Paper in one frame |
| Wool | `#E3D5C3` | 227, 213, 195 | 0 / 6 / 14 / 11 | Panels and lower thirds on a warm ground |
| Wheat | `#CDBBA4` | 205, 187, 164 | 0 / 9 / 20 / 20 | A second panel or a chart band. **Not a text colour** |
| Bark | `#5C534C` | 92, 83, 76 | 0 / 10 / 17 / 64 | Captions and axes on Warm Paper, Wool and Wheat |

### Strand family
Same dye, three jobs. Clay is dark orange for small text. Live is a fill. Ember is a state, not a brand colour.

| Name | Hex | RGB | CMYK | Site token | Use |
|---|---|---|---|---|---|
| Clay | `#8C3410` | 140, 52, 16 | 0 / 63 / 89 / 45 | none | Small orange labels and icons |
| Live | `#FF8A3D` | 255, 138, 61 | 0 / 46 / 76 / 0 | `--color-library-live` | Available states. Large fills only, with Ink type on top |
| Ember | `#F57828` | 245, 120, 40 | n/a | `--color-library-live-hover` | The Live hover. Not a headline colour |

### Signals
Diagrams only. **One signal colour in a figure, plus Ink.** Signals stay out of headlines, and off a line with Strand.

| Name | Hex | RGB | CMYK | Use |
|---|---|---|---|---|
| Indigo | `#1B3A4B` | 27, 58, 75 | 64 / 23 / 0 / 71 | Diagram structure and document links. One cool colour, used flat |
| Moss | `#1E5C44` | 30, 92, 68 | 67 / 0 / 26 / 64 | The confirmed point: a node, a tag, a correct path |
| Saffron | `#E2A100` | 226, 161, 0 | 0 / 29 / 100 / 11 | A tick or a short underline. Not a sentence |

## Approved text pairings [p.9]

Ratios follow WCAG. AAA and AA are fine for body copy. "Large only" means 18pt, or 14pt bold, in a short line. Weaker pairs are fills or strokes.

| Foreground on background | Ratio | Grade | Use |
|---|---|---|---|
| Ink on Paper | 18.9:1 | AAA | Default body and headlines |
| Ink on Paper 2 | 17.3:1 | AAA | Secondary buttons and bands |
| Ink on Warm Paper | 16.5:1 | AAA | Video and print body |
| Ink on Wool | 13.1:1 | AAA | Lower thirds and panels |
| Ink on Live | 8.1:1 | AAA | Type on an available card |
| Paper on Ink | 18.9:1 | AAA | Reversed type and the logo |
| Paper on Indigo | 12.0:1 | AAA | Labels on a diagram field |
| Paper on Moss | 7.9:1 | AAA | Labels on a confirmed node |
| Muted on Paper | 7.0:1 | AAA | Captions on the website |
| Bark on Warm Paper | 6.6:1 | AA | Captions on a warm ground |
| Clay on Paper | 8.0:1 | AAA | Small Strand-family labels |
| Strand on Paper | 4.7:1 | AA | Emphasis at title size (not paragraphs) |

Grades: AAA ≥ 7 · AA ≥ 4.5 · Large only ≥ 3 · below 3, do not set type. Check any other pair: `python scripts/contrast.py <fg> <bg>` (hex or palette names), or `--approved` to list the table above.

### Do not [p.9]
- Live, Ember, Wheat and Saffron are not text on Paper. Live fills a card. Saffron is a tick or a short underline.
- Body copy does not sit on Strand, Live or Saffron.
- A paragraph on a field of Strand is wrong.

## Rules of thumb
- **Strand** does one job per frame/layout. If you are tempted to add a second Strand item, remove the first or remove the second.
- Pick one ground. Warm Paper for video and long documents; Paper for web and short documents.
- Captions: Muted on Paper; Bark on warm grounds. Never Strand, Live or Saffron.
- When in doubt, the quieter choice [p.2].
