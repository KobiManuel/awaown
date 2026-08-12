import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SocialIcons } from "./socials";
import { VisaLogo, MastercardLogo, PaystackLogo } from "./payment-logos";
import logo from "@/public/images/logo.png";

const linkColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "Shop", href: "/products" },
      { label: "Browse Categories", href: "/products" },
      { label: "Stores", href: "/products" },
      { label: "Track Order", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
  {
    title: "For Merchants",
    links: [
      { label: "Register as Merchant", href: "#for-merchants" },
      { label: "Merchant Dashboard", href: "#" },
      { label: "Merchant Guidelines", href: "#" },
      { label: "Vendor Agreement", href: "#" },
    ],
  },
  {
    title: "For Affiliates",
    links: [
      { label: "Join Affiliate Program", href: "#for-affiliates" },
      { label: "Affiliate Dashboard", href: "#" },
      { label: "Affiliate Terms", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "mailto:hello@awaown.com" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
      { label: "Refund Policy", href: "#" },
    ],
  },
];

const socials = [
  { key: "instagram", href: "#" },
  { key: "facebook", href: "#" },
  { key: "tiktok", href: "#" },
  { key: "whatsapp", href: "#" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="relative mt-[60px] overflow-hidden bg-[#07090C] text-white md:mt-[100px]">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-awaown-green/25 blur-[120px]" />
      <div className="pointer-events-none absolute -top-20 right-0 h-[380px] w-[380px] rounded-full bg-awaown-purple/20 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[500px] rounded-full bg-awaown-green-light/10 blur-[140px]" />

      <div className="relative mx-auto grid w-full max-w-[1360px] grid-cols-2 gap-x-6 gap-y-12 px-5 py-16 md:grid-cols-6 md:px-10">
        <div className="col-span-2 flex flex-col gap-5 md:col-span-2">
          <Link href="/" className="relative h-20 w-[260px] md:h-24 md:w-[300px]">
            <Image
              src={logo}
              alt="AwaOwn"
              fill
              className="object-contain object-left brightness-0 invert"
            />
          </Link>
          <p className="max-w-[280px] text-[14px] leading-[22px] text-white/70">
            Nigeria&apos;s trusted marketplace where shoppers save, merchants
            grow, and affiliates earn, all in one platform.
          </p>
          <div className="flex gap-3">
            {socials.map(({ key, href }) => {
              const Icon = SocialIcons[key];
              return (
                <Link
                  key={key}
                  href={href}
                  aria-label={key}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>

        {linkColumns.map((col) => (
          <div key={col.title} className="col-span-1 flex flex-col gap-3">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-white/50">
              {col.title}
            </p>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] leading-[20px] text-white/85 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="relative mx-auto flex w-full max-w-[1360px] flex-col-reverse items-center gap-4 border-t border-white/10 px-5 py-6 md:flex-row md:justify-between md:px-10">
        <p className="text-[13px] text-white/60">
          © {year} AwaOwn. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="flex h-8 items-center rounded-[6px] bg-white px-2.5">
            <VisaLogo className="h-3 w-auto" />
          </span>
          <span className="flex h-8 items-center rounded-[6px] bg-white px-2.5">
            <MastercardLogo className="h-5 w-auto" />
          </span>
          <span className="flex h-8 items-center rounded-[6px] bg-white/10 px-2.5">
            <PaystackLogo className="h-3 w-auto" />
          </span>
          <span className="rounded-[6px] bg-white/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/70">
            BANK TRANSFER
          </span>
        </div>
      </div>

      <div className="relative -mt-2 flex justify-center overflow-hidden md:-mt-4">
        <p className="translate-y-[20%] select-none whitespace-nowrap font-['TomatoGrotesk'] text-[19vw] font-semibold leading-none tracking-tight text-white sm:translate-y-[28%] sm:text-[220px] md:text-[300px] lg:text-[360px]">
          AwaOwn
        </p>
      </div>
    </div>
  );
};

export default Footer;
