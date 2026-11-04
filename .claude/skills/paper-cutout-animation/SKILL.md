---
name: paper-cutout-animation
description: >-
  House animation style for YouTube explainer videos: photocopied paper cut-outs and printed
  paper signs taped onto graph paper, animated as low-frame-rate stop motion. Start here for
  any animated diagram, org chart, process, or "how it fits together" scene. Covers audience and
  composition rules (text light, elements big and clear), the real scanned textures, tear, tape
  and pen-ink defaults, animation curves and timing, the limited palette, and an index of the
  Remotion packages (with their READMEs) that implement all of it.
---

# Paper-cutout stop-motion style

The look: **photocopied cut-outs and printed paper signs, taped onto graph paper, moved by hand and shot at 12 frames per second.** The materials are real (scanned newsprint, creased paper). The motion is choppy and deliberate. Shapes are static.

Reference build: the `C01-org-chart` composition (`motion/src/collage-scenes/org-chart/OrgChart.tsx`). The footage it was rebuilt from is in the shared OneDrive folder, not in git.
Pair with `aisss-visual-identity` for colour, type and logo rules.

---

## 0. Read this first: who you are animating for

You are animating **to maximise YouTube engagement.** Every composition choice serves that. A viewer decides in the first 2–3 seconds whether to stay, and most watch on a phone, often with the sound low. So:

**Keep text light**
- A label is 1–3 words. A scene has at most 5–6 pieces of text in total, and one is the headline idea.
- No sentences, no bullet lists, no paragraphs on screen. The voiceover carries the detail; the picture carries one idea at a time.
- If you are tempted to add a second line of text, cut a word or add a picture instead.

**Keep elements big and clear**
- Design for a phone held at arm's length. At 1280×720: label text **≥ 26 px** (headings and stamps **≥ 30 px**), photo cut-outs **≥ 160 px wide**, tags and banners **≥ 70 px tall**. The reference build is at the *small* end of this (22–30 px labels); go bigger for new scenes.
- Fewer, larger objects beat many small ones. Three to five objects per scene. Past five columns, split the scene.
- One focal point per beat. The thing that just landed is the biggest, highest-contrast thing on screen.
- High contrast only: Ink on Warm Paper, Paper on Ink. Other color accents can be used sparingly. One of the dark schemes is also acceptable if the user asks. No low-contrast grey text, no tiny captions.

**Pace for retention**
- The first frame must already look like the video (not a blank page). Land the first object within 0.5 s.
- New information every 0.25–0.5 s while building; never more than ~4 s without something changing (a hold is fine, a dead scene is not).
- Reveal in the order the voiceover says it. Lines before objects, objects before labels.
- End on the payoff (the stamp, the number, the call to action), not on a fade.
- Keep everything inside a 36 px margin; leave the bottom ~12% clear if captions or YouTube UI may sit there.

---

## 1. Read the package notes before you use a package

Every piece of this style is a package under `motion/src/collage/`. **Before you use a package, read its README, and follow it.** They hold the defaults and the rules of use that are not repeated here.

| Need | Package / file | Read first |
|---|---|---|
| How the kit fits together, textures, baking cut-outs, motion helpers | `motion/src/collage/` | `motion/src/collage/README.md` |
| Tape strips holding things down | `motion/src/collage/tape/` | `motion/src/collage/tape/README.md` |
| Pen underlines, rings, arbitrary pen strokes, connector ink | `motion/src/collage/pen/` | `motion/src/collage/pen/README.md` |
| Wobbling outline (squigglevision), rare accent | `motion/src/collage/squiggle/` | `motion/src/collage/squiggle/README.md` |
| Ground, paper signs, stamps, pins, cut-outs | `PaperGround`, `PaperSheet`, `Stamp`, `Pin`, `Cutout` in `motion/src/collage/` | `motion/src/collage/README.md` |
| Making cut-outs and processing textures (Python) | `motion/tools/collage/` | docstring at the top of `bake_cutout.py` and `prep_textures.py`, plus the kit README |
| A worked scene to copy | `motion/src/collage-scenes/org-chart/OrgChart.tsx` | read the whole file |
| Brand colour, type, logo | `.claude/skills/aisss-visual-identity/` | `SKILL.md` |

Import everything from `motion/src/collage/index.ts`. Do not fork a package for a one-off. Add a prop, or a new variant, to the package instead, and update its README.

---

## 2. Non-negotiable rules

1. **12 fps.** Author at 12 fps. Never render at 24/30 and drop frames.
2. **Real textures, not generated noise.** Paper, halftone, creases and flecks come from the scanned texture assets in `public/collage/textures/` (section 4). Do not invent procedural noise to fake paper.
3. **Cut-outs are torn, signs are straight.** Photos get a hand-torn white border (baked). Rectangular things (notes, tags, banners, stamps, tape) keep **straight edges** and get character from texture and shadow. Never distort a rectangle to fake a tear.
4. **Shapes are static.** Objects change position, scale, rotation, colour or drawn length. They do not change shape between frames. A hold is a hold. Squigglevision is the one exception, and it is rare (section 7).
5. **Photos are photocopies.** Greyscale, high contrast, real halftone. Colour comes only from paper, ink, one orange and one red.
6. **Connect with ink, mark with pins.** Lines are drawn on, never faded in. Every line ends in a pin or a dot.
7. **Underlines are pen.** Textured, curved, drawn left to right, retraced once (`pen` package).
8. **One new thing per beat.** A beat is 0.25 s (3 frames). Stagger 0.15–0.25 s. Never pop three objects on the same frame.
9. **Lines before objects.** A connector finishes about 0.25 s before the thing it points to lands.
10. **Text stays crisp.** Text sits above all texture layers, never inside a filter.

---

## 3. Frame rate, size, render

| Setting | Value |
|---|---|
| Composition fps | **12** (8 is choppier, 15 is the ceiling) |
| Authored size | 1280×720, rendered with `--scale=1.5` → 1920×1080 |
| Encoding | JPEG frames at quality 95, CRF 16, so halftone and grain survive |

Everything is driven by `useCurrentFrame()`. No CSS `transition`/`animation`.

```bash
cd motion && npm ci
npx remotion still src/index.ts C01-org-chart out/frame.png --frame=24     # check a frame at 100%
npx remotion render src/index.ts C01-org-chart out/video.mp4 --scale=1.5
```

Check stills at 100% before rendering the video. You should see paper fibre and halftone dots, not noise.

---

## 4. Use the provided texture assets (the realism comes from here)

The look depends on real scans, processed into **neutral detail maps**: greyscale, centred on 50% grey, colour and brightness removed. Laid over any colour with `mix-blend-mode: soft-light` they add creases, dots or flecks without a colour cast. The registry is `TEXTURES` in `textures.tsx`. Raw scans live in the shared OneDrive folder (git ignores `motion/assets/textures/`); processing is `motion/tools/collage/prep_textures.py`, and its output (`motion/public/collage/textures/`) is committed.

| Map | Source scan | Look | Use for |
|---|---|---|---|
| `ground-wrinkle` | Texturelabs Paper 345 | soft creases | ground |
| `ground-newsprint` | Texturelabs Paper 377 | ghosted newspaper columns | ground, very subtle |
| `ground-flecks` | Texturelabs Paper 347 | specks, stains | ground, notes, ink wear |
| `halftone-fine` | Texturelabs Grunge 354 | newsprint dots, ~3 px pitch | cut-out photos |
| `halftone-grunge` | Texturelabs Grunge 356 | dots + crease + cloudy density | printed ink: banners, stamps, black tags |
| `paper-crumple` | Unsplash crumpled cream paper | strong relief | notes, cut-out borders |

How to use them
- Put textures **on top of** the colour or the grid (so lines look printed on the paper), with `soft-light` for most things and `screen` at 3–6% only to lift a black card.
- Give every object its own `id`. The id picks a different crop of every scan, so no two notes share a crease.
- Keep a texture's `size` at least as wide as the thing it covers, or it tiles and shows a seam (wide banners: `size` 1300–1500).
- Real textures are subtle. If the result looks like fabric, wood or dirt, lower the opacity; don't add more layers.
- **Texture strength follows what sits on it.** The ground and photos carry the most. **Text cards (notes) and tape carry the least**, so words stay effortless to read and the tape stays see-through. Notes: `paper-crumple` ≤ 0.4, `ground-flecks` ≤ 0.25. Tape: ≤ 0.1 (`clear`), ≤ 0.2 (`masking`). If you notice the texture before you read the text, it is too strong.
- Need a new material? Add the scan to `motion/assets/textures/`, add a recipe to `prep_textures.py`, register it in `textures.tsx`. Check the source's licence before redistributing raw scans.

### Ground (`PaperGround`)
Warm Paper base, a straight graph grid in world space (follows the camera): major cell **105 px**, minor at half-step; strokes `#8F8374`, major 1.6 px at 38%, minor 1.1 px at 20%. The three ground textures go over the grid (soft-light .9 / .55 / .6). Paper texture stays fixed to the screen while the grid zooms with the camera.

### Signs (`PaperSheet`)
Straight rectangle: base + textures + faint lit top-left edge + shadow `0 3px 5px rgba(70,50,30,.24), 0 1px 1.5px rgba(70,50,30,.28)`. Presets: `note` (cream; crumple 0.35 @700 + flecks 0.18 @760, deliberately faint because text sits on it), `black` (near-black printed card, keep it dark), `colour` (flat printed ink for banners and stamps; pass `background`). Rotate every sheet a little (−1.5° to +1.5°), differently.

### Cut-outs (`Cutout`, baked by `bake_cutout.py`)
Static PNG: greyscale photo, real halftone from `halftone-fine`, torn white border, soft shadow. Same seed and settings give the same tear.

**Sensible default for paper tearing: `tear = 0.5`.** Stay between **0.3 and 0.6**.
- 0 = clean, even cut (reads as a die-cut sticker)
- **0.5 = hand-torn but tidy (default)**
- 1 = very ragged. Don't. It looks like a super messy tear and cheapens the frame.

Border width 7 world px. Border colour `#FCFAF4` with only a faint paper relief (±6%). It should read as clean white paper with an imperfect edge, not a dirty one. Change `seed` for a different tear, never a rougher one. Tilt each cut-out −1.5° to +2°, alternating along a row. A sign laid over the bottom of a photo covers 16–40 px of it.

---

## 5. Tape (`tape/`, read its README)

- Default `clear` variant: **mostly transparent**. A faint frosted tint, a catch-light on the top edge, a faint shadowed bottom edge. Whatever is underneath (a note's edge, a black tag, a photo) must read clearly through it.
- `masking` is the more tinted variant; use sparingly. `strength` fades the strip.
- 64–72 × 18–22 px, straight ends, rotated −1° to +1°, straddling the top edge of a tag or note. One strip per object, inside that object's wrapper so it moves with it.
- Its paper texture is a hair: `paper-crumple` at 0.08 (`clear`) / 0.2 (`masking`), size 600. No visible creases in the strip.
- If it ever looks like a grey bar, or the tape draws the eye, it is wrong: lower `strength` or use `clear`.

---

## 6. Pen texture (`pen/`, read its README)

Pen strokes are the hand-made accent on a printed page. Drive them with `progress` 0..1.

- **Underline** (`PenUnderline`): 58 px, 3.2 px round stroke in Strand `#C64D0A`, gentle S-curve, rotated −1.5°, drawn left to right over 0.33 s with `EASE.draw`, with a half-width **retrace** pass at 70% opacity starting 25% into the draw. Starts 0.3 s after its label lands. One per label, never a straight CSS rule.
- **Ring** (`PenCircle`): same ink; overshoots where it started. Use to point at one thing.
- **Any path** (`PenStroke`): arrows, brackets, ticks. Same ink defaults.
- **Texture:** the ink "skips" where a threshold on fine noise knocks small gaps in the stroke. `coverage` 0.84–0.88 reads as felt pen; 0.96 as printed connector. It is a texture, not a wobble: static, identical every frame (`seed` changes the pattern).
- **Connectors** (`PenLine` inside one `InkFilter`): 3 px `#4E4640`, square caps, `coverage` 0.96, **`wobble` 0** (ruler straight), dots r 4.6 at joints.
- Keep to one pen colour per frame: Strand. Don't underline everything; underline the label that matters.

---

## 7. Squigglevision: very sparingly

Default is **no** wobble. If a beat truly wants one (a stamp's aftershock, one "live" object, a single warning), use the `squiggle/` package (read its README):
- one element at a time, about 1 s, once or twice per video;
- `amount` 1–2 px, re-rolled every 2 frames;
- never on the ground, text blocks, cut-outs, or whole scenes.

If you are using it to make a hold feel less static, stop. Add a beat instead.

---

## 8. Palette (keep it this small)

| Role | Name | Hex | Use |
|---|---|---|---|
| Ground | Warm Paper | `#F4EFE6` | Background. One ground per frame |
| Note | Paper Light | `#FAF6EC` | Label notes (gradient `#FFFDF8` → `#FAF6EC` → `#F3ECDD`) |
| Edge | Paper Rim | `#FFFDF8` | Text on dark/red, keylines, cut-out border |
| Text, tag | Ink | `#111111` | Title tag, label text |
| Accent | Strand | `#C64D0A` | Pen strokes. Banner while "live". One Strand job per frame |
| Resolve | Bark | `#5C534C` | Banner after it settles |
| Line | Line | `#4E4640` | Connectors and dots |
| Grid | Grid ink | `#8F8374` at 38% / 20% | Major / minor grid |
| Alarm | Stamp red | `#C8102E` | **Only** stamps. Used last |

- About 90% of a frame is Warm Paper, Ink and greyscale photo. Colour is the short share.
- **One accent at a time.** Strand = in progress, red = final call to action. They share a frame only while one transitions into the other.
- Animate colour with `interpolateColors` over 0.4 s through a mid-tone (`#85502F`).
- No gradients (except the faint one on notes), glows or outlines. Depth is shadow only.
- Red is the one colour outside the AISSS palette. Don't add another.

---

## 9. Typography

Inter (brand text face), files in `branding/guide/fonts` and `motion/public/fonts`; `useInter()` loads them. Sentence case except stamps.

| Element | Weight | Size (1280×720) |
|---|---|---|
| Title tag | Bold 700 | 29–36 px, tracking −0.02em |
| Label note | SemiBold 600 | 26–28 px for new scenes (24 in the reference) |
| Banner title / detail | Bold 700 / Regular 400 | 30 / 21 px (go bigger if there is room) |
| Stamp title / subtitle | Bold 700 + 1.2 px stroke / SemiBold 600 | 31 / 13 px (raise subtitle to 15+) |

---

## 10. Animation curves and timing

At 12 fps these play as a handful of distinct poses. Helpers are in `motion.ts`.

| Motion | Curve | Duration | Notes |
|---|---|---|---|
| **Pop-in** (tags, notes, cut-outs, pins) | `bezier(0.34, 1.56, 0.64, 1)` | 0.33 s (4 f) | scale 0.55 → 1 with overshoot; rotation settles from −3° |
| **Line draw** (connectors, pen) | `bezier(0.33, 1, 0.68, 1)` | 0.20–0.35 s | `pathLength=1` + `strokeDashoffset` |
| **Camera move** | `bezier(0.65, 0, 0.35, 1)` | 0.5 s (6 f) | scale + translate together, 6 hand-moved poses |
| **Stamp slam** | `bezier(0.2, 0.9, 0.3, 1)` | 0.25 s (3 f) | scale 1.7 → 1, rotation +6° → resting angle |
| **Exit** | pop curve | 0.25 s | shrink to 0, then remove |
| **Banner grow** | linear keyframes every 0.25 s | 1.0 s | moves in visible steps |
| **Counter** | stepped | every 0.25 s | big jumps (19 → 54 → 89 → 124 → 140). Never smooth |
| **Colour resolve** | `interpolateColors` via mid-tone | 0.4 s | Strand → `#85502F` → Bark |

No long-tail springs: at 12 fps they smear. Overshoot lasts one or two frames.

### Choreography template

```
0.0   first frame already shows the idea (paper, grid)
0.5   anchor object pops (title tag)
0.7   trunk line draws out of it (0.25 s)
0.95  bus draws; drop lines draw
1.25  first child lands as its drop line finishes; label 0.25 s later; pen underline 0.3 s after that
1.5   second child
hold  1.5–4 s, nothing moves (voiceover room)
6.0   camera pulls back (0.5 s) to make room
6.5   new parent note; bus extends both ways (0.3 s)
every 0.25 s  one new branch: drop line → object + pin → label
hold
10.0  banner appears small, grows in steps with a stepped counter; camera nudges up
11.6  banner resolves colour; note exits
11.9+ stamps slam in 0.1–0.15 s apart, one at a time
```

---

## 11. Layout

Authoring grid 1280 × 720. World coordinates equal the final frame; the camera is a transform on top.

- Trees: title tag top-left of centre; trunk goes right then down to a horizontal **bus** at y = 218. Child columns on a 240 px pitch (x = 160, 400, 640, 880, 1120). Drop lines 3 px, dots 4.6 px.
- Label notes ~220 × 76, centred on the column at y ≈ 491; the cut-out sits above and the note covers its bottom edge. Make notes bigger when the text is bigger.
- Banner x = 36, width 1208, height 72, y = 564, rotated −0.3°.
- Margins ≥ 36 px. Maximum five columns at 1280 wide.
- Start zoomed in (1.4×) on the first two items so the first beat is legible, then pull back. Place the zoomed view so the title tag centre is at about (377, 97).

---

## 12. Do and don't

Do
- Rotate everything a little, differently.
- Let objects overlap: tape and notes sit on top of photos.
- Keep shadows short and warm (brown, never black).
- Reuse one pin, one tape and one underline recipe everywhere.
- Bake a new tear (`seed`) rather than distorting a cut-out at render time.
- Cut text until it hurts, then make what's left bigger.

Don't
- Don't wobble, boil, shake or re-seed anything, except the rare `Squiggle`.
- Don't distort rectangles to make them look torn.
- Don't use procedural noise where a scan exists.
- Don't push `tear` above 0.6.
- Don't fade things in. Things **land** (pop) or are **drawn** (line).
- Don't use blur, glow, gradient fills or rounded corners.
- Don't use more than one accent colour per frame.
- Don't tween counters.
- Don't put paragraphs, bullet lists or small print on screen.

---

## 13. Where things live

```
motion/                           the one Remotion project
  src/collage/                    the kit; README.md = API + texture/cut-out workflow
    PaperGround, PaperSheet, Cutout, Pieces (Pin, Stamp)
    pen/                          PenUnderline, PenCircle, PenStroke, PenLine, InkFilter   (README)
    tape/                         Tape, TAPE_LOOKS                                          (README)
    squiggle/                     Squiggle                                                  (README)
    textures.tsx                  TEXTURES registry, TextureLayer
    motion.ts                     EASE, popIn, ramp, lerp
    theme.ts                      COLORS, FONT_FAMILY
    canvas.ts                     W, H, FPS (1280, 720, 12)
  src/collage-scenes/org-chart/   worked scene: layout data, timeline, camera (composition C01-org-chart)
  public/collage/                 textures/, cutouts/ (+ manifest.json), pin.png
  public/fonts/                   Inter
  tools/collage/                  prep_textures.py, bake_cutout.py, cutouts.json
  assets/photos/                  source photos for cut-outs (committed, small)
  assets/textures/                raw texture scans (git-ignored; README explains where they live)
branding/                         AISSS-Visual-Identity.pdf + guide/ (its source, fonts, logos)
```

- New scene: copy `motion/src/collage-scenes/org-chart/`; change the `COLS` data, connector paths and times; register the composition in `motion/src/Root.tsx` (Collage folder).
- New cut-out: put the photo in `motion/assets/photos/`, add it to `tools/collage/cutouts.json`, run `bake_cutout.py` (keep `tear` 0.5).
- New texture: scan → `motion/assets/textures/`, recipe in `prep_textures.py`, register in `textures.tsx`.

---

## 14. Before delivering

- [ ] Would a stranger on a phone get the idea in 3 seconds? Text is light; elements are big and clear.
- [ ] One focal point per beat; something changes at least every ~4 s; first frame is not blank.
- [ ] 12 fps. Nothing changes shape between frames (barring one deliberate `Squiggle`).
- [ ] Cut-outs are baked PNGs, `tear` 0.3–0.6. Rectangles are straight.
- [ ] Paper, halftone and flecks all come from the scans, at subtle opacity.
- [ ] Tape is mostly transparent and nearly texture-free. Text cards are clean paper with only faint texture. Underlines are pen strokes, not rules.
- [ ] One accent colour per frame; red only on stamps.
- [ ] Lines draw before the objects they point to land; one new thing per beat; counters step.
- [ ] Every package you used had its README read.
- [ ] Zoom a still to 100%: you should see paper fibre and halftone dots, not noise.
