// Renders a reference still of every template and do/don't board into out/stills/, plus any ids passed as arguments.
//   npm run stills                    all templates and do/don'ts
//   npm run stills -- S04-02-policy-map:120   one composition at frame 120
//   npm run textures                  re-bake the paper grain textures
//   npm run docs:stills               refresh the pictures in docs/stills after a rule change
// Set AISSS_BROWSER to a Chrome path if Remotion's own browser won't start.
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "out", "stills");
fs.mkdirSync(out, { recursive: true });
const browserExecutable = process.env.AISSS_BROWSER || null;

const serveUrl = await bundle({ entryPoint: path.join(root, "src", "index.ts") });
const comps = await getCompositions(serveUrl, { browserExecutable });

// --textures bakes the static grain into public/textures (transparent PNGs). Run it after changing GRAIN in tokens.ts.
if (process.argv.includes("--textures")) {
  for (const [id, name] of [["X-GrainWarm", "grain-warm.png"], ["X-GrainInk", "grain-ink.png"]]) {
    const comp = comps.find((c) => c.id === id);
    await renderStill({ composition: comp, serveUrl, output: path.join(root, "public", "textures", name), frame: 0, imageFormat: "png", browserExecutable });
    console.log(`${id} -> public/textures/${name}`);
  }
  process.exit(0);
}
// --docs refreshes the pictures in docs/stills (1280 px JPGs of every template and do/don't). Run it after any rule change.
if (process.argv.includes("--docs")) {
  const docs = path.join(root, "docs", "stills");
  fs.mkdirSync(docs, { recursive: true });
  for (const comp of comps.filter((c) => /^(T|DD)\d/.test(c.id))) {
    const frame = comp.props.stillFrame ?? Math.floor(comp.durationInFrames / 2);
    await renderStill({ composition: comp, serveUrl, output: path.join(docs, `${comp.id}.jpg`), frame, imageFormat: "jpeg", jpegQuality: 85, scale: 2 / 3, browserExecutable });
    console.log(`${comp.id} -> docs/stills/${comp.id}.jpg`);
  }
  process.exit(0);
}
const wanted = process.argv.slice(2);
const jobs = wanted.length
  ? wanted.map((w) => { const [id, f] = w.split(":"); return { id, frame: f ? +f : null }; })
  : comps.filter((c) => /^(T|DD)\d/.test(c.id)).map((c) => ({ id: c.id, frame: null }));

for (const job of jobs) {
  const comp = comps.find((c) => c.id === job.id);
  if (!comp) { console.error(`No composition "${job.id}"`); process.exitCode = 1; continue; }
  // The frame to grab: the one asked for, the gallery's chosen frame (stillFrame prop), or the middle.
  const frame = job.frame ?? comp.props.stillFrame ?? Math.floor(comp.durationInFrames / 2);
  const file = path.join(out, job.frame === null ? `${job.id}.png` : `${job.id}@${frame}.png`);
  await renderStill({ composition: comp, serveUrl, output: file, frame, browserExecutable });
  console.log(`${job.id} @ ${frame} -> ${path.relative(root, file)}`);
}
