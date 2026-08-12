"use client";

import React, { useEffect, useState } from "react";

const THREE_DAYS_MS = 1000 * 60 * 60 * 24 * 3;

const getTimeLeft = (target) => {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const Countdown = () => {
  // Server and client render at slightly different instants, so computing
  // "now + 3 days" (or reading Date.now()) during the initial render would
  // mismatch between SSR and hydration. Render a static placeholder first,
  // then compute the real countdown client-side after mount.
  const [time, setTime] = useState(null);

  useEffect(() => {
    const target = Date.now() + THREE_DAYS_MS;
    setTime(getTimeLeft(target));
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time?.days ?? 3 },
    { label: "Hours", value: time?.hours ?? 0 },
    { label: "Min", value: time?.minutes ?? 0 },
    { label: "Sec", value: time?.seconds ?? 0 },
  ];

  return (
    <div className="flex gap-3">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex w-[60px] flex-col items-center justify-center rounded-[6px] bg-shop-heading py-2 text-white"
        >
          <span className="text-[18px] font-semibold">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase text-white/70">{u.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
