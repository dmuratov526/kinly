"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, CreditCard, Minus, Plus, Repeat, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { DAYS, FEE, TIMES, cartItem, day, endTime, helper, isFree, priceFor, rateFor, svc } from "../data";
import { ServiceGlyph } from "../icons";
import { Avatar, Rating, ServiceScope, Tap, TopBar, Verified, spring } from "../kit";
import { useStore } from "../store";

export function Book() {
  const { draft, setDraft, go, tab, addVisit, addToCart, setLastBooking, cart, toast } = useStore();
  const h = helper(draft.helperId);
  const s = svc(draft.service);
  const [adding, setAdding] = useState("");

  const dayFree = (k: string) => TIMES.some((t) => isFree(h, k, t));
  const canBook = isFree(h, draft.dayKey, draft.time);
  const p = priceFor(h, s, draft.hours);
  const yours = p.total;

  const item = () => cartItem(h.id, s.id, draft.dayKey, draft.time, s.unit === "visit" ? 1 : draft.hours, draft.weekly);
  const toCart = () => {
    addToCart(item());
    toast(`Added to cart · ${cart.length + 1} visit${cart.length ? "s" : ""}`, "check");
    tab("cart");
  };

  const confirm = () => {
    setLastBooking([item()]);
    addVisit({
      id: `v-${Date.now()}`, helperId: h.id, service: s.id, dayKey: draft.dayKey, dateLabel: day(draft.dayKey).label,
      time: draft.time, hours: draft.hours, status: "upcoming", weekly: draft.weekly, total: p.total,
    });
    go("confirmed");
  };

  return (
    <div className="screen">
      <TopBar title={`Book ${h.first}`} sub={`${s.name} for Kamala`} />
      <div className="scroll grow-1">
        <div className="pad stack-22" style={{ paddingTop: 8 }}>
          <div className="mini-helper">
            <Avatar src={h.photo} size={52} />
            <div className="grow">
              <b className="row" style={{ gap: 5 }}>{h.name} <Verified /></b>
              <div className="row" style={{ gap: 8 }}><Rating value={h.rating} count={h.reviews} /><span className="small muted">{h.langs[0]} speaker</span></div>
            </div>
            <ServiceGlyph id={s.id} size={40} radius={13} />
          </div>

          {/* date */}
          <div>
            <h3 className="label">Day</h3>
            <div className="day-strip">
              {DAYS.map((d) => {
                const free = dayFree(d.key);
                const on = draft.dayKey === d.key;
                return (
                  <Tap key={d.key} disabled={!free} className={`day-pill ${on ? "on" : ""} ${free ? "" : "off"}`} onClick={() => setDraft({ dayKey: d.key })}>
                    <span>{d.key === "today" ? "Today" : d.dow}</span>
                    <b>{d.num}</b>
                    {!free && <small>off</small>}
                    {on && <motion.span layoutId="day-on" className="pill-bg" transition={spring} />}
                  </Tap>
                );
              })}
            </div>
          </div>

          {/* time */}
          <div>
            <h3 className="label">Start time <span className="muted small">· {h.first}&apos;s calendar</span></h3>
            <div className="time-grid">
              {TIMES.map((t) => {
                const free = isFree(h, draft.dayKey, t);
                const on = draft.time === t;
                return (
                  <Tap key={t} disabled={!free} className={`time-pill ${on ? "on" : ""} ${free ? "" : "off"}`} onClick={() => setDraft({ time: t })}>
                    <span className="pill-txt">{free ? t.replace(":00", "") : <s>{t.replace(":00", "")}</s>}</span>
                    {on && <motion.span layoutId="time-on" className="pill-bg" transition={spring} />}
                  </Tap>
                );
              })}
            </div>
          </div>

          {/* duration */}
          {s.unit === "hr" && (
            <div className="duration">
              <div>
                <h3 className="label" style={{ margin: 0 }}>How long</h3>
                <span className="small muted">{draft.time} – {endTime(draft.time, draft.hours)}</span>
              </div>
              <div className="stepper">
                <Tap onClick={() => setDraft({ hours: Math.max(1, draft.hours - 0.5) })} aria-label="Less"><Minus size={18} /></Tap>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.b key={draft.hours} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
                    {draft.hours}<small> hr{draft.hours === 1 ? "" : "s"}</small>
                  </motion.b>
                </AnimatePresence>
                <Tap onClick={() => setDraft({ hours: Math.min(8, draft.hours + 0.5) })} aria-label="More"><Plus size={18} /></Tap>
              </div>
            </div>
          )}

          <Tap className={`toggle-card ${draft.weekly ? "on" : ""}`} onClick={() => setDraft({ weekly: !draft.weekly })}>
            <span className="toggle-ic"><Repeat size={18} /></span>
            <div className="grow" style={{ textAlign: "left" }}>
              <b>Repeat every {day(draft.dayKey).dow === "Thu" ? "Thursday" : day(draft.dayKey).dow}</b>
              <span>Same helper, same time · skip any week</span>
            </div>
            <span className={`switch ${draft.weekly ? "on" : ""}`}><motion.i layout transition={spring} /></span>
          </Tap>

          <ServiceScope id={s.id} />

          {/* checklist */}
          <div>
            <h3 className="label">What should {h.first} do?</h3>
            <div className="checklist">
              {draft.tasks.map((x, i) => (
                <Tap key={x.t} className={`check-row ${x.on ? "on" : ""}`} onClick={() => setDraft({ tasks: draft.tasks.map((y, j) => (j === i ? { ...y, on: !y.on } : y)) })}>
                  <span className="cbox">{x.on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring}><Check size={14} strokeWidth={3.5} /></motion.span>}</span>
                  {x.t}
                </Tap>
              ))}
              <label className="check-row add">
                <Plus size={18} />
                <input placeholder="Add a task" value={adding} onChange={(e) => setAdding(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && adding.trim()) { setDraft({ tasks: [...draft.tasks, { t: adding.trim(), on: true }] }); setAdding(""); } }} />
              </label>
            </div>
            <p className="hint">{h.first} ticks these off live, and you&apos;ll see each one as it happens.</p>
          </div>

          {/* price */}
          <div className="receipt">
            <div className="receipt-row"><span>{s.unit === "visit" ? "Wellness visit" : `${draft.hours} hrs × $${rateFor(h, s)}`}</span><span>${p.base}</span></div>
            <div className="receipt-row"><span>Kinly care fee ({FEE * 100}%)</span><span>${p.fee.toFixed(2)}</span></div>
            <div className="receipt-total">
              <span>Total</span>
              <motion.b key={yours} initial={{ scale: 1.15 }} animate={{ scale: 1 }}>${yours}</motion.b>
            </div>
            <div className="pay-method"><CreditCard size={16} /> Visa ·· 4242 · charged after the visit · free cancellation until 24 hrs before</div>
          </div>
          <div style={{ height: 120 }} />
        </div>
      </div>

      <div className="dock book-dock">
        <Tap className="btn soft" disabled={!canBook} onClick={toCart} aria-label="Add to cart">
          <ShoppingCart size={18} /> Add to cart
        </Tap>
        <Tap className="btn brand" disabled={!canBook} onClick={confirm} style={{ flex: 1 }}>
          {canBook ? `Book · $${yours}` : "Pick an open time"}
        </Tap>
      </div>
    </div>
  );
}
