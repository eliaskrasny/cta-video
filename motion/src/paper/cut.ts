// Scissors-cut outlines. Corners stay square; the edges between them sit slightly off-true.
// Deterministic: the same seed always gives the same cut, so a panel doesn't change shape between renders.
import { random } from "remotion";
import { CUT } from "../brand/tokens";

const nudge = (seed: string) => (random(seed) * 2 - 1) * CUT.jitter;

export const cutRectPath = (w: number, h: number, seed: number | string = 1) => {
  const pts: [number, number][] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number, side: string) => {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.max(1, Math.round(len / CUT.step));
    const nx = -(y1 - y0) / len, ny = (x1 - x0) / len; // normal to the edge
    for (let i = 0; i < n; i++) {
      const t = i / n, k = i === 0 ? 0.5 : 1; // corners move less, so they stay square
      const d = nudge(`${seed}-${side}-${i}`) * k;
      pts.push([x0 + (x1 - x0) * t + nx * d, y0 + (y1 - y0) * t + ny * d]);
    }
  };
  edge(0, 0, w, 0, "t");
  edge(w, 0, w, h, "r");
  edge(w, h, 0, h, "b");
  edge(0, h, 0, 0, "l");
  return "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
};
