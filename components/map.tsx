"use client";

/* A real street map without a map library: OpenStreetMap raster tiles placed by hand,
   with Sunita's route (traced along real streets) drawn on top in SVG. */

import { animate } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { MOM_HOME, PEOPLE, ROUTE, type LatLon } from "./data";
import { useStore } from "./store";

const TILE = 256;
const wx = (lon: number, z: number) => ((lon + 180) / 360) * TILE * 2 ** z;
const wy = (lat: number, z: number) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * TILE * 2 ** z;
};

/* cumulative length along the route, so a 0..1 progress maps to a point on the streets */
const SEG = ROUTE.slice(1).map((p, i) => Math.hypot(wx(p[1], 0) - wx(ROUTE[i][1], 0), wy(p[0], 0) - wy(ROUTE[i][0], 0)));
const TOTAL = SEG.reduce((a, b) => a + b, 0);
export function pointAt(p: number): { at: LatLon; idx: number } {
  let d = Math.max(0, Math.min(1, p)) * TOTAL;
  for (let i = 0; i < SEG.length; i++) {
    if (d <= SEG[i] || i === SEG.length - 1) {
      const t = SEG[i] ? Math.min(1, d / SEG[i]) : 0;
      const a = ROUTE[i], b = ROUTE[i + 1];
      return { at: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], idx: i };
    }
    d -= SEG[i];
  }
  return { at: MOM_HOME, idx: SEG.length - 1 };
}

/* ---------- shared drive clock: every map shows the same car position ---------- */

export const DRIVE_MS = 16000;
const DRIVE_END = 0.86;

/** restart: replay the drive when this screen opens and the last one already finished (keeps the demo fresh) */
export function useDrive(restart = false) {
  const { live, driveStart, setLive } = useStore();
  useEffect(() => {
    if (restart && live === 0 && Date.now() - driveStart > DRIVE_MS) setLive(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [p, setP] = useState(live === 0 ? 0 : 1);
  const cur = useRef(p);
  useEffect(() => {
    const set = (v: number) => { cur.current = v; setP(v); };
    if (live !== 0) {
      const a = animate(cur.current, 1, { duration: 0.8, ease: "easeOut", onUpdate: set });
      return () => a.stop();
    }
    let raf = 0;
    const tick = () => {
      const v = Math.min(DRIVE_END, (Date.now() - driveStart) / DRIVE_MS);
      set(v);
      if (v < DRIVE_END) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [live, driveStart]);
  return { p, mins: Math.max(1, Math.round(6 - p * 6)) };
}

/* ---------- the map ---------- */

type Pad = { top?: number; right?: number; bottom?: number; left?: number };

export function StreetMap({
  progress, fit, center, zoom = 15.5, pad = {}, carScale = 1, attribution = true, className = "", children,
}: {
  progress: number;
  /** fit the whole route in view, or follow a point at a fixed zoom */
  fit?: boolean;
  center?: LatLon;
  zoom?: number;
  pad?: Pad;
  carScale?: number;
  attribution?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<[number, number] | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize([el.clientWidth, el.clientHeight]);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const car = pointAt(progress);
  let body: ReactNode = null;

  if (size && size[0] > 0 && size[1] > 0) {
    const [W, H] = size;
    const t = pad.top ?? 0, r = pad.right ?? 0, b = pad.bottom ?? 0, l = pad.left ?? 0;
    const vw = Math.max(40, W - l - r), vh = Math.max(40, H - t - b);

    let zf = zoom;
    let mid: LatLon = center ?? car.at;
    if (fit) {
      const xs = ROUTE.map((p) => wx(p[1], 0)), ys = ROUTE.map((p) => wy(p[0], 0));
      const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      zf = Math.min(17, Math.log2(Math.min(vw / (x1 - x0), vh / (y1 - y0))));
      const lats = ROUTE.map((p) => p[0]), lons = ROUTE.map((p) => p[1]);
      mid = [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lons) + Math.max(...lons)) / 2];
    }

    const ox = wx(mid[1], zf) - (l + vw / 2);
    const oy = wy(mid[0], zf) - (t + vh / 2);
    const tz = Math.min(19, Math.round(zf));
    const ts = TILE * 2 ** (zf - tz);
    const tiles: ReactNode[] = [];
    for (let x = Math.floor(ox / ts); x <= Math.floor((ox + W) / ts); x++) {
      for (let y = Math.floor(oy / ts); y <= Math.floor((oy + H) / ts); y++) {
        tiles.push(
          // eslint-disable-next-line @next/next/no-img-element
          <img key={`${tz}-${x}-${y}`} className="smap-tile" alt="" draggable={false}
            src={`https://tile.openstreetmap.org/${tz}/${x}/${y}.png`}
            style={{ left: x * ts - ox, top: y * ts - oy, width: ts + 0.5, height: ts + 0.5 }} />,
        );
      }
    }

    const px = (p: LatLon) => [wx(p[1], zf) - ox, wy(p[0], zf) - oy] as const;
    const all = ROUTE.map(px).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const [cx, cy] = px(car.at);
    const done = [...ROUTE.slice(0, car.idx + 1).map(px), [cx, cy] as const].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const [hx, hy] = px(MOM_HOME);

    body = (
      <>
        {tiles}
        <svg className="smap-svg" width={W} height={H}>
          <defs>
            <linearGradient id={`rt${uid}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#FF8A4C" />
              <stop offset="1" stopColor="#FF4F7B" />
            </linearGradient>
            <clipPath id={`mc${uid}`}><circle cx="0" cy="-31" r="15" /></clipPath>
          </defs>
          <polyline points={all} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
          <polyline points={all} fill="none" stroke="rgba(23,20,31,.35)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 8" />
          <polyline points={done} fill="none" stroke={`url(#rt${uid})`} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />

          {/* Mom's home */}
          <g transform={`translate(${hx} ${hy})`}>
            <circle r="22" fill="#FF4F7B" className="smap-ping" />
            <path d="M -18 -20 a 18 18 0 1 1 36 0 c 0 12 -18 30 -18 30 c 0 0 -18 -18 -18 -30 z" transform="translate(0 -10)" fill="#fff" />
            <image href={PEOPLE.mom.photo} x="-15" y="-46" width="30" height="30" clipPath={`url(#mc${uid})`} preserveAspectRatio="xMidYMid slice" />
          </g>

          {/* Sunita's car */}
          <g transform={`translate(${cx} ${cy}) scale(${carScale})`}>
            <circle r="20" fill="#FF4F7B" opacity=".2" />
            <circle r="13" fill="#fff" />
            <circle r="10" fill={`url(#rt${uid})`} />
            <path d="M -4.5 1 l 1.5 -4 h 6 l 1.5 4 v 3 h -9 z" fill="#fff" />
          </g>
        </svg>
      </>
    );
  }

  return (
    <div ref={ref} className={`smap ${className}`}>
      {body}
      {children}
      {attribution && <span className="smap-attr">© OpenStreetMap</span>}
    </div>
  );
}
