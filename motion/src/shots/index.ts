// The shot list. Every shot in the video is registered here, in story order.
// id format: S<chapter 2 digits>-<shot 2 digits>-<slug>, e.g. S04-02-policy-map. Main.tsx plays them in this order.
import type React from "react";
import { ExampleShot, EXAMPLE_DURATION } from "./_example/ExampleShot";

export type Shot = { id: string; component: React.FC; durationInFrames: number; inMain: boolean };

export const SHOTS: Shot[] = [
  { id: "S00-01-example", component: ExampleShot, durationInFrames: EXAMPLE_DURATION, inMain: false },
];
