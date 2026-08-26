"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

const LIGHT_LOGO = "/v2/images/awa-logo.webp";
const DARK_LOGO = "/dark-mode-logo.png";

function isDarkSurface(hex) {
  const n = hex.trim().replace("#", "");
  if (n.length !== 6) return false;
  const r = parseInt(n.substring(0, 2), 16);
  const g = parseInt(n.substring(2, 4), 16);
  const b = parseInt(n.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 150;
}

// Swaps the AwaOwn wordmark for a light-on-dark version whenever the surface behind it
// is dark — reads the resolved --shop-surface custom property at its own position in
// the tree, rather than checking one specific mechanism, so it stays correct for both
// the site-wide dark mode toggle (sets data-theme on <html>, no re-render of this
// component) and the Partner dashboard's own store-theme reskin (sets --shop-surface
// via inline style on an ancestor, which *does* re-render this component — hence the
// unconditional per-render remeasure below alongside the attribute observer).
const ThemedLogo = ({ fill, width, height, sizes, className, priority }) => {
  const ref = useRef(null);
  const [isDark, setIsDark] = useState(false);

  const measure = () => {
    if (!ref.current) return;
    const surface = getComputedStyle(ref.current).getPropertyValue("--shop-surface");
    if (surface) setIsDark(isDarkSurface(surface));
  };

  useLayoutEffect(() => {
    measure();
  });

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(measure);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const src = isDark ? DARK_LOGO : LIGHT_LOGO;

  return (
    <span ref={ref} style={{ display: "contents" }}>
      {fill ? (
        <Image src={src} alt="AwaOwn" fill sizes={sizes} className={className} priority={priority} />
      ) : (
        <Image src={src} alt="AwaOwn" width={width} height={height} className={className} priority={priority} />
      )}
    </span>
  );
};

export default ThemedLogo;
