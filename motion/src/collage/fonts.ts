import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

const WEIGHTS: Array<[number, string]> = [
  [400, "Regular"],
  [500, "Medium"],
  [600, "SemiBold"],
  [700, "Bold"],
];

/** Loads Inter (public/fonts/Inter-*.ttf) and holds the render until it is ready. Call once in the scene. */
export const useInter = (): void => {
  const [handle] = useState(() => delayRender("Loading Inter"));
  useEffect(() => {
    Promise.all(
      WEIGHTS.map(([weight, file]) =>
        loadFont({ family: "Inter", url: staticFile(`fonts/Inter-${file}.ttf`), weight: String(weight) }),
      ),
    )
      .then(() => continueRender(handle))
      .catch((e) => cancelRender(e));
  }, [handle]);
};
