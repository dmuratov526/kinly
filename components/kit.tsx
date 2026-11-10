"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, animate, type PanInfo } from "motion/react";
import { BadgeCheck, ChevronLeft, ChevronsRight, Star, Check, ShieldCheck, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useStore } from "./store";

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
export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  const [host, setHost] = useState<Element | null>(null);
  useEffect(() => setHost(document.querySelector(".screen-glass")), []);
  if (!host) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="sheet-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="sheet"
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

/* ---------- emergency countdown ---------- */

/** One tap starts it, five seconds to cancel. No press-and-hold: in a real emergency there may be no time or strength for it. */
export function SosCountdown({ open, onCancel, onDone, big, sub }: { open: boolean; onCancel: () => void; onDone: () => void; big?: boolean; sub: string }) {
  const SECS = 5;
  const [n, setN] = useState(SECS);
  useEffect(() => {
    if (!open) return;
    setN(SECS);
    const id = setInterval(() => setN((x) => x - 1), 1000);
    return () => clearInterval(id);
  }, [open]);
  useEffect(() => {
    if (open && n <= 0) onDone();
  }, [open, n, onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className={`sos-count ${big ? "big" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="sos-count-ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" className="bg" />
              <motion.circle cx="60" cy="60" r="54" className="fg" pathLength={1} initial={{ pathLength: 1 }} animate={{ pathLength: 0 }} transition={{ duration: SECS, ease: "linear" }} />
            </svg>
            <AnimatePresence mode="popLayout">
              <motion.b key={n} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>{Math.max(n, 0)}</motion.b>
            </AnimatePresence>
          </div>
          <h2>Calling for help</h2>
          <p>{sub}</p>
          <button className="sos-count-now" onClick={onDone}>Call now</button>
          <button className="sos-count-cancel" onClick={onCancel}>Cancel</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
