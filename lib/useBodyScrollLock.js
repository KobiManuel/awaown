"use client";

import { useEffect } from "react";

// Module-level, not per-component - several modals can be mounted at once
// (e.g. a ConfirmDialog opened from inside a ModalShell modal), and scroll
// must only come back once every one of them has actually closed. A
// per-component boolean would unlock the page the moment the *first* of
// several stacked modals closes, leaving the rest silently non-functional
// but the page scrollable underneath them.
let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

/**
 * Locks page scroll for as long as this hook is active, and restores it
 * exactly once the last active lock releases - including on an abrupt
 * unmount (route change, parent re-render removing the modal, etc.), since
 * the restore lives in the effect's cleanup, which React always runs.
 *
 *   useBodyScrollLock(isOpen);
 */
export function useBodyScrollLock(active = true) {
  useEffect(() => {
    if (!active || typeof document === "undefined") return;

    if (lockCount === 0) {
      savedOverflow = document.body.style.overflow;
      savedPaddingRight = document.body.style.paddingRight;
      // Compensate for the scrollbar disappearing, so the page doesn't
      // visibly shift width while a modal is open.
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        const current = parseFloat(savedPaddingRight) || 0;
        document.body.style.paddingRight = `${current + scrollbarWidth}px`;
      }
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = savedOverflow;
        document.body.style.paddingRight = savedPaddingRight;
      }
    };
  }, [active]);
}
