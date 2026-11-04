/* Hand-built SVG illustration set for the Kinly prototype.
   One soft, warm palette so every scene reads as the same family. */

export const P = {
  ink: "#1f1f1f",
  cream: "#f6efe6",
  peach: "#f3c9a6",
  peachDeep: "#e8a77c",
  sage: "#cfe1d3",
  sageDeep: "#7fa68a",
  sky: "#dbe7f3",
  skyDeep: "#8fb0d3",
  lilac: "#e4dcef",
  sand: "#efe2cf",
  grey: "#d9d4cd",
  white: "#ffffff",
  red: "#d9534f",
};

const SKIN = { light: "#f1cfb2", mid: "#d9a77f", tan: "#c68a5f", deep: "#8d5a3b" };
const HAIR = { black: "#2a2220", brown: "#5b3a29", grey: "#c9c4bf", silver: "#e3dfda" };

type FaceSpec = {
  skin: string;
  hair: string;
  style: "bun" | "long" | "short" | "bob";
  shirt: string;
  bg: string;
  glasses?: boolean;
  beard?: boolean;
};

export const PEOPLE: Record<string, FaceSpec> = {
  sunita: { skin: SKIN.tan, hair: HAIR.black, style: "bun", shirt: P.sageDeep, bg: P.sage },
  priya: { skin: SKIN.mid, hair: HAIR.brown, style: "long", shirt: P.skyDeep, bg: P.sky },
  meera: { skin: SKIN.deep, hair: HAIR.black, style: "bob", shirt: P.peachDeep, bg: P.peach },
  kamala: { skin: SKIN.mid, hair: HAIR.silver, style: "bun", shirt: "#b58db8", bg: P.lilac, glasses: true },
  rohan: { skin: SKIN.mid, hair: HAIR.black, style: "short", shirt: "#4b5563", bg: P.sand, beard: true },
  anita: { skin: SKIN.mid, hair: HAIR.brown, style: "bob", shirt: P.peachDeep, bg: P.cream },
  reviewer1: { skin: SKIN.light, hair: HAIR.brown, style: "long", shirt: P.skyDeep, bg: P.sky },
  reviewer2: { skin: SKIN.tan, hair: HAIR.black, style: "short", shirt: P.sageDeep, bg: P.sage },
};

/** Head-and-shoulders portrait, drawn in a 64×64 box. */
function FaceArt({ f, framed = true }: { f: FaceSpec; framed?: boolean }) {
  return (
    <g>
      {framed && <rect width="64" height="64" fill={f.bg} />}
      {/* hair behind head */}
      {f.style === "long" && <path d="M17 30 C15 12 49 12 47 30 L49 52 C42 47 22 47 15 52 Z" fill={f.hair} />}
      {f.style === "bob" && <path d="M17.5 31 C15 13 49 13 46.5 31 L47 40 C42 42 22 42 17 40 Z" fill={f.hair} />}
      {f.style === "bun" && <circle cx="32" cy="11" r="6.5" fill={f.hair} />}
      {/* shoulders + neck */}
      <path d="M8 64 C10 49 21 44.5 32 44.5 C43 44.5 54 49 56 64 Z" fill={f.shirt} />
      <path d="M27.5 37 h9 v8.5 c0 2.5 -9 2.5 -9 0 Z" fill={f.skin} />
      <path d="M26 45 C28 49 36 49 38 45" stroke={P.white} strokeOpacity=".5" strokeWidth="1.5" fill="none" />
      {/* head */}
      <ellipse cx="32" cy="28.5" rx="12" ry="13.5" fill={f.skin} />
      <ellipse cx="20.3" cy="30" rx="1.8" ry="2.6" fill={f.skin} />
      <ellipse cx="43.7" cy="30" rx="1.8" ry="2.6" fill={f.skin} />
      {/* hair cap */}
      {f.style === "short" ? (
        <path d="M20 27 C19 16 26 13.5 32 13.5 C39 13.5 45 16.5 44 27 C42 21.5 37 20 32 20 C27 20 22 21 20 27 Z" fill={f.hair} />
      ) : (
        <path d="M19.6 30 C18 15.5 27 13 32 13 C39.5 13 46.5 17 44.4 30 C43 22.5 38 19.5 32 19.5 C26 19.5 21.5 22.5 19.6 30 Z" fill={f.hair} />
      )}
      {/* face */}
      <circle cx="27.3" cy="29.5" r="1.35" fill={P.ink} />
      <circle cx="36.7" cy="29.5" r="1.35" fill={P.ink} />
      <ellipse cx="24.5" cy="34" rx="2.2" ry="1.3" fill={P.red} opacity=".18" />
      <ellipse cx="39.5" cy="34" rx="2.2" ry="1.3" fill={P.red} opacity=".18" />
      {f.beard && <path d="M22.5 32 C23 41 27 43 32 43 C37 43 41 41 41.5 32 C39 37 36 37.5 32 37.5 C28 37.5 25 37 22.5 32 Z" fill={f.hair} />}
      <path d="M28.6 35 C30.5 37 33.5 37 35.4 35" stroke={P.ink} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {f.glasses && (
        <g stroke={P.ink} strokeWidth="1.1" fill="none">
          <circle cx="27.3" cy="29.5" r="3.6" />
          <circle cx="36.7" cy="29.5" r="3.6" />
          <path d="M30.9 29.3 h2.2" />
        </g>
      )}
    </g>
  );
}

export function Face({ who, size = 48, round = true }: { who: string; size?: number; round?: boolean }) {
  const f = PEOPLE[who] ?? PEOPLE.sunita;
  const id = `clip-${who}-${round ? "r" : "s"}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0, display: "block", borderRadius: round ? "50%" : 12 }} aria-hidden>
      <defs>
        <clipPath id={id}>{round ? <circle cx="32" cy="32" r="32" /> : <rect width="64" height="64" rx="10" />}</clipPath>
      </defs>
      <g clipPath={`url(#${id})`}><FaceArt f={f} /></g>
    </svg>
  );
}

/* ---------- Welcome hero: helper walking with a senior ---------- */
export function HeroIllustration() {
  const s = PEOPLE.sunita;
  const k = PEOPLE.kamala;
  return (
    <svg viewBox="0 0 340 200" width="100%" style={{ display: "block", borderRadius: 14 }} aria-label="A helper walking arm in arm with an older woman">
      <rect width="340" height="200" fill={P.cream} />
      {/* sun + clouds */}
      <circle cx="282" cy="46" r="20" fill={P.peach} />
      <path d="M40 52 h46 a10 10 0 0 0 -18 -10 a13 13 0 0 0 -24 4 a8 8 0 0 0 -4 6 Z" fill={P.white} />
      <path d="M200 34 h34 a8 8 0 0 0 -13 -8 a10 10 0 0 0 -18 3 a6 6 0 0 0 -3 5 Z" fill={P.white} />
      {/* house */}
      <g>
        <rect x="222" y="92" width="80" height="70" fill={P.white} />
        <path d="M214 96 L262 60 L310 96 Z" fill={P.peachDeep} />
        <rect x="252" y="122" width="20" height="40" rx="2" fill={P.sageDeep} />
        <circle cx="268" cy="143" r="1.6" fill={P.white} />
        <rect x="232" y="106" width="14" height="14" rx="2" fill={P.sky} />
        <rect x="280" y="106" width="14" height="14" rx="2" fill={P.sky} />
      </g>
      {/* bush + tree */}
      <circle cx="30" cy="150" r="22" fill={P.sage} />
      <circle cx="52" cy="158" r="16" fill={P.sageDeep} opacity=".55" />
      <rect x="318" y="120" width="5" height="42" fill="#a07a5c" />
      <circle cx="320" cy="112" r="18" fill={P.sage} />
      {/* ground */}
      <path d="M0 162 H340 V200 H0 Z" fill={P.sand} />
      <ellipse cx="150" cy="176" rx="78" ry="6" fill={P.ink} opacity=".07" />

      {/* --- Kamala (senior, left) --- */}
      <g transform="translate(92 66)">
        {/* cane */}
        <path d="M-6 52 L-12 110" stroke="#7a5a43" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M-6 52 c0 -6 8 -6 8 0" stroke="#7a5a43" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* legs */}
        <rect x="8" y="84" width="9" height="26" rx="4" fill="#6b5a7a" />
        <rect x="21" y="84" width="9" height="26" rx="4" fill="#6b5a7a" />
        <ellipse cx="12" cy="111" rx="7" ry="3.5" fill={P.ink} />
        <ellipse cx="26" cy="111" rx="7" ry="3.5" fill={P.ink} />
        {/* body (cardigan) */}
        <path d="M2 44 C2 34 36 34 36 44 L39 90 H-1 Z" fill={k.shirt} />
        <path d="M19 38 V90" stroke={P.white} strokeOpacity=".5" strokeWidth="1.5" />
        {/* arm to cane */}
        <path d="M5 48 C-2 52 -5 54 -6 56" stroke={k.shirt} strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="-6" cy="56" r="4" fill={k.skin} />
        {/* head */}
        <g transform="translate(-13 -18) scale(1)">
          <FaceArtHead f={k} />
        </g>
      </g>

      {/* --- Sunita (helper, right) --- */}
      <g transform="translate(152 54)">
        <rect x="10" y="94" width="10" height="28" rx="4" fill="#3e4a43" />
        <rect x="24" y="94" width="10" height="28" rx="4" fill="#3e4a43" />
        <ellipse cx="15" cy="123" rx="7.5" ry="3.5" fill={P.ink} />
        <ellipse cx="29" cy="123" rx="7.5" ry="3.5" fill={P.ink} />
        <path d="M2 50 C2 38 42 38 42 50 L44 98 H0 Z" fill={s.shirt} />
        {/* badge */}
        <rect x="27" y="52" width="9" height="11" rx="2" fill={P.white} />
        {/* arm linked with Kamala */}
        <path d="M6 56 C-6 62 -12 64 -18 62" stroke={s.shirt} strokeWidth="8.5" strokeLinecap="round" fill="none" />
        <circle cx="-18" cy="62" r="4.2" fill={s.skin} />
        {/* bag on other arm */}
        <path d="M40 56 C46 68 46 76 44 82" stroke={s.shirt} strokeWidth="8.5" strokeLinecap="round" fill="none" />
        <path d="M38 78 h18 l-2 22 h-14 Z" fill={P.peachDeep} />
        <path d="M42 78 c0 -7 10 -7 10 0" stroke={P.peachDeep} strokeWidth="2.5" fill="none" />
        <g transform="translate(-10 -12)">
          <FaceArtHead f={s} />
        </g>
      </g>

      {/* heart between them */}
      <path d="M150 52 c-4 -6 -13 -3 -11 4 c1 4 6 7 11 11 c5 -4 10 -7 11 -11 c2 -7 -7 -10 -11 -4 Z" fill={P.red} opacity=".85" />
    </svg>
  );
}

/** Just the head (no frame, no shoulders) for full-body scenes. */
function FaceArtHead({ f }: { f: FaceSpec }) {
  return (
    <g>
      {f.style === "long" && <path d="M17 30 C15 12 49 12 47 30 L49 52 C42 47 22 47 15 52 Z" fill={f.hair} />}
      {f.style === "bob" && <path d="M17.5 31 C15 13 49 13 46.5 31 L47 40 C42 42 22 42 17 40 Z" fill={f.hair} />}
      {f.style === "bun" && <circle cx="32" cy="11" r="6.5" fill={f.hair} />}
      <rect x="28" y="38" width="8" height="12" fill={f.skin} />
      <ellipse cx="32" cy="28.5" rx="12" ry="13.5" fill={f.skin} />
      <path d="M19.6 30 C18 15.5 27 13 32 13 C39.5 13 46.5 17 44.4 30 C43 22.5 38 19.5 32 19.5 C26 19.5 21.5 22.5 19.6 30 Z" fill={f.hair} />
      <circle cx="27.3" cy="29.5" r="1.35" fill={P.ink} />
      <circle cx="36.7" cy="29.5" r="1.35" fill={P.ink} />
      <ellipse cx="24.5" cy="34" rx="2.2" ry="1.3" fill={P.red} opacity=".2" />
      <ellipse cx="39.5" cy="34" rx="2.2" ry="1.3" fill={P.red} opacity=".2" />
      <path d="M28.6 35 C30.5 37 33.5 37 35.4 35" stroke={P.ink} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {f.glasses && (
        <g stroke={P.ink} strokeWidth="1.1" fill="none">
          <circle cx="27.3" cy="29.5" r="3.6" />
          <circle cx="36.7" cy="29.5" r="3.6" />
          <path d="M30.9 29.3 h2.2" />
        </g>
      )}
    </g>
  );
}

/* ---------- Service icons ---------- */
const SERVICE_BG: Record<string, string> = {
  Companionship: P.peach,
  "Appointment escort": P.sky,
  Errands: P.sand,
  "Tech help": P.lilac,
  "Home help": P.sage,
  "Wellness check": "#f6d6d4",
};

export function ServiceIcon({ name, size = 40 }: { name: string; size?: number }) {
  const st = { stroke: P.ink, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let art: React.ReactNode;
  switch (name) {
    case "Companionship":
      art = (<>
        <rect x="9" y="13" width="17" height="12" rx="5" fill={P.white} {...{ stroke: P.ink, strokeWidth: 1.8 }} />
        <path d="M13 25 l-2 4 l5 -4" {...st} fill={P.white} />
        <rect x="18" y="20" width="14" height="10" rx="4.5" fill={P.ink} />
        <circle cx="22" cy="25" r="1" fill={P.white} /><circle cx="25" cy="25" r="1" fill={P.white} /><circle cx="28" cy="25" r="1" fill={P.white} />
      </>);
      break;
    case "Appointment escort":
      art = (<>
        <rect x="9" y="11" width="22" height="20" rx="3" fill={P.white} stroke={P.ink} strokeWidth="1.8" />
        <path d="M20 15.5 v9 M15.5 20 h9" stroke={P.red} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M9 31 h22" {...st} />
      </>);
      break;
    case "Errands":
      art = (<>
        <path d="M11 16 h18 l-1.5 15 h-15 Z" fill={P.white} {...{ stroke: P.ink, strokeWidth: 1.8, strokeLinejoin: "round" }} />
        <path d="M15.5 16 c0 -6 9 -6 9 0" {...st} />
        <circle cx="17" cy="23" r="2" fill={P.peachDeep} /><path d="M22 21 l3 4" stroke={P.sageDeep} strokeWidth="2.4" strokeLinecap="round" />
      </>);
      break;
    case "Tech help":
      art = (<>
        <rect x="13" y="9" width="14" height="24" rx="3" fill={P.white} stroke={P.ink} strokeWidth="1.8" />
        <path d="M18 29.5 h4" {...st} />
        <path d="M16.5 19 l2.5 2.5 l5 -5" stroke={P.sageDeep} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>);
      break;
    case "Home help":
      art = (<>
        <path d="M10 20 L20 11 L30 20 V31 H10 Z" fill={P.white} {...{ stroke: P.ink, strokeWidth: 1.8, strokeLinejoin: "round" }} />
        <rect x="17" y="23" width="6" height="8" fill={P.peachDeep} />
        <path d="M27 8 l1 2.5 l2.5 1 l-2.5 1 l-1 2.5 l-1 -2.5 l-2.5 -1 l2.5 -1 Z" fill={P.ink} />
      </>);
      break;
    default:
      art = (<>
        <path d="M20 31 C10 24 8 19 10 15.5 C12.5 11 18 12 20 16 C22 12 27.5 11 30 15.5 C32 19 30 24 20 31 Z" fill={P.white} stroke={P.ink} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11 21 h5 l2 -3 l3 6 l2 -3 h6" stroke={P.red} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden style={{ display: "block" }}>
      <rect width="40" height="40" rx="10" fill={SERVICE_BG[name] ?? P.cream} />
      {art}
    </svg>
  );
}

/* ---------- Helper intro video cover ---------- */
export function VideoCover({ who = "sunita" }: { who?: string }) {
  const f = PEOPLE[who] ?? PEOPLE.sunita;
  return (
    <svg viewBox="0 0 390 210" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ position: "absolute", inset: 0 }} aria-hidden>
      <rect width="390" height="210" fill={f.bg} />
      {/* window */}
      <rect x="40" y="30" width="90" height="100" rx="6" fill={P.white} opacity=".7" />
      <path d="M85 30 V130 M40 80 H130" stroke={f.bg} strokeWidth="5" />
      {/* plant */}
      <path d="M318 170 h36 l-4 40 h-28 Z" fill={P.peachDeep} />
      <path d="M336 170 C320 140 318 120 326 104 M336 170 C340 140 350 126 362 118 M336 170 C334 150 338 132 344 120" stroke={P.sageDeep} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* person */}
      <g transform="translate(125 34) scale(2.75)"><FaceArt f={f} framed={false} /></g>
    </svg>
  );
}

/* ---------- In-visit photos ---------- */
export function VisitPhoto({ kind }: { kind: "waiting" | "clinic" | "pharmacy" | "smile" }) {
  return (
    <svg viewBox="0 0 120 90" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block", borderRadius: 8 }} aria-hidden>
      {kind === "waiting" && (<>
        <rect width="120" height="90" fill={P.sky} />
        <rect x="0" y="62" width="120" height="28" fill={P.sand} />
        <rect x="84" y="14" width="24" height="18" rx="2" fill={P.white} />
        <path d="M96 18 v10 M91 23 h10" stroke={P.red} strokeWidth="2.5" />
        <rect x="10" y="56" width="62" height="8" rx="3" fill="#8b8f99" />
        <g transform="translate(8 20) scale(.62)"><FaceArt f={PEOPLE.kamala} framed={false} /></g>
        <g transform="translate(36 18) scale(.62)"><FaceArt f={PEOPLE.sunita} framed={false} /></g>
      </>)}
      {kind === "clinic" && (<>
        <rect width="120" height="90" fill={P.sky} />
        <rect x="22" y="26" width="76" height="52" fill={P.white} />
        <rect x="50" y="14" width="20" height="16" rx="2" fill={P.white} />
        <path d="M60 17 v10 M55 22 h10" stroke={P.red} strokeWidth="2.5" />
        {[30, 48, 66, 84].map((x) => <rect key={x} x={x - 2} y="38" width="10" height="10" rx="1" fill={P.skyDeep} opacity=".6" />)}
        <rect x="52" y="58" width="16" height="20" fill={P.sageDeep} />
        <rect x="0" y="78" width="120" height="12" fill={P.sand} />
      </>)}
      {kind === "pharmacy" && (<>
        <rect width="120" height="90" fill={P.sand} />
        <path d="M38 36 h44 l-4 46 h-36 Z" fill={P.white} />
        <path d="M50 36 c0 -12 20 -12 20 0" stroke={P.ink} strokeWidth="2" fill="none" />
        <rect x="50" y="50" width="20" height="20" rx="4" fill={P.sage} />
        <path d="M60 54 v12 M54 60 h12" stroke={P.sageDeep} strokeWidth="3" />
        <rect x="86" y="58" width="10" height="24" rx="3" fill={P.peachDeep} />
        <rect x="85" y="54" width="12" height="6" rx="2" fill={P.white} />
      </>)}
      {kind === "smile" && (<>
        <rect width="120" height="90" fill={P.peach} />
        <circle cx="96" cy="20" r="10" fill={P.white} opacity=".6" />
        <g transform="translate(14 14) scale(1.2)"><FaceArt f={PEOPLE.kamala} framed={false} /></g>
        <g transform="translate(52 18) scale(1.1)"><FaceArt f={PEOPLE.sunita} framed={false} /></g>
      </>)}
    </svg>
  );
}

/* ---------- Small spot illustrations ---------- */
export function EmptyCalendar() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
      <circle cx="28" cy="28" r="28" fill={P.cream} />
      <rect x="14" y="16" width="28" height="26" rx="4" fill={P.white} stroke={P.ink} strokeWidth="1.6" />
      <path d="M14 23 h28" stroke={P.ink} strokeWidth="1.6" />
      <path d="M20 13 v6 M36 13 v6" stroke={P.ink} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="28" cy="32" r="4" fill={P.peach} />
    </svg>
  );
}

export function SuccessBurst() {
  return (
    <svg width="150" height="120" viewBox="0 0 150 120" aria-hidden style={{ display: "block", margin: "0 auto" }}>
      <circle cx="75" cy="60" r="48" fill={P.sage} />
      <circle cx="75" cy="60" r="34" fill={P.white} stroke={P.ink} strokeWidth="2.5" />
      <path d="M60 61 l10 10 l20 -22" stroke={P.ink} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="30" r="4" fill={P.peachDeep} />
      <circle cx="136" cy="24" r="3" fill={P.skyDeep} />
      <circle cx="132" cy="96" r="4.5" fill={P.peach} />
      <circle cx="16" cy="92" r="3" fill={P.sageDeep} />
      <path d="M126 50 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill={P.ink} />
      <path d="M26 58 l1.5 3.5 l3.5 1.5 l-3.5 1.5 l-1.5 3.5 l-1.5 -3.5 l-3.5 -1.5 l3.5 -1.5 Z" fill={P.ink} />
    </svg>
  );
}

export function NoteIcon({ kind }: { kind: "message" | "family" | "bell" }) {
  const bg = kind === "message" ? P.peach : kind === "family" ? P.sage : P.sky;
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden style={{ flexShrink: 0 }}>
      <rect width="34" height="34" rx="9" fill={bg} />
      {kind === "message" && <path d="M9 11 h16 v10 h-9 l-4 4 v-4 h-3 Z" fill={P.white} stroke={P.ink} strokeWidth="1.5" strokeLinejoin="round" />}
      {kind === "family" && (<>
        <circle cx="13" cy="13" r="3.5" fill={P.white} stroke={P.ink} strokeWidth="1.5" />
        <circle cx="22" cy="14" r="3" fill={P.white} stroke={P.ink} strokeWidth="1.5" />
        <path d="M7 25 c0 -5 12 -5 12 0 M17 25 c0 -4 10 -4 10 0" stroke={P.ink} strokeWidth="1.5" fill={P.white} />
      </>)}
      {kind === "bell" && (<>
        <path d="M11 22 v-5 a6 6 0 0 1 12 0 v5 l2 2 h-16 Z" fill={P.white} stroke={P.ink} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M15 26 a2 2 0 0 0 4 0" stroke={P.ink} strokeWidth="1.5" fill="none" />
      </>)}
    </svg>
  );
}

export function SorryArt() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden style={{ flexShrink: 0 }}>
      <circle cx="28" cy="28" r="28" fill={P.peach} />
      <path d="M28 42 C16 34 13 28 15.5 23 C18.5 17.5 25 18.5 28 23.5 C31 18.5 37.5 17.5 40.5 23 C43 28 40 34 28 42 Z" fill={P.white} stroke={P.ink} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M22 28 h12" stroke={P.ink} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
