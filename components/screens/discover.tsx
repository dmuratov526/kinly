"use client";

import { useState } from "react";
import { Avatar, Btn, Check, Chip, HELPERS, TopBar, useHelper, useNav, useMulti, type Helper } from "../ui";
import { EmptyCalendar, Face, ServiceIcon, VideoCover } from "../illustrations";

const SERVICES = [
  { name: "Companionship", price: "from [$XX]/hr" },
  { name: "Appointment escort", price: "from [$XX]/hr" },
  { name: "Errands", price: "from [$XX]/hr" },
  { name: "Tech help", price: "from [$XX]/hr" },
  { name: "Home help", price: "from [$XX]/hr" },
  { name: "Wellness check", price: "from [$XX]/visit" },
];


type ServiceDetail = {
  tasks: { t: string; on: boolean }[];
  note: string;
  meds: boolean;
  where: { label: string; placeholder: string };
};

/** What a visit looks like for each category: default checklist, note and address field. */
const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "Companionship": {
    tasks: [
      { t: "Chat and catch up over tea", on: true },
      { t: "Go for a short walk together", on: true },
      { t: "Play cards or a board game", on: true },
      { t: "Help her video-call the family", on: false },
    ],
    note: "She loves talking about her garden and old Hindi films. Uses a cane on stairs. Door code [####].",
    meds: false,
    where: { label: "Visit address", placeholder: "Mom's home · [Address]" },
  },
  "Appointment escort": {
    tasks: [
      { t: "Pick Mom up from home", on: true },
      { t: "Stay with her during the appointment", on: true },
      { t: "Take notes from the doctor", on: true },
      { t: "Pharmacy pickup on the way back", on: false },
    ],
    note: "She likes to chat. Uses a cane on stairs. Door code [####].",
    meds: true,
    where: { label: "Clinic address", placeholder: "[Clinic name and address]" },
  },
  "Errands": {
    tasks: [
      { t: "Grocery run from Mom's list", on: true },
      { t: "Pharmacy pickup", on: true },
      { t: "Put groceries away at home", on: true },
      { t: "Post office drop-off", on: false },
    ],
    note: "Shopping list is on the fridge. She prefers [Store name]. Keep the receipts. Door code [####].",
    meds: false,
    where: { label: "Stores to visit", placeholder: "[Store names or addresses]" },
  },
  "Tech help": {
    tasks: [
      { t: "Set up video calls on her phone", on: true },
      { t: "Make the text bigger", on: true },
      { t: "Show her how to open family photos", on: true },
      { t: "Block spam calls", on: false },
    ],
    note: "She has an Android phone and an iPad. Please write the steps down on paper so she can look back.",
    meds: false,
    where: { label: "Visit address", placeholder: "Mom's home · [Address]" },
  },
  "Home help": {
    tasks: [
      { t: "Tidy the kitchen and living room", on: true },
      { t: "Laundry: wash and fold", on: true },
      { t: "Take out the trash", on: true },
      { t: "Change the bed sheets", on: false },
    ],
    note: "Cleaning supplies are under the sink. Please don't move things on her prayer shelf.",
    meds: false,
    where: { label: "Visit address", placeholder: "Mom's home · [Address]" },
  },
  "Wellness check": {
    tasks: [
      { t: "Check she has eaten today", on: true },
      { t: "Make sure she took her morning meds", on: true },
      { t: "Look around for trip hazards", on: true },
      { t: "Check the fridge for expired food", on: false },
    ],
    note: "She can get dizzy in the mornings. Call me right away if anything seems off.",
    meds: true,
    where: { label: "Visit address", placeholder: "Mom's home · [Address]" },
  },
};
const detailFor = (service: string) => SERVICE_DETAILS[service] ?? SERVICE_DETAILS["Appointment escort"];

export function TabBar({ active }: { active: "Home" | "Visits" | "Family" | "Account" }) {
  const { reset, toast, booking } = useNav();
  const tabs = ["Home", "Visits", "Family", "Account"] as const;
  const onTab = (t: (typeof tabs)[number]) => {
    if (t === "Home") reset("home");
    else if (t === "Visits") booking.booked ? reset("tracking") : toast("No visits booked yet");
    else if (t === "Family") reset("momView");
    else toast("Account settings — not in this prototype");
  };
  return (
    <div className="tabbar">
      {tabs.map((t) => (
        <button key={t} className={active === t ? "on" : ""} onClick={() => onTab(t)}>
          <span className="ic" />
          {t}
        </button>
      ))}
    </div>
  );
}

export function Home() {
  const { go, setBooking, booking, toast } = useNav();
  const helper = useHelper();
  const [q, setQ] = useState("");
  const list = SERVICES.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="screen">
      <div className="body">
        <div className="row between top" style={{ marginTop: 6 }}>
          <div>
            <div className="muted" style={{ fontSize: 14 }}>Hi Rohan</div>
            <h2 className="h-lg" style={{ fontSize: 24 }}>What does Mom need?</h2>
          </div>
          <Avatar size={44} who="rohan" />
        </div>
        <button className="chip row" style={{ alignSelf: "flex-start", gap: 8, padding: "8px 14px 8px 8px" }} onClick={() => toast("Only Mom's profile so far")}>
          <Avatar size={22} who="kamala" /> For: Mom · Kamala ▾
        </button>
        <label className="search">
          <span>⌕</span>
          <input placeholder="Search services" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="grid g2">
          {list.map((s) => (
            <button
              key={s.name}
              className={`card ${s.name === "Appointment escort" ? "sel" : ""}`}
              style={{ textAlign: "left", minHeight: 108, display: "flex", flexDirection: "column", gap: 6 }}
              onClick={() => { setBooking({ service: s.name, scheduled: false }); go("helpers"); }}
            >
              <ServiceIcon name={s.name} />
              <b style={{ fontSize: 15, marginTop: 6 }}>{s.name}</b>
              <span className="muted small">{s.price}</span>
            </button>
          ))}
        </div>
        <div className="grid g2">
          <Btn kind="secondary" onClick={() => go("helpers")}>⌕ Browse helpers</Btn>
          <Btn kind="secondary" onClick={() => go("available")}>◷ Search by time</Btn>
        </div>
        <div className="label" style={{ marginTop: 6 }}>Upcoming</div>
        {booking.booked ? (
          <button className="card row" style={{ textAlign: "left" }} onClick={() => go("tracking")}>
            <Avatar size={40} who={helper.id} />
            <div className="grow">
              <b style={{ fontSize: 15 }}>{booking.service} · {helper.name}</b>
              <div className="muted small">{booking.day} · {booking.time}</div>
            </div>
            ›
          </button>
        ) : (
          <div className="card" style={{ borderStyle: "dashed", textAlign: "center", color: "var(--ink-2)", fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><EmptyCalendar />No visits booked yet</div>
        )}
      </div>
      <TabBar active="Home" />
    </div>
  );
}

const DAYS = [["Tue", "28"], ["Wed", "29"], ["Thu", "30"], ["Fri", "31"], ["Sat", "1"]];
const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];

/** 08 · Pick a time with the helper already chosen; slots follow that helper's calendar. */
export function Booking() {
  const { go, back, booking, setBooking } = useNav();
  const h = useHelper();
  const freeDays = DAYS.map(([d, n]) => `${d} ${n}`).filter((v) => !h.daysOff.includes(v));
  const freeTimes = TIMES.filter((t) => !h.busy.includes(t));
  const [mode, setMode] = useState("Schedule");
  // start on the booking's slot if this helper is free then, otherwise their first open slot
  const [day, setDay] = useState(freeDays.includes(booking.day) ? booking.day : (freeDays[0] ?? booking.day));
  const [time, setTime] = useState(freeTimes.includes(booking.time) ? booking.time : (freeTimes[0] ?? booking.time));
  const [hours, setHours] = useState(booking.hours);
  const canBook = freeDays.includes(day) && freeTimes.includes(time);

  const next = () => {
    setBooking({ day, time, hours, scheduled: true });
    go("checklist");
  };

  return (
    <div className="screen">
      <TopBar title={`Book ${h.short}`} sub={booking.service} />
      <div className="body">
        <div className="card row" style={{ padding: "10px 12px" }}>
          <Avatar size={40} who={h.id} />
          <div className="grow">
            <b style={{ fontSize: 15 }}>{h.name}</b>
            <div className="muted small">★ {h.rating} · Next free {h.next}</div>
          </div>
          <button className="link" onClick={back}>Change</button>
        </div>
        <div className="seg">
          {["Now", "Schedule", "Recurring"].map((m) => (
            <button key={m} className={mode === m ? "on" : ""} onClick={() => { setMode(m); if (m === "Recurring") go("weekly"); }}>{m}</button>
          ))}
        </div>
        <div className="label">Date</div>
        <div className="grid g5">
          {DAYS.map(([d, n]) => {
            const v = `${d} ${n}`;
            const off = h.daysOff.includes(v);
            return (
              <button key={v} className={`opt ${day === v ? "on" : ""}`} disabled={off} onClick={() => setDay(v)}>
                {d}<br />{off ? "off" : n}
              </button>
            );
          })}
        </div>
        <div className="label">{h.short}&apos;s open times</div>
        <div className="grid g3">
          {TIMES.map((t) => {
            const busy = h.busy.includes(t);
            return (
              <button key={t} className={`opt ${time === t ? "on" : ""}`} disabled={busy} onClick={() => setTime(t)}>
                {busy ? `${t} booked` : t}
              </button>
            );
          })}
        </div>
        <div className="label">Duration</div>
        <div className="grid g4">
          {[1, 2, 3, 4].map((x) => (
            <button key={x} className={`opt pill ${hours === x ? "on" : ""}`} onClick={() => setHours(x)}>{x} {x === 1 ? "hr" : "hrs"}</button>
          ))}
        </div>
        <div className="label">{detailFor(booking.service).where.label}</div>
        <input className="input" placeholder={detailFor(booking.service).where.placeholder} />
      </div>
      <div className="footer row">
        <div>
          <div className="small muted">Estimate</div>
          <b style={{ fontSize: 18 }}>[$XX]</b>
        </div>
        <Btn style={{ flex: 1 }} disabled={!canBook} onClick={next}>Continue</Btn>
      </div>
    </div>
  );
}

const FILTERS = ["Available today", "Speaks Hindi", "Rating 4.8+", "CPR certified", "Within 2 mi"] as const;
type Filter = (typeof FILTERS)[number];
const FILTER_FN: Record<Filter, (h: Helper) => boolean> = {
  "Available today": (h) => h.today,
  "Speaks Hindi": (h) => h.langs.includes("Hindi"),
  "Rating 4.8+": (h) => h.rating >= 4.8,
  "CPR certified": (h) => h.cpr,
  "Within 2 mi": (h) => h.miles <= 2,
};
const SORTS: { name: string; fn: (a: Helper, b: Helper) => number }[] = [
  { name: "Best match", fn: (a, b) => b.match - a.match },
  { name: "Highest rated", fn: (a, b) => b.rating - a.rating || b.visits - a.visits },
  { name: "Nearest", fn: (a, b) => a.miles - b.miles },
  { name: "Most experienced", fn: (a, b) => b.years - a.years },
];

const isFree = (h: Helper, day: string, time: string) => !h.daysOff.includes(day) && !h.busy.includes(time);

function HelperCard({ h, line, onClick }: { h: Helper; line: { text: string; good: boolean }; onClick: () => void }) {
  return (
    <button className="card row top" style={{ textAlign: "left" }} onClick={onClick}>
      <Avatar size={52} who={h.id} />
      <div className="grow">
        <div className="row between"><b style={{ fontSize: 16 }}>{h.name}</b><b style={{ fontSize: 14 }}>[$XX]/hr</b></div>
        <div className="muted small" style={{ marginTop: 2 }}>{h.role} · {h.years} yrs · {h.miles} mi</div>
        <div className="small" style={{ margin: "3px 0 2px" }}>★ {h.rating} ({h.visits} visits)</div>
        <div className="small" style={{ marginBottom: 6, color: line.good ? "var(--green)" : "var(--ink-2)", fontWeight: 600 }}>{line.text}</div>
        <div className="chips" style={{ gap: 5 }}>{h.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      </div>
    </button>
  );
}

function FavoriteNote() {
  const { toast } = useNav();
  return (
    <button className="card soft" style={{ textAlign: "center", fontSize: 14, color: "var(--ink-2)" }} onClick={() => toast("Request sent to your favorite helper")}>
      Your favorite helper isn&apos;t free? Ask for another time
    </button>
  );
}

function SwitchCard({ icon, title, sub, onClick }: { icon: string; title: string; sub: string; onClick: () => void }) {
  return (
    <button className="card soft row" style={{ textAlign: "left" }} onClick={onClick}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div className="grow">
        <b style={{ fontSize: 15 }}>{title}</b>
        <div className="muted small">{sub}</div>
      </div>
      ›
    </button>
  );
}

/** 05 · Browse: the marketplace — every helper, with search, filters and sort. */
export function Helpers() {
  const { go, booking, setBooking } = useNav();
  const [q, setQ] = useState("");
  const [filters, toggle] = useMulti([]);
  const [sort, setSort] = useState(0);

  const query = q.trim().toLowerCase();
  const list = HELPERS
    .filter((h) => !query || [h.name, h.role, ...h.langs].some((x) => x.toLowerCase().includes(query)))
    .filter((h) => filters.every((f) => FILTER_FN[f as Filter](h)))
    .sort(SORTS[sort].fn);

  return (
    <div className="screen">
      <TopBar title={`${booking.service} helpers`} sub="Near Mom · Jackson Heights" />
      <div className="body">
        <label className="search">
          <span>⌕</span>
          <input placeholder="Name, language or skill" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="chips scroll">
          {FILTERS.map((f) => (
            <Chip key={f} on={filters.includes(f)} onClick={() => toggle(f)}>{f}</Chip>
          ))}
        </div>
        <div className="row between small">
          <span className="muted">{list.length} {list.length === 1 ? "helper" : "helpers"} near Mom</span>
          <button style={{ fontWeight: 600 }} onClick={() => setSort((sort + 1) % SORTS.length)}>Sort: {SORTS[sort].name} ▾</button>
        </div>
        {list.map((h) => (
          <HelperCard
            key={h.id} h={h} line={{ text: `Next free: ${h.next}`, good: h.today }}
            onClick={() => { setBooking({ helperId: h.id, scheduled: false }); go("helper"); }}
          />
        ))}
        {list.length === 0 && (
          <div className="card" style={{ borderStyle: "dashed", textAlign: "center", color: "var(--ink-2)", fontSize: 14 }}>
            No helpers match. Try fewer filters.
          </div>
        )}
        <SwitchCard icon="◷" title="Need someone at a set time?" sub="Search by time and see who's free" onClick={() => go("available")} />
        <FavoriteNote />
      </div>
    </div>
  );
}

/** 06 · Search by time: say when, see only the helpers free then (or get matched). */
export function Available() {
  const { go, booking, setBooking, toast } = useNav();
  const [day, setDay] = useState(booking.day);
  const [time, setTime] = useState(booking.time);
  const list = HELPERS.filter((h) => isFree(h, day, time)).sort(SORTS[0].fn);

  const open = (h: Helper) => { setBooking({ helperId: h.id, day, time, scheduled: true }); go("helper"); };
  const matchMe = () => {
    const best = list[0];
    if (!best) return toast("No one is free then. Try another time");
    toast(`${best.short} is your best match`);
    open(best);
  };

  return (
    <div className="screen">
      <TopBar title="Search by time" sub={booking.service} />
      <div className="body">
        <div className="label" style={{ margin: 0 }}>When does Mom need help?</div>
        <div className="grid g5">
          {DAYS.map(([d, n]) => {
            const v = `${d} ${n}`;
            return <button key={v} className={`opt ${day === v ? "on" : ""}`} onClick={() => setDay(v)}>{d}<br />{n}</button>;
          })}
        </div>
        <div className="grid g3">
          {TIMES.map((t) => (
            <button key={t} className={`opt ${time === t ? "on" : ""}`} onClick={() => setTime(t)}>{t}</button>
          ))}
        </div>
        <div className="row between small">
          <span className="muted">{list.length} free {day} · {time}</span>
          {list.length > 0 && <button style={{ fontWeight: 600 }} onClick={matchMe}>✦ Match me</button>}
        </div>
        {list.map((h) => (
          <HelperCard key={h.id} h={h} line={{ text: `Free at ${time}`, good: true }} onClick={() => open(h)} />
        ))}
        {list.length === 0 && (
          <div className="card" style={{ borderStyle: "dashed", textAlign: "center", color: "var(--ink-2)", fontSize: 14 }}>
            No one is free at this time. Try another slot.
          </div>
        )}
        <SwitchCard icon="⌕" title="Just looking?" sub="Browse all helpers with filters" onClick={() => go("helpers")} />
        <FavoriteNote />
      </div>
    </div>
  );
}

export function HelperProfile() {
  const { go, back, booking, toast } = useNav();
  const h = useHelper();
  const [playing, setPlaying] = useState(false);
  return (
    <div className="screen">
      <div className="body" style={{ padding: 0, gap: 0 }}>
        <div style={{ position: "relative", height: 210, background: "var(--fill-2)", flexShrink: 0, overflow: "hidden" }}>
          <VideoCover who={h.id} />
          <button className="back" style={{ position: "absolute", top: 14, left: 14, width: 40, height: 40, background: "#fff", zIndex: 1 }} onClick={back}>‹</button>
          <button className="chip" style={{ border: 0, fontWeight: 600, padding: "10px 18px", position: "absolute", bottom: 14, right: 14, boxShadow: "0 2px 10px rgba(0,0,0,.12)" }} onClick={() => setPlaying(!playing)}>
            {playing ? "❚❚ Playing… 0:07" : "▶ Play 30s intro"}
          </button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <h2 className="h-lg">{h.name}</h2>
            <div className="muted" style={{ fontSize: 14 }}>{h.role} · {h.years} yrs · {h.miles} mi away</div>
            <div className="small" style={{ marginTop: 4, color: h.today ? "var(--green)" : "var(--ink-2)", fontWeight: 600 }}>Next free: {h.next}</div>
          </div>
          <div className="grid g3">
            <div className="stat"><b>★ {h.rating}</b><span>Rating</span></div>
            <div className="stat"><b>{h.visits}</b><span>Visits</span></div>
            <div className="stat"><b>98%</b><span>On time</span></div>
          </div>
          <div className="chips" style={{ gap: 6 }}>
            {["Background checked", ...(h.cpr ? ["CPR certified"] : []), "Insured", h.langs.join(", ")].map((t) => <span key={t} className="chip" style={{ fontSize: 13, padding: "6px 12px" }}>{t}</span>)}
          </div>
          <div className="label">About</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="skel" /><div className="skel" style={{ width: "92%" }} /><div className="skel" style={{ width: "70%" }} />
          </div>
          <div className="row between">
            <div className="label" style={{ margin: 0 }}>Reviews</div>
            <button className="link" onClick={() => toast("All 96 reviews")}>See all 96</button>
          </div>
          {[["daughter", "reviewer1"], ["son", "reviewer2"]].map(([r, w]) => (
            <div key={r} className="card" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="row" style={{ gap: 8 }}><Face who={w} size={26} /><b style={{ fontSize: 13 }}>★★★★★ · [Reviewer], {r}</b></div>
              <div className="skel" style={{ width: "90%" }} /><div className="skel" style={{ width: "55%" }} />
            </div>
          ))}
        </div>
      </div>
      <div className="footer row">
        <div>
          <div className="small muted">{booking.scheduled ? `${booking.day} · ${booking.hours} hrs` : "Rate"}</div>
          <b style={{ fontSize: 18 }}>{booking.scheduled ? "[$XX]" : "[$XX]/hr"}</b>
        </div>
        {booking.scheduled
          ? <Btn style={{ flex: 1 }} onClick={() => go("checklist")}>Book {h.short}</Btn>
          : <Btn style={{ flex: 1 }} onClick={() => go("booking")}>See {h.short}&apos;s times</Btn>}
      </div>
    </div>
  );
}

export function Checklist() {
  const { go, booking } = useNav();
  const h = useHelper();
  const detail = detailFor(booking.service);
  const [tasks, setTasks] = useState(detail.tasks);
  const [meds, setMeds] = useState(detail.meds);
  const [photos, setPhotos] = useState(true);
  const [adding, setAdding] = useState("");

  return (
    <div className="screen">
      <TopBar title={`What should ${h.short} do?`} sub={booking.service} />
      <div className="body">
        <div>
          <div className="label" style={{ margin: 0 }}>{booking.service} checklist</div>
          <div className="muted small" style={{ marginTop: 3 }}>{h.short} ticks these off live during the visit</div>
        </div>
        <div className="list">
          {tasks.map((x, i) => (
            <button key={i} className="list-item" onClick={() => setTasks(tasks.map((y, j) => (j === i ? { ...y, on: !y.on } : y)))}>
              <Check on={x.on} /> {x.t}
            </button>
          ))}
          <div className="list-item">
            <input
              className="grow"
              style={{ border: 0, outline: "none", fontWeight: 600, fontSize: 15 }}
              placeholder="+ Add a task"
              value={adding}
              onChange={(e) => setAdding(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && adding.trim()) { setTasks([...tasks, { t: adding.trim(), on: true }]); setAdding(""); } }}
            />
          </div>
        </div>
        <div className="label">Notes for {h.short}</div>
        <textarea className="textarea" defaultValue={detail.note} style={{ minHeight: 110 }} />
        <button className="toggle-row" onClick={() => setMeds(!meds)}>Share Mom&apos;s medication list <Check on={meds} /></button>
        <button className="toggle-row" onClick={() => setPhotos(!photos)}>Send photo updates during the visit <Check on={photos} /></button>
      </div>
      <div className="footer">
        <Btn onClick={() => go("pay")}>Review booking</Btn>
      </div>
    </div>
  );
}
