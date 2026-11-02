// THE map. Every map in the video is this component with different props, so they all match.
// Land is Wool with a flat Wheat shadow, borders are Warm Paper gaps (cut pieces), highlights use one signal colour.
// The camera moves between named views; strokes, labels and pins never scale with the zoom.
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { COLOR, DUR, SPACE, STROKE, TYPE, VIDEO, type SignalName } from "../brand/tokens";
import { Boil } from "../paper/Boil";
import { Text } from "../type/Text";
import { ease, progress } from "../motion/ease";
import { useEnter } from "../motion/enter";
import { BORDERS_D, COUNTRIES, LAND_D, MAP_CENTRE, STATES_D, assertCountry, project } from "./geo";
import { PLACES, type PlaceId } from "./places";

/** Named camera views. Shots pick from these; add a view here if a story needs a new one. zoom is relative to the world view. */
export const MAP_VIEWS = {
  world: { centre: [10, 18], zoom: 1 },
  atlantic: { centre: [-36, 45], zoom: 2.1 }, // Washington, London and Brussels in one frame
  northAmerica: { centre: [-98, 44], zoom: 2.2 },
  usa: { centre: [-97, 38.5], zoom: 3.3 },
  california: { centre: [-120, 37.5], zoom: 9 },
  europe: { centre: [8, 49.5], zoom: 6 },
  ukBenelux: { centre: [1.5, 51.6], zoom: 10 },
  eastAsia: { centre: [120, 33], zoom: 2.6 },
} as const satisfies Record<string, { centre: readonly [number, number]; zoom: number }>;
export type MapView = keyof typeof MAP_VIEWS;

export type MapPin = { place: PlaceId; at: number; accent?: boolean; side?: "right" | "left" };
export type MapHighlight = { country: string; at: number };
export type MapRegionLabel = { country: string; at: number; text?: string };

export type MasterMapProps = {
  /** Camera: the first entry is where the map starts; each later entry moves there over DUR.mapMove from its `at`. */
  camera?: { at: number; view: MapView }[];
  highlight?: MapHighlight[];
  /** One signal colour per map. */
  signal?: SignalName;
  pins?: MapPin[];
  regionLabels?: MapRegionLabel[];
  /** Show US state lines (fades in with the first camera move or at `statesAt`). */
  statesAt?: number;
};

const viewPx = (v: MapView): { x: number; y: number; zoom: number } => {
  const [x, y] = project(MAP_VIEWS[v].centre);
  return { x, y, zoom: MAP_VIEWS[v].zoom };
};

const useCameraState = (camera: { at: number; view: MapView }[]) => {
  const frame = useCurrentFrame();
  let cur = viewPx(camera[0].view);
  for (let i = 1; i < camera.length; i++) {
    const next = viewPx(camera[i].view);
    const p = progress(frame, camera[i].at, DUR.mapMove, "move");
    if (p <= 0) break;
    // zoom eases in log space so a big zoom feels even all the way through
    cur = { x: cur.x + (next.x - cur.x) * p, y: cur.y + (next.y - cur.y) * p, zoom: Math.exp(Math.log(cur.zoom) + (Math.log(next.zoom) - Math.log(cur.zoom)) * p) };
  }
  return cur;
};

export const MasterMap: React.FC<MasterMapProps> = ({ camera = [{ at: 0, view: "world" }], highlight = [], signal = "indigo", pins = [], regionLabels = [], statesAt }) => {
  const frame = useCurrentFrame();
  highlight.forEach((h) => assertCountry(h.country));
  regionLabels.forEach((r) => assertCountry(r.country));
  const cam = useCameraState(camera);
  const k = cam.zoom;
  const toScreen = ([x, y]: [number, number]) => ({ x: (x - cam.x) * k + MAP_CENTRE.x, y: (y - cam.y) * k + MAP_CENTRE.y });
  const hl = new Map(highlight.map((h) => [h.country, h.at]));
  const statesO = statesAt === undefined ? 0 : interpolate(frame, [statesAt, statesAt + DUR.panelIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.enter });
  return (
    <AbsoluteFill>
      <Boil strength="map" seed={91} style={{ position: "absolute", inset: 0 }}>
        <svg width={VIDEO.width} height={VIDEO.height} aria-hidden>
          <g transform={`translate(${MAP_CENTRE.x} ${MAP_CENTRE.y}) scale(${k}) translate(${-cam.x} ${-cam.y})`}>
            <path d={LAND_D} fill={COLOR.wheat} transform={`translate(${STROKE.mapShadow / k} ${STROKE.mapShadow / k})`} />
            {COUNTRIES.map((c) => {
              const at = hl.get(c.name);
              const fill = at === undefined ? COLOR.wool : interpolateColors(progress(frame, at, DUR.panelIn, "enter"), [0, 1], [COLOR.wool, COLOR[signal]]);
              return <path key={c.name} d={c.d} fill={fill} />;
            })}
            <path d={BORDERS_D} fill="none" stroke={COLOR.warmPaper} strokeWidth={STROKE.mapBorder} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            {statesO > 0 && <path d={STATES_D} fill="none" stroke={COLOR.warmPaper} strokeWidth={STROKE.mapState} vectorEffect="non-scaling-stroke" opacity={statesO} />}
          </g>
        </svg>
      </Boil>
      {regionLabels.map((r) => {
        const c = COUNTRIES.find((x) => x.name === r.country)!;
        const s = toScreen(c.centroid);
        const onSignal = hl.has(r.country);
        const text = r.text ?? r.country;
        // Paper type on a highlighted country must fit inside it; Bark type on plain land may spill onto the ground.
        const est = text.length * TYPE.mapRegion.size * (0.62 + TYPE.mapRegion.tracking);
        if (onSignal && est > c.width * k * 0.9) throw new Error(`[AISSS map] "${text}" is too wide for ${r.country} at this zoom. Zoom in, shorten it, or use a pin or callout.`);
        return (
          <Text key={r.country} role="mapRegion" tone={onSignal ? "text" : "quiet"} enter="fade" at={r.at}
            style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%, -50%)", color: onSignal ? COLOR.paper : undefined }}>
            {text}
          </Text>
        );
      })}
      {pins.map((p) => (
        <Pin key={p.place} {...p} pos={toScreen(project(PLACES[p.place].lonLat))} />
      ))}
    </AbsoluteFill>
  );
};

const PIN_R = 11, RING = 4; // [EST]

const Pin: React.FC<MapPin & { pos: { x: number; y: number } }> = ({ place, at, accent = false, side = "right", pos }) => {
  const dot = useEnter({ at, kind: "pop" });
  const label = useEnter({ at: at + 4, kind: "fade" });
  const plateH = TYPE.mapCity.size * TYPE.mapCity.lineHeight + SPACE.xs * 2;
  return (
    <>
      <div style={{ position: "absolute", left: pos.x - PIN_R - RING, top: pos.y - PIN_R - RING, ...dot }}>
        <div style={{ width: (PIN_R + RING) * 2, height: (PIN_R + RING) * 2, borderRadius: "50%", backgroundColor: COLOR.warmPaper, display: "grid", placeItems: "center" }}>
          <div style={{ width: PIN_R * 2, height: PIN_R * 2, borderRadius: "50%", backgroundColor: accent ? COLOR.strand : COLOR.ink }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: pos.y - plateH / 2, ...(side === "right" ? { left: pos.x + PIN_R + RING + SPACE.xs } : { right: VIDEO.width - pos.x + PIN_R + RING + SPACE.xs }), ...label }}>
        <div style={{ backgroundColor: COLOR.warmPaper, padding: `${SPACE.xs}px ${SPACE.s - 4}px` }}>
          <Text role="mapCity" enter="cut" at={at}>{PLACES[place].name}</Text>
        </div>
      </div>
    </>
  );
};
