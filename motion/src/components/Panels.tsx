// Panels that sit over a scene: lower third, callout, document with highlighter, photo cutout.
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { COLOR, DUR, SAFE, SPACE, STROKE, TILT, TYPE, VIDEO, colX, span } from "../brand/tokens";
import { Cutout } from "../paper/Cutout";
import { Source, Text, checkLines, textStyle, textWidth } from "../type/Text";
import { progress } from "../motion/ease";
import { useEnter } from "../motion/enter";
import { YarnMark } from "./Logo";
import { Arrow } from "./Arrow";
import { afterLines, blockHeight } from "./Cards";

/* ---------- lower third ---------- */
export type LowerThirdProps = { label: string; title: string; at?: number; exitAt?: number; width?: number };

/** Names a person, place or idea. Wool panel bottom-left, Strand bar, small-caps label, Baskerville title, yarn mark right. [PDF p.13] */
export const LowerThird: React.FC<LowerThirdProps> = ({ label, title, at = 0, exitAt, width: fixed }) => {
  const frame = useCurrentFrame();
  const h = 168, pad = SPACE.xl, bar = 8, mark = 56;
  // As wide as its words need, from 5 columns up to the full width.
  const fit = pad + bar + SPACE.l + Math.max(textWidth("label", label), textWidth("h2", title)) + SPACE.xl + mark + pad;
  const width = fixed ?? Math.min(span(12), Math.max(span(5), Math.ceil(fit)));
  const panel = useEnter({ at, kind: "slide-left", exitAt });
  const barP = progress(frame, at + 6, DUR.smallIn, "enter");
  return (
    <div style={{ position: "absolute", left: colX(0), top: VIDEO.height - SAFE.bottom - h, ...panel }}>
      <Cutout width={width} height={h} fill="wool" elevation={1} seed={21}>
        <div style={{ position: "absolute", left: pad, top: pad - 8, width: bar, height: h - (pad - 8) * 2, backgroundColor: COLOR.strand, transform: `scaleY(${barP})`, transformOrigin: "top" }} />
        <div style={{ position: "absolute", left: pad + bar + SPACE.l, top: pad - 6 }}>
          <Text role="label" at={at + 8} exitAt={exitAt}>{label}</Text>
          <Text role="h2" at={at + 10} exitAt={exitAt} style={{ marginTop: SPACE.xs }}>{title}</Text>
        </div>
        <YarnMark size={mark} at={at + 12} exitAt={exitAt} style={{ position: "absolute", right: pad, top: (h - 56) / 2 }} />
      </Cutout>
    </div>
  );
};

/* ---------- callout ---------- */
export type CalloutProps = {
  x: number;
  y: number;
  label?: string;
  body: string;
  width?: number;
  /** Draw a leader arrow from the panel to this point in the frame. */
  pointTo?: { x: number; y: number };
  at?: number;
  exitAt?: number;
  seed?: number;
};

/** A boxed note that explains something on screen. Up to three body lines, optional label and pointer. */
export const Callout: React.FC<CalloutProps> = ({ x, y, label, body, width: fixed, pointTo, at = 0, exitAt, seed = 31 }) => {
  const pad = SPACE.xl;
  const width = fixed ?? Math.min(span(8), Math.max(span(3), Math.ceil(pad * 2 + Math.max(label ? textWidth("label", label) : 0, textWidth("body", body)))));
  const h = pad * 2 + (label ? TYPE.label.size * 1.2 + SPACE.s : 0) + blockHeight("body", body);
  const panel = useEnter({ at, kind: "drop", exitAt });
  // The arrow leaves from the middle of whichever panel edge faces the target.
  const from = pointTo
    ? pointTo.x > x + width ? { x: x + width + 12, y: y + h / 2 } : pointTo.x < x ? { x: x - 12, y: y + h / 2 } : pointTo.y > y + h ? { x: x + width / 2, y: y + h + 12 } : { x: x + width / 2, y: y - 12 }
    : null;
  return (
    <>
      {pointTo && from && <Arrow from={from} to={pointTo} at={at + DUR.panelIn} exitAt={exitAt} seed={seed + 1} />}
      <div style={{ position: "absolute", left: x, top: y, ...panel }}>
        <Cutout width={width} height={h} fill="wool" elevation={1} seed={seed} padding={pad}>
          {label && <Text role="label" at={at + 6} exitAt={exitAt} style={{ marginBottom: SPACE.s }}>{label}</Text>}
          <Text role="body" at={at + 8} exitAt={exitAt}>{body}</Text>
        </Cutout>
      </div>
    </>
  );
};

/* ---------- document + highlighter ---------- */
export type DocLine = string | { bar: number }; // a bar is unreadable filler text, as a share of the line width
export type DocumentProps = {
  label: string;
  title: string;
  lines: DocLine[];
  highlight?: { line: number; phrase: string; at: number };
  x?: number;
  y?: number;
  at?: number;
  exitAt?: number;
};

/** A page from a real document. Filler lines are Wheat bars; the quoted line is real text; the highlighter is Live with Ink type. */
export const DocumentHighlight: React.FC<DocumentProps> = ({ label, title, lines, highlight, x = colX(5), y = SAFE.top, at = 0, exitAt }) => {
  const frame = useCurrentFrame();
  const w = span(7), pad = SPACE.xxl, lh = TYPE.small.size * TYPE.small.lineHeight;
  const h = VIDEO.height - SAFE.top - SAFE.bottom;
  const sheet = useEnter({ at, kind: "slide-up", exitAt });
  const hp = highlight ? progress(frame, highlight.at, DUR.highlight, "enter") : 0;
  lines.forEach((l) => typeof l === "string" && checkLines("small", l));
  return (
    <div style={{ position: "absolute", left: x, top: y, ...sheet }}>
      <Cutout width={w} height={h} fill="wool" elevation={2} seed={41} padding={pad}>
        <Text role="label" tone="quiet" at={at + 6} enter="cut">{label}</Text>
        <Text role="h3" at={at + 6} enter="cut" style={{ marginTop: SPACE.s, marginBottom: SPACE.l }}>{title}</Text>
        {lines.map((l, i) =>
          typeof l !== "string" ? (
            <div key={i} style={{ height: lh, display: "flex", alignItems: "center" }}>
              <div style={{ width: (w - pad * 2) * l.bar, height: TYPE.small.size * 0.42, backgroundColor: COLOR.wheat }} />
            </div>
          ) : (
            <div key={i} style={{ ...textStyle("small"), color: COLOR.ink, position: "relative", zIndex: 0 }}>
              {highlight && highlight.line === i && l.includes(highlight.phrase) ? (
                <>
                  {l.slice(0, l.indexOf(highlight.phrase))}
                  <span style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: -4, right: -4, top: "6%", bottom: "2%", backgroundColor: COLOR.live, transform: `scaleX(${hp})`, transformOrigin: "left", zIndex: -1 }} />
                    {highlight.phrase}
                  </span>
                  {l.slice(l.indexOf(highlight.phrase) + highlight.phrase.length)}
                </>
              ) : (
                l
              )}
            </div>
          ),
        )}
      </Cutout>
    </div>
  );
};

/* ---------- images ---------- */
// Images come only from public/images/stock (licensed stock) and public/images/real (real-story screenshots and photos),
// and every file there has a row in that folder's credits.csv (checked by npm run check).
const imageFrom = (src: string | undefined, folders: string[], what: string) => {
  if (src && !folders.some((f) => src.startsWith(`images/${f}/`)))
    throw new Error(`[AISSS image] ${what} images come from ${folders.map((f) => `public/images/${f}/`).join(" or ")}; got "${src}".`);
};

/* ---------- photo cutout ---------- */
export type PhotoProps = {
  /** Path inside public/: "images/stock/..." or "images/real/...". Leave out for a placeholder. */
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Degrees, at most TILT.max either way. */
  tilt?: number;
  caption?: string;
  at?: number;
  exitAt?: number;
  seed?: number;
};

/** A real photo, in greyscale, mounted on a Wool backing that boils. The photo itself never boils. */
export const PhotoCutout: React.FC<PhotoProps> = ({ src, x, y, width, height, tilt = 0, caption, at = 0, exitAt, seed = 51 }) => {
  if (Math.abs(tilt) > TILT.max) throw new Error(`[AISSS photo] tilt is at most ${TILT.max} degrees.`);
  imageFrom(src, ["stock", "real"], "Photo");
  const border = 14;
  const motion = useEnter({ at, kind: "drop", exitAt });
  return (
    <div style={{ position: "absolute", left: x, top: y, ...motion }}>
      <div style={{ transform: `rotate(${tilt}deg)` }}>
        <Cutout width={width + border * 2} height={height + border * 2} fill="wool" elevation={2} seed={seed} padding={border}>
          {src ? (
            <Img src={staticFile(src)} style={{ width, height, objectFit: "cover", display: "block", filter: "grayscale(1) contrast(1.05)" }} />
          ) : (
            <div style={{ width, height, backgroundColor: COLOR.wheat, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Text role="label" enter="cut">Photo goes here</Text>
            </div>
          )}
        </Cutout>
      </div>
      {caption && <Text role="caption" tone="quiet" at={afterLines(at, "") + DUR.panelIn} exitAt={exitAt} style={{ marginTop: SPACE.m }}>{caption}</Text>}
    </div>
  );
};

/* ---------- article screenshot ---------- */
export type ArticleProps = {
  /** Path inside public/images/real/. Leave out for a placeholder. */
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Publisher and date, shown as the source line, e.g. "Los Angeles Times, 29 September 2025". Required. */
  source: string;
  /** Underline one line of the screenshot, such as the headline. Positions are shares of the image (0 to 1). It is the frame's one Strand item. */
  underline?: { x: number; y: number; width: number; at: number };
  at?: number;
  exitAt?: number;
  seed?: number;
};

/** A real article, post or web page: the screenshot top-aligned on a Wool mount, greyscale, never edited, always sourced. */
export const ArticleCutout: React.FC<ArticleProps> = ({ src, x, y, width, height, source, underline, at = 0, exitAt, seed = 57 }) => {
  imageFrom(src, ["real"], "Article");
  const frame = useCurrentFrame();
  const border = 14;
  const motion = useEnter({ at, kind: "slide-up", exitAt });
  const u = underline ? progress(frame, underline.at, DUR.draw, "move") : 0;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, ...motion }}>
        <Cutout width={width + border * 2} height={height + border * 2} fill="wool" elevation={2} seed={seed} padding={border}>
          <div style={{ position: "relative", width, height, overflow: "hidden" }}>
            {src ? (
              <Img src={staticFile(src)} style={{ width, height, objectFit: "cover", objectPosition: "top", display: "block", filter: "grayscale(1)" }} />
            ) : (
              <div style={{ width, height, backgroundColor: COLOR.warmPaper, padding: SPACE.xl, boxSizing: "border-box" }}>
                <Text role="label" tone="quiet" enter="cut">Article screenshot goes here</Text>
              </div>
            )}
            {underline && (
              <div style={{ position: "absolute", left: underline.x * width, top: underline.y * height, width: underline.width * width, height: STROKE.rule, backgroundColor: COLOR.strand, transform: `scaleX(${u})`, transformOrigin: "left" }} />
            )}
          </div>
        </Cutout>
      </div>
      <Source at={at + DUR.panelIn} exitAt={exitAt}>{`Source: ${source}`}</Source>
    </>
  );
};
