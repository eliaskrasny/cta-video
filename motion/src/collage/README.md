# Paper-collage kit

Reusable pieces for the "paper cutouts taped onto graph paper" look. Everything a scene needs is exported from `./index.ts`.
Style rules and motion guidelines are in `.claude/skills/paper-cutout-animation/SKILL.md` (at the repo root). This file is the API.

```
src/collage/
  index.ts         exports
  canvas.ts        W, H, FPS for collage scenes (1280 x 720 at 12 fps)
  theme.ts         COLORS, FONT_FAMILY
  motion.ts        EASE curves, popIn, ramp, lerp, hash helpers
  textures.tsx     TEXTURES registry + <TextureLayer>
  PaperGround.tsx  <PaperGround> graph-paper ground, camera-aware grid
  PaperSheet.tsx   <PaperSheet> straight-edged real-paper rectangle (notes, tags, banners)
  Cutout.tsx       <Cutout> baked photocopy sticker with torn white border
  pen/             own package: <PenUnderline>, <PenCircle>, <PenStroke>, <PenLine>, <InkFilter> (README inside)
  tape/            own package: <Tape> clear + masking variants (README inside)
  squiggle/        own package: <Squiggle>, wobbling outline. OFF by default, rare accent only (README inside)
  Pieces.tsx       <Pin>, <Stamp>
  fonts.ts         useInter()
public/collage/
  textures/*.jpg   neutral detail maps (from tools/collage/prep_textures.py)
  cutouts/*.png    baked cut-outs + manifest.json (from tools/collage/bake_cutout.py)
  pin.png
tools/collage/
  prep_textures.py raw scans -> detail maps
  bake_cutout.py   photo -> torn halftone sticker
  cutouts.json     which photos, how wide (world px), which seed
assets/
  photos/          source photos for the cut-outs (committed)
  textures/        raw texture scans (git-ignored; see its README)
```

Python tools need `pip install pillow numpy scipy`.

## Textures

Raw scans live in `assets/textures/` (git-ignored, shared via OneDrive; not used at render time). `prep_textures.py` removes their colour and brightness and
keeps only structure, so each result is a greyscale map centred on 50% grey. Lay a map over any base colour with
`mix-blend-mode: soft-light` (or `overlay` / `screen` / `multiply`) and you get the creases, halftone or flecks without a colour cast.

| name | from | looks like | use for |
|---|---|---|---|
| `ground-wrinkle` | Paper 345 | soft creases | ground |
| `ground-newsprint` | Paper 377 | ghosted newspaper columns | ground (very subtle) |
| `ground-flecks` | Paper 347 | specks and stains | ground, notes, ink wear |
| `halftone-fine` | Grunge 354 | newsprint dots, about 3 px pitch | cut-out photos |
| `halftone-grunge` | Grunge 356 | dots with a crease and cloudy density | printed ink (banners, stamps, black tags) |
| `paper-crumple` | Unsplash crumpled cream | strong relief | notes, cut-out borders |

Add a texture: drop the scan in `assets/textures/`, add a line to `RECIPES` in `prep_textures.py`
(output width, high-pass sigma, strength), run it, then add the name and size to `TEXTURES` in `textures.tsx`.

```bash
python tools/collage/prep_textures.py --src assets/textures --out public/collage/textures
```

`<TextureLayer name blend opacity size seed />` lays one map over its parent (parent: `position` set, `overflow: hidden`).
`size` is the map's width in CSS px: smaller = finer grain, larger = broader creases. `seed` picks which crop is shown.
Keep `size` >= the parent's width when you can, otherwise the map tiles and shows a seam.

## Components

```tsx
<PaperGround camera={{z, x, y}} />        // ground + grid + scanned texture
<PaperSheet id="note-a" width={220} height={76} preset="note" rotate={-0.8}>text</PaperSheet>
<Cutout name="microscope" left={548} top={262} rotate={-1.5} scale={popScale} />
<Pin x={640} y={314} />
<Tape id="a" left={80} top={-9} />
<Stamp id="a" cx={160} cy={490} title="Now hiring" subtitle="Events" rotate={1.5} />
<PenUnderline id="a" progress={0..1} color={COLORS.strand} />
<InkFilter id="x" seed={7} wobble={0} coverage={0.96} region={...} />  // then <g filter="url(#x)"><PenLine .../></g>
```

- `PaperSheet` presets: `note` (cream), `black` (printed black card), `colour` (flat printed colour: pass `background`), `tape`.
  Override `textures` to change the scan stack, `background` to animate colour.
  Edges are straight on purpose. Do not add edge displacement to rectangles.
- `Cutout` needs a baked PNG. Position the *subject's* top-left in world px; the component offsets for border and shadow.
- Pens: static. Same seed = same stroke. Nothing in this kit changes shape from frame to frame.
- Each `id` shows a different crop of every texture, so give every sheet its own `id`.

## Baking a new cut-out

1. Put a transparent PNG in `assets/photos/`.
2. Add it to `tools/collage/cutouts.json`: `"name": { "file": "x.png", "worldWidth": 160, "seed": 9 }`.
   `worldWidth` is the photo's width in scene px. Change `seed` to get a different tear.
3. Run:
   ```bash
   python tools/collage/bake_cutout.py --config tools/collage/cutouts.json --src assets/photos --textures public/collage/textures --out public/collage/cutouts
   ```
4. Use `<Cutout name="x" ... />`. `manifest.json` is updated automatically.

Look knobs (CLI/JSON): `tear` (0 clean cut .. 1 very ragged, default 0.5; stay at 0.3-0.6, above that it turns messy), `border` (white border width, default 7), `contrast` (1.3), `halftone` (`halftone-fine` or `halftone-grunge`), `scale` (baked px per world px, default 2.4; raise it if you zoom in a lot).
Same `seed` + same settings = the same tear, so re-baking never changes a shape you already approved.

## Motion

`EASE.pop | move | draw | slam`, `popIn(t, start)`, `ramp(t, from, to, easing)`, `lerp`. Work in seconds (`t = frame / fps`).
Author at 12 fps. There is deliberately no wobble/"boil": shapes never change between frames, only position, scale and drawn length do.

## New scene checklist

1. Copy `src/collage-scenes/org-chart/`, change `COLS`, connector paths, times.
2. Register it in `src/Root.tsx` under the `Collage` folder with the `FPS`, `W`, `H` from `collage/canvas.ts` (12 fps, 1280x720).
3. `npx remotion still src/index.ts <Id> out/f.png --frame=N` to check, then render with `--scale=1.5`.
