// Charts and timelines. Flat paper bars, one signal colour for the bar that matters, everything else Wheat, Ink axis.
// Bars start at zero, always. Every chart has a source.
import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR, DUR, SAFE, SPACE, STROKE, TYPE, VIDEO, colX, span, type SignalName } from "../brand/tokens";
import { Boil } from "../paper/Boil";
import { cutRectPath } from "../paper/cut";
import { Text, Source } from "../type/Text";
import { progress } from "../motion/ease";
import { useEnter } from "../motion/enter";

/* ---------- bar chart ---------- */
export type Bar = { label: string; value: number; highlight?: boolean };
export type BarChartProps = {
  title: string;
  bars: Bar[];
  /** Formats the number shown above each bar. */
  format?: (v: number) => string;
  signal?: SignalName;
  source: string;
  at?: number;
};

const CHART = { top: 300, baseline: VIDEO.height - SAFE.bottom - 70, maxBars: 8, barMax: 200, gapShare: 0.45 } as const; // [EST]

export const BarChart: React.FC<BarChartProps> = ({ title, bars, format = (v) => v.toLocaleString("en-US"), signal = "indigo", source, at = 0 }) => {
  if (bars.length > CHART.maxBars) throw new Error(`[AISSS chart] at most ${CHART.maxBars} bars; split the chart.`);
  if (bars.filter((b) => b.highlight).length > 1) throw new Error("[AISSS chart] highlight one bar at most.");
  const frame = useCurrentFrame();
  const left = colX(0), width = span(12);
  const slot = width / bars.length, barW = Math.min(CHART.barMax, slot * (1 - CHART.gapShare));
  const max = Math.max(...bars.map((b) => b.value));
  const plotH = CHART.baseline - CHART.top - 60;
  const axisP = progress(frame, at + 4, DUR.draw, "move");
  const barsAt = at + 4 + DUR.draw - 6;
  return (
    <>
      <Text role="h2" at={at} style={{ position: "absolute", left, top: SAFE.top }}>{title}</Text>
      <Boil strength="panel" seed={61} style={{ position: "absolute", inset: 0 }}>
        <svg width={VIDEO.width} height={VIDEO.height} aria-hidden>
          {bars.map((b, i) => {
            const p = progress(frame, barsAt + i * DUR.stagger, DUR.barGrow, "enter");
            const h = Math.max(1, (b.value / max) * plotH * p);
            const x = left + slot * i + (slot - barW) / 2;
            return <path key={i} d={cutRectPath(barW, h, 70 + i)} transform={`translate(${x} ${CHART.baseline - h})`} fill={b.highlight ? COLOR[signal] : COLOR.wheat} />;
          })}
          <rect x={left} y={CHART.baseline - STROKE.axis / 2} width={width * axisP} height={STROKE.axis} fill={COLOR.ink} />
        </svg>
      </Boil>
      {bars.map((b, i) => {
        const x = left + slot * i + (slot - barW) / 2;
        const done = barsAt + i * DUR.stagger + DUR.barGrow - 4;
        const h = (b.value / max) * plotH;
        return (
          <React.Fragment key={i}>
            <Text role="figure" at={done} style={{ position: "absolute", left: x, top: CHART.baseline - h - TYPE.figure.size * 1.1 - SPACE.s }}>{format(b.value)}</Text>
            <Text role="label" at={barsAt + i * DUR.stagger} style={{ position: "absolute", left: x, top: CHART.baseline + SPACE.m }}>{b.label}</Text>
          </React.Fragment>
        );
      })}
      <Source at={barsAt + bars.length * DUR.stagger + DUR.barGrow}>{source}</Source>
    </>
  );
};

/* ---------- timeline ---------- */
export type TimelineEvent = { year: number; text: string; accent?: boolean };
export type TimelineProps = { title: string; events: TimelineEvent[]; source?: string; at?: number };

/** Years spaced to scale along an Ink rule. One event may be the Strand accent (e.g. "today"). */
export const Timeline: React.FC<TimelineProps> = ({ title, events, source, at = 0 }) => {
  if (events.filter((e) => e.accent).length > 1) throw new Error("[AISSS timeline] one accent event at most.");
  const frame = useCurrentFrame();
  const left = colX(0) + 20, width = span(12) - 260, y = 560;
  const y0 = Math.min(...events.map((e) => e.year)), y1 = Math.max(...events.map((e) => e.year));
  const xOf = (yr: number) => left + ((yr - y0) / Math.max(1, y1 - y0)) * width;
  const lineP = progress(frame, at + 6, DUR.draw * 2, "move");
  return (
    <>
      <Text role="h2" at={at} style={{ position: "absolute", left: colX(0), top: SAFE.top }}>{title}</Text>
      <Boil strength="line" seed={81} style={{ position: "absolute", inset: 0 }}>
        <svg width={VIDEO.width} height={VIDEO.height} aria-hidden>
          <rect x={left} y={y - STROKE.axis / 2} width={(width + 60) * lineP} height={STROKE.axis} fill={COLOR.ink} />
          {events.map((e, i) => {
            const reach = at + 6 + DUR.draw * 2 * ((xOf(e.year) - left) / (width + 60));
            const s = progress(frame, reach + i * DUR.stagger, DUR.smallIn, "pop");
            return <circle key={i} cx={xOf(e.year)} cy={y} r={(e.accent ? 16 : 11) * s} fill={e.accent ? COLOR.strand : COLOR.ink} />;
          })}
        </svg>
      </Boil>
      {events.map((e, i) => {
        const reach = at + 6 + DUR.draw * 2 * ((xOf(e.year) - left) / (width + 60)) + i * DUR.stagger;
        return (
          <React.Fragment key={i}>
            <Text role="figure" at={reach + 4} style={{ position: "absolute", left: xOf(e.year) - 6, top: y - 84 }}>{String(e.year)}</Text>
            <Text role="small" at={reach + 6} style={{ position: "absolute", left: xOf(e.year) - 6, top: y + 40 }}>{e.text}</Text>
          </React.Fragment>
        );
      })}
      {source && <Source at={at + DUR.draw * 2 + 12}>{source}</Source>}
    </>
  );
};

/* ---------- label + body group (for list-style explainer frames) ---------- */
/** A short list: up to four items, each a label and a line of body text, staggered in. */
export const ItemList: React.FC<{ items: { label: string; body: string }[]; x?: number; y?: number; at?: number }> = ({ items, x = colX(0), y = 300, at = 0 }) => {
  if (items.length > 4) throw new Error("[AISSS list] four items at most on one frame.");
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {items.map((it, i) => (
        <ListItem key={i} {...it} at={at + i * DUR.stagger * 3} />
      ))}
    </div>
  );
};
const ListItem: React.FC<{ label: string; body: string; at: number }> = ({ label, body, at }) => {
  const s = useEnter({ at, kind: "rise" });
  return (
    <div style={{ ...s, marginBottom: SPACE.xl }}>
      <Text role="label" tone="quiet" enter="cut" at={at}>{label}</Text>
      <Text role="body" enter="cut" at={at} style={{ marginTop: SPACE.xs }}>{body}</Text>
    </div>
  );
};
