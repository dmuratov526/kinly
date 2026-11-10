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
  },
  {
    id: "escort", name: "Doctor visits", short: "Doctor", blurb: "Door-to-door rides plus notes from the doctor", from: 25, unit: "hr",
    hue: "#7B5CF0", tint: "#EEE9FE",
    tasks: [
      { t: "Pick Mom up from home", on: true },
      { t: "Stay with her at the appointment", on: true },
      { t: "Take notes from the doctor", on: true },
      { t: "Pharmacy pickup on the way back", on: false },
    ],
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
  },
  {
    id: "home", name: "Home help", short: "Home", blurb: "Light cleaning, laundry and fresh sheets", from: 20, unit: "hr",
    hue: "#22A57A", tint: "#DFF5EC",
    tasks: [
      { t: "Tidy kitchen and living room", on: true },
      { t: "Laundry: wash and fold", on: true },
      { t: "Change the bed sheets", on: true },
      { t: "Take out the trash", on: false },
    ],
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

export const HELPERS: Helper[] = [
  {
    id: "sunita", name: "Sunita Rao", first: "Sunita", photo: "/img/sunita.jpg", role: "Former nurse's aide", years: 12,
    rating: 4.97, reviews: 96, visits: 312, adj: 2, miles: 1.2, langs: ["Hindi", "English", "Marathi"], cpr: true,
    services: ["companion", "escort", "wellness", "errands"], next: "Today · 2 PM", today: true, match: 98,
    daysOff: ["sat"], busy: ["9:00 AM"],
    bio: "I spent 12 years as a nurse's aide at Elmhurst Hospital. Now I help families the way I'd want someone to help my own mother: patiently, and always with a cup of chai.",
    badges: ["Top Helper", "Hindi speaker"], onTime: 99, repeat: 87,
  },
  {
    id: "priya", name: "Priya Kapoor", first: "Priya", photo: "/img/priya.jpg", role: "Retired schoolteacher", years: 5,
    rating: 4.9, reviews: 58, visits: 140, adj: 1, miles: 2.4, langs: ["Hindi", "Punjabi", "English"], cpr: true,
    services: ["companion", "tech", "errands"], next: "Tomorrow · 9 AM", today: false, match: 94,
    daysOff: ["today"], busy: ["1:00 PM", "2:00 PM"],
    bio: "Thirty years teaching fourth grade made me very, very patient. I love teaching seniors to video-call their grandkids.",
    badges: ["Tech whiz", "Hindi speaker"], onTime: 97, repeat: 81,
  },
  {
    id: "meera", name: "Meera Shah", first: "Meera", photo: "/img/meera.jpg", role: "Certified home health aide", years: 8,
    rating: 4.85, reviews: 41, visits: 205, adj: 1, miles: 0.8, langs: ["Gujarati", "Hindi", "English"], cpr: true,
    services: ["home", "wellness", "companion", "errands"], next: "Today · 4 PM", today: true, match: 91,
    daysOff: [], busy: ["10:00 AM", "11:00 AM"],
    bio: "HHA certified, 8 years in Jackson Heights. I keep homes calm and tidy, and I always leave a note of what I did.",
    badges: ["HHA certified", "Closest"], onTime: 98, repeat: 84,
  },
  {
    id: "denise", name: "Denise Walker", first: "Denise", photo: "/img/denise.jpg", role: "Registered nurse (RN)", years: 15,
    rating: 4.93, reviews: 120, visits: 488, adj: 3, miles: 3.1, langs: ["English", "Spanish"], cpr: true,
    services: ["escort", "wellness"], next: "Fri · 10 AM", today: false, match: 88,
    daysOff: ["today", "tue"], busy: [],
    bio: "RN with 15 years in geriatrics. I translate doctor-speak into plain English and make sure nothing gets missed.",
    badges: ["Registered nurse", "Has a car"], onTime: 99, repeat: 90,
  },
  {
    id: "grace", name: "Grace Okafor", first: "Grace", photo: "/img/grace.jpg", role: "Nursing student, NYU", years: 2,
    rating: 4.8, reviews: 18, visits: 46, adj: 0, miles: 1.9, langs: ["English", "Igbo"], cpr: true,
    services: ["companion", "errands", "tech", "home"], next: "Today · 1 PM", today: true, match: 82,
    daysOff: ["fri"], busy: ["9:00 AM", "10:00 AM"],
    bio: "Nursing student who grew up caring for my grandma. Upbeat, reliable, and great at board games.",
    badges: ["New on Kinly"], onTime: 100, repeat: 76,
  },
  {
    id: "mei", name: "Mei Lin", first: "Mei", photo: "/img/mei.jpg", role: "Caregiver and driver", years: 6,
    rating: 4.88, reviews: 63, visits: 190, adj: 1, miles: 2.7, langs: ["English", "Mandarin"], cpr: true,
    services: ["escort", "errands", "companion"], next: "Today · 3 PM", today: true, match: 85,
    daysOff: ["sat"], busy: ["1:00 PM"],
    bio: "I have a clean, roomy Honda CR-V and a lot of patience for long pharmacy lines.",
    badges: ["Has a car", "Clean record"], onTime: 96, repeat: 79,
  },
];
export const helper = (id: string) => HELPERS.find((h) => h.id === id) ?? HELPERS[0];

export const REVIEWS = [
  { who: "Anjali M.", rel: "daughter", photo: "/img/rev1.jpg", when: "2 weeks ago", stars: 5, text: "My father now asks every Monday when Sunita is coming. She sends photos after every walk and the notes from his cardiologist were better than mine." },
  { who: "David K.", rel: "son", photo: "/img/rev3.jpg", when: "1 month ago", stars: 5, text: "Calm, punctual, kind. She noticed Mom's new dizziness before we did and flagged it right away." },
  { who: "Leila S.", rel: "granddaughter", photo: "/img/rev2.jpg", when: "1 month ago", stars: 5, text: "Nani lit up the moment Sunita spoke Hindi with her. Worth every penny." },
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
  const s = svc(service && h.services.includes(service) ? service : h.services.find((x) => svc(x).unit === "hr") ?? h.services[0]);
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
  { id: "p1", helperId: "sunita", service: "companion", dayKey: "p1", dateLabel: "Thu, Nov 5", time: "2:00 PM", hours: 3, status: "past", weekly: true, rated: 5, summary: "Walked to the park, played rummy, Mom won twice.", total: totalFor("sunita", "companion", 3) },
  { id: "p2", helperId: "meera", service: "home", dayKey: "p2", dateLabel: "Fri, Oct 30", time: "11:00 AM", hours: 2, status: "past", rated: 5, summary: "Kitchen deep clean, laundry, fresh sheets.", total: totalFor("meera", "home", 2) },
  { id: "p3", helperId: "denise", service: "escort", dayKey: "p3", dateLabel: "Tue, Oct 27", time: "9:30 AM", hours: 3, status: "past", rated: 5, summary: "Cardiology follow-up. BP is stable, keep current dose.", total: totalFor("denise", "escort", 3) },
  { id: "p4", helperId: "priya", service: "tech", dayKey: "p4", dateLabel: "Sat, Oct 24", time: "1:00 PM", hours: 1, status: "past", rated: 4, summary: "Set up WhatsApp video. Mom called you herself!", total: totalFor("priya", "tech", 1) },
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
