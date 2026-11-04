# squiggle

"Squigglevision": an object's outline wobbles, re-rolling every 2 frames through 3 variants. **Off by default in this style.**
It is here so the effect exists when a beat truly needs it, and so nobody hand-rolls a worse one.

```tsx
import { Squiggle } from "../collage";

<Squiggle id="stamp-pm" active={t >= 12.0 && t < 12.8} amount={1.6}>
  <Stamp id="pm" cx={761} cy={127} title="Now hiring" />
</Squiggle>
```

| prop | default | notes |
|---|---|---|
| `id` | required | unique on screen. Also picks the seed |
| `active` | true | pass a time window. When false the children render untouched |
| `amount` | 1.6 px | 1–2 = tremble. 4+ looks messy. Don't |
| `every` | 2 frames | "on twos". Never every frame |
| `freq` | 0.03 | lower = broader, slower waves |

Rules of use
- At most **one** element at a time, for about **1 s**, once or twice per video.
- Good uses: the aftershock of a stamp slam, one "live"/"on air" object, a single warning.
- Never on the ground, grid, text blocks, cut-outs (their torn border is baked and must stay put), or whole scenes.
- If you are reaching for it to make a hold feel less static, don't. Holds are still. Add a beat instead.
