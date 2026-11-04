"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Face } from "./illustrations";

export type ScreenId =
  | "welcome" | "verify" | "profile"
  | "home" | "booking" | "helpers" | "helper" | "checklist"
  | "pay" | "payFailed" | "confirmed"
  | "momView" | "helperCancelled" | "reschedule"
  | "tracking" | "pinMismatch" | "inProgress" | "extraTime" | "emergency"
  | "report" | "rate" | "lowRating" | "weekly";

export type Helper = { id: string; name: string; short: string; role: string; years: number; rating: number; visits: number; tags: string[] };

export const HELPERS: Helper[] = [
  { id: "sunita", name: "Sunita R.", short: "Sunita", role: "Former nurse's aide", years: 12, rating: 4.9, visits: 120, tags: ["Verified", "Speaks Hindi", "Top match"] },
  { id: "priya", name: "Priya K.", short: "Priya", role: "Retired teacher", years: 5, rating: 4.8, visits: 64, tags: ["Verified", "Speaks Hindi"] },
  { id: "meera", name: "Meera S.", short: "Meera", role: "Home health aide", years: 8, rating: 4.7, visits: 41, tags: ["Verified", "CPR certified"] },
];

export type Booking = {
  service: string;
  day: string;
  time: string;
  hours: number;
  helperId: string;
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
