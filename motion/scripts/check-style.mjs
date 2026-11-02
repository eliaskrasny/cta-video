// npm run check: fails when code breaks a brand or motion rule that a machine can see.
// Rules a machine can't see (one Strand item per frame, reading time, taste) are on the review checklist in docs/STYLE-GUIDE.md.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");

// Files that are allowed to break rules: the tokens themselves, and the do/don't board, which breaks them on purpose.
// The career map's data and logos are copied in from the flowchart by `npm run sync:careermap`.
const EXEMPT = [/^src\/brand\/tokens\.ts$/, /^src\/gallery\/dont\//, /^src\/careermap\/(careermap-data|logos)\.js$/];

// [id, pattern, message, files where the pattern IS allowed]
const RULES = [
  ["hex", /["'`]#[0-9a-fA-F]{3,8}["'`]/, "Raw hex colour. Use COLOR.* from brand/tokens.ts.", []],
  ["rgb", /\b(rgba?|hsla?)\(/, "Raw rgb()/hsl() colour. Use COLOR.* from brand/tokens.ts.", []],
  ["shadow", /\b(boxShadow|textShadow)\b|drop-shadow/, "Soft shadows are off-brand. Use <Cutout elevation={1|2}> for a flat paper shadow.", []],
  ["blur", /blur\(|CameraMotionBlur/, "No blur of any kind (the brand is flat).", []],
  ["gradient", /gradient\(/, "No gradients (the brand is flat).", []],
  ["blend", /mixBlendMode|backgroundBlendMode/, "No blend modes (the brand is flat).", []],
  ["font-size", /fontSize:\s*\d/, "Font size typed by hand. Use <Text role=...> (sizes live in TYPE).", []],
  ["font-family", /fontFamily\s*:/, "Font family set by hand. Use <Text role=...>.", [/^src\/type\//, /^src\/brand\//]],
  ["italic", /fontStyle:\s*["']italic/, "Italic is only the quote role (Baskerville Italic). Helvetica is never italic.", [/^src\/type\//]],
  ["radius", /borderRadius:(?!\s*"50%")/, "Corners are square. Only circles (borderRadius: \"50%\") are allowed.", []],
  ["align", /textAlign:\s*["'](center|justify|right)/, "Text is left aligned. Never centre or justify a paragraph.", []],
  ["map", /from\s+["'](d3-geo|topojson-client|world-atlas[^"']*|us-atlas[^"']*)["']/, "Maps come only from <MasterMap>. Don't draw your own.", [/^src\/map\//]],
  ["easing", /\bEasing\.|\bspring\(/, "Use the shared curves (useEnter, progress, ease) instead of Easing/spring.", [/^src\/motion\//]],
  ["random", /Math\.random\(/, "Math.random() changes every render. Use random('seed') from remotion.", []],
  ["logo-file", /AISSS-logo|yarn-mark/, "Use <LogoLockup> or <YarnMark>; never place the logo files yourself.", [/^src\/components\/Logo\.tsx$/]],
  ["rotate", /rotate\(/, "Nothing rotates except a photo's small tilt (PhotoCutout tilt prop).", [/^src\/components\/Panels\.tsx$/, /^src\/components\/Cards\.tsx$/]],
  ["image", /\bstaticFile\(|<Img\b|<img\b/, "Show images with <PhotoCutout> or <ArticleCutout> (images live in public/images/stock or public/images/real).", [/^src\/components\//, /^src\/paper\//, /^src\/brand\//]],
  ["fps", /\bfps\s*[:=]\s*\{?\s*\d/, "Frame rate comes from VIDEO.fps.", []],
  ["frame-size", /\b(width|height)\s*[:=]\s*\{?\s*(1920|1080)\b/, "Frame size comes from VIDEO.width / VIDEO.height.", []],
];

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
const files = walk(src).filter((f) => /\.(tsx?|jsx?)$/.test(f));

const problems = [];
for (const file of files) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (EXEMPT.some((r) => r.test(rel))) continue;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  let inBlock = false;
  lines.forEach((raw, i) => {
    // Ignore comments, so rules can be explained in plain words.
    let line = raw;
    if (inBlock) { const end = line.indexOf("*/"); if (end < 0) return; line = line.slice(end + 2); inBlock = false; }
    line = line.replace(/\/\*.*?\*\//g, "");
    const open = line.indexOf("/*"); if (open >= 0) { line = line.slice(0, open); inBlock = true; }
    line = line.replace(/(^|\s)\/\/.*$/, "");
    for (const [id, re, msg, allowed] of RULES) {
      if (allowed.some((a) => a.test(rel))) continue;
      if (re.test(line)) problems.push(`${rel}:${i + 1}  [${id}] ${msg}\n    ${raw.trim().slice(0, 140)}`);
    }
  });
}

// Every shot folder must be registered, with an id like S04-02-policy-map.
const shotsDir = path.join(src, "shots");
const registry = fs.readFileSync(path.join(shotsDir, "index.ts"), "utf8");
for (const d of fs.readdirSync(shotsDir, { withFileTypes: true })) {
  if (d.isDirectory() && !registry.includes(`./${d.name}/`)) problems.push(`src/shots/${d.name}/  [shot] folder isn't registered in src/shots/index.ts`);
}
for (const m of registry.matchAll(/id:\s*"([^"]+)"/g)) {
  if (!/^S\d{2}-\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/.test(m[1])) problems.push(`src/shots/index.ts  [shot-id] "${m[1]}" should look like S04-02-policy-map`);
}

// Every image in public/images/<folder>/ is a JPG, PNG or WebP under 5 MB, with a row in that folder's credits.csv.
const IMAGE_MAX = 5 * 1024 * 1024;
for (const folder of ["stock", "real"]) {
  const dir = path.join(root, "public", "images", folder);
  if (!fs.existsSync(dir)) continue;
  const credits = path.join(dir, "credits.csv");
  const rows = fs.existsSync(credits) ? fs.readFileSync(credits, "utf8").split(/\r?\n/).slice(1).filter((l) => l.trim()) : [];
  const credited = new Set(rows.map((l) => l.split(",")[0].trim()));
  for (const name of fs.readdirSync(dir)) {
    if (name === "credits.csv" || name === "README.md") continue;
    const rel = `public/images/${folder}/${name}`;
    if (!/\.(jpe?g|png|webp)$/i.test(name)) { problems.push(`${rel}  [image] only JPG, PNG or WebP files go here`); continue; }
    if (fs.statSync(path.join(dir, name)).size > IMAGE_MAX) problems.push(`${rel}  [image] over 5 MB; resize to about 2400 px on the long edge`);
    if (!credited.has(name)) problems.push(`${rel}  [credit] no row in public/images/${folder}/credits.csv (see the README in that folder)`);
  }
  for (const f of credited) if (!fs.existsSync(path.join(dir, f))) problems.push(`public/images/${folder}/credits.csv  [credit] lists "${f}", but there's no such file`);
}

if (problems.length) {
  console.error(`\nAISSS style check: ${problems.length} problem(s)\n\n${problems.join("\n\n")}\n`);
  process.exit(1);
}
console.log(`AISSS style check: ${files.length} files, no problems.`);
