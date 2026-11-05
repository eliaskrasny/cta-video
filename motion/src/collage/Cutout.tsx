import React from "react";
import { Img, staticFile } from "remotion";
import manifest from "../../public/collage/cutouts/manifest.json";

/**
 * A baked paper cut-out sticker (halftone photo + hand-torn white border + shadow).
 * The PNGs come from tools/collage/bake_cutout.py and are static: the tear never changes.
 *
 * Position the *subject's* top-left in world px. The component offsets for the border and shadow padding.
 *
 *   <Cutout name="microscope" left={548} top={262} rotate={-1.5} />
 */
type CutoutInfo = {
  width: number;
  height: number;
  pad: number;
  scale: number;
  subjectWidth: number;
  subjectHeight: number;
};

export const cutoutInfo = (name: string): CutoutInfo => {
  const info = (manifest as Record<string, CutoutInfo>)[name];
  if (!info) {
    throw new Error(`No baked cut-out "${name}". Run tools/collage/bake_cutout.py first.`);
  }
  return info;
};

/** world-px size of the photo itself (without border) */
export const cutoutSubjectSize = (name: string): { w: number; h: number } => {
  const i = cutoutInfo(name);
  return { w: i.subjectWidth / i.scale, h: i.subjectHeight / i.scale };
};

type CutoutProps = {
  name: string;
  /** subject top-left, world px */
  left: number;
  top: number;
  rotate?: number;
  scale?: number;
  style?: React.CSSProperties;
};

export const Cutout: React.FC<CutoutProps> = ({ name, left, top, rotate = 0, scale = 1, style }) => {
  const i = cutoutInfo(name);
  const pad = i.pad / i.scale;
  return (
    <Img
      src={staticFile(`collage/cutouts/${name}.png`)}
      style={{
        position: "absolute",
        left: left - pad,
        top: top - pad,
        width: i.width / i.scale,
        height: i.height / i.scale,
        rotate: `${rotate}deg`,
        scale,
        ...style,
      }}
    />
  );
};
