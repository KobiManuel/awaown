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

export default function AboutContent() {
  const { data } = useGetAboutImagesQuery();
  const images = data?.images ?? {};

  return (
    <main className="flex-1 font-shop">
      {/* Hero */}
      <section className="bg-shop-accent-1 px-4 py-14 text-center text-white md:py-20">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.15em] text-white/70">
          About Us
        </p>
        <h1 className="mx-auto mt-3 max-w-[640px] text-[26px] font-bold leading-[34px] md:text-[36px] md:leading-[44px]">
          Discover AwaOwn - Where Commerce Meets Community
        </h1>
        <p className="mx-auto mt-4 max-w-[560px] text-[14px] leading-[22px] text-white/85">
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
          aspect={16 / 7}
          className="-mt-8 aspect-[16/9] w-full md:-mt-10 md:aspect-[16/7]"
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

        {/* Alternating audience cards */}
        <section className="mt-10 flex flex-col gap-6 pb-8 md:gap-8">
          {AUDIENCES.map((a, i) => {
            const Icon = a.icon;
            const reversed = i % 2 === 1;
            return (
              <div
                key={a.key}
                className={`flex flex-col overflow-hidden rounded-[28px] border border-shop-border bg-white md:flex-row ${
                  reversed ? "md:flex-row-reverse" : ""
                }`}
              >
                <AboutImageSlot
                  sectionKey={a.key}
                  value={images[a.key]}
                  alt={a.title}
                  aspect={4 / 3}
                  className="aspect-[16/9] w-full rounded-none md:aspect-auto md:w-[42%]"
                />
                <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-10">
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
