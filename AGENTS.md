# AGENTS.md: working in the cta-video repo

This repo holds an explainer video's animation (`motion/`), the interactive career map website (`career-flowchart/`), the brand package (`branding/`) and the script (`notes/`). Several people and their coding agents work here at once.

## Read this first: animation work

For **any** animation task, before writing code:

1. Read `.claude/skills/paper-cutout-animation/SKILL.md` all the way through. It is the animation style guide and has the reading list. We animate to **maximise YouTube engagement**: keep text light, keep elements big and clear.
2. Read the README of **every package you use**, in full:
   - `motion/src/collage/README.md` (the kit, textures, cut-out baking)
   - `motion/src/collage/tape/README.md`
   - `motion/src/collage/pen/README.md`
   - `motion/src/collage/squiggle/README.md`
3. For brand colour, type and logo questions read `.claude/skills/aisss-visual-identity/SKILL.md`, then the page in its `reference/` folder for what you're making. It is the Visual Identity PDF in agent form; `scripts/contrast.py` checks text/background pairs.
4. Copy `motion/src/collage-scenes/org-chart/` as the starting point for a new scene.

Defaults you must not forget: use the real texture scans (`motion/public/collage/textures/`) and keep them faint on text cards and tape; cut-outs are baked with `tear` 0.5 (stay 0.3–0.6); signs and notes have straight edges; pen strokes come from the `pen` package; no wobble unless a rare, deliberate `Squiggle`; 12 fps.

The older flat system (`motion/src/{brand,paper,components,...}`) has its own rules in `motion/AGENTS.md`. Don't mix the two looks in one shot.

## Where the rules are

- **Paper-collage animation (`motion/src/collage/`, `motion/src/collage-scenes/`):** the skill and package READMEs above. There is no automatic checker for style: render stills at 100% and go through the checklist at the end of the skill. `npm run check` still has to pass (TypeScript and the legacy rules for the rest of `motion/`).
- **Original flat system (everything else in `motion/src/`):** follow `motion/AGENTS.md`. Its hard rules are not optional there.
- **Career map content:** edit `career-flowchart/careermap-data.js` only (steps, text, links, people, positions). `career-flowchart/index.html` just draws it. Then run `npm run sync:careermap` in `motion/` and commit both changes together, so the video's copy matches.
- **Brand:** `branding/AISSS-Visual-Identity.pdf` (Inter edition). Its source is `branding/guide/` (`python3 build_guide.py` rebuilds the PDF). Brand type is Inter + Baskerville; there is no Helvetica anywhere any more.
- **Script:** `notes/vidscript.txt`. Time shots to it; don't change it unless asked.

## Git workflow

1. Before starting: `git switch main && git pull`.
2. Work on a branch: `shot/<shot-id>` for a shot, `rule/<short-name>` for a rule or kit change, `map/<short-name>` for a career map change.
3. Before committing, from `motion/`: `npm run check` must pass. For shots, render and look at stills.
4. Commit with a short message that says what changed, then push and open a pull request (`gh pr create`). Title `Shot: …`, `Rule: …` or `Map: …`, and fill in the template.
5. Never push straight to `main`, force-push, or rewrite shared history.
6. Never commit big media (video, audio, renders, raw texture scans) or `node_modules`/`out`; `.gitignore` already blocks most of it. Compressed audio a render needs (MP3) goes in `motion/public/audio/`.
