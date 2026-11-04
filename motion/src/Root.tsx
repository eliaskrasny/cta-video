// Registers every composition: the template gallery (T..), the do/don't board (DD..), each shot (S..), and Main.
import React from "react";
import { Composition, Folder } from "remotion";
import { VIDEO } from "./brand/tokens";
import "./brand/fonts";
import { GALLERY } from "./gallery/Templates";
import { DO_DONT } from "./gallery/dont/DoDont";
import { SHOTS } from "./shots";
import { Main, MAIN_DURATION } from "./Main";
import { GrainTexture } from "./paper/Ground";
import { withBoilClock } from "./paper/Boil";
import { H as COLLAGE_H, W as COLLAGE_W, FPS as COLLAGE_FPS } from "./collage/canvas";
import { OrgChart } from "./collage-scenes/org-chart/OrgChart";

const size = { fps: VIDEO.fps, width: VIDEO.width, height: VIDEO.height };

export const Root: React.FC = () => (
  <>
    <Composition id="Main" component={withBoilClock(Main)} durationInFrames={MAIN_DURATION} {...size} />
    <Folder name="Shots">
      {SHOTS.map((s) => (
        <Composition key={s.id} id={s.id} component={withBoilClock(s.component)} durationInFrames={s.durationInFrames} {...size} />
      ))}
    </Folder>
    {/* Paper-collage style (12 fps stop motion on real paper textures). Rules: .claude/skills/paper-cutout-animation/SKILL.md */}
    <Folder name="Collage">
      <Composition id="C01-org-chart" component={OrgChart} durationInFrames={162} fps={COLLAGE_FPS} width={COLLAGE_W} height={COLLAGE_H} />
    </Folder>
    <Folder name="Templates">
      {GALLERY.map((g) => (
        <Composition key={g.id} id={g.id} component={withBoilClock(g.component)} durationInFrames={g.durationInFrames} defaultProps={{ stillFrame: g.still }} {...size} />
      ))}
    </Folder>
    <Folder name="Textures">
      <Composition id="X-GrainWarm" component={() => <GrainTexture ground="warm" />} durationInFrames={1} {...size} />
      <Composition id="X-GrainInk" component={() => <GrainTexture ground="ink" />} durationInFrames={1} {...size} />
    </Folder>
    <Folder name="Do-and-dont">
      {DO_DONT.map((d) => (
        <Composition key={d.id} id={d.id} component={withBoilClock(d.component)} durationInFrames={24} defaultProps={{ stillFrame: 23 }} {...size} />
      ))}
    </Folder>
  </>
);
