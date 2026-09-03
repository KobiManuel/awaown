"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send, Loader2, ShieldCheck, CheckCircle2, RotateCcw } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAdminComplaintQuery,
  useReplyAdminComplaintMutation,
  useResolveAdminComplaintMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

export default function AdminSupportThreadPage() {
  const { id } = useParams();
  const showToast = useToast();
  const confirm = useConfirm();
  const { data: thread, isLoading, isError } = useGetAdminComplaintQuery(id);
  const [reply, replyState] = useReplyAdminComplaintMutation();
  const [resolve] = useResolveAdminComplaintMutation();
  const [body, setBody] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [thread?.messages?.length]);

  const send = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    try {
      await reply({ id, body: body.trim() }).unwrap();
      setBody("");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const toggleResolved = async () => {
    const resolved = thread.status !== "resolved";
    if (resolved) {
      const res = await confirm({
        title: "Mark this conversation resolved?",
        message: "The customer is told it's resolved. They can reopen it by replying.",
        confirmLabel: "Mark resolved",
      });
      if (!res) return;
    }
    try {
      await resolve({ id, resolved }).unwrap();
      showToast(resolved ? "Marked resolved" : "Reopened");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[820px]">
        <AppHeader title="Support" backHref="/admin/support" showBackOnDesktop />
        <div className="px-4 lg:px-8">
          <Skeleton className="h-40 w-full rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (isError || !thread) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Support" backHref="/admin/support" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This conversation couldn&apos;t be found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[820px]">
      <AppHeader
        title={thread.subject}
        backHref="/admin/support"
        showBackOnDesktop
        right={
          <button
            type="button"
            onClick={toggleResolved}
            className="flex items-center gap-1.5 rounded-full border border-shop-border px-3 py-1.5 text-[11.5px] font-semibold text-shop-heading"
          >
            {thread.status === "resolved" ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" /> Reopen
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
              </>
            )}
          </button>
        }
      />

      <div className="mx-4 flex items-center justify-between lg:mx-8">
        <p className="text-[11.5px] text-shop-text/60">
          {thread.customer.name} · {thread.customer.email}
          {thread.orderRef ? ` · Order ${thread.orderRef}` : ""}
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
            thread.status === "resolved"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {thread.status}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-4 lg:px-8">
        {thread.messages.map((m) => {
          const admin = m.authorType === "admin";
          return (
            <div
              key={m.id}
              className={`flex flex-col gap-1 ${admin ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-[14px] px-3.5 py-2.5 text-[13px] leading-[19px] ${
                  admin
                    ? "bg-shop-accent-1 text-white"
                    : "border border-shop-border bg-white text-shop-heading"
                }`}
              >
                <p
                  className={`mb-0.5 flex items-center gap-1 text-[11px] font-semibold ${
                    admin ? "text-white/80" : "text-shop-text/70"
                  }`}
                >
                  {admin && <ShieldCheck className="h-3 w-3" />}
                  {m.authorName}
                </p>
                <p className="whitespace-pre-wrap">{m.body}</p>
              </div>
              <span className="text-[10px] text-shop-text/50">
                {new Date(m.createdAt).toLocaleString("en-NG", {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={send}
        className="sticky bottom-0 mx-4 flex items-end gap-2 rounded-[14px] border border-shop-border bg-white p-2 lg:mx-8"
      >
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={1}
          placeholder="Reply to the customer…"
          className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-[13px] text-shop-heading outline-none"
        />
        <button
          type="submit"
          disabled={!body.trim() || replyState.isLoading}
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-white disabled:opacity-50"
        >
          {replyState.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
}
