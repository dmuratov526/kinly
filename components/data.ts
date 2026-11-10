/* All demo data for the Kinly prototype. Prices are set for families on a budget (studio feedback). */

export type ServiceId = "companion" | "escort" | "errands" | "home" | "tech" | "wellness";

export type Service = {
  id: ServiceId;
  name: string;
  short: string;
  blurb: string;
  from: number;
  unit: "hr" | "visit";
  hue: string;
  tint: string;
  tasks: { t: string; on: boolean }[];
  /** what families can expect, so nobody books Tech help to build an app */
  includes: string[];
  excludes: string[];
};

export const SERVICES: Service[] = [
  {
    id: "companion", name: "Companionship", short: "Company", blurb: "Tea, walks, cards and good conversation", from: 18, unit: "hr",
    hue: "#E8577A", tint: "#FDE7EC",
    tasks: [
      { t: "Chat over chai", on: true },
      { t: "Short walk in Travers Park", on: true },
      { t: "Play rummy or carrom", on: true },
      { t: "Video-call the family", on: false },
    ],
    includes: ["Conversation, tea and card games", "Short walks and fresh air", "Reading, music, photo albums", "Video calls with the family"],
    excludes: ["Medical care or giving medication", "Bathing or personal care"],
  },
  {
    id: "escort", name: "Doctor visits", short: "Doctor", blurb: "Door-to-door rides plus notes from the doctor", from: 25, unit: "hr",
    hue: "#7B5CF0", tint: "#EEE9FE",
    tasks: [
      { t: "Pick Kamala up from home", on: true },
      { t: "Stay with her at the appointment", on: true },
      { t: "Take notes from the doctor", on: true },
      { t: "Pharmacy pickup on the way back", on: false },
    ],
    includes: ["Door-to-door ride or accompanied transit", "Waiting with them at the appointment", "Notes on what the doctor said", "Pharmacy pickup on the way back"],
    excludes: ["Making medical decisions", "Driving without the helper present"],
  },
  {
    id: "errands", name: "Errands", short: "Errands", blurb: "Groceries, pharmacy and post office", from: 15, unit: "hr",
    hue: "#E9A23B", tint: "#FDF1DC",
    tasks: [
      { t: "Groceries from Patel Brothers", on: true },
      { t: "Pharmacy pickup", on: true },
      { t: "Put everything away", on: true },
      { t: "Post office drop-off", on: false },
    ],
    includes: ["Groceries and pharmacy pickups", "Post office, bank, dry cleaning", "Carrying bags and putting things away", "Receipts and change returned"],
    excludes: ["Paying bills on their behalf", "Big furniture or moving"],
  },
  {
    id: "home", name: "House help", short: "House", blurb: "Light cleaning, laundry and fresh sheets", from: 20, unit: "hr",
    hue: "#22A57A", tint: "#DFF5EC",
    tasks: [
      { t: "Tidy kitchen and living room", on: true },
      { t: "Laundry: wash and fold", on: true },
      { t: "Change the bed sheets", on: true },
      { t: "Take out the trash", on: false },
    ],
    includes: ["Tidying, dusting, vacuuming", "Laundry, folding, fresh sheets", "Kitchen and bathroom wipe-down", "Taking out trash and recycling"],
    excludes: ["Deep cleaning or carpets", "Repairs, plumbing or electrical"],
  },
  {
    id: "tech", name: "Tech help", short: "Tech", blurb: "Video calls, bigger text, no more spam", from: 18, unit: "hr",
    hue: "#3B82F6", tint: "#E3EEFE",
    tasks: [
      { t: "Set up WhatsApp video calls", on: true },
      { t: "Make the text bigger", on: true },
      { t: "Show her the family photo album", on: true },
      { t: "Block spam calls", on: false },
    ],
    includes: ["Phone, tablet and TV basics", "Video calls, WhatsApp, photos", "Bigger text, louder ringer", "Blocking spam and scam calls"],
    excludes: ["Building apps or websites", "Repairing broken devices", "Setting up a home network from scratch"],
  },
  {
    id: "wellness", name: "Wellness check", short: "Check-in", blurb: "A 45-min check on meals, meds and mood", from: 30, unit: "visit",
    hue: "#F06A3B", tint: "#FEE9E0",
    tasks: [
      { t: "Check she has eaten", on: true },
      { t: "Morning meds taken", on: true },
      { t: "Look for trip hazards", on: true },
      { t: "Check the fridge", on: false },
    ],
    includes: ["Did they eat, drink, take morning meds", "Mood check and a short chat", "Spotting trip hazards", "A note to the family afterwards"],
    excludes: ["Medical exams or treatment", "Changing prescriptions"],
  },
];
export const svc = (id: ServiceId) => SERVICES.find((s) => s.id === id)!;

export type Helper = {
  id: string;
  name: string;
  first: string;
  photo: string;
  role: string;
  years: number;
  rating: number;
  reviews: number;
  visits: number;
  /** dollars per hour above the service's base rate (more experience, more languages) */
  adj: number;
  miles: number;
  langs: string[];
  cpr: boolean;
  gender: "f" | "m";
  /** nurse, aide or nursing student */
  medical: boolean;
  /** hands-on skills families filter by */
  skills: string[];
  services: ServiceId[];
  /** next free slot label and whether it is today */
  next: string;
  today: boolean;
  match: number;
  /** day keys with no availability, and times already booked */
  daysOff: string[];
  busy: string[];
  bio: string;
  badges: string[];
  onTime: number;
  repeat: number;
};

/** The nine people the demo story is built around. */
const CORE: Helper[] = [
  {
    id: "sunita", name: "Sunita Rao", first: "Sunita", photo: "/img/sunita.jpg", role: "Former nurse's aide", years: 12,
    rating: 4.97, reviews: 96, visits: 312, adj: 2, miles: 1.2, langs: ["Hindi", "English", "Marathi"], cpr: true, gender: "f", medical: true, skills: ["Dementia care", "Mobility & walks", "Cooking", "Meds reminders", "Doctor notes"],
    services: ["companion", "escort", "wellness", "errands"], next: "Today · 2 PM", today: true, match: 98,
    daysOff: ["sat"], busy: ["9:00 AM"],
    bio: "I spent 12 years as a nurse's aide at Elmhurst Hospital. Now I help families the way I'd want someone to help my own mother: patiently, and always with a cup of chai.",
    badges: ["Top Helper", "Hindi speaker"], onTime: 99, repeat: 87,
  },
  {
    id: "maria", name: "Maria Gonzalez", first: "Maria", photo: "/img/maria.jpg", role: "Certified home health aide", years: 9,
    rating: 4.92, reviews: 74, visits: 260, adj: 1, miles: 0.8, langs: ["Spanish", "English"], cpr: true, gender: "f", medical: true, skills: ["Housekeeping", "Cooking", "Meds reminders", "Mobility & walks"],
    services: ["home", "wellness", "companion"], next: "Today · 4 PM", today: true, match: 93,
    daysOff: [], busy: ["10:00 AM", "11:00 AM"],
    bio: "HHA certified, 9 years in Queens. I keep homes calm and tidy, cook a mean arroz con pollo, and always leave a note of what I did.",
    badges: ["HHA certified", "Closest"], onTime: 98, repeat: 86,
  },
  {
    id: "denise", name: "Denise Walker", first: "Denise", photo: "/img/denise.jpg", role: "Registered nurse (RN)", years: 15,
    rating: 4.93, reviews: 120, visits: 488, adj: 3, miles: 3.1, langs: ["English", "Spanish"], cpr: true, gender: "f", medical: true, skills: ["Doctor notes", "Meds reminders", "Dementia care", "Driving"],
    services: ["escort", "wellness"], next: "Fri · 10 AM", today: false, match: 88,
    daysOff: ["today", "tue"], busy: [],
    bio: "RN with 15 years in geriatrics. I translate doctor-speak into plain English and make sure nothing gets missed.",
    badges: ["Registered nurse", "Has a car"], onTime: 99, repeat: 90,
  },
  {
    id: "marcus", name: "Marcus Johnson", first: "Marcus", photo: "/img/marcus.jpg", role: "Former high school coach", years: 4,
    rating: 4.89, reviews: 52, visits: 150, adj: 0, miles: 1.6, langs: ["English"], cpr: true, gender: "m", medical: false, skills: ["Mobility & walks", "Housekeeping", "Tech setup", "Heavy lifting"],
    services: ["companion", "errands", "home", "tech"], next: "Today · 3 PM", today: true, match: 90,
    daysOff: ["sun"], busy: ["9:00 AM"],
    bio: "Twenty years coaching basketball in the Bronx. Now I get folks moving again: short walks, groceries, heavy lifting, and a good story or two.",
    badges: ["Great for walks", "Heavy lifting"], onTime: 97, repeat: 83,
  },
  {
    id: "linda", name: "Linda Kowalski", first: "Linda", photo: "/img/linda.jpg", role: "Retired nurse (LPN)", years: 22,
    rating: 4.95, reviews: 88, visits: 340, adj: 2, miles: 2.2, langs: ["English", "Polish"], cpr: true, gender: "f", medical: true, skills: ["Meds reminders", "Dementia care", "Doctor notes"],
    services: ["wellness", "companion", "escort"], next: "Tomorrow · 9 AM", today: false, match: 89,
    daysOff: ["today"], busy: ["1:00 PM"],
    bio: "22 years as a nurse at Mount Sinai Queens. I check meds, meals and mood, and I notice the small things before they become big ones.",
    badges: ["Former nurse", "Meds expert"], onTime: 99, repeat: 91,
  },
  {
    id: "omar", name: "Omar Haddad", first: "Omar", photo: "/img/omar.jpg", role: "Caregiver and driver", years: 5,
    rating: 4.87, reviews: 47, visits: 175, adj: 1, miles: 2.9, langs: ["Arabic", "English"], cpr: true, gender: "m", medical: false, skills: ["Driving", "Mobility & walks", "Heavy lifting"],
    services: ["escort", "errands"], next: "Today · 1 PM", today: true, match: 84,
    daysOff: ["fri"], busy: ["10:00 AM"],
    bio: "I drive a roomy Toyota Sienna with space for a walker. Doctor visits, pharmacy runs, the long line at the DMV: I've got it.",
    badges: ["Has a car", "Clean record"], onTime: 98, repeat: 80,
  },
  {
    id: "tom", name: "Tom Becker", first: "Tom", photo: "/img/tom.jpg", role: "Retired IT teacher", years: 3,
    rating: 4.9, reviews: 39, visits: 112, adj: 1, miles: 3.4, langs: ["English", "German"], cpr: true, gender: "m", medical: false, skills: ["Tech setup"],
    services: ["tech", "errands"], next: "Tomorrow · 10 AM", today: false, match: 80,
    daysOff: ["today", "sat"], busy: ["2:00 PM"],
    bio: "I taught computers for 30 years, so nothing is a silly question. Video calls, bigger text, blocking spam calls, all at your pace.",
    badges: ["Tech whiz", "Very patient"], onTime: 99, repeat: 85,
  },
  {
    id: "grace", name: "Grace Okafor", first: "Grace", photo: "/img/grace.jpg", role: "Nursing student, NYU", years: 2,
    rating: 4.8, reviews: 18, visits: 46, adj: 0, miles: 1.9, langs: ["English", "Igbo"], cpr: true, gender: "f", medical: true, skills: ["Tech setup", "Mobility & walks", "Housekeeping"],
    services: ["companion", "errands", "tech", "home"], next: "Today · 1 PM", today: true, match: 82,
    daysOff: ["fri"], busy: ["9:00 AM", "10:00 AM"],
    bio: "Nursing student who grew up caring for my grandma. Upbeat, reliable, and great at board games.",
    badges: ["New on Kinly"], onTime: 100, repeat: 76,
  },
  {
    id: "mei", name: "Mei Lin", first: "Mei", photo: "/img/mei.jpg", role: "Caregiver and driver", years: 6,
    rating: 4.88, reviews: 63, visits: 190, adj: 1, miles: 2.7, langs: ["English", "Mandarin"], cpr: true, gender: "f", medical: false, skills: ["Driving", "Cooking"],
    services: ["escort", "errands", "companion"], next: "Today · 3 PM", today: true, match: 85,
    daysOff: ["sat"], busy: ["1:00 PM"],
    bio: "I have a clean, roomy Honda CR-V and a lot of patience for long pharmacy lines.",
    badges: ["Has a car", "Clean record"], onTime: 96, repeat: 79,
  },
];

/* ---------- the wider roster: lots of different people, built from compact rows ---------- */

type Kind = "cna" | "hha" | "cook" | "driver" | "tech" | "student" | "pt" | "house" | "dementia" | "emt" | "social" | "teacher";

const KINDS: Record<Kind, { role: string; services: ServiceId[]; skills: string[]; medical: boolean; badges: string[]; bio: string }> = {
  cna: { role: "Certified nursing assistant", services: ["companion", "wellness", "escort"], skills: ["Meds reminders", "Mobility & walks", "Dementia care"], medical: true, badges: ["CNA"], bio: "I've worked in hospitals and in people's homes. Home is better: there's time to sit down, listen and do things properly." },
  hha: { role: "Home health aide", services: ["home", "wellness", "companion"], skills: ["Housekeeping", "Meds reminders", "Cooking"], medical: true, badges: ["HHA certified"], bio: "I keep the house running and an eye on how she's doing. Clean kitchen, warm lunch, meds on time." },
  cook: { role: "Companion and home cook", services: ["companion", "errands"], skills: ["Cooking", "Mobility & walks"], medical: false, badges: ["Great cook"], bio: "Most of my visits end up in the kitchen. We cook her recipes together, then go for a slow walk." },
  driver: { role: "Driver and errand runner", services: ["escort", "errands"], skills: ["Driving", "Heavy lifting"], medical: false, badges: ["Has a car"], bio: "Clean car, door-to-door, no rushing. I wait at the appointment and carry everything up the stairs." },
  tech: { role: "Tech tutor", services: ["tech", "companion"], skills: ["Tech setup"], medical: false, badges: ["Tech whiz"], bio: "Phones, tablets, video calls, the TV remote. I write simple notes so she can do it herself next time." },
  student: { role: "Nursing student", services: ["companion", "wellness", "tech"], skills: ["Meds reminders", "Tech setup", "Mobility & walks"], medical: true, badges: ["Nursing student"], bio: "I'm studying to be a nurse and I love time with older folks. Patient, upbeat and always on time." },
  pt: { role: "Physical therapy aide", services: ["companion", "wellness"], skills: ["Mobility & walks", "Heavy lifting"], medical: true, badges: ["PT aide"], bio: "I help people stay steady on their feet: gentle exercises, safe walks, and a home with fewer trip hazards." },
  house: { role: "Housekeeper", services: ["home", "errands"], skills: ["Housekeeping", "Cooking"], medical: false, badges: ["Spotless"], bio: "Laundry, sheets, a sparkling bathroom and a stocked fridge. I leave a note of everything I did." },
  dementia: { role: "Memory care specialist", services: ["companion", "wellness"], skills: ["Dementia care", "Meds reminders"], medical: true, badges: ["Dementia trained"], bio: "I've spent years in memory care. Routine, music and patience go a long way on the hard days." },
  emt: { role: "Former EMT", services: ["escort", "wellness"], skills: ["Driving", "Doctor notes", "Heavy lifting"], medical: true, badges: ["Ex-EMT", "Has a car"], bio: "Ten years on an ambulance taught me to stay calm. I take notes at every appointment so nothing gets missed." },
  social: { role: "Social work student", services: ["companion", "escort"], skills: ["Doctor notes", "Mobility & walks"], medical: false, badges: ["Great listener"], bio: "I'm studying social work at Hunter. I help with appointments, paperwork, and just being good company." },
  teacher: { role: "Retired teacher", services: ["companion", "tech"], skills: ["Tech setup", "Mobility & walks"], medical: false, badges: ["Very patient"], bio: "After 30 years in the classroom, nothing is a silly question. Crosswords, card games and video calls are my specialty." },
};

/* id, name, gender, languages besides English, kind, years, miles from Mom */
const ROSTER: [string, string, "f" | "m", string[], Kind, number, number][] = [
  ["katie", "Katie Sullivan", "f", [], "cna", 7, 1.4],
  ["jenny", "Jenny Park", "f", ["Korean"], "student", 2, 0.9],
  ["keisha", "Keisha Brown", "f", [], "hha", 11, 1.7],
  ["ana", "Ana Ferreira", "f", ["Portuguese", "Spanish"], "house", 6, 2.1],
  ["valeria", "Valeria Ruiz", "f", ["Spanish"], "cook", 5, 0.7],
  ["amara", "Amara Diallo", "f", ["French", "Wolof"], "cna", 9, 2.6],
  ["sofia", "Sofia Russo", "f", ["Italian"], "pt", 4, 3.0],
  ["barbara", "Barbara Miller", "f", [], "teacher", 3, 1.1],
  ["emily", "Emily Carter", "f", [], "student", 1, 2.3],
  ["rosa", "Rosa Martinez", "f", ["Spanish"], "hha", 14, 0.6],
  ["rachel", "Rachel Goldberg", "f", ["Hebrew"], "dementia", 12, 3.2],
  ["layla", "Layla Hassan", "f", ["Arabic"], "cna", 6, 1.9],
  ["linh", "Linh Nguyen", "f", ["Vietnamese"], "cook", 4, 2.8],
  ["sophie", "Sophie Chen", "f", ["Cantonese", "Mandarin"], "tech", 3, 1.5],
  ["olena", "Olena Petrenko", "f", ["Ukrainian", "Russian"], "house", 8, 2.4],
  ["maureen", "Maureen O'Brien", "f", [], "dementia", 25, 3.4],
  ["carol", "Carol Jensen", "f", [], "teacher", 5, 2.0],
  ["kevin", "Kevin Tran", "m", ["Vietnamese"], "tech", 2, 1.2],
  ["vikram", "Vikram Singh", "m", ["Punjabi", "Hindi"], "driver", 7, 0.8],
  ["diego", "Diego Morales", "m", ["Spanish"], "driver", 4, 1.6],
  ["kwame", "Kwame Mensah", "m", ["Twi"], "pt", 3, 2.7],
  ["mike", "Mike Russo", "m", ["Italian"], "emt", 10, 3.1],
  ["daniel", "Daniel Kim", "m", ["Korean"], "social", 2, 1.8],
  ["andre", "Andre Thompson", "m", [], "cna", 8, 1.3],
  ["jake", "Jake Murphy", "m", [], "house", 3, 2.5],
  ["paul", "Paul Lévesque", "m", ["French"], "teacher", 4, 3.3],
  ["farhan", "Farhan Rahman", "m", ["Bengali"], "driver", 5, 1.0],
  ["luis", "Luis Herrera", "m", ["Spanish"], "emt", 9, 2.2],
  ["jp", "Jean-Pierre Joseph", "m", ["Haitian Creole", "French"], "hha", 12, 2.9],
  ["darnell", "Darnell Harris", "m", [], "social", 1, 1.9],
  ["samuel", "Samuel Adeyemi", "m", ["Yoruba"], "student", 2, 3.5],
];

/** small deterministic "random" so every load shows the same people */
const rnd = (seed: string, n: number) => {
  let x = 0;
  for (const c of seed) x = (x * 31 + c.charCodeAt(0)) >>> 0;
  x = (x ^ (x >>> 13)) * 1274126177 >>> 0;
  return x % n;
};
const DAY_KEYS = ["today", "fri", "sat", "sun", "mon", "tue", "wed"];
const SLOT = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const EXTRA: Helper[] = ROSTER.map(([id, name, gender, langs, kind, years, miles]) => {
  const k = KINDS[kind];
  const first = name.split(" ")[0];
  const off = [DAY_KEYS[rnd(id + "a", 7)], ...(rnd(id + "b", 3) === 0 ? [DAY_KEYS[rnd(id + "c", 7)]] : [])];
  const busy = [SLOT[rnd(id + "d", 8)]];
  const today = !off.includes("today");
  const free = SLOT.find((t) => !busy.includes(t) && t !== "9:00 AM") ?? "1:00 PM";
  const rating = Math.round((4.6 + rnd(id + "r", 39) / 100) * 100) / 100;
  const reviews = 6 + rnd(id + "v", 110);
  return {
    id, name, first, photo: `/img/h/${id}.jpg`, role: k.role, years,
    rating, reviews, visits: reviews * 3 + rnd(id + "x", 40), adj: rnd(id + "j", 4), miles,
    langs: ["English", ...langs], cpr: true, gender, medical: k.medical, skills: k.skills, services: k.services,
    next: today ? `Today · ${free.replace(":00", "")}` : `Tomorrow · ${free.replace(":00", "")}`, today,
    match: 55 + rnd(id + "m", 30), daysOff: off, busy,
    bio: k.bio, badges: [...(rating >= 4.95 ? ["Top Helper"] : []), ...k.badges, ...(langs[0] ? [`${langs[0]} speaker`] : [])].slice(0, 3),
    onTime: 92 + rnd(id + "o", 8), repeat: 70 + rnd(id + "p", 25),
  };
});

export const HELPERS: Helper[] = [...CORE, ...EXTRA];
export const helper = (id: string) => HELPERS.find((h) => h.id === id) ?? HELPERS[0];

export const REVIEWS = [
  { who: "Anjali M.", rel: "daughter", photo: "/img/rev1.jpg", when: "2 weeks ago", stars: 5, text: "My father now asks every Monday when Sunita is coming. Sunita sends photos after every walk and the notes from his cardiologist were better than mine." },
  { who: "David K.", rel: "son", photo: "/img/rev3.jpg", when: "1 month ago", stars: 5, text: "Calm, punctual, kind. Sunita noticed Kamala's new dizziness before we did and flagged it right away." },
  { who: "Leila S.", rel: "granddaughter", photo: "/img/rev2.jpg", when: "1 month ago", stars: 5, text: "Grandma lit up the moment Sunita walked in. Worth every penny." },
];

export const PEOPLE = {
  rohan: { name: "Rohan", photo: "/img/rohan.jpg" },
  mom: { name: "Kamala", photo: "/img/mom.jpg", age: 78, area: "Jackson Heights, Queens" },
  anita: { name: "Anita", photo: "/img/anita.jpg" },
};

/* ---------- calendar ---------- */

export const DAYS = [
  { key: "today", dow: "Thu", num: 12, label: "Today" },
  { key: "fri", dow: "Fri", num: 13, label: "Tomorrow" },
  { key: "sat", dow: "Sat", num: 14, label: "Sat, Nov 14" },
  { key: "sun", dow: "Sun", num: 15, label: "Sun, Nov 15" },
  { key: "mon", dow: "Mon", num: 16, label: "Mon, Nov 16" },
  { key: "tue", dow: "Tue", num: 17, label: "Tue, Nov 17" },
  { key: "wed", dow: "Wed", num: 18, label: "Wed, Nov 18" },
];
export const day = (key: string) => DAYS.find((d) => d.key === key) ?? DAYS[0];
export const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export const isFree = (h: Helper, dayKey: string, time: string) => !h.daysOff.includes(dayKey) && !h.busy.includes(time);

export function endTime(start: string, hours: number) {
  const [hm, ap] = start.split(" ");
  const [hh, mm] = hm.split(":").map(Number);
  let mins = ((hh % 12) + (ap === "PM" ? 12 : 0)) * 60 + mm + Math.round(hours * 60);
  mins %= 24 * 60;
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h24 >= 12 ? "PM" : "AM"}`;
}

/** Care fee on top of the helper's pay. Kept small on purpose. */
export const FEE = 0.05;

/** What this helper charges for this service (per hour, or per visit for wellness checks). */
export const rateFor = (h: Helper, s: Service) => (s.unit === "visit" ? s.from : s.from + h.adj);
/** The rate to show on a card when no service is picked yet. */
export const cardRate = (h: Helper, service?: ServiceId | null) => {
  if (service && h.services.includes(service)) {
    const s = svc(service);
    return { rate: rateFor(h, s), unit: s.unit };
  }
  // no service picked: show their lowest hourly rate, the honest "from" price
  const hourly = h.services.map(svc).filter((x) => x.unit === "hr");
  const s = hourly.length ? hourly.reduce((a, b) => (rateFor(h, a) <= rateFor(h, b) ? a : b)) : svc(h.services[0]);
  return { rate: rateFor(h, s), unit: s.unit };
};

export function priceFor(h: Helper, s: Service, hours: number) {
  const base = s.unit === "visit" ? s.from : rateFor(h, s) * hours;
  const fee = Math.round(base * FEE * 100) / 100;
  return { base, fee, total: Math.round(base + fee) };
}
const totalFor = (helperId: string, service: ServiceId, hours: number) => priceFor(helper(helperId), svc(service), hours).total;

/* ---------- visits ---------- */

export type Visit = {
  id: string;
  helperId: string;
  service: ServiceId;
  dayKey: string;
  dateLabel: string;
  time: string;
  hours: number;
  status: "live" | "upcoming" | "past";
  weekly?: boolean;
  rated?: number;
  summary?: string;
  total: number;
};

export const SEED_VISITS: Visit[] = [
  { id: "v-live", helperId: "sunita", service: "companion", dayKey: "today", dateLabel: "Today", time: "2:00 PM", hours: 3, status: "live", weekly: true, total: totalFor("sunita", "companion", 3) },
  { id: "v2", helperId: "denise", service: "escort", dayKey: "tue", dateLabel: "Tue, Nov 17", time: "10:00 AM", hours: 2, status: "upcoming", total: totalFor("denise", "escort", 2) },
  { id: "v3", helperId: "sunita", service: "companion", dayKey: "thu2", dateLabel: "Thu, Nov 19", time: "2:00 PM", hours: 3, status: "upcoming", weekly: true, total: totalFor("sunita", "companion", 3) },
  { id: "p1", helperId: "sunita", service: "companion", dayKey: "p1", dateLabel: "Thu, Nov 5", time: "2:00 PM", hours: 3, status: "past", weekly: true, rated: 5, summary: "Walked to the park, played rummy, Kamala won twice.", total: totalFor("sunita", "companion", 3) },
  { id: "p2", helperId: "maria", service: "home", dayKey: "p2", dateLabel: "Fri, Oct 30", time: "11:00 AM", hours: 2, status: "past", rated: 5, summary: "Kitchen deep clean, laundry, fresh sheets.", total: totalFor("maria", "home", 2) },
  { id: "p3", helperId: "denise", service: "escort", dayKey: "p3", dateLabel: "Tue, Oct 27", time: "9:30 AM", hours: 3, status: "past", rated: 5, summary: "Cardiology follow-up. BP is stable, keep current dose.", total: totalFor("denise", "escort", 3) },
  { id: "p4", helperId: "tom", service: "tech", dayKey: "p4", dateLabel: "Sat, Oct 24", time: "1:00 PM", hours: 1, status: "past", rated: 4, summary: "Set up WhatsApp video. Kamala called you herself!", total: totalFor("tom", "tech", 1) },
];

/* ---------- cart ---------- */

export type CartItem = {
  id: string;
  helperId: string;
  service: ServiceId;
  dayKey: string;
  time: string;
  hours: number;
  weekly: boolean;
  total: number;
};

export const cartItem = (helperId: string, service: ServiceId, dayKey: string, time: string, hours: number, weekly = false): CartItem => ({
  id: `c-${helperId}-${service}-${dayKey}-${time}`, helperId, service, dayKey, time, hours, weekly,
  total: totalFor(helperId, service, hours),
});

/** Visits that are ready in the cart when the demo jumps straight to it. */
export const DEMO_CART: CartItem[] = [
  cartItem("denise", "escort", "fri", "10:00 AM", 2),
  cartItem("mei", "errands", "fri", "3:00 PM", 1),
  cartItem("sunita", "companion", "sun", "1:00 PM", 2),
];

/* ---------- Mom's usual (one-tap reorder) ---------- */

export const MOMS_USUAL = [
  { helperId: "sunita", service: "wellness" as ServiceId, dayKey: "mon", time: "10:00 AM", hours: 1, what: "Weekly check-in" },
  { helperId: "mei", service: "errands" as ServiceId, dayKey: "mon", time: "3:00 PM", hours: 1, what: "Medicine refills" },
];

/* ---------- map: Sunita's real route through Jackson Heights ---------- */

export type LatLon = [number, number];
/** 37-12 82nd St, just south of 37th Ave. */
export const MOM_HOME: LatLon = [40.7493, -73.88423];
/** Roosevelt Ave east under the 7 train, north on 74th St, east on 37th Ave, south on 82nd St (from OpenStreetMap). */
export const ROUTE: LatLon[] = [
  [40.74641, -73.89634], [40.74655, -73.8943], [40.74663, -73.8935], [40.74668, -73.89302], [40.74675, -73.89232],
  [40.74682, -73.8917], [40.74686, -73.8914], [40.74896, -73.89177], [40.74898, -73.89171], [40.74906, -73.89096],
  [40.74966, -73.88524], [40.74975, -73.88439], [40.74976, -73.88431], MOM_HOME,
];

/** every skill, in the order the filter shows them */
export const SKILLS = ["Dementia care", "Mobility & walks", "Meds reminders", "Doctor notes", "Cooking", "Housekeeping", "Driving", "Heavy lifting", "Tech setup"];
