"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
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
  ChevronRight,
  Package,
  FileText,
  Megaphone,
  BarChart3,
  UserCog,
  Settings,
  History,
} from "lucide-react";
import {
  businessOverview,
  todaysSnapshot,
  platformHealth,
  recentActivity,
  campaignCalendar,
  failedPaymentsSeed,
  formatPrice,
  HEALTH_TONE,
  customersDirectory,
} from "@/lib/admin-data";

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
  { href: "/admin/products", label: "Products", icon: Package, tone: "bg-amber-100 text-amber-700" },
  { href: "/admin/content", label: "Content", icon: FileText, tone: "bg-emerald-100 text-emerald-700" },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone, tone: "bg-shop-accent-1-light text-shop-accent-1" },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, tone: "bg-blue-100 text-blue-700" },
  { href: "/admin/team", label: "Access Control", icon: UserCog, tone: "bg-amber-100 text-amber-700" },
  { href: "/admin/settings", label: "Settings", icon: Settings, tone: "bg-shop-bg text-shop-heading" },
  { href: "/admin/automations", label: "Automations", icon: Zap, tone: "bg-emerald-100 text-emerald-700" },
  { href: "/admin/audit-log", label: "Audit Log", icon: History, tone: "bg-shop-accent-1-light text-shop-accent-1" },
];

export default function AdminHome() {
  const [query, setQuery] = useState("");
  const merchantVerification = useSelector((s) => s.merchant.verification);
  const partnerVerification = useSelector((s) => s.partner.verification);
  const refunds = useSelector((s) => s.admin.refunds);
  const complaints = useSelector((s) => s.admin.complaints);
  const merchantPayouts = useSelector((s) => s.merchant.payouts);
  const partnerWithdrawals = useSelector((s) => s.partner.withdrawals);
  const escrowBalance = useSelector((s) => s.merchant.escrowBalance);
  const adminMerchants = useSelector((s) => s.admin.merchants);
  const adminPartners = useSelector((s) => s.admin.partners);
  const merchantOrders = useSelector((s) => s.merchant.orders);
  const merchantProducts = useSelector((s) => s.merchant.products);

  const actionItems = useMemo(() => {
    const items = [];
    if (merchantVerification.status === "pending") {
      items.push({ id: "av-1", label: "1 merchant verification awaiting review", href: "/admin/merchants" });
    }
    if (partnerVerification.status === "pending") {
      items.push({ id: "av-2", label: "1 partner verification awaiting review", href: "/admin/partners" });
    }
    const pendingRefunds = refunds.filter((r) => r.status === "pending");
    if (pendingRefunds.length) {
      items.push({ id: "av-3", label: `${pendingRefunds.length} refund${pendingRefunds.length > 1 ? "s" : ""} pending`, href: "/admin/finance" });
    }
    const openComplaints = complaints.filter((c) => c.status === "open");
    if (openComplaints.length) {
      items.push({ id: "av-4", label: `${openComplaints.length} open complaint${openComplaints.length > 1 ? "s" : ""}`, href: "/admin/customers" });
    }
    const pendingPayouts = merchantPayouts.filter((p) => p.status === "processing");
    const pendingWithdrawals = partnerWithdrawals.filter((w) => w.status === "pending");
    const totalWithdrawals = pendingPayouts.length + pendingWithdrawals.length;
    if (totalWithdrawals) {
      items.push({ id: "av-5", label: `${totalWithdrawals} withdrawal${totalWithdrawals > 1 ? "s" : ""} to process`, href: "/admin/finance" });
    }
    if (failedPaymentsSeed.length) {
      items.push({ id: "av-6", label: `${failedPaymentsSeed.length} failed payment${failedPaymentsSeed.length > 1 ? "s" : ""}`, href: "/admin/finance" });
    }
    return items;
  }, [merchantVerification, partnerVerification, refunds, complaints, merchantPayouts, partnerWithdrawals]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const results = [];
    for (const m of adminMerchants) {
      if (m.storeName.toLowerCase().includes(q) || m.owner.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)) {
        results.push({ type: "Merchant", label: m.storeName, sub: m.owner, href: `/admin/merchants/${m.id}` });
      }
    }
    for (const p of adminPartners) {
      if (p.name.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) {
        results.push({ type: "Partner", label: p.name, sub: p.storeName, href: `/admin/partners/${p.id}` });
      }
    }
    for (const c of customersDirectory) {
      if (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) {
        results.push({ type: "Customer", label: c.name, sub: c.email, href: "/admin/customers" });
      }
    }
    for (const o of merchantOrders) {
      if (o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)) {
        results.push({ type: "Order", label: o.id, sub: o.customerName, href: `/admin/orders/${o.id}` });
      }
    }
    for (const p of merchantProducts) {
      if (p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) {
        results.push({ type: "Product", label: p.title, sub: formatPrice(p.price), href: "/admin/products" });
      }
    }
    return results.slice(0, 12);
  }, [query, adminMerchants, adminPartners, merchantOrders, merchantProducts]);

  return (
    <div className="flex flex-col gap-6 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[1200px] lg:gap-8">
      <div className="mx-4 mt-4 flex items-center justify-between rounded-[16px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 px-5 py-5 text-white lg:mx-8 lg:mt-8">
        <div>
          <p className="text-[12.5px] text-white/75">Platform Overview</p>
          <p className="text-[17px] font-semibold lg:text-[22px]">
            Good to see you, Admin 👋
          </p>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
        >
          <Bell className="h-4 w-4 text-white" strokeWidth={1.75} />
        </button>
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
        {searchResults && (
          <div className="absolute inset-x-4 top-full z-30 mt-1.5 max-h-80 overflow-y-auto rounded-[14px] border border-shop-border bg-white shadow-lg lg:inset-x-8">
            {searchResults.length === 0 ? (
              <p className="p-4 text-center text-[12.5px] text-shop-text">No results for &quot;{query}&quot;</p>
            ) : (
              searchResults.map((r, i) => (
                <Link
                  key={i}
                  href={r.href}
                  onClick={() => setQuery("")}
                  className="flex items-center justify-between gap-3 border-b border-shop-border px-4 py-3 last:border-b-0 hover:bg-shop-bg"
                >
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">{r.label}</p>
                    <p className="line-clamp-1 text-[11px] text-shop-text/60">{r.sub}</p>
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
      {actionItems.length > 0 && (
        <div className="flex flex-col gap-3 px-4 lg:px-8">
          <p className="flex items-center gap-1.5 text-[14px] font-semibold text-shop-heading">
            <ShieldAlert className="h-4 w-4 text-shop-accent-3" />
            Action Required
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {actionItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between rounded-[12px] border border-amber-200 bg-amber-50 px-4 py-3.5"
              >
                <span className="text-[12.5px] font-medium text-amber-800">{item.label}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-amber-700" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Business Overview */}
      <div className="flex flex-col gap-3 px-4 lg:px-8">
        <p className="text-[14px] font-semibold text-shop-heading">Business Overview</p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          <KPI icon={TrendingUp} label="Revenue Today" value={formatPrice(businessOverview.revenueToday)} href="/admin/finance" />
          <KPI icon={ShoppingBag} label="Orders Today" value={businessOverview.ordersToday} href="/admin/orders" />
          <KPI icon={Users} label="Customers" value={businessOverview.customers.toLocaleString()} href="/admin/customers" />
          <KPI icon={Store} label="Merchants" value={businessOverview.merchants} href="/admin/merchants" />
          <KPI icon={Users2} label="Partners" value={businessOverview.partners} href="/admin/partners" />
          <KPI icon={Wallet} label="Escrow Balance" value={formatPrice(escrowBalance)} href="/admin/finance" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 px-4 lg:grid-cols-2 lg:px-8">
        {/* Today's Snapshot */}
        <div className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-4">
          <p className="text-[13px] font-semibold text-shop-heading">Today&apos;s Snapshot</p>
          <div className="grid grid-cols-2 gap-3 text-[12.5px]">
            <div>
              <p className="text-shop-text/60">Revenue</p>
              <p className="font-semibold text-shop-heading">{formatPrice(todaysSnapshot.revenue)}</p>
            </div>
            <div>
              <p className="text-shop-text/60">Orders</p>
              <p className="font-semibold text-shop-heading">{todaysSnapshot.orders}</p>
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
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
            <Activity className="h-4 w-4 text-shop-accent-1" />
            Recent Activity
          </p>
          <div className="flex flex-col gap-2.5">
            {recentActivity.map((a) => (
              <div key={a.id} className="text-[12px] text-shop-text">
                <span className="text-shop-heading">{a.text}</span>
                <p className="text-[10.5px] text-shop-text/50">
                  {new Date(a.at).toLocaleString("en-NG", { hour: "numeric", minute: "2-digit", day: "numeric", month: "short" })}
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
