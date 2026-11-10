"use client";

import { motion } from "motion/react";
import { BellRing, CalendarClock, ChevronRight, MapPin, MessageCircle, MessageSquareHeart, Repeat, Users, X } from "lucide-react";
import { useState } from "react";
import { PEOPLE, endTime, helper, svc } from "../data";
import { ServiceGlyph } from "../icons";
import { Avatar, Btn, Rating, Sheet, Tap, TopBar, Verified } from "../kit";
import { useStore } from "../store";

/** One upcoming visit: when, who, what's planned, and what you can change. */
export function VisitDetail() {
  const { visits, visitId, back, go, toast, openChat, cancelVisit, setDraft } = useStore();
  const v = visits.find((x) => x.id === visitId) ?? visits.find((x) => x.status === "upcoming");
  const [cancelling, setCancelling] = useState(false);
  if (!v) return <div className="screen"><TopBar title="Visit" /><p className="hint" style={{ textAlign: "center" }}>This visit is no longer booked.</p></div>;

  const h = helper(v.helperId);
  const s = svc(v.service);
  const tasks = s.tasks.filter((t) => t.on);

  const cancel = (all: boolean) => {
    setCancelling(false);
    cancelVisit(v.id);
    toast(all ? `Weekly visits with ${h.first} cancelled` : `Cancelled · ${h.first} and Kamala are notified`, "check");
    back();
  };

  return (
    <div className="screen">
      <TopBar title="Upcoming visit" sub={v.dateLabel} />
      <div className="scroll grow-1">
        <div className="pad stack-20" style={{ paddingTop: 6 }}>
          <motion.div className="ticket" style={{ marginTop: 0 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="ticket-top">
              <ServiceGlyph id={v.service} size={50} radius={16} />
              <div style={{ textAlign: "left" }}>
                <b>{s.name}</b>
                <span>{h.first} with Kamala{v.weekly ? " · every week" : ""}</span>
              </div>
            </div>
            <div className="ticket-grid">
              <div><span>Date</span><b>{v.dateLabel}</b></div>
              <div><span>Time</span><b>{v.time.replace(":00", "")}–{endTime(v.time, v.hours).replace(":00", "")}</b></div>
              <div><span>Door PIN</span><b className="mono">4 8 2 1</b></div>
            </div>
            <div className="ticket-cut" />
            <div className="ticket-notes">
              <div className="row"><span className="note-ic"><MapPin size={16} /></span>Kamala&apos;s home · {PEOPLE.mom.area}</div>
              {v.weekly && <div className="row"><span className="note-ic"><Repeat size={16} /></span>Repeats every week, same time</div>}
              <div className="row"><span className="note-ic"><BellRing size={16} /></span>Reminders 24 hrs and 1 hr before</div>
              <div className="row"><span className="note-ic"><Users size={16} /></span>Anita can see this visit too</div>
            </div>
          </motion.div>

          <div>
            <h3 className="label">Your helper</h3>
            <Tap className="done-list" style={{ width: "100%" }} onClick={() => { setDraft({ helperId: v.helperId, service: v.service }); go("helper"); }}>
              <div className="done-item" style={{ border: 0 }}>
                <Avatar src={h.photo} size={46} />
                <div className="grow" style={{ textAlign: "left" }}>
                  <div className="row" style={{ gap: 6 }}><b>{h.name}</b><Verified size={15} /></div>
                  <Rating value={h.rating} count={h.reviews} />
                </div>
                <ChevronRight size={18} className="muted" />
              </div>
            </Tap>
          </div>

          <div>
            <h3 className="label">The plan <span className="muted">· {tasks.length} things</span></h3>
            <div className="done-list">
              {tasks.map((t) => (
                <div key={t.t} className="done-item">
                  <span className="cbox" />
                  <span className="grow">{t.t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="row between" style={{ padding: "0 4px" }}>
            <span className="muted">Total{v.weekly ? " per visit" : ""}</span>
            <b style={{ fontSize: 18 }}>${v.total}</b>
          </div>
          <p className="hint" style={{ margin: "-12px 4px 0" }}>Charged after the visit. Free cancellation until 24 hrs before.</p>
        </div>
      </div>

      <div className="dock column">
        <Btn kind="primary" style={{ width: "100%" }} onClick={() => openChat(v.helperId)}><MessageCircle size={18} /> Message {h.first}</Btn>
        <div className="row" style={{ gap: 10, width: "100%" }}>
          <Btn kind="soft" style={{ flex: 1 }} onClick={() => toast("Reschedule options", "info")}><CalendarClock size={18} /> Reschedule</Btn>
          <Btn kind="soft" style={{ flex: 1, color: "var(--red)" }} onClick={() => setCancelling(true)}><X size={18} /> Cancel</Btn>
        </div>
      </div>

      <Sheet open={cancelling} onClose={() => setCancelling(false)} title="Cancel this visit?">
        <div className="stack-14">
          <div className="cancel-card">
            <Avatar src={h.photo} size={46} />
            <div className="grow">
              <b>{s.name} with {h.first}</b>
              <span>{v.dateLabel} · {v.time.replace(":00", "")}</span>
            </div>
          </div>
          <p className="cancel-note"><MessageSquareHeart size={14} style={{ verticalAlign: -2 }} /> Free cancellation: it&apos;s more than 24 hours away, so you won&apos;t be charged. We&apos;ll let {h.first} and Kamala know.</p>
          {v.weekly ? (
            <>
              <Btn kind="danger" style={{ width: "100%" }} onClick={() => cancel(false)}>Cancel just this visit</Btn>
              <Btn kind="soft" style={{ width: "100%" }} onClick={() => cancel(true)}>Cancel every week</Btn>
            </>
          ) : (
            <Btn kind="danger" style={{ width: "100%" }} onClick={() => cancel(false)}>Cancel visit</Btn>
          )}
          <Btn kind="ghost" style={{ width: "100%" }} onClick={() => setCancelling(false)}>Keep it</Btn>
        </div>
      </Sheet>
    </div>
  );
}
