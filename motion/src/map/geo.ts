// The master map's geometry, computed once. One dataset, one projection, one fit, for every map in the video.
// Data: Natural Earth 1:50m countries (world-atlas 2.0.2) and US Census states (us-atlas 3.0.1), both public domain.
// Projection: Equal Earth, which keeps areas honest. Antarctica is left out so the inhabited world fills the frame.
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import worldJson from "world-atlas/countries-50m.json";
import usJson from "us-atlas/states-10m.json";
import { SAFE, VIDEO } from "../brand/tokens";

type Props = { name: string };
const world = worldJson as unknown as Topology<{ countries: GeometryCollection<Props> }>;
const us = usJson as unknown as Topology<{ states: GeometryCollection<Props> }>;

const all = feature(world, world.objects.countries).features as Feature<Geometry, Props>[];
const kept = all.filter((f) => f.properties.name !== "Antarctica");

export const projection = geoEqualEarth().fitExtent(
  [
    [SAFE.left, SAFE.top],
    [VIDEO.width - SAFE.right, VIDEO.height - SAFE.bottom],
  ],
  { type: "FeatureCollection", features: kept },
);
const path = geoPath(projection);

/** Label point: the centre of the country's biggest piece, so Alaska or an overseas territory doesn't drag the label off the mainland. */
const mainland = (f: Feature<Geometry, Props>) => {
  if (f.geometry.type !== "MultiPolygon") return f;
  const parts = f.geometry.coordinates.map((coordinates) => ({ type: "Polygon" as const, coordinates }));
  return parts.reduce((a, b) => (path.area(b) > path.area(a) ? b : a));
};
export const COUNTRIES = kept.map((f) => {
  const m = mainland(f), [[x0], [x1]] = path.bounds(m);
  return { name: f.properties.name, d: path(f) ?? "", centroid: path.centroid(m) as [number, number], width: x1 - x0 };
});
export type CountryName = string;
export const COUNTRY_NAMES = new Set(COUNTRIES.map((c) => c.name));

/** Every country in one path, for the flat shadow under the land. */
export const LAND_D = COUNTRIES.map((c) => c.d).join("");
/** Lines between countries only (no coastlines), drawn as gaps in Warm Paper. */
export const BORDERS_D = path(mesh(world, world.objects.countries, (a, b) => a !== b)) ?? "";
/** Lines between US states. Shown only when a shot asks for them. */
export const STATES_D = path(mesh(us, us.objects.states, (a, b) => a !== b)) ?? "";

/** Where the world view centres: the middle of the safe area. */
export const MAP_CENTRE = { x: (SAFE.left + VIDEO.width - SAFE.right) / 2, y: (SAFE.top + VIDEO.height - SAFE.bottom) / 2 };

export const project = (lonLat: readonly [number, number]) => projection([lonLat[0], lonLat[1]]) as [number, number];

export const assertCountry = (name: string) => {
  if (!COUNTRY_NAMES.has(name)) {
    const close = [...COUNTRY_NAMES].filter((n) => n.toLowerCase().includes(name.toLowerCase().slice(0, 4))).slice(0, 5);
    throw new Error(`[AISSS map] no country called "${name}". Names follow Natural Earth${close.length ? `; did you mean: ${close.join(", ")}?` : "."}`);
  }
};
