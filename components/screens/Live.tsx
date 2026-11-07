"use client";

import { AnimatePresence, animate, motion } from "motion/react";
import { Check, ChevronLeft, KeyRound, MessageCircle, Phone, Play, Send, ShieldAlert, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PEOPLE, helper } from "../data";
import { Avatar, Btn, Rating, Tap, spring } from "../kit";
import { useStore, type LiveStage } from "../store";

const STAGES = ["On the way", "Arrived", "With Mom", "Done"];
const ROUTE = "M 40 372 C 70 330, 120 325, 150 300 S 175 240, 215 222 S 285 212, 300 176";

export function Live() {
  const { live, setLive, back, go, toast } = useStore();
  const h = helper("sunita");
  const pathRef = useRef<SVGPathElement>(null);
  const [pt, setPt] = useState({ x: 40, y: 372, p: 0 });
  const [mins, setMins] = useState(6);

  // drive the car along the route
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const place = (p: number) => {
      const q = path.getPointAtLength(len * p);
      setPt({ x: q.x, y: q.y, p });
    };
    if (live === 0) {
      place(0);
      const a = animate(0, 0.86, { duration: 16, ease: "linear", onUpdate: (v) => { place(v); setMins(Math.max(1, Math.round(6 - v * 6))); } });
      return () => a.stop();
    }
    const a = animate(pt.p, 1, { duration: 0.8, ease: "easeOut", onUpdate: place });
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  const next = () => setLive(Math.min(3, live + 1) as LiveStage);

  return (
    <div className="screen live-screen">
      {/* ---------- map ---------- */}
      <div className="map">
        <motion.svg viewBox="0 -40 390 470" preserveAspectRatio="xMidYMid slice" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}>
          <defs>
            <linearGradient id="route" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#FF8A4C" />
              <stop offset="1" stopColor="#FF4F7B" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
            <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="var(--map-dot)" /></pattern>
          </defs>
          <rect y="-40" width="390" height="470" fill="var(--map-bg)" />
          <rect y="-40" width="390" height="470" fill="url(#dots)" />
          {/* water */}
          <path d="M 0 -40 L 150 -40 C 120 20, 70 60, 0 80 Z" fill="var(--map-water)" />
          <text x="16" y="18" className="map-label water">Flushing Bay</text>
          {/* blocks */}
          {Array.from({ length: 8 }).map((_, rr) => { const r = rr - 2; return (
            Array.from({ length: 5 }).map((_, c) => {
              const x = 14 + c * 78, y = 100 + r * 62;
              if ((r === 2 && c === 1) || (r === 3 && c === 1)) return null;
              if (y < 70 && c === 0) return null;
              return <rect key={`${r}-${c}`} x={x} y={y} width="64" height="48" rx="7" fill="var(--map-block)" />;
            })); })}
          {/* park */}
          <rect x="92" y="224" width="64" height="110" rx="10" fill="var(--map-park)" />
          {[[108, 244], [130, 262], [112, 290], [138, 306], [124, 318]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill="var(--map-tree)" />)}
          <text x="98" y="282" className="map-label park">Travers</text>
          <text x="104" y="294" className="map-label park">Park</text>
          {/* avenues */}
          <path d="M 0 210 L 390 196" stroke="var(--map-ave)" strokeWidth="11" />
          <path d="M 236 -40 L 254 430" stroke="var(--map-road)" strokeWidth="8" />
          <path d="M 0 344 L 390 330" stroke="var(--map-road)" strokeWidth="7" />
          <text x="10" y="191" className="map-label">Roosevelt Ave</text>
          <text x="262" y="430" className="map-label" transform="rotate(87 262 430)">74th St</text>
          {/* subway */}
          <g transform="translate(200 202)"><circle r="8" fill="#7B5CF0" /><text y="3.5" textAnchor="middle" className="map-sub">7</text></g>

          {/* route */}
          <path d={ROUTE} stroke="url(#route)" strokeWidth="10" fill="none" strokeLinecap="round" opacity=".35" filter="url(#glow)" />
          <path d={ROUTE} stroke="var(--map-route-bg)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="2 9" />
          <path ref={pathRef} d={ROUTE} stroke="url(#route)" strokeWidth="6" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${pt.p} 1`} />

          {/* mom's home */}
          <g transform="translate(300 176)">
            <motion.circle r="28" fill="#FF4F7B" opacity=".18" animate={{ r: [22, 34, 22], opacity: [0.25, 0, 0.25] }} transition={{ duration: 2.4, repeat: Infinity }} />
            <path d="M -18 -20 a 18 18 0 1 1 36 0 c 0 12 -18 30 -18 30 c 0 0 -18 -18 -18 -30 z" transform="translate(0 -10)" fill="#fff" stroke="#fff" />
            <clipPath id="momclip"><circle cx="0" cy="-31" r="15" /></clipPath>
            <image href={PEOPLE.mom.photo} x="-15" y="-46" width="30" height="30" clipPath="url(#momclip)" preserveAspectRatio="xMidYMid slice" />
          </g>

          {/* car */}
          <g style={{ transform: `translate(${pt.x}px, ${pt.y}px)` }}>
            <circle r="20" fill="#FF4F7B" opacity=".2" />
            <circle r="13" fill="#fff" />
            <circle r="10" fill="url(#route)" />
            <path d="M -4.5 1 l 1.5 -4 h 6 l 1.5 4 v 3 h -9 z" fill="#fff" />
          </g>
        </motion.svg>

        <div className="map-top">
          <Tap className="icon-btn glass" onClick={back} aria-label="Back"><ChevronLeft size={22} /></Tap>
          <AnimatePresence mode="wait">
            <motion.div key={live} className="map-status glass" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}>
              {live === 0 && <><span className="pulse-dot" /> <b>{mins} min</b> away · ETA 1:58 PM</>}
              {live === 1 && <><Check size={16} className="ok" /> Checked in · PIN matched</>}
              {live === 2 && <><span className="pulse-dot" /> <b>Live</b> · 1 hr 12 min in</>}
              {live === 3 && <><Sparkles size={16} className="ok" /> Visit complete</>}
            </motion.div>
          </AnimatePresence>
          <Tap className="icon-btn sos" onClick={() => go("emergency")} aria-label="Emergency"><ShieldAlert size={20} /></Tap>
        </div>
      </div>

      {/* ---------- panel ---------- */}
      <motion.div className="live-panel" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: 0.15 }}>
        <div className="grabber" />
        <div className="stepper-line">
          {STAGES.map((s, i) => (
            <div key={s} className={`step ${i <= live ? "on" : ""} ${i === live ? "cur" : ""}`}>
              <span className="step-dot">{i < live ? <Check size={12} strokeWidth={3.5} /> : null}</span>
              <em>{s}</em>
            </div>
          ))}
          <div className="step-track"><motion.i animate={{ width: `${(live / 3) * 100}%` }} transition={spring} /></div>
        </div>

        <div className="live-helper">
          <Avatar src={h.photo} size={52} online />
          <div className="grow">
            <b>{h.name}</b>
            <div className="row" style={{ gap: 8 }}><Rating value={h.rating} /><span className="small muted">Toyota Corolla · KXT 2291</span></div>
          </div>
          <Tap className="round-btn" onClick={() => toast(`Calling ${h.first}…`, "info")} aria-label="Call"><Phone size={19} /></Tap>
          <Tap className="round-btn" onClick={() => toast(`Chat with ${h.first}`, "info")} aria-label="Chat"><MessageCircle size={19} /></Tap>
        </div>

        <div className="live-scroll">
          <AnimatePresence mode="wait">
            <motion.div key={live} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              {live === 0 && <StageOnTheWay />}
              {live === 1 && <StageArrived />}
              {live === 2 && <StageInVisit />}
              {live === 3 && <StageDone onReport={() => go("report")} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {live < 3 && (
          <Tap className="demo-btn" onClick={next}>
            <Play size={12} fill="currentColor" /> Demo: {["Sunita arrives", "start the visit", "finish the visit"][live]}
          </Tap>
        )}
      </motion.div>
    </div>
  );
}

function StageOnTheWay() {
  return (
    <div className="stack-12">
      <div className="pin-card">
        <span className="pin-ic"><KeyRound size={20} /></span>
        <div className="grow">
          <span className="small muted">Door PIN · Mom reads it to Sunita</span>
          <div className="pin-digits">{"4821".split("").map((d, i) => <motion.b key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * i }}>{d}</motion.b>)}</div>
        </div>
      </div>
      <div className="tl">
        <div className="tl-row on"><i /> <span><b>Booked</b> · Mon 6:12 PM</span></div>
        <div className="tl-row on"><i /> <span><b>Left home</b> · 1:52 PM · 1.2 mi away</span></div>
        <div className="tl-row"><i /> <span>Checks in with the PIN</span></div>
        <div className="tl-row"><i /> <span>Chai, walk and rummy with Mom</span></div>
      </div>
    </div>
  );
}

function StageArrived() {
  return (
    <div className="stack-12">
      <div className="arrived">
        <motion.span className="arrived-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 14 }}><Check size={22} strokeWidth={3} /></motion.span>
        <div>
          <b>Sunita is inside with Mom</b>
          <span>2:01 PM · PIN 4821 matched · location verified</span>
        </div>
      </div>
      <p className="hint" style={{ margin: 0 }}>We let Anita know too. You&apos;ll get photos and task updates as they happen.</p>
    </div>
  );
}

type Item = { who: "sunita" | "you"; text: string; time: string; photo?: boolean };

function StageInVisit() {
  const { toast } = useStore();
  const [tasks, setTasks] = useState([
    { t: "Chat over chai", on: true },
    { t: "Short walk in Travers Park", on: true },
    { t: "Play rummy or carrom", on: false },
    { t: "Video-call the family", on: false },
  ]);
  const [feed, setFeed] = useState<Item[]>([
    { who: "sunita", text: "We made it to the park! Kamala walked the whole loop without her cane today 💪", time: "2:48 PM", photo: true },
    { who: "sunita", text: "Chai is ready, she says hi to you and Anita.", time: "2:09 PM" },
  ]);
  const [msg, setMsg] = useState("");

  // the helper ticks the next task off by herself after a moment
  useEffect(() => {
    const id = setTimeout(() => {
      setTasks((t) => t.map((x, i) => (i === 2 ? { ...x, on: true } : x)));
      setFeed((f) => [{ who: "sunita", text: "Rummy time. She's winning, as usual 😄", time: "3:14 PM" }, ...f]);
    }, 2600);
    return () => clearTimeout(id);
  }, []);

  const send = () => {
    if (!msg.trim()) return;
    setFeed((f) => [{ who: "you", text: msg.trim(), time: "now" }, ...f]);
    setMsg("");
    setTimeout(() => setFeed((f) => [{ who: "sunita", text: "Will do! 🙏", time: "now" }, ...f]), 1400);
  };

  const done = tasks.filter((t) => t.on).length;

  return (
    <div className="stack-14">
      <div className="task-ring-row">
        <div className="ring">
          <svg viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" className="ring-bg" />
            <motion.circle cx="20" cy="20" r="16" className="ring-fg" pathLength={1} initial={{ pathLength: 0 }} animate={{ pathLength: done / tasks.length }} transition={spring} />
          </svg>
          <b>{done}/{tasks.length}</b>
        </div>
        <div className="grow">
          <b>Tasks</b>
          <div className="small muted">1 hr 12 min of 3 hrs · ends 5:00 PM</div>
        </div>
        <Tap className="mini-btn" onClick={() => toast("Sunita asked for +30 min · approved", "check")}>+ Time</Tap>
      </div>
      <div className="live-tasks">
        {tasks.map((x) => (
          <motion.div layout key={x.t} className={`lt ${x.on ? "on" : ""}`}>
            <span className="cbox">{x.on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring}><Check size={12} strokeWidth={3.5} /></motion.span>}</span>
            {x.t}
          </motion.div>
        ))}
      </div>

      <div className="feed">
        <AnimatePresence initial={false}>
          {feed.map((f, i) => (
            <motion.div key={feed.length - i} layout initial={{ opacity: 0, y: -12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`bubble ${f.who}`}>
              {f.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/img/visit-clinic.jpg" alt="Sunita and Kamala" className="bubble-photo" />
              )}
              <p>{f.text}</p>
              <span>{f.who === "you" ? "You" : "Sunita"} · {f.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="composer">
        <input placeholder="Message Sunita…" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <Tap className="send" onClick={send} aria-label="Send"><Send size={17} /></Tap>
      </div>
    </div>
  );
}

function StageDone({ onReport }: { onReport: () => void }) {
  return (
    <div className="stack-14">
      <div className="arrived done">
        <motion.span className="arrived-check" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 14 }}><Sparkles size={20} /></motion.span>
        <div>
          <b>Mom had a lovely afternoon</b>
          <span>Checked out 5:04 PM · 4 of 4 tasks done</span>
        </div>
      </div>
      <Btn kind="brand" style={{ width: "100%" }} onClick={onReport}>Open visit report</Btn>
    </div>
  );
}
