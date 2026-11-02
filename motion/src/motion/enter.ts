// The allowed ways in and out. Every component animates through this, so entrances look the same in every shot.
import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { DUR, MOVE } from "../brand/tokens";
import { progress } from "./ease";

/**
 * rise   text and small groups: up 24 px while fading in
 * drop   paper placed on the desk: settles from 106% and 16 px above
 * slide-left / slide-right / slide-up   paper slid in from off-frame, no fade
 * pop    pins, icons and ticks only: scales up with a small overshoot
 * fade   the logo, sources and captions
 * cut    appears on the frame, no motion
 */
export type EnterKind = "rise" | "drop" | "slide-left" | "slide-right" | "slide-up" | "pop" | "fade" | "cut";

export type Timing = { at?: number; kind?: EnterKind; duration?: number; exitAt?: number; exitDuration?: number };

const shape = (kind: EnterKind, p: number, leaving: boolean): CSSProperties => {
  const q = 1 - p; // how far from resting
  switch (kind) {
    case "rise":
      return { opacity: p, transform: `translateY(${(leaving ? -0.5 : 1) * MOVE.rise * q}px)` };
    case "drop":
      return { opacity: Math.min(1, p * 3), transform: `translateY(${-MOVE.drop * q}px) scale(${1 + (MOVE.dropScale - 1) * q})` };
    case "slide-left":
      return { transform: `translateX(${-MOVE.slideX * q}px)` };
    case "slide-right":
      return { transform: `translateX(${MOVE.slideX * q}px)` };
    case "slide-up":
      return { transform: `translateY(${MOVE.slideY * q}px)` };
    case "pop":
      return { transform: `scale(${p})` };
    case "fade":
      return { opacity: p };
    case "cut":
      return { opacity: p >= 1 ? 1 : 0 };
  }
};

/** Style for an element that enters at `at` and optionally leaves at `exitAt`. */
export const useEnter = ({ at = 0, kind = "rise", duration, exitAt, exitDuration = DUR.out }: Timing = {}): CSSProperties => {
  const frame = useCurrentFrame();
  const d = duration ?? (kind === "pop" ? DUR.smallIn : kind === "rise" || kind === "fade" ? DUR.textIn : DUR.panelIn);
  if (exitAt !== undefined && frame >= exitAt) {
    if (kind === "cut") return { opacity: 0 };
    return shape(kind, 1 - progress(frame, exitAt, exitDuration, "exit"), true);
  }
  if (kind === "cut") return { opacity: frame >= at ? 1 : 0 };
  return shape(kind, progress(frame, at, d, kind === "pop" ? "pop" : "enter"), false);
};
