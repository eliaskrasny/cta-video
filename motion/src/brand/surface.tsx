// Which colour type should be depends on what it sits on. Grounds and cutouts set this; <Text> reads it.
import React, { createContext, useContext } from "react";
import { GROUND, SURFACE, type GroundName, type SurfaceName } from "./tokens";

type Surface = { text: string; quiet: string; ground: GroundName };
const SurfaceContext = createContext<Surface>({ text: GROUND.warm.text, quiet: GROUND.warm.quiet, ground: "warm" });

export const useSurface = () => useContext(SurfaceContext);

export const GroundSurface: React.FC<{ ground: GroundName; children: React.ReactNode }> = ({ ground, children }) => (
  <SurfaceContext.Provider value={{ text: GROUND[ground].text, quiet: GROUND[ground].quiet, ground }}>{children}</SurfaceContext.Provider>
);

export const CutoutSurface: React.FC<{ fill: SurfaceName; children: React.ReactNode }> = ({ fill, children }) => {
  const { ground } = useSurface();
  return <SurfaceContext.Provider value={{ text: SURFACE[fill].text, quiet: SURFACE[fill].quiet, ground }}>{children}</SurfaceContext.Provider>;
};
