# pen

Pen/marker strokes that are "written" onto the page. Everything is driven by a `progress` number (0..1), so you animate it
with `ramp(t, from, to, EASE.draw)`. Strokes are static: the same `seed` gives the same stroke in every frame.

```tsx
import { COLORS, EASE, PenCircle, PenLine, PenStroke, PenUnderline, InkFilter, ramp } from "../collage";

// underline under a label (position inside a positioned parent)
<PenUnderline id="ul-a" progress={ramp(t, 1.8, 2.13, EASE.draw)} color={COLORS.strand}
              width={58} style={{ left: 81, top: 50 }} />

// ring around something
<PenCircle id="ring-a" progress={ramp(t, 3, 3.4, EASE.draw)} color={COLORS.strand}
           width={120} height={70} style={{ left: 200, top: 100 }} />

// any path, with an optional retrace pass
<PenStroke id="arrow" d="M5 5 C 40 10, 80 40, 95 60" width={100} height={70}
           progress={p} color={COLORS.ink} thickness={3} />

// straight connectors share one InkFilter (ruler straight: wobble 0)
<svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
  <InkFilter id="ink" wobble={0} coverage={0.96} region={{ x: -60, y: -60, width: W + 120, height: H + 120 }} />
  <g filter="url(#ink)">
    <PenLine d="M760 126 L760 218" progress={p} color={COLORS.line} />
  </g>
</svg>
```

| component | what it is | key props |
|---|---|---|
| `PenUnderline` | S-curve underline, left to right, retraced | `width` 58, `thickness` 3.2, `rotate` -1.5 |
| `PenCircle` | overshooting ring | `width`, `height` of the thing to ring |
| `PenStroke` | any path in its own svg | `d`, `retrace`, `width`, `height` (the svg box), `wobble`, `coverage` |
| `PenLine` | plain connector path (inside your svg) | `d`, `progress`, `width` 3, `cap` |
| `InkFilter` | the ink texture filter | `wobble` px, `coverage` (0.84 pen … 0.96 connector), `region` |

Look
- Pen: Strand orange `#C64D0A`, thickness 3.2, `coverage` 0.86, `wobble` 1.2, with a retrace stroke at half width and 70% opacity.
- Connector: Line `#4E4640`, thickness 3, square caps, `coverage` 0.96, `wobble` 0.
- Duration 0.2–0.35 s with `EASE.draw`. At 12 fps that is 3–4 visible frames.
- `id` must be unique on screen (it names the SVG filter). `seed` changes the ink-skip pattern.
- The ink skip is a texture, not a wobble: it is identical every frame.
