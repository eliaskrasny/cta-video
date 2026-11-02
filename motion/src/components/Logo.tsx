// The AISSS lockup and the yarn mark. Ink or Paper only, never Strand, never boiled, rotated, flipped or cropped. [PDF p.4-5]
// Clear space (the mark's height on every side) is built in as padding, so nothing can be placed inside it.
import React from "react";
import { Img, staticFile } from "remotion";
import { LOGO } from "../brand/tokens";
import { useSurface } from "../brand/surface";
import { useEnter } from "../motion/enter";

type LogoProps = {
  /** Lockup width in px (min 128). The mark alone uses `size` instead. */
  width?: number;
  at?: number;
  exitAt?: number;
  /** Logos only fade or cut in. */
  enter?: "fade" | "cut";
  style?: React.CSSProperties;
};

const tone = (ground: "warm" | "ink") => (ground === "ink" ? "white" : "black");

export const LogoLockup: React.FC<LogoProps> = ({ width = 360, at = 0, exitAt, enter = "fade", style }) => {
  if (width < LOGO.minLockupWidth) throw new Error(`[AISSS logo] lockup must be at least ${LOGO.minLockupWidth}px wide; use <YarnMark> below that.`);
  const { ground } = useSurface();
  const motion = useEnter({ at, kind: enter, exitAt, duration: 8 });
  const clear = width / LOGO.aspect; // mark height
  return (
    <div style={{ padding: clear, ...style, ...motion }}>
      <Img src={staticFile(`brand/AISSS-logo-${tone(ground)}.svg`)} style={{ width, height: clear, display: "block" }} />
    </div>
  );
};

export const YarnMark: React.FC<{ size?: number; at?: number; exitAt?: number; clearSpace?: boolean; style?: React.CSSProperties }> = ({
  size = 56,
  at = 0,
  exitAt,
  clearSpace = false,
  style,
}) => {
  if (size < LOGO.minMarkSize) throw new Error(`[AISSS logo] the mark must be at least ${LOGO.minMarkSize}px.`);
  const { ground } = useSurface();
  const motion = useEnter({ at, kind: "fade", exitAt, duration: 8 });
  return (
    <div style={{ padding: clearSpace ? size : 0, ...style, ...motion }}>
      <Img src={staticFile(`brand/yarn-mark-${tone(ground)}.svg`)} style={{ width: size, height: size, display: "block" }} />
    </div>
  );
};
