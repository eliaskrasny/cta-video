// A paper panel: scissors-cut edge, flat fill, a flat offset shadow, and the boil.
// Its children (text) sit on top, outside the boil, so type stays sharp and still.
import React from "react";
import { ELEVATION, SHADOW_FILL, SURFACE, type Elevation, type SurfaceName } from "../brand/tokens";
import { CutoutSurface, useSurface } from "../brand/surface";
import { Boil } from "./Boil";
import { cutRectPath } from "./cut";

const PAD = 24; // room for the shadow and the wobble outside the panel

export type CutoutProps = {
  width: number;
  height: number;
  fill?: SurfaceName;
  elevation?: Elevation;
  seed?: number;
  boil?: boolean;
  padding?: number | string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const Cutout: React.FC<CutoutProps> = ({ width, height, fill = "wool", elevation = 1, seed = 1, boil = true, padding = 0, style, children }) => {
  const { ground } = useSurface();
  const off = ground === "ink" ? 0 : ELEVATION[elevation]; // no shadows on an Ink ground
  const shadow = fill === "wheat" ? SHADOW_FILL.onWheat : SHADOW_FILL.default;
  const d = cutRectPath(width, height, seed);
  const box = { position: "absolute" as const, left: -PAD, top: -PAD, width: width + off + PAD * 2, height: height + off + PAD * 2 };
  const shape = (
    <svg width={box.width} height={box.height} aria-hidden style={{ display: "block" }}>
      <g transform={`translate(${PAD},${PAD})`}>
        {off > 0 && <path d={d} fill={shadow} transform={`translate(${off} ${off})`} />}
        <path d={d} fill={SURFACE[fill].fill} />
      </g>
    </svg>
  );
  return (
    <div style={{ position: "relative", width, height, ...style }}>
      {boil ? (
        <Boil strength="panel" seed={seed} style={box}>
          {shape}
        </Boil>
      ) : (
        <div style={box}>{shape}</div>
      )}
      <div style={{ position: "relative", width, height, padding, boxSizing: "border-box" }}>
        <CutoutSurface fill={fill}>{children}</CutoutSurface>
      </div>
    </div>
  );
};
