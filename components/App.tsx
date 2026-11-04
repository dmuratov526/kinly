"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { Nav, type Booking, type ScreenId } from "./ui";
import { CareProfile, Verify, Welcome } from "./screens/onboarding";
import { Available, Booking as BookingScreen, Checklist, HelperProfile, Helpers, Home } from "./screens/discover";
import { Confirmed, Pay, PayFailed } from "./screens/payment";
import { HelperCancelled, MomView, Reschedule } from "./screens/before";
import { Emergency, ExtraTime, InProgress, PinMismatch, Tracking } from "./screens/dayof";
import { LowRating, Rate, Report, Weekly } from "./screens/after";

const SCREENS: Record<ScreenId, ComponentType> = {
  welcome: Welcome, verify: Verify, profile: CareProfile,
  home: Home, booking: BookingScreen, helpers: Helpers, available: Available, helper: HelperProfile, checklist: Checklist,
  pay: Pay, payFailed: PayFailed, confirmed: Confirmed,
  momView: MomView, helperCancelled: HelperCancelled, reschedule: Reschedule,
  tracking: Tracking, pinMismatch: PinMismatch, inProgress: InProgress, extraTime: ExtraTime, emergency: Emergency,
  report: Report, rate: Rate, lowRating: LowRating, weekly: Weekly,
};

const MAP: { section: string; items: { id: ScreenId; num: string; name: string; edge?: boolean }[] }[] = [
  { section: "1. Sign up", items: [
    { id: "welcome", num: "01", name: "Welcome and sign up" },
    { id: "verify", num: "02", name: "Verify phone" },
    { id: "profile", num: "03", name: "Mom's care profile" },
  ] },
  { section: "2. Discover and choose", items: [
    { id: "home", num: "04", name: "Home" },
    { id: "helpers", num: "05", name: "Browse helpers" },
    { id: "available", num: "06", name: "Search by time" },
    { id: "helper", num: "07", name: "Helper profile" },
    { id: "booking", num: "08", name: "Pick a time" },
    { id: "checklist", num: "09", name: "Visit checklist" },
  ] },
  { section: "3. Payment", items: [
    { id: "pay", num: "10", name: "Review and pay" },
    { id: "payFailed", num: "10b", name: "Payment failed", edge: true },
    { id: "confirmed", num: "11", name: "Booking confirmed" },
  ] },
  { section: "4. Before the visit", items: [
    { id: "momView", num: "12", name: "Mom's view" },
    { id: "helperCancelled", num: "12b", name: "Helper cancelled", edge: true },
    { id: "reschedule", num: "12c", name: "Reschedule or cancel", edge: true },
  ] },
  { section: "5. Day of visit", items: [
    { id: "tracking", num: "13", name: "Live tracking" },
    { id: "pinMismatch", num: "13b", name: "PIN mismatch", edge: true },
    { id: "inProgress", num: "14", name: "Visit in progress" },
    { id: "extraTime", num: "14b", name: "Extra time request", edge: true },
    { id: "emergency", num: "14c", name: "Emergency", edge: true },
  ] },
  { section: "6. After the visit", items: [
    { id: "report", num: "15", name: "Visit report" },
    { id: "rate", num: "16", name: "Rate and tip" },
    { id: "lowRating", num: "16b", name: "Low rating follow-up", edge: true },
    { id: "weekly", num: "17", name: "Weekly visits" },
  ] },
];

const DEFAULT_BOOKING: Booking = {
  service: "Appointment escort", day: "Thu 30", time: "10:00 AM", hours: 3, helperId: "sunita", scheduled: false, booked: false,
};

function readHash(): ScreenId | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash.slice(1) as ScreenId;
  return h in SCREENS ? h : null;
}

const FLAT = MAP.flatMap((s) => s.items);

function rootStack(id: ScreenId): ScreenId[] {
  return id === "welcome" ? ["welcome"] : id === "home" ? ["home"] : ["home", id];
}

export default function App() {
  const [stack, setStack] = useState<ScreenId[]>(["welcome"]);
  const [booking, setBookingState] = useState<Booking>(DEFAULT_BOOKING);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = stack[stack.length - 1];

  // Deep-link via #screenId, and sync with browser history so the phone's
  // back gesture / back button walks back through the prototype.
  useEffect(() => {
    const h = readHash();
    if (h) setStack(rootStack(h));
    history.replaceState(null, "", `#${h ?? "welcome"}`);
    const onPop = () => {
      const target = readHash() ?? "welcome";
      setStack((s) => {
        const i = s.lastIndexOf(target);
        return i >= 0 ? s.slice(0, i + 1) : rootStack(target);
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const push = (id: ScreenId) => history.pushState(null, "", `#${id}`);
  const go = useCallback((id: ScreenId) => { push(id); setStack((s) => [...s, id]); }, []);
  const back = useCallback(() => { if (stack.length > 1) history.back(); }, [stack.length]);
  const reset = useCallback((id: ScreenId) => { push(id); setStack(rootStack(id)); }, []);
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 1800);
  }, []);
  const setBooking = useCallback((patch: Partial<Booking>) => setBookingState((b) => ({ ...b, ...patch })), []);

  const jump = (id: ScreenId) => {
    setSheet(false);
    if (id !== current) reset(id);
  };

  const idx = FLAT.findIndex((x) => x.id === current);
  const meta = FLAT[idx];
  const step = (d: number) => {
    const n = FLAT[idx + d];
    if (n) jump(n.id);
  };

  // desktop: arrow keys flip through screens
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // keep the active row visible when the sheet opens
  const activeRow = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (sheet) activeRow.current?.scrollIntoView({ block: "center" });
  }, [sheet]);

  const Screen = SCREENS[current];

  const navigator = (
    <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
      {MAP.map((s) => (
        <div key={s.section}>
          <h2>{s.section}</h2>
          {s.items.map((it) => (
            <button key={it.id} ref={current === it.id ? activeRow : undefined} className={current === it.id ? "on" : ""} onClick={() => jump(it.id)}>
              <span className="num">{it.num}</span>
              <span className="grow">{it.name}</span>
              {it.edge && <span className="badge">EDGE</span>}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );

  return (
    <Nav.Provider value={{ go, back, reset, toast, booking, setBooking }}>
      <div className="stage">
        <div className="protobar">
          <button aria-label="Previous screen" disabled={idx <= 0} onClick={() => step(-1)}>‹</button>
          <button className="protobar-title" onClick={() => setSheet(true)}>
            <span className="num">{meta?.num}</span>
            <span className="name">{meta?.name}</span>
            {meta?.edge && <span className="badge">EDGE</span>}
            <span className="caret">▾</span>
          </button>
          <button aria-label="Next screen" disabled={idx >= FLAT.length - 1} onClick={() => step(1)}>›</button>
        </div>
        <div className="phone">
          <Screen key={`${current}-${stack.length}`} />
          {toastMsg && <div className="toast">{toastMsg}</div>}
        </div>
        {navigator}
      </div>
      {sheet && (
        <div className="sheet-bg" onClick={() => setSheet(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <b>All screens</b>
              <button onClick={() => setSheet(false)} aria-label="Close">✕</button>
            </div>
            {navigator}
          </div>
        </div>
      )}
    </Nav.Provider>
  );
}
