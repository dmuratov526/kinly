"use client";

/* Mom's phone: her own app (Kinly for Parents), separate from Rohan's. No tab bar, nothing covering it. */

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronLeft, Coffee, Globe, Navigation, Phone, Pill, ShoppingBasket, Sparkles, Stethoscope, Sun, type LucideIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { DAYS, PEOPLE, helper, type ServiceId } from "../data";
import { StreetMap, useDrive } from "../map";
import { Avatar, HelpAsk, Tap } from "../kit";
import { useStore } from "../store";

const ASK: { id: string; label: string; service: ServiceId; helperId: string; Icon: LucideIcon; hue: string; tint: string }[] = [
  { id: "ask-company", label: "Company", service: "companion", helperId: "sunita", Icon: Coffee, hue: "#E8577A", tint: "#FDE7EC" },
  { id: "ask-groceries", label: "Groceries", service: "errands", helperId: "mei", Icon: ShoppingBasket, hue: "#C97E12", tint: "#FDF1DC" },
  { id: "ask-doctor", label: "Ride to doctor", service: "escort", helperId: "denise", Icon: Stethoscope, hue: "#7B5CF0", tint: "#EEE9FE" },
  { id: "ask-house", label: "House help", service: "home", helperId: "maria", Icon: Sparkles, hue: "#22A57A", tint: "#DFF5EC" },
];

export function Mom() {
  const { go, toast, live, showLang, addRequest, requests, resolveRequest, visits } = useStore();
  const today = visits.find((v) => v.status === "live");
  const nextUp = visits.filter((v) => v.status === "upcoming").sort((a, b) => DAYS.findIndex((d) => d.key === a.dayKey) - DAYS.findIndex((d) => d.key === b.dayKey))[0];
  const h = helper(today?.helperId ?? nextUp?.helperId ?? "sunita");
  const { p, mins } = useDrive(true);
  const [asking, setAsking] = useState<(typeof ASK)[number] | null>(null);
  const [cancelling, setCancelling] = useState<(typeof ASK)[number] | null>(null);
  const [pill, setPill] = useState(false);
  const [sos, setSos] = useState(false);
  const fire = useCallback(() => { setSos(false); go("emergency"); }, [go]);
  const silent = useCallback(() => { setSos(false); toast("No answer, calling Rohan for you", "info"); }, [toast]);

  return (
    <div className="screen mom">
      <div className="scroll grow-1" style={{ paddingTop: "var(--safe)" }}>
        <div className="pad stack-18" style={{ paddingTop: 14 }}>
          <div>
            <div className="row between">
              <div className="mom-date"><Sun size={20} /> Thursday · 58° and sunny</div>
              <Tap className="mom-lang" onClick={showLang} aria-label="Language"><Globe size={20} /> EN</Tap>
            </div>
            <h1 className="mom-hello">Good afternoon,<br /><i>Kamala</i></h1>
          </div>

          <motion.div className="mom-visit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mom-visit-top">
              <Avatar src={h.photo} size={104} ring="#22C55E" />
              <div className="mom-visit-text">
                <span>{!today ? "Next visit" : live === 0 ? "Coming today" : live === 3 ? "Visited today" : "Here with you"}</span>
                <b>{h.first}</b>
                <em>{!today ? (nextUp ? `${nextUp.dateLabel} at ${nextUp.time.replace(":00", "")}` : "Nothing booked yet") : live === 0 ? `${mins} minute${mins === 1 ? "" : "s"} away` : live === 3 ? "See you next Thursday" : "until 5:00"}</em>
              </div>
            </div>
            {today && live === 0 && (
              <div className="mom-code-row">
                <div className="mom-code">
                  <span>Ask her for your code</span>
                  <b>4 8 2 1</b>
                </div>
                <Tap className="mom-thumb" onClick={() => go("momMap")} aria-label="See where Sunita is on a map">
                  <StreetMap progress={p} zoom={15.3} attribution={false} carScale={0.85} />
                  <span className="mom-thumb-label">See map</span>
                </Tap>
              </div>
            )}
          </motion.div>

          {/* one tap, then a calm yes / I'm okay. No press-and-hold, no countdown */}
          <Tap className="mom-sos" onClick={() => setSos(true)}>
            <b>I need help</b>
            <span>Tap once</span>
          </Tap>

          <Tap className={`mom-pill ${pill ? "on" : ""}`} onClick={() => { setPill(!pill); if (!pill) toast("Rohan and Anita will see this", "check"); }}>
            <span className="mom-pill-ic">{pill ? <Check size={30} strokeWidth={3} /> : <Pill size={28} />}</span>
            <div style={{ textAlign: "left" }}>
              <b>{pill ? "Done! Well done." : "3 o'clock pill"}</b>
              <span>{pill ? "Your family can see it" : "Tap when you've taken it"}</span>
            </div>
          </Tap>

          {/* she can ask for a visit herself; Rohan approves and pays */}
          <div>
            <h2 className="mom-h2">Ask for a visit</h2>
            <div className="mom-ask">
              {ASK.map((a) => {
                const sent = requests.some((r) => r.id === a.id);
                return (
                  <Tap key={a.id} className={`mom-ask-tile ${sent ? "sent" : ""}`} onClick={() => (sent ? setCancelling(a) : setAsking(a))}>
                    <span className="mom-ask-ic" style={{ background: a.tint, color: a.hue }}>{sent ? <Check size={30} strokeWidth={3} /> : <a.Icon size={30} />}</span>
                    <b>{a.label}</b>
                    {sent && <span>Sent to Rohan · tap to cancel</span>}
                  </Tap>
                );
              })}
            </div>
          </div>

          <div className="mom-calls">
            {[
              { name: "Rohan", photo: PEOPLE.rohan.photo, sub: "Your son" },
              { name: "Anita", photo: PEOPLE.anita.photo, sub: "Your daughter" },
              { name: "Sunita", photo: h.photo, sub: "Your helper" },
            ].map((x) => (
              <Tap key={x.name} className="mom-call" onClick={() => toast(`Calling ${x.name}…`, "info")}>
                <Avatar src={x.photo} size={62} />
                <div className="grow" style={{ textAlign: "left" }}>
                  <b>{x.name}</b>
                  <span>{x.sub}</span>
                </div>
                <span className="mom-call-ic"><Phone size={26} fill="currentColor" /></span>
              </Tap>
            ))}
          </div>

          <div style={{ height: 40 }} />
        </div>
      </div>

      <AnimatePresence>
        {cancelling && (
          <motion.div key="cancel" className="help-ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCancelling(null)}>
            <motion.div className="help-ask-card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: 36 }}>Cancel your request?</h2>
              <p>{cancelling.label}, {requests.find((r) => r.id === cancelling.id)?.when.toLowerCase()}</p>
              <button className="help-yes" onClick={() => {
                resolveRequest(cancelling.id);
                setCancelling(null);
                toast("Request cancelled. Rohan is told", "check");
              }}>Yes, cancel it</button>
              <button className="help-no" onClick={() => setCancelling(null)}>Keep it</button>
            </motion.div>
          </motion.div>
        )}
        {asking && (
          <motion.div key="ask" className="help-ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAsking(null)}>
            <motion.div className="help-ask-card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: 38 }}>{asking.label}</h2>
              <p>When would you like it?</p>
              {["Today", "Tomorrow", "This week"].map((w) => (
                <button key={w} className="help-no" onClick={() => {
                  addRequest({ id: asking.id, service: asking.service, what: asking.label, when: w, helperId: asking.helperId });
                  setAsking(null);
                  toast("Sent to Rohan. He'll confirm soon", "check");
                }}>{w}</button>
              ))}
              <span className="help-note">Rohan will see it and book it for you.</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <HelpAsk open={sos} onYes={fire} onNo={() => { setSos(false); toast("Glad you're okay", "heart"); }} onSilent={silent} />
    </div>
  );
}

/** Full-screen map from Mom's phone: where Sunita is and when she'll ring the bell. */
export function MomMap() {
  const { back, toast, live } = useStore();
  const h = helper("sunita");
  const { p, mins } = useDrive();
  const here = live > 0 || p >= 0.99;

  return (
    <div className="screen mom-map">
      <StreetMap progress={p} fit pad={{ top: 130, right: 40, bottom: 290, left: 40 }} className="attr-high-lg" />
      <div className="mom-map-top">
        <Tap className="mom-back" onClick={back}><ChevronLeft size={28} strokeWidth={2.6} /> Back</Tap>
      </div>
      <motion.div className="mom-map-card" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 }}>
        <div className="row" style={{ gap: 16 }}>
          <Avatar src={h.photo} size={76} ring="#22C55E" />
          <div className="grow">
            <AnimatePresence mode="wait">
              <motion.b key={here ? "here" : mins} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                {here ? "Sunita is at your door" : <>Sunita is <em>{mins} min</em> away</>}
              </motion.b>
            </AnimatePresence>
            <span><Navigation size={16} /> {here ? "Ask her for your code: 4 8 2 1" : "She will ring your bell at 2:00"}</span>
          </div>
        </div>
        <Tap className="mom-map-call" onClick={() => toast("Calling Sunita…", "info")}><Phone size={24} fill="currentColor" /> Call Sunita</Tap>
      </motion.div>
    </div>
  );
}

export function Emergency() {
  const { back, toast } = useStore();
  const h = helper("sunita");
  const steps = ["911 called from Sunita's phone", "Rohan and Anita alerted", "Kinly nurse on the line", "Live location sent to responders", "Kamala's meds and allergies shared"];
  return (
    <div className="screen emergency">
      <motion.div className="sos-pulse" animate={{ scale: [1, 1.6], opacity: [0.5, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
      <motion.div className="sos-pulse" animate={{ scale: [1, 1.6], opacity: [0.5, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.8 }} />
      <div className="pad stack-18" style={{ paddingTop: 70, position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
        <span className="eyebrow light">Emergency · 3:22 PM</span>
        <h1 className="display light" style={{ fontSize: 38 }}>Help is <i>on the way</i></h1>
        <p style={{ margin: 0, fontSize: 16, opacity: 0.9, lineHeight: 1.45 }}>An alert went out from Kamala&apos;s home at 37-12 82nd St. Stay on the line with the Kinly nurse.</p>
        <div className="sos-list">
          {steps.map((s, i) => (
            <motion.div key={s} className="row" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.45 }}>
              <motion.span className="sos-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.45, type: "spring", stiffness: 500, damping: 15 }}><Check size={14} strokeWidth={3.5} /></motion.span>
              {s}
            </motion.div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }} className="stack-10">
            <Tap className="btn light" onClick={() => toast(`Calling ${h.first}…`, "info")}><Phone size={18} /> Call {h.first}</Tap>
            <Tap className="btn outline-light" onClick={() => toast("Connecting to the Kinly nurse…", "info")}>Talk to a Kinly nurse</Tap>
            <button className="sos-cancel" onClick={() => { toast("Alert cancelled. Family notified.", "info"); back(); }}>False alarm? Cancel alert</button>
          </motion.div>
        </AnimatePresence>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
