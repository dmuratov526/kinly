"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Face } from "./illustrations";

export type ScreenId =
  | "welcome" | "verify" | "profile"
  | "home" | "booking" | "helpers" | "available" | "helper" | "checklist"
  | "pay" | "payFailed" | "confirmed"
  | "momView" | "helperCancelled" | "reschedule"
  | "tracking" | "pinMismatch" | "inProgress" | "extraTime" | "emergency"
  | "report" | "rate" | "lowRating" | "weekly";

export type Helper = {
  id: string; name: string; short: string; role: string; years: number; rating: number; visits: number;
  tags: string[]; miles: number; next: string; today: boolean; langs: string[]; cpr: boolean; match: number;
  /** days with no availability, and start times already booked */
  daysOff: string[]; busy: string[];
};

export const HELPERS: Helper[] = [
  { id: "sunita", name: "Sunita R.", short: "Sunita", role: "Former nurse's aide", years: 12, rating: 4.9, visits: 120, tags: ["Verified", "Speaks Hindi", "Top match"], miles: 1.2, next: "Today, 2 PM", today: true, langs: ["Hindi", "English"], cpr: true, match: 98, daysOff: ["Sat 1"], busy: ["9:00 AM"] },
  { id: "priya", name: "Priya K.", short: "Priya", role: "Retired teacher", years: 5, rating: 4.8, visits: 64, tags: ["Verified", "Speaks Hindi"], miles: 2.5, next: "Tomorrow, 9 AM", today: false, langs: ["Hindi", "English"], cpr: false, match: 91, daysOff: ["Tue 28"], busy: ["1:00 PM", "2:00 PM"] },
  { id: "meera", name: "Meera S.", short: "Meera", role: "Home health aide", years: 8, rating: 4.7, visits: 41, tags: ["Verified", "CPR certified"], miles: 0.8, next: "Today, 4 PM", today: true, langs: ["English", "Tamil"], cpr: true, match: 86, daysOff: [], busy: ["10:00 AM", "11:00 AM"] },
  { id: "lakshmi", name: "Lakshmi P.", short: "Lakshmi", role: "Caregiver, 2 languages", years: 15, rating: 4.9, visits: 210, tags: ["Verified", "Speaks Hindi", "CPR certified"], miles: 4.1, next: "Fri, 10 AM", today: false, langs: ["Hindi", "Gujarati", "English"], cpr: true, match: 89, daysOff: ["Tue 28", "Wed 29", "Thu 30"], busy: [] },
  { id: "grace", name: "Grace O.", short: "Grace", role: "Nursing student", years: 2, rating: 4.6, visits: 18, tags: ["Verified", "New on Kinly"], miles: 1.9, next: "Today, 1 PM", today: true, langs: ["English"], cpr: true, match: 74, daysOff: ["Fri 31"], busy: ["9:00 AM", "10:00 AM"] },
];

export type Booking = {
  service: string;
  day: string;
  time: string;
  hours: number;
  helperId: string;
  /** true once a date/time has been chosen for this booking */
  scheduled: boolean;
  booked: boolean;
};

type Ctx = {
  go: (id: ScreenId) => void;
  back: () => void;
  reset: (id: ScreenId) => void;
  toast: (msg: string) => void;
  booking: Booking;
  setBooking: (patch: Partial<Booking>) => void;
};

export const Nav = createContext<Ctx | null>(null);
export const useNav = () => {
  const c = useContext(Nav);
  if (!c) throw new Error("Nav context missing");
  return c;
};
export const useHelper = () => {
  const { booking } = useNav();
  return HELPERS.find((h) => h.id === booking.helperId) ?? HELPERS[0];
};

/* ---------- primitives ---------- */

export function TopBar({ title, sub, right, onBack }: { title: string; sub?: string; right?: ReactNode; onBack?: () => void }) {
  const { back } = useNav();
  return (
    <div className="topbar">
      <button className="back" aria-label="Back" onClick={onBack ?? back}>‹</button>
      <div className="grow">
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export function Btn({ kind = "primary", className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: string }) {
  return <button className={`btn ${kind} ${className}`} {...p} />;
}

export function Chip({ on, onClick, children, className = "" }: { on?: boolean; onClick?: () => void; children: ReactNode; className?: string }) {
  return <button className={`chip ${on ? "on" : ""} ${className}`} onClick={onClick}>{children}</button>;
}

export function Check({ on }: { on: boolean }) {
  return <span className={`cb ${on ? "on" : ""}`}>{on ? "✓" : ""}</span>;
}

export function Radio({ on }: { on: boolean }) {
  return <span className={`radio ${on ? "on" : ""}`} />;
}

export function Avatar({ size = 48, dashed, who }: { size?: number; dashed?: boolean; who?: string }) {
  if (who) return <Face who={who} size={size} />;
  return <span className={`avatar ${dashed ? "dashed" : ""}`} style={{ width: size, height: size, display: "inline-block" }} />;
}

/** Single-select chips helper */
export function useSingle<T>(initial: T) {
  return useState<T>(initial);
}

/** Multi-select toggle helper */
export function useMulti(initial: string[] = []) {
  const [set, setSet] = useState<string[]>(initial);
  const toggle = (v: string) => setSet((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  return [set, toggle] as const;
}
