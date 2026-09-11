import React from "react";

// Simplified, recognizable brand marks (not pixel-accurate reproductions of the
// official logo artwork). Same approach as the inline Google/Facebook icons in
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

// The real WhatsApp glyph (Font Awesome's brand path - the same outline
// WhatsApp's own icon uses), on their brand green.
export const WhatsAppLogo = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#25D366" />
    <path
      d="M23.47 8.52A10.94 10.94 0 0 0 15.98 5.5c-6.06 0-11 4.94-11 11 0 1.94.51 3.83 1.47 5.5L4.9 27.5l5.65-1.48a10.98 10.98 0 0 0 5.42 1.38h.01c6.06 0 11-4.94 11-11 0-2.94-1.15-5.7-3.51-8.88ZM15.98 25.6a9.1 9.1 0 0 1-4.65-1.27l-.33-.2-3.46.9.92-3.37-.22-.35a9.13 9.13 0 0 1-1.4-4.86c0-5.03 4.1-9.13 9.15-9.13a9.1 9.1 0 0 1 6.46 2.68 9.06 9.06 0 0 1 2.68 6.46c0 5.04-4.1 9.14-9.15 9.14Zm5.02-6.84c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.08-.16.18-.32.2-.6.07-.27-.14-1.15-.42-2.18-1.34a8.17 8.17 0 0 1-1.51-1.87c-.16-.27-.02-.42.12-.56.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47l-.53-.01c-.18 0-.48.07-.73.34s-.96.94-.96 2.29.98 2.66 1.12 2.84c.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.12-.25-.19-.52-.33Z"
      fill="#fff"
    />
  </svg>
);

// The real Mastercard mark - two overlapping circles in their exact brand
// colours (red #EB001B, yellow #F79E1B, overlap #FF5F00).
export const MastercardLogo = ({ className = "h-6 w-10" }) => (
  <svg viewBox="0 0 48 30" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="15" r="15" fill="#EB001B" />
    <circle cx="30" cy="15" r="15" fill="#F79E1B" />
    <path
      d="M24 4.2a14.96 14.96 0 0 1 0 21.6 14.96 14.96 0 0 1 0-21.6Z"
      fill="#FF5F00"
    />
  </svg>
);

// Visa's wordmark - a simple italic "VISA" in their brand blue.
export const VisaLogo = ({ className = "h-6 w-10" }) => (
  <svg viewBox="0 0 48 30" className={className} xmlns="http://www.w3.org/2000/svg">
    <text
      x="24"
      y="21"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontStyle="italic"
      fontWeight="800"
      fontSize="17"
      fill="#1A1F71"
      letterSpacing="-0.5"
    >
      VISA
    </text>
  </svg>
);

// Verve (Interswitch) - their wordmark on the signature orange-to-red mark.
export const VerveLogo = ({ className = "h-6 w-10" }) => (
  <svg viewBox="0 0 48 30" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="verveGrad" x1="0" y1="0" x2="48" y2="0">
        <stop offset="0" stopColor="#F7941E" />
        <stop offset="1" stopColor="#EE3524" />
      </linearGradient>
    </defs>
    <rect width="48" height="30" rx="5" fill="url(#verveGrad)" />
    <text
      x="24"
      y="20"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="800"
      fontStyle="italic"
      fontSize="12"
      fill="#fff"
    >
      Verve
    </text>
  </svg>
);

export const BANK_LOGOS = {
  gtb: GTBankLogo,
  zenith: ZenithBankLogo,
};
