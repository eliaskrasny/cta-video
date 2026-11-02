// The template gallery: one composition per component, with sample content. Open them in the Studio to see each one move,
// and `npm run stills` renders a reference still of each into out/stills.
import React from "react";
import {
  Arrow, BarChart, COLOR, Callout, DocumentHighlight, EndCard, GRID, Ground, Icon, ICONS, ItemList, LowerThird, MasterMap,
  ArticleCutout, PhotoCutout, QuoteCard, SAFE, SPACE, SURFACE, StatReveal, StrandLoop, TYPE, Text, Timeline, TitleCard, VIDEO, colX, span,
  type IconName, type TypeRole,
} from "../aisss";
import { SectionCard } from "../components/Cards";
import { CareerMapDemo, CAREER_DEMO_DURATION } from "../careermap/CareerMapDemo";

export type GalleryItem = { id: string; component: React.FC<{ stillFrame?: number }>; durationInFrames: number; still: number };

const Specimen: React.FC = () => {
  const rows: [TypeRole, string][] = [
    ["label", "Label · small caps"],
    ["display", "Display title"],
    ["h1", "Heading one"],
    ["h2", "Heading two, panel titles"],
    ["h3", "Heading three, stat labels"],
    ["body", "Body: the sentence on screen."],
    ["quote", "“A quote, in italic.”"],
    ["caption", "Caption under a photo or chart."],
    ["source", "Source: Organisation, year"],
  ];
  return (
    <Ground>
      <div style={{ position: "absolute", left: colX(0), top: 60 }}>
        {rows.map(([r, t]) => (
          <div key={r} style={{ display: "flex", alignItems: "baseline", gap: SPACE.l, marginBottom: 6 }}>
            <Text role="label" tone="quiet" enter="cut" style={{ width: 170, fontSize: TYPE.source.size }}>{r}</Text>
            <Text role={r} enter="cut">{t}</Text>
            <Text role="source" tone="quiet" enter="cut">{`${TYPE[r].size}px`}</Text>
          </div>
        ))}
      </div>
    </Ground>
  );
};

const Palette: React.FC = () => {
  const sw: [string, string, string][] = [
    ["warmPaper", COLOR.warmPaper, "Ground"],
    ["wool", COLOR.wool, "Panels, land"],
    ["wheat", COLOR.wheat, "Shadows, bars. No text"],
    ["bark", COLOR.bark, "Captions, sources"],
    ["ink", COLOR.ink, "Text, Ink cards"],
    ["strand", COLOR.strand, "ONE item per frame"],
    ["clay", COLOR.clay, "Small orange labels"],
    ["live", COLOR.live, "Big fills, highlighter"],
    ["indigo", COLOR.indigo, "Signal (one per figure)"],
    ["moss", COLOR.moss, "Signal (one per figure)"],
    ["saffron", COLOR.saffron, "Tick or underline only"],
  ];
  return (
    <Ground>
      <Text role="h2" enter="cut" style={{ position: "absolute", left: colX(0), top: SAFE.top }}>Video palette</Text>
      <div style={{ position: "absolute", left: colX(0), top: 240, display: "grid", gridTemplateColumns: `repeat(4, ${span(3)}px)`, columnGap: GRID.gutter, rowGap: SPACE.xl }}>
        {sw.map(([n, hex, use]) => (
          <div key={n}>
            <div style={{ height: 120, backgroundColor: hex, outline: n === "warmPaper" ? `2px solid ${COLOR.wheat}` : undefined }} />
            <Text role="label" enter="cut" style={{ marginTop: SPACE.s }}>{n}</Text>
            <Text role="source" tone="quiet" enter="cut">{`${hex} · ${use}`}</Text>
          </div>
        ))}
      </div>
    </Ground>
  );
};

const Grid: React.FC = () => (
  <Ground>
    {Array.from({ length: GRID.columns }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: colX(i), top: SAFE.top, width: GRID.column, height: VIDEO.height - SAFE.top - SAFE.bottom, backgroundColor: COLOR.wool }} />
    ))}
    <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top, right: SAFE.right, bottom: SAFE.bottom, outline: `2px solid ${COLOR.strand}` }} />
    <Text role="label" enter="cut" style={{ position: "absolute", left: colX(0), top: SAFE.top + SPACE.m }}>Safe area · 12 columns · 24 px gutters</Text>
    <Text role="source" tone="quiet" enter="cut" style={{ position: "absolute", left: SAFE.left, bottom: 56 }}>Sources sit here, below the safe area: 120 px from the left, 56 px from the bottom</Text>
  </Ground>
);

const Icons: React.FC = () => (
  <Ground>
    <Text role="h2" enter="cut" style={{ position: "absolute", left: colX(0), top: SAFE.top }}>Icons and arrows</Text>
    <div style={{ position: "absolute", left: colX(0), top: 230, display: "grid", gridTemplateColumns: "repeat(9, 160px)", rowGap: SPACE.l }}>
      {(Object.keys(ICONS) as IconName[]).map((n, i) => (
        <div key={n}>
          <Icon name={n} size="m" at={i} seed={i + 2} />
          <Text role="source" tone="quiet" enter="cut">{n}</Text>
        </div>
      ))}
    </div>
    <Arrow from={{ x: colX(1), y: 820 }} to={{ x: colX(6), y: 760 }} at={6} />
    <Arrow from={{ x: colX(7), y: 860 }} to={{ x: colX(11), y: 760 }} bend={-0.25} tone="strand" at={10} />
  </Ground>
);

const Surfaces: React.FC = () => (
  <Ground>
    <Text role="h2" enter="cut" style={{ position: "absolute", left: colX(0), top: SAFE.top }}>Paper cutouts</Text>
    {(Object.keys(SURFACE) as (keyof typeof SURFACE)[]).map((s, i) => (
      <div key={s} style={{ position: "absolute", left: colX((i % 4) * 3), top: 260 + Math.floor(i / 4) * 330 }}>
        <CutoutDemo fill={s} seed={i + 3} />
      </div>
    ))}
  </Ground>
);
import { Cutout } from "../paper/Cutout";
const CutoutDemo: React.FC<{ fill: keyof typeof SURFACE; seed: number }> = ({ fill, seed }) => (
  <Cutout width={span(3) - 20} height={240} fill={fill} seed={seed} padding={SPACE.l} elevation={fill === "warmPaper" ? 2 : 1}>
    <Text role="label" enter="cut">{fill}</Text>
    <Text role="body" enter="cut" style={{ marginTop: SPACE.s }}>{"Type on\nthis paper"}</Text>
    <Text role="source" tone="quiet" enter="cut" style={{ marginTop: SPACE.xs }}>quiet text</Text>
  </Cutout>
);

export const GALLERY: GalleryItem[] = [
  { id: "T00-Grid", component: Grid, durationInFrames: 24, still: 0 },
  { id: "T01-TypeScale", component: Specimen, durationInFrames: 24, still: 0 },
  { id: "T02-Palette", component: Palette, durationInFrames: 24, still: 0 },
  { id: "T03-Cutouts", component: Surfaces, durationInFrames: 24, still: 0 },
  { id: "T04-TitleCard", component: () => <TitleCard label="AI safety careers" title={"So you’re worried\nabout AI."} subtitle={"Here’s what you can do,\nfrom a first step to a career."} />, durationInFrames: 120, still: 80 },
  { id: "T05-SectionCard", component: () => <SectionCard number="04" label="Policy and governance" title={"Where the rules\nget written"} />, durationInFrames: 72, still: 50 },
  { id: "T06-LowerThird", component: () => <Ground><LowerThird label="Mid-career · Communications" title="Renn Karageorgieva" at={4} /></Ground>, durationInFrames: 96, still: 40 },
  { id: "T07-Callout", component: () => <Ground><Icon name="datacenter" size="l" at={0} style={{ position: "absolute", left: colX(9), top: 420 }} /><Callout x={colX(0)} y={360} label="Technical governance" body={"Tools that check what a data\ncentre is being used for."} pointTo={{ x: colX(9) - 20, y: 500 }} at={6} /></Ground>, durationInFrames: 72, still: 50 },
  { id: "T08-Quote", component: () => <Ground><QuoteCard quote={"We cut jargon and length,\nnot substance."} name="AI Safety Said Simply" role="House style" at={4} /></Ground>, durationInFrames: 96, still: 60 },
  { id: "T09-Stat", component: () => <Ground><StatReveal value={3000} suffix="%" label={"Growth in the AI safety field\nover eight years"} source="Source: 80,000 Hours" at={4} /></Ground>, durationInFrames: 96, still: 60 },
  { id: "T10-Document", component: () => (
      <Ground>
        <Text role="h2" at={0} style={{ position: "absolute", left: colX(0), top: 300 }}>{"Read the law,\nnot the commentary"}</Text>
        <DocumentHighlight label="California · SB 53" title="Transparency in Frontier AI" at={4}
          lines={[{ bar: 0.92 }, { bar: 0.8 }, "A large frontier developer shall write,", "implement, and publish a frontier AI", "framework that describes how it", { bar: 0.88 }, { bar: 0.7 }, { bar: 0.94 }, { bar: 0.6 }]}
          highlight={{ line: 3, phrase: "publish a frontier AI", at: 30 }} />
      </Ground>), durationInFrames: 72, still: 60 },
  { id: "T11-Photo", component: () => <Ground><PhotoCutout x={colX(1)} y={180} width={520} height={600} tilt={-1.5} caption="Placeholder: credit the photographer here" at={4} /><ItemList x={colX(7)} y={260} at={10} items={[{ label: "Was", body: "Crisis communications" }, { label: "Now", body: "Communications at SaferAI" }]} /></Ground>, durationInFrames: 72, still: 60 },
  { id: "T12-Icons", component: Icons, durationInFrames: 48, still: 40 },
  { id: "T13-BarChart", component: () => <Ground><BarChart title="Open roles by kind (illustrative)" source="Source: example data, not real" at={0} bars={[{ label: "Research", value: 120 }, { label: "Policy", value: 64 }, { label: "Operations", value: 88, highlight: true }, { label: "Comms", value: 40 }, { label: "Founding", value: 18 }]} /></Ground>, durationInFrames: 96, still: 80 },
  { id: "T14-Timeline", component: () => <Ground><Timeline title="A short history (illustrative)" at={0} events={[{ year: 2015, text: "Field\nis tiny" }, { year: 2019, text: "First\nfellowships" }, { year: 2023, text: "Governments\nact" }, { year: 2026, text: "Today", accent: true }]} source="Source: example data, not real" /></Ground>, durationInFrames: 96, still: 90 },
  { id: "T15-MapWorld", component: () => <Ground><MasterMap highlight={[{ country: "United States of America", at: 0 }, { country: "United Kingdom", at: 0 }, { country: "Belgium", at: 0 }]} regionLabels={[{ country: "Brazil", at: 0 }, { country: "Russia", at: 0 }]} /></Ground>, durationInFrames: 24, still: 10 },
  { id: "T16-MapZoom", component: () => <Ground><MasterMap camera={[{ at: 0, view: "world" }, { at: 12, view: "atlantic" }]} pins={[{ place: "washingtonDC", at: 64 }, { place: "sacramento", at: 68, side: "left" }, { place: "london", at: 72, side: "left" }, { place: "brussels", at: 76, accent: true }]} /></Ground>, durationInFrames: 120, still: 100 },
  { id: "T17-MapEurope", component: () => <Ground><MasterMap camera={[{ at: 0, view: "europe" }]} signal="moss" highlight={[{ country: "Belgium", at: 0 }]} pins={[{ place: "brussels", at: 0 }, { place: "london", at: 0, side: "left" }, { place: "paris", at: 0, side: "left" }, { place: "geneva", at: 0 }, { place: "berlin", at: 0 }]} /></Ground>, durationInFrames: 24, still: 12 },
  { id: "T18-EndCard", component: () => <EndCard />, durationInFrames: 240, still: 60 },
  { id: "T21-CareerMap", component: CareerMapDemo, durationInFrames: CAREER_DEMO_DURATION, still: 410 },
  { id: "T20-Article", component: () => <Ground><Text role="h2" at={0} style={{ position: "absolute", left: colX(0), top: 300 }}>{"It made the news"}</Text><ArticleCutout x={colX(5)} y={SAFE.top} width={span(7) - 28} height={700} source="Publisher, date published" underline={{ x: 0.06, y: 0.16, width: 0.6, at: 20 }} at={4} /></Ground>, durationInFrames: 72, still: 60 },
  { id: "T19-Loop", component: () => <Ground><Text role="h1" at={0} style={{ position: "absolute", left: colX(0), top: 300 }}>{"A loop runs\noff the edge"}</Text><StrandLoop x={1040} y={640} at={0} /></Ground>, durationInFrames: 48, still: 40 },
];
