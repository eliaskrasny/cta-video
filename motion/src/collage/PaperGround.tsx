import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS } from "./theme";
import { TextureLayer, type TextureSpec } from "./textures";

export type Camera = { z: number; x: number; y: number };

/**
 * The ground: warm paper, a ruled graph grid, and real scanned texture laid over both
 * (so the grid reads as printed on the paper, not floating above it).
 *
 * The grid lives in world space and follows `camera`; the paper texture stays on screen.
 */
export const GROUND_TEXTURES: TextureSpec[] = [
  { name: "ground-wrinkle", blend: "soft-light", opacity: 0.9, size: 1280 },
  { name: "ground-newsprint", blend: "soft-light", opacity: 0.55, size: 1280 },
  { name: "ground-flecks", blend: "soft-light", opacity: 0.6, size: 1280 },
];

type PaperGroundProps = {
  camera?: Camera;
  /** major grid cell, world px. Minor lines are half of it */
  cell?: number;
  grid?: boolean;
  base?: string;
  lineColor?: string;
  textures?: TextureSpec[];
};

export const PaperGround: React.FC<PaperGroundProps> = ({
  camera = { z: 1, x: 0, y: 0 },
  cell = 105,
  grid = true,
  base = COLORS.paper,
  lineColor = COLORS.gridLine,
  textures = GROUND_TEXTURES,
}) => {
  const { width, height } = useVideoConfig();
  const minor = cell / 2;
  // world region to rule: generous so zooming out never runs out of lines
  const x0 = -Math.ceil(width * 0.6 / cell) * cell;
  const x1 = Math.ceil(width * 1.6 / cell) * cell;
  const y0 = -Math.ceil(height * 0.6 / cell) * cell;
  const y1 = Math.ceil(height * 1.6 / cell) * cell;
  const majorPath: string[] = [];
  const minorPath: string[] = [];
  for (let x = x0; x <= x1; x += minor) {
    (Math.round(x / minor) % 2 === 0 ? majorPath : minorPath).push(`M${x} ${y0}V${y1}`);
  }
  for (let y = y0; y <= y1; y += minor) {
    (Math.round(y / minor) % 2 === 0 ? majorPath : minorPath).push(`M${x0} ${y}H${x1}`);
  }
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden", isolation: "isolate" }}>
      {grid ? (
        <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }} aria-hidden>
          <g transform={`translate(${camera.x} ${camera.y}) scale(${camera.z})`}>
            <path d={minorPath.join("")} stroke={lineColor} strokeOpacity={0.2} strokeWidth={1.1} fill="none" />
            <path d={majorPath.join("")} stroke={lineColor} strokeOpacity={0.38} strokeWidth={1.6} fill="none" />
          </g>
        </svg>
      ) : null}
      {textures.map((t, i) => (
        <TextureLayer key={`${t.name}-${i}`} {...t} seed={`ground-${i}`} />
      ))}
    </AbsoluteFill>
  );
};
