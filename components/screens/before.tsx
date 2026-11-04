"use client";

import { useState } from "react";
import { Avatar, Btn, Chip, TopBar, useHelper, useNav } from "../ui";
import { endTime } from "./payment";

export function MomView() {
  const { go, toast } = useNav();
  const h = useHelper();
  return (
    <div className="screen" style={{ fontSize: 18 }}>
      <div className="body" style={{ gap: 18 }}>
        <div style={{ marginTop: 8 }}>
          <div className="muted" style={{ fontSize: 20 }}>Good morning,</div>
          <h2 className="h-xl" style={{ fontSize: 34 }}>Kamala</h2>
        </div>
        <div className="card" style={{ border: "2px solid var(--ink)", padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <b style={{ fontSize: 17 }}>Your next visit</b>
          <div className="row">
            <Avatar size={72} who={h.id} />
            <div>
              <b style={{ fontSize: 22 }}>{h.short}</b>
              <div style={{ fontSize: 16 }}>Thursday, 10:00 AM</div>
              <div className="muted" style={{ fontSize: 15 }}>Taking you to the doctor</div>
            </div>
          </div>
          <div className="card soft" style={{ fontSize: 16 }}>Your door code: <b style={{ letterSpacing: 3 }}>4 8 2 1</b></div>
        </div>
        <Btn kind="outline-lg" onClick={() => toast(`Calling ${h.short}…`)}>Call {h.short}</Btn>
        <Btn kind="outline-lg" onClick={() => toast("Calling Rohan…")}>Call Rohan</Btn>
        <div style={{ flex: 1 }} />
        <Btn kind="danger big" onClick={() => go("emergency")}>I need help</Btn>
        <div className="muted" style={{ textAlign: "center", fontSize: 14, marginTop: -6 }}>Calls your family and the Kinly care team</div>
      </div>
    </div>
  );
}

export function HelperCancelled() {
  const { go, reset, setBooking, toast } = useNav();
  return (
    <div className="screen">
      <TopBar title="Visit update" sub="Thu 30 · 10:00 AM" />
      <div className="body">
        <div className="card grey">
          <h3>Sunita can&apos;t make it on Thursday</h3>
          <p>She had to cancel. We&apos;ve found a similar helper for the same time, at no extra cost.</p>
        </div>
        <div className="label">Suggested replacement</div>
        <button className="card sel row" style={{ textAlign: "left" }} onClick={() => { setBooking({ helperId: "priya" }); go("helper"); }}>
          <Avatar size={52} who="priya" />
          <div>
            <b style={{ fontSize: 16 }}>Priya K.</b>
            <div className="muted small">Retired teacher · 5 yrs</div>
            <div className="small">★ 4.8 · Speaks Hindi · Verified</div>
          </div>
        </button>
        <div className="small muted">Mom will get Priya&apos;s photo by text once you accept.</div>
      </div>
      <div className="footer">
        <Btn onClick={() => { setBooking({ helperId: "priya", booked: true }); toast("Priya is confirmed"); reset("home"); }}>Accept Priya</Btn>
        <Btn kind="secondary" onClick={() => go("helpers")}>Choose someone else</Btn>
        <button className="link" style={{ alignSelf: "center" }} onClick={() => go("booking")}>Pick a new time instead</button>
      </div>
    </div>
  );
}

export function Reschedule() {
  const { go, reset, booking, setBooking, toast } = useNav();
  const h = useHelper();
  const [action, setAction] = useState<"re" | "cancel">("re");
  const [reason, setReason] = useState("Appointment moved");
  return (
    <div className="screen">
      <TopBar title="Change this visit" />
      <div className="body">
        <div className="card row">
          <Avatar size={44} who={h.id} />
          <div>
            <b style={{ fontSize: 15 }}>{booking.service} · {h.name}</b>
            <div className="muted small">{booking.day} · {booking.time} to {endTime(booking.time, booking.hours)}</div>
          </div>
        </div>
        <div className="grid g2">
          <button className={`card ${action === "re" ? "sel" : ""}`} style={{ textAlign: "center" }} onClick={() => setAction("re")}>
            <b>Reschedule</b><div className="muted small">Same helper if free</div>
          </button>
          <button className={`card ${action === "cancel" ? "sel" : ""}`} style={{ textAlign: "center" }} onClick={() => setAction("cancel")}>
            <b>Cancel visit</b><div className="muted small">Refund to Visa</div>
          </button>
        </div>
        <div className="label">Cancellation policy</div>
        <div>
          <div className="price-row"><span>Before Wed 29, 10:00 AM</span><b>Free</b></div>
          <div className="price-row"><span>Within 24 hrs</span><b>[$XX] fee</b></div>
          <div className="price-row"><span>Helper cancels</span><b>Always free</b></div>
        </div>
        <div className="label">Reason (optional)</div>
        <div className="chips">
          {["Appointment moved", "Mom feels unwell", "Family visiting", "Other"].map((r) => (
            <Chip key={r} on={reason === r} onClick={() => setReason(r)}>{r}</Chip>
          ))}
        </div>
      </div>
      <div className="footer">
        {action === "re" ? (
          <Btn onClick={() => go("booking")}>Pick a new time</Btn>
        ) : (
          <Btn kind="danger" onClick={() => { setBooking({ booked: false }); toast("Visit cancelled · refund to Visa"); reset("home"); }}>Cancel visit</Btn>
        )}
      </div>
    </div>
  );
}
