# AI Safety Said Simply — Brand package

## Logo files

Use `logos/AISSS-logo-black.svg` on light backgrounds and `logos/AISSS-logo-white.svg` on dark backgrounds. The SVG wordmark uses outlines, so it needs no installed font. Use the yarn mark alone for favicons and small profile images. PNG files have transparent backgrounds.

The horizontal logo matches the website: a 36-unit yarn mark, a 3-unit gap, and a 29-unit bold sans wordmark (set in Inter in the current guide). Keep the original proportions. Leave at least one-quarter of the yarn mark height clear around the logo. Use the full logo at 120 pixels wide or larger; use the mark alone below this size.

## Colours

- Ink: #111111
- White: #FFFFFF
- Hero orange: #C64D0A
- Live library tile: #FF8A3D
- Light grey: #F5F5F5
- Body grey: #595959

## Typography

**Inter** is the main text face (it replaces Helvetica everywhere). Baskerville is the title face (Libre Baskerville is the stand-in). The hero uses Redaction 35 Regular for “Complex AI safety topics,” and Inter for “said simply.” Keep the font texture static. Inter is open source (SIL Open Font License); the static files and its licence are in `guide/fonts/`. Redaction and Noto license notices are included in `licenses-*.zip`.

## Favicons

The ICO includes 16, 32, and 48 pixel sizes. The SVG and PNG icons use the same yarn mark on white. Use apple-touch-icon.png for Apple devices, and the 192 and 512 pixel icons for app or shortcut use.

## Source and attribution

The yarn mark comes from Google Noto Emoji U+1F9F6, under the SIL Open Font License. Source: https://github.com/googlefonts/noto-emoji
Redaction comes from MCKL: https://www.redaction.us/
These assets preserve the existing website identity. The yarn mark is a shared open-source design, not an exclusive trademark.

## The visual identity guide

`AISSS-Visual-Identity.pdf` is the current guide (Inter edition). It is built from `guide/build_guide.py`, with its fonts (`guide/fonts/`), logos (`guide/logos/`) and graphics (`guide/graphics/`) alongside. To change the guide, edit the script and rebuild; don't edit the PDF.

```bash
cd branding/guide
python3 build_guide.py     # needs Python 3, PyMuPDF (pip install pymupdf) and Chrome or Edge installed
```

The build writes `../AISSS-Visual-Identity.pdf` and generates `guide.html` and `preview/` (both git-ignored). Agents read the same rules as a skill: `.claude/skills/aisss-visual-identity/`. Keep the three in step when a brand rule changes.
