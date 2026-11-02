// The icon set. Line icons on a 24-unit grid, round caps, one stroke weight at every size. They draw on and boil.
// Add new icons here (same grid, same style) instead of importing icon packs.
import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR, DUR, STROKE } from "../brand/tokens";
import { useSurface } from "../brand/surface";
import { Boil } from "../paper/Boil";
import { progress } from "../motion/ease";

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

export const ICONS = {
  person: [circle(12, 7.5, 3.5), "M5 21c0-4 3-7 7-7s7 3 7 7"],
  people: [circle(9, 8, 3), "M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6", "M16 5.3a3 3 0 0 1 0 5.4", "M17 14.2c2.3.8 4 3 4 5.8"],
  government: ["M2 9.5L12 3l10 6.5Z", "M4 21h16", "M5.5 9.5V21", "M10 9.5V21", "M14 9.5V21", "M18.5 9.5V21"],
  document: ["M6 3h8l4 4v14H6Z", "M14 3v4h4", "M9 12h6", "M9 16h6"],
  law: ["M12 4v16", "M7 20h10", "M4 7h16", "M6 7l-3 6a3 3 0 0 0 6 0Z", "M18 7l-3 6a3 3 0 0 0 6 0Z"],
  chip: ["M7 7h10v10H7Z", "M10 10h4v4h-4Z", "M9.5 4v3", "M14.5 4v3", "M9.5 17v3", "M14.5 17v3", "M4 9.5h3", "M4 14.5h3", "M17 9.5h3", "M17 14.5h3"],
  datacenter: ["M4 4h16v6H4Z", "M4 14h16v6H4Z", "M7.5 7h.01", "M7.5 17h.01", "M11 7h6", "M11 17h6"],
  globe: [circle(12, 12, 9), "M3 12h18", "M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9", "M12 3c-2.5 2.5-3.8 5.5-3.8 9s1.3 6.5 3.8 9"],
  megaphone: ["M4 10v4h3l8 4V6l-8 4Z", "M18 9a4 4 0 0 1 0 6"],
  search: [circle(10.5, 10.5, 6.5), "M15.5 15.5L21 21"],
  check: ["M5 12.5l4.5 4.5L19 7"],
  cross: ["M6 6l12 12", "M18 6L6 18"],
  warning: ["M12 3L2 20h20Z", "M12 9v5", "M12 17.2v.3"],
  money: ["M3 6h18v12H3Z", circle(12, 12, 3)],
  cap: ["M2 9l10-5 10 5-10 5Z", "M6 11.5V16c3 2.5 9 2.5 12 0v-4.5"],
  briefcase: ["M3 8h18v12H3Z", "M9 8V5h6v3", "M3 13h18"],
  chat: ["M4 5h16v11H10l-5 4v-4H4Z"],
  idea: ["M9 18h6", "M10 21h4", "M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3Z"],
} as const;
export type IconName = keyof typeof ICONS;

/** Three sizes only. [EST] */
export const ICON_SIZE = { s: 64, m: 96, l: 144 } as const;

export const Icon: React.FC<{ name: IconName; size?: keyof typeof ICON_SIZE; at?: number; tone?: "text" | "clay"; seed?: number; style?: React.CSSProperties }> = ({
  name,
  size = "m",
  at = 0,
  tone = "text",
  seed = 7,
  style,
}) => {
  const frame = useCurrentFrame();
  const { text } = useSurface();
  const px = ICON_SIZE[size], pad = 8;
  const draw = progress(frame, at, DUR.draw - 4, "move");
  return (
    <Boil strength="icon" seed={seed} style={{ width: px + pad * 2, height: px + pad * 2, ...style }}>
      <svg width={px + pad * 2} height={px + pad * 2} viewBox={`${-pad * (24 / px)} ${-pad * (24 / px)} ${24 + (pad * 2 * 24) / px} ${24 + (pad * 2 * 24) / px}`} aria-hidden>
        {ICONS[name].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={tone === "clay" ? COLOR.clay : text}
            strokeWidth={(STROKE.icon * 24) / px} // same weight at every size (non-scaling-stroke would break the draw-on)
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - draw}
          />
        ))}
      </svg>
    </Boil>
  );
};
