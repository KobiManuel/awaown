"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { purchaseNotifications } from "@/lib/shop-data";
import { useGetSocialProofQuery } from "@/lib/api/storefrontApi";

const CYCLE_MS = 10000;
const VISIBLE_MS = 7000;
const INITIAL_DELAY_MS = 3000;

const randomMinutesAgo = () => 4 + Math.floor(Math.random() * 56);

function relativeTime(at) {
  if (!at) return `${randomMinutesAgo()} minutes ago`;
  const mins = Math.round((Date.now() - new Date(at).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

// Fallback to the bundled demo list (already {title, image, location}) so there
// is always something to show even before the API responds.
const FALLBACK = purchaseNotifications.map((p) => ({
  title: p.title,
  image: p.image,
  slug: null,
  location: p.location,
  at: null,
}));

const PurchaseNotification = () => {
  const { data } = useGetSocialProofQuery();
  const feed = useMemo(
    () => (data?.items?.length ? data.items : FALLBACK),
    [data],
  );

  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [label, setLabel] = useState("");
  const pausedRef = useRef(false);
  const cycleTimer = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    if (dismissed || !feed.length) return;

    const show = () => {
      if (pausedRef.current) return;
      setIndex((prev) => {
        const next = (prev + 1) % feed.length;
        setLabel(relativeTime(feed[next]?.at));
        return next;
      });
      setVisible(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
    };

    const first = setTimeout(show, INITIAL_DELAY_MS);
    cycleTimer.current = setInterval(show, CYCLE_MS);

    return () => {
      clearTimeout(first);
      clearTimeout(hideTimer.current);
      clearInterval(cycleTimer.current);
    };
  }, [dismissed, feed]);

  if (dismissed || !feed.length) return null;

  const item = feed[index] ?? feed[0];
  const href = item.slug ? `/product/${item.slug}` : "/shop";

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 flex w-[320px] items-center gap-4 rounded-[12px] border border-shop-border bg-white p-4 font-shop shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      onMouseEnter={() => {
        pausedRef.current = true;
        clearTimeout(hideTimer.current);
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
        hideTimer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
      }}
    >
      <Link
        href={href}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[8px] bg-shop-bg"
      >
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain p-2"
            sizes="80px"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <p className="text-[12px] text-shop-text/70">Someone purchased</p>
        <Link
          href={href}
          className="line-clamp-2 text-[14px] font-semibold leading-[18px] text-shop-heading hover:text-shop-accent-1"
        >
          {item.title}
        </Link>
        <p className="text-[12px] text-shop-text/70">
          {item.location} &middot; {label || relativeTime(item.at)}
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => setDismissed(true)}
        className="shrink-0 text-shop-text/50 hover:text-shop-heading"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PurchaseNotification;
