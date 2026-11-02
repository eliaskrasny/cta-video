// Camera moves over a whole layout: slow pushes and pans. Keys are eased with ease.move and must be at least DUR.cameraMin apart.
// Text gets bigger when the camera pushes in, so scale stays at or under CAMERA.maxScaleWithText unless the layout has no text.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CAMERA, DUR } from "../brand/tokens";
import { ease } from "./ease";

export type CameraKey = { at: number; scale?: number; x?: number; y?: number };

export const Camera: React.FC<{ keys: CameraKey[]; textless?: boolean; children: React.ReactNode }> = ({ keys, textless = false, children }) => {
  const frame = useCurrentFrame();
  const ks = [...keys].sort((a, b) => a.at - b.at).map((k) => ({ at: k.at, scale: k.scale ?? 1, x: k.x ?? 0, y: k.y ?? 0 }));
  ks.forEach((k, i) => {
    if (!textless && k.scale > CAMERA.maxScaleWithText) throw new Error(`[AISSS camera] scale ${k.scale} is over ${CAMERA.maxScaleWithText} with text on screen.`);
    if (i > 0 && k.at - ks[i - 1].at < DUR.cameraMin) throw new Error(`[AISSS camera] keys must be at least ${DUR.cameraMin} frames apart.`);
  });
  const at = ks.map((k) => k.at);
  const v = (p: "scale" | "x" | "y") => (ks.length < 2 ? ks[0][p] : interpolate(frame, at, ks.map((k) => k[p]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.move }));
  return <AbsoluteFill style={{ transform: `translate(${v("x")}px, ${v("y")}px) scale(${v("scale")})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>;
};
