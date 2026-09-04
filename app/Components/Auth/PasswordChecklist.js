"use client";

import React from "react";
import { Check, Circle } from "lucide-react";
import { PASSWORD_RULES } from "@/lib/password-rules";

/**
 * Live requirements list under a password field — a rule's icon turns into a
 * check the moment the value satisfies it.
 */
export default function PasswordChecklist({ value = "", className = "" }) {
  return (
    <ul className={`flex flex-col gap-1 ${className}`}>
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(value);
        return (
          <li
            key={rule.id}
            className={`flex items-center gap-1.5 text-[11.5px] transition-colors ${
              ok ? "text-emerald-600" : "text-shop-text/60"
            }`}
          >
            {ok ? (
              <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
            ) : (
              <Circle className="h-3 w-3 shrink-0" strokeWidth={2} />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
