"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Award, BadgeCheck, Car, ChevronLeft, Clock, Heart, Languages, MessageCircle, Pause, Play, Repeat, Share, ShieldCheck, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DAYS, REVIEWS, TIMES, helper, isFree, rateFor, svc } from "../data";
import { ServiceGlyph } from "../icons";
import { Avatar, Btn, KinlySafe, Rating, Tap, Verified } from "../kit";
import { useStore } from "../store";

export function HelperProfile() {
  const { draft, setDraft, go, back, favs, toggleFav, toast, showSafe, openChat } = useStore();
  const h = helper(draft.helperId);
  const s = svc(draft.service);
  const scroller = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scroller });
  const headerBg = useTransform(scrollY, [120, 200], [0, 1]);
  const heroScale = useTransform(scrollY, [-100, 0], [1.25, 1]);
  const heroY = useTransform(scrollY, [0, 300], [0, 90]);

  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => (x >= 30 ? 0 : x + 1)), 1000);
    return () => clearInterval(id);
  }, [playing]);

  const fav = favs.includes(h.id);
  const lines = h.bio.split(/(?<=[.!?:])\s+/);
  const caption = lines[Math.min(lines.length - 1, Math.floor((t / 30) * lines.length))];

  return (
    <div className="screen">
      {/* sticky header that fades in on scroll */}
      <motion.div className="float-head" style={{ ["--o" as string]: headerBg }}>
        <motion.div className="float-head-bg" style={{ opacity: headerBg }} />
        <Tap className="icon-btn glass" onClick={back} aria-label="Back"><ChevronLeft size={22} /></Tap>
        <motion.b style={{ opacity: headerBg }} className="float-head-title">{h.name}</motion.b>
        <div className="row" style={{ gap: 8 }}>
          <Tap className="icon-btn glass" onClick={() => toast("Share link copied", "check")} aria-label="Share"><Share size={18} /></Tap>
          <Tap className={`icon-btn glass ${fav ? "fav-on" : ""}`} onClick={() => toggleFav(h.id)} aria-label="Save"><Heart size={18} fill={fav ? "currentColor" : "none"} /></Tap>
        </div>
      </motion.div>

      <div className="scroll grow-1" ref={scroller}>
        <div className="profile-hero">
          <motion.div className="profile-hero-bg" style={{ scale: heroScale, y: heroY, backgroundImage: `url(${h.photo})` }} />
          <div className="profile-hero-fade" />
          <motion.div className="profile-avatar" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={h.photo} alt="" />
            <span className="match-ring">{h.match}%<small>match</small></span>
          </motion.div>
        </div>

        <div className="pad profile-body">
          <div style={{ textAlign: "center" }}>
            <h1 className="profile-name">{h.name} <Verified size={22} /></h1>
            <div className="muted">{h.role} · {h.years} years · {h.miles} mi from Kamala</div>
            <div className="row center" style={{ gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              <KinlySafe big />
              {h.badges.map((b) => <span key={b} className={`tag ${b === "Top Helper" ? "gold" : ""}`}>{b}</span>)}
            </div>
          </div>

          <div className="stat-row">
            <div><b><Star size={15} fill="currentColor" strokeWidth={0} /> {h.rating}</b><span>{h.reviews} reviews</span></div>
            <div><b>{h.visits}</b><span>visits</span></div>
            <div><b>{h.onTime}%</b><span>on time</span></div>
            <div><b>{h.repeat}%</b><span>rebook</span></div>
          </div>

          {/* intro video */}
          <Tap className="video" onClick={() => setPlaying(!playing)}>
            <motion.div className="video-bg" style={{ backgroundImage: `url(${h.photo})` }} animate={playing ? { scale: [1.05, 1.16], x: [0, -8] } : { scale: 1.05, x: 0 }} transition={{ duration: playing ? 30 : 0.4, ease: "linear" }} />
            <div className="video-shade" />
            <span className="video-play">{playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" style={{ marginLeft: 3 }} />}</span>
            <div className="video-meta">
              <AnimatePresence mode="wait">
                <motion.b key={playing ? caption : "title"} className="video-cap" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {playing ? caption : <>&ldquo;Hi, I&apos;m {h.first}&rdquo;</>}
                </motion.b>
              </AnimatePresence>
              <span>Video intro · {playing ? `0:${String(t).padStart(2, "0")} / 0:30` : "30 sec · tap to watch"}</span>
              <div className="video-bar"><motion.i animate={{ width: `${(t / 30) * 100}%` }} transition={{ ease: "linear", duration: 1 }} /></div>
            </div>
            <span className="video-verified"><BadgeCheck size={14} /> Face matched to ID</span>
          </Tap>
          <p className="hint" style={{ marginTop: -12 }}>Recorded on Kinly and checked against {h.first}&apos;s photo ID, so the person at the door is the person in the video.</p>

          <div className="block">
            <h3>About {h.first}</h3>
            <p className="about">{h.bio}</p>
          </div>

          <div className="block">
            <h3>Good at</h3>
            <div className="chip-wrap">{h.skills.map((k) => <span key={k} className="tag">{k}</span>)}</div>
          </div>

          <div className="facts">
            <div><Languages size={18} /><span>Speaks <b>{h.langs.join(", ")}</b></span></div>
            <Tap className="fact-tap" onClick={showSafe}><ShieldCheck size={18} /><span className="grow"><b>Kinly Safe</b> · background check, ID, CPR, insurance</span><span className="fact-more">What&apos;s this?</span></Tap>
            {h.cpr && <div><Award size={18} /><span><b>CPR &amp; First Aid</b> certified, 2026</span></div>}
            {h.badges.includes("Has a car") && <div><Car size={18} /><span>Drives a <b>Honda CR-V</b>, room for a walker</span></div>}
            <div><Repeat size={18} /><span><b>{h.repeat}%</b> of families book {h.first} again</span></div>
          </div>

          <div className="block">
            <h3>Helps with</h3>
            <div className="svc-list">
              {h.services.map((id) => {
                const x = svc(id);
                const on = id === draft.service;
                return (
                  <Tap key={id} className={`svc-row ${on ? "on" : ""}`} onClick={() => setDraft({ service: id, tasks: x.tasks })} style={{ ["--hue" as string]: x.hue }}>
                    <ServiceGlyph id={id} size={38} radius={12} />
                    <span className="grow">{x.name}</span>
                    <b>${rateFor(h, x)}<small>/{x.unit}</small></b>
                  </Tap>
                );
              })}
            </div>
          </div>

          <div className="block">
            <div className="row between"><h3>This week</h3><span className="small muted"><Clock size={12} style={{ verticalAlign: -2 }} /> Replies in ~5 min</span></div>
            <div className="avail-grid">
              {DAYS.slice(0, 7).map((d) => {
                const free = TIMES.filter((t) => isFree(h, d.key, t)).length;
                return (
                  <div key={d.key} className={`avail-day ${free ? "" : "off"}`}>
                    <span>{d.key === "today" ? "Tdy" : d.dow}</span>
                    <div className="avail-dots">
                      {[0, 1, 2, 3].map((i) => <i key={i} className={i < Math.ceil(free / 2) ? "on" : ""} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Tap className="chat-row" onClick={() => openChat(h.id)}>
            <MessageCircle size={20} />
            <span className="grow">Ask {h.first} a question first</span>
            <span className="muted small">Chat · free</span>
          </Tap>

          <div className="block">
            <div className="row between">
              <h3>What families say</h3>
              <Rating value={h.rating} count={h.reviews} size={14} />
            </div>
            <div className="reviews">
              {REVIEWS.map((r) => (
                <div key={r.who} className="review">
                  <div className="row" style={{ gap: 10 }}>
                    <Avatar src={r.photo} size={34} />
                    <div className="grow">
                      <b>{r.who}</b>
                      <span className="muted small"> · {r.rel} · {r.when}</span>
                      <div className="stars-sm">{"★★★★★".slice(0, r.stars)}</div>
                    </div>
                  </div>
                  <p>{r.text.replaceAll("Sunita", h.first)}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 120 }} />
        </div>
      </div>

      <div className="dock">
        <div>
          <div className="small muted">{s.name}</div>
          <b className="dock-price">${rateFor(h, s)}<small>/{s.unit}</small></b>
        </div>
        <Btn kind="brand" onClick={() => go("book")} style={{ flex: 1 }}>Book {h.first}</Btn>
      </div>
    </div>
  );
}

