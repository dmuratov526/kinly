"use client";

import { useEffect, useState } from "react";
import { Avatar, Btn, Radio, TopBar, useHelper, useNav } from "../ui";
import { NoteIcon, SuccessBurst } from "../illustrations";

export function endTime(start: string, hours: number) {
  const [hm, ap] = start.split(" ");
  let h = Number(hm.split(":")[0]) % 12 + (ap === "PM" ? 12 : 0);
  h += hours;
  const ap2 = h >= 12 && h < 24 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:00 ${ap2}`;
}

export function Pay() {
  const { go, booking, toast } = useNav();
  const h = useHelper();
  const [method, setMethod] = useState("Visa ending [####]");
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(true);
  const methods = ["Visa ending [####]", "Apple Pay", "Split with siblings (2 people)", "HSA or FSA card"];

  return (
    <div className="screen">
      <TopBar title="Review and pay" />
      <div className="body">
        <div className="card row top">
          <Avatar size={44} who={h.id} />
          <div className="grow" style={{ fontSize: 14, lineHeight: 1.4 }}>
            <b style={{ fontSize: 15 }}>{booking.service} · {h.name}</b>
            <div className="muted">For Mom · {booking.day}, {booking.time} to {endTime(booking.time, booking.hours)}</div>
            <div className="muted">Home → [Clinic name] → Home</div>
          </div>
        </div>
        <div>
          <div className="price-row"><span>{booking.hours} hrs × [$XX]/hr</span><span>[$XX]</span></div>
          <div className="price-row"><span>Mileage</span><span>[$X]</span></div>
          <div className="price-row"><span>Service fee</span><span>[$X]</span></div>
          {applied && <div className="price-row" style={{ color: "var(--green)" }}><span>Promo FIRSTVISIT</span><span>−[$X]</span></div>}
          <div className="divider" />
          <div className="price-row" style={{ fontSize: 16, fontWeight: 700 }}><span>Total</span><span>[$XX]</span></div>
        </div>
        <div className="row">
          <input className="input grow" placeholder="Promo code" value={promo} onChange={(e) => setPromo(e.target.value)} />
          <button className="btn secondary" style={{ width: 80, height: 46 }} onClick={() => {
            if (!promo.trim()) return toast("Enter a promo code");
            setApplied(true); toast(`Promo ${promo.toUpperCase()} applied`); setPromo("");
          }}>Apply</button>
        </div>
        <div className="label">Pay with</div>
        {methods.map((m) => (
          <button key={m} className={`radio-card ${method === m ? "on" : ""}`} onClick={() => setMethod(m)}>
            <Radio on={method === m} /> {m}
          </button>
        ))}
        <div className="card soft small muted" style={{ lineHeight: 1.45 }}>
          We place a hold now and charge after the visit ends. Free cancellation until Wed 29, 10:00 AM.
        </div>
      </div>
      <div className="footer">
        <Btn onClick={() => go("confirmed")}>Confirm and hold [$XX]</Btn>
      </div>
    </div>
  );
}

export function PayFailed() {
  const { go, toast } = useNav();
  const h = useHelper();
  return (
    <div className="screen">
      <TopBar title="Review and pay" />
      <div className="body">
        <div className="card alert">
          <h3>Payment didn&apos;t go through</h3>
          <p>Your Visa ending [####] was declined. Your slot with {h.short} is held for 10 minutes.</p>
        </div>
        <div className="label">Try another way to pay</div>
        {["Apple Pay", "Split with siblings", "HSA or FSA card"].map((m) => (
          <button key={m} className="nav-row" onClick={() => { toast(`Paid with ${m}`); go("confirmed"); }}>{m} <span>›</span></button>
        ))}
        <button className="nav-row" onClick={() => toast("Card form would open")}>Add a new card <span>+</span></button>
        <div className="card soft small muted">You won&apos;t be charged twice. Only the successful method is held.</div>
      </div>
      <div className="footer">
        <Btn onClick={() => go("confirmed")}>Retry Visa ending [####]</Btn>
      </div>
    </div>
  );
}

export function Confirmed() {
  const { go, reset, booking, setBooking, toast } = useNav();
  const h = useHelper();
  useEffect(() => {
    setBooking({ booked: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="screen">
      <div className="body" style={{ alignItems: "stretch", textAlign: "center", paddingTop: 30 }}>
        <SuccessBurst />
        <h2 className="h-lg" style={{ fontSize: 26, marginTop: 8 }}>{h.short} is booked</h2>
        <div className="muted" style={{ fontSize: 15, marginTop: -6 }}>{booking.day} · {booking.time} to {endTime(booking.time, booking.hours)}</div>
        {([
          ["message", `We texted Mom ${h.short}'s photo and arrival time.`],
          ["family", "Your sister Anita can see this visit too."],
          ["bell", "Reminders 24 hrs and 1 hr before."],
        ] as const).map(([k, t]) => (
          <div key={t} className="card row" style={{ textAlign: "left", fontSize: 14 }}>
            <NoteIcon kind={k} /> {t}
          </div>
        ))}
        <div className="small muted" style={{ lineHeight: 1.45 }}>Hold of [$XX] on Visa ending [####] · Free cancellation until Wed 29, 10:00 AM</div>
      </div>
      <div className="footer">
        <Btn onClick={() => reset("tracking")}>View visit</Btn>
        <div className="row">
          <Btn kind="secondary" onClick={() => toast("Added to your calendar")}>Add to calendar</Btn>
          <Btn kind="secondary" onClick={() => go("reschedule")}>Reschedule</Btn>
        </div>
        <button className="note" onClick={() => reset("home")} style={{ marginTop: 2 }}>Back to home</button>
      </div>
    </div>
  );
}
