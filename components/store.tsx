"use client";

import { createContext, useContext } from "react";
import type { CartItem, ServiceId, Visit } from "./data";

export type ScreenId =
  | "home" | "explore" | "helper" | "book" | "confirmed" | "cart"
  | "visits" | "live" | "report" | "mom" | "momMap" | "emergency";

/** Rohan's app tabs. Mom's phone is its own app and has no tab bar. */
export const TAB_ROOTS: ScreenId[] = ["home", "explore", "visits", "cart"];

export type Draft = {
  service: ServiceId;
  helperId: string;
  dayKey: string;
  time: string;
  hours: number;
  tasks: { t: string; on: boolean }[];
  weekly: boolean;
};

/** 0 on the way · 1 arrived · 2 visit in progress · 3 finished */
export type LiveStage = 0 | 1 | 2 | 3;

export type Filters = {
  today: boolean;
  langs: string[];
  minRating: number | null;
  maxMiles: number | null;
  maxRate: number | null;
  car: boolean;
};
export const NO_FILTERS: Filters = { today: false, langs: [], minRating: null, maxMiles: null, maxRate: null, car: false };

export type Store = {
  screen: ScreenId;
  dir: 1 | -1 | 0;
  go: (id: ScreenId) => void;
  back: () => void;
  tab: (id: ScreenId) => void;
  toast: (msg: string, icon?: "check" | "info" | "heart") => void;

  draft: Draft;
  setDraft: (p: Partial<Draft>) => void;

  explore: { service: ServiceId | null; when: { dayKey: string; time: string } | null; focus: boolean; filters: Filters };
  setExplore: (p: Partial<Store["explore"]>) => void;

  visits: Visit[];
  addVisit: (v: Visit) => void;
  cancelVisit: (id: string) => void;

  cart: CartItem[];
  addToCart: (c: CartItem) => void;
  removeFromCart: (id: string) => void;
  checkout: () => void;
  /** what the Booked screen celebrates: one visit, or everything from the cart */
  lastBooking: CartItem[];
  setLastBooking: (c: CartItem[]) => void;

  live: LiveStage;
  setLive: (s: LiveStage) => void;
  /** when Sunita started driving (ms), so every map shows the same car position */
  driveStart: number;

  favs: string[];
  toggleFav: (id: string) => void;

  showSafe: () => void;
};

export const StoreCtx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(StoreCtx);
  if (!s) throw new Error("Store missing");
  return s;
};
