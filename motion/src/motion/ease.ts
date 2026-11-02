// Easing curves from the tokens. The only file allowed to touch Remotion's Easing.
import { Easing, interpolate } from "remotion";
import { EASE, POP_OVERSHOOT } from "../brand/tokens";

const bez = (k: keyof typeof EASE) => Easing.bezier(...(EASE[k] as unknown as [number, number, number, number]));
export const ease = {
  enter: bez("enter"),
  exit: bez("exit"),
  move: bez("move"),
  linear: bez("linear"),
  pop: Easing.out(Easing.back(POP_OVERSHOOT)),
} as const;
export type EaseName = keyof typeof ease;

/** 0 to 1 between `start` and `start + duration`, clamped, with a named curve. */
export const progress = (frame: number, start: number, duration: number, curve: EaseName) =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease[curve] });
