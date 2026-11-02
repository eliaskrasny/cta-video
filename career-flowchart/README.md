# AI Safety Career Map

The interactive career flowchart. Open `index.html` in a browser (double-click it). Nothing to install.

## What's here

```
index.html          the website (current version)
careermap-data.js   the map itself: paths, steps, their text and links, the real people, every position and line
assets/             logos.js (logos as embedded images), favicon.svg, fonts/ (TeX Gyre Heros)
old-version/        the previous version (colourful paths, ovals, dark mode), kept as it was; open old-version/index.html
```

The video script and research notes are in `notes/` at the top of the repo.

**To change the map's content** (a step, its text or link, a person, a position), edit `careermap-data.js` only. `index.html` just draws it and handles clicks, panels, "My plan" and the phone layout.

## The video uses this map too

The animated career map in the video (`motion/` in this repo, component `<CareerMap>`) draws an exact copy of `careermap-data.js`. After you change the map here:

1. Check the website still looks right.
2. In `motion/`, run `npm run sync:careermap`, and commit the map change and the copied files together.

Keep step IDs stable where you can: shots in the video refer to steps by ID (for example `"horizon"`).

## Sharing

**Shareable link:** https://claude.ai/artifact/Auzx1TnEuzkML6L5YQmZVU (private until it's shared from the page's Share menu). To update it after a change, ask Claude to re-publish `index.html` to that link.

The site is also plain files with no server needed, so it works anywhere the whole folder goes (keep `index.html`, `careermap-data.js` and `assets/` together). The old version is self-contained in `old-version/`.

## Style

It follows the AISSS video style (`motion/docs/STYLE-GUIDE.md`): Warm Paper ground, Wool cutouts with flat offsets, square corners, neutral paths with the selected path lit in Indigo, Strand only in the title. The website sits still; only the video version boils.
