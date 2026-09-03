"use client";

import React from "react";
import Link from "next/link";
import { BadgeCheck, Ban, Play, ChevronRight, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetAdminPartnersQuery,
  useSetAdminPartnerStatusMutation,
  useReviewAdminPartnerKycMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

const VERIFICATION_TONE = {
  VERIFIED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-50 text-shop-accent-3",
  UNVERIFIED: "bg-shop-bg text-shop-text",
};

export default function AdminPartnersPage() {
  const showToast = useToast();
  const confirm = useConfirm();
  const { data, isLoading } = useGetAdminPartnersQuery();
  const [setStatus] = useSetAdminPartnerStatusMutation();
  const [reviewKyc] = useReviewAdminPartnerKycMutation();

  const partners = data?.items ?? [];

  const act = async (fn, ok) => {
    try {
      await fn();
      showToast(ok);
    } catch (e) {
      showToast(errorMessage(e));
    }
  };

  const handleApprove = async (p) => {
    const res = await confirm({
      title: `Approve ${p.name}'s verification?`,
      message: `${p.name} will be able to resell products and withdraw profit. They'll get an email.`,
      confirmLabel: "Approve",
    });
    if (!res) return;
    act(() => reviewKyc({ id: p.id, approve: true }).unwrap(), `${p.name} verified`);
  };

  const handleReject = async (p) => {
    const res = await confirm({
      title: `Reject ${p.name}'s verification?`,
      confirmLabel: "Reject",
      tone: "danger",
      reason: { label: `Reason (emailed to ${p.name})`, required: true },
    });
    if (!res) return;
    act(
      () => reviewKyc({ id: p.id, approve: false, note: res.reason }).unwrap(),
      `${p.name} verification rejected`,
    );
  };

  const handleSuspend = async (p) => {
    const res = await confirm({
      title: `Suspend ${p.name}?`,
      message: "Their store goes offline and they can't withdraw until reinstated.",
      confirmLabel: "Suspend",
      tone: "danger",
      reason: { label: `Reason (emailed to ${p.name})`, required: true },
    });
    if (!res) return;
    act(
      () => setStatus({ id: p.id, status: "suspended", reason: res.reason }).unwrap(),
      `${p.name} suspended`,
    );
  };

  const handleReactivate = async (p) => {
    const res = await confirm({ title: `Reactivate ${p.name}?`, confirmLabel: "Reactivate" });
    if (!res) return;
    act(() => setStatus({ id: p.id, status: "active" }).unwrap(), `${p.name} reactivated`);
  };

  const handleRemove = async (p) => {
    const res = await confirm({
      title: `Remove ${p.name}?`,
      message: "Their store and listings are taken down. This is a hard action.",
      confirmLabel: "Remove",
      tone: "danger",
      reason: { label: `Reason (emailed to ${p.name})`, required: true },
    });
    if (!res) return;
    act(
      () => setStatus({ id: p.id, status: "removed", reason: res.reason }).unwrap(),
      `${p.name} removed`,
    );
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Partners" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Onboarding, verification, profit, withdrawals, referrals and performance.
      </p>

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={4} />
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-4 lg:px-8">
          {partners.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-2.5 rounded-[12px] border border-shop-border bg-white p-3.5 sm:flex-row sm:items-center sm:gap-4"
            >
              <Link href={`/admin/partners/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light text-[13px] font-semibold text-shop-accent-1">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[13px] font-semibold text-shop-heading">{p.name}</p>
                  <p className="line-clamp-1 text-[11.5px] text-shop-text/70">
                    {p.storeName ? `${p.storeName} · ` : ""}
                    {p.referrals} referrals · {formatPrice(p.netProfit)} net profit
                  </p>
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
                    p.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : p.status === "removed"
                        ? "bg-red-50 text-shop-accent-3"
                        : "bg-shop-bg text-shop-text"
                  }`}
                >
                  {p.status}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
                    VERIFICATION_TONE[p.verification] || "bg-shop-bg text-shop-text"
                  }`}
                >
                  {String(p.verification).toLowerCase()}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {p.verification !== "VERIFIED" && (
                  <button
                    type="button"
                    onClick={() => handleApprove(p)}
                    className="flex items-center gap-1 rounded-full bg-shop-accent-1 px-2.5 py-1.5 text-[11px] font-semibold text-white"
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Approve
                  </button>
                )}
                {p.verification === "PENDING" && (
                  <button
                    type="button"
                    onClick={() => handleReject(p)}
                    className="rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-shop-heading"
                  >
                    Reject
                  </button>
                )}
                {p.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => handleSuspend(p)}
                    className="flex items-center gap-1 rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-shop-accent-3"
                  >
                    <Ban className="h-3.5 w-3.5" />
                    Suspend
                  </button>
                ) : p.status === "suspended" ? (
                  <button
                    type="button"
                    onClick={() => handleReactivate(p)}
                    className="flex items-center gap-1 rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Reactivate
                  </button>
                ) : null}
                {p.status !== "removed" && (
                  <button
                    type="button"
                    onClick={() => handleRemove(p)}
                    aria-label="Remove partner"
                    className="flex items-center justify-center rounded-full border border-shop-border px-2.5 py-1.5 text-shop-accent-3"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <Link
                  href={`/admin/partners/${p.id}`}
                  className="flex items-center justify-center rounded-full border border-shop-border px-2 py-1.5 text-shop-text/60"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {p.statusReason && (
                <p className="text-[10.5px] text-shop-text/60 sm:hidden">Reason: {p.statusReason}</p>
              )}
            </div>
          ))}
          {partners.length === 0 && (
            <p className="py-10 text-center text-[13px] text-shop-text">No partners yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
