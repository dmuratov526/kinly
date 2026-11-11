"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, animate, type PanInfo } from "motion/react";
import { BadgeCheck, ChevronDown, ChevronLeft, ChevronsRight, Star, Check, ShieldCheck, ShoppingCart, X, Info } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useStore } from "./store";
import { svc, type ServiceId } from "./data";

export const spring = { type: "spring", stiffness: 420, damping: 34 } as const;
export const softSpring = { type: "spring", stiffness: 260, damping: 30 } as const;

/* ---------- people ---------- */

export function Avatar({ src, size = 44, ring, online, style }: { src: string; size?: number; ring?: string; online?: boolean; style?: CSSProperties }) {
  return (
    <span className="avatar" style={{ width: size, height: size, ...(ring ? { boxShadow: `0 0 0 2.5px var(--surface), 0 0 0 4.5px ${ring}` } : null), ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" draggable={false} />
      {online && <span className="online" />}
    </span>
  );
}

export function Verified({ size = 16 }: { size?: number }) {
  return <BadgeCheck size={size} className="verified" fill="currentColor" stroke="var(--surface)" strokeWidth={2.2} aria-label="Verified" />;
}

export function Rating({ value, count, size = 13 }: { value: number; count?: number; size?: number }) {
  return (
    <span className="rating" style={{ fontSize: size }}>
      <Star size={size} fill="currentColor" strokeWidth={0} />
      <b>{value.toFixed(value % 1 === 0 ? 1 : 2).replace(/0$/, "")}</b>
      {count != null && <span className="muted">({count})</span>}
    </span>
  );
}

/* ---------- layout ---------- */

export function TopBar({ title, sub, right, transparent }: { title?: string; sub?: string; right?: ReactNode; transparent?: boolean }) {
  const { back } = useStore();
  return (
    <div className={`topbar ${transparent ? "clear" : ""}`}>
      <Tap className="icon-btn" onClick={back} aria-label="Back"><ChevronLeft size={22} /></Tap>
      <div className="topbar-title">
        {title && <b>{title}</b>}
        {sub && <span>{sub}</span>}
      </div>
      <div className="topbar-right">{right}</div>
    </div>
  );
}

export function Section({ title, action, onAction, children, style }: { title: string; action?: string; onAction?: () => void; children: ReactNode; style?: CSSProperties }) {
  return (
    <section className="section" style={style}>
      <div className="section-head">
        <h3>{title}</h3>
        {action && <button onClick={onAction}>{action}</button>}
      </div>
      {children}
    </section>
  );
}

type TapProps = React.ComponentProps<typeof motion.button>;
/** Button with a springy press. */
export function Tap({ children, ...p }: TapProps) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} transition={spring} {...p}>
      {children}
    </motion.button>
  );
}

export function Btn({ kind = "primary", children, className = "", ...p }: TapProps & { kind?: "primary" | "brand" | "ghost" | "soft" | "danger" | "light" }) {
  return (
    <Tap className={`btn ${kind} ${className}`} {...p}>
      {children}
    </Tap>
  );
}

/* ---------- sheet ---------- */

/** Rendered into the phone screen itself, so it covers everything even when the page underneath is scrolled. */
export function Sheet({ open, onClose, children, title, className = "" }: { open: boolean; onClose: () => void; children: ReactNode; title?: string; className?: string }) {
  const [host, setHost] = useState<Element | null>(null);
  useEffect(() => setHost(document.querySelector(".screen-glass")), []);
  if (!host) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="sheet-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className={`sheet ${className}`}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={softSpring}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i: PanInfo) => { if (i.offset.y > 90 || i.velocity.y > 500) onClose(); }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grabber" />
            {title && <h3 className="sheet-title">{title}</h3>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    host,
  );
}

/* ---------- slide to confirm ---------- */

export function SlideToConfirm({ label, onDone, disabled }: { label: string; onDone: () => void; disabled?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [done, setDone] = useState(false);
  const KNOB = 56;
  const max = () => (track.current ? track.current.offsetWidth - KNOB - 8 : 260);
  const fill = useTransform(x, (v) => v + KNOB + 4);
  const textOpacity = useTransform(x, [0, 120], [1, 0]);

  return (
    <div className={`slide ${disabled ? "off" : ""} ${done ? "done" : ""}`} ref={track}>
      <motion.div className="slide-fill" style={{ width: fill }} />
      <motion.span className="slide-label" style={{ opacity: textOpacity }}>
        <span className="shimmer">{label}</span>
      </motion.span>
      <motion.div
        className="slide-knob"
        drag={disabled || done ? false : "x"}
        dragConstraints={track}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={() => {
          if (x.get() > max() * 0.82) {
            animate(x, max(), { ...spring });
            setDone(true);
            setTimeout(onDone, 380);
          } else animate(x, 0, spring);
        }}
        onTap={() => {
          if (disabled || done) return;
          // tapping nudges the knob so people learn the gesture
          animate(x, [0, 42, 0], { duration: 0.6 });
        }}
      >
        {done ? <Check size={24} strokeWidth={3} /> : <ChevronsRight size={24} />}
      </motion.div>
    </div>
  );
}

/* ---------- stagger helpers ---------- */

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
export const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: softSpring },
};

export function Stagger({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <motion.div className={className} style={style} variants={stagger} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}
export function Rise({ children, className, style, onClick }: { children: ReactNode; className?: string; style?: CSSProperties; onClick?: () => void }) {
  return (
    <motion.div className={className} style={style} variants={rise} onClick={onClick}>
      {children}
    </motion.div>
  );
}

export function Money({ v, cents }: { v: number; cents?: boolean }) {
  return <>${cents ? v.toFixed(2) : Math.round(v).toLocaleString("en-US")}</>;
}

/* ---------- Kinly Safe ---------- */

/** Trust badge. A span, not a button, so it can sit inside tappable cards. */
export function KinlySafe({ big }: { big?: boolean }) {
  const { showSafe } = useStore();
  return (
    <motion.span
      role="button" tabIndex={0} className={`ksafe ${big ? "big" : ""}`} whileTap={{ scale: 0.94 }}
      onClick={(e) => { e.stopPropagation(); showSafe(); }}
      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); showSafe(); } }}
    >
      <ShieldCheck size={big ? 15 : 13} strokeWidth={2.4} /> Kinly Safe
    </motion.span>
  );
}

/* ---------- cart ---------- */

export function CartButton() {
  const { cart, tab } = useStore();
  return (
    <Tap className="icon-btn raised" onClick={() => tab("cart")} aria-label={`Cart, ${cart.length} visits`}>
      <ShoppingCart size={20} />
      <CountBadge n={cart.length} />
    </Tap>
  );
}

export function CountBadge({ n }: { n: number }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span key={n} className="count-badge" initial={{ scale: 0.3 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 600, damping: 18 }}>
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ---------- asking for help (no timers, no pressure) ---------- */

/** Mom's side: one calm question, two huge answers. If she can't answer, family is called, not 911. */
export function HelpAsk({ open, onYes, onNo, onSilent }: { open: boolean; onYes: () => void; onNo: () => void; onSilent: () => void }) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onSilent, 30000);
    return () => clearTimeout(id);
  }, [open, onSilent]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="help-ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="help-ask-card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={softSpring}>
            <h2>Do you need help?</h2>
            <p>We&apos;re right here, Kamala.</p>
            <button className="help-yes" onClick={onYes}>Yes, call for help</button>
            <button className="help-no" onClick={onNo}>I&apos;m okay</button>
            <span className="help-note">If you don&apos;t answer, we&apos;ll call Rohan.</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- what a service covers (and doesn't) ---------- */

export function ServiceScope({ id, open: start = false }: { id: ServiceId; open?: boolean }) {
  const s = svc(id);
  const [open, setOpen] = useState(start);
  return (
    <div className={`scope ${open ? "open" : ""}`} style={{ ["--hue" as string]: s.hue, ["--tint" as string]: s.tint }}>
      <button className="scope-head" onClick={() => setOpen(!open)}>
        <span>What <b>{s.name}</b> covers</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
            <div className="scope-body">
              {s.includes.map((x) => <div key={x} className="scope-row yes"><Check size={15} strokeWidth={3} />{x}</div>)}
              {s.excludes.map((x) => <div key={x} className="scope-row no"><X size={15} strokeWidth={3} />{x}</div>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** The same scope, tucked behind an (i) next to a heading. */
export function ServiceScopeInfo({ id }: { id: ServiceId }) {
  const s = svc(id);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="info-dot" onClick={() => setOpen(true)} aria-label={`What ${s.name} covers`}><Info size={17} /></button>
      <Sheet open={open} onClose={() => setOpen(false)} title={`What ${s.name} covers`}>
        <div className="scope open" style={{ ["--hue" as string]: s.hue, ["--tint" as string]: s.tint }}>
          <div className="scope-body" style={{ paddingTop: 14 }}>
            {s.includes.map((x) => <div key={x} className="scope-row yes"><Check size={15} strokeWidth={3} />{x}</div>)}
            {s.excludes.map((x) => <div key={x} className="scope-row no"><X size={15} strokeWidth={3} />{x}</div>)}
          </div>
        </div>
        <Btn kind="soft" style={{ width: "100%", marginTop: 14 }} onClick={() => setOpen(false)}>Got it</Btn>
      </Sheet>
    </>
  );
}

/* ---------- one more look before anything is booked ---------- */

export type ConfirmRow = { photo: string; title: string; sub: string; price: number };

/** Every booking shortcut opens this first: a summary and a slide, so a stray tap never books. */
export function ConfirmBooking({ open, onClose, title = "Book this visit?", rows, note, onConfirm }: {
  open: boolean; onClose: () => void; title?: string; rows: ConfirmRow[]; note?: string; onConfirm: () => void;
}) {
  const total = rows.reduce((a, r) => a + r.price, 0);
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <div className="stack-14">
        {rows.map((r) => (
          <div key={r.title + r.sub} className="cancel-card">
            <Avatar src={r.photo} size={46} />
            <div className="grow">
              <b>{r.title}</b>
              <span>{r.sub}</span>
            </div>
            <b>${r.price}</b>
          </div>
        ))}
        <p className="cancel-note">{note ?? "Charged to Visa ·· 4242 after each visit. Free cancellation until 24 hrs before."}</p>
        {open && <SlideToConfirm label={`Slide to book · $${total}`} onDone={() => { onClose(); onConfirm(); }} />}
        <Btn kind="ghost" style={{ width: "100%" }} onClick={onClose}>Not now</Btn>
      </div>
    </Sheet>
  );
}
