// The Strand loop: one open stroke with round ends that runs off the edge of the frame. One per layout. [PDF p.12]
// It draws on once and then stays still. It never boils, tiles, or becomes a bullet or border.
// The path approximates strand-drift.svg; replace LOOP_D with the official file's path when it is added to public/brand.
import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR, DUR, STROKE } from "../brand/tokens";
import { useSurface } from "../brand/surface";
import { progress } from "../motion/ease";

const LOOP_W = 900, LOOP_H = 260;
const LOOP_D = "M4 214C70 204 118 150 176 116C236 82 312 84 330 132C348 180 290 214 252 192C214 170 232 104 300 90C392 70 520 118 640 126C740 132 830 126 900 122";

export type StrandLoopProps = {
  /** Left edge of the loop in frame px. Place it so the right end runs past x = 1920. */
  x: number;
  y: number;
  /** Uniform scale. Stroke scales with it, as the brand asks. */
  scale?: number;
  /** strand: the frame's one Strand item. quiet: Ink (or Paper on Ink), so the headline may carry Strand instead. */
  tone?: "strand" | "quiet";
  at?: number;
};

export const StrandLoop: React.FC<StrandLoopProps> = ({ x, y, scale = 1, tone = "strand", at = 0 }) => {
  const frame = useCurrentFrame();
  const { text } = useSurface();
  const p = progress(frame, at, DUR.loopDraw, "move");
  const color = tone === "strand" ? COLOR.strand : text; // a quiet loop is Ink on light grounds, Paper on Ink
  return (
    <svg width={LOOP_W * scale + 10} height={LOOP_H * scale + 10} style={{ position: "absolute", left: x, top: y, overflow: "visible" }} aria-hidden>
      <path
        d={LOOP_D}
        transform={`scale(${scale})`}
        fill="none"
        stroke={color}
        strokeWidth={STROKE.loop}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};
