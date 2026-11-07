"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { Check, Eye, Phone, Pill, Sun } from "lucide-react";
import { useRef, useState } from "react";
import { PEOPLE, helper } from "../data";
import { Avatar, Tap } from "../kit";
import { useStore } from "../store";

export function Mom() {
  const { go, toast, live } = useStore();
  const h = helper("sunita");
  const [pill, setPill] = useState(false);

  // press-and-hold SOS so it can't be triggered by accident
  const hold = useMotionValue(0);
  const ring = useTransform(hold, [0, 1], [0, 1]);
  const ctl = useRef<ReturnType<typeof animate> | null>(null);
  const startHold = () => {
    ctl.current = animate(hold, 1, { duration: 1.4, ease: "linear", onComplete: () => go("emergency") });
  };
  const endHold = () => {
    ctl.current?.stop();
    if (hold.get() < 1) animate(hold, 0, { duration: 0.25 });
  };

  return (
    <div className="screen scroll mom">
      <div className="mom-banner"><Eye size={14} /> Preview of Mom&apos;s phone · big text, 3 buttons, nothing to learn</div>
      <div className="pad stack-18" style={{ paddingTop: 18 }}>
        <div>
          <div className="mom-date"><Sun size={20} /> Thursday · 58° and sunny</div>
          <h1 className="mom-hello">Good afternoon,<br />Kamala</h1>
        </div>

        <motion.div className="mom-visit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mom-visit-top">
          <Avatar src={h.photo} size={112} ring="#22C55E" />
          <div className="mom-visit-text">
            <span>{live === 0 ? "Coming today" : live === 3 ? "Visited today" : "Here with you"}</span>
            <b>Sunita</b>
            <em>{live === 0 ? "at 2:00 in the afternoon" : live === 3 ? "See you next Thursday" : "until 5:00"}</em>
          </div>
          </div>
          {live === 0 && (
            <div className="mom-code">
              <span>Ask her for your code</span>
              <b>4 8 2 1</b>
            </div>
          )}
        </motion.div>

        <Tap className={`mom-pill ${pill ? "on" : ""}`} onClick={() => { setPill(!pill); if (!pill) toast("Rohan and Anita will see this", "check"); }}>
          <span className="mom-pill-ic">{pill ? <Check size={30} strokeWidth={3} /> : <Pill size={28} />}</span>
          <div style={{ textAlign: "left" }}>
            <b>{pill ? "Done! Well done." : "3 o'clock pill"}</b>
            <span>{pill ? "Your family can see it" : "Tap when you've taken it"}</span>
          </div>
        </Tap>

        <div className="mom-calls">
          {[
            { name: "Rohan", photo: PEOPLE.rohan.photo, sub: "Your son" },
            { name: "Anita", photo: PEOPLE.anita.photo, sub: "Your daughter" },
            { name: "Sunita", photo: h.photo, sub: "Your helper" },
          ].map((p) => (
            <Tap key={p.name} className="mom-call" onClick={() => toast(`Calling ${p.name}…`, "info")}>
              <Avatar src={p.photo} size={62} />
              <div className="grow" style={{ textAlign: "left" }}>
                <b>{p.name}</b>
                <span>{p.sub}</span>
              </div>
              <span className="mom-call-ic"><Phone size={26} fill="currentColor" /></span>
            </Tap>
          ))}
        </div>

        <motion.button
          className="mom-sos"
          onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold} onPointerCancel={endHold}
          whileTap={{ scale: 0.97 }}
        >
          <svg viewBox="0 0 100 100" className="mom-sos-ring" preserveAspectRatio="none">
            <motion.rect x="2" y="2" width="96" height="96" rx="20" pathLength={1} style={{ pathLength: ring }} />
          </svg>
          <b>I need help</b>
          <span>Press and hold</span>
        </motion.button>
        <div style={{ height: 110 }} />
      </div>
    </div>
  );
}

export function Emergency() {
  const { back, toast } = useStore();
  const h = helper("sunita");
  const steps = ["911 called from Sunita's phone", "Rohan and Anita alerted", "Kinly nurse on the line", "Live location sent to responders", "Mom's meds and allergies shared"];
  return (
    <div className="screen emergency">
      <motion.div className="sos-pulse" animate={{ scale: [1, 1.6], opacity: [0.5, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
      <motion.div className="sos-pulse" animate={{ scale: [1, 1.6], opacity: [0.5, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.8 }} />
      <div className="pad stack-18" style={{ paddingTop: 70, position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
        <span className="eyebrow light">Emergency · 3:22 PM</span>
        <h1 className="display light" style={{ fontSize: 38 }}>Help is <i>on the way</i></h1>
        <p style={{ margin: 0, fontSize: 16, opacity: 0.9, lineHeight: 1.45 }}>An alert went out from Mom&apos;s home at 37-12 82nd St. Stay on the line with the Kinly nurse.</p>
        <div className="sos-list">
          {steps.map((s, i) => (
            <motion.div key={s} className="row" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.45 }}>
              <motion.span className="sos-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.45, type: "spring", stiffness: 500, damping: 15 }}><Check size={14} strokeWidth={3.5} /></motion.span>
              {s}
            </motion.div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }} className="stack-10">
            <Tap className="btn light" onClick={() => toast(`Calling ${h.first}…`, "info")}><Phone size={18} /> Call {h.first}</Tap>
            <Tap className="btn outline-light" onClick={() => toast("Connecting to the Kinly nurse…", "info")}>Talk to a Kinly nurse</Tap>
            <button className="sos-cancel" onClick={() => { toast("Alert cancelled. Family notified.", "info"); back(); }}>False alarm? Cancel alert</button>
          </motion.div>
        </AnimatePresence>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
