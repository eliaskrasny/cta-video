import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import {
  COLORS,
  Cutout,
  EASE,
  FONT_FAMILY,
  InkFilter,
  PaperGround,
  PaperSheet,
  PenLine,
  PenUnderline,
  Pin,
  Stamp,
  Tape,
  lerp,
  popIn,
  ramp,
  useInter,
} from "../../collage";
import { H, W } from "../../collage/canvas";

/* -------------------------------------------------------------------------- */
/* Layout (world coordinates == the final 1280x720 frame, before camera)       */
/* -------------------------------------------------------------------------- */

const BUS_Y = 218;
const TITLE = { cx: 490, cy: 126, w: 275, h: 77 };
const PM = { cx: 762, cy: 128, w: 236, h: 62 };
const LABEL = { w: 220, h: 76, cy: 491 };

type Col = {
  key: string;
  label: string;
  x: number;
  img: string; // cut-out name
  imgLeft: number; // subject top-left, world px
  imgTop: number;
  imgRot: number;
  pin: { x: number; y: number };
  appear: number; // cut-out + pin
  drop: [number, number]; // drop line draw window
  labelAt: number;
  stamp?: { at: number; rot: number };
};

const COLS: Col[] = [
  { key: "comm", label: "Communications", x: 160, img: "microphone", imgLeft: 100, imgTop: 298, imgRot: -1, pin: { x: 160, y: 314 }, appear: 7.25, drop: [7.0, 7.25], labelAt: 7.25, stamp: { at: 12.15, rot: 1.5 } },
  { key: "events", label: "Events", x: 400, img: "clipboard", imgLeft: 346, imgTop: 318, imgRot: 0.6, pin: { x: 400, y: 302 }, appear: 6.75, drop: [6.5, 6.75], labelAt: 6.75, stamp: { at: 12.0, rot: -0.8 } },
  { key: "res", label: "Researchers", x: 640, img: "microscope", imgLeft: 548, imgTop: 262, imgRot: -1.5, pin: { x: 640, y: 314 }, appear: 1.25, drop: [1.0, 1.25], labelAt: 1.5 },
  { key: "pol", label: "Policymakers", x: 880, img: "gavel", imgLeft: 805, imgTop: 365, imgRot: 1.2, pin: { x: 880, y: 404 }, appear: 1.5, drop: [1.1, 1.5], labelAt: 1.75 },
  { key: "rec", label: "Recruiter", x: 1120, img: "megaphone", imgLeft: 1030, imgTop: 350, imgRot: 1.8, pin: { x: 1120, y: 392 }, appear: 7.0, drop: [6.75, 7.0], labelAt: 7.0, stamp: { at: 12.2, rot: -1 } },
];

/* -------------------------------------------------------------------------- */
/* Parts                                                                      */
/* -------------------------------------------------------------------------- */

const Shield: React.FC = () => (
  <svg width={26} height={28} viewBox="0 0 24 26" style={{ display: "block" }}>
    <path
      d="M12 1.2 L21.5 4.6 V11.2 C21.5 17 17.4 21.6 12 24.4 C6.6 21.6 2.5 17 2.5 11.2 V4.6 Z"
      fill={COLORS.paperRim}
    />
    <path
      d="M7.6 12.4 L10.7 15.6 L16.6 8.8"
      fill="none"
      stroke={COLORS.ink}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TitleTag: React.FC<{ t: number }> = ({ t }) => {
  const p = popIn(t, 0.5);
  if (!p.visible) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: TITLE.cx - TITLE.w / 2,
        top: TITLE.cy - TITLE.h / 2,
        width: TITLE.w,
        height: TITLE.h,
        scale: p.scale,
        rotate: `${-1.2 + p.rot}deg`,
      }}
    >
      <PaperSheet id="title" width={TITLE.w} height={TITLE.h} preset="black" style={{ left: 0, top: 0 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: COLORS.paper,
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 29,
            letterSpacing: "-0.02em",
          }}
        >
          <Shield />
          <span>AI Safety Inc</span>
        </div>
      </PaperSheet>
      <Tape id="title" left={TITLE.w * 0.55} top={-13} width={72} height={22} rotate={0.8} />
    </div>
  );
};

type NoteProps = {
  id: string;
  t: number;
  text: string;
  cx: number;
  cy: number;
  w?: number;
  h?: number;
  appearAt: number;
  underlineAt: number;
  fontSize?: number;
  baseRot?: number;
  exit?: [number, number];
  hideAt?: number;
};

const Note: React.FC<NoteProps> = ({
  id,
  t,
  text,
  cx,
  cy,
  w = LABEL.w,
  h = LABEL.h,
  appearAt,
  underlineAt,
  fontSize = 24,
  baseRot = 0,
  exit,
  hideAt,
}) => {
  const p = popIn(t, appearAt);
  const exitK = exit ? ramp(t, exit[0], exit[1], EASE.pop) : 0;
  if (!p.visible || (hideAt !== undefined && t >= hideAt) || exitK >= 1) {
    return null;
  }
  const u = ramp(t, underlineAt, underlineAt + 0.33, EASE.draw);
  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        scale: p.scale * (1 - exitK),
        rotate: `${baseRot + p.rot}deg`,
      }}
    >
      <PaperSheet id={`note-${id}`} width={w} height={h} preset="note" style={{ left: 0, top: 0 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 6,
            color: COLORS.ink,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
        <PenUnderline
          id={`ul-${id}`}
          seed={id.length * 7 + 3}
          progress={u}
          color={COLORS.strand}
          width={58}
          style={{ left: (w - 58) / 2, top: h / 2 + fontSize * 0.55 }}
        />
      </PaperSheet>
      <Tape id={id} left={w / 2 - 34} top={-9} width={68} height={18} rotate={-1} />
    </div>
  );
};

const ColCutout: React.FC<{ col: Col; t: number }> = ({ col, t }) => {
  const p = popIn(t, col.appear);
  if (!p.visible) {
    return null;
  }
  return (
    <Cutout name={col.img} left={col.imgLeft} top={col.imgTop} rotate={col.imgRot + p.rot} scale={p.scale} />
  );
};

const ColPin: React.FC<{ col: Col; t: number }> = ({ col, t }) => {
  const p = popIn(t + 0.05, col.appear, 0.25, 0);
  if (!p.visible) {
    return null;
  }
  return <Pin x={col.pin.x} y={col.pin.y} scale={p.scale} />;
};

/* -------------------------------------------------------------------------- */
/* Banner + stamps                                                            */
/* -------------------------------------------------------------------------- */

const COUNT_STEPS = [19, 54, 89, 124, 140];

const Banner: React.FC<{ t: number }> = ({ t }) => {
  if (t < 10.0) {
    return null;
  }
  const width = interpolate(t, [10.0, 10.25, 10.5, 10.75, 11.0], [160, 421, 915, 1160, 1208], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const step = Math.min(4, Math.floor((t - 10.25) / 0.25));
  const count = t >= 10.25 ? COUNT_STEPS[step] : null;
  const color = interpolateColors(t, [11.6, 11.8, 12.0], [COLORS.strand, "#85502F", COLORS.bark]);
  return (
    <PaperSheet
      id="banner"
      width={width}
      height={72}
      preset="colour"
      background={color}
      textures={[
        { name: "halftone-grunge", blend: "soft-light", opacity: 0.55, size: 1300 },
        { name: "paper-crumple", blend: "soft-light", opacity: 0.3, size: 1500 },
        { name: "ground-flecks", blend: "soft-light", opacity: 0.4, size: 1500 },
      ]}
      rotate={-0.3}
      style={{ left: 36, top: 564 }}
    >
      <div
        style={{
          width,
          height: 72,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 16,
          paddingLeft: 24,
          whiteSpace: "nowrap",
          color: COLORS.paperRim,
          fontFamily: FONT_FAMILY,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 30, letterSpacing: "-0.01em" }}>New Employees</span>
        {count !== null ? (
          <span style={{ fontWeight: 400, fontSize: 21, opacity: 0.92, paddingTop: 2 }}>
            {`+${count} researchers & policymakers`}
          </span>
        ) : null}
      </div>
    </PaperSheet>
  );
};

const HiringStamp: React.FC<{
  id: string;
  t: number;
  at: number;
  cx: number;
  cy: number;
  role: string;
  rot: number;
}> = ({ id, t, at, cx, cy, role, rot }) => {
  if (t < at) {
    return null;
  }
  const k = ramp(t, at, at + 0.25, EASE.slam);
  return (
    <Stamp
      id={id}
      cx={cx}
      cy={cy}
      title="Now hiring"
      subtitle={role}
      rotate={rot + (1 - k) * 6}
      scale={lerp(1.7, 1, k)}
    />
  );
};

/* -------------------------------------------------------------------------- */
/* Connectors                                                                 */
/* -------------------------------------------------------------------------- */

const Connectors: React.FC<{ t: number }> = ({ t }) => {
  const d = (from: number, to: number) => ramp(t, from, to, EASE.draw);
  const dots: Array<[number, number, number]> = [
    [TITLE.cx + TITLE.w / 2, TITLE.cy, 0.7],
    [760, TITLE.cy, 0.8],
    [760, BUS_Y, 0.95],
  ];
  const c = COLORS.line;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} aria-hidden>
      <InkFilter
        id="connector-ink"
        seed={7}
        wobble={0}
        coverage={0.96}
        grainFreq={0.7}
        region={{ x: -60, y: -60, width: W + 120, height: H + 120 }}
      />
      <g filter="url(#connector-ink)">
        <PenLine d={`M${TITLE.cx + TITLE.w / 2} ${TITLE.cy} L760 ${TITLE.cy} L760 ${BUS_Y}`} progress={d(0.7, 0.95)} color={c} />
        <PenLine d={`M760 ${BUS_Y} L640 ${BUS_Y}`} progress={d(0.95, 1.15)} color={c} />
        <PenLine d={`M760 ${BUS_Y} L880 ${BUS_Y}`} progress={d(0.95, 1.15)} color={c} />
        <PenLine d={`M640 ${BUS_Y} L160 ${BUS_Y}`} progress={d(6.5, 6.8)} color={c} />
        <PenLine d={`M880 ${BUS_Y} L1120 ${BUS_Y}`} progress={d(6.5, 6.8)} color={c} />
        {COLS.map((col) => (
          <PenLine key={col.key} d={`M${col.x} ${BUS_Y} L${col.x} ${col.pin.y}`} progress={d(col.drop[0], col.drop[1])} color={c} />
        ))}
        {[640, 880].map((x) => (
          <PenLine key={x} d={`M${x} 528 L${x} 568`} progress={d(10.0, 10.25)} color={c} />
        ))}
        {dots.map(([x, y, at]) =>
          t >= at ? <circle key={`${x}-${y}`} cx={x} cy={y} r={4.6} fill={c} /> : null,
        )}
      </g>
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/* Scene                                                                      */
/* -------------------------------------------------------------------------- */

export const OrgChart: React.FC = () => {
  useInter();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Camera: zoomed on two groups -> pull back for the full org -> nudge up for the banner.
  const kA = ramp(t, 6.0, 6.5, EASE.move);
  const kS = ramp(t, 10.0, 10.5, EASE.move);
  const cam = {
    z: lerp(1.4, 1, kA),
    x: lerp(-309, 0, kA),
    y: lerp(-79.4, 43, kA) - 43 * kS,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, overflow: "hidden" }}>
      <PaperGround camera={cam} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          transformOrigin: "0 0",
          translate: `${cam.x}px ${cam.y}px`,
          scale: cam.z,
        }}
      >
        <Connectors t={t} />
        {COLS.map((c) => (
          <ColCutout key={c.key} col={c} t={t} />
        ))}
        {COLS.map((c) => (
          <ColPin key={c.key} col={c} t={t} />
        ))}
        {COLS.map((c) => (
          <Note
            key={c.key}
            id={c.key}
            t={t}
            text={c.label}
            cx={c.x}
            cy={LABEL.cy}
            appearAt={c.labelAt}
            underlineAt={c.labelAt + 0.3}
            baseRot={c.key === "res" ? -0.8 : c.key === "pol" ? 0.6 : 0.3}
            hideAt={c.stamp ? c.stamp.at + 0.05 : undefined}
          />
        ))}
        <TitleTag t={t} />
        <Note
          id="pm"
          t={t}
          text="Project Manager"
          cx={PM.cx}
          cy={PM.cy}
          w={PM.w}
          h={PM.h}
          fontSize={22}
          appearAt={6.5}
          underlineAt={6.85}
          baseRot={0.8}
          exit={[11.6, 11.85]}
        />
        <Banner t={t} />
        <HiringStamp id="pm" t={t} at={11.9} cx={761} cy={127} role="Project Manager" rot={1.2} />
        {COLS.filter((c) => c.stamp).map((c) => (
          <HiringStamp key={c.key} id={c.key} t={t} at={c.stamp!.at} cx={c.x} cy={490} role={c.label} rot={c.stamp!.rot} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
