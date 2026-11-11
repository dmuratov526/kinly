"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Clock, HeartPulse, KeyRound, MessageCircle, Phone, Play, Send, Siren, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { helper } from "../data";
import { StreetMap, useDrive } from "../map";
import { Avatar, Btn, Rating, Sheet, Tap, spring } from "../kit";
import { useStore, type LiveStage } from "../store";

const STAGES = ["On the way", "Arrived", "With Kamala", "Done"];

export function Live() {
  const { live, setLive, back, go, toast, openChat, visits } = useStore();
  const h = helper(visits.find((v) => v.status === "live")?.helperId ?? "sunita");
  const { p, mins } = useDrive(true);
  const [sos, setSos] = useState(false);
  const fire = useCallback(() => { setSos(false); go("emergency"); }, [go]);

  const next = () => setLive(Math.min(3, live + 1) as LiveStage);

  return (
    <div className="screen live-screen">
      {/* ---------- map ---------- */}
      <div className="map">
        <motion.div className="map-zoom" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}>
          <StreetMap progress={p} fit pad={{ top: 112, right: 34, bottom: 52, left: 34 }} className="attr-high" />
        </motion.div>

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
          <span style={{ width: 42 }} />
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
            <Rating value={h.rating} />
            <div className="small muted" style={{ marginTop: 2, whiteSpace: "nowrap" }}>Toyota Corolla · KXT 2291</div>
          </div>
          <Tap className="round-btn" onClick={() => toast(`Calling ${h.first}…`, "info")} aria-label="Call"><Phone size={19} /></Tap>
          <Tap className="round-btn" onClick={() => openChat(h.id)} aria-label="Chat"><MessageCircle size={19} /></Tap>
        </div>

        {/* always in view, never behind a scroll */}
        <Tap className="emergency-btn" onClick={() => setSos(true)}>
          <Siren size={19} /> Emergency
          <span>911 · family · Kinly nurse</span>
        </Tap>

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

      <Sheet open={sos} onClose={() => setSos(false)} title="What's happening with Kamala?">
        <div className="stack-10">
          <Tap className="sos-opt red" onClick={fire}>
            <span className="sos-opt-ic"><Siren size={22} /></span>
            <div className="grow"><b>Call 911 to Kamala&apos;s home</b><span>37-12 82nd St · Sunita and Anita are alerted</span></div>
            <ChevronRight size={18} />
          </Tap>
          <Tap className="sos-opt" onClick={() => { setSos(false); toast(`Calling ${h.first}…`, "info"); }}>
            <span className="sos-opt-ic green"><Phone size={20} /></span>
            <div className="grow"><b>Call {h.first}</b><span>{live >= 1 && live <= 2 ? "She's with Kamala right now" : `${mins} min from Kamala`}</span></div>
            <ChevronRight size={18} />
          </Tap>
          <Tap className="sos-opt" onClick={() => { setSos(false); toast("Connecting to a Kinly nurse…", "info"); }}>
            <span className="sos-opt-ic plum"><HeartPulse size={20} /></span>
            <div className="grow"><b>Talk to a Kinly nurse</b><span>Not sure it&apos;s an emergency? Ask first, 24/7</span></div>
            <ChevronRight size={18} />
          </Tap>
        </div>
      </Sheet>
    </div>
  );
}

function StageOnTheWay() {
  return (
    <div className="stack-12">
      <div className="pin-card">
        <span className="pin-ic"><KeyRound size={20} /></span>
        <div className="grow">
          <span className="small muted">Door PIN · Kamala reads it to Sunita</span>
          <div className="pin-digits">{"4821".split("").map((d, i) => <motion.b key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * i }}>{d}</motion.b>)}</div>
        </div>
      </div>
      <div className="tl">
        <div className="tl-row on"><i /> <span><b>Booked</b> · Mon 6:12 PM</span></div>
        <div className="tl-row on"><i /> <span><b>Left home</b> · 1:52 PM · 0.8 mi away</span></div>
        <div className="tl-row"><i /> <span>Checks in with the PIN</span></div>
        <div className="tl-row"><i /> <span>Chai, walk and rummy with Kamala</span></div>
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
          <b>Sunita is inside with Kamala</b>
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
  const [extendOpen, setExtendOpen] = useState(false);
  const [extra, setExtra] = useState(0);
  const ends = ["5:00 PM", "5:30 PM", "6:00 PM"][extra];
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
          <div className="small muted">1 hr 12 min of {3 + extra / 2} hrs · ends {ends}</div>
        </div>
        <Tap className="mini-btn" onClick={() => setExtendOpen(true)}><Clock size={14} /> Extend visit</Tap>
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
      <Sheet open={extendOpen} onClose={() => setExtendOpen(false)} title="Need Sunita a bit longer?">
        <p className="extend-why">Kamala is enjoying the visit, or something came up: a late delivery, a call with the doctor, a walk that ran long. Add time here instead of booking a new visit. Sunita confirms she&apos;s free.</p>
        <div className="stack-10">
          {[[1, "+30 min", "$10"], [2, "+1 hour", "$21"]].map(([n, label, price]) => (
            <Tap key={label} className="extend-opt" onClick={() => {
              setExtra(n as number); setExtendOpen(false);
              toast(`Sunita said yes · now ends ${["5:00 PM", "5:30 PM", "6:00 PM"][n as number]}`, "check");
            }}>
              <Clock size={20} />
              <div className="grow"><b>{label}</b><span>Ends {["5:00 PM", "5:30 PM", "6:00 PM"][n as number]} · charged only for the time used</span></div>
              <b>{price}</b>
            </Tap>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

function StageDone({ onReport }: { onReport: () => void }) {
  return (
    <div className="stack-14">
      <div className="arrived done">
        <motion.span className="arrived-check" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 14 }}><Sparkles size={20} /></motion.span>
        <div>
          <b>Kamala had a lovely afternoon</b>
          <span>Checked out 5:04 PM · 4 of 4 tasks done</span>
        </div>
      </div>
      <Btn kind="brand" style={{ width: "100%" }} onClick={onReport}>Open visit report</Btn>
    </div>
  );
}
