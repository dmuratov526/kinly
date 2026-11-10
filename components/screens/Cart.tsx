"use client";

import { AnimatePresence, motion } from "motion/react";
import { CreditCard, Plus, Repeat, X } from "lucide-react";
import { FEE, day, endTime, helper, priceFor, svc, type CartItem } from "../data";
import { ServiceGlyph } from "../icons";
import { Avatar, Btn, SlideToConfirm, Tap } from "../kit";
import { useStore } from "../store";

/** Several separate visits (different days, maybe different helpers), booked and paid in one go. */
export function Cart() {
  const { cart, removeFromCart, checkout, tab, setExplore, toast } = useStore();

  const prices = cart.map((c) => priceFor(helper(c.helperId), svc(c.service), c.hours));
  const base = prices.reduce((a, p) => a + p.base, 0);
  const fee = prices.reduce((a, p) => a + p.fee, 0);
  const total = cart.reduce((a, c) => a + c.total, 0);
  const yours = total;

  const browse = () => {
    setExplore({ service: null, when: null, focus: false });
    tab("explore");
  };

  return (
    <div className="screen scroll">
      <div className="pad" style={{ paddingTop: 14 }}>
        <div className="row between">
          <h1 className="display">Your <i>cart</i></h1>
          {cart.length > 0 && <span className="pill-stat"><b>{cart.length}</b> visit{cart.length === 1 ? "" : "s"}</span>}
        </div>
        <p className="muted cart-sub">Stack visits for Kamala, then book them all at once.</p>

        {cart.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="empty">
            <span>🧺</span>
            <b>Nothing in the cart yet</b>
            <p>Add a doctor visit, a pharmacy run and lunch together, then check out once.</p>
            <Btn kind="primary" onClick={browse}>Browse services</Btn>
          </motion.div>
        ) : (
          <div className="stack-14">
            <motion.div layout className="stack-10">
              <AnimatePresence initial={false} mode="popLayout">
                {cart.map((c, i) => (
                  <motion.div key={c.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }} exit={{ opacity: 0, x: -60 }}>
                    <CartRow c={c} onRemove={() => { removeFromCart(c.id); toast("Removed from cart", "info"); }} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <Tap className="cart-add" onClick={browse}><Plus size={18} /> Add another service</Tap>

            <div className="receipt">
              <div className="receipt-row"><span>{cart.length} visit{cart.length === 1 ? "" : "s"}</span><span>${base}</span></div>
              <div className="receipt-row"><span>Kinly care fee ({FEE * 100}%)</span><span>${fee.toFixed(2)}</span></div>
              <div className="receipt-total">
                <span>Total</span>
                <motion.b key={yours} initial={{ scale: 1.15 }} animate={{ scale: 1 }}>${yours}</motion.b>
              </div>
              <div className="pay-method"><CreditCard size={16} /> Visa ·· 4242 · each visit is charged after it happens</div>
            </div>

            <SlideToConfirm label={`Book ${cart.length} visit${cart.length === 1 ? "" : "s"} · $${yours}`} onDone={checkout} />
            <span className="dock-note">Free cancellation until 24 hrs before each visit</span>
          </div>
        )}
        <div style={{ height: 120 }} />
      </div>
    </div>
  );
}

function CartRow({ c, onRemove }: { c: CartItem; onRemove: () => void }) {
  const h = helper(c.helperId);
  const s = svc(c.service);
  return (
    <div className="cart-row">
      <ServiceGlyph id={c.service} size={46} radius={15} />
      <div className="grow">
        <div className="row" style={{ gap: 6 }}>
          <b>{s.name}</b>
          {c.weekly && <span className="weekly"><Repeat size={11} /> Weekly</span>}
        </div>
        <span className="small muted">{day(c.dayKey).label} · {c.time.replace(":00", "")}{s.unit === "hr" ? `–${endTime(c.time, c.hours).replace(":00", "")}` : ""}</span>
        <div className="row" style={{ gap: 6, marginTop: 6 }}>
          <Avatar src={h.photo} size={22} />
          <span className="small">with {h.first}</span>
        </div>
      </div>
      <div className="cart-right">
        <Tap className="cart-x" onClick={onRemove} aria-label={`Remove ${s.name}`}><X size={15} /></Tap>
        <b>${c.total}</b>
      </div>
    </div>
  );
}
