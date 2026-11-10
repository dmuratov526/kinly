"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpDown, CalendarClock, Heart, MapPin, Search, SlidersHorizontal, Wand2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DAYS, HELPERS, SERVICES, TIMES, cardRate, day, isFree, svc, type Helper, type ServiceId } from "../data";
import { SERVICE_ICON } from "../icons";
import { Avatar, Btn, CartButton, KinlySafe, Rating, Sheet, Tap, Verified, softSpring } from "../kit";
import { NO_FILTERS, useStore, type Filters } from "../store";

/** Quick chips are shortcuts into the same filters the filter sheet edits. */
const QUICK: { id: string; label: string; on: (f: Filters) => boolean; toggle: (f: Filters) => Partial<Filters> }[] = [
  { id: "today", label: "Free today", on: (f) => f.today, toggle: (f) => ({ today: !f.today }) },
  { id: "hindi", label: "Speaks Hindi", on: (f) => f.langs.includes("Hindi"), toggle: (f) => ({ langs: f.langs.includes("Hindi") ? f.langs.filter((l) => l !== "Hindi") : [...f.langs, "Hindi"] }) },
  { id: "top", label: "4.9+", on: (f) => f.minRating === 4.9, toggle: (f) => ({ minRating: f.minRating === 4.9 ? null : 4.9 }) },
  { id: "near", label: "Under 2 mi", on: (f) => f.maxMiles === 2, toggle: (f) => ({ maxMiles: f.maxMiles === 2 ? null : 2 }) },
  { id: "car", label: "Has a car", on: (f) => f.car, toggle: (f) => ({ car: !f.car }) },
];

const LANGS = [...new Set(HELPERS.flatMap((h) => h.langs))].filter((l) => l !== "English");

const passes = (h: Helper, f: Filters, service: ServiceId | null) =>
  (!f.today || h.today) &&
  (!f.langs.length || f.langs.some((l) => h.langs.includes(l))) &&
  (f.minRating == null || h.rating >= f.minRating) &&
  (f.maxMiles == null || h.miles < f.maxMiles) &&
  (f.maxRate == null || cardRate(h, service).rate <= f.maxRate) &&
  (!f.car || h.badges.includes("Has a car"));

const activeCount = (f: Filters) =>
  Number(f.today) + f.langs.length + Number(f.minRating != null) + Number(f.maxMiles != null) + Number(f.maxRate != null) + Number(f.car);

export function Explore() {
  const { explore, setExplore, go, setDraft, favs, toggleFav, toast } = useStore();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const f = explore.filters;
  const setF = (p: Partial<Filters>) => setExplore({ filters: { ...f, ...p } });
  const SORTS = [
    { name: "Best match", fn: (a: Helper, b: Helper) => b.match - a.match },
    { name: "Top rated", fn: (a: Helper, b: Helper) => b.rating - a.rating },
    { name: "Nearest", fn: (a: Helper, b: Helper) => a.miles - b.miles },
    { name: "Lowest price", fn: (a: Helper, b: Helper) => cardRate(a, explore.service).rate - cardRate(b, explore.service).rate },
  ];
  const [whenOpen, setWhenOpen] = useState(false);
  const [wDay, setWDay] = useState(explore.when?.dayKey ?? "today");
  const [wTime, setWTime] = useState(explore.when?.time ?? "2:00 PM");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (explore.focus) setTimeout(() => input.current?.focus(), 350);
  }, [explore.focus]);

  const query = q.trim().toLowerCase();
  const base = HELPERS
    .filter((h) => !explore.service || h.services.includes(explore.service))
    .filter((h) => !query || [h.name, h.role, ...h.langs, ...h.services.map((s) => svc(s).name)].some((x) => x.toLowerCase().includes(query)))
    .filter((h) => !explore.when || isFree(h, explore.when.dayKey, explore.when.time));
  const list = base.filter((h) => passes(h, f, explore.service)).sort(SORTS[sort].fn);
  const nActive = activeCount(f);

  const open = (h: Helper) => {
    const service = explore.service ?? h.services[0];
    setDraft({
      helperId: h.id, service, tasks: svc(service).tasks,
      ...(explore.when ? { dayKey: explore.when.dayKey, time: explore.when.time } : null),
    });
    go("helper");
  };

  const matchMe = () => {
    const best = list[0];
    if (!best) return;
    toast(`${best.first} is a ${best.match}% match for Mom`, "heart");
    open(best);
  };

  return (
    <div className="screen scroll">
      <div className="explore-head">
        <div className="pad">
          <div className="row between" style={{ alignItems: "flex-start" }}>
            <h1 className="display">Find <i>the right</i> helper</h1>
            <CartButton />
          </div>
          <label className="searchbar input">
            <Search size={20} />
            <input ref={input} placeholder="Name, language, skill…" value={q} onChange={(e) => setQ(e.target.value)} />
            {q && <button onClick={() => setQ("")} aria-label="Clear"><X size={18} /></button>}
            <Tap className={`search-filter ${nActive ? "on" : ""}`} onClick={() => setFiltersOpen(true)} aria-label="Filters">
              <SlidersHorizontal size={18} />
              {nActive > 0 && <span className="filter-n">{nActive}</span>}
            </Tap>
          </label>
        </div>

        {/* service tabs */}
        <div className="svc-tabs">
          <Tap className={`svc-tab ${!explore.service ? "on" : ""}`} onClick={() => setExplore({ service: null })}>
            <span className="svc-ic all">✦</span>All
          </Tap>
          {SERVICES.map((s) => {
            const Icon = SERVICE_ICON[s.id];
            const on = explore.service === s.id;
            return (
              <Tap key={s.id} className={`svc-tab ${on ? "on" : ""}`} onClick={() => setExplore({ service: on ? null : s.id })} style={{ ["--hue" as string]: s.hue, ["--tint" as string]: s.tint }}>
                <span className="svc-ic"><Icon size={18} /></span>
                {s.short}
                {on && <motion.span layoutId="svc-underline" className="svc-underline" transition={softSpring} />}
              </Tap>
            );
          })}
        </div>

        {/* filters */}
        <div className="chips-scroll">
          <Tap className={`chip when ${explore.when ? "on" : ""}`} onClick={() => setWhenOpen(true)}>
            <CalendarClock size={15} />
            {explore.when ? `${day(explore.when.dayKey).label} · ${explore.when.time}` : "Any time"}
            {explore.when && <span onClick={(e) => { e.stopPropagation(); setExplore({ when: null }); }} className="chip-x"><X size={13} /></span>}
          </Tap>
          {QUICK.map((c) => (
            <Tap key={c.id} className={`chip ${c.on(f) ? "on" : ""}`} onClick={() => setF(c.toggle(f))}>
              {c.label}
            </Tap>
          ))}
        </div>
      </div>

      <div className="pad">
        <div className="row between results-meta">
          <span><b>{list.length}</b> near Mom</span>
          <div className="row" style={{ gap: 6 }}>
            {list.length > 0 && <Tap className="match-btn" onClick={matchMe}><Wand2 size={14} /> Match me</Tap>}
            <Tap className="sort-btn" onClick={() => setSort((sort + 1) % SORTS.length)}><ArrowUpDown size={14} /> {SORTS[sort].name}</Tap>
          </div>
        </div>

        <motion.div layout className="stack-14">
          <AnimatePresence mode="popLayout">
            {list.map((h, i) => (
              <motion.div key={h.id} layout initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ ...softSpring, delay: i * 0.04 }}>
                <HelperCard h={h} service={explore.service} fav={favs.includes(h.id)} onFav={() => toggleFav(h.id)} onOpen={() => open(h)} when={explore.when} />
              </motion.div>
            ))}
          </AnimatePresence>
          {list.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty">
              <span>🔍</span>
              <b>No one matches all of that</b>
              <p>Try a different time or fewer filters.</p>
              <Btn kind="soft" onClick={() => { setQ(""); setExplore({ when: null, filters: NO_FILTERS }); }}>Clear filters</Btn>
            </motion.div>
          )}
        </motion.div>
        <div style={{ height: 120 }} />
      </div>

      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="filters">
          <div>
            <h4>Price{explore.service ? ` · ${svc(explore.service).name.toLowerCase()}` : ""}</h4>
            <div className="chip-wrap">
              {[null, 18, 20, 25].map((v) => (
                <Tap key={String(v)} className={`chip ${f.maxRate === v ? "on" : ""}`} onClick={() => setF({ maxRate: v })}>{v == null ? "Any" : `$${v} or less`}</Tap>
              ))}
            </div>
          </div>
          <div>
            <h4>Speaks</h4>
            <div className="chip-wrap">
              {LANGS.map((l) => (
                <Tap key={l} className={`chip ${f.langs.includes(l) ? "on" : ""}`} onClick={() => setF({ langs: f.langs.includes(l) ? f.langs.filter((x) => x !== l) : [...f.langs, l] })}>{l}</Tap>
              ))}
            </div>
          </div>
          <div>
            <h4>Rating</h4>
            <div className="chip-wrap">
              {[null, 4.8, 4.9].map((v) => (
                <Tap key={String(v)} className={`chip ${f.minRating === v ? "on" : ""}`} onClick={() => setF({ minRating: v })}>{v == null ? "Any" : `${v}+ ★`}</Tap>
              ))}
            </div>
          </div>
          <div>
            <h4>Distance from Mom</h4>
            <div className="chip-wrap">
              {[null, 1, 2, 3].map((v) => (
                <Tap key={String(v)} className={`chip ${f.maxMiles === v ? "on" : ""}`} onClick={() => setF({ maxMiles: v })}>{v == null ? "Any" : `Under ${v} mi`}</Tap>
              ))}
            </div>
          </div>
          <div className="chip-wrap">
            <Tap className={`chip ${f.today ? "on" : ""}`} onClick={() => setF({ today: !f.today })}>Free today</Tap>
            <Tap className={`chip ${f.car ? "on" : ""}`} onClick={() => setF({ car: !f.car })}>Has a car</Tap>
          </div>
        </div>
        <div className="row" style={{ gap: 10, marginTop: 18 }}>
          <Btn kind="soft" onClick={() => setF(NO_FILTERS)} disabled={!nActive}>Reset</Btn>
          <Btn kind="primary" style={{ flex: 1 }} onClick={() => setFiltersOpen(false)}>
            {list.length ? `Show ${list.length} helper${list.length === 1 ? "" : "s"}` : "No matches"}
          </Btn>
        </div>
      </Sheet>

      <Sheet open={whenOpen} onClose={() => setWhenOpen(false)} title="When does Mom need help?">
        <div className="day-strip" style={{ margin: "0 -20px", padding: "0 20px" }}>
          {DAYS.map((d) => (
            <Tap key={d.key} className={`day-pill ${wDay === d.key ? "on" : ""}`} onClick={() => setWDay(d.key)}>
              <span>{d.key === "today" ? "Today" : d.dow}</span><b>{d.num}</b>
            </Tap>
          ))}
        </div>
        <div className="time-grid" style={{ marginTop: 16 }}>
          {TIMES.map((t) => {
            const n = HELPERS.filter((h) => isFree(h, wDay, t) && (!explore.service || h.services.includes(explore.service))).length;
            return (
              <Tap key={t} className={`time-pill ${wTime === t ? "on" : ""}`} onClick={() => setWTime(t)}>
                {t.replace(":00", "")}
                <small>{n} free</small>
              </Tap>
            );
          })}
        </div>
        <Btn kind="primary" style={{ marginTop: 18, width: "100%" }} onClick={() => { setExplore({ when: { dayKey: wDay, time: wTime } }); setWhenOpen(false); }}>
          Show helpers free then
        </Btn>
      </Sheet>
    </div>
  );
}

function HelperCard({ h, service, fav, onFav, onOpen, when }: { h: Helper; service: ServiceId | null; fav: boolean; onFav: () => void; onOpen: () => void; when: { dayKey: string; time: string } | null }) {
  const price = cardRate(h, service);
  return (
    <Tap className="hcard" onClick={onOpen} whileTap={{ scale: 0.985 }}>
      <div className="hcard-top">
        <Avatar src={h.photo} size={68} online={h.today} />
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="row between">
            <b className="hcard-name">{h.name} <Verified /></b>
            <motion.span
              role="button"
              className={`fav ${fav ? "on" : ""}`}
              whileTap={{ scale: 1.4 }}
              onClick={(e) => { e.stopPropagation(); onFav(); }}
              aria-label="Save"
            >
              <Heart size={20} fill={fav ? "currentColor" : "none"} />
            </motion.span>
          </div>
          <div className="muted small">{h.role} · {h.years} yrs</div>
          <div className="row" style={{ gap: 10, marginTop: 5 }}>
            <Rating value={h.rating} count={h.reviews} />
            <span className="small muted row" style={{ gap: 3 }}><MapPin size={12} />{h.miles} mi</span>
          </div>
        </div>
      </div>
      <div className="hcard-tags">
        <KinlySafe />
        {h.badges.map((b) => <span key={b} className={`tag ${b === "Top Helper" ? "gold" : ""}`}>{b === "Top Helper" ? "★ " : ""}{b}</span>)}
      </div>
      <div className="hcard-foot">
        <span className={`slot ${when || h.today ? "now" : ""}`}>
          <span className="slot-dot" />
          {when ? `Free ${day(when.dayKey).label.toLowerCase()} at ${when.time}` : `Next free ${h.next}`}
        </span>
        <span className="price-tag big">${price.rate}<small>/{price.unit}</small></span>
      </div>
    </Tap>
  );
}
