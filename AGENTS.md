# AGENTS.md: working in the cta-video repo

This repo holds an explainer video's animation (`motion/`), the interactive career map website (`career-flowchart/`), the brand package (`branding/`) and the script (`notes/`). Several people and their coding agents work here at once.

## Where the rules are

- **Animation work (anything in `motion/`):** follow `motion/AGENTS.md`. Its hard rules are not optional; read it before writing a shot.
- **Career map content:** edit `career-flowchart/careermap-data.js` only (steps, text, links, people, positions). `career-flowchart/index.html` just draws it. Then run `npm run sync:careermap` in `motion/` and commit both changes together, so the video's copy matches.
- **Brand:** `branding/AISSS-Visual-Identity.pdf`, already applied in `motion/src/brand/tokens.ts`. Don't edit the brand package.
- **Script:** `notes/vidscript.txt`. Time shots to it; don't change it unless asked.

## Git workflow

1. Before starting: `git switch main && git pull`.
2. Work on a branch: `shot/<shot-id>` for a shot, `rule/<short-name>` for a rule change, `map/<short-name>` for a career map change.
3. Before committing, from `motion/`: `npm run check` must pass. For shots, render and look at stills (see `motion/AGENTS.md`).
4. Commit with a short message that says what changed, then push and open a pull request (`gh pr create`). Title `Shot: …`, `Rule: …` or `Map: …`, and fill in the template.
5. Never push straight to `main`, force-push, or rewrite shared history.
6. Never commit big media (WAV, raw video, renders) or `node_modules`/`out`. Compressed audio a render needs (MP3) goes in `motion/public/audio/`.
