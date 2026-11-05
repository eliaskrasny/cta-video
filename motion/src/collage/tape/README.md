# tape

Translucent tape strips that hold notes, tags and photos down.

```tsx
import { Tape } from "../collage";

<Tape id="title" left={150} top={-13} width={72} height={22} rotate={0.8} />          // clear (default)
<Tape id="note-a" left={76} top={-9} variant="masking" />                               // paper masking tape
<Tape id="x" left={0} top={0} strength={0.6} />                                         // fainter
```

| prop | default | notes |
|---|---|---|
| `id` | required | picks a unique crop of the paper texture. Unique per strip |
| `left`, `top` | required | px inside the parent. Straddle the parent's edge (`top: -9..-13` for a top strip) |
| `width`, `height` | 64 × 20 | 64–72 × 18–22 reads right at 1280×720 |
| `rotate` | 0 | degrees. Use −1…+1, different on each strip |
| `variant` | `clear` | `clear` = mostly see-through (default). `masking` = more tint and body |
| `strength` | 1 | 0..1 multiplier on visibility |

Rules
- One strip per object. Put it inside the object's wrapper so it moves, scales and rotates with it.
- Its paper texture is deliberately a hair (`textureOpacity` 0.08 clear, 0.2 masking). Don't raise it: visible creases in the strip make it read as a grey bar.
- It has to stay mostly transparent: whatever is under it (the note's edge, the photo) should read clearly through it.
- Straight ends. It is a rectangle.
- Add a look: add an entry to `TAPE_LOOKS` in `Tape.tsx` (fill gradient, edge colours, texture opacity, shadow).
