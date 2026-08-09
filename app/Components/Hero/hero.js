"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Truck, CreditCard, Headset } from "lucide-react";

import Card1 from "@/public/images/hero-card-1.png";
import Card2 from "@/public/images/hero-card-2.png";
import Card3 from "@/public/images/hero-card-3.png";
import Card4 from "@/public/images/hero-card-4.png";
import Card5 from "@/public/images/hero-card-5.png";
import Card6 from "@/public/images/hero-card-6.png";
import Card7 from "@/public/images/hero-card-7.png";

const cards = [
  { src: Card1, rotate: -9, y: 14 },
  { src: Card2, rotate: -5, y: -6 },
  { src: Card3, rotate: -2, y: 10 },
  { src: Card4, rotate: 0, y: -14 },
  { src: Card5, rotate: 3, y: 8 },
  { src: Card6, rotate: 6, y: -4 },
  { src: Card7, rotate: 9, y: 16 },
];

const stats = [
  { value: "10+", label: "Verified merchants" },
  { value: "50+", label: "Products listed" },
  { value: "30+", label: "Affiliates earning" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Verified merchants only" },
  { icon: Lock, label: "Encrypted payments" },
  { icon: Truck, label: "Nationwide delivery" },
  { icon: CreditCard, label: "Secured payment" },
  { icon: Headset, label: "Customer support" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#E8F7EE] to-[#F8FBF8] pb-16 pt-32 md:pt-40 lg:rounded-b-[54px]">
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6 px-5 text-center">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="font-['TomatoGrotesk'] text-[42px] font-semibold leading-[46px] text-[#0A0A13] md:text-[68px] md:leading-[72px] tracking-[-1px]"
        >
          Shop. Sell. <span className="text-awaown-green">Earn.</span>
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-[600px] text-[16px] leading-[26px] text-grey-500 md:text-[18px] md:leading-[28px]"
        >
          Discover verified merchants across Nigeria, grow your business with
          a powerful vendor dashboard, and earn real money sharing products
          you love, all from one platform.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/products"
            className="rounded-full bg-awaown-green px-7 py-[14px] text-[15px] font-medium text-white transition-colors hover:bg-awaown-green-deep"
          >
            Start shopping
          </Link>
          <Link
            href="/#for-merchants"
            className="rounded-full border border-[#0A0A13]/15 bg-white px-7 py-[14px] text-[15px] font-medium text-[#0A0A13] transition-colors hover:bg-grey-100"
          >
            Become a merchant
          </Link>
          <Link
            href="/#for-affiliates"
            className="rounded-full border border-awaown-purple/30 bg-awaown-purple/10 px-7 py-[14px] text-[15px] font-medium text-awaown-purple transition-colors hover:bg-awaown-purple/20"
          >
            Earn as an Affiliate
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 pt-8"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <p className="font-['TomatoGrotesk'] text-[26px] font-semibold text-[#0A0A13]">
                {s.value}
              </p>
              <p className="text-[13px] text-grey-500">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Tilted product card gallery - mobile: infinite marquee */}
      <div className="relative mt-16 overflow-hidden sm:hidden">
        <motion.div
          className="flex w-max items-center gap-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {[...cards, ...cards].map((c, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/4] w-[110px] shrink-0 overflow-hidden rounded-[16px] shadow-[0_20px_40px_rgba(10,10,19,0.12)]"
            >
              <Image
                src={c.src}
                alt="AwaOwn merchant product"
                fill
                className="object-cover"
                sizes="110px"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Tilted product card gallery - tablet/desktop: static arrangement */}
      <div className="relative mt-16 hidden sm:block md:mt-20">
        <div className="mx-auto flex w-full items-end justify-center gap-3 md:gap-4">
          {cards.map((c, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + idx * 0.05 }}
              style={{ rotate: `${c.rotate}deg`, translateY: c.y }}
              className="relative aspect-[3/4] w-[140px] shrink-0 overflow-hidden rounded-[16px] shadow-[0_20px_40px_rgba(10,10,19,0.12)] md:w-[190px] md:rounded-[22px]"
            >
              <Image
                src={c.src}
                alt="AwaOwn merchant product"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 140px, 190px"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="mx-auto mt-16 flex max-w-[1100px] flex-wrap items-center justify-center gap-x-8 gap-y-4 px-5 md:mt-24">
        {trustBadges.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-[13px] font-medium text-grey-500 md:text-[14px]"
          >
            <Icon className="h-4 w-4 text-awaown-green" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
