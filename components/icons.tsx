import { Coffee, HeartPulse, ShoppingBasket, Smartphone, Sparkles, Stethoscope, type LucideIcon } from "lucide-react";
import type { ServiceId } from "./data";
import { svc } from "./data";

export const SERVICE_ICON: Record<ServiceId, LucideIcon> = {
  companion: Coffee,
  escort: Stethoscope,
  errands: ShoppingBasket,
  home: Sparkles,
  tech: Smartphone,
  wellness: HeartPulse,
};

export function ServiceGlyph({ id, size = 44, radius = 14 }: { id: ServiceId; size?: number; radius?: number }) {
  const s = svc(id);
  const Icon = SERVICE_ICON[id];
  return (
    <span className="glyph" style={{ width: size, height: size, borderRadius: radius, background: s.tint, color: s.hue }}>
      <Icon size={size * 0.48} strokeWidth={2.1} />
    </span>
  );
}

/** The Kinly mark: an arch sheltering two people. Drawn in currentColor. */
export function KinlyMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.86} viewBox="0 0 420 360" fill="currentColor" aria-hidden>
      <path d="M26 232 A184 204 0 0 1 394 232" fill="none" stroke="currentColor" strokeWidth={48} strokeLinecap="round" />
      <circle cx={158} cy={182} r={40} />
      <path d="M97 352 C97 292 122 250 160 250 C198 250 222 292 222 352 Z" />
      <circle cx={274} cy={224} r={34} />
      <path d="M228 352 C228 306 248 280 275 280 C302 280 322 306 322 352 Z" />
    </svg>
  );
}
