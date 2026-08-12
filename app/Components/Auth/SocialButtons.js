import React from "react";

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
    />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M14.5 8.5H16.5V5.3C16.16 5.26 15 5.17 13.65 5.17C10.82 5.17 8.89 6.9 8.89 10.06V12.75H5.75V16.32H8.89V22.83H12.58V16.32H15.6L16.08 12.75H12.58V10.43C12.58 9.39 12.86 8.5 14.5 8.5Z"
      fill="#1877F2"
    />
  </svg>
);

const SocialButtons = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-[8px] border border-shop-border bg-white py-2.5 text-[13px] font-medium text-shop-heading transition-colors hover:bg-shop-bg"
      >
        <GoogleIcon className="h-4 w-4" />
        Google
      </button>
      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-[8px] border border-shop-border bg-white py-2.5 text-[13px] font-medium text-shop-heading transition-colors hover:bg-shop-bg"
      >
        <FacebookIcon className="h-4 w-4" />
        Facebook
      </button>
    </div>
  );
};

export default SocialButtons;
