/*
 * The career map's content and layout: the ONE copy, shared by the website (career-flowchart-draft.html)
 * and the video (aisss-motion copies this file with `npm run sync:careermap`).
 * Edit steps, people, paths and positions here only, then re-sync the video.
 * Works as a plain <script> (sets window.CAREERMAP) and as a module (module.exports).
 * Positions are in chart units: the whole map is W x H.
 */
(function () {
const W = 4520, H = 1840;
const SX = [2080, 2480, 2880, 3280, 3680];        // stage columns
const ROW = [100, 370, 640, 910, 1180, 1450, 1720]; // rows of circles between the path lines
const REACHX = 1560, PILLX = 1770, LINE_END = 3840, ENDX = 4080; // paths split at REACHX, run straight to LINE_END, then meet at ENDX
const ICON = {
  doc:"M7 3h7l4 4v14H7z M14 3v4h4 M10 12h5 M10 16h5", pencil:"M4 20l1-4L16 5l3 3L8 19z M14 7l3 3", chat:"M4 5h16v10H10l-4 4v-4H4z",
  people:"M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6 M16 5.5a3 3 0 0 1 0 5.5 M17 14.3c2.3.8 4 3 4 5.7",
  play:"M8 5v14l11-7z", mail:"M3 6h18v12H3z M3 7l9 6 9-6", search:"M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M16 16l5 5", flag:"M5 21V4 M5 4h12l-2 4 2 4H5",
  star:"M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z", target:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  flask:"M9 3h6 M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3 M8 15h8", book:"M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 21V5 M8 7h7",
  megaphone:"M4 10v4h3l8 4V6l-8 4z M18 9a4 4 0 0 1 0 6", heart:"M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
  compass:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M15.5 8.5l-2 5-5 2 2-5z", briefcase:"M3 8h18v11H3z M9 8V5h6v3 M3 13h18",
  cap:"M2 9l10-5 10 5-10 5z M6 11.5V16c2 2 10 2 12 0v-4.5 M22 9v5", building:"M5 21V4h9v17 M14 9h5v12 M8 8h3 M8 12h3 M8 16h3 M3 21h18",
  repeat:"M4 12a8 8 0 0 1 14-5l2-2v6h-6l2-2a5.5 5.5 0 0 0-9.5 3 M20 12a8 8 0 0 1-14 5l-2 2v-6h6l-2 2a5.5 5.5 0 0 0 9.5-3",
  up:"M12 20V5 M5 12l7-7 7 7"
};

const LANES = [
 { id:"technical", name:"Technical", y:235, stages:["Learn","Build","Programs","Roles","Grow"],
   myth:"You don't need a PhD, and the big AI companies aren't the only employers.",
   why:"Someone has to test, understand and secure these systems. Labs, independent research groups and governments all hire full-time safety researchers and engineers.",
   pay:"Fellowships pay a living stipend or better (Anthropic Fellows pays about $3,850 a week). UK AI Security Institute technical roles run roughly £65k to £145k.",
   caveat:"Entry-level research is the most crowded part of the field, and top fellowships accept under 10%. Aim at neglected areas such as AI security, AI control and technical governance, and expect rejections along the way." },
 { id:"policy", name:"Policy", y:505, stages:["Read","Write","Fellowships","Roles","Grow"],
   myth:"You don't need to code, and you don't need to live in DC.",
   why:"The rules for the most powerful AI systems are being written now. The people writing them are short on colleagues who understand both how government works and what the technology can do.",
   pay:"Horizon Fellowship salaries for the 2027 cohort: $78k junior, $130k fellow, $190k+ senior. GovAI research fellows in DC earn $134.5k to $170k.",
   caveat:"Don't be a generic AI governance person. Pick one tool, such as export controls, liability or safety standards, and get good at it. Most US executive-branch roles need US citizenship; the EU and UK routes don't." },
 { id:"outside", name:"Outside work", y:775, stages:["Speak up","Join","Show up","Go further","Lead"],
   myth:"You don't need a new job to matter.",
   why:"Laws only pass when lawmakers hear from the people they represent. One prepared constituent gets far more attention than a thousand copies of a form email.",
   pay:"This path is unpaid by default. Advocacy groups do hire organisers and communications staff, and PauseAI offers microgrants and small stipends for local organisers.",
   caveat:"These groups don't always agree with each other, so pick the one that matches what you believe. The advice on contacting lawmakers here is written for the US." },
 { id:"comms", name:"Communications", y:1045, stages:["Post","Sharpen","Fellowships","Get hired","Grow"],
   myth:"You don't need a technical background to explain AI risk, and there are paid ways in.",
   why:"Most AI media is either hype or science-fiction panic. Very few people translate what is happening at AI companies, and what regulators should do, into something normal people will watch or read.",
   pay:"Tarbell fellows earn $75k to $120k during a nine-month newsroom placement. Research organisations hire writers, editors and video producers on salary.",
   caveat:"Nobody starts good. Stay concrete, avoid date-stamped predictions, and know whether you are doing journalism or advocacy, because the rules differ." },
 { id:"ops", name:"Operations", y:1315, stages:["Scout","Run something","Programs","Roles","Grow"],
   myth:"The field's biggest talent gap isn't researchers. It's people who can run things.",
   why:"Every research team, advocacy group and fellowship needs someone who makes it run: hiring, budgets, events, managing people. Kairos and Constellation count about 20 research fellowships against about 7 for everyone else, and non-research roles often get fewer than five qualified applicants.",
   pay:"Senior roles can pay six figures. The Center for AI Safety listed a Chief of Staff at $220k to $345k; Encode listed one at $160k to $220k. Smaller organisations pay less.",
   caveat:"Organisations want operators who understand the field, not generic admin. Build context first, and talk to people before sending cold applications." },
 { id:"founders", name:"Founders", y:1585, stages:["Find a gap","Shape it","Incubators","Launch","Scale"],
   myth:"There is room for new organisations, and the important ones don't all exist yet.",
   why:"Funders say money is available and founders are the bottleneck. Halcyon Futures reports helping launch about 30 organisations. Nonprofits and for-profit startups both count.",
   pay:"Incubators cover living costs while you build. Seldon invests up to $500k per startup; Constellation's incubator gives four months of funding and operations support.",
   caveat:"This is the highest-variance path on the map. Most new organisations don't become big successes, so test the idea cheaply before you quit anything." }
];
const LANE = Object.fromEntries(LANES.map(l => [l.id, l]));
const ALL = LANES.map(l => l.id);

const NODES = [];
// Trunk node at an explicit position. "hub" = big dark circle, "sat" = hangs off one or more hubs.
const T = (id, x, y, type, label, o) => NODES.push({ id, type, label, lanes: [], st: {}, pos: [{ x, y, lanes: [] }], ...o });
// Path node: row of circles, stage column, slot (-1..1), paths it sits on. o.also = extra positions for paths that aren't adjacent.
const L = (id, row, stage, slot, label, lanes, o = {}) => {
  const all = [[row, stage, slot, lanes], ...(o.also || [])], st = {};
  const pos = all.map(([r, s, sl, ls]) => { ls.forEach(l => st[l] = s); return { x: SX[s] + sl * 135, y: ROW[r], stage: s, lanes: ls }; });
  NODES.push({ id, type: "leaf", label, lanes: ALL.filter(l => l in st), st, pos, ...o });
};
// Extra option: not drawn on the map, listed in panels and the list view. at = "lane:stage" slots, or ids of circles it sits under.
const X = (id, at, label, o) => {
  const st = {}; let trunk = false;
  at.forEach(a => { const [l, s] = a.split(":"); if (s !== undefined) return st[l] = +s;
    const p = NODES.find(n => n.id === a); if (!p.lanes.length) trunk = true; p.lanes.forEach(pl => pl in st || (st[pl] = p.st[pl])); });
  NODES.push({ id, type: "extra", label, at, trunk, lanes: ALL.filter(l => l in st), st, pos: [], ...o });
};

/* ---------- trunk ---------- */
T("start", 110, 910, "hub", "START HERE", { icon:"flag", kind:"Start", tag:"No experience needed",
  text:"Most people stall before they start because they think they aren't qualified. You don't need to be. The map reads left to right: stay interested, learn the basics, then pick one of six paths. Circles with more than one colour in their ring sit on several paths at once, so early steps keep more than one door open.",
  do:"Press Next to walk through the first steps, and add three of them to your plan." });
T("stay", 370, 910, "hub", "STAY INTERESTED", { icon:"repeat", kind:"Habit", tag:"A few minutes a day", parent:["start"],
  text:"Most people who watch a video about AI risk feel worried for a day and then forget. The people who end up doing something keep the topic in their week: a podcast on the commute, a few good accounts in their feed, one friend to talk to. Make sure you understand the risks well enough to care about them, because that is what carries you through the boring parts.",
  do:"Set up one of the six habits around this circle right now. It takes two minutes." });
T("podcasts", 270, 690, "sat", "Listen:\npodcasts", { logo:"80k", parent:["stay"], kind:"Habit", tag:"Free · on your commute", url:"https://80000hours.org/podcast/", link:"Open the podcast",
  text:"The 80,000 Hours Podcast runs long interviews with people who work on AI safety and policy. AXRP goes deeper on technical research. Hearing people in the field talk for an hour is the easiest way to pick up how they think.",
  do:"Subscribe to the 80,000 Hours Podcast and queue one AI episode for your next commute." });
T("watch", 420, 690, "sat", "Watch:\nexplainers", { logo:"youtube", parent:["stay"], kind:"Habit", tag:"Free · 10 to 30 min", url:"https://www.youtube.com/@RationalAnimations", link:"Open a channel",
  text:"Rob Miles, Rational Animations and 80,000 Hours' AI in Context channel explain the core ideas visually and well.",
  do:"Watch one video tonight and send it to a friend with one line on why it stuck." });
T("real", 345, 480, "sat", "Make it real:\nAI 2027", { logo:"ai2027", parent:["stay"], kind:"Reading", tag:"Free · about 1 hr", url:"https://ai-2027.com", link:"Read AI 2027",
  text:"Worry fades unless you understand the actual argument. AI 2027 is a concrete scenario for how the next few years could go. 80,000 Hours' problem profile lays out the case and where the uncertainty is. Read one and decide where you agree and disagree.",
  do:"Read one of them this week and write down your three biggest questions." });
T("follow", 270, 1130, "sat", "Follow people\nin the field", { logo:"x", parent:["stay"], kind:"Habit", tag:"Free · 2 minutes", url:"https://x.com", link:"Open X",
  text:"Following working researchers and policy people shows you what the field is arguing about this week. Start with the organisations on this map, then follow the people they repost. Good first follows include Peter Wildeford, Miles Brundage, Helen Toner, Kelsey Piper and Neel Nanda.",
  do:"Follow five accounts now, starting with organisations on this map." });
T("news", 420, 1130, "sat", "Read:\nnewsletters", { logo:"transformer", parent:["stay"], kind:"Habit", tag:"Free · weekly", url:"https://www.transformernews.ai", link:"Open Transformer",
  text:"Transformer covers AI power and policy every week. The Center for AI Safety's AI Safety Newsletter is a short digest. Either one keeps you current in ten minutes a week.",
  do:"Subscribe to one and read it for four weeks before you judge it." });
T("buddy", 345, 1350, "sat", "Find your\npeople", { logo:"aisafety", parent:["stay"], kind:"Community", tag:"Free", url:"https://www.aisafety.com/communities", link:"Find a community",
  text:"It is much easier to keep going with other people. AISafety.com lists local groups, online communities and events around the world.",
  do:"Find the nearest group or one online community and put its next event in your calendar." });

T("learn", 640, 910, "hub", "LEARN THE BASICS", { icon:"book", kind:"Step 1", tag:"A few weeks, not six months", parent:["stay"],
  text:"Build enough context to know the vocabulary and the main problems. Don't fall into the trap of collecting courses for six months because you are scared you aren't qualified yet. One course and a reading habit is enough to move on.",
  do:"Apply to BlueDot's AGI Strategy course today, and do the two-hour intro while you wait." });
T("bd_intro", 545, 690, "sat", "BlueDot:\nFuture of AI", { logo:"bluedot", parent:["learn"], kind:"Course", tag:"Free · 2 hrs · no application", url:"https://bluedot.org", link:"Open BlueDot",
  text:"A two-hour, self-paced introduction to where AI is heading and why it matters. No application and no background needed.",
  do:"Do it in one sitting this week." });
T("bd_agi", 690, 690, "sat", "BlueDot:\nAGI Strategy", { logo:"bluedot", parent:["learn"], kind:"Course", tag:"Free · about 25 hrs · short application", url:"https://bluedot.org/courses/agi-strategy", link:"Apply now", star:1,
  text:"The course most paths on this map start with. About 25 hours with a small group and a facilitator. It is built for people redirecting skills they already have, as well as newcomers. In an 80,000 Hours survey of AI safety hiring managers, BlueDot courses were the most-mentioned way to get up to speed.",
  do:"Apply in the next 24 hours. This is the single step we would pick if you only do one." });
T("reading", 575, 1130, "sat", "Read 30 min\na day", { icon:"book", parent:["learn"], kind:"Habit", tag:"Free · 30 min a day", url:"https://80000hours.org/2026/09/how-to-get-into-ai-safety-in-three-months/", link:"Read the 3-month guide",
  text:"A daily reading habit beats a weekend binge. Use 80,000 Hours' essential resources, and read its guide to getting into AI safety in three months for a plan to follow.",
  do:"Block 30 minutes in your calendar for each of the next 14 days." });
T("fieldmap", 710, 1130, "sat", "AISafety.com\nfield map", { logo:"aisafety", parent:["learn"], kind:"Directory", tag:"Free", url:"https://www.aisafety.com", link:"Open AISafety.com",
  text:"A directory of the whole field: courses, communities, events, funders, jobs and a map of organisations. Ten minutes here shows you how much exists.",
  do:"Browse the map and note three organisations you'd want to work with." });

T("student", 960, 560, "hub", "STUDENT", { icon:"cap", kind:"If you're at university", tag:"Time is on your side", parent:["learn"],
  text:"Don't try to build the correct AI safety resume too early. Use university to test several versions of yourself cheaply. Your major is not an obstacle; it is usually your advantage. Pair organising with something that still exists after you graduate: a paper, a project, a policy memo, a thesis or an internship.",
  do:"Join your campus AI safety group this week. If there isn't one, start one." });
T("campus", 790, 400, "sat", "Join or start a\ncampus group", { logo:"aisafety", parent:["student"], kind:"Community", tag:"Free · this week", url:"https://www.aisafety.com/communities", link:"Find your campus group",
  text:"A campus group gives you people, mentors, speakers and proof on your resume that you know the field. If none exists, start one. Programs such as Pathfinder and the AI Safety Seeding Initiative mentor and fund new organisers.",
  do:"Look up your university's group and go to its next meeting. If there isn't one, message two friends about starting it." });
T("pathfinder", 905, 310, "sat", "Pathfinder\nFellowship", { logo:"kairos", parent:["student"], kind:"Program", tag:"Mentor + funding · one semester", url:"https://pathfinder.kairos-project.org/", link:"Open Pathfinder",
  text:"Kairos's fellowship for students who run AI safety or AI policy groups. You get a weekly mentor, $500 in starter funding and more for group activities. Past fellows have gone on to Coefficient Giving, Constellation, the UK AI Security Institute and Redwood Research. Fall 2026 is closed.",
  do:"Join the interest list so you hear when the next round opens." });
T("major", 1035, 310, "sat", "Match your major\nto a project", { icon:"target", parent:["student"], kind:"Action", tag:"One small project",
  text:"Computer science: ask a professor or grad student to supervise a small technical safety project. Economics: write about how AI affects markets. Politics: analyse a real AI bill for your thesis. Journalism: report on how your university is adopting AI.",
  do:"Write one sentence: my major is X, so my project is Y. Send it to one professor." });
T("uni", 1150, 400, "sat", "Use what your\nuniversity gives", { icon:"building", parent:["student"], kind:"Action", tag:"While you still have it",
  text:"Professors who will supervise you, research credits, student funding, free rooms and classmates willing to build things for no money. These disappear the day you graduate.",
  do:"Ask your department whether you can get research credit for an AI safety project next term." });

T("mid", 960, 1260, "hub", "MID-CAREER", { icon:"briefcase", kind:"If you already have a career", tag:"Keep your seniority", parent:["learn"],
  text:"Do not throw away your seniority to become a beginner. Work out what people already trust you to do: securing systems, managing teams, hiring, negotiating with governments, explaining technical ideas, running large projects. Then find where AI safety has that exact problem.",
  do:"Write down the one thing you are unusually good at, and name two organisations on this map that need it." });
T("successif", 790, 1420, "sat", "Successif\nadvising", { logo:"successif", parent:["mid"], kind:"Advice", tag:"Free · 1:1", url:"https://www.successif.org/", link:"Open Successif",
  text:"Free career advising built for experienced professionals moving into AI safety and governance, with workshops and introductions.",
  do:"Apply for advising. Bring your CV and one question." });
T("hip", 905, 1510, "sat", "Impact\nAccelerator", { logo:"hip", parent:["mid"], kind:"Program", tag:"Free · 6 weeks · online", url:"https://www.highimpactprofessionals.org/impact-accelerator", link:"Open the program",
  text:"High Impact Professionals runs a free six-week online program for mid-career and senior people planning a move into high-impact work, in groups of about five with a facilitator. It added an entrepreneurship track in 2026.",
  do:"Check the next cohort date and apply." });
T("translate", 1035, 1510, "sat", "Translate your\nexpertise", { icon:"repeat", parent:["mid"], kind:"Action", tag:"A few weeks of reading",
  text:"The most common reason senior people get rejected is missing context about the field, not missing skill. Spend enough time learning AI safety that you can describe your existing expertise in its language.",
  do:"Rewrite the top third of your CV for one specific AI safety job posting." });
T("talk10", 1150, 1420, "sat", "10 chats before\n50 applications", { icon:"chat", parent:["mid"], kind:"Action", tag:"One message a day",
  text:"Hiring for senior roles in this field runs on relationships. Ten targeted conversations will teach you more than fifty cold applications, and one of them may lead to an introduction.",
  do:"Message one person who has the job you want and ask for 20 minutes." });
// For everyone, whichever branch they took: three stops fanned above "Pick a path", because they are what help you pick.
T("advising", 1240, 700, "sat", "Career\nadvising", { logo:"80k", parent:["pick"], kind:"Advice", tag:"Free · 1:1 call · students and professionals", url:"https://80000hours.org/speak-with-us/", link:"Apply for a call",
  text:"80,000 Hours offers free one-on-one career advising to students and working professionals alike. Advisers point you to organisations, jobs and programs you didn't know existed, and often introduce you to people working there.",
  do:"Apply for a call today. The form takes about 20 minutes." });
T("jobs", 1350, 640, "sat", "Job board", { logo:"80k", parent:["pick"], kind:"Jobs", tag:"Free · hundreds of roles", url:"https://jobs.80000hours.org", link:"Open the job board",
  text:"The 80,000 Hours job board lists hundreds of open roles and internships across research, policy, operations and communications. Read it before you feel ready, to learn what employers actually ask for.",
  do:"Open three listings that sound like you. Write down the two requirements you don't meet yet." });
T("funding", 1460, 700, "sat", "Transition\nfunding", { logo:"bluedot", parent:["pick"], kind:"Funding", tag:"$20k to $200k · rolling", url:"https://bluedot.org/grants/career-transition", link:"Open Career Transition Grants",
  text:"Money shouldn't be what stops you. In September 2026 Coefficient Giving handed its career development and transition funding to BlueDot. BlueDot's Career Transition Grants usually start at $20k and go up to $200k, for people ready to switch full-time: time to produce research or policy work, fill a skill gap or test a path. The application takes about 45 minutes and asks for recent work, milestones and a simple budget. For something smaller, Rapid Grants go up to $20k.",
  do:"Check BlueDot's grants page and note what you'd ask for and why." });

T("pick", 1330, 910, "hub", "PICK A PATH", { icon:"compass", kind:"Step 2", tag:"Six paths", parent:["learn"],
  text:"Six paths, and most don't need a technical background. They overlap on purpose: a circle with several colours in its ring belongs to several paths, so you can start before you have fully decided. Every path starts the same way, by reaching out to people in your field, and ends the same way, by helping build the field. Your route probably won't be a straight line.",
  do:"Click a coloured path name to see the whole route and what it pays, then press Start this path." });

/* ---------- the two steps every path shares: one node where the paths split, one bar where they end ---------- */
NODES.push({ id:"reach", type:"hub", label:"REACH OUT", title:"Reach out to people in your field", lx:-60, ly:-68, icon:"chat", lanes:ALL, onTrunk:1, st:Object.fromEntries(ALL.map(l => [l, -1])), pos:[{ x:REACHX, y:910, lanes:ALL }],
  kind:"Every path", tag:"Free · one message a day",
  text:"This is the step every path shares. People in AI safety love to help, and they want more people in the field. Find someone doing the work you want to do, whatever your field is, and ask them one specific question. Most will say yes to twenty minutes. One conversation often leads to an introduction, a project or a job you would never have seen posted.",
  do:"Message one person today. Three sentences: who you are, what you liked about their work, and one specific question." });
// Where the paths meet again. Its three stops fan out forward, like the paths do from "Reach out", and come after it in every path's step order (stage 10).
const END = o => ({ lanes: ALL, st: Object.fromEntries(ALL.map(l => [l, 10])), parent: ["build"], lp: "r", fan: 1, ...o });
T("build", ENDX, 910, "hub", "BUILD THE\nFIELD", { title:"Help build the field", icon:"people", lanes:ALL, st:Object.fromEntries(ALL.map(l => [l, 9])),
  kind:"Every path", tag:"Where every path ends",
  text:"Every path ends the same way: by leaving the field bigger and better than you found it. Go to events and meet people in person. Reach back out to the people starting where you started. And keep watching for problems nobody is working on yet, because the field changes as fast as the technology does.",
  do:"Pick one of the three this month: an event to go to, a newcomer to help, or a problem to write down." });
T("events", ENDX + 240, 700, "sat", "Go to\nevents", END({ icon:"people", kind:"Every path", tag:"Conferences and meetups", url:"https://www.aisafety.com/events", link:"Open the events calendar",
  text:"Whatever path you're on, people hire people they have met. AISafety.com keeps a calendar of conferences, workshops and meetups. EA Global has a large AI safety track and runs in San Francisco (19 to 21 March 2027), London (28 to 30 May 2027) and Washington DC (15 to 17 October 2027). ControlConf covers AI control research. One good conversation in person can do more than a month of applications.",
  do:"Pick one event in the next three months and apply or register today." }));
T("giveback", ENDX + 240, 910, "sat", "Reach back\nout", END({ icon:"chat", kind:"Every path", tag:"An hour a month",
  text:"Someone answered your first message. Return the favour. Reply to the people who reach out to you, mentor a newcomer through a program such as SPAR, introduce people who should know each other, and write up how you got in so the next person has a map.",
  do:"Reply to every cold message you get this month, and offer one person twenty minutes." }));
T("problems", ENDX + 240, 1120, "sat", "Find new\nproblems", END({ icon:"search", kind:"Every path", tag:"Ongoing", url:"https://coefficientgiving.org/tailwind", link:"See Project Tailwind's idea list",
  text:"AI keeps changing, and so do the problems. New capabilities open up risks nobody is working on yet, and people inside the field are usually the first to notice. Keep a running list of the gaps you see. Funders publish lists of the research and organisations they want to exist, and some of the field's most useful projects started as one person's note to self.",
  do:"Start a list today, and add one problem a month that you think nobody owns." }));

/* ---------- paths ---------- */
// Row 0: technical
L("bdtech",0,0,-.6,"BlueDot: Technical\nAI Safety",["technical"],{logo:"bluedot",kind:"Course",tag:"Free · part-time",url:"https://bluedot.org",link:"Open BlueDot",
  text:"The technical version of BlueDot's course: why making AI safe is hard, what current techniques can and can't do, and where you could contribute.",do:"Apply to the next cohort."});
L("arena",0,0,.6,"ARENA",["technical"],{logo:"arena",kind:"Course",tag:"Free online · or 5 weeks in London",url:"https://www.arena.education/",link:"Open ARENA",
  text:"A hands-on machine learning curriculum focused on AI safety. The material is free online, and there is a funded in-person bootcamp in London several times a year.",do:"Open the first chapter and do one exercise tonight."});
L("labproject",0,1,-1,"Join a lab\nproject",["technical"],{icon:"flask",kind:"Action",tag:"One semester",
  text:"A supervised project in a university lab is how many researchers start. It doesn't need to be an AI safety lab: any solid machine learning research experience counts.",do:"Email one professor or grad student with a two-line project idea."});
L("apart",0,1,0,"Apart\nhackathons",["technical"],{logo:"apart",kind:"Event",tag:"Free · one weekend",url:"https://apartresearch.com",link:"Open Apart Research",
  text:"Weekend research sprints on AI safety topics, online and in local hubs. A fast way to finish a first project and find collaborators.",do:"Sign up for the next sprint."});
L("neglected",0,1,1,"Pick a\nneglected area",["technical"],{icon:"target",kind:"Action",tag:"Choose before you specialise",
  text:"Some areas, such as mechanistic interpretability, are crowded. Three that need more people: AI security, which stops bad actors or the models themselves from getting past the guardrails. AI control, which is about supervising huge numbers of AI systems that might misbehave. Technical governance, which builds tools such as ways to check what a data centre is being used for, so countries can verify each other.",do:"Read one paper from each area and pick the one you'd happily spend a year on."});
L("mats",0,2,-1,"MATS",["technical"],{logo:"mats",kind:"Fellowship",tag:"Funded · about 10 weeks",url:"https://www.matsprogram.org/",link:"Open MATS",
  text:"The best-known research fellowship in the field. You work with a mentor on a research project, with a stipend, compute and housing. Around 80% of alumni now work in AI safety. Fewer than 10% of applicants get in.",do:"Read the mentor list and note two whose work you could contribute to."});
L("anthfellows",0,2,0,"Anthropic\nFellows",["technical"],{logo:"anthropic",kind:"Fellowship",tag:"About $3,850 a week · 4 months",url:"https://www.anthropic.com",link:"Open Anthropic",
  text:"A paid safety research fellowship with mentorship from Anthropic researchers. It doesn't require a PhD or published papers, and a large share of fellows have received full-time offers.",do:"Check when the next cohort opens and put the date in your calendar."});
L("lasr",0,2,1,"LASR Labs",["technical"],{logo:"lasr",kind:"Fellowship",tag:"Funded · 13 weeks · London",url:"https://www.lasrlabs.org/",link:"Open LASR Labs",
  text:"A 13-week research program in London that runs three times a year, with a stipend of about £15,000. Good if you're based in the UK or Europe.",do:"Check the next application window."});
L("labs",0,3,-1,"Lab safety\nteams",["technical"],{logo:"deepmind",kind:"Employer",tag:"Full-time",url:"https://jobs.80000hours.org",link:"See open roles",
  text:"Anthropic, Google DeepMind and OpenAI all have safety teams with direct access to the most capable models. Whether working at a lab helps or speeds things up is a real debate in the field, so read both sides.",do:"Read three lab safety job postings and list the skills they share."});
L("redwood",0,3,0,"Redwood\nResearch",["technical"],{logo:"redwood",kind:"Employer",tag:"Full-time",url:"https://www.redwoodresearch.org",link:"Open Redwood",
  text:"An independent research group known for its work on AI control. One of several independent groups that hire, alongside Apollo Research, FAR.AI and Palisade Research.",do:"Read one Redwood post on AI control."});
L("metr",0,3,1,"METR",["technical"],{logo:"metr",kind:"Employer",tag:"Full-time",url:"https://metr.org",link:"Open METR",
  text:"An independent group that tests what frontier AI systems can actually do, so that companies and governments know what they are dealing with.",do:"Read METR's latest evaluation report."});
L("publish",0,4,-.6,"Publish and\npresent",["technical"],{icon:"doc",kind:"Action",tag:"After every project",
  text:"Write up what you did and put it where the field reads: arXiv, the Alignment Forum, workshop papers. Public work is what gets you the next role, and it is how other researchers find you.",do:"Turn your last project into a two-page write-up and post it."});
L("leadresearch",0,4,.6,"Lead a\nresearch agenda",["technical"],{icon:"up",kind:"Action",tag:"Two to four years in",
  text:"After a first role, the next steps are leading projects, managing other researchers, or taking a neglected problem and building a team around it. People who can both do research and manage it are in short supply.",do:"Ask your manager or mentor what leading a project would take, and volunteer for the next one."});
// Row 1: technical + policy
L("bdgov",1,0,-.6,"BlueDot:\nAI Governance",["policy"],{logo:"bluedot",kind:"Course",tag:"Free · no technical background",url:"https://bluedot.org",link:"Open BlueDot",
  text:"A fast way to get up to speed on how advanced AI could be governed. No technical background needed.",do:"Apply to the next cohort."});
L("readlaw",1,0,.6,"Read one real\nAI law",["policy"],{icon:"doc",kind:"Action",tag:"One evening",
  text:"Read actual law and actual company safety policies, not commentary about them. Try California's SB 53 or a chapter of the EU AI Act, and one AI company's published safety framework.",do:"Read one tonight and write five bullet points on what it requires."});
L("spar",1,1,-1,"SPAR",["technical","policy"],{logo:"kairos",kind:"Program",tag:"Part-time · remote · 3 months",url:"https://spar.kairos-project.org/",link:"Open SPAR",also:[[4,2,0,["comms","ops"]]],
  text:"A part-time, remote program that pairs you with a mentor on a real project. Most projects are technical safety research and nearly 30% are AI policy, but there is also a generalist stream for field-building and operations questions, and a few communications projects. The latest round had more than 800 mentees. It is the easiest first rung on the ladder. Applications for Spring 2027 open around December.",do:"Join the mailing list so you see the project list when applications open, and note which stream fits you."});
L("techgov",1,1,0,"Technical\ngovernance",["technical","policy"],{icon:"compass",kind:"Focus area",tag:"Where the two paths meet",
  text:"Policy that needs engineers: checking what data centres are used for, tracking AI chips, building tests that regulators can rely on. Technical people who can write for policymakers are rare, and policy people who understand the hardware are rarer.",do:"Read GovAI's report on computing power and AI governance."});
L("tool",1,1,1,"Pick one\ntool",["policy"],{icon:"target",kind:"Action",tag:"Decide this month",
  text:"Who writes the rule that makes a company responsible if its AI causes serious damage? Who sets the standard for whether a system is safe to release? Pick one tool, such as export controls, liability or safety standards, and become the person who knows it.",do:"Choose one tool and find the three people who write about it most."});
L("astra",1,2,-1,"Astra\nFellowship",["technical","policy"],{logo:"constellation",kind:"Fellowship",tag:"About $8,400 a month · Berkeley",url:"https://constellation.org/programs",link:"Open Constellation",
  text:"Constellation's three-to-six-month fellowship in Berkeley, with separate streams for empirical research and for strategy and governance. More than 80% of the first cohort now work full-time in AI safety.",do:"Read the mentor list for the stream that fits you."});
L("era",1,2,0,"ERA\nFellowship",["technical","policy"],{logo:"era",kind:"Fellowship",tag:"Funded · 10 weeks · Cambridge UK",url:"https://erafellowship.org",link:"Open ERA",
  text:"A ten-week summer fellowship in Cambridge with tracks for technical safety, technical governance and AI governance.",do:"Check next summer's application dates."});
L("horizon",1,2,1,"Horizon\nFellowship",["policy"],{logo:"horizon",kind:"Fellowship",tag:"$78k to $190k+ · Washington DC",url:"https://horizonpublicservice.org/",link:"Open Horizon",
  text:"Places fellows in Congress, federal agencies and think tanks for one to two years, with training in how government works. Applications for the 2027 cohort closed in August 2026.",do:"Sign up for updates and start the policy memo you'd need for the application."});
L("aisi",1,3,-1,"UK AI Security\nInstitute",["technical","policy"],{logo:"aisi",kind:"Employer",tag:"£65k to £145k",url:"https://www.aisi.gov.uk",link:"Open AISI",
  text:"A government body that tests frontier AI systems and advises on policy. It hires researchers, engineers and policy staff, and proves this is a real career inside government.",do:"Read one open role and note the skills it asks for."});
L("rand",1,3,0,"RAND",["technical","policy"],{logo:"rand",kind:"Employer",tag:"Full-time",url:"https://www.rand.org",link:"Open RAND",
  text:"A large research organisation whose AI and security teams work on topics such as protecting AI model weights from theft. It hires both technical and policy researchers.",do:"Read the summary of RAND's report on securing model weights."});
L("cset",1,3,1,"Think tanks:\nCSET",["policy"],{logo:"cset",kind:"Employer",tag:"Full-time",url:"https://cset.georgetown.edu",link:"Open CSET",
  text:"Georgetown's Center for Security and Emerging Technology is one of several think tanks that hire AI policy researchers, alongside GovAI, IAPS and CNAS.",do:"Read one CSET brief on a topic near your chosen tool."});
L("mentor",1,4,0,"Mentor the\nnext cohort",["technical","policy"],{logo:"kairos",kind:"Action",tag:"A few hours a week",url:"https://spar.kairos-project.org/",link:"Open SPAR",
  text:"Once you've done a program, come back as a mentor. SPAR's latest round had more than 250 mentors. Mentoring is how researchers and policy people learn to lead, and it is how the field grows.",do:"Draft a small project you could supervise and submit it for the next round."});
// Row 2: policy + outside work
L("etp",2,0,-.6,"Emerging Tech\nPolicy Careers",["policy"],{logo:"etp",kind:"Guide",tag:"Free",url:"https://emergingtechpolicy.org",link:"Open the guide",
  text:"The clearest map of routes into US technology policy: fellowships, graduate programs, think tanks and how Congress and the agencies actually work.",do:"Read the page for the institution you'd most like to work in."});
L("rep",2,0,.6,"Meet your\nrepresentative",["outside"],{icon:"mail",kind:"Action",tag:"15 minutes · this week",
  text:"Talk to your representatives directly. Skip petitions and letter templates, because identical messages get batched and ignored. Book a short call or visit the local office with two clear asks: make the biggest AI projects tell the government what they are building, and make a company legally responsible if its AI causes serious damage.",do:"Find your representative's local office number and ask for a 15-minute constituent meeting."});
L("memo",2,1,-1,"Write one memo\nand publish it",["policy"],{icon:"pencil",kind:"Action",tag:"Two weekends",url:"https://fas.org/day-one-project/",link:"See Day One memos",
  text:"A short policy memo on a real question is worth more than another credential. For a model, look at the Federation of American Scientists' Day One Project, which publishes concise, actionable memos from outside contributors.",do:"Write two pages on one specific question and post it where people can find it."});
L("field",2,1,0,"Bring AI into\nyour field",["policy"],{icon:"book",kind:"Action",tag:"For academics",
  text:"If you already research law, economics, political science or philosophy, you don't have to leave your field. Bring the AI question into it. Then take one concrete first step: apply for a small grant, join a workshop, or co-author a paper with someone already working on it.",do:"Find one person in your discipline who works on AI and suggest a co-authored paper."});
L("localgroup",2,1,1,"Find a\nlocal group",["outside"],{logo:"aisafety",kind:"Community",tag:"Free",url:"https://www.aisafety.com/communities",link:"Find a group",
  text:"Acting with other people is easier and works better than acting alone. Look for a local AI safety or advocacy group, or an online one if nothing is nearby.",do:"Go to one meeting this month."});
L("govai",2,2,-1,"GovAI\nfellowships",["policy"],{logo:"govai",kind:"Fellowship",tag:"Funded · 3 months · London or DC",url:"https://www.governance.ai/opportunities",link:"Open GovAI",
  text:"The Centre for the Governance of AI runs funded three-month fellowships in London and Washington DC, for research careers and for applied policy careers.",do:"Read the latest fellowship call and note the deadline."});
L("iaps",2,2,0,"IAPS\nFellowship",["policy"],{logo:"iaps",kind:"Fellowship",tag:"$15k to $22k · 3 months",url:"https://www.iaps.ai",link:"Open IAPS",
  text:"The Institute for AI Policy and Strategy runs a fully funded three-month fellowship for professionals from many backgrounds who want practical policy skills. A Spring 2027 round has been advertised.",do:"Read last year's fellow projects to see the level expected."});
L("talos",2,2,1,"Talos\nFellowship",["policy"],{logo:"talos",kind:"Fellowship",tag:"EU route · paid placement",url:"https://www.talosnetwork.org/talos-fellowship",link:"Open Talos",
  text:"The route into European AI policy: an online course on EU policy, a summit in Brussels and an optional paid placement. US citizenship is not needed.",do:"Check the next cohort's dates."});
L("euai",2,3,-1,"EU AI Office",["policy"],{logo:"eu",kind:"Employer",tag:"Brussels",url:"https://digital-strategy.ec.europa.eu/en/policies/ai-office",link:"Open the AI Office",
  text:"The body that implements the EU AI Act. Governments are building real institutions for AI, and they need staff who understand the technology.",do:"Read what the Office is responsible for and what kinds of staff it hires."});
L("encode",2,3,0,"Encode",["policy","outside"],{logo:"encode",kind:"Advocacy group",tag:"Volunteer or staff",url:"https://encodeai.org",link:"Open Encode",
  text:"A youth-led group that started with students organising against a California ballot measure and grew into an organisation that has helped push state AI safety laws such as California's SB 53. You can volunteer, start a chapter or work there.",do:"Read Encode's current campaigns and sign up for one."});
L("ari",2,3,1,"Americans for Resp.\nInnovation (ARI)",["policy","outside"],{logo:"ari",kind:"Advocacy group",tag:"Guides + staff roles",url:"https://ari.us",link:"Open ARI",
  text:"A policy advocacy organisation with guides for citizens who want to act, and staff roles in policy and communications.",do:"Read their guide to contacting lawmakers."});
L("techcongress",2,4,-.6,"Into Congress:\nTechCongress",["policy"],{logo:"techcongress",kind:"Fellowship",tag:"About $100k · one year",url:"https://techcongress.io",link:"Open TechCongress",
  text:"The next rung for people with technical or scientific backgrounds. TechCongress places technologists in congressional offices for about a year. The AAAS Science and Technology Policy Fellowship does the same for scientists and engineers, and has an AI cohort. Some states run their own versions, such as California's.",do:"Read one current fellow's profile and check the next application window."});
L("statebill",2,4,.6,"Help pass a\nstate law",["policy","outside"],{icon:"building",kind:"Action",tag:"Where much AI law is made",
  text:"A lot of AI law is being written in state capitals. Testify at a hearing, submit written comments, or volunteer with a group working on a bill, the way Encode did with California's SB 53. Policy people bring the drafting; citizens bring the pressure.",do:"Find out whether your state has an AI bill moving and who is backing it."});
// Row 3: outside work + communications
L("talk",3,0,0,"Talk about it",["outside","comms"],{icon:"chat",kind:"Action",tag:"Free · today",
  text:"Most people have never heard a calm, clear explanation of AI risk from someone they trust. Explaining it to one friend is also the cheapest test of whether you'd enjoy doing it for a living.",do:"Explain one thing you learned to one person today, without jargon."});
L("pauseai",3,1,-1,"PauseAI",["outside"],{logo:"pauseai",kind:"Advocacy group",tag:"Free tools · local groups",url:"https://pauseai.info/action",link:"Open PauseAI's tools",
  text:"A volunteer movement with free letter and meeting builders that walk you through contacting lawmakers step by step. PauseAI US reports 47 local groups in 29 states and 192 meetings with members of Congress in 2024 and 2025.",do:"Use the meeting builder to draft your request to your representative."});
L("controlai",3,1,0,"ControlAI",["outside"],{logo:"controlai",kind:"Advocacy group",tag:"Campaign tools",url:"https://controlai.com",link:"Open ControlAI",
  text:"A campaign group with tools for contacting lawmakers and briefings written for the public.",do:"Send one message through their tool, rewritten in your own words."});
L("oped",3,1,1,"Write an op-ed\nor letter",["outside","comms"],{icon:"pencil",kind:"Action",tag:"One evening",
  text:"Local papers print letters from residents, and lawmakers' staff read them. It is advocacy and writing practice at the same time, and a published piece is something you can point to later.",do:"Write 200 words to your local paper about one AI issue that affects your town."});
L("table",3,2,-1,"Table or\ndemonstrate",["outside"],{icon:"megaphone",kind:"Action",tag:"Microgrants available",url:"https://pauseai.info/microgrants",link:"See PauseAI microgrants",
  text:"Run a community table or join a peaceful demonstration. PauseAI's microgrants, usually under €2,000, cover things like print materials and banners.",do:"Ask your local group when the next event is and offer to take a shift."});
L("local",3,2,0,"Show up\nlocally",["outside"],{icon:"building",kind:"Action",tag:"One evening",
  text:"City councils, school boards and state hearings all make decisions about AI. When an agency asks for public comments, write your own: individual comments count, and copied ones get grouped together.",do:"Find the next public meeting near you with AI on the agenda and go."});
L("frame",3,2,1,"Frame\nFellowship",["comms"],{logo:"frame",kind:"Fellowship",tag:"10 weeks · San Francisco · costs covered",url:"https://www.framefellowship.com/",link:"Open Frame",
  text:"A ten-week residential program for content creators covering AI and its effects on society, with housing, a stipend and mentoring from established creators. For people who have already posted and want to get better.",do:"Post two more pieces, then apply with your best one."});
L("give",3,3,-.6,"Give",["outside"],{logo:"longview",kind:"Funding",tag:"Any amount",url:"https://www.longview.org/fund/emerging-challenges-fund/",link:"Open the fund",
  text:"If you'd rather fund the work than do it, give through a fund where specialists choose the projects. Longview's Emerging Challenges Fund is open to any donor.",do:"Set up a small monthly donation, even $10."});
L("indie",3,3,.6,"Go\nindependent",["comms"],{icon:"play",kind:"Action",tag:"Your own channel",
  text:"Video essays on YouTube, policy analysis on Substack, threads on X, and the most neglected of all, short-form video. A clean 60-second breakdown can reach people who will never read a newspaper.",do:"Pick the platform you already use and commit to four posts in four weeks."});
L("chapter",3,4,-.6,"Start a chapter\nor lead a group",["outside"],{logo:"pauseai",kind:"Action",tag:"Stipends for organisers",url:"https://pauseai.info/microgrants",link:"See PauseAI funding",
  text:"When you've shown up a few times, lead. PauseAI offers small stipends for local organisers as well as microgrants for projects, and Encode supports student chapters.",do:"Tell your group's organiser you'd like to run the next event."});
L("fulltime",3,4,.6,"Build an audience,\ngo full-time",["comms"],{icon:"up",kind:"Action",tag:"One to two years",
  text:"Creators move to full-time through a fellowship, a staff role or audience support. Your public body of work is your application to everything on this path, so keep it in one place and keep adding to it.",do:"Make one page that links your five best pieces."});
// Row 4: communications + operations
L("post60",4,0,-1,"Post a\n60-second video",["comms"],{icon:"play",kind:"Action",tag:"Tonight",
  text:"If you want to start right now from your bedroom, make and post one sixty-second video. It will be rough, and that is fine. Nobody starts good.",do:"Record one take explaining one idea, and post it."});
L("study",4,0,0,"Study what\nworks",["comms"],{logo:"youtube",kind:"Action",tag:"One evening",url:"https://www.aisafety.com/media-channels",link:"See AI safety channels",
  text:"Watch existing AI safety content that reaches people and take notes on how it opens, how long it runs and what it leaves out. AISafety.com keeps a list of channels, podcasts and newsletters.",do:"Watch three successful videos and write down the first ten seconds of each."});
L("scout",4,0,1,"Scout 3 jobs,\nbook 1 chat",["ops"],{icon:"search",kind:"Action",tag:"This week",url:"https://jobs.80000hours.org",link:"Open the job board",
  text:"If you've ever been the person who keeps a project from falling apart, you already have the skill. Pick three organisations from the job board and read what they are hiring for.",do:"Then message one person who has that job and ask for a coffee chat."});
L("commslearn",4,1,-1,"Learn safety\ncomms",["comms"],{logo:"cais",kind:"Guide",tag:"Free · one evening",url:"https://safe.ai/act/talk",link:"Read the guide",
  text:"Explaining AI risk well is a skill with its own research. The Center for AI Safety's guide to talking about AI safety gives six strategies, such as starting from common ground and dropping the jargon. BlueDot has published a list of communications work it wants to see. Message testing suggests concrete harms land better with general audiences than talk of extinction.",do:"Read the guide, then rewrite your last post using two of its strategies."});
L("volunteer",4,1,0,"Volunteer\nyour skills",["comms","ops"],{icon:"heart",kind:"Action",tag:"A few hours a week",
  text:"Design, writing, video editing, event logistics, bookkeeping, translation: small organisations need all of it, and volunteering is how you get known before a role opens.",do:"Email one organisation on this map with a specific offer: I can do X for you by Friday."});
L("translatepaper",4,1,1,"Explain one\nreport",["comms"],{icon:"pencil",kind:"Action",tag:"One weekend",
  text:"Researchers publish dense reports that almost nobody outside the field reads. Take one AI safety test result or policy report and explain it in plain language. This is the core skill of the whole path.",do:"Pick one report from an organisation on this map and write 300 words a friend would understand."});
L("tarbell",4,2,-1,"Tarbell\nFellowship",["comms"],{logo:"tarbell",kind:"Fellowship",tag:"$75k to $120k · applications due 22 Nov 2026",url:"https://www.tarbellcenter.org/fellowship",link:"Apply to Tarbell",open:1,
  text:"A one-year fellowship that places journalists in major newsrooms for nine months to report on advanced AI. Past placements include Bloomberg, The Guardian, TIME, MIT Technology Review and NPR. Applications for 2027 are open now.",do:"Start the application this week. The deadline is 22 November 2026."});
L("dispatch",4,2,1,"DISPATCH\nFellowship",["comms"],{icon:"play",kind:"Fellowship",tag:"Remote · 6 weeks · 15 hours a week",url:"https://aiscommsfellowship.vercel.app/",link:"Open DISPATCH",
  text:"A remote fellowship for short-form AI safety video, open to applicants anywhere. Over six weeks you ship three or four videos a week, with workshops and weekly feedback from AI safety and social media professionals, and help finding a communications role at the end. It expects roughly a BlueDot course's worth of AI safety knowledge. Applications for the first cohort closed on 10 October.",do:"Check the site for the next cohort, and post three short videos now so you have something to show."});
L("epoch",4,3,-1,"Epoch AI",["comms"],{logo:"epoch",kind:"Employer",tag:"In-house media",url:"https://epoch.ai",link:"Open Epoch AI",
  text:"A research organisation that has hired writers, editors and social video producers to turn dense forecasting work into things everyday people want to watch. Getting hired means you don't have to play algorithm roulette alone.",do:"Look at how Epoch presents one finding, and remake it in your own style."});
L("newsrooms",4,3,0,"Newsrooms",["comms"],{icon:"doc",kind:"Employer",tag:"Staff or freelance",
  text:"Major outlets now have reporters covering AI full-time. The Tarbell Fellowship is the main funded way in, but pitching freelance stories works too.",do:"Pitch one AI story to an editor you already know, or to your local paper."});
L("orgcomms",4,3,1,"Safety org\ncomms teams",["comms","ops"],{logo:"saferai",kind:"Employer",tag:"Full-time",url:"https://www.safer-ai.org",link:"Open SaferAI",
  text:"Research and policy organisations hire communications staff with experience from outside the field. SaferAI is one example, and it is where Renn Karageorgieva moved from crisis communications.",do:"Find three communications roles on the job board and compare them with your current job."});
L("leadership",4,4,0,"Join a\nleadership team",["comms","ops"],{icon:"up",kind:"Action",tag:"Two to three years in",
  text:"Heads of communications, chiefs of staff and operations directors are the roles organisations say they struggle most to fill. The usual route is two or three years of doing the job well in a small organisation, where you get responsibility early.",do:"Ask for one piece of your manager's job, and do it well for three months."});
// Row 5: operations + founders
L("gap",5,0,-.6,"Read: the\ntalent gap",["ops","founders"],{logo:"lesswrong",kind:"Reading",tag:"Free · 15 minutes",url:"https://www.lesswrong.com/posts/QCrT2DTJNfvuqtppB/ai-safety-s-biggest-talent-gap-isn-t-researchers-it-s",link:"Read the post",
  text:"Kairos and Constellation's case that the biggest shortage in AI safety is not researchers but people who can run projects, manage teams and start organisations.",do:"Read it and note which of the hard-to-fill roles sounds like you."});
L("opsguides",5,0,.6,"Operations\ncareer guides",["ops"],{logo:"probablygood",kind:"Guide",tag:"Free",url:"https://probablygood.org/career-profiles/operations/",link:"Read the profile",
  text:"Probably Good's operations career profile and Impact Ops' resources page explain what operations people actually do in mission-driven organisations, which skills matter and how people get in.",do:"Read the profile and list which of the skills you already have evidence for."});
L("organize",5,1,-.6,"Organise a group\nor event",["ops","founders"],{icon:"people",kind:"Action",tag:"Funding available",url:"https://bluedot.org/grants/rapid",link:"Open BlueDot Rapid Grants",
  text:"No operations experience yet? Run something. Organise an AI safety group or a one-off event in your community. BlueDot's Rapid Grants cover events, meetups and chapters, usually up to $10k with a decision in about five working days. It is the same muscle as running a team or starting an organisation.",do:"Pick a date four weeks out, book a room and invite ten people."});
L("toolkit",5,1,.6,"Founder\ntoolkit",["founders"],{logo:"aisafety",kind:"Guide",tag:"Free",url:"https://www.aisafety.com/founders",link:"Open the toolkit",
  text:"AISafety.com's toolkit for people starting AI safety projects: funders, incubators, fiscal sponsors and advice, collected in one place.",do:"Skim it and bookmark the three pages you'll need first."});
L("generator",5,2,-.6,"Generator\nResidency",["ops","founders"],{logo:"generator",kind:"Residency",tag:"Funded · 3 months · Berkeley",url:"https://generatorresidency.org/",link:"Open Generator",
  text:"A three-month residency from Kairos and Constellation for generalists. You pitch a project, run it with funding and mentoring, and get help landing a full-time role or spinning it into a new organisation. The first round ran in summer 2026.",do:"Join the list for the next round and draft a one-paragraph project pitch."});
L("bdincubator",5,2,.6,"BlueDot\nIncubator Week",["founders"],{logo:"bluedot",kind:"Incubator",tag:"Fully funded · 5 days · San Francisco",url:"https://bluedot.org/programs/incubator-week",link:"Open Incubator Week",
  text:"Five intensive days in San Francisco for technically serious people from AI safety, biosecurity, cybersecurity and nearby fields who are ready to start an organisation. You work through threat models, design an intervention and pitch it to BlueDot. Strong pitches can get up to $200k through BlueDot's Seed Grants. It runs in repeated cohorts, and past participants have raised more than $10M between them.",do:"Write one paragraph on the risk you'd build against, then check the next cohort's dates."});
L("chief",5,3,-1,"Ops lead,\nchief of staff",["ops"],{logo:"cais",kind:"Role",tag:"Up to six figures",url:"https://jobs.80000hours.org",link:"See open roles",
  text:"The roles organisations say are hardest to fill: head of operations, chief of staff, people lead. The Center for AI Safety listed a Chief of Staff at $220k to $345k.",do:"Filter the job board for operations and read the five newest listings."});
L("kairos",5,3,0,"Kairos and\nfield-builders",["ops"],{logo:"kairos",kind:"Employer",tag:"Full-time",url:"https://kairos-project.org",link:"Open Kairos",
  text:"Organisations such as Kairos, BlueDot and MATS exist to bring new people into the field, and they hire program managers, recruiters and operations staff.",do:"Read the careers page of one field-building organisation."});
L("grant",5,3,1,"Grantmaking",["ops"],{logo:"coefficient",kind:"Employer",tag:"Full-time",url:"https://coefficientgiving.org",link:"Open Coefficient Giving",
  text:"Funders such as Coefficient Giving and Longview need people who can find good projects and judge them. Generalists with good judgement move into these roles.",do:"Read one funder's list of what they want to fund."});
L("spinout",5,4,0,"Start what's\nmissing",["ops","founders"],{icon:"star",kind:"Action",tag:"When you see the gap",
  text:"Operators see the gaps first, because they are the ones working around them. Generator residents can spin projects out into new organisations, and funders say they have more money than founders. Many founders in this field were running someone else's program two years earlier.",do:"Write down the one thing your organisation, or the field, keeps doing badly because nobody owns it."});
// Row 6: founders
L("halcyon",6,0,-.6,"Halcyon: Request\nfor Founders",["founders"],{logo:"halcyon",kind:"Funder",tag:"Free to read",url:"https://halcyonfutures.org/founders",link:"Read the request",
  text:"Halcyon Futures finds people from business, policy and academia and helps them launch AI safety organisations. Their request for founders lists what they want built.",do:"Read the list and mark any idea you could start within six months."});
L("ideas",6,0,.6,"Browse\nidea lists",["founders"],{icon:"search",kind:"Action",tag:"One evening",
  text:"Funders publish lists of organisations they wish existed, from new testing groups to field-building and safety tools. The hard part is finding founders, not ideas.",do:"Collect three ideas you find exciting and write one line on why you could do each."});
L("ten",6,1,-.6,"Talk to 10 people\nwith the problem",["founders"],{icon:"chat",kind:"Action",tag:"Two weeks",
  text:"Before you build anything, check the problem is real. Talk to ten people who would use or fund what you want to make.",do:"Book the first two conversations this week."});
L("pitch",6,1,.6,"Write a\none-page pitch",["founders"],{icon:"pencil",kind:"Action",tag:"One evening",
  text:"One page: the problem, why it matters for AI safety, what you would do in the first three months and what it costs. Every incubator on this path asks for some version of it.",do:"Write the page and send it to one person who will be blunt."});
L("catalyze",6,2,-1,"Catalyze\nImpact",["founders"],{logo:"catalyze",kind:"Incubator",tag:"For new safety organisations",url:"https://catalyze-impact.org",link:"Open Catalyze",
  text:"An incubator made specifically for new AI safety organisations. Its pilot program incubated 11 organisations, and it now runs several programs a year.",do:"Check the next program and its application date."});
L("seldon",6,2,0,"Seldon Lab",["founders"],{logo:"seldon",kind:"Accelerator",tag:"Up to $500k per startup",url:"https://seldonlab.com",link:"Open Seldon",
  text:"A San Francisco accelerator for AI safety and security startups. Companies from its first batch went on to raise further funding and sign contracts with AI companies.",do:"Read about the first batch to see what a fundable idea looks like."});
L("incubator",6,2,1,"Constellation\nIncubator",["founders"],{logo:"constellation",kind:"Incubator",tag:"4 months of funding",url:"https://constellation.org/programs/incubator",link:"Open the incubator",
  text:"Four months of funding, operations support and access to Constellation's network for founders at the earliest stage.",do:"Read what they look for in founders."});
L("seed",6,3,-1,"Find\nfunding",["founders"],{logo:"aisafety",kind:"Funding",tag:"Grants and investment · about 20 funders open",url:"https://www.aisafety.com/funding",link:"See every open funder",
  text:"Funders say they have more money than founders. AISafety.com keeps a list of every AI safety funder and whether it is open right now, from small grants of a few thousand dollars to Coefficient Giving's Project Tailwind, which offers $200k to $2M to get a new organisation started. Halcyon Futures, BlueDot's Seed Grants and the Transformative AI Fund also back new projects.",do:"Shortlist three open funders whose past grants look like your idea, and read what each asks for."});
L("ashgro",6,3,0,"Fiscal sponsor:\nAshgro",["founders"],{logo:"ashgro",kind:"Service",tag:"5 to 10% fee",url:"https://www.ashgro.org",link:"Open Ashgro",
  text:"You don't need to set up a legal charity before you start. Ashgro sponsors AI safety projects so they can receive grants and donations straight away, for a fee of 5 to 10%.",do:"Read the FAQ and check whether your project would qualify."});
L("launch",6,3,1,"Launch your\norganisation",["founders"],{icon:"star",kind:"Action",tag:"The goal",
  text:"New testing groups, field-building programs, security companies and safety tools have all been started in the last few years by people who were new to the field not long before.",do:"Set a date for your first public output and tell someone."});
L("hire",6,4,-.6,"Hire your\nfirst team",["founders"],{icon:"people",kind:"Action",tag:"After funding",url:"https://jobs.80000hours.org",link:"Open the job board",
  text:"List your roles where people in the field look: the 80,000 Hours job board and AISafety.com. Your first operations hire matters more than you expect, which is why the Operations path sits next to this one.",do:"Write the job description for the one hire that would free up most of your time."});
L("helpnext",6,4,.6,"Help the\nnext founder",["founders"],{icon:"heart",kind:"Action",tag:"An hour a month",
  text:"Founders who have raised money and hired a team are the people new founders most need to talk to. Being findable and generous is how this path stays open for the next person.",do:"Tell one incubator on this path that you're available as a mentor."});

/* ---------- smaller options: in the panels and list view, not on the map ---------- */
X("ml4good",["technical:0","policy:0"],"ML4Good\nbootcamp",{icon:"cap",kind:"Bootcamp",tag:"Free · 8 days · in person",url:"https://www.ml4good.org",link:"Open ML4Good",
  text:"Free eight-day bootcamps, run in person several times a year in Europe and beyond. There is a technical track and a governance and strategy track for people heading into policy, operations or media. Alumni have gone on to the UK AI Security Institute, the European Commission and MATS.",do:"Check where the next bootcamps are and which track fits you."});
X("aisc",["technical:1","policy:1"],"AI Safety\nCamp",{icon:"people",kind:"Program",tag:"Part-time · online · 3 months",url:"https://www.aisafety.camp",link:"Open AI Safety Camp",
  text:"Small online teams of three to five spend January to April on one concrete project, led by the person who proposed it. Projects cover technical research, governance and advocacy. For the 2027 camp, projects are posted around 25 October and applications to join a team close on 17 November 2026.",do:"Read the project list and apply to the two that fit you best."});
X("fig",["technical:1","policy:1"],"Future Impact\nGroup fellowship",{icon:"people",kind:"Fellowship",tag:"Part-time · remote · 12 weeks",url:"https://futureimpact.group",link:"Open FIG",
  text:"A part-time, remote-first fellowship where you work as a research associate on a project in AI governance or technical AI safety, about eight hours a week, supervised by an experienced lead.",do:"Read the current projects and note which ones you could help with."});
X("rapid",["funding","technical:1","comms:1","outside:3","ops:1"],"BlueDot\nRapid Grants",{logo:"bluedot",kind:"Funding",tag:"Up to $20k · about 5 working days",url:"https://bluedot.org/grants/rapid",link:"Open Rapid Grants",
  text:"Small grants for concrete work where money is the bottleneck: compute and API credits, events and meetups, research access, travel, community chapters and project tools. Most are up to $10k, and decisions take about five working days.",do:"Write down the one thing $2,000 would let you do next month, and apply for it."});
X("pivotal",["technical:2","policy:2"],"Pivotal Research\nFellowship",{icon:"flask",kind:"Fellowship",tag:"£6k to £8k · 9 weeks · London",url:"https://www.pivotal-research.org",link:"Open Pivotal",
  text:"A nine-week in-person research fellowship in London covering technical safety, governance, evaluations and AI control, with mentors from the UK AI Security Institute, Google DeepMind, GovAI and others. The 2026 round paid £6,000 to £8,000 plus travel, meals and help with housing. Anyone 18 or over can apply.",do:"Check when the next round opens. The 2026 deadline was in May."});
X("arcadia",["policy:1"],"AI Governance\nTaskforce",{icon:"briefcase",kind:"Program",tag:"Unpaid · part-time · remote · 12 weeks",url:"https://www.arcadiaimpact.org",link:"Open Arcadia Impact",
  text:"Arcadia Impact's research program for experienced professionals who want to apply their expertise to AI governance: twelve weeks, about eight hours a week, fully remote, alongside experts in the field. It is unpaid and runs several cohorts a year. The autumn 2026 deadline was 31 August.",do:"Check when the next cohort opens, and write down one governance question your current expertise could answer."});
X("lawai",["policy:2"],"Law & AI summer\nfellowship",{icon:"doc",kind:"Fellowship",tag:"$1,500 to $2,400 a week · 10 weeks",url:"https://law-ai.org",link:"Open LawAI",
  text:"The Institute for Law & AI runs a paid ten-week summer fellowship for law students, lawyers and academics, with tracks in US law and policy, EU law and legal frontiers. It is remote-first with one in-person week. Applications for summer 2026 closed on 30 January.",do:"Check when the 2027 call opens and pick the track that matches your legal background."});
X("successifpol",["policy:2"],"AI Policy Strategy\nFellowship",{logo:"successif",kind:"Fellowship",tag:"Free · 17 weeks",url:"https://www.successif.org",link:"Open Successif",
  text:"Successif's free program for people already working in AI safety or policy who want to turn research into policy change. It includes practical training, a cohort, mentors and a capstone project that ends in a publishable op-ed.",do:"Check the next cohort's dates."});
X("aisap",["outside:2","comms:1"],"Run an AI safety\nworkshop",{icon:"people",kind:"Volunteer",tag:"Training and slides provided",url:"https://forum.effectivealtruism.org/posts/hRxYwNg5SiASym4ym/volunteer-opportunities-with-the-ai-safety-awareness",link:"Read how to volunteer",
  text:"The AI Safety Awareness Project runs in-person workshops for ordinary audiences across the US, such as librarians, community groups and religious organisations. Volunteers can attend, facilitate discussions using the slides and training provided, or adapt the material for their own community. No AI background needed.",do:"Attend one workshop, then offer to facilitate the next."});
X("projects",["outside:3","ops:1"],"Volunteer on a\nfield project",{logo:"aisafety",kind:"Volunteer",tag:"Flexible · remote",url:"https://www.aisafety.com/projects",link:"See volunteer projects",
  text:"Much of the field's shared infrastructure, such as directories, websites, research tools and events, is built by volunteers. AISafety.com lists projects that need help, and paid roles alongside them.",do:"Pick one project and offer two hours this week."});
X("inkhaven",["comms:1"],"Inkhaven writing\nresidency",{icon:"pencil",kind:"Residency",tag:"One month · publish every day",url:"https://www.inkhaven.blog",link:"Open Inkhaven",
  text:"A month-long residency run by Lightcone, the team behind LessWrong, where writers live together and publish a post every day. Inkhaven 3 runs from 10 November to 11 December 2026, with office hours from Scott Alexander.",do:"Publish one post a day for a week at home to see whether the pace suits you."});
X("fli",["comms:2"],"FLI Digital Media\nAccelerator",{icon:"play",kind:"Funding",tag:"Rolling · worldwide",url:"https://futureoflife.org/project/digital-media-accelerator/",link:"Open the accelerator",
  text:"The Future of Life Institute funds creators who explain AI and its risks: YouTube explainers, daily AI news on TikTok, newsletters that unpack research papers, podcasts. It backs people who already have an audience and people with a strong idea. Applications are rolling and open worldwide.",do:"Write a one-paragraph pitch for a series you could keep up for three months."});
X("ef",["founders:2"],"Entrepreneur First:\ndef/acc",{logo:"ef",kind:"Incubator",tag:"London · startup program",url:"https://www.joinef.com/posts/introducing-def-acc-at-ef/",link:"Read about def/acc",
  text:"Entrepreneur First runs a program in London for founders building defensive technology, including AI safety and security startups. You can join before you have a team or an idea.",do:"Read what they fund and check the next intake."});
X("tailwind",["seed","founders:3"],"Project\nTailwind",{logo:"coefficient",kind:"Funding",tag:"$200k to $2M pre-seed · rolling",url:"https://coefficientgiving.org/tailwind",link:"Open Project Tailwind",
  text:"Coefficient Giving's $200 million open call for founders of AI safety organisations that don't exist yet. It offers $200k to $2M at pre-seed and $2M to $20M or more at seed, and publishes dozens of ideas it wants built, such as detecting rogue AI incidents and technology for verifying international agreements.",do:"Read the idea list and mark the one you'd most want to run."});
X("taif",["seed"],"Transformative\nAI Fund",{icon:"briefcase",kind:"Funding",tag:"$10k to $150k · rolling",url:"https://funds.effectivealtruism.org/funds/transformative-ai",link:"Open the fund",
  text:"A rolling fund for new projects working on transformative AI, with grants from $10k to $150k. A good fit for a first project before you need seed-scale money.",do:"Read recent grants to see how big and how specific a typical project is."});
X("manifund",["seed"],"Manifund",{logo:"manifund",kind:"Funding",tag:"Public · fast",url:"https://manifund.org",link:"Open Manifund",
  text:"An open platform where projects post what they need and regrantors fund them in public. Grants can move in days, and reading funded projects shows you what a fundable pitch looks like.",do:"Read three funded projects close to your idea."});
X("sff",["seed"],"Survival and\nFlourishing Fund",{icon:"briefcase",kind:"Funding",tag:"Rolling",url:"https://survivalandflourishing.fund",link:"Open SFF",
  text:"One of the larger funders of AI safety organisations, backing work on the long-term survival and flourishing of humanity. It takes applications on a rolling basis.",do:"Read the list of organisations it has funded to see whether yours would fit."});
X("eaif",["seed","ops:1"],"EA Infrastructure\nFund",{icon:"briefcase",kind:"Funding",tag:"Rolling",url:"https://funds.effectivealtruism.org/funds/ea-community",link:"Open the fund",
  text:"Funds projects that build the community of people working on pressing problems, including AI safety: groups, events, programs and the infrastructure around them. Applications are rolling.",do:"Read a few recent grants to see what size of project it backs."});
X("gtr",["seed"],"GTR AI\nSafety Fund",{icon:"briefcase",kind:"Funding",tag:"€50M over 3 to 7 years · rolling",url:"https://gtr-foundation.org/gtr-ai-safety-fund",link:"Open the fund",
  text:"The Global Technology Risk Foundation's fund for early-stage AI safety organisations and individuals, with €50 million to give out over three to seven years. Applications are rolling.",do:"Check whether it funds individuals or organisations at your stage."});
X("fundlist",["funding"],"Every open\nfunder",{logo:"aisafety",kind:"Directory",tag:"Kept up to date",url:"https://www.aisafety.com/funding",link:"See the funding list",
  text:"AISafety.com lists every AI safety funder and whether it is accepting applications, from small grants for individuals to large funds for new organisations.",do:"Find the funders open to individuals and bookmark two."});

const NODE = Object.fromEntries(NODES.map(n => [n.id, n]));
const PEOPLE = [
 { id:"dipika", name:"Dipika Khullar", at:"anthfellows", lane:"technical", role:"AI safety research fellow at Anthropic",
   story:"Dipika took machine learning courses as part of her undergraduate degree and joined a research project in a lab at her school. Then came two research programs, SPAR and then MATS. She is now an AI safety research fellow at Anthropic.", route:["labproject","spar","mats","anthfellows"] },
 { id:"gillian", name:"Gillian Hadfield", at:"field", lane:"policy", role:"Professor at Johns Hopkins, runs the Normativity Lab",
   story:"Gillian built her career as an economist and a legal scholar. Today she runs the Normativity Lab, working on international AI safety coordination and AI law. Instead of leaving her field, she brought the AI question into it.", route:["field"] },
 { id:"sneha", name:"Sneha Revanur", at:"encode", lane:"outside", role:"Founder of Encode",
   story:"At fifteen, Sneha organised other students against a California ballot measure, Prop 25, that would have replaced cash bail with an AI risk score. Voters rejected it. Her group of about 20 students grew into Encode, which has helped push for state AI safety laws like California's SB 53.", route:["talk","table","encode","statebill"] },
 { id:"drew", name:"Drew Spartz", at:"indie", lane:"comms", role:"Runs one of the most-watched AI safety channels on YouTube",
   story:"Drew is the reminder that nobody starts good. His first videos were rough and barely got any views. He kept learning from his mistakes and improving, and now his videos reach millions.", route:["post60","study","indie","fulltime"] },
 { id:"renn", name:"Renn Karageorgieva", at:"orgcomms", lane:"comms", role:"Communications at SaferAI",
   story:"Renn came from crisis communications. An adviser at 80,000 Hours helped her meet people at AI safety organisations and learn what employers wanted. One conversation led to an introduction to the chief of staff at SaferAI, who encouraged her to apply for a job she had missed. She got the role within weeks.", route:["mid","advising","reach","orgcomms"] },
 { id:"bryan", name:"Bryan Sukidi", at:"kairos", lane:"ops", role:"Builds talent directories at Kairos",
   story:"Bryan took a BlueDot course as a student, joined his campus AI safety club and did a research internship to learn more about machine learning. After university he did the Generator residency, and Kairos then hired him full-time to build talent directories for the field.", route:["bd_agi","campus","generator","kairos"] }
];
PEOPLE.forEach(p => p.ini = p.name.split(" ").map(w => w[0]).join(""));
const PERSON = Object.fromEntries(PEOPLE.map(p => [p.id, p]));

// Click-through order for each path, and for the trunk.
const TRUNK_SEQ = ["start","stay","podcasts","watch","real","follow","news","buddy","learn","bd_intro","bd_agi","reading","fieldmap","student","campus","pathfinder","major","uni","mid","successif","hip","translate","talk10","pick","advising","jobs","funding","reach"];
const posFor = (n, l) => n.pos.find(p => p.lanes.includes(l)) || n.pos[0];
const SEQ = { trunk: TRUNK_SEQ };
LANES.forEach(l => SEQ[l.id] = NODES.filter(n => n.type !== "extra" && n.lanes.includes(l.id)).sort((a, b) => a.st[l.id] - b.st[l.id] || posFor(a, l.id).y - posFor(b, l.id).y || posFor(a, l.id).x - posFor(b, l.id).x).map(n => n.id));
const seqName = c => c === "trunk" ? "Getting started" : LANE[c].name;
const stageNodes = (l, i) => SEQ[l].map(id => NODE[id]).filter(n => n.st[l] === i);
// Extras listed under a circle (key = its id) or at a stage (key = "lane:stage", including those under a circle at that stage).
const END_IDS = ["build", "events", "giveback", "problems"], STARTER = ["bd_agi", "advising", "reach"];
const extrasAt = key => { const [l, s] = key.split(":"); return NODES.filter(n => n.type === "extra" && (s === undefined ? n.at.includes(key) : n.st[l] === +s)); };

// The end of every path can lead to founding something. What that tends to look like from each one:
const FOUND = {
  technical:"Researchers who have spent a few years on one problem start evaluation groups, security and interpretability startups, and new research organisations. Seldon Lab and Coefficient Giving's Project Tailwind both look for technical founders.",
  policy:"Policy people start think tanks, advocacy organisations and tools that help governments check what AI companies are doing. Knowing exactly which rule is missing is a strong place to start from.",
  outside:"People who keep showing up locally start chapters, campaigns and new advocacy organisations. Encode began as about 20 students opposing one ballot measure.",
  comms:"Creators and journalists start channels, newsletters and media organisations. The Future of Life Institute's Digital Media Accelerator funds exactly this.",
  ops:"Operators see the gaps first, because they are the ones working around them. Many founders in this field were running someone else's program two years earlier."
};

/* ---------- geometry: every line on the map, so the website and the video draw identical paths ---------- */
const P = id => NODE[id].pos[0];
const hcurve = (a, b) => { const m = (a.x + b.x) / 2; return `M${a.x} ${a.y}C${m} ${a.y},${m} ${b.y},${b.x} ${b.y}`; };
const vcurve = (a, b) => { const m = (a.y + b.y) / 2; return `M${a.x} ${a.y}C${a.x} ${m},${b.x} ${m},${b.x} ${b.y}`; };
// kind: trunk (main line), stub (a stop hanging off a hub), lane (a path's own line), more (dotted lead to "+N more"), leaf (a step's link to its path)
// lanes: the paths an edge belongs to; empty means the shared trunk.
// part: which part of the map the edge belongs to (start, student, mid, pick, a lane id), so the video can reveal the map piece by piece.
// node: for stubs and leaves, the step the edge leads to.
function buildEdges() {
  const out = [];
  const add = (kind, lanes, width, d, extra) => out.push({ kind, lanes, width, d, ...extra });
  // The main line breaks between "Learn the basics" and "Pick a path": there you go one of two ways, as a student or mid-career.
  add("trunk", [], 16, `M${["start", "stay", "learn"].map(i => P(i).x + " " + P(i).y).join("L")}`, { part: "start" });
  ["student", "mid"].forEach(i => { add("trunk", [], 10, hcurve(P("learn"), P(i)), { part: i }); add("trunk", [], 10, hcurve(P(i), P("pick")), { part: i }); });
  add("trunk", [], 16, `M${P("pick").x} ${P("pick").y}L${P("reach").x} ${P("reach").y}`, { part: "pick" });
  NODES.filter(n => n.type === "sat" && (n.lp !== "r" || n.fan)).forEach(n => n.parent.forEach(h => add("stub", n.lanes, 5, (n.fan ? hcurve : vcurve)(P(h), n.pos[0]), { node: n.id })));
  LANES.forEach(l => {
    add("lane", [l.id], 11, hcurve(P("reach"), { x: PILLX - 112, y: l.y }), { part: l.id });
    add("lane", [l.id], 11, `M${PILLX} ${l.y}H${LINE_END}`, { part: l.id });
    add("lane", [l.id], 11, hcurve({ x: LINE_END, y: l.y }, P("build")), { part: l.id });
    l.stages.forEach((s, i) => {
      if (!extrasAt(`${l.id}:${i}`).length) return;
      const x = SX[i] + (i < 4 ? 200 : -200), y = l.y + 62;
      add("more", [l.id], 3, vcurve({ x, y: y - 15 }, { x: SX[i], y: l.y }), { part: l.id, dash: "2 7" });
    });
  });
  NODES.filter(n => n.type === "leaf").forEach(n => n.pos.forEach(p => p.lanes.forEach(l => add("leaf", [l], 5, vcurve(p, { x: SX[p.stage], y: LANE[l].y }), { part: l, node: n.id }))));
  return out;
}

const CAREERMAP = {
  W, H, SX, ROW, REACHX, PILLX, LINE_END, ENDX, ICON, LANES, LANE, ALL, NODES, NODE, PEOPLE, PERSON,
  TRUNK_SEQ, SEQ, seqName, END_IDS, STARTER, FOUND, posFor, stageNodes, extrasAt, hcurve, vcurve, EDGES: buildEdges(),
};
if (typeof module === "object" && module.exports) module.exports = CAREERMAP;
else window.CAREERMAP = CAREERMAP;
})();
