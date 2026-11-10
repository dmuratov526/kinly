"use client";

import { motion } from "motion/react";
import { Bell, Check, ChevronDown, ChevronRight, MapPin, Plus, Repeat, Search, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { useState } from "react";
import { HELPERS, MOMS_USUAL, PEOPLE, SERVICES, cardRate, day, helper, priceFor, svc } from "../data";
import { ServiceGlyph } from "../icons";
import { Avatar, CartButton, KinlySafe, Rating, Rise, Section, Sheet, Stagger, Tap, Verified } from "../kit";
import { useStore } from "../store";

const LIVE_COPY = [
  { tag: "On the way", title: "Sunita is 6 min away", sub: "Arriving at Mom's around 1:58 PM", pct: 12 },
  { tag: "Arrived", title: "Sunita just checked in", sub: "PIN verified at the door · 2:01 PM", pct: 30 },
  { tag: "Live now", title: "Sunita is with Mom", sub: "1 hr 12 min in · 2 of 4 tasks done", pct: 58 },
  { tag: "Finished", title: "Visit report is ready", sub: "Mom had a lovely afternoon", pct: 100 },
];

export function Home() {
  const { go, live, setExplore, setDraft, toast, showSafe } = useStore();
  const [careSheet, setCareSheet] = useState(false);
  const L = LIVE_COPY[live];
  const sunita = helper("sunita");

  const openService = (id: (typeof SERVICES)[number]["id"]) => {
    setExplore({ service: id, when: null, focus: false });
    go("explore");
  };
  const openHelper = (id: string, service?: (typeof SERVICES)[number]["id"]) => {
    setDraft({ helperId: id, ...(service ? { service, tasks: svc(service).tasks } : null) });
    go("helper");
  };

  return (
    <div className="screen scroll home">
      <div className="home-glow" />
      <Stagger className="pad stack-20">
        {/* greeting */}
        <Rise className="row between" style={{ paddingTop: 6 }}>
          <div className="row" style={{ gap: 12 }}>
            <Avatar src={PEOPLE.rohan.photo} size={44} />
            <div>
              <div className="eyebrow">Thursday, Nov 12</div>
              <h1 className="hello">Good afternoon, <i>Rohan</i></h1>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <CartButton />
            <Tap className="icon-btn raised" onClick={() => toast("Mom took her 1 PM meds", "check")} aria-label="Notifications">
              <Bell size={20} />
              <span className="ping" />
            </Tap>
          </div>
        </Rise>

        {/* who we're caring for */}
        <Rise>
          <Tap className="care-pill" onClick={() => setCareSheet(true)}>
            <Avatar src={PEOPLE.mom.photo} size={30} />
            <span>Caring for <b>Mom</b></span>
            <ChevronDown size={16} />
          </Tap>
        </Rise>

        {/* live / next visit hero */}
        <Rise>
          <Tap className="hero-card" onClick={() => go(live === 3 ? "report" : "live")} style={{ width: "100%" }}>
            <div className="hero-aurora" />
            <div className="row between" style={{ position: "relative" }}>
              <span className={`live-tag ${live === 3 ? "done" : ""}`}>
                {live < 3 && <span className="pulse-dot" />}
                {L.tag}
              </span>
              <span className="hero-time">Companionship · 2–5 PM</span>
            </div>
            <div className="row" style={{ gap: 14, marginTop: 18, position: "relative" }}>
              <div className="duo">
                <Avatar src={sunita.photo} size={58} ring="rgba(255,255,255,.9)" />
                <Avatar src={PEOPLE.mom.photo} size={58} ring="rgba(255,255,255,.9)" style={{ marginLeft: -16 }} />
              </div>
              <div style={{ textAlign: "left", minWidth: 0 }}>
                <div className="hero-title">{L.title}</div>
                <div className="hero-sub">{L.sub}</div>
              </div>
            </div>
            <div className="hero-progress">
              <motion.div initial={{ width: 0 }} animate={{ width: `${L.pct}%` }} transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }} />
            </div>
            <div className="row between hero-foot">
              <span>{live === 3 ? "Photos, notes and tasks inside" : "Live map, photos and chat"}</span>
              <span className="row" style={{ gap: 4, fontWeight: 700 }}>{live === 3 ? "Open report" : "Track live"} <ChevronRight size={16} /></span>
            </div>
          </Tap>
        </Rise>

        {/* search */}
        <Rise>
          <Tap className="searchbar" onClick={() => { setExplore({ service: null, when: null, focus: true }); go("explore"); }}>
            <Search size={20} />
            <span>Find help for Mom…</span>
            <span className="search-when">Any time</span>
          </Tap>
        </Rise>

        {/* one-tap reorder */}
        <Rise><MomsUsual /></Rise>

        {/* categories */}
        <Rise>
          <div className="cat-grid">
            {SERVICES.map((s) => (
              <Tap key={s.id} className="cat" onClick={() => openService(s.id)} style={{ ["--hue" as string]: s.hue, ["--tint" as string]: s.tint }}>
                <ServiceGlyph id={s.id} size={40} radius={13} />
                <b>{s.name}</b>
                <span>{s.unit === "visit" ? `$${s.from}/visit` : `from $${s.from}/hr`}</span>
              </Tap>
            ))}
          </div>
        </Rise>

        {/* smart reminder */}
        <Rise>
          <div className="reminder">
            <div className="reminder-icon"><Sparkles size={18} /></div>
            <div className="grow">
              <b>No home help in 13 days</b>
              <p>Meera is free today at 4 PM, 0.8 mi from Mom.</p>
              <div className="row" style={{ gap: 8, marginTop: 10 }}>
                <Tap className="mini-btn dark" onClick={() => openHelper("meera", "home")}>Book Meera again</Tap>
                <Tap className="mini-btn" onClick={() => toast("We'll remind you next week", "info")}>Later</Tap>
              </div>
            </div>
            <Avatar src={helper("meera").photo} size={48} />
          </div>
        </Rise>
      </Stagger>

      {/* book again */}
      <Section title="Book again" action="See all" onAction={() => go("visits")} style={{ marginTop: 26 }}>
        <div className="hscroll">
          {(["sunita", "meera", "denise", "priya"] as const).map((id, i) => {
            const h = helper(id);
            const s = svc(h.services[0]);
            return (
              <motion.div key={id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06, type: "spring", stiffness: 260, damping: 28 }}>
                <Tap className="again" onClick={() => openHelper(id, id === "denise" ? "escort" : id === "meera" ? "home" : id === "priya" ? "tech" : "companion")}>
                  <Avatar src={h.photo} size={56} />
                  <b>{h.first}</b>
                  <span>{id === "denise" ? "Doctor visits" : id === "meera" ? "Home help" : id === "priya" ? "Tech help" : s.name}</span>
                  <span className="again-plus"><Plus size={14} strokeWidth={3} /></span>
                </Tap>
              </motion.div>
            );
          })}
          <Tap className="again ghost" onClick={() => go("explore")}>
            <span className="again-add"><UserPlus size={22} /></span>
            <b>Someone new</b>
            <span>Browse 140+</span>
          </Tap>
        </div>
      </Section>

      {/* top rated */}
      <Section title="Loved by families near Mom" action="Map" onAction={() => toast("Map view coming soon", "info")} style={{ marginTop: 26 }}>
        <div className="hscroll snap">
          {HELPERS.slice(0, 5).map((h) => (
            <Tap key={h.id} className="feature" onClick={() => openHelper(h.id)}>
              <div className="feature-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.photo} alt="" />
                <span className={`avail ${h.today ? "now" : ""}`}>{h.today ? "● " : ""}{h.next}</span>
              </div>
              <div className="feature-body">
                <div className="row between">
                  <b className="row" style={{ gap: 5 }}>{h.first} <Verified size={15} /></b>
                  <Rating value={h.rating} />
                </div>
                <span className="muted small">{h.role}</span>
                <span style={{ marginTop: 6 }}><KinlySafe /></span>
                <div className="row between" style={{ marginTop: 8 }}>
                  <span className="small row muted" style={{ gap: 3 }}><MapPin size={12} />{h.miles} mi</span>
                  <span className="price-tag">${cardRate(h).rate}<small>/{cardRate(h).unit}</small></span>
                </div>
              </div>
            </Tap>
          ))}
        </div>
      </Section>

      {/* mom's month */}
      <div className="pad" style={{ marginTop: 26 }}>
        <div className="month">
          <div className="row between">
            <div>
              <div className="eyebrow">Mom&apos;s November</div>
              <b style={{ fontSize: 17 }}>She&apos;s had a good month</b>
            </div>
            <span className="mood">😊</span>
          </div>
          <div className="month-stats">
            <div><b>6</b><span>visits</span></div>
            <div><b>15h</b><span>of company</span></div>
            <div><b>100%</b><span>meds on time</span></div>
          </div>
          <div className="week-bars">
            {[40, 0, 70, 30, 100, 0, 55].map((v, i) => (
              <div key={i} className="wb">
                <motion.span initial={{ height: 0 }} animate={{ height: `${Math.max(v, 6)}%` }} transition={{ delay: 0.4 + i * 0.05, type: "spring", stiffness: 200, damping: 22 }} className={v ? "" : "empty"} />
                <em>{"MTWTFSS"[i]}</em>
              </div>
            ))}
          </div>
        </div>

        <Tap className="trust" onClick={showSafe}>
          <ShieldCheck size={22} />
          <div>
            <b>Every helper is Kinly Safe</b>
            <span>Background check, ID verification, CPR training and insurance on every visit.</span>
          </div>
          <ChevronRight size={18} style={{ alignSelf: "center", flexShrink: 0 }} />
        </Tap>
        <div style={{ height: 110 }} />
      </div>

      <Sheet open={careSheet} onClose={() => setCareSheet(false)} title="Who are you caring for?">
        <div className="stack-10">
          <Tap className="care-opt on" onClick={() => setCareSheet(false)}>
            <Avatar src={PEOPLE.mom.photo} size={48} />
            <div className="grow" style={{ textAlign: "left" }}><b>Mom · Kamala, 78</b><span>Jackson Heights, Queens</span></div>
            <span className="radio on" />
          </Tap>
        </div>
      </Sheet>
    </div>
  );
}

/** "Mom's usual": the weekly check-in and her medicine refills, rebooked together in one tap. */
function MomsUsual() {
  const { visits, addVisit, toast, go } = useStore();
  const items = MOMS_USUAL.map((u) => ({ ...u, h: helper(u.helperId), s: svc(u.service), total: priceFor(helper(u.helperId), svc(u.service), u.hours).total }));
  const total = items.reduce((a, x) => a + x.total, 0);
  const booked = visits.some((v) => v.id === "usual-0");

  const book = () => {
    items.forEach((x, i) => addVisit({
      id: `usual-${i}`, helperId: x.helperId, service: x.service, dayKey: x.dayKey, dateLabel: day(x.dayKey).label,
      time: x.time, hours: x.hours, status: "upcoming", weekly: true, total: x.total,
    }));
    toast(`Mom's usual is booked for ${day(MOMS_USUAL[0].dayKey).label}`, "check");
  };

  return (
    <div className={`usual ${booked ? "done" : ""}`}>
      <div className="row between">
        <div>
          <div className="eyebrow">One tap</div>
          <b className="usual-title">Mom&apos;s usual</b>
        </div>
        <span className="usual-when"><Repeat size={12} /> Every {day(MOMS_USUAL[0].dayKey).dow}</span>
      </div>
      <div className="usual-items">
        {items.map((x) => (
          <div key={x.what} className="usual-item">
            <ServiceGlyph id={x.service} size={34} radius={11} />
            <div className="grow">
              <b>{x.what}</b>
              <span>{x.h.first} · {x.time.replace(":00", "")}</span>
            </div>
            <Avatar src={x.h.photo} size={30} />
          </div>
        ))}
      </div>
      {booked ? (
        <Tap className="usual-btn done" onClick={() => go("visits")}>
          <Check size={17} strokeWidth={3} /> Booked for {day(MOMS_USUAL[0].dayKey).label} · see Visits
        </Tap>
      ) : (
        <Tap className="usual-btn" onClick={book}>Book both · ${total}</Tap>
      )}
    </div>
  );
}
