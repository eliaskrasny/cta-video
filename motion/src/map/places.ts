// Every place a pin can go. One spelling, one coordinate, for the whole video. Add places here, never in a shot.
export const PLACES = {
  washingtonDC: { name: "Washington, DC", lonLat: [-77.04, 38.91] },
  newYork: { name: "New York", lonLat: [-74.01, 40.71] },
  boston: { name: "Boston", lonLat: [-71.06, 42.36] },
  sacramento: { name: "Sacramento", lonLat: [-121.49, 38.58] },
  sanFrancisco: { name: "San Francisco", lonLat: [-122.42, 37.77] },
  berkeley: { name: "Berkeley", lonLat: [-122.27, 37.87] },
  ottawa: { name: "Ottawa", lonLat: [-75.7, 45.42] },
  london: { name: "London", lonLat: [-0.13, 51.51] },
  oxford: { name: "Oxford", lonLat: [-1.26, 51.75] },
  cambridgeUK: { name: "Cambridge", lonLat: [0.12, 52.2] },
  brussels: { name: "Brussels", lonLat: [4.35, 50.85] },
  paris: { name: "Paris", lonLat: [2.35, 48.86] },
  berlin: { name: "Berlin", lonLat: [13.4, 52.52] },
  geneva: { name: "Geneva", lonLat: [6.14, 46.2] },
  beijing: { name: "Beijing", lonLat: [116.4, 39.9] },
  seoul: { name: "Seoul", lonLat: [126.98, 37.57] },
  tokyo: { name: "Tokyo", lonLat: [139.69, 35.69] },
  singapore: { name: "Singapore", lonLat: [103.82, 1.35] },
  newDelhi: { name: "New Delhi", lonLat: [77.21, 28.61] },
} as const satisfies Record<string, { name: string; lonLat: readonly [number, number] }>;
export type PlaceId = keyof typeof PLACES;
