"use client";

import React from "react";
import Link from "next/link";
import { BadgeCheck, Ban, Play, ChevronRight, Trash2, MapPin } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetAdminMerchantsQuery,
  useSetAdminMerchantStatusMutation,
  useReviewAdminMerchantKycMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

const VERIFICATION_TONE = {
  VERIFIED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-50 text-shop-accent-3",
  UNVERIFIED: "bg-shop-bg text-shop-text",
};

export default function AdminMerchantsPage() {
  const showToast = useToast();
  const confirm = useConfirm();
  const { data, isLoading } = useGetAdminMerchantsQuery();
  const [setStatus] = useSetAdminMerchantStatusMutation();
  const [reviewKyc] = useReviewAdminMerchantKycMutation();

  const merchants = data?.items ?? [];

  const act = async (fn, ok) => {
    try {
      await fn();
      showToast(ok);
    } catch (e) {
      showToast(errorMessage(e));
    }
  };

  const handleApprove = async (m) => {
    const res = await confirm({
      title: `Approve ${m.storeName}'s verification?`,
      message: `${m.owner} will be able to receive orders and payouts. They'll get an email.`,
      confirmLabel: "Approve",
    });
    if (!res) return;
    act(() => reviewKyc({ id: m.id, approve: true }).unwrap(), `${m.storeName} verified`);
  };

  const handleReject = async (m) => {
    const res = await confirm({
      title: `Reject ${m.storeName}'s verification?`,
      confirmLabel: "Reject",
      tone: "danger",
      reason: { label: `Reason (emailed to ${m.owner})`, required: true },
    });
    if (!res) return;
    act(
      () => reviewKyc({ id: m.id, approve: false, note: res.reason }).unwrap(),
      `${m.storeName} verification rejected`,
    );
  };

  const handleSuspend = async (m) => {
    const res = await confirm({
      title: `Suspend ${m.storeName}?`,
      message: "Their store goes offline and products are hidden until reinstated.",
      confirmLabel: "Suspend",
      tone: "danger",
      reason: { label: `Reason (emailed to ${m.owner})`, required: true },
    });
    if (!res) return;
    act(
      () => setStatus({ id: m.id, status: "suspended", reason: res.reason }).unwrap(),
      `${m.storeName} suspended`,
    );
  };

  const handleReactivate = async (m) => {
    const res = await confirm({
      title: `Reactivate ${m.storeName}?`,
      confirmLabel: "Reactivate",
    });
    if (!res) return;
    act(
      () => setStatus({ id: m.id, status: "active" }).unwrap(),
      `${m.storeName} reactivated`,
    );
  };

  const handleRemove = async (m) => {
    const res = await confirm({
      title: `Remove ${m.storeName}?`,
      message: "Their store and products are taken down. This is a hard action.",
      confirmLabel: "Remove",
      tone: "danger",
      reason: { label: `Reason (emailed to ${m.owner})`, required: true },
    });
    if (!res) return;
    act(
      () => setStatus({ id: m.id, status: "removed", reason: res.reason }).unwrap(),
      `${m.storeName} removed`,
    );
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Merchants" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Onboarding, verification, performance, payouts, products and account status.
      </p>

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={4} />
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-4 lg:px-8">
          {merchants.map((m) => (
            <div
              key={m.id}
              className="flex flex-col gap-2.5 rounded-[12px] border border-shop-border bg-white p-3.5 sm:flex-row sm:items-center sm:gap-4"
            >
              <Link href={`/admin/merchants/${m.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light text-[13px] font-semibold text-shop-accent-1">
                  {m.storeName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[13px] font-semibold text-shop-heading">{m.storeName}</p>
                  <p className="line-clamp-1 text-[11.5px] text-shop-text/70">
                    {m.owner} · {m.products} products
                  </p>
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
                    m.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : m.status === "removed"
                        ? "bg-red-50 text-shop-accent-3"
                        : "bg-shop-bg text-shop-text"
                  }`}
                >
                  {m.status}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
                    VERIFICATION_TONE[m.verification] || "bg-shop-bg text-shop-text"
                  }`}
                >
                  {String(m.verification).toLowerCase()}
                </span>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                    m.detailsComplete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <MapPin className="h-3 w-3" />
                  {m.detailsComplete ? "Details on file" : "Details missing"}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {m.verification !== "VERIFIED" && (
                  <button
                    type="button"
                    onClick={() => handleApprove(m)}
                    className="flex items-center gap-1 rounded-full bg-shop-accent-1 px-2.5 py-1.5 text-[11px] font-semibold text-white"
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Approve
                  </button>
                )}
                {m.verification === "PENDING" && (
                  <button
                    type="button"
                    onClick={() => handleReject(m)}
                    className="rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-shop-heading"
                  >
                    Reject
                  </button>
                )}
                {m.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => handleSuspend(m)}
                    className="flex items-center gap-1 rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-shop-accent-3"
                  >
                    <Ban className="h-3.5 w-3.5" />
                    Suspend
                  </button>
                ) : m.status === "suspended" ? (
                  <button
                    type="button"
                    onClick={() => handleReactivate(m)}
                    className="flex items-center gap-1 rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Reactivate
                  </button>
                ) : null}
                {m.status !== "removed" && (
                  <button
                    type="button"
                    onClick={() => handleRemove(m)}
                    aria-label="Remove merchant"
                    className="flex items-center justify-center rounded-full border border-shop-border px-2.5 py-1.5 text-shop-accent-3"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <Link
                  href={`/admin/merchants/${m.id}`}
                  className="flex items-center justify-center rounded-full border border-shop-border px-2 py-1.5 text-shop-text/60"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {m.statusReason && (
                <p className="text-[10.5px] text-shop-text/60 sm:hidden">Reason: {m.statusReason}</p>
              )}
            </div>
          ))}
          {merchants.length === 0 && (
            <p className="py-10 text-center text-[13px] text-shop-text">No merchants yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
