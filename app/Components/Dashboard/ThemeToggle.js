"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const THEME_KEY = "awaown_theme";

export default function ThemeToggle({ className = "" }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const applyTheme = (next) => {
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
    setIsDark(next === "dark");
  };

  const handleToggle = (e) => {
    const next = isDark ? "light" : "dark";
    if (!document.startViewTransition) {
      applyTheme(next);
      return;
    }
    document.documentElement.style.setProperty("--vt-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--vt-y", `${e.clientY}px`);
    document.startViewTransition(() => applyTheme(next));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-bg text-shop-heading transition-colors hover:bg-shop-accent-1-light ${className}`}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5" strokeWidth={1.75} />
      ) : (
        <Moon className="h-4.5 w-4.5" strokeWidth={1.75} />
      )}
    </button>
  );
}
