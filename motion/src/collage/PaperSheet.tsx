import React from "react";
import { COLORS } from "./theme";
import { TextureLayer, type TextureSpec } from "./textures";

/**
 * A straight-edged sheet of real paper: flat colour + scanned texture + a soft shadow.
 * Use it for label notes, title tags, banners, stamps, tape: anything rectangular.
 *
 *   <PaperSheet id="note-a" width={220} height={76} preset="note" rotate={-0.8}>text</PaperSheet>
 *
 * `preset` chooses the base colour + which scans sit on it. Override `background` to animate colour.
 */
export type SheetPreset = "note" | "black" | "colour";

export const SHEET_PRESETS: Record<SheetPreset, { background: string; textures: TextureSpec[] }> = {
  // cream notepaper: text lives here, so the texture is kept faint (crumple <= .4, flecks <= .25)
  note: {
    background: `linear-gradient(172deg, ${COLORS.paperRim} 0%, ${COLORS.paperLight} 55%, #F3ECDD 100%)`,
    textures: [
      { name: "paper-crumple", blend: "soft-light", opacity: 0.35, size: 700 },
      { name: "ground-flecks", blend: "soft-light", opacity: 0.18, size: 760 },
    ],
  },
  // printed black card: ink density varies, a touch of lift where the ink is thin
  black: {
    background: COLORS.ink,
    textures: [
      { name: "halftone-grunge", blend: "screen", opacity: 0.06, size: 420 },
      { name: "paper-crumple", blend: "screen", opacity: 0.035, size: 620 },
    ],
  },
  // flat printed colour (red, orange, bark): ink density + paper relief show through
  colour: {
    background: COLORS.stamp,
    textures: [
      { name: "halftone-grunge", blend: "soft-light", opacity: 0.55, size: 420 },
      { name: "paper-crumple", blend: "soft-light", opacity: 0.32, size: 1000 },
      { name: "ground-flecks", blend: "soft-light", opacity: 0.4, size: 1300 },
    ],
  },
};

type PaperSheetProps = {
  /** unique id: picks which crop of each scan this sheet shows */
  id: string;
  width: number;
  height: number;
  preset?: SheetPreset;
  /** CSS background, replaces the preset's base colour */
  background?: string;
  /** replaces the preset's texture stack */
  textures?: TextureSpec[];
  rotate?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const PaperSheet: React.FC<PaperSheetProps> = ({
  id,
  width,
  height,
  preset = "note",
  background,
  textures,
  rotate = 0,
  shadow = true,
  style,
  children,
}) => {
  const p = SHEET_PRESETS[preset];
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        rotate: `${rotate}deg`,
        boxShadow: shadow
          ? "0px 3px 5px rgba(70,50,30,0.24), 0px 1px 1.5px rgba(70,50,30,0.28)"
          : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: background ?? p.background,
          isolation: "isolate",
        }}
      >
        {(textures ?? p.textures).map((t, i) => (
          <TextureLayer key={`${t.name}-${i}`} {...t} seed={`${id}-${i}`} />
        ))}
        {/* thin lit edge on the top-left, like paper catching light */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 0.8px 0.8px 0 rgba(255,255,255,0.35), inset -0.6px -0.6px 0 rgba(60,40,20,0.12)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
};
