"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { Nav, type Booking, type ScreenId } from "./ui";
import { CareProfile, Verify, Welcome } from "./screens/onboarding";
import { Booking as BookingScreen, Checklist, HelperProfile, Helpers, Home } from "./screens/discover";
import { Confirmed, Pay, PayFailed } from "./screens/payment";
import { HelperCancelled, MomView, Reschedule } from "./screens/before";
import { Emergency, ExtraTime, InProgress, PinMismatch, Tracking } from "./screens/dayof";
import { LowRating, Rate, Report, Weekly } from "./screens/after";

const SCREENS: Record<ScreenId, ComponentType> = {
  welcome: Welcome, verify: Verify, profile: CareProfile,
  home: Home, booking: BookingScreen, helpers: Helpers, helper: HelperProfile, checklist: Checklist,
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
    { id: "booking", num: "05", name: "Booking options" },
    { id: "helpers", num: "06", name: "Choose a helper" },
    { id: "helper", num: "07", name: "Helper profile" },
    { id: "checklist", num: "08", name: "Visit checklist" },
  ] },
  { section: "3. Payment", items: [
    { id: "pay", num: "09", name: "Review and pay" },
    { id: "payFailed", num: "09b", name: "Payment failed", edge: true },
    { id: "confirmed", num: "10", name: "Booking confirmed" },
  ] },
  { section: "4. Before the visit", items: [
    { id: "momView", num: "11", name: "Mom's view" },
    { id: "helperCancelled", num: "11b", name: "Helper cancelled", edge: true },
    { id: "reschedule", num: "11c", name: "Reschedule or cancel", edge: true },
  ] },
  { section: "5. Day of visit", items: [
    { id: "tracking", num: "12", name: "Live tracking" },
    { id: "pinMismatch", num: "12b", name: "PIN mismatch", edge: true },
    { id: "inProgress", num: "13", name: "Visit in progress" },
    { id: "extraTime", num: "13b", name: "Extra time request", edge: true },
    { id: "emergency", num: "13c", name: "Emergency", edge: true },
  ] },
  { section: "6. After the visit", items: [
    { id: "report", num: "14", name: "Visit report" },
    { id: "rate", num: "15", name: "Rate and tip" },
    { id: "lowRating", num: "15b", name: "Low rating follow-up", edge: true },
    { id: "weekly", num: "16", name: "Weekly visits" },
  ] },
];

const DEFAULT_BOOKING: Booking = {
  service: "Appointment escort", day: "Thu 30", time: "10:00 AM", hours: 3, helperId: "sunita", booked: false,
};

function readHash(): ScreenId | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash.slice(1) as ScreenId;
  return h in SCREENS ? h : null;
}

export default function App() {
  const [stack, setStack] = useState<ScreenId[]>(["welcome"]);
  const [booking, setBookingState] = useState<Booking>(DEFAULT_BOOKING);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = stack[stack.length - 1];

  // deep-link via #screenId
  useEffect(() => {
    const h = readHash();
    if (h) setStack(h === "welcome" ? ["welcome"] : ["home", h].filter((x, i, a) => a.indexOf(x) === i) as ScreenId[]);
    const onHash = () => { const x = readHash(); if (x) setStack((s) => (s[s.length - 1] === x ? s : [...s, x])); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) { hydrated.current = true; return; }
    if (window.location.hash.slice(1) !== current) history.replaceState(null, "", `#${current}`);
  }, [current]);

  const go = useCallback((id: ScreenId) => setStack((s) => [...s, id]), []);
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const reset = useCallback((id: ScreenId) => setStack(id === "home" ? ["home"] : ["home", id]), []);
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 1800);
  }, []);
  const setBooking = useCallback((patch: Partial<Booking>) => setBookingState((b) => ({ ...b, ...patch })), []);

  const jump = (id: ScreenId) => {
    setSheet(false);
    setStack(id === "welcome" ? ["welcome"] : id === "home" ? ["home"] : ["home", id]);
  };

  const Screen = SCREENS[current];

  const navigator = (
    <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
      {MAP.map((s) => (
        <div key={s.section}>
          <h2>{s.section}</h2>
          {s.items.map((it) => (
            <button key={it.id} className={current === it.id ? "on" : ""} onClick={() => jump(it.id)}>
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
        <div className="phone">
          <Screen key={`${current}-${stack.length}`} />
          {toastMsg && <div className="toast">{toastMsg}</div>}
        </div>
        {navigator}
      </div>
      <button className="fab" aria-label="All screens" onClick={() => setSheet(true)}>☰</button>
      {sheet && <div className="sheet-bg" onClick={() => setSheet(false)}>{navigator}</div>}
    </Nav.Provider>
  );
}
