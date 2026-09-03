"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { AlertTriangle, X } from "lucide-react";

/**
 * Imperative confirm dialog for admin actions.
 *
 *   const confirm = useConfirm();
 *   const res = await confirm({
 *     title: "Suspend this merchant?",
 *     message: "They stop receiving orders until reinstated.",
 *     confirmLabel: "Suspend",
 *     tone: "danger",
 *     reason: { label: "Reason (emailed to them)", required: true },
 *   });
 *   if (!res) return;              // cancelled
 *   await doTheThing(res.reason);  // reason is "" when no reason field was requested
 */
const ConfirmCtx = createContext(null);

export function ConfirmProvider({ children }) {
  const [opts, setOpts] = useState(null);
  const [reason, setReason] = useState("");
  const resolver = useRef(null);

  const confirm = useCallback((options) => {
    setReason("");
    setOpts(options || {});
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = (result) => {
    resolver.current?.(result);
    resolver.current = null;
    setOpts(null);
  };

  const cancel = () => settle(null);
  const proceed = () => {
    if (opts?.reason?.required && !reason.trim()) return;
    settle({ reason: reason.trim() });
  };

  const danger = opts?.tone === "danger";

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {opts && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 p-0 lg:items-center lg:p-4"
          onClick={cancel}
        >
          <div
            className="w-full max-w-[420px] rounded-t-[20px] bg-white p-5 font-shop lg:rounded-[16px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    danger ? "bg-red-50 text-shop-accent-3" : "bg-shop-accent-1-light text-shop-accent-1"
                  }`}
                >
                  <AlertTriangle className="h-4.5 w-4.5" strokeWidth={1.75} />
                </span>
                <p className="text-[14px] font-semibold text-shop-heading">
                  {opts.title || "Are you sure?"}
                </p>
              </div>
              <button
                type="button"
                onClick={cancel}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-shop-bg"
              >
                <X className="h-4 w-4 text-shop-heading" />
              </button>
            </div>

            {opts.message && (
              <p className="mt-3 text-[12.5px] leading-[19px] text-shop-text">
                {opts.message}
              </p>
            )}

            {opts.reason && (
              <div className="mt-3 flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-shop-heading">
                  {opts.reason.label || "Reason"}
                  {opts.reason.required && <span className="text-shop-accent-3"> *</span>}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder={opts.reason.placeholder || ""}
                  className="w-full resize-none rounded-[10px] border border-shop-border p-2.5 text-[12.5px] text-shop-heading outline-none focus:border-shop-accent-1"
                />
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={cancel}
                className="flex-1 rounded-[10px] border border-shop-border py-2.5 text-[12.5px] font-semibold text-shop-heading"
              >
                {opts.cancelLabel || "Cancel"}
              </button>
              <button
                type="button"
                onClick={proceed}
                disabled={opts.reason?.required && !reason.trim()}
                className={`flex-1 rounded-[10px] py-2.5 text-[12.5px] font-semibold text-white disabled:opacity-50 ${
                  danger ? "bg-shop-accent-3" : "bg-shop-accent-1"
                }`}
              >
                {opts.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) {
    throw new Error("useConfirm must be used within a <ConfirmProvider>");
  }
  return ctx;
}
