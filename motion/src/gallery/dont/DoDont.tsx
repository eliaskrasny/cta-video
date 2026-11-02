// The do/don't board. Each composition puts a correct frame (left) beside a wrong one (right).
// Files in src/gallery/dont/ break the rules ON PURPOSE and are the only files scripts/check-style.mjs skips. Never copy from here.
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  Arrow, BarChart, COLOR, Cutout, Ground, LogoLockup, MasterMap, SPACE, StrandLoop, Text, VIDEO, colX, span,
} from "../../aisss";
import { Boil } from "../../paper/Boil";
import { FAMILY } from "../../brand/fonts";
import { textStyle } from "../../type/Text";
import { COUNTRIES } from "../../map/geo";

const S = 0.46; // each mini frame is 46% size
const W = VIDEO.width * S, H = VIDEO.height * S;

const Mini: React.FC<{ x: number; verdict: "Do" | "Don't"; note: string; children: React.ReactNode }> = ({ x, verdict, note, children }) => (
  <div style={{ position: "absolute", left: x, top: 230 }}>
    <div style={{ width: W, height: H, overflow: "hidden", outline: `2px solid ${verdict === "Do" ? COLOR.ink : COLOR.strand}` }}>
      <div style={{ width: VIDEO.width, height: VIDEO.height, transform: `scale(${S})`, transformOrigin: "0 0", position: "relative" }}>{children}</div>
    </div>
    <div style={{ ...textStyle("label"), color: verdict === "Do" ? COLOR.ink : COLOR.strand, marginTop: SPACE.m }}>{verdict}</div>
    <div style={{ ...textStyle("small"), color: COLOR.ink, whiteSpace: "normal", width: W, marginTop: SPACE.xs }}>{note}</div>
  </div>
);

const Pair: React.FC<{ title: string; doNote: string; dontNote: string; good: React.ReactNode; bad: React.ReactNode }> = ({ title, doNote, dontNote, good, bad }) => (
  <AbsoluteFill style={{ backgroundColor: COLOR.warmPaper }}>
    <div style={{ ...textStyle("h2"), color: COLOR.ink, position: "absolute", left: 60, top: 70 }}>{title}</div>
    <Mini x={60} verdict="Do" note={doNote}>{good}</Mini>
    <Mini x={60 + W + 40} verdict="Don't" note={dontNote}>{bad}</Mini>
  </AbsoluteFill>
);

const Headline: React.FC<{ strand?: string }> = ({ strand }) => (
  <Text role="h1" enter="cut" strand={strand} style={{ position: "absolute", left: colX(0), top: 260 }}>{"Who writes\nthe rules?"}</Text>
);

const strand: React.FC = () => (
  <Pair title="One Strand item per frame"
    doNote="One job for Strand: here, the loop. The headline stays Ink."
    dontNote="Strand on the words, the loop and the arrow. Three accents means none of them stands out."
    good={<Ground><Headline /><StrandLoop x={1040} y={700} at={-100} /></Ground>}
    bad={<Ground><Headline strand="the rules?" /><StrandLoop x={1040} y={700} at={-100} /><Arrow from={{ x: 900, y: 360 }} to={{ x: 1400, y: 300 }} tone="strand" at={-100} /></Ground>} />
);

const shadow: React.FC = () => (
  <Pair title="Shadows are flat paper"
    doNote="A hard offset shape in Wheat, down and right, no blur."
    dontNote="A soft, blurred, grey drop shadow. The brand has no shadows; ours is a second sheet of paper."
    good={<Ground><Cutout width={span(7)} height={360} seed={4} elevation={2} padding={64} style={{ position: "absolute", left: colX(2), top: 300 }}><Text role="h2" enter="cut">A paper panel</Text></Cutout></Ground>}
    bad={<Ground><div style={{ position: "absolute", left: colX(2), top: 300, width: span(7), height: 360, padding: 64, boxSizing: "border-box", backgroundColor: COLOR.wool, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}><Text role="h2" enter="cut">A paper panel</Text></div></Ground>} />
);

const corners: React.FC = () => (
  <Pair title="Square corners, clean cuts"
    doNote="Corners stay square. Edges sit a little off-true, like scissors."
    dontNote="Rounded corners, gradients and torn edges belong to other brands."
    good={<Ground><Cutout width={span(7)} height={360} seed={8} padding={64} style={{ position: "absolute", left: colX(2), top: 300 }}><Text role="h2" enter="cut">Square and flat</Text></Cutout></Ground>}
    bad={<Ground><div style={{ position: "absolute", left: colX(2), top: 300, width: span(7), height: 360, padding: 64, boxSizing: "border-box", borderRadius: 48, background: `linear-gradient(135deg, ${COLOR.live}, ${COLOR.wool})` }}><Text role="h2" enter="cut">Round and shiny</Text></div></Ground>} />
);

const ground: React.FC = () => (
  <Pair title="One ground per frame"
    doNote="Warm Paper ground, Wool panel. Everything is from the warm family."
    dontNote="A white (Paper) panel on Warm Paper. Paper and Warm Paper never share a frame."
    good={<Ground><Cutout width={span(8)} height={400} seed={12} padding={64} style={{ position: "absolute", left: colX(2), top: 280 }}><Text role="body" enter="cut">{"Panels are Wool, or Wheat\nfor a second panel."}</Text></Cutout></Ground>}
    bad={<Ground><Cutout width={span(8)} height={400} seed={12} padding={64} style={{ position: "absolute", left: colX(2), top: 280 }}><div style={{ position: "absolute", inset: 0, backgroundColor: COLOR.paper }} /><Text role="body" enter="cut" style={{ position: "relative" }}>{"A white card on warm paper\nlooks like a mistake."}</Text></Cutout></Ground>} />
);

const alignment: React.FC = () => (
  <Pair title="Left aligned, short lines"
    doNote="Left aligned, at most 42 characters a line and three lines, broken where you would pause."
    dontNote="A centred paragraph, long lines and too many words. Nobody can read it before the cut."
    good={<Ground><Text role="body" enter="cut" style={{ position: "absolute", left: colX(0), top: 360 }}>{"Most paths into AI safety\ndon’t need a technical\nbackground."}</Text></Ground>}
    bad={<Ground><div style={{ ...textStyle("body"), whiteSpace: "normal", textAlign: "center", position: "absolute", left: 200, right: 200, top: 300, color: COLOR.ink }}>Most paths into AI safety don’t need a technical background, and many of the most important roles are in operations, policy, communications and founding new organisations rather than research.</div></Ground>} />
);

const type: React.FC = () => (
  <Pair title="Two faces, used one way"
    doNote="Baskerville Bold for titles, Helvetica for words, small caps for labels."
    dontNote="Helvetica in italic, a title in Helvetica, labels in lower case, all in one frame."
    good={<Ground><div style={{ position: "absolute", left: colX(0), top: 300 }}><Text role="label" enter="cut">03 · Operations</Text><Text role="h1" enter="cut" style={{ marginTop: 24 }}>{"The people who\nrun things"}</Text></div></Ground>}
    bad={<Ground><div style={{ position: "absolute", left: colX(0), top: 300, color: COLOR.ink }}><div style={{ fontFamily: FAMILY.sans, fontSize: 30 }}>03 - operations</div><div style={{ fontFamily: FAMILY.sans, fontStyle: "italic", fontWeight: 700, fontSize: 88, marginTop: 24 }}>The People Who<br />Run Things</div></div></Ground>} />
);

const boil: React.FC = () => (
  <Pair title="Shapes boil, type never does"
    doNote="The panel redraws on 3s; the words sit still on top of it."
    dontNote="Boil on the text makes it shimmer and hard to read. The logo never boils either."
    good={<Ground><Cutout width={span(8)} height={300} seed={16} padding={64} style={{ position: "absolute", left: colX(2), top: 330 }}><Text role="h2" enter="cut">Sharp words</Text></Cutout></Ground>}
    bad={<Ground><Cutout width={span(8)} height={300} seed={16} padding={64} style={{ position: "absolute", left: colX(2), top: 330 }}><Boil strength="panel" seed={9}><Text role="h2" enter="cut">Wobbly words</Text></Boil></Cutout></Ground>} />
);

const logo: React.FC = () => (
  <Pair title="The logo is left alone"
    doNote="Ink or Paper only, with clear space the height of the mark, on a flat ground."
    dontNote="Recoloured in Strand, rotated, squeezed, or on a pattern."
    good={<Ground><LogoLockup width={600} enter="cut" style={{ position: "absolute", left: colX(2), top: 320 }} /></Ground>}
    bad={<Ground><div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(45deg, ${COLOR.wool} 0 30px, ${COLOR.wheat} 30px 60px)` }} /><div style={{ position: "absolute", left: colX(3), top: 380, transform: "rotate(-12deg) scaleX(1.4)", ...textStyle("display"), fontFamily: FAMILY.sans, color: COLOR.strand }}>AISSS</div></Ground>} />
);

const signals: React.FC = () => (
  <Pair title="One signal colour per figure"
    doNote="Wheat for every bar, one signal colour for the bar the voice-over is about."
    dontNote="A different colour for every bar. The eye has nowhere to land."
    good={<Ground><BarChart title="Roles by kind" source="Example data" bars={[{ label: "Research", value: 120 }, { label: "Policy", value: 64 }, { label: "Ops", value: 88, highlight: true }, { label: "Comms", value: 40 }]} at={-200} /></Ground>}
    bad={<Ground><Text role="h2" enter="cut" style={{ position: "absolute", left: colX(0), top: 96 }}>Roles by kind</Text>{[COLOR.indigo, COLOR.moss, COLOR.saffron, COLOR.live].map((c, i) => <div key={i} style={{ position: "absolute", left: colX(i * 3) + 60, bottom: 190, width: 200, height: [480, 260, 350, 160][i], backgroundColor: c }} />)}</Ground>} />
);

const map: React.FC = () => (
  <Pair title="One map, every time"
    doNote="<MasterMap>: Equal Earth, Wool land, Warm Paper borders, one signal colour."
    dontNote="A one-off map with a blue sea, green land and a new projection. It won't match the next shot."
    good={<Ground><MasterMap highlight={[{ country: "United States of America", at: -10 }]} /></Ground>}
    bad={<AbsoluteFill style={{ backgroundColor: "#7EC8E3" }}><svg width={VIDEO.width} height={VIDEO.height}><g transform="translate(960 540) scale(1.25 1.6) translate(-960 -540)">{COUNTRIES.map((c, i) => <path key={c.name} d={c.d} fill={i % 3 ? "#4CAF50" : "#8BC34A"} stroke="#222" strokeWidth={1} />)}</g></svg></AbsoluteFill>} />
);

export const DO_DONT: { id: string; component: React.FC<{ stillFrame?: number }> }[] = [
  { id: "DD01-Strand", component: strand },
  { id: "DD02-Shadow", component: shadow },
  { id: "DD03-Corners", component: corners },
  { id: "DD04-Ground", component: ground },
  { id: "DD05-Alignment", component: alignment },
  { id: "DD06-Type", component: type },
  { id: "DD07-Boil", component: boil },
  { id: "DD08-Logo", component: logo },
  { id: "DD09-Signals", component: signals },
  { id: "DD10-Map", component: map },
];
