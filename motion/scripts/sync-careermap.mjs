// npm run sync:careermap: copies the career map's data and logos from the career-flowchart project, the one place they're edited.
// Run it after anyone changes the flowchart, then commit the copies so teammates don't need the flowchart folder.
// Looks for ../career-flowchart (beside motion/ in the cta-video repo); set CAREERMAP_DIR to point somewhere else.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const from = path.resolve(process.env.CAREERMAP_DIR || path.join(root, "..", "career-flowchart"));
const to = path.join(root, "src", "careermap");

for (const f of ["careermap-data.js", "assets/logos.js"]) {
  if (!fs.existsSync(path.join(from, f))) {
    console.error(`Can't find ${path.join(from, f)}. Set CAREERMAP_DIR to the career-flowchart folder.`);
    process.exit(1);
  }
}

// The website's files set window.CAREERMAP and window.LOGOS. Each copy gets its own local "window" and exports what lands on it.
const asModule = (file, name) => {
  const src = fs
    .readFileSync(path.join(from, file), "utf8")
    .replace(/if \(typeof module[^\n]*\n\s*else (window\.\w+ = \w+;)/, "$1");
  return [
    `// COPIED from career-flowchart/${file} by \`npm run sync:careermap\`. Don't edit here; edit the flowchart and re-sync.`,
    "const window = {};",
    src,
    `export default window.${name};`,
    "",
  ].join("\n");
};

fs.mkdirSync(to, { recursive: true });
fs.writeFileSync(path.join(to, "careermap-data.js"), asModule("careermap-data.js", "CAREERMAP"));
fs.writeFileSync(path.join(to, "logos.js"), asModule("assets/logos.js", "LOGOS"));
console.log(`Synced the career map from ${from}`);
