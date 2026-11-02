// A worked example of a real shot: section card, paper push, map with pins and a lower third, then a stat.
// Copy this folder to start a new shot.
import React from "react";
import { Sequence } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { Ground, LowerThird, MasterMap, SectionCard, StatReveal, paperPush } from "../../aisss";

export const EXAMPLE_DURATION = 72 + 216 + 120 - 2 * 14;

export const ExampleShot: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={72}>
      <SectionCard number="04" label="Policy and governance" title={"Where the rules\nget written"} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition {...paperPush("from-right")} />
    <TransitionSeries.Sequence durationInFrames={216}>
      <Ground>
        <MasterMap
          camera={[{ at: 0, view: "world" }, { at: 24, view: "atlantic" }]}
          pins={[
            { place: "washingtonDC", at: 76 },
            { place: "sacramento", at: 82, side: "left" },
            { place: "london", at: 88, side: "left" },
            { place: "brussels", at: 94 },
          ]}
        />
        <Sequence from={110}>
          <LowerThird label="Four capitals · so far" title="Where AI rules are being written" exitAt={96} />
        </Sequence>
      </Ground>
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition {...paperPush("from-bottom")} />
    <TransitionSeries.Sequence durationInFrames={120}>
      <Ground>
        <StatReveal value={190} prefix="$" suffix="k+" label={"Top of the Horizon Fellowship\nsalary range, 2027 cohort"} source="Source: Horizon Institute for Public Service, 2026" at={6} />
      </Ground>
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
