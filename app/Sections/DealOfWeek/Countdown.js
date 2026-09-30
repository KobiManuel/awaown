"use client";

import React, { useEffect, useState } from "react";

const getTimeLeft = (target) => {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

// target: the deal's real endsAt, as epoch ms - set by the admin, not this
// component. The caller (DealOfWeek/main.js) already only renders this once
// it's confirmed the deal is still active, so target is always in the future
// on mount.
const Countdown = ({ target }) => {
  // Server and client render at slightly different instants, so computing
  // the time left during the initial render would mismatch between SSR and
  // hydration. Render a static placeholder first, then compute the real
  // countdown client-side after mount.
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (!target) return;
    setTime(getTimeLeft(target));
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: time?.days ?? 0 },
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
