"use client";

import { useState } from "react";
import { Avatar, Btn, Check, Chip, TopBar, useHelper, useMulti, useNav } from "../ui";
import { SorryArt, VisitPhoto } from "../illustrations";

export function Report() {
  const { go, toast, setBooking } = useNav();
  const h = useHelper();
  return (
    <div className="screen">
      <TopBar
        title="Visit report"
        sub="Thu 30 · 10:01 AM to 1:16 PM"
        right={<button className="chip" onClick={() => toast("Share sheet would open")}>Share</button>}
      />
      <div className="body">
        <div className="card soft" style={{ fontSize: 15, lineHeight: 1.45 }}>
          <b>Kamala was in good spirits.</b> Appointment went well, prescriptions picked up.
        </div>
        <div className="label">Tasks · 4 of 4 done</div>
        <div style={{ fontSize: 14, display: "flex", flexDirection: "column", gap: 5 }}>
          {["Picked Mom up from home", "Stayed with her during the appointment", "Took notes from the doctor", "Pharmacy pickup"].map((t) => <div key={t}>✓ {t}</div>)}
        </div>
        <div className="label">Doctor&apos;s notes</div>
        <div className="skel" /><div className="skel" style={{ width: "85%", marginTop: -6 }} />
        <div style={{ fontSize: 14 }}>
          Next appointment: <b>[Date]</b> · <button className="link" onClick={() => { setBooking({ service: "Appointment escort" }); go("booking"); }}>Book escort</button>
        </div>
        <div className="grid g3">
          {(["smile", "clinic", "pharmacy"] as const).map((k) => <button key={k} style={{ height: 80, overflow: "hidden", borderRadius: 8 }} onClick={() => toast("Photo viewer")}><VisitPhoto kind={k} /></button>)}
        </div>
        <div className="card">
          <b style={{ fontSize: 15 }}>Payment</b>
          <div style={{ marginTop: 8 }}>
            <div className="price-row"><span>3 hrs booked</span><span>[$XX]</span></div>
            <div className="price-row"><span>Extra 15 min (approved by you)</span><span>[$X]</span></div>
            <div className="price-row" style={{ fontWeight: 700 }}><span>Charged to Visa ending [####]</span><span>[$XX]</span></div>
          </div>
          <div className="small muted" style={{ marginTop: 4 }}>Anita&apos;s half settled · <button style={{ textDecoration: "underline" }} onClick={() => toast("Receipt opened")}>View receipt</button></div>
        </div>
      </div>
      <div className="footer">
        <Btn onClick={() => go("rate")}>Rate {h.short}</Btn>
      </div>
    </div>
  );
}

export function Rate() {
  const { go, reset, toast } = useNav();
  const h = useHelper();
  const [stars, setStars] = useState(4);
  const [tags, toggle] = useMulti(["Kind and patient", "On time"]);
  const [tip, setTip] = useState("[$10]");
  const [fav, setFav] = useState(true);
  const [weekly, setWeekly] = useState(false);

  const submit = () => {
    if (stars <= 2) return go("lowRating");
    if (weekly) return go("weekly");
    toast("Thanks! Your review was posted");
    reset("home");
  };

  return (
    <div className="screen">
      <TopBar title="Rate your visit" />
      <div className="body" style={{ alignItems: "stretch" }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, paddingTop: 6 }}>
          <Avatar size={64} who={h.id} />
          <b style={{ fontSize: 18 }}>How was {h.short}?</b>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={n <= stars ? "on" : ""} onClick={() => setStars(n)} aria-label={`${n} stars`}>★</button>
            ))}
          </div>
          <div className="chips" style={{ justifyContent: "center" }}>
            {["Kind and patient", "On time", "Great updates", "Safe driver"].map((t) => (
              <Chip key={t} on={tags.includes(t)} onClick={() => toggle(t)}>{t}</Chip>
            ))}
          </div>
        </div>
        <div className="card soft" style={{ fontSize: 14 }}><b>Mom&apos;s feedback:</b> Thumbs up (replied by text)</div>
        <div className="label">Comment (optional)</div>
        <textarea className="textarea" placeholder={`Tell other families about ${h.short}`} />
        <div className="label">Add a tip · 100% goes to {h.short}</div>
        <div className="grid g4">
          {["[$5]", "[$10]", "[$15]", "Other"].map((t) => (
            <button key={t} className={`opt ${tip === t ? "on" : ""}`} onClick={() => setTip(t)}>{t}</button>
          ))}
        </div>
        <button className="row between" style={{ fontSize: 15, padding: "6px 0" }} onClick={() => setFav(!fav)}>Save {h.short} as a favorite <Check on={fav} /></button>
        <button className="row between" style={{ fontSize: 15, padding: "6px 0" }} onClick={() => setWeekly(!weekly)}>Book her every Thursday <Check on={weekly} /></button>
      </div>
      <div className="footer">
        <Btn onClick={submit}>Submit</Btn>
      </div>
    </div>
  );
}

export function LowRating() {
  const { reset, toast } = useNav();
  const [what, toggle] = useMulti(["Arrived late", "Skipped a task"]);
  const [fix, setFix] = useState("Credit for next visit");
  return (
    <div className="screen">
      <TopBar title="Tell us what went wrong" />
      <div className="body">
        <div className="card grey row top">
          <SorryArt />
          <div>
            <h3>We&apos;re sorry this visit wasn&apos;t great</h3>
            <p>Ratings of 2 stars or less go straight to our care team. Someone will reach out within 24 hrs.</p>
          </div>
        </div>
        <div className="label">What happened?</div>
        <div className="chips">
          {["Arrived late", "Felt rushed", "Skipped a task", "Poor updates", "Safety concern"].map((t) => (
            <Chip key={t} on={what.includes(t)} onClick={() => toggle(t)}>{t}</Chip>
          ))}
        </div>
        <div className="label">Details</div>
        <textarea className="textarea" placeholder="[Describe what happened]" />
        <div className="label">How can we make it right?</div>
        {["Refund this visit", "Credit for next visit", "Don't match me with this helper"].map((f) => (
          <button key={f} className={`radio-card ${fix === f ? "on" : ""}`} style={{ justifyContent: "space-between" }} onClick={() => setFix(f)}>
            {f}
            <span style={{ width: 14, height: 14, borderRadius: "50%", border: "1.5px solid var(--ink)", background: fix === f ? "var(--ink)" : "transparent" }} />
          </button>
        ))}
      </div>
      <div className="footer">
        <Btn onClick={() => { toast("Sent to the care team"); reset("home"); }}>Send to care team</Btn>
      </div>
    </div>
  );
}

export function Weekly() {
  const { reset, toast, booking, setBooking } = useNav();
  const h = useHelper();
  const services = ["Companionship", "Appointment escort", "Errands", "Tech help", "Home help", "Wellness check"];
  const [service, setService] = useState("Companionship");
  const [days, toggleDay] = useMulti(["3"]);
  const [time, setTime] = useState(2);
  const [len, setLen] = useState(2);
  const times = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];
  const D = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="screen">
      <TopBar title={`Weekly visits with ${h.short}`} />
      <div className="body">
        <div className="label">Service</div>
        <button className="nav-row" onClick={() => setService(services[(services.indexOf(service) + 1) % services.length])}>
          {service} <b>Change</b>
        </button>
        <div className="label">Repeat on</div>
        <div className="row between" style={{ gap: 6 }}>
          {D.map((d, i) => (
            <button key={i} className={`opt ${days.includes(String(i)) ? "on" : ""}`}
              style={{ borderRadius: "50%", width: 42, height: 42, padding: 0, flexShrink: 0 }}
              onClick={() => toggleDay(String(i))}>{d}</button>
          ))}
        </div>
        <div className="grid g2">
          <button className="nav-row" onClick={() => setTime((time + 1) % times.length)}>Time <b>{times[time]}</b></button>
          <button className="nav-row" onClick={() => setLen((len % 4) + 1)}>Length <b>{len} {len === 1 ? "hr" : "hrs"}</b></button>
        </div>
        <button className="nav-row" onClick={() => toast("Date picker would open")}>Starts <b>Thu, Nov 6</b></button>
        <button className="nav-row" onClick={() => toast("End options would open")}>Ends <b>Until I cancel</b></button>
        <div className="card soft">
          <div className="price-row"><span>Per visit</span><b>[$XX]</b></div>
          <div className="price-row"><span>Member discount 10%</span><b>−[$X]</b></div>
          <div className="price-row"><span>Charged after each visit to</span><b>Visa [####]</b></div>
        </div>
        <div className="small muted">Pause or skip any week from the Visits tab.</div>
      </div>
      <div className="footer">
        <Btn disabled={days.length === 0} onClick={() => {
          setBooking({ booked: true, service, time: times[time], hours: len, day: booking.day });
          toast(`Weekly visits with ${h.short} started`);
          reset("home");
        }}>Start weekly visits</Btn>
      </div>
    </div>
  );
}
