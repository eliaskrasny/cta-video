// Arrows and leader lines: a hand-cut curve that draws on, then its head snaps on. Boils like any shape.
import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR, DUR, STROKE, VIDEO } from "../brand/tokens";
import { useSurface } from "../brand/surface";
import { Boil } from "../paper/Boil";
import { progress } from "../motion/ease";

type Pt = { x: number; y: number };

export type ArrowProps = {
  from: Pt;
  to: Pt;
  /** Sideways bend as a share of the length; 0 = straight, 0.2 = gentle (default), keep under 0.4. */
  bend?: number;
  at?: number;
  exitAt?: number;
  /** ink by default; strand makes it the frame's one Strand item. */
  tone?: "ink" | "strand";
  head?: boolean;
  seed?: number;
};

const HEAD = 26, HEAD_ANGLE = 0.5; // px, radians [EST]

export const Arrow: React.FC<ArrowProps> = ({ from, to, bend = 0.2, at = 0, exitAt, tone = "ink", head = true, seed = 5 }) => {
  const frame = useCurrentFrame();
  const { text } = useSurface();
  const color = tone === "strand" ? COLOR.strand : text;
  const dx = to.x - from.x, dy = to.y - from.y, len = Math.hypot(dx, dy);
  const c = { x: (from.x + to.x) / 2 - (dy / len) * len * bend, y: (from.y + to.y) / 2 + (dx / len) * len * bend };
  const draw = progress(frame, at, DUR.draw, "move");
  const headIn = progress(frame, at + DUR.draw - 4, DUR.smallIn, "pop");
  const gone = exitAt === undefined ? 1 : 1 - progress(frame, exitAt, DUR.out, "exit");
  const ang = Math.atan2(to.y - c.y, to.x - c.x); // direction at the tip
  const wing = (s: number) => `M${to.x - HEAD * Math.cos(ang + s * HEAD_ANGLE)} ${to.y - HEAD * Math.sin(ang + s * HEAD_ANGLE)}L${to.x} ${to.y}`;
  return (
    <Boil strength="line" seed={seed} style={{ position: "absolute", inset: 0, opacity: gone }}>
      <svg width={VIDEO.width} height={VIDEO.height} aria-hidden>
        <path
          d={`M${from.x} ${from.y}Q${c.x} ${c.y} ${to.x} ${to.y}`}
          fill="none"
          stroke={color}
          strokeWidth={STROKE.connector}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
        />
        {head && (
          <g transform={`translate(${to.x} ${to.y}) scale(${headIn}) translate(${-to.x} ${-to.y})`}>
            <path d={wing(1) + wing(-1)} fill="none" stroke={color} strokeWidth={STROKE.connector} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>
    </Boil>
  );
};
