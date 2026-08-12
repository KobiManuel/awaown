import React from "react";
import Image from "next/image";

const Facebook = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M14.5 8.5H16.5V5.3C16.16 5.26 15 5.17 13.65 5.17C10.82 5.17 8.89 6.9 8.89 10.06V12.75H5.75V16.32H8.89V22.83H12.58V16.32H15.6L16.08 12.75H12.58V10.43C12.58 9.39 12.86 8.5 14.5 8.5Z" fill="currentColor" />
  </svg>
);
const Instagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
  </svg>
);
const Youtube = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M10.5 9.5L15 12L10.5 14.5V9.5Z" fill="currentColor" />
  </svg>
);
const Twitter = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M20 6.5c-.6.3-1.3.5-2 .6.7-.4 1.3-1.1 1.5-2-.7.4-1.4.7-2.2.9a3.4 3.4 0 0 0-5.8 3.1A9.7 9.7 0 0 1 4.5 5.4a3.4 3.4 0 0 0 1 4.5c-.5 0-1-.2-1.5-.4v.1c0 1.6 1.2 3 2.7 3.3-.5.1-1 .2-1.5.1a3.4 3.4 0 0 0 3.2 2.4A6.9 6.9 0 0 1 3 16.9a9.7 9.7 0 0 0 5.3 1.6c6.3 0 9.8-5.3 9.8-9.8v-.4c.7-.5 1.3-1.1 1.9-1.8Z" fill="currentColor" />
  </svg>
);

const columns = [
  {
    title: "Quick Links",
    links: ["Privacy Policy", "Refund Policy", "Shipping Policy", "Terms of Service", "Policy for Buyers", "Policy for Sellers"],
  },
  {
    title: "Information",
    links: ["Size Chart", "Contact", "About Us", "FAQs", "Shipping & Refund", "Sitemap"],
  },
  {
    title: "Your Account",
    links: ["Search", "About Us", "Delivery Information", "Contact", "FAQs", "Shipping"],
  },
  {
    title: "Find Product",
    links: ["Furniture", "Men's Clothes", "Leather Watch", "Electronics", "Sunglasses", "Jewellery"],
  },
];

const socials = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Youtube, label: "YouTube" },
  { icon: Twitter, label: "Twitter" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-shop-border bg-white font-shop">
      <div className="mx-auto grid w-full max-w-[1460px] grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 md:grid-cols-6 md:px-8">
        <div className="col-span-2 flex flex-col gap-4">
          <Image
            src="/v2/images/awa-logo.webp"
            alt="AwaOwn"
            width={220}
            height={60}
            className="h-14 w-auto object-contain"
          />
          <p className="text-[13px] font-semibold uppercase tracking-wide text-shop-heading">
            Contact Us
          </p>
          <div className="flex flex-col gap-1 text-[13px] text-shop-text">
            <p>AwaOwn Marketplace</p>
            <p>12 Gwarinpa Estate, Abuja, Nigeria</p>
            <p>hello@awaown.com</p>
            <p>+234 803 210 5000</p>
          </div>
          <a
            href="#"
            className="mt-2 w-fit rounded-[4px] bg-shop-accent-1 px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            Online Chat — Get Expert Help
          </a>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="col-span-1 flex flex-col gap-3">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-shop-heading">
              {col.title}
            </p>
            {col.links.map((link) => (
              <a
                key={link}
                href="#"
                className="text-[13px] text-shop-text hover:text-shop-accent-1"
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-shop-border">
        <div className="mx-auto flex w-full max-w-[1460px] flex-col-reverse items-center gap-4 px-4 py-6 md:flex-row md:justify-between md:px-8">
          <p className="text-[12px] text-shop-text/70">
            © {year}, AwaOwn. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-shop-border text-shop-heading hover:border-shop-accent-1 hover:text-shop-accent-1"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["Visa", "Mastercard", "Amex", "PayPal", "Diners Club", "Discover"].map((p) => (
              <span
                key={p}
                className="rounded-[4px] border border-shop-border px-2.5 py-1 text-[11px] font-medium text-shop-text"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
