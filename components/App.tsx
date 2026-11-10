"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { BatteryFull, CalendarDays, Check, Compass, HeartPulse, Heart, House, IdCard, Info, ListOrdered, ShieldCheck, ShoppingCart, Signal, Umbrella, Wifi, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { DEMO_CART, SEED_VISITS, day, svc, type CartItem, type Visit } from "./data";
import { Btn, CountBadge, Sheet, softSpring } from "./kit";
import { NO_FILTERS, StoreCtx, TAB_ROOTS, useStore, type Draft, type LiveStage, type ScreenId, type Store } from "./store";
import { Home } from "./screens/Home";
import { Explore } from "./screens/Explore";
import { HelperProfile } from "./screens/HelperProfile";
import { Book } from "./screens/Book";
import { Confirmed } from "./screens/Confirmed";
import { Visits } from "./screens/Visits";
import { Live } from "./screens/Live";
import { Report } from "./screens/Report";
import { Emergency, Mom, MomMap } from "./screens/Mom";
import { Cart } from "./screens/Cart";

const SCREENS: Record<ScreenId, ComponentType> = {
  home: Home, explore: Explore, helper: HelperProfile, book: Book, confirmed: Confirmed, cart: Cart,
  visits: Visits, live: Live, report: Report, mom: Mom, momMap: MomMap, emergency: Emergency,
};

/** The pitch, in order. Each step says what it fixes from the critique. */
const STORY: { id: ScreenId; title: string; why: string; points: string[] }[] = [
  { id: "home", title: "Home", why: "A homepage that feels like one", points: ["What's happening with Mom right now, live", "\"Mom's usual\": rebook her week in one tap", "Categories with prices, like a real marketplace", "Cart in the header to stack several visits"] },
  { id: "explore", title: "Find help", why: "One search bar + filters", points: ["Services, time and needs in one place", "Filters that really filter: price, language, rating, distance", "Match me picks the best fit instantly"] },
  { id: "helper", title: "Helper profile", why: "Trust in five seconds", points: ["Photo, video intro and the Kinly Safe badge up top", "Ask a question before reading reviews", "Live availability for the week"] },
  { id: "book", title: "Book", why: "Booking on one screen", points: ["Day, time, length and checklist together", "Book now, or add to cart and stack visits", "Small 5% care fee, charged after the visit"] },
  { id: "confirmed", title: "Booked", why: "A moment of relief", points: ["Clear ticket with time and door PIN", "Mom gets a text with Sunita's photo", "Family is looped in automatically"] },
  { id: "visits", title: "Visits", why: "Track what you've booked", points: ["Upcoming and Past, the missing Job-to-be-done", "Live visit pinned to the top", "Rebook a favorite in one tap"] },
  { id: "live", title: "Live visit", why: "Peace of mind, in real time", points: ["Live map on real streets, with ETA", "Emergency button always in view", "Tasks tick off and photos arrive live"] },
  { id: "report", title: "Visit report", why: "Proof of care", points: ["Mood, meals, meds and steps at a glance", "Turn Sunita's note into a question for the doctor", "Rate in two taps"] },
  { id: "mom", title: "Mom's phone", why: "Mom's own app, built for 78", points: ["A separate app: no tabs, nothing in the way", "Her door code and where Sunita is right now", "One tap for help, 5 seconds to cancel"] },
  { id: "emergency", title: "Emergency", why: "When it really matters", points: ["911, family and a nurse in one tap", "Meds and allergies shared with responders", "Cancel if it was a false alarm"] },
];

const PARENT: Partial<Record<ScreenId, ScreenId>> = {
  helper: "explore", book: "explore", confirmed: "home", live: "visits", report: "visits", emergency: "mom", momMap: "mom",
};
const stackFor = (id: ScreenId): ScreenId[] =>
  TAB_ROOTS.includes(id) || id === "mom" ? [id] : id === "book" ? ["explore", "helper", "book"] : [PARENT[id] ?? "home", id];

const toVisit = (c: CartItem): Visit => ({
  id: `v-${c.id}-${Date.now()}`, helperId: c.helperId, service: c.service, dayKey: c.dayKey, dateLabel: day(c.dayKey).label,
  time: c.time, hours: c.hours, status: "upcoming", weekly: c.weekly, total: c.total,
});
const LIGHT_STATUS: ScreenId[] = ["report", "emergency", "helper"];
/** screens whose content scrolls under the status bar get a frosted backdrop behind it */
const FROST_STATUS: ScreenId[] = ["home", "explore", "visits", "cart", "mom"];

const DEFAULT_DRAFT: Draft = {
  service: "companion", helperId: "sunita", dayKey: "today", time: "2:00 PM", hours: 3, tasks: svc("companion").tasks, weekly: true,
};

type Toast = { id: number; msg: string; icon: "check" | "info" | "heart" };

export default function App() {
  const [stack, setStack] = useState<ScreenId[]>(["home"]);
  const [dir, setDir] = useState<1 | -1 | 0>(0);
  const [draft, setDraftState] = useState<Draft>(DEFAULT_DRAFT);
  const [explore, setExploreState] = useState<Store["explore"]>({ service: null, when: null, focus: false, filters: NO_FILTERS });
  const [visits, setVisits] = useState<Visit[]>(SEED_VISITS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastBooking, setLastBooking] = useState<CartItem[]>([]);
  const [live, setLiveState] = useState<LiveStage>(0);
  const [driveStart, setDriveStart] = useState(() => Date.now());
  const [safe, setSafe] = useState(false);
  const [splash, setSplash] = useState(true);
  const hideSplash = useCallback(() => setSplash(false), []);
  const setLive = useCallback((s: LiveStage) => {
    if (s === 0) setDriveStart(Date.now());
    setLiveState(s);
  }, []);
  const [favs, setFavs] = useState<string[]>(["sunita"]);
  const [toastState, setToastState] = useState<Toast | null>(null);
  const [steps, setSteps] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const screen = stack[stack.length - 1];

  /* ---------- navigation ---------- */
  const go = useCallback((id: ScreenId) => {
    history.pushState(null, "", `#${id}`);
    setDir(1);
    setStack((s) => [...s, id]);
  }, []);
  const back = useCallback(() => {
    setDir(-1);
    setStack((s) => {
      if (s.length <= 1) return s;
      const n = s.slice(0, -1);
      history.replaceState(null, "", `#${n[n.length - 1]}`);
      return n;
    });
  }, []);
  const tab = useCallback((id: ScreenId) => {
    history.replaceState(null, "", `#${id}`);
    setDir(0);
    setStack([id]);
  }, []);
  const jump = useCallback((id: ScreenId) => {
    history.replaceState(null, "", `#${id}`);
    setDir(0);
    if (id === "live" || id === "mom") setLive(0);
    if (id === "cart") setCart((c) => (c.length ? c : DEMO_CART));
    if (id === "confirmed") setLastBooking([]);
    if (id === "helper" || id === "book") setDraftState((d) => ({ ...d, helperId: "sunita", service: "companion", tasks: svc("companion").tasks, dayKey: "today", time: "2:00 PM" }));
    setStack(stackFor(id));
    setSteps(false);
  }, [setLive]);

  useEffect(() => {
    const h = location.hash.slice(1) as ScreenId;
    if (h in SCREENS) setStack(stackFor(h));
    const onPop = () => {
      const t = location.hash.slice(1) as ScreenId;
      setDir(-1);
      setStack((s) => {
        const i = s.lastIndexOf(t);
        return i >= 0 ? s.slice(0, i + 1) : stackFor(t in SCREENS ? t : "home");
      });
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  const toast = useCallback((msg: string, icon: Toast["icon"] = "check") => {
    setToastState({ id: Date.now(), msg, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(null), 2300);
  }, []);

  const store: Store = {
    screen, dir, go, back, tab, toast,
    draft, setDraft: (p) => setDraftState((d) => ({ ...d, ...p })),
    explore, setExplore: (p) => setExploreState((e) => ({ ...e, ...p })),
    visits, addVisit: (v) => setVisits((vs) => [...vs.filter((x) => x.status !== "upcoming" || x.id !== v.id), v].sort((a, b) => (a.status === "live" ? -1 : b.status === "live" ? 1 : 0))),
    cancelVisit: (id) => setVisits((vs) => vs.filter((v) => v.id !== id)),
    cart,
    addToCart: (c) => setCart((cs) => [...cs.filter((x) => x.id !== c.id), c]),
    removeFromCart: (id) => setCart((cs) => cs.filter((x) => x.id !== id)),
    checkout: () => {
      setVisits((vs) => [...vs, ...cart.map(toVisit)]);
      setLastBooking(cart);
      setCart([]);
      go("confirmed");
    },
    lastBooking, setLastBooking,
    live, setLive, driveStart,
    favs, toggleFav: (id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    showSafe: () => setSafe(true),
  };

  /* ---------- story stepping (desktop arrows) ---------- */
  const storyIdx = STORY.findIndex((s) => s.id === screen);
  const step = (d: number) => {
    const n = STORY[(storyIdx < 0 ? 0 : storyIdx) + d];
    if (n) jump(n.id);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  /* ---------- fit the phone to the window ---------- */
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (innerHeight - 40) / 876));
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  const Screen = SCREENS[screen];
  const isRoot = TAB_ROOTS.includes(screen);
  const story = STORY[storyIdx];

  const variants = {
    enter: (d: number) => (d === 0 ? { opacity: 0, scale: 0.985 } : { x: d > 0 ? "100%" : "-28%", opacity: d > 0 ? 1 : 0.6 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => (d === 0 ? { opacity: 0 } : { x: d > 0 ? "-28%" : "100%", opacity: d > 0 ? 0.6 : 1 }),
  };

  return (
    <StoreCtx.Provider value={store}>
      <div className="stage">
        <div className="aurora"><i /><i /><i /></div>
        <div className="grain" />

        {/* ---------- left: pitch ---------- */}
        <aside className="pitch">
          <div className="brand">
            <span className="brand-mark"><Heart size={18} fill="currentColor" strokeWidth={0} /></span>
            kinly
          </div>
          <h1 className="pitch-title">Care for Mom,<br /><i>from anywhere.</i></h1>
          <p className="pitch-sub">Book vetted helpers for your parents, watch every visit live, and get a report when it&apos;s done.</p>
          <nav className="story">
            {STORY.map((s, i) => (
              <button key={s.id} className={s.id === screen ? "on" : ""} onClick={() => jump(s.id)}>
                <span className="story-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="story-title">{s.title}</span>
                {s.id === screen && <motion.span layoutId="story-on" className="story-bg" transition={softSpring} />}
              </button>
            ))}
          </nav>
          <div className="keys"><kbd>←</kbd><kbd>→</kbd> step through the demo</div>
        </aside>

        {/* ---------- phone ---------- */}
        <div className="device-wrap" style={{ ["--scale" as string]: scale }}>
          <div className="device">
            <div className="device-btn b1" /><div className="device-btn b2" /><div className="device-btn b3" /><div className="device-btn b4" />
            <div className="screen-glass">
              <div className={`statusbar ${LIGHT_STATUS.includes(screen) ? "light" : ""} ${FROST_STATUS.includes(screen) ? `frost ${screen}` : ""}`}>
                <span>2:04</span>
                <span className="sb-icons"><Signal size={15} strokeWidth={2.6} /><Wifi size={15} strokeWidth={2.6} /><BatteryFull size={20} strokeWidth={2} /></span>
              </div>

              {/* dynamic island doubles as the toast */}
              <motion.div className="island" layout transition={{ type: "spring", stiffness: 500, damping: 34 }} style={{ borderRadius: 24 }}>
                <AnimatePresence mode="popLayout">
                  {toastState && (
                    <motion.div key={toastState.id} className="island-toast" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <span className={`island-ic ${toastState.icon}`}>
                        {toastState.icon === "check" ? <Check size={14} strokeWidth={3} /> : toastState.icon === "heart" ? <Heart size={13} fill="currentColor" strokeWidth={0} /> : <Info size={14} strokeWidth={2.6} />}
                      </span>
                      <span className="island-msg">{toastState.msg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="viewport">
                <AnimatePresence initial={false} custom={dir} mode="popLayout">
                  <motion.div
                    key={`${screen}-${stack.length}`}
                    className="page"
                    custom={dir}
                    variants={variants}
                    initial="enter" animate="center" exit="exit"
                    transition={dir === 0 ? { duration: 0.22 } : { type: "spring", stiffness: 380, damping: 40 }}
                  >
                    <Screen />
                  </motion.div>
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {isRoot && <TabBar key="tabbar" />}
              </AnimatePresence>

              <Sheet open={safe} onClose={() => setSafe(false)}>
                <SafeSheet onClose={() => setSafe(false)} />
              </Sheet>

              <AnimatePresence>
                {splash && <Splash key="splash" onDone={hideSplash} />}
              </AnimatePresence>
              <div className={`home-indicator ${LIGHT_STATUS.includes(screen) && screen !== "helper" ? "light" : ""}`} />
            </div>
          </div>
        </div>

        {/* ---------- right: why this screen ---------- */}
        <aside className="why">
          <AnimatePresence mode="wait">
            {story && (
              <motion.div key={story.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <div className="why-step">Step {storyIdx + 1} of {STORY.length}</div>
                <h2 className="why-title">{story.why}</h2>
                <ul className="why-list">
                  {story.points.map((p, i) => (
                    <motion.li key={p} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                      <span><Check size={13} strokeWidth={3} /></span>{p}
                    </motion.li>
                  ))}
                </ul>
                <div className="why-nav">
                  <button disabled={storyIdx <= 0} onClick={() => step(-1)}>← Back</button>
                  <button className="primary" disabled={storyIdx >= STORY.length - 1} onClick={() => step(1)}>Next →</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* ---------- mobile: demo steps ---------- */}
        <button className="steps-fab" onClick={() => setSteps(true)} aria-label="Demo steps"><ListOrdered size={16} /></button>
        <AnimatePresence>
          {steps && (
            <motion.div className="steps-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSteps(false)}>
              <motion.div className="steps-sheet" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={softSpring} onClick={(e) => e.stopPropagation()}>
                <div className="row between" style={{ marginBottom: 8 }}>
                  <b style={{ fontSize: 17 }}>Demo steps</b>
                  <button className="icon-btn" onClick={() => setSteps(false)} aria-label="Close"><X size={18} /></button>
                </div>
                {STORY.map((s, i) => (
                  <button key={s.id} className={`steps-row ${s.id === screen ? "on" : ""}`} onClick={() => jump(s.id)}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <b>{s.title}</b>
                    <em>{s.why}</em>
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StoreCtx.Provider>
  );
}

function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1800);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <motion.div className="splash" onClick={onDone} exit={{ opacity: 0, scale: 1.06 }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
      <div className="splash-glow" />
      <motion.div className="splash-logo" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
        <span className="splash-mark"><Heart size={34} fill="currentColor" strokeWidth={0} /></span>
        kinly
      </motion.div>
      <motion.p className="splash-tag" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
        Care for Mom, <i>from anywhere</i>
      </motion.p>
      <div className="splash-dots"><i /><i /><i /></div>
    </motion.div>
  );
}

function SafeSheet({ onClose }: { onClose: () => void }) {
  const rows = [
    { Icon: ShieldCheck, t: "Background check", d: "Criminal and abuse registries, renewed every year" },
    { Icon: IdCard, t: "ID verification", d: "Government ID matched to a live selfie" },
    { Icon: HeartPulse, t: "CPR training", d: "CPR and First Aid certified, refreshed every 2 years" },
    { Icon: Umbrella, t: "Insurance", d: "$2M liability cover on every single visit" },
  ];
  return (
    <div className="safe">
      <div className="safe-head">
        <span className="safe-seal"><ShieldCheck size={28} strokeWidth={2.2} /></span>
        <div>
          <h3 className="display" style={{ fontSize: 30 }}>Kinly <i>Safe</i></h3>
          <span className="small muted">Every helper, before their first visit</span>
        </div>
      </div>
      <div className="safe-list">
        {rows.map(({ Icon, t, d }, i) => (
          <motion.div key={t} className="safe-row" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.06 }}>
            <span className="safe-ic"><Icon size={19} /></span>
            <div className="grow"><b>{t}</b><span>{d}</span></div>
            <Check size={18} strokeWidth={3} className="ok" />
          </motion.div>
        ))}
      </div>
      <p className="safe-note">&ldquo;We only send someone we&apos;d trust with our own mothers.&rdquo;<span>The Kinly team</span></p>
      <Btn kind="primary" style={{ width: "100%" }} onClick={onClose}>Got it</Btn>
    </div>
  );
}

function TabBar() {
  const { screen, tab, live, cart } = useStore();
  const tabs = [
    { id: "home" as const, label: "Home", Icon: House },
    { id: "explore" as const, label: "Explore", Icon: Compass },
    { id: "visits" as const, label: "Visits", Icon: CalendarDays },
    { id: "cart" as const, label: "Cart", Icon: ShoppingCart },
  ];
  return (
    <motion.nav className="tabbar" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={softSpring}>
      <LayoutGroup id="tabs">
        {tabs.map(({ id, label, Icon }) => {
          const on = screen === id;
          return (
            <button key={id} className={on ? "on" : ""} onClick={() => !on && tab(id)}>
              {on && <motion.span layoutId="tab-bg" className="tab-bg" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
              <Icon size={21} strokeWidth={on ? 2.4 : 2} />
              <span>{label}</span>
              {id === "visits" && live < 3 && <span className="tab-live" />}
              {id === "cart" && <CountBadge n={cart.length} />}
            </button>
          );
        })}
      </LayoutGroup>
    </motion.nav>
  );
}

