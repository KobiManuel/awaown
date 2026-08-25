"use client";

import React, { useCallback, useRef, useState } from "react";
import { Undo2, Mail } from "lucide-react";

const BUFFER_MS = 8000;

// Lets an admin action apply immediately (for instant UI feedback) while its
// "email notification" is held for a short buffer — undoing within the window
// reverts state and cancels the notification, guarding against a fat-fingered
// approve/reject/suspend/remove.
export function useUndoBuffer() {
  const [pending, setPending] = useState(null);
  const timerRef = useRef(null);

  const run = useCallback((message, undo, onFinalize) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPending({ message, undo });
    timerRef.current = setTimeout(() => {
      onFinalize?.();
      setPending(null);
      timerRef.current = null;
    }, BUFFER_MS);
  }, []);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPending((p) => {
      p?.undo?.();
      return null;
    });
  }, []);

  const bar = pending ? (
    <div className="fixed inset-x-0 bottom-[100px] z-[70] mx-auto flex w-full max-w-[480px] justify-center px-4 lg:bottom-6 lg:max-w-none lg:px-8">
      <div className="flex items-center gap-3 rounded-full bg-shop-heading px-4 py-2.5 text-[12.5px] font-medium text-white shadow-lg">
        <Mail className="h-3.5 w-3.5 shrink-0 text-shop-accent-1-light" />
        <span className="line-clamp-1">{pending.message}</span>
        <button
          type="button"
          onClick={cancel}
          className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold hover:bg-white/25"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Undo
        </button>
      </div>
    </div>
  ) : null;

  return { run, bar };
}
