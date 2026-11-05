# Typography [PDF p.10–11, p.14]

Two faces. **Inter** is the text face. **Baskerville** is the title face. Inter is open source (SIL Open Font License), so the PDF and production files use the same font files. The PDF draws Baskerville with Libre Baskerville; production files name Baskerville.

Files: `branding/guide/fonts/` (also `motion/public/fonts/`):

| File | Use |
|---|---|
| `Inter-Regular.ttf` (400), `Inter-Medium.ttf` (500), `Inter-SemiBold.ttf` (600), `Inter-Bold.ttf` (700) | Inter, static 24pt-opsz cut |
| `LibreBaskerville-Regular.ttf`, `-Bold.ttf`, `-Italic.ttf` | Baskerville stand-in |
| `Redaction35-Regular.otf`, `.woff2` | Website hero only |

Never rely on system fonts: a Mac and a PC draw different letters. Bundle the files.

## Roles [p.11]

| Role | Face | Notes |
|---|---|---|
| Accent | Inter Bold, small caps | Labels such as `reward hacking`. Tracked. Never set these in Baskerville |
| Heading 1 | Baskerville Bold | Sentence case |
| Heading 2 | Baskerville Bold | Smaller than heading 1 |
| Heading 3 | Baskerville Regular | Smaller than heading 2 |
| Body | Inter Regular | Left aligned |
| Quote | Baskerville Italic | The only italic in the system |
| Caption | Baskerville Regular | Smaller than heading 3 |
| Website hero | Redaction 35 Regular, then Inter Medium | See below |

### Inter weights [p.11]

| Weight | Use |
|---|---|
| 400 Regular | Body and decks |
| 500 Medium | Buttons |
| 600 Semibold | Navigation, 12px |
| 700 Bold | Wordmark and small caps. **Not a paragraph** |

### Web wordmark [p.10]
Inter Bold, 29px, tracking −0.055em, 3px from a 36px mark. Video and print use the SVG lockup, not live type.

### Website hero [p.11]
"Complex AI safety topics, said simply."
1. `Complex AI safety topics, ` in Redaction 35 Regular, Ink, tracking −0.035em.
2. `said simply` in Inter Medium, Strand.
3. `.` in Ink.

If Redaction is unavailable, set step 1 in Inter Regular. Don't draw the redaction bars by hand.

## Rules [p.10]
- Headlines use sentence case. Small caps are for labels and navigation.
- Left align. Do not justify, and do not centre a paragraph.
- Inter stays roman. A quote is Baskerville italic, and only a quote.
- Body lines run about 60 to 75 characters.
- Heading 1 and 2 are Bold, heading 3 and captions are Regular.

## Web type scale (carried over from the earlier skill; not printed in the PDF)

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
| Website hero | Inter + Redaction | 52–120px | Medium 500; Redaction 400 | −0.06em; Redaction −0.035em | 0.98 |

## Video type
Sizes for video live with the animation system, not here:
- Paper-collage style: `paper-cutout-animation/SKILL.md` §0 and §9 (labels ≥ 26 px at 1280×720, text light, Inter throughout).
- Original flat system: `TYPE` in `motion/src/brand/tokens.ts` (1080p roles, via `<Text role>`).
Both follow the face and case rules above.
