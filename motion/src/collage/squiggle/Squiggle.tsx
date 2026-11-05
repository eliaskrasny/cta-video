import React from "react";
import { useCurrentFrame } from "remotion";
import { hashStr } from "../motion";

/**
 * "Squigglevision": the outline of whatever is inside re-wobbles every `every` frames,
 * cycling through 3 variants. It is OFF BY DEFAULT in this style. Use it very sparingly:
 * one element, for about a second, as an accent (a stamp's aftershock, one "live" thing).
 * Never on the ground, never on text blocks, never on more than one element at once.
 *
 *   <Squiggle id="stamp-a" active={t > 12.0 && t < 12.8}> <Stamp .../> </Squiggle>
 */
type SquiggleProps = {
  id: string;
  /** displacement in px. 1–2 is a tremble, 4+ is messy */
  amount?: number;
  /** re-roll every N frames ("on twos" = 2) */
  every?: number;
  /** noise frequency; lower = slower, broader waves */
  freq?: number;
  /** turn it on for a time window only; when false children render untouched */
  active?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export const Squiggle: React.FC<SquiggleProps> = ({
  id,
  amount = 1.6,
  every = 2,
  freq = 0.03,
  active = true,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  if (!active) {
    return <>{children}</>;
  }
  const variant = Math.floor(frame / every) % 3;
  const seed = (hashStr(id) % 500) + variant * 41 + 1;
  const fid = `squiggle-${id}`;
  return (
    <div style={{ filter: `url(#${fid})`, ...style }}>
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden focusable="false">
        <defs>
          <filter id={fid} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={amount} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
};
