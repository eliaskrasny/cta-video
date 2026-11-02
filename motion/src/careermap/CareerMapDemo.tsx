// Demo of the animated career map, in the order the script tells it: start, learn, the student/mid-career fork,
// pick a path, then the six paths, then the Policy path lit with "You are here" on it.
import React from "react";
import { Ground } from "../paper/Ground";
import { CareerMap } from "./CareerMap";

export const CAREER_DEMO_DURATION = 420;

export const CareerMapDemo: React.FC = () => (
  <Ground>
    <CareerMap
      ghost
      camera={[
        { at: 0, view: "overview" },
        { at: 12, view: "start" },
        { at: 84, view: "fork" },
        { at: 168, view: "pick" },
        { at: 228, view: "paths" },
        { at: 324, view: "policy:2" },
      ]}
      reveal={[
        { at: 30, part: "start" },
        { at: 66, part: "learn" },
        { at: 120, part: "student" },
        { at: 132, part: "mid" },
        { at: 186, part: "pick" },
        { at: 252, part: "technical" },
        { at: 258, part: "policy" },
        { at: 264, part: "outside" },
        { at: 270, part: "comms" },
        { at: 276, part: "ops" },
        { at: 282, part: "founders" },
        { at: 300, part: "end" },
      ]}
      lit={[{ at: 324, lane: "policy" }]}
      here={[
        { at: 40, node: "start" },
        { at: 136, node: "student" },
        { at: 200, node: "pick" },
        { at: 360, node: "horizon" },
      ]}
    />
  </Ground>
);
