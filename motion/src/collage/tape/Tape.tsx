import React from "react";
import { TextureLayer } from "../textures";

/**
 * Tape package: a strip of tape holding something down. Self-contained (only needs the texture registry).
 *
 *   <Tape id="title" left={150} top={-13} width={72} height={22} rotate={0.8} />
 *
 * `left/top` are in the parent's px, so put it inside the object it holds down and let it straddle an edge.
 * Straight ends on purpose. Give every strip its own `id`.
 */
export type TapeVariant = "clear" | "masking";

type Look = {
  fill: string;
  /** lit top edge */
  edgeLight: string;
  /** shadowed bottom edge */
  edgeDark: string;
  textureOpacity: number;
  shadow: string;
};

export const TAPE_LOOKS: Record<TapeVariant, Look> = {
  // Scotch-style: mostly see-through, a faint frosted milk tint, bright catch-light on one edge.
  clear: {
    fill: "linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(244,240,228,0.16) 50%, rgba(226,220,204,0.20) 100%)",
    edgeLight: "rgba(255,255,255,0.55)",
    edgeDark: "rgba(120,108,88,0.16)",
    textureOpacity: 0.08,
    shadow: "0px 1px 1.5px rgba(70,50,30,0.10)",
  },
  // Paper masking tape: still translucent, more tint and more body.
  masking: {
    fill: "linear-gradient(180deg, rgba(238,232,214,0.62) 0%, rgba(226,219,198,0.52) 55%, rgba(206,198,174,0.58) 100%)",
    edgeLight: "rgba(255,255,255,0.4)",
    edgeDark: "rgba(110,98,76,0.22)",
    textureOpacity: 0.2,
    shadow: "0px 1px 2px rgba(70,50,30,0.16)",
  },
};

type TapeProps = {
  id: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  rotate?: number;
  variant?: TapeVariant;
  /** 0..1 multiplies the whole strip's visibility */
  strength?: number;
  style?: React.CSSProperties;
};

export const Tape: React.FC<TapeProps> = ({
  id,
  left,
  top,
  width = 64,
  height = 20,
  rotate = 0,
  variant = "clear",
  strength = 1,
  style,
}) => {
  const look = TAPE_LOOKS[variant];
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        rotate: `${rotate}deg`,
        opacity: strength,
        boxShadow: look.shadow,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: look.fill,
          borderTop: `1px solid ${look.edgeLight}`,
          borderBottom: `1px solid ${look.edgeDark}`,
          isolation: "isolate",
        }}
      >
        <TextureLayer name="paper-crumple" blend="soft-light" opacity={look.textureOpacity} size={600} seed={`tape-${id}`} />
      </div>
    </div>
  );
};
