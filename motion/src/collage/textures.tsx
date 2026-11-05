import React from "react";
import { staticFile } from "remotion";
import { hash, hashStr } from "./motion";

/**
 * Registry of the processed scan textures in public/collage/textures/ (made by
 * tools/collage/prep_textures.py). Every file is a neutral detail map: greyscale, centred on 50% grey.
 * Lay them over a base colour with mix-blend-mode soft-light / overlay / multiply.
 */
export type TextureName =
  | "ground-wrinkle"
  | "ground-newsprint"
  | "ground-flecks"
  | "halftone-fine"
  | "halftone-grunge"
  | "paper-crumple";

export const TEXTURES: Record<TextureName, { file: string; width: number; height: number }> = {
  "ground-wrinkle": { file: "collage/textures/ground-wrinkle.jpg", width: 2560, height: 1708 },
  "ground-newsprint": { file: "collage/textures/ground-newsprint.jpg", width: 2560, height: 1832 },
  "ground-flecks": { file: "collage/textures/ground-flecks.jpg", width: 2560, height: 1799 },
  "halftone-fine": { file: "collage/textures/halftone-fine.jpg", width: 1020, height: 704 },
  "halftone-grunge": { file: "collage/textures/halftone-grunge.jpg", width: 1100, height: 760 },
  "paper-crumple": { file: "collage/textures/paper-crumple.jpg", width: 1600, height: 2400 },
};

export type TextureSpec = {
  name: TextureName;
  blend?: React.CSSProperties["mixBlendMode"];
  opacity?: number;
  /** width of the texture in CSS px (height follows). Smaller = finer grain, larger = broader creases */
  size?: number;
  /** invert (for "lighten" effects with multiply-type blends) */
  invert?: boolean;
};

/**
 * One texture laid over its parent. Parent should be `position: relative/absolute; overflow: hidden`.
 * `seed` picks which part of the scan is shown, so two notes never show the same crop.
 */
export const TextureLayer: React.FC<TextureSpec & { seed?: string | number }> = ({
  name,
  blend = "soft-light",
  opacity = 1,
  size = 900,
  invert = false,
  seed = 0,
}) => {
  const tex = TEXTURES[name];
  const k = typeof seed === "string" ? hashStr(seed) : seed;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${staticFile(tex.file)})`,
        backgroundSize: `${size}px ${(size * tex.height) / tex.width}px`,
        backgroundPosition: `${hash(k + 1) * 100}% ${hash(k + 9) * 100}%`,
        backgroundRepeat: "repeat",
        mixBlendMode: blend,
        opacity,
        filter: invert ? "invert(1)" : undefined,
        pointerEvents: "none",
      }}
    />
  );
};
