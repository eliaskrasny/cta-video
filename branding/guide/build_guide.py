#!/usr/bin/env python3
"""Build the AI Safety Said Simply visual identity PDF."""

from __future__ import annotations

import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

BRAND = Path(__file__).resolve().parent  # branding/guide
ROOT = BRAND.parent  # branding/
FONTS = BRAND / "fonts"
GRAPHICS = BRAND / "graphics"
LOGOS = BRAND / "logos"
PREVIEW = BRAND / "preview"  # generated, gitignored
HTML_PATH = BRAND / "guide.html"  # generated, gitignored
PDF_PATH = ROOT / "AISSS-Visual-Identity.pdf"  # the published guide lives one level up

FONT_URLS = {
    "Redaction35-Regular.woff2": [
        "https://www.aisafetysaidsimply.com/_next/static/immutable/media/"
        "Redaction35_Regular-s.p.40v4onvesjrv5.woff2"
    ],
    "LibreBaskerville-Regular.ttf": [
        "https://raw.githubusercontent.com/impallari/Libre-Baskerville/master/fonts/ttf/LibreBaskerville-Regular.ttf",
    ],
    "LibreBaskerville-Italic.ttf": [
        "https://raw.githubusercontent.com/impallari/Libre-Baskerville/master/fonts/ttf/LibreBaskerville-Italic.ttf",
    ],
    "LibreBaskerville-Bold.ttf": [
        "https://raw.githubusercontent.com/impallari/Libre-Baskerville/master/fonts/ttf/LibreBaskerville-Bold.ttf",
    ],
}


def rgb_of(value: str) -> tuple[int, int, int]:
    h = value.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def cmyk_of(value: str) -> tuple[int, int, int, int]:
    r, g, b = [c / 255 for c in rgb_of(value)]
    k = 1 - max(r, g, b)
    if k >= 0.999:
        return (0, 0, 0, 100)
    scale = 1 - k
    return (
        int(round((1 - r - k) / scale * 100)),
        int(round((1 - g - k) / scale * 100)),
        int(round((1 - b - k) / scale * 100)),
        int(round(k * 100)),
    )


def luminance(value: str) -> float:
    def channel(c: int) -> float:
        v = c / 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4

    r, g, b = rgb_of(value)
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def contrast(a: str, b: str) -> float:
    hi, lo = sorted((luminance(a), luminance(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def fmt_rgb(value: str) -> str:
    return ", ".join(str(c) for c in rgb_of(value))


def fmt_cmyk(value: str) -> str:
    return " / ".join(str(c) for c in cmyk_of(value))


def grade(ratio: float) -> str:
    if ratio >= 7:
        return "AAA"
    if ratio >= 4.5:
        return "AA"
    if ratio >= 3:
        return "Large only"
    return "Do not set type"


COLORS = {
    "Ink": "#111111",
    "Ink 2": "#262626",
    "Paper": "#FFFFFF",
    "Paper 2": "#F5F5F5",
    "Paper 3": "#EBEBEB",
    "Muted": "#595959",
    "Line": "#D4D4D4",
    "Line 2": "#858585",
    "Strand": "#C64D0A",
    "Live": "#FF8A3D",
    "Ember": "#F57828",
    "Warm Paper": "#F4EFE6",
    "Wool": "#E3D5C3",
    "Wheat": "#CDBBA4",
    "Bark": "#5C534C",
    "Clay": "#8C3410",
    "Indigo": "#1B3A4B",
    "Moss": "#1E5C44",
    "Saffron": "#E2A100",
}


def light_chip(value: str) -> str:
    return " chip-line" if luminance(value) > 0.82 else ""


def swatch(name: str, token: str, use: str) -> str:
    value = COLORS[name]
    return f"""
    <article class="swatch">
      <div class="chip{light_chip(value)}" style="background:{value}"></div>
      <div class="meta">
        <h3>{name}</h3>
        <p class="hex">{value}</p>
        <p class="spec"><span>RGB</span> {fmt_rgb(value)}</p>
        <p class="spec"><span>CMYK</span> {fmt_cmyk(value)}</p>
        <p class="token">{token}</p>
        <p class="use">{use}</p>
      </div>
    </article>"""


def pair_row(fg_name: str, bg_name: str, role: str) -> str:
    fg, bg = COLORS[fg_name], COLORS[bg_name]
    ratio = contrast(fg, bg)
    label = grade(ratio)
    bad = " bad" if label == "Do not set type" else ""
    return f"""
    <div class="pair{bad}">
      <div class="pair-sample" style="background:{bg};color:{fg}">
        <strong>Said simply</strong>
      </div>
      <div class="pair-meta">
        <b>{fg_name}</b> on {bg_name}
        <span>{ratio:.1f}:1 · {label}</span>
        <span class="role">{role}</span>
      </div>
    </div>"""


def page(section: str, title: str, folio: str, body: str) -> str:
    return f"""
    <section class="page">
      <header class="run"><span><b>{section}</b> {title}</span><span class="quiet">Visual identity</span></header>
      {body}
      <footer class="foot"><span>AI Safety Said Simply</span><span>{folio}</span></footer>
    </section>
    """


CSS = r"""
@font-face { font-family: "Inter Regular"; src: url("fonts/Inter-Regular.ttf") format("truetype"); font-weight: 400; font-style: normal; }
@font-face { font-family: "Inter Medium"; src: url("fonts/Inter-Medium.ttf") format("truetype"); font-weight: 500; font-style: normal; }
@font-face { font-family: "Inter Semibold"; src: url("fonts/Inter-SemiBold.ttf") format("truetype"); font-weight: 600; font-style: normal; }
@font-face { font-family: "Inter Bold"; src: url("fonts/Inter-Bold.ttf") format("truetype"); font-weight: 700; font-style: normal; }
@font-face { font-family: Inter; src: url("fonts/Inter-Regular.ttf") format("truetype"); font-weight: 400; font-style: normal; }
@font-face { font-family: Inter; src: url("fonts/Inter-Medium.ttf") format("truetype"); font-weight: 500; font-style: normal; }
@font-face { font-family: Inter; src: url("fonts/Inter-SemiBold.ttf") format("truetype"); font-weight: 600; font-style: normal; }
@font-face { font-family: Inter; src: url("fonts/Inter-Bold.ttf") format("truetype"); font-weight: 700; font-style: normal; }
@font-face { font-family: Baskerville; src: url("fonts/LibreBaskerville-Regular.ttf") format("truetype"); font-weight: 400; font-style: normal; }
@font-face { font-family: Baskerville; src: url("fonts/LibreBaskerville-Italic.ttf") format("truetype"); font-weight: 400; font-style: italic; }
@font-face { font-family: Baskerville; src: url("fonts/LibreBaskerville-Bold.ttf") format("truetype"); font-weight: 700; font-style: normal; }
@font-face { font-family: "Baskerville Bold"; src: url("fonts/LibreBaskerville-Bold.ttf") format("truetype"); font-weight: 700; font-style: normal; }
@font-face { font-family: "Baskerville Italic"; src: url("fonts/LibreBaskerville-Italic.ttf") format("truetype"); font-weight: 400; font-style: italic; }
@font-face { font-family: Redaction; src: url("fonts/Redaction35-Regular.otf") format("opentype"), url("fonts/Redaction35-Regular.woff2") format("woff2"); font-weight: 400; font-style: normal; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; }
body { font-family: Inter, sans-serif; color: #111; font-weight: 400; font-synthesis: none; }
@page { size: letter; margin: 0; }
.page {
  width: 8.5in; height: 11in; position: relative; overflow: hidden;
  padding: 0.46in 0.58in 0.58in; background: #fff; color: #111;
  break-after: page; page-break-after: always;
}
.page:last-child { break-after: auto; page-break-after: auto; }
.run {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 8pt; letter-spacing: 0.12em; font-variant: small-caps; text-transform: lowercase;
  font-weight: 700; border-bottom: 0.75pt solid #111; padding-bottom: 7pt; margin: 0 0 16pt;
}
.run b { color: #C64D0A; font-weight: 700; letter-spacing: 0.04em; margin-right: 7pt; }
.run .quiet { font-weight: 400; letter-spacing: 0.16em; color: #595959; }
h1 { font-family: "Baskerville Bold", Baskerville, "Libre Baskerville", "Times New Roman", serif; font-weight: 700; font-size: 28pt; letter-spacing: -0.02em; line-height: 1.02; margin: 0 0 8pt; }
h2 { font-weight: 700; font-size: 8.5pt; letter-spacing: 0.12em; font-variant: small-caps; text-transform: lowercase; margin: 11pt 0 4pt; }
h2.tight { margin-top: 8pt; }
h3 { font-size: 11pt; font-weight: 700; letter-spacing: -0.02em; margin: 0; }
p { margin: 0 0 6pt; font-size: 9.5pt; line-height: 1.38; }
.lede { font-size: 11pt; line-height: 1.35; color: #262626; max-width: 6.7in; margin-bottom: 10pt; }
.note { font-size: 8.5pt; line-height: 1.35; color: #595959; margin: 4pt 0 0; }
.foot {
  position: absolute; left: 0.58in; right: 0.58in; bottom: 0.28in;
  display: flex; justify-content: space-between; border-top: 0.6pt solid #D4D4D4;
  padding-top: 5pt; font-size: 8pt; color: #595959;
}
.cover { background: #111; color: #fff; padding: 0.72in 0.7in; }
.cover .eyebrow {
  font-size: 9pt; font-weight: 700; letter-spacing: 0.14em; font-variant: small-caps; text-transform: lowercase;
  margin: 0 0 14pt; color: #fff;
}
.cover h1 { font-size: 54pt; letter-spacing: -0.02em; color: #fff; line-height: 0.95; margin: 0; }
.strand-rule { width: 42pt; height: 2.5pt; background: #C64D0A; margin: 16pt 0 22pt; }
.cover-lockup { width: 3.15in; height: auto; }
.cover-loop { position: absolute; right: -0.35in; bottom: 0.85in; width: 3.35in; color: #C64D0A; }
.cover-loop svg { width: 100%; height: auto; display: block; }
.cover-foot {
  position: absolute; left: 0.7in; right: 0.7in; bottom: 0.48in;
  display: flex; justify-content: space-between; font-size: 9pt; color: #C8C8C8;
}
.split { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 0.38in; margin-top: 8pt; }
.toc { list-style: none; margin: 0; padding: 0; }
.toc li { display: grid; grid-template-columns: 0.38in 1fr auto; gap: 8pt; align-items: baseline; padding: 8pt 0; border-bottom: 0.6pt solid #D4D4D4; font-size: 13pt; letter-spacing: -0.02em; }
.toc .n { color: #C64D0A; font-size: 9pt; font-weight: 700; letter-spacing: 0.06em; }
.toc .p { font-size: 10pt; color: #595959; }
.principles { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.22in; margin: 8pt 0 14pt; }
.principles article { border-top: 1.5pt solid #111; padding-top: 8pt; }
.principles b { display: block; color: #C64D0A; font-size: 10pt; letter-spacing: 0.08em; margin-bottom: 4pt; }
.principles h2 { margin-top: 0; }
.audiences { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.16in; }
.audiences article { background: #F5F5F5; padding: 10pt 10pt 8pt; min-height: 1.15in; }
.audiences h3 { font-size: 10.5pt; margin-bottom: 4pt; }
.audiences p, .closer { font-size: 8.5pt; line-height: 1.35; }
.closer { margin-top: 12pt; max-width: 6.6in; color: #262626; }
.lockup-stage { border: 0.75pt solid #D4D4D4; padding: 18pt 16pt 10pt; margin: 0 0 12pt; }
.lockup-stage img { width: 4.15in; height: auto; }
.lockup-stage figcaption, .mark-stage figcaption, .versions figcaption { font-size: 8pt; color: #595959; margin-top: 8pt; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 0.28in; }
.mark-stage { background: #F5F5F5; padding: 16pt 14pt 10pt; }
.mark-stage img { width: 0.82in; height: auto; }
.clear h2 { margin-top: 0; }
.clear-fig { position: relative; height: 1.42in; margin: 8pt 0 4pt; }
.clear-fig i {
  position: absolute; left: 0; top: 0; width: 2.16in; height: 1.22in;
  border: 0.8pt dashed #858585;
}
.clear-fig img { position: absolute; left: 0.405in; top: 0.405in; width: 1.35in; height: auto; }
.mins { display: grid; grid-template-columns: 1.5in 0.9in 1fr; gap: 0.2in; align-items: end; margin-top: 12pt; border-top: 0.6pt solid #D4D4D4; padding-top: 10pt; }
.mins p { font-size: 8pt; color: #595959; margin-top: 5pt; }
.mins img { height: auto; }
.versions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.14in; margin-bottom: 8pt; }
.versions figure { margin: 0; padding: 20pt 12pt 10pt; min-height: 1.28in; }
.on-paper { background: #fff; border: 0.75pt solid #D4D4D4; }
.on-ink { background: #111; }
.on-warm { background: #F4EFE6; }
.versions img { width: 1.85in; height: auto; }
.on-ink figcaption { color: #C8C8C8; }
.dont { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.1in; }
.dont article { background: #F5F5F5; padding: 8pt 8pt 7pt; }
.dont .stage { height: 0.92in; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #fff; }
.dont img { width: 1.35in; height: auto; }
.dont p { font-size: 8pt; color: #262626; margin: 5pt 0 0; min-height: 0.38in; }
.stage.stretch { overflow: visible; }
.stage.stretch img { width: 1.72in; height: 0.28in; transform: none; }
.stage.recolor { gap: 4px; }
.stage.recolor img { width: 0.38in; }
.stage.recolor span { color: #C64D0A; font-weight: 700; font-size: 15pt; letter-spacing: -0.055em; }
.stage.tilt img { width: 0.48in; transform: rotate(-18deg); }
.stage.shadow img { filter: drop-shadow(3px 3px 0 #C8C8C8); width: 1.2in; }
.stage.crowd { position: relative; }
.stage.crowd span { position: absolute; left: 4pt; right: 4pt; top: 8pt; font-size: 8pt; line-height: 1.2; color: #111; }
.stage.crowd img { width: 1.15in; margin-top: 16pt; }
.stage.busy { background: repeating-linear-gradient(135deg, #8aa, #8aa 6px, #d7e4e2 6px, #d7e4e2 12px); }
.stage.busy img { width: 1.2in; }
.grid-3, .grid-2 { display: grid; gap: 0.12in 0.16in; }
.grid-3 { grid-template-columns: 1fr 1fr 1fr; }
.hero-colors .swatch { grid-template-columns: 1fr; }
.hero-colors .chip { height: 2.15in; }
.hero-colors h3 { font-size: 13pt; }
.hero-colors .hex { font-size: 11pt; color: #111; margin-top: 6pt; }
.grid-2 { grid-template-columns: 1fr 1fr; }
.swatch { display: grid; grid-template-columns: 0.72in 1fr; gap: 0.08in; align-items: start; }
.chip { height: 0.72in; }
.chip-line { box-shadow: inset 0 0 0 0.6pt #D4D4D4; }
.meta h3 { font-size: 10.5pt; }
.hex { font-size: 9pt; letter-spacing: 0.01em; margin: 1pt 0; }
.spec, .token, .use { font-size: 8pt; line-height: 1.3; color: #262626; margin: 0; }
.spec span, .token { color: #595959; letter-spacing: 0.02em; }
.token { margin-top: 1pt; }
.use { color: #262626; margin-top: 2pt; }
.group-use { font-size: 8.5pt; color: #595959; margin: 0 0 6pt; }
.proportion { display: flex; height: 14pt; margin-top: 12pt; }
.proportion i { flex: 9; background: #111; }
.proportion b { flex: 1; background: #C64D0A; }
.callout { margin-top: 10pt; border-top: 0.75pt solid #111; padding-top: 8pt; display: grid; grid-template-columns: 1fr 1fr; gap: 0.24in; }
.callout p { font-size: 8.5pt; }
.mono { font-family: ui-monospace, Consolas, monospace; font-size: 7.5pt; }
.signals .use { min-height: 0.55in; }
.pairs { display: grid; grid-template-columns: 1fr 1fr; gap: 5pt 0.16in; }
.pair { display: grid; grid-template-columns: 1.55in 1fr; gap: 6pt; align-items: center; }
.pair-sample { padding: 5pt 7pt 4pt; min-height: 0.48in; box-shadow: inset 0 0 0 0.6pt rgba(17, 17, 17, 0.18); }
.pair-sample strong { display: block; font-size: 11pt; font-weight: 400; letter-spacing: -0.03em; }
.pair-meta { font-size: 8pt; line-height: 1.25; }
.pair-meta span { display: block; color: #595959; font-size: 7.5pt; }
.pair.bad .pair-meta b { color: #8C3410; }
.forbid { margin-top: 14pt; border: 1.5pt solid #111; padding: 8pt 10pt 8pt; }
.forbid h2 { margin: 0 0 6pt; color: #C64D0A; }
.forbid-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.22in; }
.forbid article { background: #F5F5F5; padding: 8pt 8pt 6pt; }
.forbid .tag { font-weight: 700; font-size: 8pt; letter-spacing: 0.12em; font-variant: small-caps; text-transform: lowercase; margin: 0 0 4pt; }
.fail-sample { font-size: 16pt; letter-spacing: -0.03em; margin: 0 0 3pt; color: #FF8A3D; }
.spec-row i { width: 0.22in; }
.fail-field { background: #C64D0A; color: #fff; font-size: 8pt; padding: 7pt 8pt; margin: 0 0 4pt; }
.alpha { font-size: 15pt; letter-spacing: 0.045em; line-height: 1.32; margin: 2pt 0 8pt; }
.display-sample { font-size: 26pt; letter-spacing: -0.04em; line-height: 1.02; margin: 0 0 8pt; }
.weights { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.12in; margin-top: 12pt; }
.weights article { border-top: 0.75pt solid #111; padding-top: 6pt; }
.weights span { display: block; font-size: 20pt; letter-spacing: -0.03em; line-height: 1.05; }
.w400 { font-family: "Inter Regular", Inter, sans-serif; font-weight: 400; font-style: normal; }
.w500 { font-family: "Inter Medium", Inter, sans-serif; font-weight: 500; font-style: normal; }
.w600 { font-family: "Inter Semibold", Inter, sans-serif; font-weight: 600; font-style: normal; }
.w700 { font-family: "Inter Bold", Inter, sans-serif; font-weight: 700; font-style: normal; }
.weights b { display: block; color: #C64D0A; font-size: 8pt; letter-spacing: 0.08em; margin: 2pt 0 3pt; }
.weights p { font-size: 7.7pt; color: #595959; }
.wordmark-row { display: grid; grid-template-columns: 0.42in auto 1fr; gap: 8pt; align-items: center; margin: 10pt 0 8pt; background: #F5F5F5; padding: 8pt 10pt; }
.wordmark-row img { width: 0.38in; height: auto; }
.wm { font-weight: 700; font-size: 22pt; letter-spacing: -0.055em; line-height: 1; }
.wordmark-row p { font-size: 8pt; color: #595959; margin: 0; }
.rules { margin: 0; padding-left: 12pt; }
.rules li { font-size: 8.5pt; line-height: 1.35; margin: 0 0 3pt; }
.hero-spec { background: #F5F5F5; padding: 12pt 14pt 10pt; margin: 2pt 0 8pt; }
.label { font-size: 8pt; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; margin: 0 0 6pt; }
.hero-line { font-size: 23pt; line-height: 1.05; letter-spacing: -0.04em; margin: 0; }
.redact-large { font-family: Redaction, Inter, sans-serif; font-weight: 400; font-size: 52pt; line-height: 0.85; letter-spacing: -0.03em; margin: 0 0 4pt; }
.redact { font-family: Redaction, Inter, sans-serif; font-weight: 400; letter-spacing: -0.035em; }
.strand { color: #C64D0A; }
.dot { color: #111; }
.caption { font-size: 8pt; color: #595959; margin: 6pt 0 0; }
table.scale { width: 100%; border-collapse: collapse; margin: 4pt 0 6pt; }
table.scale th { text-align: left; font-size: 7.5pt; letter-spacing: 0.12em; text-transform: uppercase; color: #595959; font-weight: 700; padding: 0 6pt 4pt 0; border-bottom: 0.75pt solid #111; }
table.scale td { font-size: 8.5pt; padding: 3.5pt 6pt 3.5pt 0; border-bottom: 0.5pt solid #D4D4D4; vertical-align: baseline; }
.loops { display: grid; grid-template-columns: 1.15fr 0.85fr 1.15fr; gap: 0.1in; margin: 4pt 0 8pt; }
.loops figure { margin: 0; min-height: 2.15in; padding: 10pt 8pt 8pt; display: flex; flex-direction: column; justify-content: space-between; }
.loops svg { width: 100%; height: 1.55in; }
.loop-paper { background: #fff; border: 0.75pt solid #D4D4D4; color: #111; }
.loop-ink { background: #111; color: #fff; }
.loop-warm { background: #F4EFE6; color: #C64D0A; }
.loops figcaption { font-size: 7.5pt; color: #595959; margin-top: 4pt; }
.loop-ink figcaption { color: #C8C8C8; }
.rules-col h2 { margin-top: 0; }
.frame { background: #111; color: #fff; height: 3.55in; position: relative; padding: 16pt 16pt 14pt; overflow: hidden; }
.frame .label { color: #fff; }
.frame h2.title { font-family: "Baskerville Bold", Baskerville, "Libre Baskerville", serif; font-variant: normal; font-weight: 700; font-size: 24pt; letter-spacing: -0.02em; text-transform: none; line-height: 1.05; margin: 8pt 0 0; max-width: 5.6in; color: #fff; }
.frame .sub { color: #C8C8C8; font-size: 10pt; margin-top: 6pt; }
.frame-lock { position: absolute; left: 16pt; bottom: 14pt; width: 1.55in; }
.frame-loop { position: absolute; right: -0.4in; bottom: -0.15in; width: 2.8in; color: #C64D0A; }
.frame-loop svg { width: 100%; height: auto; }
.lower { display: grid; grid-template-columns: 4px 1fr auto; gap: 10pt; align-items: center; background: #E3D5C3; color: #111; padding: 8pt 12pt; margin-top: 8pt; }
.lower b { font-family: Inter, sans-serif; font-size: 8pt; letter-spacing: 0.12em; font-variant: small-caps; text-transform: lowercase; font-weight: 700; display: block; }
.lower strong { font-family: "Baskerville Bold", Baskerville, "Libre Baskerville", serif; font-weight: 700; font-size: 14pt; letter-spacing: 0; font-variant: normal; text-transform: none; }
.lower .bar { background: #C64D0A; height: 100%; min-height: 28pt; }
.doc { background: #F4EFE6; padding: 10pt 12pt 8pt; margin-top: 8pt; display: grid; grid-template-columns: 1.3in 1fr; gap: 10pt; }
.doc img { width: 1.2in; height: auto; }
.doc h3 { font-family: "Baskerville Bold", Baskerville, "Libre Baskerville", serif; font-weight: 700; font-size: 15pt; letter-spacing: 0; font-variant: normal; text-transform: none; }
.faces { display: grid; grid-template-columns: 1fr 1fr; gap: 0.24in; }
.face-sample { font-size: 20pt; line-height: 1.15; letter-spacing: 0.01em; margin: 0 0 4pt; }
.bk { font-family: "Baskerville Bold", Baskerville, "Libre Baskerville", serif; font-weight: 700; font-style: normal; letter-spacing: 0; }
.bk-i { font-family: "Baskerville Italic", Baskerville, "Libre Baskerville", serif; font-weight: 400; font-style: italic; font-size: 13pt; line-height: 1.3; margin: 0 0 4pt; }
.specimen { border-top: 0.75pt solid #111; margin-top: 2pt; }
.role { display: grid; grid-template-columns: 0.95in 1fr; column-gap: 10pt; align-items: baseline; padding: 5pt 0 4pt; border-bottom: 0.45pt solid #EBEBEB; }
.role .name { font-size: 7.5pt; font-weight: 700; letter-spacing: 0.1em; font-variant: small-caps; text-transform: lowercase; color: #C64D0A; }
.role p { margin: 0; }
.role .face { font-size: 7.5pt; line-height: 1.3; color: #595959; margin-top: 1pt; }
.accent { font-variant: small-caps; text-transform: lowercase; font-weight: 700; letter-spacing: 0.14em; font-size: 8.5pt; margin: 0; }
.t-h1 { font-family: "Baskerville Bold", Baskerville, "Libre Baskerville", serif; font-weight: 700; font-size: 22pt; line-height: 1.05; letter-spacing: -0.015em; margin: 0; font-variant: normal; text-transform: none; }
.t-h2 { font-family: "Baskerville Bold", Baskerville, "Libre Baskerville", serif; font-weight: 700; font-size: 15pt; line-height: 1.15; letter-spacing: -0.01em; margin: 0; font-variant: normal; text-transform: none; }
.t-h3 { font-family: Baskerville, "Libre Baskerville", serif; font-weight: 400; font-size: 12pt; line-height: 1.25; margin: 0; font-variant: normal; text-transform: none; }
.t-body { font-size: 10pt; font-weight: 400; line-height: 1.4; max-width: 6.2in; }
.t-quote { font-family: "Baskerville Italic", Baskerville, "Libre Baskerville", serif; font-style: italic; font-weight: 400; font-size: 12.5pt; line-height: 1.3; margin: 0; font-variant: normal; text-transform: none; }
.t-caption { font-family: Baskerville, "Libre Baskerville", serif; font-weight: 400; font-size: 9pt; line-height: 1.3; color: #595959; margin: 0; font-variant: normal; text-transform: none; }
.label { font-variant: small-caps; text-transform: lowercase; letter-spacing: 0.14em; }
.doc .rule { width: 28pt; height: 2pt; background: #C64D0A; margin: 4pt 0; }
.doc p { font-size: 8pt; margin: 0; }
.spec-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 0.22in; }
.spec-row { display: grid; grid-template-columns: 0.28in 0.95in 0.62in 1fr; gap: 4pt; align-items: center; font-size: 7.4pt; padding: 2pt 0; border-bottom: 0.4pt solid #EBEBEB; }
.spec-row i { display: block; height: 0.2in; }
.spec-row .nm { font-weight: 700; }
.spec-side h2 { margin-top: 8pt; }
.spec-side p, .spec-side li { font-size: 8pt; line-height: 1.35; }
.spec-side ul { margin: 0; padding-left: 12pt; }
.ui { display: flex; gap: 8pt; margin-top: 6pt; }
.btn { display: inline-block; background: #111; color: #fff; font-family: "Inter Medium", Inter, sans-serif; font-weight: 500; font-size: 9pt; padding: 6pt 10pt; }
.btn.alt { background: #F5F5F5; color: #111; }
"""


def build_html() -> str:
    drift = (GRAPHICS / "strand-drift.svg").read_text(encoding="utf-8")
    double = (GRAPHICS / "strand-double.svg").read_text(encoding="utf-8")
    corner = (GRAPHICS / "strand-corner.svg").read_text(encoding="utf-8")
    logo_black = "logos/AISSS-logo-black.svg"
    logo_white = "logos/AISSS-logo-white.svg"
    mark_black = "logos/yarn-mark-black.svg"
    mark_white = "logos/yarn-mark-white.svg"

    primary = "".join(
        [
            swatch("Ink", "--color-ink", "Text, the logo, dark fields, and primary buttons."),
            swatch("Paper", "--color-paper", "Default ground. Also type and the logo when they sit on Ink."),
            swatch("Strand", "--color-hero-orange", "A word or a short rule. Not body text."),
        ]
    )
    neutrals = "".join(
        [
            swatch("Ink 2", "--color-ink-2", "Secondary headlines and the deck under a title."),
            swatch("Muted", "--color-muted", "Supporting copy, captions, and metadata."),
            swatch("Line 2", "--color-line-2", "Disabled labels and quiet icons. Not for sentences."),
            swatch("Line", "--color-line", "Hairlines, field borders, and dividers."),
            swatch("Paper 3", "--color-paper-3", "Inactive cards and topics still in production."),
            swatch("Paper 2", "--color-paper-2", "Alternate bands and secondary buttons."),
        ]
    )
    warm = "".join(
        [
            swatch("Warm Paper", "Extended", "Video and long documents. Do not mix with Paper in one frame."),
            swatch("Wool", "Extended", "Panels and lower thirds on a warm ground."),
            swatch("Wheat", "Extended", "A second panel or a chart band. Not a text color."),
            swatch("Bark", "Extended", "Captions and axes on Warm Paper, Wool, and Wheat."),
        ]
    )
    family = "".join(
        [
            swatch("Clay", "Extended", "Small orange labels and icons."),
            swatch("Live", "--color-library-live", "Available states. Large fills only, with Ink type on top."),
        ]
    )
    signals = "".join(
        [
            swatch("Indigo", "Extended", "Diagram structure and document links. One cool color, used flat."),
            swatch("Moss", "Extended", "The confirmed point: a node, a tag, a correct path."),
            swatch("Saffron", "Extended", "A tick or a short underline. Not a sentence."),
        ]
    )
    pairs = "".join(
        [
            pair_row("Ink", "Paper", "Default body and headlines"),
            pair_row("Ink", "Paper 2", "Secondary buttons and bands"),
            pair_row("Ink", "Warm Paper", "Video and print body"),
            pair_row("Ink", "Wool", "Lower thirds and panels"),
            pair_row("Ink", "Live", "Type on an available card"),
            pair_row("Paper", "Ink", "Reversed type and the logo"),
            pair_row("Paper", "Indigo", "Labels on a diagram field"),
            pair_row("Paper", "Moss", "Labels on a confirmed node"),
            pair_row("Muted", "Paper", "Captions on the website"),
            pair_row("Bark", "Warm Paper", "Captions on a warm ground"),
            pair_row("Clay", "Paper", "Small Strand-family labels"),
            pair_row("Strand", "Paper", "Emphasis at title size"),
        ]
    )
    spec_rows = []
    order = [
        ("Ink", "--color-ink", "Primary"),
        ("Paper", "--color-paper", "Primary"),
        ("Strand", "--color-hero-orange", "Primary"),
        ("Ink 2", "--color-ink-2", "Neutral"),
        ("Muted", "--color-muted", "Neutral"),
        ("Line 2", "--color-line-2", "Neutral"),
        ("Line", "--color-line", "Neutral"),
        ("Paper 3", "--color-paper-3", "Neutral"),
        ("Paper 2", "--color-paper-2", "Neutral"),
        ("Warm Paper", "—", "Extended"),
        ("Wool", "—", "Extended"),
        ("Wheat", "—", "Extended"),
        ("Bark", "—", "Extended"),
        ("Clay", "—", "Extended"),
        ("Live", "--color-library-live", "Extended"),
        ("Ember", "--color-library-live-hover", "State"),
        ("Indigo", "—", "Extended"),
        ("Moss", "—", "Extended"),
        ("Saffron", "—", "Extended"),
    ]
    for name, token, group in order:
        value = COLORS[name]
        spec_rows.append(
            f'<div class="spec-row"><i class="{light_chip(value).strip()}" style="background:{value}"></i>'
            f'<span class="nm">{name}</span><span>{value}</span><span>{group} · {token if token != "—" else "no site token"}</span></div>'
        )

    cover = f"""
    <section class="page cover">
      <p class="eyebrow">AI Safety Said Simply</p>
      <h1>Visual<br>identity</h1>
      <div class="strand-rule"></div>
      <img class="cover-lockup" alt="AI Safety Said Simply" src="{logo_white}"/>
      <div class="cover-loop">{corner}</div>
      <footer class="cover-foot"><span>Brand guide · October 2026</span><span>aisafetysaidsimply.com</span></footer>
    </section>"""

    pages = [
        cover,
        page("02", "Contents", "2", f"""
          <h1>Contents</h1>
          <div class="split">
            <ol class="toc">
              <li><span class="n">03</span><span class="t">The idea</span><span class="p">3</span></li>
              <li><span class="n">04</span><span class="t">Logo</span><span class="p">4</span></li>
              <li><span class="n">05</span><span class="t">Colour</span><span class="p">6</span></li>
              <li><span class="n">06</span><span class="t">Typography</span><span class="p">10</span></li>
              <li><span class="n">07</span><span class="t">Graphics</span><span class="p">12</span></li>
              <li><span class="n">08</span><span class="t">In use</span><span class="p">13</span></li>
              <li><span class="n">09</span><span class="t">Specification</span><span class="p">14</span></li>
            </ol>
            <div>
              <h2>How to use this guide</h2>
              <p>Ink, Paper, and Strand cover the website, the videos, and the documents. Other colours belong in diagrams, video, and print.</p>
              <p>Use the SVG for the logo. Leave the yarn drawing alone. Body text is Inter. Heading 1 and heading 2 are Baskerville Bold. Quotes are Baskerville italic. Labels are Inter small caps.</p>
              <p>Corners are square. Colour is flat. An unlisted case gets the quieter choice.</p>
            </div>
          </div>"""),
        page("03", "The idea", "3", """
          <h1>Same habit as the writing.</h1>
          <p class="lede">AI Safety Said Simply explains hard topics in short pieces. People take them into briefings and classes. The design follows the writing.</p>
          <div class="principles">
            <article><b>01</b><h2>Plain first</h2><p>Ink on Paper. Square corners. No shadow and no gradient. Inter stays roman. Italic belongs to Baskerville, and only in a quote.</p></article>
            <article><b>02</b><h2>One colour</h2><p>Strand does one job in a frame: a word, a short rule, or a state. A second Strand item means the first one goes.</p></article>
            <article><b>03</b><h2>Readable</h2><p>Headlines use sentence case. Labels use Inter small caps. Body text is large enough for a briefing, and it stays left aligned.</p></article>
          </div>
          <div class="audiences">
            <article><h3>Policymakers</h3><p>Memos and demos, short enough to brief from.</p></article>
            <article><h3>Educators</h3><p>Material for a class.</p></article>
            <article><h3>Journalists</h3><p>The idea, without the prerequisites.</p></article>
            <article><h3>The public</h3><p>Short enough to finish after work.</p></article>
          </div>
          <p class="closer">The pieces explain ideas. They do not lobby. Where researchers disagree, the piece says so.</p>"""),
        page("04", "Logo", "4", f"""
          <h1>Logo</h1>
          <p class="lede">The yarn is the mark. AISSS sits beside it. This pair is the only lockup. There is no stacked version.</p>
          <figure class="lockup-stage">
            <img alt="Primary lockup" src="{logo_black}"/>
            <figcaption>Primary lockup · AISSS-logo-black.svg · on Paper, Paper 2, Paper 3, and Warm Paper.</figcaption>
          </figure>
          <div class="two">
            <figure class="mark-stage">
              <img alt="Yarn mark" src="{mark_black}"/>
              <figcaption>Mark alone, when the name is already on screen. yarn-mark-black.svg</figcaption>
            </figure>
            <div class="clear">
              <h2>Clear space</h2>
              <p>Leave a margin the height of the yarn mark on every side. The gap inside the lockup is part of the file. On the web the gap is 3px next to a 36px mark.</p>
              <div class="clear-fig"><i></i><img alt="" src="{logo_black}"/></div>
              <p class="note">Type, loops, and other marks stay outside the dashed box.</p>
            </div>
          </div>
          <div class="mins">
            <div><img alt="" src="{logo_black}" style="width:1.26in"/><p>Minimum lockup<br>32mm · 128px wide</p></div>
            <div><img alt="" src="{mark_black}" style="width:0.32in"/><p>Minimum mark<br>8mm · 28px</p></div>
            <div class="min-copy"><h2>Wordmark</h2><p>The letters are AISSS. In a sentence, write AI Safety Said Simply. The accessible name on the lockup is the full name.</p></div>
          </div>"""),
        page("04", "Logo", "5", f"""
          <h1>Colour and misuse</h1>
          <p class="lede">The mark and the wordmark share one colour: Ink, or Paper. Strand does not recolor the logo. On a photograph, put the lockup on a solid Ink or Paper field.</p>
          <div class="versions">
            <figure class="on-paper"><img alt="" src="{logo_black}"/><figcaption>Ink on Paper</figcaption></figure>
            <figure class="on-ink"><img alt="" src="{logo_white}"/><figcaption>Paper on Ink</figcaption></figure>
            <figure class="on-warm"><img alt="" src="{logo_black}"/><figcaption>Ink on Warm Paper</figcaption></figure>
          </div>
          <h2 class="tight">Do not</h2>
          <div class="dont">
            <article><div class="stage stretch"><img alt="" src="{logo_black}"/></div><p>Stretch or condense the lockup.</p></article>
            <article><div class="stage recolor"><img alt="" src="{mark_black}"/><span>AISSS</span></div><p>Set the wordmark in Strand, or split the colours.</p></article>
            <article><div class="stage tilt"><img alt="" src="{mark_black}"/></div><p>Rotate, flip, or crop the yarn.</p></article>
            <article><div class="stage shadow"><img alt="" src="{logo_black}"/></div><p>Add a shadow, an outline, or a glow.</p></article>
            <article><div class="stage crowd"><span>said simply, and the logo crashes into the line</span><img alt="" src="{logo_black}"/></div><p>Let type enter the clear space.</p></article>
            <article><div class="stage busy"><img alt="" src="{logo_white}"/></div><p>Sit it on a photo or a pattern.</p></article>
          </div>"""),
        page("05", "Colour", "6", f"""
          <h1>Colour</h1>
          <p class="lede">Ink and Paper fill most of a page. Strand is the strong colour, and a page gets a little of it.</p>
          <h2>Primary</h2>
          <p class="group-use">These three come first. CMYK figures are process approximations for print.</p>
          <div class="grid-3 hero-colors">{primary}</div>
          <div class="proportion" aria-hidden="true"><i></i><b></b></div>
          <p class="note">The long bar is Ink and Paper. The short bar is the Strand in one layout.</p>"""),
        page("05", "Colour", "7", f"""
          <h1>Neutrals</h1>
          <p class="lede">Greys from the website. They separate a headline from a caption. Ink is #111111. Do not add pure black beside it.</p>
          <div class="grid-2">{neutrals}</div>
          <div class="callout">
            <p>Line 2 is not body text. #858585 fails ordinary contrast on Paper. It suits a disabled control or a quiet icon. Reading text is Muted or darker.</p>
            <p>Cream is Paper. On the site, --color-cream is white and --color-accent is Ink. A primary button is an Ink square with Paper type. Corners stay at 0.</p>
          </div>"""),
        page("05", "Colour", "8", f"""
          <h1>Extended palette</h1>
          <p class="lede">For video, diagrams, and print. The website keeps the primary colours and the neutrals.</p>
          <h2>Warm grounds</h2>
          <p class="group-use">One ground per piece. Warm Paper and Paper do not share a frame.</p>
          <div class="grid-2">{warm}</div>
          <h2>Strand family</h2>
          <p class="group-use">Clay is dark orange for small text. Live is a fill. Ember, #F57828, is the Live hover, not a headline colour.</p>
          <div class="grid-2">{family}</div>
          <h2>Signals</h2>
          <p class="group-use">Diagrams only. One signal colour in a figure, plus Ink. Signals stay out of headlines, and off a line with Strand.</p>
          <div class="grid-3 signals">{signals}</div>"""),
        page("05", "Colour", "9", f"""
          <h1>Combinations</h1>
          <p class="lede">Ratios follow WCAG. AAA and AA are fine for body copy. Large only means 18pt, or 14pt bold, in a short line. Weaker pairs are fills or strokes.</p>
          <div class="pairs">{pairs}</div>
          <section class="forbid">
            <h2>Do not</h2>
            <div class="forbid-grid">
              <article>
                <p class="fail-sample">said simply</p>
                <p>Live, Ember, Wheat, and Saffron are not text on Paper. Live fills a card. Saffron is a tick or a short underline.</p>
              </article>
              <article>
                <p class="fail-field">A paragraph sitting on a field of Strand.</p>
                <p>Body copy does not sit on Strand, Live, or Saffron.</p>
              </article>
            </div>
          </section>"""),
        page("06", "Typography", "10", f"""
          <h1>Two faces.</h1>
          <p class="lede">Inter is the text face. Baskerville is the title face. Inter is open source (SIL Open Font License), so the PDF and production files use the same font files from brand/fonts. This PDF draws Baskerville with Libre Baskerville. Production files name Baskerville.</p>
          <div class="faces">
            <div>
              <h2>Inter</h2>
              <p class="face-sample">Aa Bb Cc Dd Ee Ff<br>1234567890</p>
              <p>Body, buttons, navigation, the wordmark, and small-cap labels.</p>
            </div>
            <div>
              <h2>Baskerville</h2>
              <p class="face-sample bk">Aa Bb Cc Dd Ee Ff<br>1234567890</p>
              <p class="bk-i">Quotes are set in italic.</p>
              <p>Heading 1 and heading 2 are Bold. Heading 3 and captions are Regular.</p>
            </div>
          </div>
          <div class="wordmark-row">
            <img alt="" src="{mark_black}"/>
            <span class="wm">AISSS</span>
            <p>Web wordmark. Inter Bold, 29px, tracking −0.055em, 3px from a 36px mark. Video and print use the SVG lockup.</p>
          </div>
          <ul class="rules">
            <li>Headlines use sentence case. Small caps are for labels and navigation.</li>
            <li>Left align. Do not justify, and do not center a paragraph.</li>
            <li>Inter stays roman here. A quote is Baskerville italic.</li>
            <li>Body lines run about 60 to 75 characters.</li>
          </ul>"""),
        page("06", "Typography", "11", """
          <h1>Type in use.</h1>
          <p class="lede">The role sits on the left. Heading 1 and heading 2 are Baskerville Bold. Under the sample, the same words show the four Inter weights.</p>
          <div class="specimen">
            <div class="role"><span class="name">Accent</span><div><p class="accent">Reward hacking</p><p class="face">Inter Bold, small caps</p></div></div>
            <div class="role"><span class="name">Heading 1</span><div><p class="t-h1">The model found a shortcut.</p><p class="face">Baskerville Bold</p></div></div>
            <div class="role"><span class="name">Heading 2</span><div><p class="t-h2">What the training signal rewards</p><p class="face">Baskerville Bold</p></div></div>
            <div class="role"><span class="name">Heading 3</span><div><p class="t-h3">A short section inside the piece</p><p class="face">Baskerville Regular</p></div></div>
            <div class="role"><span class="name">Body</span><div><p class="t-body w400">The piece explains the idea in a few minutes. Body text stays in Inter Regular, left aligned.</p><p class="face">Inter Regular</p></div></div>
            <div class="role"><span class="name">Quote</span><div><p class="t-quote">We cut jargon and length, not substance.</p><p class="face">Baskerville Italic</p></div></div>
            <div class="role"><span class="name">Caption</span><div><p class="t-caption">Still from the explainer, with the claim in one line.</p><p class="face">Baskerville Regular</p></div></div>
          </div>
          <div class="weights">
            <article><span class="w400">Said simply</span><b>400 Regular</b><p>Body and decks.</p></article>
            <article><span class="w500">Said simply</span><b>500 Medium</b><p>Buttons.</p></article>
            <article><span class="w600">Said simply</span><b>600 Semibold</b><p>Navigation, 12px.</p></article>
            <article><span class="w700">Said simply</span><b>700 Bold</b><p>Wordmark and small caps. Not a paragraph.</p></article>
          </div>
          <div class="hero-spec">
            <p class="label">Website hero</p>
            <p class="hero-line"><span class="redact">Complex AI safety topics, </span><span class="strand w500">said simply</span><span class="dot">.</span></p>
            <p class="caption">Redaction 35 Regular on the first clause. The plain words are Inter Medium in Strand. The period stays Ink.</p>
          </div>"""),
        page("07", "Graphics", "12", f"""
          <h1>Strand loops</h1>
          <p class="lede">One open stroke, with round ends, then off the edge. One loop in a layout. Scale it evenly, stroke included.</p>
          <div class="loops">
            <figure class="loop-paper">{drift}<figcaption>Ink on Paper · strand-drift.svg</figcaption></figure>
            <figure class="loop-ink">{drift}<figcaption>Paper on Ink</figcaption></figure>
            <figure class="loop-warm">{double}<figcaption>Strand on Warm Paper · strand-double.svg</figcaption></figure>
          </div>
          <div class="two rules-col">
            <div>
              <h2>Use</h2>
              <ul class="rules">
                <li>One loop in a layout. The double loop counts as the one.</li>
                <li>Scale it evenly. Do not thicken the stroke to match a headline.</li>
                <li>Ink on a light ground. Paper on Ink. A Strand loop means the headline is not Strand.</li>
                <li>The ends run off the edge, or behind a solid panel. Corner file: strand-corner.svg.</li>
              </ul>
            </div>
            <div>
              <h2>Do not</h2>
              <ul class="rules">
                <li>Trace the logo, or tile the loops into a pattern or a border.</li>
                <li>Stretch the path to fill a banner. Do not add a shadow, a gradient, or a second stroke.</li>
                <li>A loop is not a bullet. A Strand underline is a straight rule, 1.5 to 2pt, about as long as the word.</li>
                <li>End the line in the middle of a sentence.</li>
              </ul>
            </div>
          </div>"""),
        page("08", "In use", "13", f"""
          <h1>In use</h1>
          <p class="lede">A title card, a lower third, and the top of a document. Each one uses Strand once. Corners stay square. The title is Baskerville Bold.</p>
          <div class="frame">
            <p class="label">Reward hacking</p>
            <h2 class="title">The model found a shortcut.</h2>
            <p class="sub">A short explainer.</p>
            <img class="frame-lock" alt="" src="{logo_white}"/>
            <div class="frame-loop">{drift}</div>
          </div>
          <div class="lower">
            <i class="bar"></i>
            <div><b>02 · What good looks like</b><strong>Reward hacking</strong></div>
            <img alt="" src="{mark_black}" style="width:0.32in"/>
          </div>
          <div class="doc">
            <img alt="" src="{logo_black}"/>
            <div>
              <p class="label">Briefing note</p>
              <h3>Lower the barrier, and the idea travels.</h3>
              <div class="rule"></div>
              <p>Body stays Ink on Warm Paper, in Inter Regular. The Strand rule under the title is the only Strand on the page.</p>
            </div>
          </div>
          <div class="ui"><span class="btn">Explore the library</span><span class="btn alt">Chat with us</span></div>"""),
        page("09", "Specification", "14", f"""
          <h1>Specification</h1>
          <p class="lede">Core values match the website. Extended values are for video, diagrams, and print. CMYK is a process approximation.</p>
          <div class="spec-grid">
            <div>{''.join(spec_rows)}</div>
            <div class="spec-side">
              <h2>Type</h2>
              <ul>
                <li>Inter for body, buttons, navigation, the wordmark, and small caps. Font files are in brand/fonts.</li>
                <li>Baskerville Bold for heading 1 and heading 2. Baskerville Regular for heading 3 and captions. Italic for quotes. Libre Baskerville in this PDF.</li>
                <li>Redaction 35 Regular for the website hero clause. Square corners. Flat colour.</li>
              </ul>
              <h2>Logo files</h2>
              <ul>
                <li>AISSS-logo-black.svg</li>
                <li>AISSS-logo-white.svg</li>
                <li>yarn-mark-black.svg</li>
                <li>yarn-mark-white.svg</li>
              </ul>
              <h2>Loops</h2>
              <ul>
                <li>brand/graphics/strand-drift.svg</li>
                <li>brand/graphics/strand-double.svg</li>
                <li>brand/graphics/strand-corner.svg</li>
              </ul>
              <h2>Contact</h2>
              <p>aisafetysaidsimply.com<br>contact@aisafetysaidsimply.com</p>
            </div>
          </div>"""),
    ]
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>AI Safety Said Simply — Visual identity</title>
<style>{CSS}</style>
</head>
<body>
{''.join(pages)}
</body>
</html>
"""


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "aisss-brand-guide"})
    with urllib.request.urlopen(req, timeout=60) as response:
        dest.write_bytes(response.read())


def ensure_redaction_otf() -> None:
    dest = FONTS / "Redaction35-Regular.otf"
    src = FONTS / "Redaction35-Regular.woff2"
    raw = src.read_bytes()
    print("woff2", len(raw), raw[:4])
    if dest.exists() and dest.stat().st_size > 1000:
        print("redaction otf", dest.stat().st_size, dest.read_bytes()[:4])
        return
    try:
        from fontTools.ttLib import TTFont
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "fonttools", "brotli"])
        from fontTools.ttLib import TTFont
    try:
        font = TTFont(src)
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "brotli"])
        font = TTFont(src)
    font.flavor = None
    font.save(dest)
    print("redaction otf", dest.stat().st_size, dest.read_bytes()[:4])


def ensure_fonts() -> None:
    FONTS.mkdir(parents=True, exist_ok=True)
    for name, urls in FONT_URLS.items():
        dest = FONTS / name
        if dest.exists() and dest.stat().st_size > 1000:
            continue
        last = None
        for url in urls:
            try:
                download(url, dest)
                last = None
                break
            except Exception as exc:  # noqa: BLE001
                last = exc
        if last:
            raise SystemExit(f"Could not download {name}: {last}")


def find_browser() -> list[str]:
    names = [
        "google-chrome",
        "google-chrome-stable",
        "chromium",
        "chromium-browser",
        "microsoft-edge",
    ]
    for name in names:
        path = shutil.which(name)
        if path:
            return [path]
    windows = [
        "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
        "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        "/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe",
        "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    ]
    for path in windows:
        if Path(path).exists():
            return [path]
    raise SystemExit("No Chrome or Edge binary found for PDF printing.")


def to_browser_path(path: Path, browser: str) -> str:
    if browser.endswith(".exe"):
        return subprocess.check_output(["wslpath", "-w", str(path)], text=True).strip()
    return path.as_uri()


def print_pdf(browser: list[str]) -> None:
    exe = browser[0]
    html_arg = to_browser_path(HTML_PATH, exe)
    pdf_arg = to_browser_path(PDF_PATH, exe)
    if not html_arg.startswith("file:") and not html_arg.startswith("\\\\") and ":" in html_arg:
        html_arg = html_arg  # Windows path; Chrome accepts it
    cmd = [
        exe,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--no-first-run",
        "--font-render-hinting=none",
        f"--print-to-pdf={pdf_arg}",
        html_arg if html_arg.startswith("file:") else html_arg,
    ]
    if not html_arg.startswith("file:"):
        # Windows Chrome needs a file URL for reliable local font loading.
        win_html = html_arg.replace("\\", "/")
        if len(win_html) > 1 and win_html[1] == ":":
            cmd[-1] = "file:///" + win_html
    subprocess.check_call(cmd, timeout=90)


def rasterize() -> int:
    PREVIEW.mkdir(parents=True, exist_ok=True)
    import fitz

    doc = fitz.open(PDF_PATH)
    for old in PREVIEW.glob("page-*.png"):
        old.unlink()
    for index, pdf_page in enumerate(doc, start=1):
        pix = pdf_page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False)
        pix.save(PREVIEW / f"page-{index:02d}.png")
        rect = pdf_page.rect
        for block in pdf_page.get_text("blocks"):
            x0, y0, x1, y1, text, *_ = block
            snippet = " ".join(text.split())
            if not snippet:
                continue
            if y1 > rect.height - 18 and snippet not in {"2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"}:
                if "AI Safety Said Simply" not in snippet and "aisafetysaidsimply.com" not in snippet:
                    print(f"LOW p{index}: {snippet[:80]}")
            if index > 1 and (x0 < 30 or y0 < 24):
                print(f"EDGE p{index}: {snippet[:80]}")
    print(f"pages {doc.page_count}")
    return doc.page_count


def ensure_inter() -> None:
    """Inter is open source. Static files live in brand/fonts; unpack them from the zip if missing."""
    weights = ["Regular", "Medium", "SemiBold", "Bold"]
    if all((FONTS / f"Inter-{w}.ttf").exists() for w in weights):
        return
    import zipfile

    archives = sorted(ROOT.glob("Inter*.zip"))
    if not archives:
        raise SystemExit("Inter static fonts missing from brand/fonts and no Inter*.zip found next to brand/.")
    with zipfile.ZipFile(archives[0]) as archive:
        for w in weights:
            (FONTS / f"Inter-{w}.ttf").write_bytes(archive.read(f"Inter/static/Inter_24pt-{w}.ttf"))
        (FONTS / "Inter-OFL.txt").write_bytes(archive.read("Inter/OFL.txt"))


def main() -> None:
    ensure_fonts()
    ensure_redaction_otf()
    ensure_inter()
    HTML_PATH.write_text(build_html(), encoding="utf-8")
    browser = find_browser()
    print("browser", browser[0])
    print_pdf(browser)
    count = rasterize()
    if count != 14:
        raise SystemExit(f"Expected 14 pages, got {count}")
    print(PDF_PATH)


if __name__ == "__main__":
    main()
