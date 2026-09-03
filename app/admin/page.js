"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Bell,
  ShieldAlert,
  TrendingUp,
  ShoppingBag,
  Users,
  Store,
  Users2,
  Wallet,
  Activity,
  CalendarClock,
  Zap,
  Package,
  FileText,
  Megaphone,
  BarChart3,
  UserCog,
  Settings,
  History,
  Mail,
  LifeBuoy,
  ImagePlus,
  Loader2,
} from "lucide-react";
import {
  todaysSnapshot,
  platformHealth,
  campaignCalendar,
  formatPrice,
  HEALTH_TONE,
} from "@/lib/admin-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import {
  useGetAdminOverviewQuery,
  useAdminSearchQuery,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} from "@/lib/api/adminApi";
import { useMediaUpload } from "@/lib/api/mediaApi";

const KPI = ({ icon: Icon, label, value, href }) => {
  const Wrapper = href ? Link : "div";
  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={`flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-4 ${
        href ? "hover:border-shop-accent-1" : ""
      }`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-accent-1-light">
        <Icon className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
      </div>
      <p className="text-[16px] font-bold text-shop-heading">{value}</p>
      <p className="text-[11.5px] text-shop-text">{label}</p>
    </Wrapper>
  );
};

const MANAGE_LINKS = [
  { href: "/admin/customers", label: "Customers", icon: Users, tone: "bg-blue-100 text-blue-700" },
  { href: "/admin/support", label: "Support", icon: LifeBuoy, tone: "bg-shop-accent-1-light text-shop-accent-1" },
  { href: "/admin/products", label: "Products", icon: Package, tone: "bg-amber-100 text-amber-700" },
  { href: "/admin/content", label: "Content", icon: FileText, tone: "bg-emerald-100 text-emerald-700" },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone, tone: "bg-shop-accent-1-light text-shop-accent-1" },
  { href: "/admin/emails", label: "Email Templates", icon: Mail, tone: "bg-blue-100 text-blue-700" },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, tone: "bg-blue-100 text-blue-700" },
  { href: "/admin/team", label: "Access Control", icon: UserCog, tone: "bg-amber-100 text-amber-700" },
  { href: "/admin/settings", label: "Settings", icon: Settings, tone: "bg-shop-bg text-shop-heading" },
  { href: "/admin/automations", label: "Automations", icon: Zap, tone: "bg-emerald-100 text-emerald-700" },
  { href: "/admin/audit-log", label: "Audit Log", icon: History, tone: "bg-shop-accent-1-light text-shop-accent-1" },
];

const ACTION_LABELS = {
  pendingVerifications: { label: "Verifications to review", href: "/admin/merchants" },
  pendingRefunds: { label: "Refunds to decide", href: "/admin/finance" },
  openComplaints: { label: "Open complaints", href: "/admin/support" },
  failedPayments: { label: "Failed payments", href: "/admin/finance" },
  pendingProducts: { label: "Products awaiting approval", href: "/admin/products" },
};

export default function AdminHome() {
  const showToast = useToast();
  const bannerInputRef = useRef(null);
  const [query, setQuery] = useState("");

  const { data, isLoading } = useGetAdminOverviewQuery();
  const { data: results } = useAdminSearchQuery(query, {
    skip: query.trim().length < 2,
  });
  const { data: settings } = useGetAdminSettingsQuery();
  const [updateSettings] = useUpdateAdminSettingsMutation();
  const { upload, uploading } = useMediaUpload("banners");

  const kpis = data?.kpis;
  const action = data?.actionRequired ?? {};
  const dashboardBanner = settings?.dashboardBanner || null;

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await upload(file);
    if (!url) return showToast("Image upload failed");
    try {
      await updateSettings({ dashboardBanner: url }).unwrap();
      showToast("Dashboard banner updated");
    } catch {
      showToast("Could not save the banner");
    }
  };

  const searchRows = results
    ? [
        ...results.merchants.map((m) => ({ label: m.storeName, sub: "", href: `/admin/merchants/${m.id}`, type: "Merchant" })),
        ...results.partners.map((p) => ({ label: p.displayName, sub: "", href: `/admin/partners/${p.id}`, type: "Partner" })),
        ...results.customers.map((c) => ({ label: c.fullName, sub: c.email, href: `/admin/customers`, type: "Customer" })),
        ...results.orders.map((o) => ({ label: o.reference, sub: o.status, href: `/admin/orders/${o.reference}`, type: "Order" })),
        ...results.products.map((p) => ({ label: p.title, sub: "", href: `/admin/products`, type: "Product" })),
      ].slice(0, 12)
    : null;

  return (
    <div className="flex flex-col gap-6 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[1200px] lg:gap-8">
      {/* Dashboard banner */}
      <div className="relative mx-4 mt-4 flex h-32 items-end overflow-hidden rounded-[16px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 lg:mx-8 lg:mt-8 lg:h-40">
        {dashboardBanner && (
          <Image src={dashboardBanner} alt="Dashboard banner" fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
        <div className="relative flex w-full items-end justify-between p-4">
          <div>
            <p className="text-[12.5px] text-white/75">Platform Overview</p>
            <p className="text-[16px] font-bold text-white lg:text-[20px]">
              Good to see you, Admin 👋
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11.5px] font-semibold text-shop-heading disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {dashboardBanner ? "Edit Banner" : "Add Banner"}
            </button>
            <Link
              href="/admin/audit-log"
              aria-label="Notifications"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
            >
              <Bell className="h-4 w-4 text-white" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </div>

      {/* Global search */}
      <div className="relative px-4 lg:px-8">
        <div className="flex items-center gap-2 rounded-full border border-shop-border bg-white px-4 py-3">
          <Search className="h-4 w-4 text-shop-text/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders, customers, merchants, partners, products, tracking IDs..."
            className="w-full bg-transparent text-[13px] text-shop-heading outline-none placeholder:text-shop-text/50"
          />
        </div>
        {searchRows && (
          <div className="absolute inset-x-4 top-full z-30 mt-1.5 max-h-80 overflow-y-auto rounded-[14px] border border-shop-border bg-white shadow-lg lg:inset-x-8">
            {searchRows.length === 0 ? (
              <p className="p-4 text-center text-[12.5px] text-shop-text">
                No results for &quot;{query}&quot;
              </p>
            ) : (
              searchRows.map((r, i) => (
                <Link
                  key={i}
                  href={r.href}
                  onClick={() => setQuery("")}
                  className="flex items-center justify-between gap-3 border-b border-shop-border px-4 py-3 last:border-b-0 hover:bg-shop-bg"
                >
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">
                      {r.label}
                    </p>
                    {r.sub && (
                      <p className="line-clamp-1 text-[11px] text-shop-text/60">{r.sub}</p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-shop-accent-1-light px-2 py-0.5 text-[10px] font-semibold text-shop-accent-1">
                    {r.type}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Action Required */}
      <div className="flex flex-col gap-3 px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[14px] font-semibold text-shop-heading">
          <ShieldAlert className="h-4 w-4 text-shop-accent-3" />
          Action Required
        </p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {Object.entries(ACTION_LABELS).map(([key, meta]) => {
            const count = action[key] ?? 0;
            return (
              <Link
                key={key}
                href={meta.href}
                className={`flex flex-col gap-1 rounded-[12px] border p-3.5 ${
                  count > 0 ? "border-amber-300 bg-amber-50" : "border-shop-border bg-white"
                }`}
              >
                <span className="text-[20px] font-bold text-shop-heading">{count}</span>
                <span className="text-[11.5px] text-shop-text">{meta.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Business Overview */}
      <div className="flex flex-col gap-3 px-4 lg:px-8">
        <p className="text-[14px] font-semibold text-shop-heading">Business Overview</p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {isLoading || !kpis ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-[14px]" />
            ))
          ) : (
            <>
              <KPI icon={TrendingUp} label="Revenue Today" value={formatPrice(kpis.revenueToday)} href="/admin/finance" />
              <KPI icon={ShoppingBag} label="Orders Today" value={kpis.ordersToday} href="/admin/orders" />
              <KPI icon={Users} label="Customers" value={kpis.customers.toLocaleString()} href="/admin/customers" />
              <KPI icon={Store} label="Merchants" value={kpis.merchants} href="/admin/merchants" />
              <KPI icon={Users2} label="Partners" value={kpis.partners} href="/admin/partners" />
              <KPI icon={Wallet} label="Escrow Balance" value={formatPrice(kpis.escrowBalance)} href="/admin/finance" />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 px-4 lg:grid-cols-2 lg:px-8">
        {/* Today's Snapshot */}
        <div className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-4">
          <p className="text-[13px] font-semibold text-shop-heading">Today&apos;s Snapshot</p>
          <div className="grid grid-cols-2 gap-3 text-[12.5px]">
            <div>
              <p className="text-shop-text/60">Revenue</p>
              <p className="font-semibold text-shop-heading">
                {formatPrice(kpis?.revenueToday ?? todaysSnapshot.revenue)}
              </p>
            </div>
            <div>
              <p className="text-shop-text/60">Orders</p>
              <p className="font-semibold text-shop-heading">
                {kpis?.ordersToday ?? todaysSnapshot.orders}
              </p>
            </div>
            <div>
              <p className="text-shop-text/60">New Customers</p>
              <p className="font-semibold text-shop-heading">{todaysSnapshot.newCustomers}</p>
            </div>
            <div>
              <p className="text-shop-text/60">New Merchants</p>
              <p className="font-semibold text-shop-heading">{todaysSnapshot.newMerchants}</p>
            </div>
            <div>
              <p className="text-shop-text/60">New Partners</p>
              <p className="font-semibold text-shop-heading">{todaysSnapshot.newPartners}</p>
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-4">
          <p className="text-[13px] font-semibold text-shop-heading">Platform Health</p>
          <div className="flex flex-col gap-2">
            {platformHealth.map((h) => (
              <div key={h.id} className="flex items-center justify-between text-[12.5px]">
                <span className="text-shop-text">{h.label}</span>
                <span className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${HEALTH_TONE[h.status]}`} />
                  <span className="capitalize text-shop-heading">{h.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
              <Activity className="h-4 w-4 text-shop-accent-1" />
              Recent Activity
            </p>
            <Link
              href="/admin/audit-log"
              className="text-[12px] font-semibold text-shop-accent-1"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {(data?.recentActivity ?? []).length === 0 && (
              <p className="text-[12px] text-shop-text/60">No activity yet.</p>
            )}
            {(data?.recentActivity ?? []).slice(0, 5).map((a, i) => (
              <div key={i} className="text-[12px] text-shop-text">
                <span className="capitalize text-shop-heading">
                  {a.action.replace(/^admin\./, "").replace(/[._]/g, " ")}
                </span>
                <p className="text-[10.5px] text-shop-text/50">
                  {new Date(a.createdAt).toLocaleString("en-NG", {
                    hour: "numeric",
                    minute: "2-digit",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Calendar */}
        <div className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-4">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
            <CalendarClock className="h-4 w-4 text-shop-accent-1" />
            Campaign Calendar
          </p>
          <div className="flex flex-col gap-2.5">
            {campaignCalendar.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-[12px]">
                <span className="text-shop-heading">{c.title}</span>
                <span className="text-shop-text/60">
                  {new Date(c.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manage Platform */}
      <div className="flex flex-col gap-3 px-4 pb-6 lg:px-8">
        <p className="text-[14px] font-semibold text-shop-heading">Manage Platform</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {MANAGE_LINKS.map(({ href, label, icon: Icon, tone }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-[12px] border border-shop-border bg-white p-4 text-center hover:border-shop-accent-1"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${tone}`}>
                <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <span className="text-[11.5px] font-medium text-shop-heading">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
