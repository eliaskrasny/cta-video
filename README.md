# CTA video

Everything for the AI Safety Said Simply careers video, in one place: the animation, the interactive career map, the brand, and the script.

| Folder | What it is | Start with |
|---|---|---|
| `motion/` | **The one Remotion project.** The paper-collage animation kit (`src/collage/`) and the original flat AISSS library. | [Get an agent up to speed](#get-an-agent-up-to-speed) below |
| `.claude/skills/` | The two skills that tell agents how to animate and how to apply the brand. | `paper-cutout-animation/SKILL.md` |
| `branding/` | Brand package: the visual identity PDF (Inter edition), its source, logos, favicons, template. | `branding/AISSS-Visual-Identity.pdf` |
| `career-flowchart/` | The interactive career map website. The video's career map is drawn from its data. | [career-flowchart/README.md](career-flowchart/README.md) |
| `notes/` | The plan and research (`plan.txt`) and the video script draft (`vidscript.txt`). | `notes/vidscript.txt` |

Big media (voice-over, music, reference clips, raw texture scans, final renders) lives in the shared OneDrive folder `cta/animation/`, not here. See [What git ignores](#what-git-ignores).

---

## Get an agent up to speed

**Animating anything? Start your agent in the repo root and paste this:**

> Read `AGENTS.md`, then follow the reading list in `.claude/skills/paper-cutout-animation/SKILL.md` (including the README of every package you use) before you write or change any shot.

Claude Code finds `.claude/skills/` by itself, and both Claude Code and Codex read `AGENTS.md`, which points to the same place. The reading order below is the same for people.

### Reading order

| # | Read | You learn |
|---|---|---|
| 1 | [`.claude/skills/paper-cutout-animation/SKILL.md`](.claude/skills/paper-cutout-animation/SKILL.md) | The animation style: we animate to **maximise YouTube engagement** (text light, elements big and clear), the non-negotiable rules, how to use the real texture scans, the tear default (0.5), pen texture, curves and timing, palette, layout, and a delivery checklist |
| 2 | [`motion/src/collage/README.md`](motion/src/collage/README.md) | The kit API: ground, paper signs, cut-outs, pins, stamps, textures, motion helpers, and the workflows for baking cut-outs and processing textures |
| 3 | [`motion/src/collage/tape/README.md`](motion/src/collage/tape/README.md) | Tape (mostly transparent, almost no texture) |
| 4 | [`motion/src/collage/pen/README.md`](motion/src/collage/pen/README.md) | Pen underlines, rings, any pen stroke, connector ink |
| 5 | [`motion/src/collage/squiggle/README.md`](motion/src/collage/squiggle/README.md) | Wobbling outlines. **Off by default**, very sparing accent |
| 6 | [`.claude/skills/aisss-visual-identity/SKILL.md`](.claude/skills/aisss-visual-identity/SKILL.md) | Brand: colour, type (Inter + Baskerville), logo rules |
| 7 | [`motion/src/collage-scenes/org-chart/OrgChart.tsx`](motion/src/collage-scenes/org-chart/OrgChart.tsx) | A complete worked scene (composition `C01-org-chart`) to copy |

Read only the package READMEs you use, but read each of those in full.

### The style in five lines

- Photos are photocopied **cut-outs** with a hand-torn white border (baked once, never wobbles). Signs, notes, tags, banners and stamps are **straight-edged** paper with scanned texture and a soft shadow.
- Paper, halftone and flecks come from the **real texture scans** (`motion/public/collage/textures/`), kept faint, especially under text and on tape.
- Animated at **12 fps**, stop-motion style: things pop in, lines draw on, holds stay still. No wobble except a rare `Squiggle`.
- Compose for a phone and for retention: 1–3 words per label, 3–5 big objects, one focal point per beat.
- Palette: Warm Paper, Ink, Bark, Strand orange, and red only on stamps. Text is Inter.

### Two styles live here

| | **Paper collage** (default for new work) | **Original flat AISSS system** |
|---|---|---|
| Where | `motion/src/collage/`, scenes in `motion/src/collage-scenes/` | `motion/src/{brand,paper,components,type,motion,map,careermap,shots}` |
| Rules | `.claude/skills/paper-cutout-animation/SKILL.md` | `motion/AGENTS.md` and `motion/docs/STYLE-GUIDE.md` |
| Look | 12 fps, real paper textures, cut-outs and signs, tilt allowed | 24 fps, flat colour, square panels, boil |
| Checked by | looking at stills (checklist in the skill) | `npm run check` |

Don't mix the two looks in one shot. The flat system's tools (world map, career map) are still there; the team hasn't yet decided how they should look in the collage style.

---

## Set up (once, about 15 minutes)

1. Install [Node.js](https://nodejs.org) (the LTS version), [git](https://git-scm.com) and [VS Code](https://code.visualstudio.com), plus Claude Code or Codex. For the texture and cut-out tools also install Python 3 and `pip install pillow numpy scipy`.
2. Make a GitHub account and send your username to Elias, who adds you to the repo.
3. Clone the repo to a normal folder, **not inside OneDrive** (OneDrive can corrupt git folders):
   ```bash
   cd C:\dev            # or ~/dev on a Mac
   git clone https://github.com/eliaskrasny/cta-video.git
   cd cta-video/motion
   npm ci
   npm run studio       # opens the animation preview in your browser
   ```
4. Open the `cta-video` folder in VS Code and start your agent there.

In Studio, the paper-collage scene is `Collage / C01-org-chart`. To see the career map, open `career-flowchart/index.html` in a browser.

### Render the collage scene

```bash
cd motion
npx remotion still src/index.ts C01-org-chart out/frame.png --frame=24         # check a frame at 100%
npx remotion render src/index.ts C01-org-chart out/org-chart.mp4 --scale=1.5   # 1920x1080 at 12 fps
```

## Working together

Every change goes through a pull request, so nobody overwrites anyone else and every change is checked.

1. **Get the latest** before you start: tell your agent "pull the latest main", or run `git pull`.
2. **Make your change** on a branch. Ask your agent, for example: "make shot S04-02 from the script", "animate the policy path in the paper-collage style", "add a step to the Policy path on the career map".
3. **Share it**: "commit and open a pull request". GitHub runs the checks automatically (a green tick means the rules pass).
4. **Review**: a teammate looks at the stills or the preview, comments or approves, then merges.

Rule changes (sizes, colours, timing, the map) affect every shot, so they get their own pull request titled `Rule: …`. Changes to the collage kit or its style guide are rule changes too: update the skill and the package README in the same pull request.

## What git ignores

| Not in git | Why | Where it is |
|---|---|---|
| Video, audio, renders (`*.mp4`, `*.mov`, `*.wav`, …) | big | OneDrive `cta/animation/` |
| Raw texture scans (`motion/assets/textures/*`) | ~12 MB each | OneDrive; the README in that folder lists them |
| `*.zip` (new ones), `node_modules/`, `out/` | big or generated | |
| `branding/guide/guide.html`, `branding/guide/preview/` | generated by the guide build | rebuild with `python3 branding/guide/build_guide.py` |

Committed on purpose, because the video needs them: the processed texture maps (`motion/public/collage/textures/`), the baked cut-outs (`motion/public/collage/cutouts/`), source photos (`motion/assets/photos/`), fonts.

## Sharing outside the team

The career map is published as a private claude.ai page: https://claude.ai/artifact/Auzx1TnEuzkML6L5YQmZVU. Its owner shares it from the page's Share menu.
