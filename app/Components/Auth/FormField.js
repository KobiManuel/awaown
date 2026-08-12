"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormField = ({
  label,
  type = "text",
  icon,
  placeholder,
  name,
  required = true,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-shop-heading">{label}</span>
      <div className="flex items-center gap-2 rounded-[8px] border border-shop-border bg-white px-3.5 py-3 transition-colors focus-within:border-shop-accent-1 focus-within:ring-2 focus-within:ring-shop-accent-1-light">
        {icon && <span className="shrink-0 text-shop-text/50">{icon}</span>}
        <input
          type={resolvedType}
          name={name}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full bg-transparent text-[14px] text-shop-heading outline-none placeholder:text-shop-text/40"
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="shrink-0 text-shop-text/50 hover:text-shop-heading"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </label>
  );
};

export default FormField;
