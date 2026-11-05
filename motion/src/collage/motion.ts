import { Easing, interpolate } from "remotion";

/** Deterministic 0..1 hash of a number. */
export const hash = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Stable integer from a string id. */
export const hashStr = (s: string): number => {
  let h = 7;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

/** Clamped 0..1 ramp between two times (seconds). */
export const ramp = (
  t: number,
  from: number,
  to: number,
  easing: (n: number) => number = Easing.linear,
): number =>
  interpolate(t, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;

/** The animation curves of the paper-collage style. At 12 fps these play as 3-6 distinct poses. */
export const EASE = {
  /** things landing on the page: overshoot, then rest */
  pop: Easing.bezier(0.34, 1.56, 0.64, 1),
  /** camera moves and banner growth: smooth in and out */
  move: Easing.bezier(0.65, 0, 0.35, 1),
  /** pen strokes and line draws: quick start, long settle */
  draw: Easing.bezier(0.33, 1, 0.68, 1),
  /** stamps: hit hard, then rest */
  slam: Easing.bezier(0.2, 0.9, 0.3, 1),
};

/**
 * Pop-in entrance. `visible` is false before `start`, so the object doesn't exist yet.
 * `rot` is a settling rotation in degrees to add to the object's resting rotation.
 */
export const popIn = (
  t: number,
  start: number,
  dur = 0.33,
  from = 0.55,
): { visible: boolean; scale: number; rot: number } => {
  if (t < start) {
    return { visible: false, scale: 0, rot: 0 };
  }
  const k = ramp(t, start, start + dur, EASE.pop);
  return { visible: true, scale: lerp(from, 1, k), rot: (1 - Math.min(1, k)) * -3 };
};
