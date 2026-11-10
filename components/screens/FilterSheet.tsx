"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { Bookmark, Brain, Car, ChefHat, Clock, Dumbbell, Footprints, House, NotebookPen, Pill, RotateCcw, Smartphone, Stethoscope, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { HELPERS, SKILLS, cardRate, svc, type Helper, type ServiceId } from "../data";
import { Avatar, Sheet, Tap, spring } from "../kit";
import { NO_FILTERS, type Filters } from "../store";

/* ---------- the filter logic, shared with Explore ---------- */

export const passes = (h: Helper, f: Filters, service: ServiceId | null, favs: string[]) =>
  (!f.today || h.today) &&
  (!f.langs.length || f.langs.some((l) => h.langs.includes(l))) &&
  (f.minRating == null || h.rating >= f.minRating) &&
  (f.maxMiles == null || h.miles <= f.maxMiles) &&
  (f.maxRate == null || cardRate(h, service).rate <= f.maxRate) &&
  (f.minRate == null || cardRate(h, service).rate >= f.minRate) &&
  (!f.car || h.badges.includes("Has a car")) &&
  (f.gender === "any" || h.gender === f.gender) &&
  (!f.medical || h.medical) &&
  (!f.saved || favs.includes(h.id)) &&
  f.skills.every((s) => h.skills.includes(s));

export const activeCount = (f: Filters) =>
  Number(f.today) + f.langs.length + Number(f.minRating != null) + Number(f.maxMiles != null) + Number(f.maxRate != null || f.minRate != null) +
  Number(f.car) + Number(f.gender !== "any") + Number(f.medical) + Number(f.saved) + f.skills.length;

const NATIVE: Record<string, string> = {
  Hindi: "हिन्दी", Spanish: "Español", Arabic: "العربية", Polish: "Polski", Mandarin: "中文", Cantonese: "粵語",
  German: "Deutsch", Marathi: "मराठी", Korean: "한국어", Vietnamese: "Tiếng Việt", Portuguese: "Português",
  French: "Français", Italian: "Italiano", Hebrew: "עברית", Ukrainian: "Українська", Russian: "Русский",
  Punjabi: "ਪੰਜਾਬੀ", Bengali: "বাংলা", "Haitian Creole": "Kreyòl",
};
/** most spoken first */
const LANGS = [...new Set(HELPERS.flatMap((h) => h.langs))].filter((l) => l !== "English")
  .sort((a, b) => HELPERS.filter((h) => h.langs.includes(b)).length - HELPERS.filter((h) => h.langs.includes(a)).length);
const FACES = 7;
const MILES = { min: 0.5, max: 3.5 };
const SKILL_ICON: Record<string, LucideIcon> = {
  "Dementia care": Brain, "Mobility & walks": Footprints, "Meds reminders": Pill, "Doctor notes": NotebookPen,
  Cooking: ChefHat, Housekeeping: House, Driving: Car, "Heavy lifting": Dumbbell, "Tech setup": Smartphone,
};

/* ---------- sheet ---------- */

export function FilterSheet({ open, onClose, f, setF, base, service, favs }: {
  open: boolean; onClose: () => void; f: Filters; setF: (p: Partial<Filters>) => void;
  /** helpers after service / search / time, before these filters */
  base: Helper[]; service: ServiceId | null; favs: string[];
}) {
  const matches = base.filter((h) => passes(h, f, service, favs));
  const n = activeCount(f);
  const rates = base.map((h) => cardRate(h, service).rate);
  const unit = service ? svc(service).unit : "hr";
  const rMin = Math.min(...rates, 15), rMax = Math.max(...rates, 16);
  /** what would match if this one filter were changed, so chips can show live counts */
  const countWith = (p: Partial<Filters>) => base.filter((h) => passes(h, { ...f, ...p }, service, favs)).length;
  const [allLangs, setAllLangs] = useState(false);
  const langs = allLangs ? LANGS : LANGS.slice(0, 8);
  /** bars scale to the busiest bucket so a big roster still fits */
  const priceBuckets = Array.from({ length: rMax - rMin + 1 }, (_, i) => rMin + i).map((v) => ({ v, c: rates.filter((r) => r === v).length }));
  const STEP = 0.25;
  const mileBuckets = Array.from({ length: Math.round((MILES.max - MILES.min) / STEP) + 1 }, (_, i) => MILES.min + i * STEP)
    .map((v) => ({ v, c: base.filter((h) => Math.abs(Math.min(Math.max(h.miles, MILES.min), MILES.max) - v) < STEP / 2 + 1e-9).length }));
  const bar = (c: number, max: number) => (c ? 8 + (c / Math.max(1, max)) * 50 : 3);

  return (
    <Sheet open={open} onClose={onClose} className="tall">
      <div className="fs-head">
        <div className="row between">
          <h3 className="display" style={{ fontSize: 32 }}>Filters</h3>
          <AnimatePresence>
            {n > 0 && (
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="fs-reset" onClick={() => setF(NO_FILTERS)}>
                <RotateCcw size={14} /> Reset {n}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <div className="fs-faces">
          <div className="fs-stack">
            <AnimatePresence initial={false} mode="popLayout">
              {matches.slice(0, FACES).map((h, i) => (
                <motion.span key={h.id} layout initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={spring} style={{ zIndex: 20 - i }}>
                  <Avatar src={h.photo} size={34} />
                </motion.span>
              ))}
              {matches.length > FACES && (
                <motion.span key="more" layout className="fs-more" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>+{matches.length - FACES}</motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="fs-count"><Ticker v={matches.length} /> of {base.length} helpers</span>
        </div>
      </div>

      <div className="fs-body" onPointerDown={(e) => e.stopPropagation()}>
        {/* price */}
        <Block title={service ? `Price · ${svc(service).name}` : "Price"} value={f.minRate != null ? `$${f.minRate}+/${unit}` : f.maxRate == null ? "Any price" : `Up to $${f.maxRate}/${unit}`}>
          <div className="chip-wrap" style={{ marginBottom: 14 }}>
            {([["$15 or less", { maxRate: 15, minRate: null }], ["$25 or less", { maxRate: 25, minRate: null }], ["$25+", { maxRate: null, minRate: 25 }]] as const).map(([label, p]) => {
              const on = f.maxRate === p.maxRate && f.minRate === p.minRate;
              return (
                <Tap key={label} className={`fs-lang ${on ? "on" : ""}`} onClick={() => setF(on ? { maxRate: null, minRate: null } : p)}>
                  <b>{label}</b><em>{countWith(p)}</em>
                </Tap>
              );
            })}
          </div>
          <div className="fs-hist">
            {priceBuckets.map(({ v, c }) => {
              const on = (f.maxRate == null || v <= f.maxRate) && (f.minRate == null || v >= f.minRate);
              return <motion.i key={v} animate={{ height: bar(c, Math.max(...priceBuckets.map((b) => b.c))), opacity: on ? 1 : 0.25 }} className={on ? "on" : ""} transition={spring} />;
            })}
          </div>
          <Slider min={rMin} max={rMax} step={1} value={f.maxRate ?? rMax}
            onChange={(v) => setF({ maxRate: v >= rMax ? null : v, minRate: null })} />
          <div className="fs-ends"><span>${rMin}</span><span>${rMax}+</span></div>
        </Block>

        {/* distance: how many helpers live how far from Mom */}
        <Block title="Distance from Kamala" value={f.maxMiles == null ? "Any distance" : `Within ${f.maxMiles.toFixed(1)} mi · ${countWith({})} helpers`}>
          <div className="fs-hist">
            {mileBuckets.map(({ v, c }) => {
              const on = f.maxMiles == null || v <= f.maxMiles + 1e-9;
              return <motion.i key={v} animate={{ height: bar(c, Math.max(...mileBuckets.map((b) => b.c))), opacity: on ? 1 : 0.25 }} className={on ? "on" : ""} transition={spring} />;
            })}
          </div>
          <Slider min={MILES.min} max={MILES.max} step={0.1} value={f.maxMiles ?? MILES.max}
            onChange={(v) => setF({ maxMiles: v >= MILES.max ? null : Math.round(v * 10) / 10 })} />
          <div className="fs-ends"><span>Next door</span><span>{MILES.max}+ mi</span></div>
        </Block>

        {/* skills: helper must have every one picked */}
        <Block title="Skills" value={f.skills.length ? `${f.skills.length} picked` : "Any"}>
          <div className="chip-wrap">
            {SKILLS.map((k) => {
              const on = f.skills.includes(k);
              const Icon = SKILL_ICON[k];
              const c = countWith({ skills: on ? f.skills : [...f.skills, k] });
              return (
                <Tap key={k} className={`fs-skill ${on ? "on" : ""} ${!on && !c ? "dead" : ""}`}
                  onClick={() => setF({ skills: on ? f.skills.filter((x) => x !== k) : [...f.skills, k] })}>
                  <Icon size={16} /> {k} <em>{c}</em>
                </Tap>
              );
            })}
          </div>
        </Block>

        {/* must-haves */}
        <Block title="Must-haves">
          <div className="fs-cards">
            {([
              ["today", Clock, "Free today", "Can come in the next few hours"],
              ["car", Car, "Has a car", "Rides to the doctor or store"],
              ["medical", Stethoscope, "Medical background", "Nurse, aide or nursing student"],
              ["saved", Bookmark, "Saved helpers", "Only people you've hearted"],
            ] as const).map(([k, Icon, t, d]) => {
              const on = f[k];
              return (
                <Tap key={k} className={`fs-card ${on ? "on" : ""}`} onClick={() => setF({ [k]: !on } as Partial<Filters>)}>
                  <span className="fs-card-ic"><Icon size={19} /></span>
                  <b>{t}</b>
                  <span>{d}</span>
                  <em>{countWith({ [k]: true } as Partial<Filters>)}</em>
                </Tap>
              );
            })}
          </div>
        </Block>

        {/* languages */}
        <Block title="Speaks" value={f.langs.length ? f.langs.join(", ") : "Any language"}>
          <div className="chip-wrap">
            {langs.map((l) => {
              const on = f.langs.includes(l);
              return (
                <Tap key={l} className={`fs-lang ${on ? "on" : ""}`} onClick={() => setF({ langs: on ? f.langs.filter((x) => x !== l) : [...f.langs, l] })}>
                  <b>{NATIVE[l] ?? l}</b>
                  {NATIVE[l] && NATIVE[l] !== l && <span>{l}</span>}
                  <em>{base.filter((h) => h.langs.includes(l)).length}</em>
                </Tap>
              );
            })}
            {LANGS.length > 8 && (
              <Tap className="fs-lang more" onClick={() => setAllLangs(!allLangs)}>{allLangs ? "Show less" : `+${LANGS.length - 8} more`}</Tap>
            )}
          </div>
        </Block>

        {/* rating + who */}
        <Block title="Rating">
          <Segmented id="rating" value={String(f.minRating)} onChange={(v) => setF({ minRating: v === "null" ? null : Number(v) })}
            options={[["null", "Any"], ["4.8", "4.8+ ★"], ["4.9", "4.9+ ★"], ["4.95", "4.95+ ★"]]} />
        </Block>
        <Block title="Kamala feels most comfortable with">
          <Segmented id="gender" value={f.gender} onChange={(v) => setF({ gender: v as Filters["gender"] })}
            options={[["any", "Anyone"], ["f", "A woman"], ["m", "A man"]]} />
        </Block>
        <div style={{ height: 8 }} />
      </div>

      <div className="fs-foot">
        <AnimatePresence>
          {matches.length === 0 && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="fs-none">
              No one matches all of that. Try a wider distance or fewer must-haves.
            </motion.p>
          )}
        </AnimatePresence>
        <Tap className="btn primary fs-go" disabled={!matches.length} onClick={onClose}>
          {matches.length ? <>Show <Ticker v={matches.length} /> helper{matches.length === 1 ? "" : "s"}</> : "No matches"}
        </Tap>
      </div>
    </Sheet>
  );
}

/* ---------- pieces ---------- */

function Block({ title, value, children }: { title: string; value?: string; children: ReactNode }) {
  return (
    <section className="fs-block">
      <div className="fs-block-head">
        <h4>{title}</h4>
        {value && (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={value} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>{value}</motion.span>
          </AnimatePresence>
        )}
      </div>
      {children}
    </section>
  );
}

function Segmented({ id, value, onChange, options }: { id: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="fs-seg">
      {options.map(([v, label]) => (
        <button key={v} className={value === v ? "on" : ""} onClick={() => onChange(v)}>
          {value === v && <motion.span layoutId={`seg-${id}`} className="fs-seg-bg" transition={spring} />}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

/** Drag or tap anywhere on the track. Works inside the scaled phone frame because it measures the real rect. */
function Slider({ min, max, step, value, onChange }: { min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const pct = ((value - min) / (max - min)) * 100;
  const set = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    onChange(Math.round((min + t * (max - min)) / step) * step);
  };
  return (
    <div
      ref={track} className="fs-slider"
      onPointerDown={(e) => { e.stopPropagation(); (e.target as Element).setPointerCapture?.(e.pointerId); set(e.clientX); }}
      onPointerMove={(e) => { if (e.buttons) set(e.clientX); }}
    >
      <div className="fs-rail" />
      <motion.div className="fs-fill" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 700, damping: 45 }} />
      <motion.div className="fs-knob" animate={{ left: `${pct}%` }} transition={{ type: "spring", stiffness: 700, damping: 45 }} whileTap={{ scale: 1.15 }} />
    </div>
  );
}

/** A number that rolls to its new value. */
function Ticker({ v }: { v: number }) {
  const mv = useMotionValue(v);
  const txt = useTransform(mv, (x) => String(Math.round(x)));
  useEffect(() => {
    const a = animate(mv, v, { duration: 0.35, ease: "easeOut" });
    return () => a.stop();
  }, [mv, v]);
  return <motion.b className="ticker">{txt}</motion.b>;
}
