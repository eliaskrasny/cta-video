// All on-screen words go through <Text>. It sets the font, size, leading, tracking and colour from the role,
// checks line length, and animates lines in one after another. Break lines yourself with "\n".
import React from "react";
import { measureText } from "@remotion/layout-utils";
import { COLOR, DUR, SOURCE_POS, TYPE, type TypeRole } from "../brand/tokens";
import { FAMILY } from "../brand/fonts";
import { useSurface } from "../brand/surface";
import { useEnter, type EnterKind } from "../motion/enter";

export type Tone = "text" | "quiet" | "strand" | "clay";

export type TextProps = {
  role: TypeRole;
  children: string;
  /** text = Ink or Paper for the surface; quiet = Bark on warm, Line on Ink; strand and clay are accents (one per frame). */
  tone?: Tone;
  /** A phrase inside the text to set in Strand. Counts as the frame's one Strand item. */
  strand?: string;
  at?: number;
  exitAt?: number;
  enter?: EnterKind;
  /** Frames between lines. Defaults to DUR.lineStagger. */
  lineStagger?: number;
  style?: React.CSSProperties;
};

export const textStyle = (role: TypeRole): React.CSSProperties => {
  const t = TYPE[role];
  return {
    fontFamily: FAMILY[t.family],
    fontWeight: t.weight,
    fontStyle: t.italic ? "italic" : "normal",
    fontSize: t.size,
    lineHeight: t.lineHeight,
    letterSpacing: `${t.tracking}em`,
    textTransform: t.upper ? "uppercase" : "none",
    fontVariantNumeric: "lining-nums tabular-nums",
    whiteSpace: "pre",
    textAlign: "left",
    margin: 0,
  };
};

/** Width in px of the longest line of a block, measured with the real font. Use it to size panels to their text. */
export const textWidth = (role: TypeRole, text: string) => {
  const t = TYPE[role];
  return Math.max(...text.split("\n").map((line) => measureText({
    text: line, fontFamily: FAMILY[t.family], fontSize: t.size, fontWeight: t.weight, letterSpacing: `${t.tracking}em`,
    textTransform: t.upper ? "uppercase" : "none", additionalStyles: { fontStyle: t.italic ? "italic" : "normal" }, validateFontIsLoaded: true,
  }).width));
};

/** Throws when a block breaks the role's limits, so a render fails loudly instead of shipping an over-long line. */
export const checkLines = (role: TypeRole, text: string) => {
  const t = TYPE[role];
  const lines = text.split("\n");
  if (lines.length > t.maxLines) throw new Error(`[AISSS type] "${role}" allows ${t.maxLines} line(s); got ${lines.length}: "${text}"`);
  for (const l of lines) {
    if (l.length > t.maxChars) throw new Error(`[AISSS type] "${role}" lines are at most ${t.maxChars} characters; "${l}" is ${l.length}. Break it with \\n or cut words.`);
  }
  return lines;
};

const Line: React.FC<{ text: string; strand?: string; at: number; exitAt?: number; enter: EnterKind }> = ({ text, strand, at, exitAt, enter }) => {
  const style = useEnter({ at, kind: enter, exitAt });
  const i = strand ? text.indexOf(strand) : -1;
  return (
    <div style={{ ...style, display: "block" }}>
      {i < 0 ? text : (
        <>
          {text.slice(0, i)}
          <span style={{ color: COLOR.strand }}>{strand}</span>
          {text.slice(i + strand!.length)}
        </>
      )}
    </div>
  );
};

export const Text: React.FC<TextProps> = ({ role, children, tone = "text", strand, at = 0, exitAt, enter = "rise", lineStagger = DUR.lineStagger, style }) => {
  const surface = useSurface();
  const lines = checkLines(role, children);
  // Strand on Warm Paper is 4.1:1, which passes only for large type. Small orange text is Clay (7.0:1).
  if ((strand || tone === "strand") && TYPE[role].size < TYPE.h3.size) throw new Error(`[AISSS type] Strand type is for headings (h3 and larger). Use tone="clay" for small orange text.`);
  const color = tone === "strand" ? COLOR.strand : tone === "clay" ? COLOR.clay : tone === "quiet" ? surface.quiet : surface.text;
  let used = false; // the Strand phrase is set once, in the first line that has it
  return (
    <div style={{ ...textStyle(role), color, ...style }}>
      {lines.map((l, i) => {
        const has = !used && !!strand && l.includes(strand);
        if (has) used = true;
        return <Line key={i} text={l} strand={has ? strand : undefined} at={at + i * lineStagger} exitAt={exitAt} enter={enter} />;
      })}
    </div>
  );
};

/** Source line, bottom-left below the safe area. Every claim with a number gets one. */
export const Source: React.FC<{ children: string; at?: number; exitAt?: number }> = ({ children, at = 0, exitAt }) => (
  <Text role="source" tone="quiet" enter="fade" at={at} exitAt={exitAt} style={{ position: "absolute", left: SOURCE_POS.left, bottom: SOURCE_POS.bottom }}>
    {children}
  </Text>
);
