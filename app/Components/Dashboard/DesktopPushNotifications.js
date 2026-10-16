"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";
import { useGetNotificationsQuery } from "@/lib/api/notificationsApi";

const DISMISS_KEY = "awaown_admin_push_dismissed";
const POLL_MS = 20000;

// Desktop OS notifications while this tab is open - not real push (no
// service worker / VAPID keys), so it only fires while the tab is alive,
// foreground or not. Backend notification creation already exists and
// already targets admins (see NotificationsService.push() callers like
// OrdersService.notifyAdminsAndMerchant, MerchantService.notifyAdmins,
// SupportService.notifyAdmins) - this just polls that same feed and surfaces
// new items as a native Notification instead of only the in-app bell.
export default function DesktopPushNotifications() {
  const router = useRouter();
  // Always starts "unsupported" (matching SSR, where `window` doesn't exist)
  // and the banner starts dismissed - both flip to their real value in the
  // effect below, which only runs client-side after hydration. Reading
  // Notification.permission/localStorage directly in the initializer would
  // make the server and first client render disagree on whether the banner
  // shows, which React flags as a hydration mismatch.
  const [permission, setPermission] = useState("unsupported");
  const [dismissed, setDismissed] = useState(true);
  const seenIds = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      // localStorage unavailable (private mode) - just don't show the banner
    }
  }, []);

  const { data } = useGetNotificationsQuery(undefined, {
    pollingInterval: permission === "granted" ? POLL_MS : 0,
  });

  useEffect(() => {
    if (permission !== "granted" || !data?.items) return;
    const items = data.items;

    // First sighting of the feed: just remember what's already there so
    // reload/login doesn't fire a native alert for the whole backlog.
    if (seenIds.current === null) {
      seenIds.current = new Set(items.map((n) => n.id));
      return;
    }

    for (const n of items) {
      if (n.readAt || seenIds.current.has(n.id)) continue;
      seenIds.current.add(n.id);
      const notification = new Notification(n.title, {
        body: n.body || undefined,
        icon: "/icon.png",
        tag: n.id,
      });
      notification.onclick = () => {
        window.focus();
        if (n.href) router.push(n.href);
        notification.close();
      };
    }
  }, [data, permission, router]);

  const handleEnable = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (permission !== "default" || dismissed) return null;

  return (
    <div className="mx-4 mt-4 flex items-center gap-3 rounded-[14px] border border-shop-accent-1/30 bg-shop-accent-1-light px-4 py-3 lg:mx-8">
      <Bell className="h-4 w-4 shrink-0 text-shop-accent-1" strokeWidth={1.75} />
      <p className="flex-1 text-[12px] leading-snug text-shop-heading">
        Get desktop alerts for new admin notifications, even in a background tab.
      </p>
      <button
        type="button"
        onClick={handleEnable}
        className="shrink-0 rounded-full bg-shop-accent-1 px-3 py-1.5 text-[11.5px] font-semibold text-white"
      >
        Enable
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-shop-text/50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
