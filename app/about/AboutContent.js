"use client";

import React from "react";
import Link from "next/link";
import { Store, Users2, PiggyBank, ShoppingBag, ArrowRight } from "lucide-react";
import { useGetAboutImagesQuery } from "@/lib/api/storefrontApi";
import AboutImageSlot from "./AboutImageSlot";
import FlipCards from "./FlipCards";

const AUDIENCES = [
  {
    key: "merchants",
    icon: Store,
    title: "Merchants",
    body: "From local manufacturers and wholesalers to independent business owners, AwaOwn lets merchants list their products, connect with new customers, and grow their business.",
  },
  {
    key: "partners",
    icon: Users2,
    title: "Partners",
    body: "Build a digital store, curate products, and share them with your audience to earn from every sale, without buying stock, holding inventory, or managing shipping.",
  },
  {
    key: "investors",
    icon: PiggyBank,
    title: "Inventory Investors",
    body: "Back fast-selling products or fund your own inventory on AwaOwn, letting Partners drive promotion so you earn steady income straight from actual sales.",
  },
  {
    key: "customers",
    icon: ShoppingBag,
    title: "Customers",
    body: "Discover and shop products from trusted businesses on AwaOwn, where every purchase comes with customer protection and seamless delivery.",
  },
];

// One "S" curve connecting the far edge of one card to the near edge of the
// next. Coordinates are normalised (0-100) on both axes, so stretching the
// SVG to whatever height the gap ends up being at runtime still reads as a
// smooth ribbon. `flip` alternates which side it starts/ends on, so
// consecutive connectors continue from where the last one left off - one
// unbroken line snaking down the whole list.
function Connector({ flip }) {
  const [x1, x2] = flip ? [82, 18] : [18, 82];
  return (
    <div className="mx-auto h-10 w-full max-w-[220px] md:h-14">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <path
          d={`M ${x1} 0 C ${x1} 50 ${x2} 50 ${x2} 100`}
          fill="none"
          stroke="#6D28D9"
          strokeOpacity="0.35"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function AboutContent() {
  const { data } = useGetAboutImagesQuery();
  const images = data?.images ?? {};

  return (
    <main className="flex-1 font-shop">
      {/* Hero */}
      <section className="flex items-center justify-center bg-shop-accent-1 px-4 py-10">
        <h1 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white">
          About Us
        </h1>
      </section>

      <section className="flex flex-col items-center gap-3 px-4 py-12 text-center md:py-16">
        <h2 className="max-w-[640px] text-[24px] font-bold leading-[32px] text-shop-heading md:text-[34px] md:leading-[42px]">
          Discover AwaOwn - Where Commerce Meets Community
        </h2>
        <p className="max-w-[560px] text-[13.5px] leading-[21px] text-shop-text">
          AwaOwn is a digital marketplace connecting Merchants, Partners,
          Inventory Investors and everyday Shoppers into a single ecosystem,
          creating more ways for people to participate in commerce and build
          businesses.
        </p>
      </section>

      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-8">
        <AboutImageSlot
          sectionKey="hero"
          value={images.hero}
          alt="AwaOwn"
          className="aspect-[16/9] w-full md:aspect-[16/7]"
        />

        {/* Ecosystem intro */}
        <section className="mt-16 flex flex-col items-center gap-3 text-center">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.15em] text-shop-accent-1">
            One Ecosystem
          </p>
          <h2 className="text-[24px] font-bold text-shop-heading md:text-[30px]">
            Who AwaOwn Is Built For
          </h2>
          <p className="max-w-[560px] text-[13.5px] leading-[21px] text-shop-text">
            Four kinds of people make the AwaOwn marketplace work - each
            bringing their own strength, and each earning from it.
          </p>
        </section>

        {/* Alternating audience cards, threaded together by one snaking line */}
        <section className="mt-10 pb-8">
          {AUDIENCES.map((a, i) => {
            const Icon = a.icon;
            const reversed = i % 2 === 1;
            return (
              <React.Fragment key={a.key}>
                {i > 0 && <Connector flip={i % 2 === 1} />}
                <div
                  className={`flex flex-col overflow-hidden rounded-[42px] border border-shop-border bg-white md:flex-row md:rounded-[64px] ${
                    reversed ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <AboutImageSlot
                    sectionKey={a.key}
                    value={images[a.key]}
                    alt={a.title}
                    className="aspect-[16/9] w-full rounded-none md:aspect-auto md:w-[42%]"
                  />
                  <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-12">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-shop-accent-1-light">
                      <Icon className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />
                    </span>
                    <h3 className="text-[19px] font-semibold text-shop-heading md:text-[22px]">
                      {a.title}
                    </h3>
                    <p className="text-[13.5px] leading-[22px] text-shop-text">
                      {a.body}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </section>

        {/* Vision */}
        <section className="mb-16 flex flex-col items-center gap-3 rounded-[28px] bg-shop-bg px-6 py-14 text-center md:py-16">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.15em] text-shop-accent-1">
            Our Vision
          </p>
          <h2 className="max-w-[620px] text-[22px] font-semibold leading-[30px] text-shop-heading md:text-[26px] md:leading-[36px]">
            Commerce works better when everyone brings their strength to the
            table.
          </h2>
          <p className="max-w-[520px] text-[14px] leading-[22px] text-shop-text">
            Making commerce simple, accessible, and rewarding for everyone
            involved.
          </p>
        </section>

        {/* Kept from the earlier draft */}
        <section className="mb-16 flex flex-col gap-6">
          <h2 className="text-center text-[22px] font-semibold text-shop-heading md:text-[26px]">
            What holds the ecosystem together
          </h2>
          <FlipCards />
        </section>

        {/* CTA */}
        <section className="mb-16 flex flex-col items-center gap-4 rounded-[28px] bg-shop-accent-1 px-6 py-12 text-center text-white md:py-14">
          <h2 className="text-[20px] font-semibold md:text-[24px]">
            Ready to be part of it?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login/merchant?mode=signup"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13.5px] font-semibold text-shop-accent-1"
            >
              Become a Merchant <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login/partner?mode=signup"
              className="flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[13.5px] font-semibold text-white hover:bg-white/10"
            >
              Become a Partner <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
