// The whole video: every shot with inMain, back to back, in SHOTS order. Voice-over and music go here too.
import React from "react";
import { Series } from "remotion";
import { SHOTS } from "./shots";

export const MAIN_SHOTS = SHOTS.filter((s) => s.inMain);
export const MAIN_DURATION = Math.max(1, MAIN_SHOTS.reduce((t, s) => t + s.durationInFrames, 0));

export const Main: React.FC = () => (
  <Series>
    {MAIN_SHOTS.map((s) => (
      <Series.Sequence key={s.id} durationInFrames={s.durationInFrames}>
        <s.component />
      </Series.Sequence>
    ))}
  </Series>
);
