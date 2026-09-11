"use client";

import React, { useState } from "react";
import {
  Activity,
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton, SkeletonRows } from "@/components/ui/skeleton";
import { useGetAdminAnalyticsQuery } from "@/lib/api/adminApi";

// Validated categorical palette (dataviz skill's reference instance) - slots
// 1 and 2 are the pair documented to clear every adjacent CVD/contrast gate
// in both light and dark, so this exact pairing needs no re-validation.
const CHART_STYLE = `
.awz-chart {
  --series-1: #2a78d6;
  --series-2: #eb6834;
  --grid: #e4e2dd;
  --text-muted: #7a7871;
}
:root:not([data-theme="light"]) .awz-chart {
  --series-1: #3987e5;
  --series-2: #d95926;
  --grid: #34332f;
  --text-muted: #9d9b93;
}
:root[data-theme="dark"] .awz-chart {
  --series-1: #3987e5;
  --series-2: #d95926;
  --grid: #34332f;
  --text-muted: #9d9b93;
}
`;

// Status palette (fixed - never themed), from the same reference.
const STATUS = {
  green: { color: "#0ca30c", icon: CheckCircle2, label: "Operational" },
  amber: { color: "#fab219", icon: AlertTriangle, label: "Needs attention" },
  red: { color: "#d03b3b", icon: XCircle, label: "Down" },
};

function Delta({ today, yesterday }) {
  if (yesterday === 0 && today === 0) {
    return (
      <span className="flex items-center gap-1 text-[11px] text-shop-text/60">
        <Minus className="h-3 w-3" /> No change
      </span>
    );
  }
  const pct = yesterday === 0 ? 100 : Math.round(((today - yesterday) / yesterday) * 100);
  const up = pct >= 0;
  return (
    <span
      className={`flex items-center gap-1 text-[11px] font-medium ${up ? "text-emerald-600" : "text-shop-accent-3"}`}
    >
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {Math.abs(pct)}% vs yesterday
    </span>
  );
}

const CHART_W = 700;
const CHART_H = 200;
const PAD = { top: 12, right: 12, bottom: 24, left: 32 };

function TrendChart({ series }) {
  const [hover, setHover] = useState(null);
  const n = series.length;
  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;
  const maxY = Math.max(1, ...series.map((d) => Math.max(d.visits, d.uniqueVisitors)));
  const x = (i) => PAD.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v) => PAD.top + innerH - (v / maxY) * innerH;

  const linePath = (key) =>
    series.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d[key])}`).join(" ");

  const yTicks = [0, Math.round(maxY / 2), maxY];
  const active = hover != null ? series[hover] : null;

  return (
    <div className="awz-chart relative">
      <style>{CHART_STYLE}</style>
      <div className="mb-2 flex items-center gap-4 text-[11.5px]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--series-1)" }} />
          Visits
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--series-2)" }} />
          Unique visitors
        </span>
      </div>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full" style={{ height: "auto" }}>
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={CHART_W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--grid)"
              strokeWidth="1"
            />
            <text x={PAD.left - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fill="var(--text-muted)">
              {t}
            </text>
          </g>
        ))}

        <path d={linePath("visits")} fill="none" style={{ stroke: "var(--series-1)" }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={linePath("uniqueVisitors")} fill="none" style={{ stroke: "var(--series-2)" }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {series.map((d, i) => (
          <g key={d.date}>
            <circle cx={x(i)} cy={y(d.visits)} r="4" style={{ fill: "var(--series-1)" }} stroke="var(--surface, #fff)" strokeWidth="2" />
            <circle cx={x(i)} cy={y(d.uniqueVisitors)} r="4" style={{ fill: "var(--series-2)" }} stroke="var(--surface, #fff)" strokeWidth="2" />
            <text
              x={x(i)}
              y={CHART_H - 6}
              textAnchor="middle"
              fontSize="10"
              fill="var(--text-muted)"
            >
              {new Date(d.date).toLocaleDateString("en-NG", { weekday: "short" })}
            </text>
            {/* hover hit target - wider than the mark, per the interaction spec */}
            <rect
              x={x(i) - innerW / (n * 2)}
              y={PAD.top}
              width={innerW / n}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            />
          </g>
        ))}

        {active && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={PAD.top}
            y2={CHART_H - PAD.bottom}
            stroke="var(--grid)"
            strokeWidth="1"
          />
        )}
      </svg>
      {active && (
        <div className="pointer-events-none absolute top-0 rounded-[8px] border border-shop-border bg-white px-2.5 py-1.5 text-[11px] shadow-lg" style={{ left: `${(x(hover) / CHART_W) * 100}%`, transform: "translate(-50%, -100%)" }}>
          <p className="font-semibold text-shop-heading">
            {new Date(active.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
          </p>
          <p style={{ color: "var(--series-1)" }}>{active.visits} visits</p>
          <p style={{ color: "var(--series-2)" }}>{active.uniqueVisitors} unique</p>
        </div>
      )}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useGetAdminAnalyticsQuery(undefined, {
    pollingInterval: 60_000,
  });

  const maxPageVisits = Math.max(1, ...(data?.topPages ?? []).map((p) => p.visits));

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Analytics" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Website visits, top pages, and live platform health.
      </p>

      <div className="grid grid-cols-2 gap-3 px-4 lg:px-8">
        {isLoading || !data ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-[14px]" />)
        ) : (
          <>
            <div className="flex flex-col gap-1 rounded-[14px] border border-shop-border bg-white p-4">
              <span className="flex items-center gap-1.5 text-[11px] text-shop-text/60">
                <Eye className="h-3.5 w-3.5" /> Visits today
              </span>
              <p className="text-[20px] font-bold text-shop-heading">{data.visitsToday}</p>
              <Delta today={data.visitsToday} yesterday={data.visitsYesterday} />
            </div>
            <div className="flex flex-col gap-1 rounded-[14px] border border-shop-border bg-white p-4">
              <span className="flex items-center gap-1.5 text-[11px] text-shop-text/60">
                <Users className="h-3.5 w-3.5" /> Unique visitors today
              </span>
              <p className="text-[20px] font-bold text-shop-heading">{data.uniqueVisitorsToday}</p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <Activity className="h-4 w-4 text-shop-accent-1" />
          Traffic · last 7 days
        </p>
        {isLoading || !data ? (
          <Skeleton className="h-[220px] rounded-[14px]" />
        ) : (
          <div className="rounded-[14px] border border-shop-border bg-white p-4">
            <TrendChart series={data.dailySeries} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <Globe className="h-4 w-4 text-shop-accent-1" />
          Top pages · last 7 days
        </p>
        {isLoading ? (
          <SkeletonRows count={4} />
        ) : !data?.topPages?.length ? (
          <p className="rounded-[14px] border border-dashed border-shop-border p-6 text-center text-[12.5px] text-shop-text">
            No traffic recorded yet.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {data.topPages.map((p) => (
              <div key={p.path} className="flex items-center gap-3 rounded-[12px] border border-shop-border bg-white p-3">
                <p className="w-40 shrink-0 truncate text-[12px] text-shop-heading" title={p.path}>
                  {p.path}
                </p>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-shop-bg">
                  <div
                    className="h-full rounded-full bg-shop-accent-1"
                    style={{ width: `${(p.visits / maxPageVisits) * 100}%` }}
                  />
                </div>
                <p className="w-16 shrink-0 text-right text-[12px] font-semibold text-shop-heading">
                  {p.visits}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">Platform Health</p>
        {isLoading ? (
          <SkeletonRows count={3} />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {data?.health?.map((h) => {
              const s = STATUS[h.status] ?? STATUS.amber;
              const Icon = s.icon;
              return (
                <div
                  key={h.id}
                  className="flex items-center justify-between gap-2 rounded-[12px] border border-shop-border bg-white p-3"
                >
                  <span className="text-[12.5px] text-shop-heading">{h.label}</span>
                  <span className="flex items-center gap-1.5 text-[11.5px] font-medium" style={{ color: s.color }}>
                    <Icon className="h-3.5 w-3.5" />
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">Recent visits</p>
        {isLoading ? (
          <SkeletonRows count={5} />
        ) : !data?.recentVisits?.length ? (
          <p className="rounded-[14px] border border-dashed border-shop-border p-6 text-center text-[12.5px] text-shop-text">
            No visits recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-[14px] border border-shop-border bg-white">
            <table className="w-full min-w-[560px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-shop-border text-[10.5px] uppercase tracking-wide text-shop-text/60">
                  <th className="px-3 py-2.5 font-medium">Visitor</th>
                  <th className="px-3 py-2.5 font-medium">Page</th>
                  <th className="px-3 py-2.5 font-medium">Device</th>
                  <th className="px-3 py-2.5 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {data.recentVisits.map((v) => (
                  <tr key={v.id} className="border-b border-shop-border last:border-0">
                    <td className="px-3 py-2.5 text-shop-heading">{v.visitor}</td>
                    <td className="max-w-[160px] truncate px-3 py-2.5 text-shop-text" title={v.path}>
                      {v.path}
                    </td>
                    <td className="px-3 py-2.5 text-shop-text">{v.device}</td>
                    <td className="px-3 py-2.5 text-shop-text/70">
                      {new Date(v.at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
