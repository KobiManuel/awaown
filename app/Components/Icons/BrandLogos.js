import React from "react";

// Simplified, recognizable brand marks (not pixel-accurate reproductions of the
// official logo artwork) — same approach as the inline Google/Facebook icons in
// SocialButtons.js. Each renders as a small rounded badge sized by className.

export const PaystackLogo = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#00C3F7" />
    <path
      d="M9 20.5C9 15.8056 12.8056 12 17.5 12C19.5 12 21.3 12.7 22.7 13.9"
      stroke="white"
      strokeWidth="2.6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M23 11.5V16.5H18"
      stroke="white"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const GTBankLogo = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#FF6600" />
    <path
      d="M16 8L24 12V16C24 20.5 20.7 24.4 16 25.5C11.3 24.4 8 20.5 8 16V12L16 8Z"
      fill="white"
    />
    <path d="M16 11L21 13.4V16C21 18.9 18.9 21.3 16 22.2C13.1 21.3 11 18.9 11 16V13.4L16 11Z" fill="#FF6600" />
  </svg>
);

export const ZenithBankLogo = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#E4032E" />
    <path
      d="M11 12H21L11.5 20H21"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const BANK_LOGOS = {
  gtb: GTBankLogo,
  zenith: ZenithBankLogo,
};
