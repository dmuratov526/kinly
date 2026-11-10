"use client";

import { motion } from "motion/react";
import { BellRing, CalendarPlus, Check, MessageSquareHeart, Users } from "lucide-react";
import { useMemo } from "react";
import { PEOPLE, day, endTime, helper, svc } from "../data";
import { ServiceGlyph } from "../icons";
import { Avatar, Btn, Tap } from "../kit";
import { useStore } from "../store";

const COLORS = ["#FF7A59", "#FF4F7B", "#7B5CF0", "#22A57A", "#E9A23B", "#3B82F6", "#FFD166"];

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 70 + Math.random() * 0.4;
        const r = 140 + Math.random() * 200;
        return {
          x: Math.cos(a) * r, y: Math.sin(a) * r - 120, rot: Math.random() * 720 - 360,
          c: COLORS[i % COLORS.length], w: 6 + Math.random() * 6, h: 8 + Math.random() * 10, d: Math.random() * 0.15,
          round: i % 3 === 0,
        };
      }),
    [],
  );
  return (
    <div className="confetti">
      {bits.map((b, i) => (
        <motion.i key={i}
          style={{ background: b.c, width: b.w, height: b.round ? b.w : b.h, borderRadius: b.round ? "50%" : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: b.x, y: [0, b.y, b.y + 520], opacity: [1, 1, 0], rotate: b.rot, scale: 1 }}
          transition={{ duration: 2.6, delay: 0.25 + b.d, ease: [0.15, 0.7, 0.4, 1], times: [0, 0.35, 1] }}
        />
      ))}
    </div>
  );
}

export function Confirmed() {
  const { draft, tab, toast, lastBooking } = useStore();
  const many = lastBooking.length > 1;
  const one = lastBooking[0] ?? draft;
  const h = helper(one.helperId);
  const s = svc(one.service);
  const d = day(one.dayKey);

  return (
    <div className="screen confirmed">
      <div className="confirmed-glow" />
      <Confetti />
      <div className="scroll grow-1">
        <div className="pad" style={{ paddingTop: 30, textAlign: "center", position: "relative" }}>
          <motion.div className="big-check" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 14 }}>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 15 }}>
              <Check size={46} strokeWidth={3.5} />
            </motion.span>
          </motion.div>
          <motion.h1 className="display" style={{ marginTop: 22 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            {many ? <>{lastBooking.length} visits are <i>booked</i></> : <>{h.first} is <i>booked</i></>}
          </motion.h1>
          <motion.p className="muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} style={{ margin: "6px 0 0", fontSize: 15 }}>
            {many ? `One checkout, $${lastBooking.reduce((a, c) => a + c.total, 0)} in total. Mom's week is set.` : `Mom is in good hands ${d.key === "today" ? "today" : `on ${d.label}`}.`}
          </motion.p>

          {many && (
            <motion.div className="ticket" initial={{ opacity: 0, y: 40, rotateX: 30 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 180, damping: 20 }}>
              <div className="ticket-multi">
                {lastBooking.map((c, i) => {
                  const ch = helper(c.helperId);
                  return (
                    <motion.div key={c.id} className="tm-row" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + i * 0.1 }}>
                      <ServiceGlyph id={c.service} size={40} radius={13} />
                      <div className="grow">
                        <b>{svc(c.service).name}</b>
                        <span>{day(c.dayKey).label} · {c.time.replace(":00", "")} · with {ch.first}</span>
                      </div>
                      <Avatar src={ch.photo} size={34} />
                    </motion.div>
                  );
                })}
              </div>
              <div className="ticket-cut" />
              <div className="ticket-notes">
                {([
                  [MessageSquareHeart, "Mom gets a text with each helper's photo"],
                  [Users, "Anita can see every visit too"],
                  [BellRing, "Reminders 24 hrs and 1 hr before each one"],
                ] as const).map(([Icon, t], i) => (
                  <motion.div key={t} className="row" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.12 }}>
                    <span className="note-ic"><Icon size={16} /></span>{t}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ticket */}
          {!many && <motion.div className="ticket" initial={{ opacity: 0, y: 40, rotateX: 30 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 180, damping: 20 }}>
            <div className="ticket-top">
              <div className="row" style={{ gap: 0 }}>
                <Avatar src={h.photo} size={54} ring="#fff" />
                <Avatar src={PEOPLE.mom.photo} size={54} ring="#fff" style={{ marginLeft: -14 }} />
              </div>
              <div style={{ textAlign: "left" }}>
                <b>{s.name}</b>
                <span>{h.first} with Mom{one.weekly ? " · every week" : ""}</span>
              </div>
            </div>
            <div className="ticket-grid">
              <div><span>Date</span><b>{d.label}</b></div>
              <div><span>Time</span><b>{one.time.replace(":00", "")}–{endTime(one.time, one.hours).replace(":00", "")}</b></div>
              <div><span>Door PIN</span><b className="mono">4 8 2 1</b></div>
            </div>
            <div className="ticket-cut" />
            <div className="ticket-notes">
              {([
                [MessageSquareHeart, `We texted Mom ${h.first}'s photo and arrival time`],
                [Users, "Anita can see this visit too"],
                [BellRing, "Reminders 24 hrs and 1 hr before"],
              ] as const).map(([Icon, t], i) => (
                <motion.div key={t} className="row" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.12 }}>
                  <span className="note-ic"><Icon size={16} /></span>{t}
                </motion.div>
              ))}
            </div>
          </motion.div>}
        </div>
      </div>
      <motion.div className="dock column" initial={{ y: 80 }} animate={{ y: 0 }} transition={{ delay: 0.9, type: "spring", stiffness: 220, damping: 24 }}>
        <Btn kind="primary" style={{ width: "100%" }} onClick={() => tab("visits")}>See it in Visits</Btn>
        <div className="row" style={{ gap: 10, width: "100%" }}>
          <Btn kind="soft" style={{ flex: 1 }} onClick={() => toast("Added to Google Calendar", "check")}><CalendarPlus size={18} /> Calendar</Btn>
          <Tap className="btn soft" style={{ flex: 1 }} onClick={() => tab("home")}>Done</Tap>
        </div>
      </motion.div>
    </div>
  );
}
