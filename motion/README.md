# AISSS motion

The animation system for the AI Safety Said Simply explainer video: brand tokens, the paper-cutout look, every on-screen component, the master map, and the shots themselves, all as code in [Remotion](https://www.remotion.dev).

- **The rules:** [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) (start with the one-page cheat sheet).
- **For coding agents:** [AGENTS.md](AGENTS.md) (Claude Code reads it through `CLAUDE.md`, and Codex reads it directly).
- **The values:** [src/brand/tokens.ts](src/brand/tokens.ts). Change a rule there and every shot follows.

## Set up (once)

You need [Node.js](https://nodejs.org) 20 or newer and git.

```bash
# clone OUTSIDE OneDrive, e.g. C:\dev or ~/dev
git clone <repo url> cta-video
cd cta-video/motion
npm ci
npm run studio      # opens the preview in your browser
```

Don't work inside the OneDrive folder: syncing `node_modules` and `.git` is slow and can corrupt the repo, and on Windows long OneDrive paths stop Remotion's browser from starting.

## Everyday commands

| Command | What it does |
|---|---|
| `npm run studio` | Preview and scrub every composition |
| `npm run check` | Brand/motion rules + TypeScript; must pass before a pull request |
| `npm run stills` | Render reference stills of every template and do/don't into `out/stills/` |
| `npm run stills -- S04-02-policy-map:120` | One still of one shot at frame 120 |
| `npx remotion render S04-02-policy-map out/S04-02-policy-map.mp4` | Render one shot |
| `npx remotion render Main out/Main.mp4` | Render the whole video (shots with `inMain: true`, in order) |
| `npm run textures` | Re-bake the paper grain after changing `GRAIN` in the tokens |
| `npm run docs:stills` | Refresh the pictures in the style guide after a rule change |
| `npm run sync:careermap` | Copy the career map's data from `../career-flowchart` (set `CAREERMAP_DIR` if it's elsewhere) |

## What's where

```
AGENTS.md / CLAUDE.md     rules for coding agents
docs/STYLE-GUIDE.md       the full guide, with stills in docs/stills/
src/brand/tokens.ts       every colour, size, timing, easing and boil value
src/brand/fonts.ts        the bundled fonts (TeX Gyre Heros, Libre Baskerville)
src/paper/                Ground (+ grain), Cutout, Boil, scissor-cut edges
src/type/Text.tsx         the type system
src/motion/               entrances, easing, camera, the paper-push transition
src/components/           title/section/end cards, lower third, callout, quote, stat, document, photo, icons, arrows, charts
src/map/                  the master map, its views and places
src/careermap/            the animated career map (data copied from the career-flowchart project)
src/shots/                one folder per shot + index.ts (the shot list)
src/Main.tsx              the whole video, assembled from the shot list
src/gallery/              template demos (T..) and the do/don't board (DD..)
scripts/check-style.mjs   the rule checker
scripts/render-stills.mjs still renderer
public/                   fonts, logo SVGs, grain textures
public/images/            stock/ and real/ images, each with credits.csv
```

## Big files

Voice-over, music, reference clips, original photos and final renders live in the shared OneDrive folder `cta/animation/` (see the guide, §13.1), not in git.

## Licences

- TeX Gyre Heros: GUST Font License (`public/fonts/GUST-FONT-LICENSE.txt`).
- Libre Baskerville: SIL Open Font License (`public/fonts/LIBRE-BASKERVILLE-OFL.txt`).
- Yarn mark: Google Noto Emoji U+1F9F6, SIL Open Font License (`public/brand/NOTO-OFL.txt`).
- Map data: Natural Earth via world-atlas, US Census via us-atlas; public domain.
- Remotion has its own licence terms for organisations: check https://www.remotion.dev/license for your team's case before rendering the final video.
