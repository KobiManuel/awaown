"use client";

import React from "react";

/**
 * Text input for a whole-naira amount. Shows the value grouped with thousands
 * separators as the user types (2,000) but hands `onChange` the raw digit
 * string ("2000"), so callers keep storing/sending a plain number.
 *
 *   <MoneyInput value={price} onChange={setPrice} className={inputCls} placeholder="15,000" />
 */
export default function MoneyInput({
  value,
  onChange,
  className = "",
  placeholder,
  ...rest
}) {
  const digits = String(value ?? "").replace(/\D/g, "");
  const display = digits ? Number(digits).toLocaleString("en-NG") : "";

  return (
    <input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      placeholder={placeholder}
      className={className}
      {...rest}
    />
  );
}
