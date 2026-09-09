"use client";

import React, { useId, useMemo } from "react";
import { PATTERN_ICONS } from "@/lib/partner-store-patterns";

const TILE = 340;
const COLS = 4;
const ROWS = 4;

// tiny deterministic PRNG so a store's wallpaper is stable across renders
function mulberry(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Repeating category doodle backdrop for a partner storefront / dashboard.
 * The icons are stroked in `color` (the store's accent) at low opacity.
 *
 *   <StorePattern pattern="fashion" color="#6D28D9" />
 *
 * Renders an absolutely-positioned SVG - the parent should be `relative`
 * (or this can be `fixed`, via className) with content layered above it.
 */
export default function StorePattern({
  pattern,
  color = "#6D28D9",
  opacity = 0.09,
  className = "",
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const icons = PATTERN_ICONS[pattern];

  const placed = useMemo(() => {
    if (!icons?.length) return [];
    const rand = mulberry(seedFrom(pattern));
    const cell = TILE / COLS;
    const out = [];
    for (let gy = 0; gy < ROWS; gy++) {
      for (let gx = 0; gx < COLS; gx++) {
        const d = icons[Math.floor(rand() * icons.length)];
        const x = gx * cell + cell / 2 + (rand() - 0.5) * cell * 0.55;
        const y = gy * cell + cell / 2 + (rand() - 0.5) * cell * 0.55;
        const rot = (rand() - 0.5) * 44;
        const scale = 1.45 + rand() * 1.15;
        out.push({ d, x, y, rot, scale });
      }
    }
    return out;
  }, [icons, pattern]);

  if (!placed.length) return null;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ color }}
    >
      <defs>
        <pattern
          id={`sp-${uid}`}
          x="0"
          y="0"
          width={TILE}
          height={TILE}
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={opacity}
          >
            {placed.map((p, i) => (
              <path
                key={i}
                d={p.d}
                vectorEffect="non-scaling-stroke"
                transform={`translate(${p.x} ${p.y}) rotate(${p.rot}) scale(${p.scale}) translate(-12 -12)`}
              />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#sp-${uid})`} />
    </svg>
  );
}
