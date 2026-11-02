// Every shot starts with a <Ground>. Warm Paper by default; Ink for title, section and end cards.
// The grain is a static texture printed into the paper: it never moves or boils.
// It is baked to public/textures/grain-<ground>.png by `npm run textures` from <GrainTexture> below, so frames don't recompute it.
import React, { useId } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLOR, GRAIN, GROUND, VIDEO, hexToRgb01, type GroundName } from "../brand/tokens";
import { GroundSurface } from "../brand/surface";

/** The procedural grain. Only rendered to make the texture files; shots use <Ground>. */
export const GrainTexture: React.FC<{ ground: GroundName }> = ({ ground }) => {
  const id = "grain" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const [r, g, b] = hexToRgb01(ground === "warm" ? COLOR.bark : COLOR.paper);
  const strength = ground === "warm" ? 1 : 0.5;
  // alpha = k * (noise - 0.5): flat tint, more or less of it. No blend modes.
  const layer = (name: "speckle" | "mottle") => {
    const s = GRAIN[name], k = s.opacity * 4 * strength;
    return (
      <filter id={`${id}-${name}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency={s.frequency} numOctaves={s.octaves} seed={s.seed} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  ${k} 0 0 0 ${-k * 0.5}`} />
      </filter>
    );
  };
  return (
    <svg width={VIDEO.width} height={VIDEO.height} style={{ position: "absolute", inset: 0 }} aria-hidden>
      <defs>
        {layer("mottle")}
        {layer("speckle")}
      </defs>
      <rect width="100%" height="100%" filter={`url(#${id}-mottle)`} />
      <rect width="100%" height="100%" filter={`url(#${id}-speckle)`} />
    </svg>
  );
};

export const Ground: React.FC<{ ground?: GroundName; children?: React.ReactNode }> = ({ ground = "warm", children }) => (
  <AbsoluteFill style={{ backgroundColor: GROUND[ground].bg }}>
    <Img src={staticFile(`textures/grain-${ground}.png`)} style={{ position: "absolute", inset: 0, width: VIDEO.width, height: VIDEO.height }} />
    <GroundSurface ground={ground}>
      <AbsoluteFill>{children}</AbsoluteFill>
    </GroundSurface>
  </AbsoluteFill>
);
