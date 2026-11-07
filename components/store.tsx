"use client";

import { createContext, useContext } from "react";
import type { ServiceId, Visit } from "./data";

export type ScreenId =
  | "home" | "explore" | "helper" | "book" | "confirmed"
  | "visits" | "live" | "report" | "mom" | "emergency";

export const TAB_ROOTS: ScreenId[] = ["home", "explore", "visits", "mom"];

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

export type Store = {
  screen: ScreenId;
  dir: 1 | -1 | 0;
  go: (id: ScreenId) => void;
  back: () => void;
  tab: (id: ScreenId) => void;
  toast: (msg: string, icon?: "check" | "info" | "heart") => void;

  draft: Draft;
  setDraft: (p: Partial<Draft>) => void;

  explore: { service: ServiceId | null; when: { dayKey: string; time: string } | null; focus: boolean };
  setExplore: (p: Partial<Store["explore"]>) => void;

  visits: Visit[];
  addVisit: (v: Visit) => void;

  live: LiveStage;
  setLive: (s: LiveStage) => void;

  favs: string[];
  toggleFav: (id: string) => void;
};

export const StoreCtx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(StoreCtx);
  if (!s) throw new Error("Store missing");
  return s;
};
