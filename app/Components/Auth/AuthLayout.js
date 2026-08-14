import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Truck, BadgePercent } from "lucide-react";

const perks = [
  { icon: ShieldCheck, label: "Verified merchants only" },
  { icon: Truck, label: "Nationwide delivery tracking" },
  { icon: BadgePercent, label: "Member-only deals every week" },
];

const AuthLayout = ({ eyebrow, title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen w-full bg-shop-bg font-shop">
      {/* Branded panel */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <Image
          src="/v2/images/floating-bg.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <Link href="/" className="relative z-10 w-fit">
          <div className="relative h-11 w-[150px] overflow-hidden rounded-[8px] bg-white/95 px-3 py-2">
            <Image
              src="/v2/images/awa-logo.webp"
              alt="AwaOwn"
              fill
              className="object-contain p-1"
            />
          </div>
        </Link>

        <div className="relative z-10 flex max-w-[420px] flex-col gap-6 rounded-[20px] border border-white/20 bg-white/10 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <h2 className="text-[32px] font-semibold leading-[40px]">
            Nigeria&apos;s trusted marketplace, in one account.
          </h2>
          <p className="text-[15px] leading-[24px] text-white/80">
            Shop from verified merchants, track every order, and unlock
            member-only pricing across thousands of products.
          </p>
          <div className="flex flex-col gap-4">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[14px] text-white/90">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[13px] text-white/60">
          &copy; {new Date().getFullYear()} AwaOwn. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 lg:hidden"
          >
            <div className="relative h-9 w-[130px]">
              <Image
                src="/v2/images/awa-logo.webp"
                alt="AwaOwn"
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>

          {eyebrow && (
            <span className="mb-3 inline-block rounded-full bg-shop-accent-1-light px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-shop-accent-1">
              {eyebrow}
            </span>
          )}
          <h1 className="text-[26px] font-semibold text-shop-heading sm:text-[30px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-[14px] leading-[22px] text-shop-text">
              {subtitle}
            </p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
