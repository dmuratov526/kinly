"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, FileText, Repeat, RotateCcw, Star } from "lucide-react";
import { useState } from "react";
import { endTime, helper, svc, type Visit } from "../data";
import { ServiceGlyph } from "../icons";
import { Avatar, Tap, softSpring } from "../kit";
import { useStore } from "../store";

export function Visits() {
  const { visits, go, live, setDraft, toast } = useStore();
  const [tab, setTab] = useState<"up" | "past">("up");

  const liveVisit = visits.find((v) => v.status === "live");
  const upcoming = visits.filter((v) => v.status === "upcoming");
  const past = [
    ...(liveVisit && live === 3 ? [{ ...liveVisit, status: "past" as const, summary: "Chai, a walk in the park and two rounds of rummy." }] : []),
    ...visits.filter((v) => v.status === "past"),
  ];

  const again = (v: Visit) => {
    setDraft({ helperId: v.helperId, service: v.service, tasks: svc(v.service).tasks, hours: v.hours });
    go("book");
  };

  return (
    <div className="screen scroll">
      <div className="pad" style={{ paddingTop: 14 }}>
        <div className="row between">
          <h1 className="display">Visits</h1>
          <span className="pill-stat"><b>{upcoming.length + (liveVisit && live < 3 ? 1 : 0)}</b> coming up</span>
        </div>

        <div className="segmented">
          {(["up", "past"] as const).map((t) => (
            <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
              {tab === t && <motion.span layoutId="seg" className="seg-bg" transition={softSpring} />}
              <span>{t === "up" ? "Upcoming" : "Past"}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "up" ? (
            <motion.div key="up" className="stack-14" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {liveVisit && live < 3 && (
                <Tap className="visit live" onClick={() => go("live")}>
                  <div className="visit-live-bar"><span className="pulse-dot" /> {live === 0 ? "On the way" : live === 1 ? "Arrived" : "Happening now"}</div>
                  <VisitBody v={liveVisit} />
                  <div className="visit-progress"><motion.i initial={{ width: 0 }} animate={{ width: `${[12, 30, 58][live]}%` }} transition={{ duration: 1 }} /></div>
                </Tap>
              )}

              <div className="group-label">Next 7 days</div>
              {upcoming.map((v, i) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Tap className="visit" onClick={() => { setDraft({ helperId: v.helperId, service: v.service }); go("helper"); }}>
                    <VisitBody v={v} />
                    <div className="visit-actions">
                      <span onClick={(e) => { e.stopPropagation(); toast("Reschedule options", "info"); }}>Reschedule</span>
                      <span onClick={(e) => { e.stopPropagation(); toast(`Message sent to ${helper(v.helperId).first}`, "check"); }}>Message</span>
                    </div>
                  </Tap>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="past" className="stack-14" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
              <div className="past-summary">
                <div><b>{past.length}</b><span>visits</span></div>
                <div><b>{past.reduce((a, v) => a + v.hours, 0)}h</b><span>of care</span></div>
                <div><b>4.9</b><span>avg rating</span></div>
              </div>
              {past.map((v, i) => {
                const h = helper(v.helperId);
                return (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="visit past">
                    <VisitBody v={v} />
                    {v.summary && <p className="visit-summary">&ldquo;{v.summary}&rdquo;</p>}
                    <div className="row between" style={{ marginTop: 12 }}>
                      <span className="stars-row">
                        {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={14} fill={n <= (v.rated ?? 5) ? "currentColor" : "none"} strokeWidth={n <= (v.rated ?? 5) ? 0 : 1.5} />)}
                      </span>
                      <div className="row" style={{ gap: 8 }}>
                        <Tap className="mini-btn" onClick={() => go("report")}><FileText size={14} /> Report</Tap>
                        <Tap className="mini-btn dark" onClick={() => again(v)}><RotateCcw size={14} /> Book {h.first}</Tap>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ height: 120 }} />
      </div>
    </div>
  );
}

function VisitBody({ v }: { v: Visit }) {
  const h = helper(v.helperId);
  const s = svc(v.service);
  const [dow, rest] = v.dateLabel.includes(",") ? v.dateLabel.split(", ") : [v.dateLabel, ""];
  return (
    <div className="visit-body">
      <div className="date-tile" style={{ ["--hue" as string]: s.hue, ["--tint" as string]: s.tint }}>
        <span>{rest ? dow : v.dateLabel === "Today" ? "TODAY" : dow}</span>
        <b>{rest ? rest.split(" ")[1] : "12"}</b>
      </div>
      <div className="grow" style={{ minWidth: 0, textAlign: "left" }}>
        <div className="row" style={{ gap: 6 }}>
          <b className="visit-title">{s.name}</b>
          {v.weekly && <span className="weekly"><Repeat size={11} /> Weekly</span>}
        </div>
        <div className="muted small">{v.time} – {endTime(v.time, v.hours)} · ${v.total}</div>
        <div className="row" style={{ gap: 6, marginTop: 6 }}>
          <Avatar src={h.photo} size={22} />
          <span className="small">{h.first}</span>
          <ServiceGlyph id={v.service} size={22} radius={7} />
        </div>
      </div>
      <ChevronRight size={18} className="muted" />
    </div>
  );
}
