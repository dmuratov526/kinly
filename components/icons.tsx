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
