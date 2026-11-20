"use client";

import React, { useMemo, useRef, useState } from "react";
import { formatPrice } from "@/lib/merchant-data";

const RANGES = [
  { value: "3d", label: "3 days" },
  { value: "7d", label: "1 week" },
  { value: "1m", label: "1 month" },
  { value: "3m", label: "3 months" },
];

const WIDTH = 600;
const HEIGHT = 200;
const PAD_LEFT = 44;
const PAD_RIGHT = 12;
const PAD_TOP = 12;
const PAD_BOTTOM = 24;

function niceMax(value) {
  if (value <= 0) return 10;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

function compactPrice(n) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n}`;
}

export default function RevenueChart({ days, range, onRangeChange, isLoading }) {
  const svgRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const points = useMemo(() => days ?? [], [days]);
  const maxRevenue = useMemo(
    () => niceMax(Math.max(...points.map((d) => d.revenue), 0)),
    [points],
  );

  const xFor = (i) =>
    points.length <= 1
      ? PAD_LEFT + plotW / 2
      : PAD_LEFT + (i / (points.length - 1)) * plotW;
  const yFor = (v) => PAD_TOP + plotH - (v / maxRevenue) * plotH;

  const linePath = points
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.revenue)}`)
    .join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L ${xFor(points.length - 1)} ${PAD_TOP + plotH} L ${xFor(0)} ${PAD_TOP + plotH} Z`
      : "";

  // Sparse x-axis labels: first, last, and up to 3 evenly spaced in between -
  // showing every date would overlap on a 90-day range.
  const labelIndices = useMemo(() => {
    const n = points.length;
    if (n === 0) return [];
    if (n <= 5) return points.map((_, i) => i);
    const count = 5;
    return Array.from({ length: count }, (_, i) =>
      Math.round((i * (n - 1)) / (count - 1)),
    );
  }, [points]);

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  const handlePointerMove = (e) => {
    if (points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < points.length; i++) {
      const d = Math.abs(xFor(i) - px);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    setHoverIndex(nearest);
  };

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const total = points.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[13px] font-semibold text-shop-heading">Revenue</p>
          {!isLoading && (
            <p className="text-[11.5px] text-shop-text/60">
              {formatPrice(total)} total in this period
            </p>
          )}
        </div>
        <div className="flex gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => onRangeChange(r.value)}
              className={`rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
                range === r.value
                  ? "bg-shop-accent-1 text-white"
                  : "bg-shop-bg text-shop-text hover:bg-shop-accent-1-light"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-[200px] w-full animate-pulse rounded-[10px] bg-shop-bg" />
      ) : points.length === 0 || total === 0 ? (
        <div className="flex h-[200px] w-full items-center justify-center text-[12.5px] text-shop-text/60">
          No revenue in this period.
        </div>
      ) : (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full touch-none"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        >
          {gridLines.map((g) => {
            const y = PAD_TOP + plotH - g * plotH;
            return (
              <g key={g}>
                <line
                  x1={PAD_LEFT}
                  x2={WIDTH - PAD_RIGHT}
                  y1={y}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={PAD_LEFT - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#6b7280"
                >
                  {compactPrice(Math.round(maxRevenue * g))}
                </text>
              </g>
            );
          })}

          {labelIndices.map((i) => (
            <text
              key={i}
              x={xFor(i)}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize="9"
              fill="#6b7280"
            >
              {new Date(points[i].date).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
              })}
            </text>
          ))}

          <path d={areaPath} fill="#6d28d9" opacity="0.1" />
          <path
            d={linePath}
            fill="none"
            stroke="#6d28d9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {hoverIndex !== null && (
            <>
              <line
                x1={xFor(hoverIndex)}
                x2={xFor(hoverIndex)}
                y1={PAD_TOP}
                y2={PAD_TOP + plotH}
                stroke="#9ca3af"
                strokeWidth="1"
              />
              <circle
                cx={xFor(hoverIndex)}
                cy={yFor(points[hoverIndex].revenue)}
                r="4"
                fill="#6d28d9"
                stroke="#fff"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      )}

      {hovered && (
        <div className="pointer-events-none -mt-2 flex items-center justify-between rounded-[8px] bg-shop-bg px-3 py-2 text-[11.5px]">
          <span className="text-shop-text/70">
            {new Date(hovered.date).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="font-semibold text-shop-heading">
            {formatPrice(hovered.revenue)}
          </span>
        </div>
      )}
    </div>
  );
}
