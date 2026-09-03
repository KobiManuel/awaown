"use client";

import React from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/lib/api/notificationsApi";

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/** Shared notifications feed for every dashboard. `backHref` sets the header link. */
export default function NotificationsFeed({ backHref }) {
  const { data, isLoading, isError } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAll, { isLoading: markingAll }] =
    useMarkAllNotificationsReadMutation();

  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader
        title="Notifications"
        backHref={backHref}
        showBackOnDesktop
        right={
          data?.unread > 0 ? (
            <button
              type="button"
              onClick={() => markAll()}
              disabled={markingAll}
              className="flex items-center gap-1 text-[12px] font-medium text-shop-accent-1"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          ) : null
        }
      />

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={5} />
        </div>
      ) : isError ? (
        <p className="px-4 py-10 text-center text-[13px] text-red-600">
          Couldn&apos;t load notifications.
        </p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shop-bg">
            <Bell className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] font-semibold text-shop-heading">
            You&apos;re all caught up
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-4 lg:px-8">
          {items.map((n) => {
            const Wrapper = n.href ? Link : "div";
            return (
              <Wrapper
                key={n.id}
                {...(n.href ? { href: n.href } : {})}
                onClick={() => !n.readAt && markRead(n.id)}
                className={`flex items-start gap-3 rounded-[12px] border p-3.5 ${
                  n.readAt
                    ? "border-shop-border bg-white"
                    : "border-shop-accent-1/30 bg-shop-accent-1-light/40"
                }`}
              >
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    n.readAt ? "bg-shop-border" : "bg-shop-accent-1"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-shop-heading">
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-[12px] leading-[17px] text-shop-text">
                      {n.body}
                    </p>
                  )}
                  <p className="mt-0.5 text-[11px] text-shop-text/50">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      )}
    </div>
  );
}
