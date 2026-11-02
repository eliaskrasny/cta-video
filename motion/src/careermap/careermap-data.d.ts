// Types for careermap-data.js (copied from career-flowchart by `npm run sync:careermap`).
export type LaneId = "technical" | "policy" | "outside" | "comms" | "ops" | "founders";
export type Pt = { x: number; y: number };
export type NodePos = Pt & { lanes: LaneId[]; stage?: number };

export type CNode = {
  id: string;
  type: "hub" | "sat" | "leaf" | "extra" | "bar";
  label: string;
  title?: string;
  lanes: LaneId[];
  st: Record<string, number>;
  pos: NodePos[];
  icon?: string;
  logo?: string;
  parent?: string[];
  lp?: "r" | "t";
  lx?: number;
  ly?: number;
  fan?: number;
  star?: number;
  open?: number;
  kind?: string;
  tag?: string;
  text?: string;
  do?: string;
  url?: string;
  link?: string;
};

export type Lane = { id: LaneId; name: string; y: number; stages: string[]; myth: string; why: string; pay: string; caveat: string };
export type Edge = { kind: "trunk" | "stub" | "lane" | "more" | "leaf"; lanes: LaneId[]; width: number; d: string; dash?: string; part?: string; node?: string };
export type Person = { id: string; name: string; at: string; lane: LaneId; role: string; story: string; route: string[]; ini: string };

declare const CAREERMAP: {
  W: number;
  H: number;
  SX: number[];
  ROW: number[];
  REACHX: number;
  PILLX: number;
  LINE_END: number;
  ENDX: number;
  ICON: Record<string, string>;
  LANES: Lane[];
  LANE: Record<LaneId, Lane>;
  ALL: LaneId[];
  NODES: CNode[];
  NODE: Record<string, CNode>;
  PEOPLE: Person[];
  PERSON: Record<string, Person>;
  EDGES: Edge[];
  extrasAt: (key: string) => CNode[];
  posFor: (n: CNode, lane: LaneId) => NodePos;
};
export default CAREERMAP;
