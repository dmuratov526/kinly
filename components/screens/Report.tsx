"use client";

import { motion } from "motion/react";
import { Check, ChevronLeft, Clock, Footprints, Heart, MessageCirclePlus, Pill, Quote, Share, Star, Utensils } from "lucide-react";
import { useState } from "react";
import { PEOPLE, helper } from "../data";
import { Avatar, Btn, Tap } from "../kit";
import { useStore } from "../store";

const TAGS = ["Kind and patient", "Great updates", "On time", "Kamala loved her"];

export function Report() {
  const { back, toast, tab } = useStore();
  const h = helper("sunita");
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [asked, setAsked] = useState(false);

  return (
    <div className="screen">
      <div className="scroll grow-1">
        <div className="report-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/visit-clinic.jpg" alt="" />
          <div className="report-hero-fade" />
          <div className="map-top">
            <Tap className="icon-btn glass" onClick={back} aria-label="Back"><ChevronLeft size={22} /></Tap>
            <span />
            <Tap className="icon-btn glass" onClick={() => toast("Report shared with Anita", "check")} aria-label="Share"><Share size={18} /></Tap>
          </div>
          <div className="report-hero-text">
            <span className="eyebrow light">Visit report · Thu, Nov 12</span>
            <h1 className="display light">A <i>lovely</i> afternoon</h1>
            <div className="row" style={{ gap: 8 }}>
              <Avatar src={h.photo} size={28} ring="#fff" />
              <Avatar src={PEOPLE.mom.photo} size={28} ring="#fff" style={{ marginLeft: -12 }} />
              <span className="small" style={{ color: "rgba(255,255,255,.85)" }}>Sunita with Kamala · 2:01–5:04 PM</span>
            </div>
          </div>
        </div>

        <div className="pad stack-20" style={{ paddingTop: 18 }}>
          <div className="vitals">
            {[
              [Heart, "Mood", "Cheerful", "#E8577A"],
              [Utensils, "Ate", "Lunch + snack", "#E9A23B"],
              [Pill, "Meds", "3 PM taken", "#22A57A"],
              [Footprints, "Walked", "1,840 steps", "#3B82F6"],
            ].map(([Icon, k, v, c], i) => {
              const I = Icon as typeof Heart;
              return (
                <motion.div key={k as string} className="vital" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} style={{ ["--c" as string]: c as string }}>
                  <span><I size={17} /></span>
                  <em>{k as string}</em>
                  <b>{v as string}</b>
                </motion.div>
              );
            })}
          </div>

          <div className="quote">
            <Quote size={22} />
            <p>Kamala walked the whole park loop without her cane today and beat me at rummy twice. She mentioned her left knee feels stiff in the mornings. Might be worth asking Dr. Mehta on the 17th.</p>
            <div className="row" style={{ gap: 8 }}><Avatar src={h.photo} size={26} /><span className="small"><b>Sunita</b> · note for the family</span></div>
            <Tap className={`quote-btn ${asked ? "done" : ""}`} disabled={asked}
              onClick={() => { setAsked(true); toast("Added to Denise's list for Nov 17", "check"); }}>
              {asked
                ? <><Check size={16} strokeWidth={3} /> Added to questions for Nov 17</>
                : <><MessageCirclePlus size={17} /> Add to questions for the Nov 17 doctor visit</>}
            </Tap>
          </div>

          <div>
            <h3 className="label">Everything on the list <span className="ok-text">· 4 of 4</span></h3>
            <div className="done-list">
              {[["Chat over chai", "2:09 PM"], ["Short walk in Travers Park", "2:48 PM"], ["Play rummy", "3:14 PM"], ["Video-called you and Anita", "4:30 PM"]].map(([t, time], i) => (
                <motion.div key={t} className="done-item" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
                  <span className="cbox on"><Check size={12} strokeWidth={3.5} /></span>
                  <span className="grow">{t}</span>
                  <span className="small muted row" style={{ gap: 3 }}><Clock size={11} />{time}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="receipt">
            <div className="receipt-row"><span>3 hrs × $20</span><span>$60</span></div>
            <div className="receipt-row"><span>Kinly care fee (5%)</span><span>$3.00</span></div>
            <div className="receipt-total"><span>Charged to Visa ·· 4242</span><b>$63</b></div>
          </div>

          {/* rate */}
          <div className="rate-card">
            {!sent ? (
              <>
                <b>How was Sunita today?</b>
                <div className="rate-stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <motion.button key={n} whileTap={{ scale: 1.35 }} animate={n <= stars ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.3, delay: (n - 1) * 0.04 }} onClick={() => setStars(n)} aria-label={`${n} stars`} className={n <= stars ? "on" : ""}>
                      <Star size={34} fill={n <= stars ? "currentColor" : "none"} strokeWidth={1.6} />
                    </motion.button>
                  ))}
                </div>
                {stars > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="stack-12" style={{ overflow: "hidden" }}>
                    <div className="row center" style={{ flexWrap: "wrap", gap: 8 }}>
                      {TAGS.map((t) => (
                        <Tap key={t} className={`chip ${tags.includes(t) ? "on" : ""}`} onClick={() => setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))}>{t}</Tap>
                      ))}
                    </div>
                    <Btn kind="primary" style={{ width: "100%" }} onClick={() => { setSent(true); toast(stars >= 4 ? "Thanks! Sunita will love this" : "Our care team will reach out today", "heart"); }}>Send</Btn>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="stack-12" style={{ alignItems: "center" }}>
                <span style={{ fontSize: 34 }}>💛</span>
                <b>Sent to Sunita</b>
                <span className="small muted">Your next weekly visit is Thu, Nov 19 at 2 PM.</span>
              </motion.div>
            )}
          </div>

          <Btn kind="soft" style={{ width: "100%" }} onClick={() => tab("visits")}>Back to Visits</Btn>
          <div style={{ height: 30 }} />
        </div>
      </div>
    </div>
  );
}
