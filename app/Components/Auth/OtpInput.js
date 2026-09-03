"use client";

import React, { useRef } from "react";

/**
 * 6-box one-time-code input. Calls `onChange` with the joined string and
 * `onComplete` once all six digits are filled. Handles paste, backspace and
 * arrow navigation.
 */
export default function OtpInput({ value = "", onChange, onComplete, disabled }) {
  const refs = useRef([]);
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const setAt = (i, d) => {
    const next = digits.slice();
    next[i] = d;
    const joined = next.join("").slice(0, 6);
    onChange(joined);
    if (joined.length === 6 && !joined.includes("")) onComplete?.(joined);
  };

  const handleChange = (i, e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return setAt(i, "");
    if (raw.length > 1) {
      // pasted / autofilled
      const chars = raw.slice(0, 6 - i).split("");
      const next = digits.slice();
      chars.forEach((c, k) => (next[i + k] = c));
      const joined = next.join("").slice(0, 6);
      onChange(joined);
      const focusIndex = Math.min(i + chars.length, 5);
      refs.current[focusIndex]?.focus();
      if (joined.length === 6 && !joined.includes("")) onComplete?.(joined);
      return;
    }
    setAt(i, raw);
    if (i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex items-center justify-between gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={6}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className="h-13 w-full min-w-0 rounded-[10px] border border-shop-border bg-white text-center text-[20px] font-semibold text-shop-heading outline-none transition-colors focus:border-shop-accent-1 focus:ring-2 focus:ring-shop-accent-1-light disabled:opacity-60"
        />
      ))}
    </div>
  );
}
