# AGENTS.md: rules for coding agents working on AISSS animations

> **Scope.** This file governs the **original flat AISSS system**: shots in `src/shots/` built from `src/aisss.ts` (Ground, Cutout, Text, charts, MasterMap, CareerMap). New animation in the **paper-collage style** (`src/collage/`, scenes in `src/collage-scenes/`, 12 fps, real textures) follows `../.claude/skills/paper-cutout-animation/SKILL.md` and the package READMEs it lists instead. Read that skill first for any new animation. Don't mix the two looks in one shot.

You are making animated shots for an AI Safety Said Simply (AISSS) explainer video, in Remotion (React + TypeScript), 1920×1080 at 24 fps. Many people and agents make shots in parallel, so **consistency beats creativity**: build every shot from the shared library and never invent a new look. The full human guide is `docs/STYLE-GUIDE.md`; read the section you need when a rule below isn't enough.

## Hard rules

1. **Import everything from `src/aisss.ts`.** Grounds, cutouts, text, cards, panels, charts, the map, the logo, motion helpers and tokens all come from there.
2. **No raw values.** Colours come from `COLOR`, sizes from `<Text role>`, spacing from `SPACE`/`colX`/`span`, timings from `DUR`, easing from `useEnter`/`progress`. Never type a hex code, `fontSize`, `fontFamily`, `Easing.*`, `spring()`, fps or frame size.
3. **Every shot starts with `<Ground>`** (Warm Paper). `ground="ink"` only for title, section and end cards.
4. **All words go through `<Text role=...>`.** Break lines yourself with `\n`. Respect the role's max characters and lines (it throws if you don't). Left aligned only.
5. **One Strand-family item per frame** (Strand, Clay or Live): one heading phrase, rule, lower-third bar, loop, accent pin/dot/arrow, or Live highlight. Strand type only at h3 size or larger.
6. **Diagrams use one signal colour** (`indigo` by default, or `moss`), plus Ink and the warm neutrals.
7. **Panels are `<Cutout>`**: square corners, flat offset shadow via `elevation`. Never `boxShadow`, blur, gradients, blend modes, `borderRadius` (except `"50%"` for circles), textures or rotation.
8. **Boil**: `<Cutout>`, charts, arrows, icons and the map boil automatically. Never wrap text, the logo, photos or the Strand loop in `<Boil>`.
9. **The career map only through `<CareerMap>`** (`docs/STYLE-GUIDE.md` §9.2). Its content comes from the career-flowchart project: to change a step, edit `career-flowchart/careermap-data.js`, then run `npm run sync:careermap`. Never edit `src/careermap/careermap-data.js` or `src/careermap/logos.js`.
10. **World maps only through `<MasterMap>`**, with views from `MAP_VIEWS` and places from `src/map/places.ts`. Need a new view or place? Add it there; never draw a map or hard-code coordinates in a shot.
11. **Logo only through `<LogoLockup>` / `<YarnMark>`.** Fade or cut in, nothing else.
12. **Motion vocabulary only:** `rise`, `drop`, `slide-*`, `pop` (pins/icons/ticks only), `fade`, `cut`. Hard cuts between scenes, or `paperPush()` between chapters. Camera via `<Camera>` (≤ 1.08 scale with text on screen).
13. **Every number or claim on screen gets a `<Source>`.** Use real sources the user gave you. If you don't have one, write `Source: TODO` and tell the user; never invent one.
14. **Hold text long enough:** at least `readFrames(text)` after the last line has landed.
15. **Deterministic:** no `Math.random()`, `Date`, or network fetches. Use `random("seed")` from remotion.
16. **Don't quietly bend shared code to make one shot work** (`src/brand`, `src/paper`, `src/motion`, `src/map`, `src/components`, `src/type`). If a shot needs something the library can't do, say so and offer to make it a rule change (below), which everyone then gets.

## Changing a rule

Anyone on the team may change a rule; that's how the system improves. When the user asks to change a rule ("make labels bigger", "boil slower", "add a Tokyo view", "new icon"), do all of this in one change, on its own branch named `rule/<short-name>`:

1. **Change the value or component**, never a shot: colours, sizes, timings, boil and grain in `src/brand/tokens.ts`; places and views in `src/map/` (the career map is changed in the career-flowchart project, then synced); icons in `src/components/Icon.tsx`; checker rules in `scripts/check-style.mjs`.
2. **Update the guide**: the matching section of `docs/STYLE-GUIDE.md` and, if it's one of the hard rules, this file. Keep the source tag honest: a value from a measured clip becomes "measured from <clip>"; a team choice is DECIDED.
3. **Run `npm run check`**, then **`npm run docs:stills`** to refresh the pictures in the guide. If you changed the grain, run `npm run textures` first.
4. **Look at the refreshed stills** for anything the change broke (text that no longer fits, overlaps).
5. **Check the shots**: run `npm run stills -- <id>:<frame>` for any existing shots the change touches, and list in your summary which shots look different now.
6. Open a pull request titled `Rule: <what changed>` saying what changed, why, and which shots it affects.

## Making a shot

1. Shot id: `S<chapter 2 digits>-<shot 2 digits>-<slug>`, e.g. `S04-02-policy-map`.
2. Copy `src/shots/_example/` to `src/shots/<id>/`, rename the component, and register it in `src/shots/index.ts`.
3. Images: licensed stock photos go in `public/images/stock/`; screenshots of articles, posts and documents, and photos of the real people in the story, go in `public/images/real/`. Each needs a row in that folder's `credits.csv` (the README there says how). Show them only with `<PhotoCutout>` or `<ArticleCutout>`. Never use AI-generated images, and never edit the words in a screenshot.
4. Time entrances to the voice-over the user gives you: an element enters on or just after the word that names it.
5. Run `npm run check` and fix every problem.
6. Render stills of 2–3 key frames: `npm run stills -- <id>:<frame> <id>:<frame>` (files land in `out/stills/`). **Look at them** and fix anything that breaks the rules above or looks off (overlaps, text outside the safe area, more than one Strand item).
7. Report to the user: what you built, the frames you checked, any `Source: TODO`, and anything you'd like to change in the shared library.

## Commands

| Command | What it does |
|---|---|
| `npm ci` | Install exact pinned dependencies |
| `npm run studio` | Live preview of every composition |
| `npm run check` | Style rules + TypeScript. Must pass. |
| `npm run stills` | Reference stills of all templates and do/don'ts |
| `npm run stills -- <id>:<frame>` | Still of one composition at one frame |
| `npm run docs:stills` | Refresh the pictures in `docs/stills/` after a rule change |
| `npm run sync:careermap` | Copy the career map's data from the career-flowchart project |
| `npx remotion render <id> out/<id>.mp4` | Render a shot |
| `npm run textures` | Re-bake the paper grain after changing `GRAIN` |

If Remotion's browser won't start on Windows (path too long), set `AISSS_BROWSER` to a Chrome path for `npm run stills`, and pass `--browser-executable` to `remotion render`.

## Components at a glance

`Ground`, `Cutout`, `Text`, `Source`, `TitleCard`, `SectionCard`, `LowerThird`, `Callout`, `QuoteCard`, `StatReveal`, `DocumentHighlight`, `PhotoCutout`, `Icon` (names in `ICONS`), `Arrow`, `BarChart`, `Timeline`, `ItemList`, `MasterMap`, `CareerMap`, `ArticleCutout`, `LogoLockup`, `YarnMark`, `StrandLoop`, `StrandRule`, `EndCard`, `Camera`, `paperPush`. Live examples of each: the `T..` compositions in `src/gallery/Templates.tsx`. What not to do: `src/gallery/dont/` (never copy from there).
