"use client";

import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Blocking full-screen overlay for short unavoidable waits (e.g. resolving the
 * session before redirecting a shopper from a public page into their dashboard
 * checkout). Render it conditionally; it covers everything at z-[200].
 */
export default function FullScreenLoader({ label = "One moment" }) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3 bg-white/85 font-shop backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-shop-accent-1" />
      <p className="text-[13px] font-medium text-shop-text">{label}</p>
    </div>
  );
}
