# AISSS video

Everything for the AI Safety Said Simply careers video, in one place: the animation, the interactive career map, the brand, and the script.

| Folder | What it is | Start with |
|---|---|---|
| `motion/` | The animation: brand rules as code, every component, the master map, and the shots. Built with [Remotion](https://www.remotion.dev). | [motion/docs/STYLE-GUIDE.md](motion/docs/STYLE-GUIDE.md) (one-page cheat sheet at the top) |
| `career-flowchart/` | The interactive career map website. The video's career map is drawn from its data. | [career-flowchart/README.md](career-flowchart/README.md) |
| `branding/` | The AISSS brand package: visual identity PDF, logos, favicons, template. | `branding/AISSS-Visual-Identity.pdf` |
| `notes/` | The plan and research (`plan.txt`) and the video script draft (`vidscript.txt`). | `notes/vidscript.txt` |

Big media (raw voice-over and music, reference clips, final renders) lives in the shared OneDrive folder `cta/animation/`, not here.

## Set up (once, about 15 minutes)

1. Install [Node.js](https://nodejs.org) (the LTS version), [git](https://git-scm.com) and [VS Code](https://code.visualstudio.com), plus Claude Code or Codex.
2. Make a GitHub account and send your username to Elias, who adds you to the repo.
3. Clone the repo to a normal folder, **not inside OneDrive** (OneDrive can corrupt git folders):
   ```bash
   cd C:\dev            # or ~/dev on a Mac
   git clone https://github.com/<owner>/aisss-video.git
   cd aisss-video/motion
   npm ci
   npm run studio       # opens the animation preview in your browser
   ```
4. Open the `aisss-video` folder in VS Code and start your agent there. It reads `AGENTS.md` automatically.

To see the career map, open `career-flowchart/index.html` in a browser.

## Working together

Every change goes through a pull request, so nobody overwrites anyone else and every change is checked.

1. **Get the latest** before you start: tell your agent "pull the latest main", or run `git pull`.
2. **Make your change** on a branch. Ask your agent, for example: "make shot S04-02 from the script", "add a step to the Policy path on the career map", "make labels 30 px".
3. **Share it**: "commit and open a pull request". GitHub runs the checks automatically (a green tick means the rules pass).
4. **Review**: a teammate looks at the stills or the preview, comments or approves, then merges.

Rule changes (sizes, colours, timing, the map) affect every shot, so they get their own pull request titled `Rule: …` (see `motion/AGENTS.md`).

## Sharing outside the team

The career map is published as a private claude.ai page: https://claude.ai/artifact/Auzx1TnEuzkML6L5YQmZVU. Its owner shares it from the page's Share menu.
