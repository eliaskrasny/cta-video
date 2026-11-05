import React from "react";
import { InkFilter } from "./InkFilter";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* -------------------------------------------------------------------------- */
/* PenLine: a plain stroke for use inside your own <svg>                      */
/* -------------------------------------------------------------------------- */

type PenLineProps = {
  d: string;
  /** 0..1 how much has been drawn */
  progress: number;
  color: string;
  width?: number;
  cap?: "butt" | "round" | "square";
};

/** Straight connector stroke, drawn on by `progress`. Put several inside `<g filter="url(#ink)">` for ink texture. */
export const PenLine: React.FC<PenLineProps> = ({ d, progress, color, width = 3, cap = "square" }) => {
  const p = clamp01(progress);
  if (p <= 0) {
    return null;
  }
  return (
    <path
      d={d}
      pathLength={1}
      strokeDasharray="1 1.2"
      strokeDashoffset={1 - p}
      stroke={color}
      strokeWidth={width}
      strokeLinecap={cap}
      strokeLinejoin="miter"
      fill="none"
    />
  );
};

/* -------------------------------------------------------------------------- */
/* PenStroke: any path, drawn with pen texture, in its own <svg>              */
/* -------------------------------------------------------------------------- */

type PenStrokeProps = {
  /** unique id (names the filter) */
  id: string;
  /** SVG path in a `width` x `height` box */
  d: string;
  /** optional second, thinner pass that follows the first (like going over it again) */
  retrace?: string;
  width: number;
  height: number;
  progress: number;
  color: string;
  thickness?: number;
  seed?: number;
  wobble?: number;
  coverage?: number;
  rotate?: number;
  style?: React.CSSProperties;
};

export const PenStroke: React.FC<PenStrokeProps> = ({
  id,
  d,
  retrace,
  width,
  height,
  progress,
  color,
  thickness = 3.2,
  seed = 3,
  wobble = 1.2,
  coverage = 0.86,
  rotate = 0,
  style,
}) => {
  const p1 = clamp01(progress);
  const p2 = clamp01((progress - 0.25) / 0.75);
  if (p1 <= 0) {
    return null;
  }
  const fid = `pen-${id}`;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", overflow: "visible", rotate: `${rotate}deg`, ...style }}
    >
      <InkFilter
        id={fid}
        seed={seed}
        wobble={wobble}
        coverage={coverage}
        region={{ x: -10, y: -10, width: width + 20, height: height + 20 }}
      />
      <g filter={`url(#${fid})`}>
        <path
          d={d}
          pathLength={1}
          strokeDasharray="1 1.2"
          strokeDashoffset={1 - p1}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {retrace && p2 > 0 ? (
          <path
            d={retrace}
            pathLength={1}
            strokeDasharray="1 1.2"
            strokeDashoffset={1 - p2}
            stroke={color}
            strokeWidth={thickness * 0.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.7}
          />
        ) : null}
      </g>
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/* PenUnderline: written left to right, retraced once                         */
/* -------------------------------------------------------------------------- */

type PenUnderlineProps = {
  id: string;
  progress: number;
  color: string;
  width?: number;
  thickness?: number;
  rotate?: number;
  seed?: number;
  style?: React.CSSProperties;
};

/**
 * Hand-drawn underline. Position it with `style={{ left, top }}` inside a positioned parent.
 * Typical: width 58, thickness 3.2, rotate -1.5, in Strand orange, drawn over ~0.33 s with EASE.draw.
 */
export const PenUnderline: React.FC<PenUnderlineProps> = ({
  id,
  progress,
  color,
  width = 58,
  thickness = 3.2,
  rotate = -1.5,
  seed = 3,
  style,
}) => {
  const h = 12;
  const main = `M3 ${h * 0.55} C ${width * 0.28} ${h * 0.3}, ${width * 0.62} ${h * 0.78}, ${width - 3} ${h * 0.42}`;
  const retrace = `M${width * 0.12} ${h * 0.7} C ${width * 0.4} ${h * 0.42}, ${width * 0.7} ${h * 0.86}, ${width - 1} ${h * 0.5}`;
  return (
    <PenStroke
      id={id}
      d={main}
      retrace={retrace}
      width={width}
      height={h}
      progress={progress}
      color={color}
      thickness={thickness}
      seed={seed}
      rotate={rotate}
      style={style}
    />
  );
};

/* -------------------------------------------------------------------------- */
/* PenCircle: a hand-drawn ring that overshoots where it started              */
/* -------------------------------------------------------------------------- */

type PenCircleProps = {
  id: string;
  progress: number;
  color: string;
  width: number;
  height: number;
  thickness?: number;
  rotate?: number;
  seed?: number;
  style?: React.CSSProperties;
};

/** Circle/ellipse an item. `width`/`height` are the box to enclose; the ring draws slightly outside it. */
export const PenCircle: React.FC<PenCircleProps> = ({
  id,
  progress,
  color,
  width,
  height,
  thickness = 3.2,
  rotate = -3,
  seed = 5,
  style,
}) => {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2 - 2;
  const ry = height / 2 - 2;
  const d = [
    `M ${cx - rx * 0.25} ${cy - ry * 0.98}`,
    `C ${cx + rx * 0.7} ${cy - ry * 1.1}, ${cx + rx * 1.08} ${cy - ry * 0.3}, ${cx + rx * 0.98} ${cy + ry * 0.35}`,
    `C ${cx + rx * 0.85} ${cy + ry * 1.0}, ${cx + rx * 0.1} ${cy + ry * 1.08}, ${cx - rx * 0.5} ${cy + ry * 0.95}`,
    `C ${cx - rx * 1.1} ${cy + ry * 0.8}, ${cx - rx * 1.12} ${cy - ry * 0.6}, ${cx - rx * 0.4} ${cy - ry * 0.95}`,
    `C ${cx + rx * 0.1} ${cy - ry * 1.12}, ${cx + rx * 0.55} ${cy - ry * 0.95}, ${cx + rx * 0.75} ${cy - ry * 0.7}`,
  ].join(" ");
  return (
    <PenStroke
      id={id}
      d={d}
      width={width}
      height={height}
      progress={progress}
      color={color}
      thickness={thickness}
      seed={seed}
      rotate={rotate}
      coverage={0.88}
      style={style}
    />
  );
};
