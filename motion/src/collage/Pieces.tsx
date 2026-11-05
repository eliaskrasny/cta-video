import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS, FONT_FAMILY } from "./theme";
import { PaperSheet } from "./PaperSheet";

/** Clay pin that marks where a connector ends. Centre it on the line's end. */
export const Pin: React.FC<{ x: number; y: number; size?: number; scale?: number }> = ({
  x,
  y,
  size = 25,
  scale = 1,
}) => (
  <Img
    src={staticFile("collage/pin.png")}
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size * (367 / 359),
      scale,
      filter: "drop-shadow(1px 3px 2px rgba(40,20,10,0.4))",
    }}
  />
);

/**
 * Printed stamp block: flat colour on paper, inset keyline, bold uppercase title, small subtitle.
 * Straight edges. `cx, cy` is the centre in the parent's px.
 */
export const Stamp: React.FC<{
  id: string;
  cx: number;
  cy: number;
  width?: number;
  height?: number;
  title: string;
  subtitle?: string;
  color?: string;
  rotate?: number;
  scale?: number;
}> = ({ id, cx, cy, width = 222, height = 78, title, subtitle, color = COLORS.stamp, rotate = 0, scale = 1 }) => (
  <PaperSheet
    id={`stamp-${id}`}
    width={width}
    height={height}
    preset="colour"
    background={color}
    rotate={rotate}
    style={{ left: cx - width / 2, top: cy - height / 2, scale }}
  >
    <div
      style={{
        position: "absolute",
        inset: 5,
        border: `2px solid ${COLORS.paperRim}`,
        opacity: 0.92,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: COLORS.paperRim,
        fontFamily: FONT_FAMILY,
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      <div style={{ fontSize: 31, letterSpacing: "0.01em", lineHeight: 1, WebkitTextStroke: "1.2px currentColor" }}>
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: 13,
            lineHeight: 1,
            marginTop: 5,
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.01em",
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  </PaperSheet>
);
