// Scene changes. The default is a hard cut (just put scenes in a <Series>). The only other one is the paper push:
// the new scene slides in as a sheet and pushes the old one off. Use it between chapters or big location changes.
import { linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { DUR } from "../brand/tokens";
import { ease } from "./ease";

export const paperPush = (direction: "from-right" | "from-left" | "from-bottom" = "from-right") => ({
  presentation: slide({ direction }),
  timing: linearTiming({ durationInFrames: DUR.push, easing: ease.move }),
});
