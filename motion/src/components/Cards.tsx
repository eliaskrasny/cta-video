// Full-frame cards: title card, section card, quote card, stat reveal, end card.
// Layouts follow the brand PDF's "In use" page (p.13): left aligned, label above a Baskerville title, one Strand item per frame.
import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR, DUR, LOGO, SAFE, SPACE, STROKE, TYPE, VIDEO, colX, span } from "../brand/tokens";
import { Ground } from "../paper/Ground";
import { Cutout } from "../paper/Cutout";
import { Text, Source, checkLines, textWidth } from "../type/Text";
import { progress } from "../motion/ease";
import { useEnter } from "../motion/enter";
import { LogoLockup } from "./Logo";
import { StrandLoop } from "./StrandLoop";

/** Height in px of a text block, for laying things out under it. */
export const blockHeight = (role: keyof typeof TYPE, text: string) => checkLines(role, text).length * TYPE[role].size * TYPE[role].lineHeight;
/** When the last line of a block has started its entrance. */
export const afterLines = (at: number, text: string) => at + (text.split("\n").length - 1) * DUR.lineStagger;

/** A Strand underline: a straight rule about one word long that draws left to right. [PDF p.12] */
export const StrandRule: React.FC<{ at?: number; width?: number; style?: React.CSSProperties }> = ({ at = 0, width = 120, style }) => {
  const p = progress(useCurrentFrame(), at, DUR.smallIn + 4, "enter");
  return <div style={{ width, height: STROKE.rule, backgroundColor: COLOR.strand, transform: `scaleX(${p})`, transformOrigin: "left", ...style }} />;
};

/* ---------- title card ---------- */
export type TitleCardProps = { label: string; title: string; subtitle?: string; exitAt?: number };

/** Opens the video. Ink ground, label, Baskerville title, quiet subtitle, logo bottom-left, Strand loop bottom-right. 120 frames. */
export const TitleCard: React.FC<TitleCardProps> = ({ label, title, subtitle, exitAt }) => {
  const titleAt = 10, subAt = afterLines(titleAt, title) + 8;
  return (
    <Ground ground="ink">
      <div style={{ position: "absolute", left: colX(0), top: SAFE.top + 40 }}>
        <Text role="label" at={4} exitAt={exitAt}>{label}</Text>
        <Text role="display" at={titleAt} exitAt={exitAt} style={{ marginTop: SPACE.m }}>{title}</Text>
        {subtitle && <Text role="body" tone="quiet" at={subAt} exitAt={exitAt} style={{ marginTop: SPACE.l }}>{subtitle}</Text>}
      </div>
      {/* The logo's built-in clear space is its padding, so its outer box sits on the safe-area corner. */}
      <LogoLockup width={300} at={20} exitAt={exitAt} style={{ position: "absolute", left: colX(0) - 300 / LOGO.aspect, bottom: SAFE.bottom - 300 / LOGO.aspect }} />
      <StrandLoop x={1140} y={VIDEO.height - 330} scale={1.05} at={18} />
    </Ground>
  );
};

/* ---------- section card ---------- */
export type SectionCardProps = { number: string; label: string; title: string; exitAt?: number };

/** Opens each chapter. Warm ground, "02 · LABEL", h1 title, a Strand rule under it. 72 frames. */
export const SectionCard: React.FC<SectionCardProps> = ({ number, label, title, exitAt }) => {
  const titleAt = 8;
  const top = (VIDEO.height - (blockHeight("h1", title) + 120)) / 2;
  return (
    <Ground>
      <div style={{ position: "absolute", left: colX(0), top }}>
        <Text role="label" at={2} exitAt={exitAt}>{`${number} · ${label}`}</Text>
        <Text role="h1" at={titleAt} exitAt={exitAt} style={{ marginTop: SPACE.m }}>{title}</Text>
        <StrandRule at={afterLines(titleAt, title) + 8} style={{ marginTop: SPACE.xl }} />
      </div>
    </Ground>
  );
};

/* ---------- quote card ---------- */
export type QuoteCardProps = { quote: string; name: string; role: string; at?: number; exitAt?: number };

/** A real quote, in Baskerville Italic on a Wool panel, with who said it. Curly quotes are added for you. */
export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, name, role, at = 0, exitAt }) => {
  const lines = quote.split("\n");
  const text = lines.map((l, i) => (i === 0 ? "“" : "") + l + (i === lines.length - 1 ? "”" : "")).join("\n");
  const pad = SPACE.xxl;
  const h = pad * 2 + STROKE.rule + SPACE.xl + blockHeight("quote", text) + SPACE.xl + TYPE.label.size * 1.2;
  const panel = useEnter({ at, kind: "drop", exitAt });
  return (
    <div style={{ position: "absolute", left: colX(1), top: (VIDEO.height - h) / 2, ...panel }}>
      <Cutout width={Math.min(span(10), Math.max(span(6), Math.ceil(pad * 2 + Math.max(textWidth("quote", text), textWidth("label", `${name} · ${role}`)))))} height={h} fill="wool" elevation={1} seed={11} padding={pad}>
        <StrandRule at={at + 8} />
        <Text role="quote" at={at + 10} exitAt={exitAt} style={{ marginTop: SPACE.xl }}>{text}</Text>
        <Text role="label" tone="quiet" at={afterLines(at + 10, text) + 10} exitAt={exitAt} style={{ marginTop: SPACE.xl }}>{`${name} · ${role}`}</Text>
      </Cutout>
    </div>
  );
};

/* ---------- stat reveal ---------- */
export type StatProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  source: string;
  /** Set the number in Strand. Then nothing else in the frame may be Strand. */
  strand?: boolean;
  at?: number;
  exitAt?: number;
};

/** One big number that counts up, what it measures underneath, and its source. */
export const StatReveal: React.FC<StatProps> = ({ value, prefix = "", suffix = "", decimals = 0, label, source, strand = false, at = 0, exitAt }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, DUR.count, "enter");
  const shown = (value * p).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const num = `${prefix}${shown}${suffix}`;
  const final = `${prefix}${value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  checkLines("stat", final);
  const style = useEnter({ at, kind: "rise", exitAt });
  return (
    <>
      <div style={{ position: "absolute", left: colX(0), top: 250 }}>
        <div style={style}>
          <Text role="stat" tone={strand ? "strand" : "text"} enter="cut" at={at} exitAt={exitAt}>{num}</Text>
        </div>
        <Text role="h3" at={at + DUR.count - 10} exitAt={exitAt} style={{ marginTop: SPACE.l }}>{label}</Text>
      </div>
      <Source at={at + DUR.count} exitAt={exitAt}>{source}</Source>
    </>
  );
};

/* ---------- end card ---------- */
/** Closes the video. Ink ground, the lockup and the site, nothing else. The right two-thirds stay empty for YouTube end-screen elements. 240 frames. */
export const EndCard: React.FC<{ url?: string }> = ({ url = "aisafetysaidsimply.com" }) => {
  const w = 420, clear = w / LOGO.aspect;
  return (
    <Ground ground="ink">
      <LogoLockup width={w} at={6} style={{ position: "absolute", left: colX(0) - clear, top: 380 - clear }} />
      <Text role="label" tone="quiet" at={16} enter="fade" style={{ position: "absolute", left: colX(0), top: 380 + clear + SPACE.xl }}>{url}</Text>
    </Ground>
  );
};
