// The career map, animated. Same steps, positions and lines as the website (careermap-data.js, copied from the
// career-flowchart project), drawn in the video's paper style. Shots choose:
//   camera  where the camera is, moving between named views (CAREER_VIEWS)
//   reveal  which parts of the map appear, and when (the map is built up in story order)
//   lit     which path is lit in the signal colour ("you're on the Policy path now")
//   here    a "You are here" marker that moves between steps (the frame's one Strand item)
// Map text scales with the camera, so it fades out whenever it would be smaller than 20 px on screen.
import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import CM from "./careermap-data.js";
import LOGOS from "./logos.js";
import type { CNode, Edge, LaneId, NodePos } from "./careermap-data.js";
import { COLOR, DUR, VIDEO, type SignalName } from "../brand/tokens";
import { FAMILY } from "../brand/fonts";
import { Boil } from "../paper/Boil";
import { progress } from "../motion/ease";

const { W, H, SX, LANES, LANE, NODES, NODE, EDGES, PEOPLE, PILLX, REACHX, ENDX, ICON, extrasAt, posFor } = CM;

/* ---------- named views (chart units; height follows 16:9) ---------- */
const box = (cx: number, cy: number, w: number) => ({ cx, cy, w });
const FIXED_VIEWS = {
  overview: box(W / 2, H / 2, W + 120),
  gettingStarted: box(760, 910, 1900),
  start: box(260, 910, 900),
  learn: box(640, 910, 1000),
  fork: box(960, 910, 1600),
  student: box(970, 470, 1100),
  mid: box(970, 1350, 1100),
  pick: box(1400, 800, 1100),
  paths: box((REACHX + ENDX) / 2 + 100, H / 2, ENDX - REACHX + 500),
  end: box(ENDX + 150, 910, 1000),
};
export type CareerView = keyof typeof FIXED_VIEWS | LaneId | `${LaneId}:${0 | 1 | 2 | 3 | 4}`;
/** Fixed views, plus one per path ("policy") and one per stage of a path ("policy:2"). */
export const careerView = (v: CareerView) => {
  if (v in FIXED_VIEWS) return FIXED_VIEWS[v as keyof typeof FIXED_VIEWS];
  const [lane, stage] = v.split(":") as [LaneId, string?];
  const l = LANE[lane];
  if (!l) throw new Error(`[AISSS career map] no view called "${v}".`);
  return stage === undefined ? box((REACHX + ENDX) / 2 + 100, l.y, ENDX - REACHX + 300) : box(SX[+stage], l.y, 1100);
};

/* ---------- parts, for revealing the map in story order ---------- */
export type CareerPart = "start" | "learn" | "student" | "mid" | "pick" | LaneId | "end";
const HUB_PART: Record<string, CareerPart> = { start: "start", stay: "start", learn: "learn", student: "student", mid: "mid", pick: "pick", reach: "pick", build: "end" };
const nodeParts = (n: CNode): CareerPart[] => {
  if (HUB_PART[n.id]) return [HUB_PART[n.id]];
  if (n.type === "sat" && n.parent) return [HUB_PART[n.parent[0]]];
  return n.lanes;
};
const edgePart = (e: Edge): CareerPart => (e.part as CareerPart) ?? nodeParts(NODE[e.node!])[0];

/* ---------- chart-unit sizes (from the website) ---------- */
// The website sets hub and stage labels in small caps (26 and 17 px); small caps are about 72% of a capital, so the
// video's tracked capitals use that size to take the same room.
const T = { node: 18, hub: 19, lane: 22, stage: 12.5, person: 16, here: 19 } as const;
const MIN_PX = 20, FADE_PX = 4; // map text fades in between 16 and 20 px on screen

export type CareerMapProps = {
  /** First entry is where the camera starts; each later one moves there over DUR.mapMove. */
  camera?: { at: number; view: CareerView }[];
  /** Parts appear at their `at`; parts not listed stay hidden. Leave out to show the whole map. */
  reveal?: { at: number; part: CareerPart }[];
  /** Show hidden parts as faint outlines (the "whole map, still to come" look). */
  ghost?: boolean;
  /** Light one path in the signal colour from `at`; lane: null turns it off. */
  lit?: { at: number; lane: LaneId | null }[];
  signal?: SignalName;
  /** "You are here": moves to each step at its `at`. The frame's one Strand item. */
  here?: { at: number; node: string }[];
};

const latest = <T extends { at: number }>(list: T[] | undefined, frame: number) => {
  const past = (list ?? []).filter((e) => e.at <= frame).sort((a, b) => a.at - b.at);
  return { cur: past[past.length - 1], prev: past[past.length - 2] };
};

export const CareerMap: React.FC<CareerMapProps> = ({ camera = [{ at: 0, view: "overview" }], reveal, ghost = false, lit, signal = "indigo", here }) => {
  const frame = useCurrentFrame();

  // Camera: centre moves and width eases in log space, like the master map.
  let cam = careerView(camera[0].view);
  for (const step of camera.slice(1)) {
    const next = careerView(step.view), p = progress(frame, step.at, DUR.mapMove, "move");
    if (p <= 0) break;
    cam = { cx: cam.cx + (next.cx - cam.cx) * p, cy: cam.cy + (next.cy - cam.cy) * p, w: Math.exp(Math.log(cam.w) + (Math.log(next.w) - Math.log(cam.w)) * p) };
  }
  const vh = (cam.w * VIDEO.height) / VIDEO.width, scale = VIDEO.width / cam.w;
  const viewBox = `${cam.cx - cam.w / 2} ${cam.cy - vh / 2} ${cam.w} ${vh}`;
  const legible = (size: number) => Math.min(1, Math.max(0, (size * scale - (MIN_PX - FADE_PX)) / FADE_PX));

  // Reveal: when each part appears (Infinity = not yet).
  const partAt = (part: CareerPart) => (reveal ? reveal.find((r) => r.part === part)?.at ?? Infinity : -Infinity);
  const shown = (t: number, delay = 0, dur: number = DUR.smallIn, curve: "pop" | "enter" | "move" = "pop") => (t === Infinity ? 0 : progress(frame, t + delay, dur, curve));
  const ghostO = ghost ? 0.14 : 0;
  // Nodes pop in as the line reaches them: delay by how far along their part they sit.
  const span = (part: CareerPart) => {
    const xs = NODES.filter((n) => n.type !== "extra" && nodeParts(n).includes(part)).flatMap((n) => n.pos.map((p) => p.x));
    return { lo: Math.min(...xs), hi: Math.max(...xs) };
  };
  const SPANS = Object.fromEntries((["start", "learn", "student", "mid", "pick", "end", ...LANES.map((l) => l.id)] as CareerPart[]).map((p) => [p, span(p)]));
  const nodeIn = (n: CNode, p: NodePos) => {
    const parts = n.type === "leaf" ? p.lanes : nodeParts(n);
    return Math.max(0, ...parts.map((part) => {
      const t = partAt(part), s = SPANS[part], f = s.hi > s.lo ? (p.x - s.lo) / (s.hi - s.lo) : 0;
      return shown(t, 6 + f * DUR.draw * 1.6);
    }));
  };

  // Lit path: fades to the signal colour; the previous one fades back.
  const { cur: litNow, prev: litBefore } = latest(lit, frame);
  const litP = litNow ? progress(frame, litNow.at, DUR.panelIn, "enter") : 0;
  const tint = (lanes: LaneId[], base: string) => {
    if (litNow?.lane && lanes.includes(litNow.lane)) return interpolateColors(litP, [0, 1], [base, COLOR[signal]]);
    if (litBefore?.lane && lanes.includes(litBefore.lane) && litNow?.lane !== litBefore.lane) return interpolateColors(litP, [0, 1], [COLOR[signal], base]);
    return base;
  };
  const isLit = (lanes: LaneId[]) => !!litNow?.lane && lanes.includes(litNow.lane) && litP > 0.5;

  /* ---------- shapes (boil) ---------- */
  const edges = EDGES.map((e, i) => {
    const t = partAt(edgePart(e)), draw = shown(t, 0, DUR.draw * 2, "move");
    const base = e.kind === "trunk" || e.kind === "stub" ? COLOR.ink : COLOR.wheat;
    const color = e.kind === "trunk" || e.kind === "stub" ? base : tint(e.lanes, base);
    if (draw <= 0 && !ghostO) return null;
    return (
      <path key={i} d={e.d} fill="none" stroke={color} strokeWidth={e.width} strokeLinecap="round" strokeDasharray={e.dash ?? "1 1"} pathLength={e.dash ? undefined : 1}
        strokeDashoffset={e.dash ? 0 : 1 - Math.max(draw, ghostO ? 1 : 0)} opacity={draw > 0 ? (e.dash ? draw : 1) : ghostO} />
    );
  });

  const nodeShapes: React.ReactNode[] = [], nodeFaces: React.ReactNode[] = [], labels: React.ReactNode[] = [];
  NODES.filter((n) => n.type === "hub" || n.type === "sat" || n.type === "leaf").forEach((n) => n.pos.forEach((p, pi) => {
    const s = nodeIn(n, p), o = s > 0 ? 1 : ghostO, k = `${n.id}-${pi}`;
    if (!o) return;
    const at = `translate(${p.x} ${p.y}) scale(${s > 0 ? s : 1})`;
    const lanes = n.type === "leaf" ? p.lanes : n.lanes;
    if (n.type === "hub") {
      nodeShapes.push(<g key={k} transform={at} opacity={o}><circle r={46} fill={COLOR.ink} /><g transform="translate(-22.8 -22.8) scale(1.9)"><path d={ICON[n.icon!]} fill="none" stroke={COLOR.warmPaper} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></g></g>);
      if (s > 0) labels.push(<MapLabel key={k} x={p.x + (n.lx ?? 0)} y={p.y + (n.ly ?? 88)} text={n.label} size={T.hub} bold upper o={s * legible(T.hub)} />);
      return;
    }
    const ringColor = lanes.length ? tint(lanes, COLOR.wheat) : COLOR.ink;
    const logo = n.logo && LOGOS[n.logo];
    nodeShapes.push(
      <g key={k} transform={at} opacity={o}>
        {n.logo ? <circle r={30} fill={COLOR.paper} /> : <circle r={30} fill={lanes.length ? tint(lanes, COLOR.ink) : COLOR.ink} />}
        {!n.logo && n.icon && <g transform="translate(-17.4 -17.4) scale(1.45)"><path d={ICON[n.icon]} fill="none" stroke={COLOR.warmPaper} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></g>}
        <circle r={31} fill="none" stroke={ringColor} strokeWidth={7} />
      </g>,
    );
    // Third-party logos are like photos: greyscale, and they don't boil.
    if (logo) nodeFaces.push(<g key={k} transform={at} opacity={o}><image href={logo} x={-27} y={-27} width={54} height={54} style={{ clipPath: "circle(50%)", filter: "grayscale(1)" }} /></g>);
    if (s > 0) {
      const lines = n.label.split("\n");
      const right = n.lp === "r";
      labels.push(<MapLabel key={k} x={p.x + (right ? 46 : 0)} y={p.y + (right ? (lines.length > 1 ? -2 : 7) : 58)} text={n.label} size={T.node} anchor={right ? "start" : "middle"} o={s * legible(T.node)} bold={isLit(lanes)} />);
    }
  }));

  // Path labels, stage markers, "+N more" and "-> Founders" tags.
  const laneBits = LANES.map((l) => {
    const t = partAt(l.id), s = shown(t, 4, DUR.panelIn, "enter"), o = s > 0 ? s : ghostO;
    if (!o) return null;
    const pill = tint([l.id], COLOR.wool), txt = isLit([l.id]) ? COLOR.paper : COLOR.ink;
    return (
      <g key={l.id} opacity={o}>
        <g transform={`translate(${PILLX} ${l.y})`}>
          <rect x={-106} y={-24} width={224} height={60} fill={COLOR.wheat} />
          <rect x={-112} y={-30} width={224} height={60} fill={pill} />
          <text y={8} textAnchor="middle" fontFamily={FAMILY.sans} fontWeight={700} fontSize={T.lane} fill={txt} opacity={legible(T.lane)}>{l.name}</text>
        </g>
        {l.stages.map((st, i) => {
          const more = extrasAt(`${l.id}:${i}`).length, mx = SX[i] + (i < 4 ? 200 : -200);
          return (
            <g key={i}>
              <circle cx={SX[i]} cy={l.y} r={12} fill={COLOR.warmPaper} stroke={tint([l.id], COLOR.wheat)} strokeWidth={6} />
              <text x={SX[i] - 112} y={l.y + 6} textAnchor="middle" fontFamily={FAMILY.sans} fontWeight={700} fontSize={T.stage} letterSpacing="0.08em" fill={COLOR.bark} opacity={legible(T.stage)} stroke={COLOR.warmPaper} strokeWidth={5} paintOrder="stroke">{`${i + 1} · ${st}`.toUpperCase()}</text>
              {more > 0 && (
                <g transform={`translate(${mx} ${l.y + 62})`}>
                  <rect x={-46} y={-15} width={92} height={30} fill={COLOR.warmPaper} stroke={tint([l.id], COLOR.wheat)} strokeWidth={3} />
                  <text y={6} textAnchor="middle" fontFamily={FAMILY.sans} fontWeight={700} fontSize={T.stage} fill={COLOR.ink} opacity={legible(T.stage)}>{`+${more} MORE`}</text>
                </g>
              )}
            </g>
          );
        })}
        {l.id !== "founders" && (
          <g transform={`translate(${SX[4] + 95} ${l.y})`}>
            <rect x={-56} y={-16} width={112} height={32} fill={COLOR.wool} />
            <text y={6} textAnchor="middle" fontFamily={FAMILY.sans} fontWeight={700} fontSize={T.stage} fill={COLOR.ink} opacity={legible(T.stage)}>→ FOUNDERS</text>
          </g>
        )}
      </g>
    );
  });

  // Real people, pinned where they are now. They appear after their path has been drawn.
  const pins = PEOPLE.map((person) => {
    const p = posFor(NODE[person.at], person.lane), s = shown(partAt(person.lane), DUR.draw * 2 + 6);
    if (s <= 0) return null;
    return (
      <g key={person.id} transform={`translate(${p.x + 40} ${p.y - 40}) scale(${s})`}>
        <circle r={21} fill={COLOR.ink} stroke={tint([person.lane], COLOR.wheat)} strokeWidth={5} />
        <text y={6} textAnchor="middle" fontFamily={FAMILY.sans} fontWeight={700} fontSize={T.person} fill={COLOR.warmPaper}>{person.ini}</text>
        <text y={-30} textAnchor="middle" fontFamily={FAMILY.sans} fontWeight={700} fontSize={T.person} fill={COLOR.ink} opacity={legible(T.person)} stroke={COLOR.warmPaper} strokeWidth={5} paintOrder="stroke">{person.name.split(" ")[0]}</text>
      </g>
    );
  });

  // "You are here": a Strand ring that glides between steps, with a small label above it.
  const { cur: hereNow, prev: hereBefore } = latest(here, frame);
  let marker: React.ReactNode = null;
  if (hereNow) {
    const to = NODE[hereNow.node]?.pos[0];
    if (!to) throw new Error(`[AISSS career map] no step called "${hereNow.node}".`);
    const from = hereBefore ? NODE[hereBefore.node].pos[0] : to;
    const m = progress(frame, hereNow.at, DUR.panelIn * 2, "move"), pop = hereBefore ? 1 : progress(frame, hereNow.at, DUR.smallIn, "pop");
    const x = from.x + (to.x - from.x) * m, y = from.y + (to.y - from.y) * m, r = NODE[hereNow.node].type === "hub" ? 62 : 46;
    marker = (
      <g transform={`translate(${x} ${y}) scale(${pop})`}>
        <circle r={r} fill="none" stroke={COLOR.strand} strokeWidth={8} />
        <text y={-r - 16} textAnchor="middle" fontFamily={FAMILY.sans} fontWeight={700} fontSize={T.here} letterSpacing="0.12em" fill={COLOR.ink} stroke={COLOR.warmPaper} strokeWidth={6} paintOrder="stroke">YOU ARE HERE</text>
      </g>
    );
  }

  return (
    <AbsoluteFill>
      <Boil strength="map" seed={97} style={{ position: "absolute", inset: 0 }}>
        <svg width={VIDEO.width} height={VIDEO.height} viewBox={viewBox} aria-hidden>
          <g>{edges}</g>
          <g>{laneBits}</g>
          <g>{nodeShapes}</g>
        </svg>
      </Boil>
      <svg width={VIDEO.width} height={VIDEO.height} viewBox={viewBox} style={{ position: "absolute", inset: 0 }} aria-hidden>
        <g>{nodeFaces}</g>
        <g>{labels}</g>
        <g>{pins}</g>
        {marker}
      </svg>
    </AbsoluteFill>
  );
};

/** A step or hub label in chart units, with a Warm Paper knock-out so lines never run through it. */
const MapLabel: React.FC<{ x: number; y: number; text: string; size: number; o: number; bold?: boolean; upper?: boolean; anchor?: "middle" | "start" }> = ({ x, y, text, size, o, bold = false, upper = false, anchor = "middle" }) => {
  if (o <= 0) return null;
  const lh = upper ? 30 : 21;
  return (
    <g opacity={o}>
      {text.split("\n").map((t, i) => (
        <text key={i} x={x} y={y + i * lh} textAnchor={anchor} fontFamily={FAMILY.sans} fontWeight={bold || upper ? 700 : 400} fontSize={size} letterSpacing={upper ? "0.08em" : undefined}
          fill={COLOR.ink} stroke={COLOR.warmPaper} strokeWidth={6} paintOrder="stroke">{t}</text>
      ))}
    </g>
  );
};
