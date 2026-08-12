"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { purchaseNotifications } from "@/lib/shop-data";

const CYCLE_MS = 10000;
const VISIBLE_MS = 7000;
const INITIAL_DELAY_MS = 3000;

const randomMinutesAgo = () => `${5 + Math.floor(Math.random() * 55)} Minutes Ago`;

const PurchaseNotification = () => {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [timeAgo, setTimeAgo] = useState("5 Minutes Ago");
  const pausedRef = useRef(false);
  const cycleTimer = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    if (dismissed) return;

    const show = () => {
      if (pausedRef.current) return;
      setIndex((prev) => (prev + 1) % purchaseNotifications.length);
      setTimeAgo(randomMinutesAgo());
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
  }, [dismissed]);

  if (dismissed) return null;

  const product = purchaseNotifications[index];

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 flex w-[320px] items-center gap-4 rounded-[12px] border border-shop-border bg-white p-4 font-shop shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
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
      <a href="#" className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[8px] bg-shop-bg">
        <Image src={product.image} alt={product.title} fill className="object-contain p-2" sizes="80px" />
      </a>
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <p className="text-[12px] text-shop-text/70">Someone Purchased</p>
        <a href="#" className="line-clamp-2 text-[14px] font-semibold leading-[18px] text-shop-heading hover:text-shop-accent-1">
          {product.title}
        </a>
        <p className="text-[12px] text-shop-text/70">
          ({product.location}) &middot; {timeAgo}
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
