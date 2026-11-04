import React from "react";

/**
 * Pen/marker ink texture as an SVG filter. Static: same `seed` = same stroke, every frame.
 *  - optional hand tremble (`wobble` px). 0 = ruler straight
 *  - ink skipping: a soft threshold on paper-tooth noise knocks small gaps in the stroke
 *
 * Apply with `<g filter="url(#id)">` around the strokes. The filter region is in the svg's user space.
 */
export type InkFilterProps = {
  id: string;
  seed?: number;
  wobble?: number;
  wobbleFreq?: number;
  /** fraction of the stroke that keeps ink: 0.84 felt pen, 0.95 connector, 1 = solid */
  coverage?: number;
  grainFreq?: number;
  region?: { x: number; y: number; width: number; height: number };
};

export const InkFilter: React.FC<InkFilterProps> = ({
  id,
  seed = 3,
  wobble = 1.2,
  wobbleFreq = 0.07,
  coverage = 0.86,
  grainFreq = 0.9,
  region = { x: -20, y: -20, width: 400, height: 80 },
}) => {
  // alpha = k*R + b: a soft threshold on noise (R ~ N(0.5, 0.1)); ~`coverage` of pixels keep ink
  const z = 1.9 - 6.2 * (0.97 - coverage);
  const r0 = 0.5 + 0.1 * z;
  const k = -8;
  const b = 1 + 8 * r0;
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <filter
          id={id}
          filterUnits="userSpaceOnUse"
          x={region.x}
          y={region.y}
          width={region.width}
          height={region.height}
          colorInterpolationFilters="sRGB"
        >
          {wobble > 0 ? (
            <>
              <feTurbulence type="fractalNoise" baseFrequency={wobbleFreq} numOctaves={2} seed={seed} result="w" />
              <feDisplacementMap in="SourceGraphic" in2="w" scale={wobble} xChannelSelector="R" yChannelSelector="G" result="wob" />
            </>
          ) : (
            <feOffset in="SourceGraphic" dx={0} dy={0} result="wob" />
          )}
          <feTurbulence type="fractalNoise" baseFrequency={grainFreq} numOctaves={2} seed={seed + 5} result="grain" />
          <feColorMatrix
            in="grain"
            type="matrix"
            values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${k} 0 0 0 ${b}`}
            result="mask"
          />
          <feComposite in="wob" in2="mask" operator="in" />
        </filter>
      </defs>
    </svg>
  );
};
