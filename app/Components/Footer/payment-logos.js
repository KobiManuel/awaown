import React from "react";

export const VisaLogo = (props) => (
  <svg viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M20.7 15.7h-3.5l2.2-13.4h3.5l-2.2 13.4Zm-8.6-13.4L8.7 11.2l-.4-1.9-1.2-6.2s-.1-1-1.4-1H.1L0 2.4s1.7.4 3.7 1.5l3.2 11.8h3.6l5.5-13.4h-3.9ZM45.7 15.7H49L46.2 2.3h-2.9c-1.1 0-1.4.9-1.4.9l-5.2 12.5h3.6l.7-2h4.4l.3 2Zm-3.8-4.7 1.8-4.9.9 4.9h-2.7ZM31 6.4c0-1 1.4-1 3.7-.8l.5-2.7s-1.5-.6-3.1-.6c-3.4 0-5.8 1.8-5.8 4.4 0 2 1.8 3 3.1 3.7 1.4.7 1.9 1.1 1.9 1.7 0 .9-1.1 1.3-2.1 1.3-1.8 0-2.8-.5-2.8-.5l-.5 2.8s1.2.5 3.1.5c3.7 0 6.1-1.8 6.1-4.6 0-3.5-4.9-3.7-4.9-5.2Z"
      fill="#1A1F71"
    />
  </svg>
);

export const MastercardLogo = (props) => (
  <svg viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="15" cy="12" r="9" fill="#EB001B" />
    <circle cx="25" cy="12" r="9" fill="#F79E1B" />
    <path
      d="M20 5.2a9 9 0 0 1 0 13.6 9 9 0 0 1 0-13.6Z"
      fill="#FF5F00"
    />
  </svg>
);

export const PaystackLogo = (props) => (
  <img src="/assets/svgs/paystack.svg" alt="Paystack" {...props} />
);
