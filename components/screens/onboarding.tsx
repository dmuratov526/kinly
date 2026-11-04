"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, Btn, Check, Chip, TopBar, useNav } from "../ui";
import { HeroIllustration } from "../illustrations";

export function Welcome() {
  const { go, toast } = useNav();
  const [phone, setPhone] = useState("");
  return (
    <div className="screen">
      <div className="body" style={{ gap: 18 }}>
        <div className="row" style={{ marginTop: 8 }}>
          <span style={{ width: 30, height: 30, border: "2px solid var(--ink)", borderRadius: 7 }} />
          <b style={{ fontSize: 18, letterSpacing: ".04em" }}>KINLY</b>
        </div>
        <HeroIllustration />
        <h2 className="h-xl">Help for Mom and Dad,<br />even from afar</h2>
        <p className="muted" style={{ margin: 0, lineHeight: 1.5 }}>
          Book vetted helpers for visits, errands and appointments. Get a report after every visit.
        </p>
        <div style={{ flex: 1 }} />
        <div className="label">Phone number</div>
        <input className="input" inputMode="tel" placeholder="(555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="footer" style={{ borderTop: 0, paddingTop: 0 }}>
        <Btn onClick={() => go("verify")}>Send code</Btn>
        <Btn kind="secondary" onClick={() => go("profile")}>Continue with Google</Btn>
        <div className="note" style={{ fontSize: 13 }}>
          Already have an account? <button style={{ fontWeight: 600 }} onClick={() => { toast("Welcome back, Rohan"); go("home"); }}>Log in</button>
        </div>
      </div>
    </div>
  );
}

export function Verify() {
  const { go, back } = useNav();
  const [code, setCode] = useState(["4", "8", "2", "1", "", ""]);
  const [sec, setSec] = useState(24);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[4]?.focus();
    const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const set = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="screen">
      <TopBar title="Verify your phone" />
      <div className="body">
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.4 }}>Enter the 6-digit code we sent to (555) 000-0000.</p>
        <div className="otp">
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={c}
              placeholder=" "
              inputMode="numeric"
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus(); }}
            />
          ))}
        </div>
        <div className="muted" style={{ fontSize: 14 }}>
          {sec > 0 ? `Resend code in 0:${String(sec).padStart(2, "0")}` : <button className="link" onClick={() => setSec(30)}>Resend code</button>}
        </div>
        <button className="link" style={{ alignSelf: "flex-start" }} onClick={back}>Use a different number</button>
      </div>
      <div className="footer">
        <Btn onClick={() => go("profile")}>Verify</Btn>
      </div>
    </div>
  );
}

export function CareProfile() {
  const { go, toast } = useNav();
  const [rel, setRel] = useState("Mom");
  const [langs, setLangs] = useState(["English", "Hindi"]);
  const [invite, setInvite] = useState(true);
  const [name, setName] = useState("Kamala Mehta");
  const [photo, setPhoto] = useState(false);

  const addLang = () => {
    const pool = ["Gujarati", "Punjabi", "Tamil", "Spanish"].filter((l) => !langs.includes(l));
    if (pool[0]) setLangs([...langs, pool[0]]);
  };

  return (
    <div className="screen">
      <TopBar title="Who are you booking for?" />
      <div className="body">
        <div className="small muted">Step 1 of 2 · Care profile</div>
        <div className="row">
          {photo ? <Avatar size={52} who="kamala" /> : <Avatar size={52} dashed />}
          <button className="link" onClick={() => { setPhoto(!photo); if (!photo) toast("Photo added"); }}>{photo ? "Change photo" : "Add photo"}</button>
        </div>
        <div className="label">Name</div>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="label">Relationship</div>
        <div className="chips">
          {["Mom", "Dad", "Other"].map((r) => <Chip key={r} on={rel === r} onClick={() => setRel(r)}>{r}</Chip>)}
        </div>
        <div className="label">Home address</div>
        <input className="input" placeholder="[Street, city, ZIP]" />
        <div className="label">Languages</div>
        <div className="chips">
          {langs.map((l) => (
            <Chip key={l} className="soft" onClick={() => setLangs(langs.filter((x) => x !== l))}>{l} ×</Chip>
          ))}
          <Chip className="dashed" onClick={addLang}>+ Add</Chip>
        </div>
        <div className="label">Needs and health notes</div>
        <textarea className="textarea" placeholder="[Medications, mobility, allergies]" />
        <div className="label">Emergency contact</div>
        <input className="input" placeholder="[Name, phone]" />
        <button className="row between" style={{ padding: "8px 0", fontSize: 15 }} onClick={() => setInvite(!invite)}>
          Invite siblings to share this profile <Check on={invite} />
        </button>
      </div>
      <div className="footer">
        <Btn onClick={() => { toast(`Consent invite sent to ${rel}`); go("home"); }}>Send {rel} a consent invite</Btn>
        <div className="note">No reply in 24 hrs? We&apos;ll call her to confirm.</div>
      </div>
    </div>
  );
}
