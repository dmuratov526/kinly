"use client";

import { useState } from "react";
import { Avatar, Btn, Check, Chip, HELPERS, Radio, TopBar, useHelper, useNav, useMulti } from "../ui";
import { EmptyCalendar, Face, ServiceIcon, VideoCover } from "../illustrations";

const SERVICES = [
  { name: "Companionship", price: "from [$XX]/hr" },
  { name: "Appointment escort", price: "from [$XX]/hr" },
  { name: "Errands", price: "from [$XX]/hr" },
  { name: "Tech help", price: "from [$XX]/hr" },
  { name: "Home help", price: "from [$XX]/hr" },
  { name: "Wellness check", price: "from [$XX]/visit" },
];

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
              onClick={() => { setBooking({ service: s.name }); go("booking"); }}
            >
              <ServiceIcon name={s.name} />
              <b style={{ fontSize: 15, marginTop: 6 }}>{s.name}</b>
              <span className="muted small">{s.price}</span>
            </button>
          ))}
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

export function Booking() {
  const { go, booking, setBooking } = useNav();
  const [mode, setMode] = useState("Schedule");
  const [day, setDay] = useState("Thu 30");
  const [time, setTime] = useState("10:00 AM");
  const [hours, setHours] = useState(3);
  const [find, setFind] = useState<"auto" | "browse">("browse");
  const days = [["Tue", "28"], ["Wed", "29"], ["Thu", "30"], ["Fri", "31"], ["Sat", "1"]];
  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];

  const next = () => {
    setBooking({ day, time, hours });
    if (find === "auto") { setBooking({ day, time, hours, helperId: "sunita" }); go("helper"); }
    else go("helpers");
  };

  return (
    <div className="screen">
      <TopBar title={booking.service} />
      <div className="body">
        <div className="seg">
          {["Now", "Schedule", "Recurring"].map((m) => (
            <button key={m} className={mode === m ? "on" : ""} onClick={() => { setMode(m); if (m === "Recurring") go("weekly"); }}>{m}</button>
          ))}
        </div>
        <div className="label">Date</div>
        <div className="grid g5">
          {days.map(([d, n]) => {
            const v = `${d} ${n}`;
            return <button key={v} className={`opt ${day === v ? "on" : ""}`} onClick={() => setDay(v)}>{d}<br />{n}</button>;
          })}
        </div>
        <div className="label">Start time</div>
        <div className="grid g3">
          {times.map((t) => (
            <button key={t} className={`opt ${time === t ? "on" : ""}`} disabled={t === "3:00 PM"} onClick={() => setTime(t)}>
              {t === "3:00 PM" ? "3:00 PM full" : t}
            </button>
          ))}
        </div>
        <div className="label">Duration</div>
        <div className="grid g4">
          {[1, 2, 3, 4].map((h) => (
            <button key={h} className={`opt pill ${hours === h ? "on" : ""}`} onClick={() => setHours(h)}>{h} {h === 1 ? "hr" : "hrs"}</button>
          ))}
        </div>
        <div className="label">Clinic address</div>
        <input className="input" placeholder="[Clinic name and address]" />
        <div className="label">How should we find a helper?</div>
        <button className={`radio-card ${find === "auto" ? "on" : ""}`} onClick={() => setFind("auto")}><Radio on={find === "auto"} /> Auto-match the best fit</button>
        <button className={`radio-card ${find === "browse" ? "on" : ""}`} onClick={() => setFind("browse")}><Radio on={find === "browse"} /> Let me browse helpers</button>
      </div>
      <div className="footer row">
        <div>
          <div className="small muted">Estimate</div>
          <b style={{ fontSize: 18 }}>[$XX]</b>
        </div>
        <Btn style={{ flex: 1 }} onClick={next}>{find === "auto" ? "Match me" : "See helpers"}</Btn>
      </div>
    </div>
  );
}

export function Helpers() {
  const { go, booking, setBooking, toast } = useNav();
  const [filters, toggle] = useMulti(["Hindi"]);
  return (
    <div className="screen">
      <TopBar title="Choose a helper" sub={`${booking.day} · ${booking.time} · ${booking.hours} hrs`} />
      <div className="body">
        <div className="chips scroll">
          {["Hindi", "Rating 4.5+", "Gender", "Price", "Experience"].map((f) => (
            <Chip key={f} on={filters.includes(f)} onClick={() => toggle(f)}>{f}</Chip>
          ))}
        </div>
        <div className="row between small">
          <span className="muted">12 helpers available</span>
          <button style={{ fontWeight: 600 }} onClick={() => toast("Sorted by best match")}>Sort: Best match ▾</button>
        </div>
        {HELPERS.map((h, i) => (
          <button key={h.id} className={`card row top ${i === 0 ? "sel" : ""}`} style={{ textAlign: "left" }} onClick={() => { setBooking({ helperId: h.id }); go("helper"); }}>
            <Avatar size={52} who={h.id} />
            <div className="grow">
              <div className="row between"><b style={{ fontSize: 16 }}>{h.name}</b><b style={{ fontSize: 14 }}>[$XX]/hr</b></div>
              <div className="muted small" style={{ marginTop: 2 }}>{h.role} · {h.years} yrs</div>
              <div className="small" style={{ margin: "3px 0 6px" }}>★ {h.rating} ({h.visits} visits)</div>
              <div className="chips" style={{ gap: 5 }}>{h.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            </div>
          </button>
        ))}
        <button className="card soft" style={{ textAlign: "center", fontSize: 14, color: "var(--ink-2)" }} onClick={() => toast("Request sent to your favorite helper")}>
          Your favorite helper isn&apos;t free? Ask for another time
        </button>
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
            <div className="muted" style={{ fontSize: 14 }}>{h.role} · {h.years} yrs · 4 mi away</div>
          </div>
          <div className="grid g3">
            <div className="stat"><b>★ {h.rating}</b><span>Rating</span></div>
            <div className="stat"><b>{h.visits}</b><span>Visits</span></div>
            <div className="stat"><b>98%</b><span>On time</span></div>
          </div>
          <div className="chips" style={{ gap: 6 }}>
            {["Background checked", "CPR certified", "Insured", "Hindi, English"].map((t) => <span key={t} className="chip" style={{ fontSize: 13, padding: "6px 12px" }}>{t}</span>)}
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
          <div className="small muted">{booking.hours} hrs</div>
          <b style={{ fontSize: 18 }}>[$XX]</b>
        </div>
        <Btn style={{ flex: 1 }} onClick={() => go("checklist")}>Book {h.short}</Btn>
      </div>
    </div>
  );
}

export function Checklist() {
  const { go } = useNav();
  const h = useHelper();
  const [tasks, setTasks] = useState([
    { t: "Pick Mom up from home", on: true },
    { t: "Stay with her during the appointment", on: true },
    { t: "Take notes from the doctor", on: true },
    { t: "Pharmacy pickup on the way back", on: false },
  ]);
  const [meds, setMeds] = useState(true);
  const [photos, setPhotos] = useState(true);
  const [adding, setAdding] = useState("");

  return (
    <div className="screen">
      <TopBar title={`What should ${h.short} do?`} />
      <div className="body">
        <div>
          <div className="label" style={{ margin: 0 }}>Visit checklist</div>
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
        <textarea className="textarea" defaultValue="She likes to chat. Uses a cane on stairs. Door code [####]." style={{ minHeight: 110 }} />
        <button className="toggle-row" onClick={() => setMeds(!meds)}>Share Mom&apos;s medication list <Check on={meds} /></button>
        <button className="toggle-row" onClick={() => setPhotos(!photos)}>Send photo updates during the visit <Check on={photos} /></button>
      </div>
      <div className="footer">
        <Btn onClick={() => go("pay")}>Review booking</Btn>
      </div>
    </div>
  );
}
