"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send, Loader2, ShieldCheck } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMyComplaintQuery,
  useReplyComplaintMutation,
} from "@/lib/api/supportApi";
import { errorMessage } from "@/lib/api/errorMessage";

export default function SupportThreadPage() {
  const { id } = useParams();
  const { data: thread, isLoading, isError } = useGetMyComplaintQuery(id);
  const [reply, replyState] = useReplyComplaintMutation();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [thread?.messages?.length]);

  const send = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setError("");
    try {
      await reply({ id, body: body.trim() }).unwrap();
      setBody("");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[760px]">
        <AppHeader title="Support" backHref="/dashboard/support" showBackOnDesktop />
        <div className="px-4 lg:px-8">
          <Skeleton className="h-40 w-full rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (isError || !thread) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Support" backHref="/dashboard/support" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This conversation couldn&apos;t be found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[760px]">
      <AppHeader
        title={thread.subject}
        backHref="/dashboard/support"
        showBackOnDesktop
      />

      <div className="mx-4 flex items-center justify-between lg:mx-8">
        <p className="text-[11.5px] text-shop-text/60">
          {thread.orderRef ? `Order ${thread.orderRef} · ` : ""}
          Opened{" "}
          {new Date(thread.createdAt).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
          })}
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
          const mine = m.authorType === "customer";
          return (
            <div
              key={m.id}
              className={`flex flex-col gap-1 ${mine ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-[14px] px-3.5 py-2.5 text-[13px] leading-[19px] ${
                  mine
                    ? "bg-shop-accent-1 text-white"
                    : "border border-shop-border bg-white text-shop-heading"
                }`}
              >
                {!mine && (
                  <p className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold text-shop-accent-1">
                    <ShieldCheck className="h-3 w-3" />
                    {m.authorName}
                  </p>
                )}
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

      {thread.status === "resolved" ? (
        <p className="mx-4 rounded-[12px] bg-shop-bg p-3 text-center text-[12px] text-shop-text lg:mx-8">
          This conversation is resolved. Replying will reopen it.
        </p>
      ) : null}

      <form
        onSubmit={send}
        className="sticky bottom-0 mx-4 flex items-end gap-2 rounded-[14px] border border-shop-border bg-white p-2 lg:mx-8"
      >
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={1}
          placeholder="Write a reply…"
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
      {error && (
        <p className="px-4 text-[12px] font-medium text-red-600 lg:px-8">{error}</p>
      )}
    </div>
  );
}
