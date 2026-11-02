// The one wobble. Anything wrapped in <Boil> redraws every BOIL.hold frames, cycling through BOIL.drawings versions,
// like a hand-cut shape re-shot on each frame. Text, the logo, photos and the Strand loop are never wrapped in it.
import React, { createContext, useContext, useId } from "react";
import { useCurrentFrame } from "remotion";
import { BOIL, type BoilStrength } from "../brand/tokens";

// Everything in a frame must boil on the same frames. useCurrentFrame() restarts inside every <Sequence>, so the boil
// reads the composition's own frame from this clock instead. Root wraps every composition in it (withBoilClock).
const BoilClockContext = createContext<number | null>(null);

export const BoilClock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const outer = useContext(BoilClockContext);
  const frame = useCurrentFrame();
  if (outer !== null) return <>{children}</>; // a shot inside Main keeps Main's clock
  return <BoilClockContext.Provider value={frame}>{children}</BoilClockContext.Provider>;
};

export const withBoilClock = <P extends object>(C: React.ComponentType<P>): React.FC<P> => {
  const Wrapped: React.FC<P> = (props) => (
    <BoilClock>
      <C {...props} />
    </BoilClock>
  );
  return Wrapped;
};

export const useBoilDrawing = () => {
  const clock = useContext(BoilClockContext);
  const local = useCurrentFrame();
  return Math.floor((clock ?? local) / BOIL.hold) % BOIL.drawings;
};

export const Boil: React.FC<{ strength: BoilStrength; seed?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  strength,
  seed = 1,
  style,
  children,
}) => {
  const id = "boil" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const drawing = useBoilDrawing();
  return (
    <>
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={BOIL.frequency} numOctaves={BOIL.octaves} seed={seed * 10 + drawing} result="noise" />
          {/* displacement = scale x (noise - 0.5), so scale = 2 x amount gives +/- amount px */}
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={BOIL.amount[strength] * 2} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div style={{ ...style, filter: `url(#${id})` }}>{children}</div>
    </>
  );
};
