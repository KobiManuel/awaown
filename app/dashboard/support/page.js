"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LifeBuoy, Plus, ChevronRight, Loader2 } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useGetOrdersQuery } from "@/lib/api/ordersApi";
import {
  useGetMyComplaintsQuery,
  useCreateComplaintMutation,
} from "@/lib/api/supportApi";
import { errorMessage } from "@/lib/api/errorMessage";

const FIELD =
  "w-full rounded-[10px] border border-shop-border px-3 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1";

export default function SupportPage() {
  const { data, isLoading } = useGetMyComplaintsQuery();
  const { data: ordersData } = useGetOrdersQuery();
  const [create, createState] = useCreateComplaintMutation();

  const complaints = data?.items ?? [];
  const orders = ordersData?.items ?? [];

  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setError("");
    try {
      const res = await create({
        subject: subject.trim(),
        orderRef: orderRef || undefined,
        message: message.trim(),
      }).unwrap();
      setSubject("");
      setOrderRef("");
      setMessage("");
      setOpen(false);
      if (res?.id) {
        window.location.href = `/dashboard/support/${res.id}`;
      }
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[760px]">
      <AppHeader
        title="Support"
        backHref="/dashboard/account"
        showBackOnDesktop
        right={
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1-light px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-1"
          >
            <Plus className="h-3.5 w-3.5" />
            New request
          </button>
        }
      />

      {open && (
        <form
          onSubmit={submit}
          className="mx-4 flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-4 lg:mx-8"
        >
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What's this about?"
            className={FIELD}
            autoFocus
          />
          <select
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value)}
            className={FIELD}
          >
            <option value="">Not about a specific order</option>
            {orders.map((o) => (
              <option key={o.id} value={o.reference}>
                {o.reference}
              </option>
            ))}
          </select>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Tell us what's going on…"
            className={`${FIELD} resize-none`}
          />
          {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={!subject.trim() || !message.trim() || createState.isLoading}
            className="flex items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {createState.isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Send to support
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={3} />
        </div>
      ) : complaints.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shop-bg">
            <LifeBuoy className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] font-semibold text-shop-heading">
            No support requests yet
          </p>
          <p className="text-[13px] text-shop-text">
            Start a conversation and our team will reply here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 px-4 lg:px-8">
          {complaints.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/support/${c.id}`}
              className="flex items-center gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-shop-heading">
                  {c.subject}
                  {c.unread && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-shop-accent-1" />
                  )}
                </p>
                <p className="line-clamp-1 text-[11.5px] text-shop-text/70">
                  {c.lastMessage}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
                  c.status === "resolved"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {c.status}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-shop-text/40" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
