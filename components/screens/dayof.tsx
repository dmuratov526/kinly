"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, Btn, TopBar, useHelper, useNav } from "../ui";
import { P, VisitPhoto } from "../illustrations";

export function Tracking() {
  const { go, back, toast } = useNav();
  const h = useHelper();
  const [mins, setMins] = useState(8);
  useEffect(() => {
    const t = setInterval(() => setMins((m) => (m > 1 ? m - 1 : 1)), 4000);
    return () => clearInterval(t);
  }, []);
  const pathRef = useRef<SVGPathElement>(null);
  const [pt, setPt] = useState({ x: 60, y: 230 });
  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const progress = (8 - mins) / 7.5; // 0..~0.93
    const q = p.getPointAtLength(p.getTotalLength() * progress);
    setPt({ x: q.x, y: q.y });
  }, [mins]);

  return (
    <div className="screen">
      <div className="map">
        <div className="road-v" style={{ left: "26%" }} />
        <div className="road-v" style={{ left: "68%" }} />
        <div className="road-h" style={{ top: "26%" }} />
        <div className="road-h" style={{ top: "60%" }} />
        <svg viewBox="0 0 390 300" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <rect x="268" y="196" width="100" height="80" rx="12" fill={P.sage} />
          <ellipse cx="300" cy="236" rx="22" ry="12" fill={P.sky} />
          <rect x="20" y="20" width="62" height="50" rx="8" fill={P.sand} />
          <rect x="140" y="196" width="80" height="80" rx="8" fill={P.sand} />
          <path ref={pathRef} d="M 60 230 C 120 150, 160 120, 210 100 S 300 80, 330 50" fill="none" stroke="#1f1f1f" strokeWidth="3" strokeDasharray="6 7" />
          {/* Mom's home */}
          <g transform="translate(330 50)">
            <circle r="17" fill={P.white} stroke="#1f1f1f" strokeWidth="2.5" />
            <path d="M-8 -1 L0 -8 L8 -1 V8 H-8 Z" fill={P.peachDeep} />
            <rect x="-2" y="2" width="4" height="6" fill={P.white} />
          </g>
          {/* helper car */}
          <g style={{ transform: `translate(${pt.x}px, ${pt.y}px)`, transition: "transform 1s ease" }}>
            <circle r="15" fill="#1f1f1f" />
            <rect x="-8" y="-3" width="16" height="7" rx="2" fill={P.white} />
            <path d="M-5 -3 l2 -4 h6 l2 4 Z" fill={P.white} />
            <circle cx="-4.5" cy="5" r="2" fill={P.peach} /><circle cx="4.5" cy="5" r="2" fill={P.peach} />
          </g>
        </svg>
        <button className="float-back" onClick={back}>‹</button>
        <div className="banner">{h.short} is {mins} min from Mom&apos;s home</div>
      </div>
      <div className="body">
        <div className="row">
          <Avatar size={48} who={h.id} />
          <div className="grow">
            <b>{h.name}</b>
            <div className="muted small">★ {h.rating} · [Car model, plate]</div>
          </div>
          <button className="circle-btn" onClick={() => toast(`Calling ${h.short}…`)}>Call</button>
          <button className="circle-btn" onClick={() => go("inProgress")}>Chat</button>
        </div>
        <div className="timeline" style={{ marginTop: 6 }}>
          <div className="row"><span className="dot on" /> Booking confirmed</div>
          <div className="row"><span className="dot on" /> <b>On the way · ETA 9:58 AM</b></div>
          <div className="row muted"><span className="dot" /> Arrives and checks in</div>
          <div className="row muted"><span className="dot" /> At the clinic</div>
        </div>
        <button className="card soft" style={{ textAlign: "left" }} onClick={() => go("pinMismatch")}>
          <div className="small muted">Check-in PIN · Mom shares this at the door</div>
          <div className="pin" style={{ marginTop: 6 }}>4821</div>
        </button>
      </div>
      <div className="footer">
        <Btn kind="demo" onClick={() => go("inProgress")}>▶ Demo: simulate {h.short} entering the PIN</Btn>
        <Btn kind="secondary" onClick={() => go("reschedule")}>Cancel visit</Btn>
      </div>
    </div>
  );
}

export function PinMismatch() {
  const { go, toast } = useNav();
  const h = useHelper();
  return (
    <div className="screen">
      <TopBar title="Check-in problem" />
      <div className="body">
        <div className="card alert">
          <h3>The check-in PIN didn&apos;t match</h3>
          <p>{h.short} entered a different code at Mom&apos;s door. The visit is paused until it&apos;s verified.</p>
        </div>
        <div className="card row">
          <Avatar size={48} who={h.id} />
          <div>
            <b>{h.name} is at the door</b>
            <div className="muted small">Arrived 9:58 AM · location matches</div>
          </div>
        </div>
        <div className="label">What would you like to do?</div>
        <button className="nav-row" onClick={() => toast("Calling Mom…")}>Call Mom <span>›</span></button>
        <button className="nav-row" onClick={() => toast(`Calling ${h.short}…`)}>Call {h.short} <span>›</span></button>
        <button className="nav-row" onClick={() => toast("Starting video call…")}>Video-verify {h.short}&apos;s ID <span>›</span></button>
        <div className="small muted">Kinly support has been alerted and will call you in 2 minutes.</div>
      </div>
      <div className="footer">
        <Btn onClick={() => toast("Connecting to Kinly support…")}>Contact Kinly support</Btn>
        <Btn kind="secondary" onClick={() => go("inProgress")}>I verified her, continue visit</Btn>
      </div>
    </div>
  );
}

type Update = { title: string; time: string; text?: string; photo?: boolean; mine?: boolean };

export function InProgress() {
  const { go } = useNav();
  const h = useHelper();
  const [tasks, setTasks] = useState([
    { t: "Picked Mom up from home", on: true },
    { t: "Arrived at clinic", on: true },
    { t: "Notes from the doctor", on: false },
    { t: "Pharmacy pickup", on: false },
  ]);
  const [msg, setMsg] = useState("");
  const [updates, setUpdates] = useState<Update[]>([
    { title: "In the waiting room", time: "10:42 AM", text: "\"Kamala is relaxed, we're chatting.\"", photo: true },
    { title: "Checked in at clinic", time: "10:30 AM" },
  ]);
  const done = tasks.filter((t) => t.on).length;

  const send = () => {
    if (!msg.trim()) return;
    setUpdates([{ title: "You", time: "now", text: msg.trim(), mine: true }, ...updates]);
    setMsg("");
    setTimeout(() => {
      setUpdates((u) => [{ title: h.short, time: "now", text: "Got it! 👍" }, ...u]);
    }, 1200);
  };

  return (
    <div className="screen">
      <TopBar title="Visit in progress" sub={`${h.short} with Mom · checked in 10:01 AM`} />
      <div className="body">
        <div>
          <div className="row between" style={{ fontSize: 14, marginBottom: 8 }}>
            <b>1 hr 12 min of 3 hrs</b>
            <span className="muted">{done} of {tasks.length} tasks done</span>
          </div>
          <div className="progress"><div style={{ width: "40%" }} /></div>
        </div>
        <div className="list">
          {tasks.map((x, i) => (
            <button key={i} className="list-item" style={{ color: x.on ? "var(--ink)" : "var(--ink-2)" }}
              onClick={() => setTasks(tasks.map((y, j) => (j === i ? { ...y, on: !y.on } : y)))}>
              <span style={{ width: 16, textAlign: "center" }}>{x.on ? "✓" : "○"}</span> {x.t}
            </button>
          ))}
        </div>
        <div className="label">Live updates</div>
        {updates.map((u, i) =>
          u.photo ? (
            <div key={i} className="row top">
              <div style={{ width: 92, height: 68, flexShrink: 0 }}><VisitPhoto kind="waiting" /></div>
              <div style={{ fontSize: 14 }}>
                <b>{u.title}</b>
                <div className="muted">{u.time} · {u.text}</div>
              </div>
            </div>
          ) : (
            <div key={i} className="row top" style={{ fontSize: 14 }}>
              <span className="dot on" style={{ width: 8, height: 8, marginTop: 6, background: u.mine ? "var(--ink)" : "#999", borderColor: "transparent" }} />
              <div><b>{u.title}</b> <span className="muted">· {u.time}</span>{u.text && <div className="muted">{u.text}</div>}</div>
            </div>
          ),
        )}
        <div className="row">
          <input className="input grow" style={{ borderRadius: 999 }} placeholder={`Message ${h.short}`} value={msg}
            onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
          <button className="btn primary" style={{ width: 70, height: 46, borderRadius: 999 }} onClick={send}>Send</button>
        </div>
        <div className="grid g2">
          <Btn kind="secondary" onClick={() => go("extraTime")}>+ Extend time</Btn>
          <Btn kind="danger" onClick={() => go("emergency")}>SOS · Emergency</Btn>
        </div>
      </div>
      <div className="footer">
        <Btn kind="demo" onClick={() => go("report")}>▶ Demo: simulate {h.short} checking out</Btn>
      </div>
    </div>
  );
}

export function ExtraTime() {
  const { back, toast } = useNav();
  const h = useHelper();
  const opts = [{ l: "15 min", p: "[$X]", end: "1:15 PM" }, { l: "30 min", p: "[$X]", end: "1:30 PM" }, { l: "1 hr", p: "[$XX]", end: "2:00 PM" }];
  const [sel, setSel] = useState(1);
  return (
    <div className="screen">
      <TopBar title="Extra time request" sub="Visit in progress" />
      <div className="body">
        <div className="row top">
          <Avatar size={48} who={h.id} />
          <div>
            <b style={{ fontSize: 16 }}>{h.short} asked for more time</b>
            <div className="muted small">&quot;The doctor is running about 30 minutes late.&quot;</div>
          </div>
        </div>
        <div className="label">How much extra time?</div>
        <div className="grid g3">
          {opts.map((o, i) => (
            <button key={o.l} className={`opt ${sel === i ? "ring" : ""}`} style={{ padding: "12px 4px" }} onClick={() => setSel(i)}>
              <b>{o.l}</b><div className="muted">{o.p}</div>
            </button>
          ))}
        </div>
        <div className="card soft small muted" style={{ lineHeight: 1.45 }}>
          You&apos;re only charged for the time actually used. Anita will be asked to approve her half.
        </div>
        <div style={{ fontSize: 15 }}>New end time: <b>{opts[sel].end}</b></div>
      </div>
      <div className="footer">
        <Btn onClick={() => { toast(`Approved +${opts[sel].l}`); back(); }}>Approve {opts[sel].l}</Btn>
        <Btn kind="secondary" onClick={() => { toast("Request declined"); back(); }}>Decline</Btn>
      </div>
    </div>
  );
}

export function Emergency() {
  const { back, toast } = useNav();
  const h = useHelper();
  return (
    <div className="screen emergency">
      <div className="body" style={{ paddingTop: 36 }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".08em" }}>EMERGENCY · 10:52 AM</div>
        <h2 className="h-xl" style={{ fontSize: 30 }}>Emergency alert sent</h2>
        <div style={{ fontSize: 16, lineHeight: 1.45, opacity: .95 }}>{h.short} pressed SOS at [Clinic name]. Help is on the way.</div>
        <div className="card" style={{ color: "var(--ink)", display: "flex", flexDirection: "column", gap: 12, fontSize: 15, border: 0 }}>
          {[`911 called from ${h.short}'s phone`, "Rohan and Anita notified", "Kinly care team on the line", "Live location shared with responders", "Mom's meds and health notes sent"].map((t) => (
            <div key={t}>✓ {t}</div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <Btn kind="white-red" onClick={() => toast(`Calling ${h.short}…`)}>Call {h.short} now</Btn>
        <Btn kind="red-outline" onClick={() => toast("Calling Kinly care team…")}>Call Kinly care team</Btn>
        <button style={{ textDecoration: "underline", fontSize: 14, alignSelf: "center", color: "#fff" }} onClick={() => { toast("Alert cancelled"); back(); }}>
          False alarm? Cancel alert
        </button>
      </div>
    </div>
  );
}
