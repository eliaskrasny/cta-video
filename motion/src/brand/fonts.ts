// The only place fonts are loaded. Files are bundled in public/fonts so a Mac, a PC and a cloud renderer all draw the same letters.
// If the team licenses Helvetica Neue and Baskerville, swap the files here and nothing else changes.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FAMILY = { sans: "AISSS Sans", serif: "AISSS Serif" } as const;

const FACES = [
  { family: FAMILY.sans, file: "fonts/texgyreheros-regular.otf", weight: "400", style: "normal" },
  { family: FAMILY.sans, file: "fonts/texgyreheros-bold.otf", weight: "700", style: "normal" },
  { family: FAMILY.serif, file: "fonts/libre-baskerville-400.woff2", weight: "400", style: "normal" },
  { family: FAMILY.serif, file: "fonts/libre-baskerville-700.woff2", weight: "700", style: "normal" },
  { family: FAMILY.serif, file: "fonts/libre-baskerville-400-italic.woff2", weight: "400", style: "italic" },
];
// No sans italic is loaded on purpose: Helvetica is never italic. [PDF p.10]

export const fontsReady = Promise.all(FACES.map((f) => loadFont({ family: f.family, url: staticFile(f.file), weight: f.weight, style: f.style })));
