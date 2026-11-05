/*
 * AISSS motion tokens: the single source of truth.
 * Every colour, size, duration, easing and wobble value used in a shot comes from this file.
 * Shots never type a hex code, a font size or an easing curve themselves (scripts/check-style.mjs enforces it).
 *
 * Provenance tags used below:
 *   [PDF p.N]  taken from branding/AISSS-Visual-Identity.pdf
 *   [EST]      our estimate for video; replace with a measured value once a reference clip has been measured
 *   [DECIDED]  a team decision, not in the brand PDF
 */

/* ---------- canvas ---------- */
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 24, // [DECIDED] animation standard; boil "on 3s" = 8 drawings a second
} as const;

/* ---------- colour ---------- */
export const COLOR = {
  // Primary [PDF p.6]
  ink: "#111111",
  paper: "#FFFFFF",
  strand: "#C64D0A",
  // Neutrals [PDF p.7]
  ink2: "#262626",
  muted: "#595959",
  line2: "#858585", // never text on a light ground
  line: "#D4D4D4",
  paper3: "#EBEBEB",
  paper2: "#F5F5F5",
  // Extended: grounds and panels for video [PDF p.8]
  warmPaper: "#F4EFE6", // THE video ground. Never in the same frame as Paper.
  wool: "#E3D5C3", // panels, lower thirds, map land
  wheat: "#CDBBA4", // second panel, chart bands, flat shadows. Never text.
  bark: "#5C534C", // captions and sources on warm grounds
  // Strand family [PDF p.8]
  clay: "#8C3410", // small orange labels and icons
  live: "#FF8A3D", // large fills only, Ink type on top
  ember: "#F57828", // hover state on the website; not used in video
  // Signals: diagrams only, one per figure, plus Ink [PDF p.8]
  indigo: "#1B3A4B",
  moss: "#1E5C44",
  saffron: "#E2A100", // a tick or a short underline only
} as const;
export type ColorName = keyof typeof COLOR;

/** The two grounds a frame can sit on. Warm Paper is the default; Ink is for title, section and end cards. [PDF p.8, p.13] */
export const GROUND = {
  warm: { bg: COLOR.warmPaper, text: COLOR.ink, quiet: COLOR.bark, rule: COLOR.ink },
  ink: { bg: COLOR.ink, text: COLOR.paper, quiet: COLOR.line, rule: COLOR.paper }, // quiet = Line on Ink [EST]
} as const;
export type GroundName = keyof typeof GROUND;

/** Fills a paper cutout can have, and the type colours that pass contrast on each. [PDF p.9 pairs] */
export const SURFACE = {
  warmPaper: { fill: COLOR.warmPaper, text: COLOR.ink, quiet: COLOR.bark },
  wool: { fill: COLOR.wool, text: COLOR.ink, quiet: COLOR.bark },
  wheat: { fill: COLOR.wheat, text: COLOR.ink, quiet: COLOR.ink }, // Bark on Wheat is too weak; quiet text stays Ink [EST]
  ink: { fill: COLOR.ink, text: COLOR.paper, quiet: COLOR.line },
  live: { fill: COLOR.live, text: COLOR.ink, quiet: COLOR.ink }, // counts as the frame's one Strand-family item
  indigo: { fill: COLOR.indigo, text: COLOR.paper, quiet: COLOR.paper },
  moss: { fill: COLOR.moss, text: COLOR.paper, quiet: COLOR.paper },
} as const;
export type SurfaceName = keyof typeof SURFACE;

/** Signal colours allowed in one figure. Pick ONE per figure. [PDF p.8] */
export const SIGNALS = ["indigo", "moss"] as const;
export type SignalName = (typeof SIGNALS)[number];

/* ---------- type ---------- */
// Font files are bundled in public/fonts so every machine renders the same letters (see brand/fonts.ts).
// Sans = Inter (the brand text face). Serif = Libre Baskerville (the brand's Baskerville stand-in). [PDF p.10]
export type TypeSpec = {
  family: "sans" | "serif";
  weight: 400 | 700;
  italic: boolean;
  size: number; // px at 1920x1080
  lineHeight: number; // multiple of size
  tracking: number; // em
  upper: boolean; // small-caps labels are set as tracked capitals [DECIDED: synthetic small caps render inconsistently]
  maxChars: number; // longest line allowed, characters. Text throws an error if a line is longer.
  maxLines: number;
};

export const TYPE = {
  /** Small-caps label: kickers, chapter numbers, axis names. Inter Bold, tracked. [PDF p.11] sizes [EST] */
  label: { family: "sans", weight: 700, italic: false, size: 28, lineHeight: 1.2, tracking: 0.14, upper: true, maxChars: 40, maxLines: 1 },
  /** Title-card title. Baskerville Bold. [PDF p.11] */
  display: { family: "serif", weight: 700, italic: false, size: 112, lineHeight: 1.05, tracking: -0.01, upper: false, maxChars: 24, maxLines: 3 },
  /** Heading 1: section-card titles, full-frame statements. */
  h1: { family: "serif", weight: 700, italic: false, size: 88, lineHeight: 1.08, tracking: -0.01, upper: false, maxChars: 28, maxLines: 3 },
  /** Heading 2: panel and chart titles, lower-third names. */
  h2: { family: "serif", weight: 700, italic: false, size: 60, lineHeight: 1.12, tracking: 0, upper: false, maxChars: 34, maxLines: 2 },
  /** Heading 3: Baskerville Regular. Sub-heads, stat labels. */
  h3: { family: "serif", weight: 400, italic: false, size: 46, lineHeight: 1.2, tracking: 0, upper: false, maxChars: 40, maxLines: 2 },
  /** Body: Inter Regular. On-screen sentences. Shorter lines than print: 42 chars, not 60 to 75 [DECIDED for video]. */
  body: { family: "sans", weight: 400, italic: false, size: 40, lineHeight: 1.3, tracking: 0, upper: false, maxChars: 42, maxLines: 3 },
  /** Small: Inter Regular. Text inside documents, timeline events, chart notes. Never the main message. */
  small: { family: "sans", weight: 400, italic: false, size: 30, lineHeight: 1.3, tracking: 0, upper: false, maxChars: 48, maxLines: 4 },
  /** Quote: Baskerville Italic, the only italic in the system. [PDF p.10] */
  quote: { family: "serif", weight: 400, italic: true, size: 56, lineHeight: 1.25, tracking: 0, upper: false, maxChars: 34, maxLines: 4 },
  /** Caption: Baskerville Regular, Bark on warm grounds. Under photos and charts. [PDF p.11] */
  caption: { family: "serif", weight: 400, italic: false, size: 32, lineHeight: 1.3, tracking: 0, upper: false, maxChars: 56, maxLines: 2 },
  /** Stat: the big number in a stat reveal. Baskerville Bold. */
  stat: { family: "serif", weight: 700, italic: false, size: 240, lineHeight: 1, tracking: -0.02, upper: false, maxChars: 8, maxLines: 1 },
  /** Source citation: Inter Regular, Bark, bottom-left of the frame. Smallest text allowed. */
  source: { family: "sans", weight: 400, italic: false, size: 24, lineHeight: 1.3, tracking: 0, upper: false, maxChars: 90, maxLines: 2 },
  /** Map city names. Inter Regular on a Warm Paper plate. */
  mapCity: { family: "sans", weight: 400, italic: false, size: 28, lineHeight: 1.1, tracking: 0, upper: false, maxChars: 24, maxLines: 1 },
  /** Map country / region names. Inter Bold tracked capitals, Bark. */
  mapRegion: { family: "sans", weight: 700, italic: false, size: 24, lineHeight: 1.1, tracking: 0.16, upper: true, maxChars: 24, maxLines: 2 },
  /** Numbers on charts and timelines. Inter Bold. */
  figure: { family: "sans", weight: 700, italic: false, size: 34, lineHeight: 1.1, tracking: 0, upper: false, maxChars: 12, maxLines: 1 },
} as const satisfies Record<string, TypeSpec>;
export type TypeRole = keyof typeof TYPE;

/** On-screen reading time: 1 s to notice + 3 words a second, never under 2 s. [EST, matches common subtitle guidance] */
export const READING = { wordsPerSecond: 3, noticeSeconds: 1, minSeconds: 2 } as const;
export const readFrames = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const s = Math.max(READING.minSeconds, READING.noticeSeconds + words / READING.wordsPerSecond);
  return Math.ceil(s * VIDEO.fps);
};

/* ---------- layout ---------- */
/** 8 px base unit. Every gap is one of these. [EST] */
export const SPACE = { xs: 8, s: 16, m: 24, l: 32, xl: 48, xxl: 64, xxxl: 96 } as const;

/** Safe area. Nothing that must be read sits outside it. Bottom is deeper for YouTube's player controls. [EST] */
export const SAFE = { left: 120, right: 120, top: 96, bottom: 120 } as const;
/** Sources sit below the safe area, inside action-safe, so they never fight the main content. */
export const SOURCE_POS = { left: SAFE.left, bottom: 56 } as const;

/** 12-column grid inside the safe area: 12 x 118 px columns, 24 px gutters = 1680 px. */
export const GRID = { columns: 12, column: 118, gutter: 24 } as const;
/** x of the left edge of column n (0-based). */
export const colX = (n: number) => SAFE.left + n * (GRID.column + GRID.gutter);
/** Width of k columns including the gutters between them. */
export const span = (k: number) => k * GRID.column + (k - 1) * GRID.gutter;

/* ---------- paper look ---------- */
/** Scissors-cut edges: corners stay square, edges sit slightly off-true. [EST] */
export const CUT = { jitter: 1.6, step: 140 } as const;

/** Flat offset "shadow": the same cut shape, solid colour, no blur, always down-right. [DECIDED: brand-strict paper] */
export const ELEVATION = { 0: 0, 1: 6, 2: 12 } as const;
export type Elevation = keyof typeof ELEVATION;
export const SHADOW_FILL = { default: COLOR.wheat, onWheat: COLOR.bark } as const;

/** Boil: the shared wobble. Shapes redraw every `hold` frames, cycling through `drawings` versions. [EST until measured] */
export const BOIL = {
  hold: 3, // on 3s at 24 fps = 8 drawings a second
  drawings: 3, // cycles A, B, C, A, B, C ...
  frequency: 0.012, // feTurbulence baseFrequency: low = long gentle waves, high = frayed edges
  octaves: 1,
  amount: { panel: 3, line: 2.2, icon: 1.6, map: 1.4 }, // displacement in px
} as const;
export type BoilStrength = keyof typeof BOIL.amount;

/** Ground texture: static, flat-toned, never moves. [EST] */
export const GRAIN = {
  speckle: { frequency: 0.9, octaves: 3, opacity: 0.09, seed: 7 },
  mottle: { frequency: 0.004, octaves: 2, opacity: 0.018, seed: 3 },
} as const;

/** Line weights in px at 1080p. Strokes never scale with zoom. [EST; loop and rule from PDF p.12 scaled to 1080p] */
export const STROKE = {
  loop: 3, // the Strand loop
  rule: 6, // Strand underline rule (PDF: 1.5 to 2 pt, about word length)
  connector: 6, // arrows and leader lines
  axis: 4, // chart baselines, timeline rules
  icon: 4, // line icons at any size
  mapBorder: 1.5, // gaps between countries
  mapState: 1,
  mapShadow: 4, // map land offset
} as const;

/* ---------- motion ---------- */
/** Durations in frames at 24 fps. [EST] */
export const DUR = {
  panelIn: 12, // 0.5 s
  textIn: 10,
  smallIn: 8, // pins, icons, ticks
  out: 8, // exits are faster than entrances
  stagger: 3, // between items in a group (one boil step)
  lineStagger: 4, // between lines of one text block
  draw: 18, // arrows, connectors, rules drawing on
  highlight: 12, // highlighter swipe
  count: 30, // stat number counting up
  barGrow: 18,
  loopDraw: 36, // Strand loop drawing on
  logoIn: 8,
  push: 14, // paper-push transition between scenes
  cameraMin: 36, // slowest a camera may move is unlimited; fastest is this
  mapMove: 48, // map camera between two views
  holdMin: 48, // nothing important is on screen for less than 2 s
} as const;

/** Cubic-bezier control points. Use through motion/ease.ts, never Easing.* directly. [EST] */
export const EASE = {
  enter: [0.22, 1, 0.36, 1], // fast out of the gate, settles gently (ease-out quint)
  exit: [0.55, 0, 0.75, 0.06], // leaves with intent (ease-in)
  move: [0.65, 0, 0.35, 1], // things already on screen moving, and the camera (ease-in-out)
  linear: [0, 0, 1, 1], // counting numbers only
} as const;
/** Overshoot for "pop" entrances (pins, icons, ticks only). 1.2 = small. [EST] */
export const POP_OVERSHOOT = 1.2;

/** Distances for entrances. [EST] */
export const MOVE = { rise: 24, drop: 16, dropScale: 1.06, slideX: 2100, slideY: 1200 } as const;

/** Camera limits. Text is never scaled past maxScaleWithText; only the map zooms further. [EST] */
export const CAMERA = { maxScaleWithText: 1.08 } as const;

/** Photo cutouts may tilt a little. Nothing else rotates. [EST] */
export const TILT = { max: 2 } as const;

/* ---------- logo ---------- */
/** Logo lockup viewBox is 120.053 x 36; the mark is the full 36 high. Clear space = mark height. Minimums from [PDF p.4]. */
export const LOGO = { aspect: 120.053 / 36, minLockupWidth: 128, minMarkSize: 28 } as const;

/* ---------- helpers ---------- */
export const hexToRgb01 = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
