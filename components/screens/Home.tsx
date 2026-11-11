"use client";

import { motion } from "motion/react";
import { Bell, Check, ChevronDown, ChevronRight, Globe, MapPin, MessageCircle, Phone, Plus, Repeat, Search, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { useState } from "react";
import { HELPERS, MOMS_USUAL, PEOPLE, SERVICES, cardRate, day, endTime, helper, priceFor, svc, type ServiceId } from "../data";
import { ServiceGlyph } from "../icons";
import { Avatar, CartButton, ConfirmBooking, KinlySafe, Rating, Rise, Section, Sheet, Stagger, Tap, Verified } from "../kit";
import { useStore } from "../store";

/** who you've booked before, and for what */
const AGAIN = { sunita: "companion", maria: "home", denise: "escort", tom: "tech", marcus: "errands" } as const;

const LIVE_COPY = [
  { tag: "On the way", title: "{name} is 6 min away", sub: "Arriving at Kamala's around 1:58 PM", pct: 12 },
  { tag: "Arrived", title: "{name} just checked in", sub: "PIN verified at the door · 2:01 PM", pct: 30 },
  { tag: "Live now", title: "{name} is with Kamala", sub: "1 hr 12 min in · 2 of 4 tasks done", pct: 58 },
  { tag: "Finished", title: "Visit report is ready", sub: "Kamala had a lovely afternoon", pct: 100 },
];

export function Home() {
  const { go, live, setExplore, setDraft, toast, showSafe, showLang, openChat, visits } = useStore();
  const liveVisit = visits.find((v) => v.status === "live");
  const [careSheet, setCareSheet] = useState(false);
  const [people, setPeople] = useState<{ name: string; photo?: string }[]>([{ name: "Kamala", photo: PEOPLE.mom.photo }]);
  const [who, setWho] = useState(0);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const addPerson = () => {
    const name = newName.trim();
    if (!name) return;
    setPeople((ps) => [...ps, { name }]);
    setWho(people.length);
    setNewName("");
    setAdding(false);
    setCareSheet(false);
    toast(`${name} added. You can book help for them now`, "check");
  };
  const sunita = helper(liveVisit?.helperId ?? "sunita");
  const L = { ...LIVE_COPY[live], title: LIVE_COPY[live].title.replace("{name}", sunita.first) };

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
        <Rise className="row between home-top" style={{ paddingTop: 6 }}>
          <div className="row" style={{ gap: 10 }}>
            <Avatar src={PEOPLE.rohan.photo} size={40} />
            <div>
              <div className="eyebrow">Thursday, Nov 12</div>
              <h1 className="hello">Good afternoon,<br /><i>Rohan</i></h1>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <Tap className="icon-btn raised" onClick={() => openChat("sunita")} aria-label="Messages">
              <MessageCircle size={20} />
              <span className="ping" />
            </Tap>
            <CartButton />
            <Tap className="icon-btn raised" onClick={() => toast("Kamala took her 1 PM meds", "check")} aria-label="Notifications">
              <Bell size={20} />
              <span className="ping" />
            </Tap>
          </div>
        </Rise>

        {/* who we're caring for */}
        <Rise className="row between">
          <Tap className="care-pill" onClick={() => setCareSheet(true)}>
            <PersonAvatar p={people[who]} size={30} />
            <span>Caring for <b>{people[who].name}</b></span>
            <ChevronDown size={16} />
          </Tap>
          <Tap className="lang-btn" onClick={showLang} aria-label="Language"><Globe size={16} /> EN</Tap>
        </Rise>

        {/* visits Kamala asked for from her own app */}
        <Requests />

        {/* the visit happening today: appears once Rohan books one */}
        {liveVisit && <Rise>
          <Tap className="hero-card" onClick={() => go(live === 3 ? "report" : "live")} style={{ width: "100%" }}>
            <div className="hero-aurora" />
            <div className="row between" style={{ position: "relative" }}>
              <span className={`live-tag ${live === 3 ? "done" : ""}`}>
                {live < 3 && <span className="pulse-dot" />}
                {L.tag}
              </span>
              <span className="hero-time">{svc(liveVisit.service).name} · {liveVisit.time.replace(":00", "").replace(" PM", "").replace(" AM", "")}–{endTime(liveVisit.time, liveVisit.hours).replace(":00", "")}</span>
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
        </Rise>}

        {/* search */}
        <Rise>
          <Tap className="searchbar" onClick={() => { setExplore({ service: null, when: null, focus: true }); go("explore"); }}>
            <Search size={20} />
            <span>Find help for Kamala…</span>
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

        {/* recommendations that keep the rhythm of visits */}
        <Rise><Recs openHelper={openHelper} openService={openService} /></Rise>
      </Stagger>

      {/* book again */}
      <Section title="Book again" action="See all" onAction={() => go("visits")} style={{ marginTop: 26 }}>
        <div className="hscroll">
          {(["sunita", "maria", "denise", "tom", "marcus"] as const).map((id, i) => {
            const h = helper(id);
            return (
              <motion.div key={id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06, type: "spring", stiffness: 260, damping: 28 }}>
                <Tap className="again" onClick={() => openHelper(id, AGAIN[id])}>
                  <Avatar src={h.photo} size={56} />
                  <b>{h.first}</b>
                  <span>{svc(AGAIN[id]).name}</span>
                  <span className="again-plus"><Plus size={14} strokeWidth={3} /></span>
                </Tap>
              </motion.div>
            );
          })}
          <Tap className="again ghost" onClick={() => go("explore")}>
            <span className="again-add"><UserPlus size={22} /></span>
            <b>New helper</b>
            <span>Browse all</span>
          </Tap>
        </div>
      </Section>

      {/* top rated */}
      <Section title="Loved by families near Kamala" action="Map" onAction={() => toast("Map view coming soon", "info")} style={{ marginTop: 26 }}>
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
              <div className="eyebrow">Kamala&apos;s November</div>
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

      <Sheet open={careSheet} onClose={() => { setCareSheet(false); setAdding(false); }} title="Who are you caring for?">
        <div className="stack-10">
          {people.map((x, i) => (
            <Tap key={x.name + i} className={`care-opt ${who === i ? "on" : ""}`} onClick={() => { setWho(i); setCareSheet(false); }}>
              <PersonAvatar p={x} size={48} />
              <div className="grow" style={{ textAlign: "left" }}><b>{x.name}</b></div>
              <span className={`radio ${who === i ? "on" : ""}`} />
            </Tap>
          ))}
          {adding ? (
            <div className="care-opt care-new">
              <span className="care-add"><UserPlus size={22} /></span>
              <input autoFocus placeholder="Name, e.g. Dad" value={newName} onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addPerson(); }} />
              <Tap className="mini-btn dark" onClick={addPerson} disabled={!newName.trim()}>Add</Tap>
            </div>
          ) : (
            <Tap className="care-opt" onClick={() => setAdding(true)}>
              <span className="care-add"><Plus size={22} /></span>
              <div className="grow" style={{ textAlign: "left" }}><b>Add someone</b></div>
            </Tap>
          )}
        </div>
      </Sheet>
    </div>
  );
}

/** "Kamala's usual": the weekly check-in and her medicine refills, rebooked together after one confirmation. */
function MomsUsual() {
  const { visits, addVisit, toast, go } = useStore();
  const items = MOMS_USUAL.map((u) => ({ ...u, h: helper(u.helperId), s: svc(u.service), total: priceFor(helper(u.helperId), svc(u.service), u.hours).total }));
  const total = items.reduce((a, x) => a + x.total, 0);
  const booked = visits.some((v) => v.id === "usual-0");
  const [confirming, setConfirming] = useState(false);

  const book = () => {
    items.forEach((x, i) => addVisit({
      id: `usual-${i}`, helperId: x.helperId, service: x.service, dayKey: x.dayKey, dateLabel: day(x.dayKey).label,
      time: x.time, hours: x.hours, status: "upcoming", weekly: true, total: x.total,
    }));
    toast(`Kamala's usual is booked for ${day(MOMS_USUAL[0].dayKey).label}`, "check");
  };

  return (
    <div className={`usual ${booked ? "done" : ""}`}>
      <div className="row between">
        <div>
          <div className="eyebrow">Quick rebook</div>
          <b className="usual-title">Kamala&apos;s usual</b>
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
        <Tap className="usual-btn" onClick={() => setConfirming(true)}>Book both · ${total}</Tap>
      )}
      <ConfirmBooking open={confirming} onClose={() => setConfirming(false)} title="Book Kamala's usual?" onConfirm={book}
        rows={items.map((x) => ({ photo: x.h.photo, title: `${x.what} with ${x.h.first}`, sub: `${day(x.dayKey).label} · ${x.time.replace(":00", "")} · every week`, price: x.total }))} />
    </div>
  );
}

function PersonAvatar({ p, size }: { p: { name: string; photo?: string }; size: number }) {
  if (p.photo) return <Avatar src={p.photo} size={size} />;
  return <span className="initial-avatar" style={{ width: size, height: size, fontSize: size * 0.42 }}>{p.name[0]?.toUpperCase()}</span>;
}

/** Recommendations built from her visit history, so the family keeps a steady rhythm. */
function Recs({ openHelper, openService }: { openHelper: (id: string, s?: ServiceId) => void; openService: (s: ServiceId) => void }) {
  const { visits, addVisit, toast } = useStore();
  const nextWeek = visits.some((v) => v.id === "rec-nov26");
  const [confirming, setConfirming] = useState(false);
  const nov26 = priceFor(helper("sunita"), svc("companion"), 3).total;
  const cards = [
    {
      key: "weekly", photo: helper("sunita").photo, tag: "Every Thursday",
      title: "Keep Thursdays with Sunita", sub: "Nov 19 is booked. Nov 26 is still open.",
      cta: nextWeek ? "Booked ✓" : "Book Nov 26", done: nextWeek,
      go: () => { if (!nextWeek) setConfirming(true); },
    },
    { key: "house", photo: helper("maria").photo, tag: "13 days ago", title: "Time for house help", sub: "Maria is free today at 4 PM, 0.8 mi away.", cta: "Book Maria", go: () => openHelper("maria", "home") },
    { key: "doctor", photo: helper("denise").photo, tag: "Due in 2 weeks", title: "Cardiology follow-up", sub: "Last checkup Oct 27. The doctor asked to recheck BP in 6 weeks.", cta: "Find a ride", go: () => openService("escort") },
    { key: "tech", photo: helper("tom").photo, tag: "Oct 24", title: "WhatsApp refresher?", sub: "Tom set it up last month. A short check-in keeps it easy.", cta: "Book Tom", go: () => openHelper("tom", "tech") },
  ];
  return (
    <div className="recs">
      <div className="recs-head">
        <span className="reminder-icon"><Sparkles size={16} /></span>
        <div><b>Keep the rhythm</b><span>Based on Kamala&apos;s visits</span></div>
      </div>
      <div className="hscroll recs-row">
        {cards.map((c) => (
          <div key={c.key} className="rec">
            <div className="row between">
              <span className="rec-tag">{c.tag}</span>
              <Avatar src={c.photo} size={34} />
            </div>
            <b>{c.title}</b>
            <p>{c.sub}</p>
            <Tap className={`mini-btn ${c.done ? "" : "dark"}`} onClick={c.go}>{c.cta}</Tap>
          </div>
        ))}
      </div>
      <ConfirmBooking open={confirming} onClose={() => setConfirming(false)}
        rows={[{ photo: helper("sunita").photo, title: "Companionship with Sunita", sub: "Thu, Nov 26 · 2–5 PM", price: nov26 }]}
        onConfirm={() => {
          addVisit({ id: "rec-nov26", helperId: "sunita", service: "companion", dayKey: "thu3", dateLabel: "Thu, Nov 26", time: "2:00 PM", hours: 3, status: "upcoming", weekly: true, total: nov26 });
          toast("Thu, Nov 26 with Sunita is booked", "check");
        }} />
    </div>
  );
}

/** Kamala can ask for a visit from her own app; the family approves and pays. */
function Requests() {
  const { requests, resolveRequest, addVisit, toast } = useStore();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  if (!requests.length) return null;
  const WHEN: Record<string, { dayKey: string; time: string }> = {
    Today: { dayKey: "today", time: "4:00 PM" }, Tomorrow: { dayKey: "fri", time: "11:00 AM" }, "This week": { dayKey: "mon", time: "10:00 AM" },
  };
  const plan = (r: (typeof requests)[number]) => {
    const h = helper(r.helperId);
    const s = svc(r.service);
    const w = WHEN[r.when] ?? WHEN.Tomorrow;
    const hours = s.unit === "visit" ? 1 : 2;
    return { h, s, w, hours, total: priceFor(h, s, hours).total };
  };
  const pending = requests.find((r) => r.id === confirmId);
  const pp = pending ? plan(pending) : null;
  return (
    <>
      {requests.map((r) => {
        const { h, s, total } = plan(r);
        return (
          <motion.div key={r.id} className="request" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="row" style={{ gap: 12 }}>
              <Avatar src={PEOPLE.mom.photo} size={44} />
              <div className="grow">
                <span className="eyebrow" style={{ color: "#C2410C" }}>Request from Kamala</span>
                <b>{r.what} · {r.when.toLowerCase()}</b>
                <span className="small muted">Suggested: {h.first}, {s.name.toLowerCase()} · ${total}</span>
              </div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <Tap className="mini-btn dark" style={{ flex: 1, justifyContent: "center" }} onClick={() => setConfirmId(r.id)}><Check size={14} strokeWidth={3} /> Approve and book</Tap>
              <Tap className="mini-btn" onClick={() => toast("Calling Kamala…", "info")}><Phone size={14} /> Call her</Tap>
            </div>
          </motion.div>
        );
      })}
      <ConfirmBooking open={!!pending} onClose={() => setConfirmId(null)} title="Approve Kamala's request?"
        rows={pending && pp ? [{ photo: pp.h.photo, title: `${pp.s.name} with ${pp.h.first}`, sub: `${day(pp.w.dayKey).label} · ${pp.w.time.replace(":00", "")} · ${pending.what.toLowerCase()}`, price: pp.total }] : []}
        onConfirm={() => {
          if (!pending || !pp) return;
          addVisit({ id: `req-${pending.id}`, helperId: pp.h.id, service: pp.s.id, dayKey: pp.w.dayKey, dateLabel: day(pp.w.dayKey).label, time: pp.w.time, hours: pp.hours, status: "upcoming", total: pp.total });
          resolveRequest(pending.id);
          toast(`Booked. Kamala is told ${pp.h.first} is coming`, "check");
        }} />
    </>
  );
}
