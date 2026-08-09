"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PaystackLogo } from "@/app/Components/Footer/payment-logos";

const FinalCTA = () => {
  return (
    <div className="mx-auto mt-[60px] w-full max-w-[1360px] px-5 md:mt-[100px]">
      <div className="flex flex-col items-center gap-8 rounded-[32px] bg-gradient-to-br from-[#827BFF] to-[#5B72E8] px-6 py-14 text-center md:rounded-[54px] md:px-10 md:py-20">
        <div className="flex flex-col items-center gap-4">
          <h2 className="max-w-[560px] font-['TomatoGrotesk'] text-[32px] font-semibold leading-[38px] text-white md:text-[44px] md:leading-[50px]">
            Ready to shop, sell or earn?
          </h2>
          <p className="max-w-[520px] text-[15px] leading-[24px] text-[#ffffffcd] md:text-[16px]">
            Join Nigeria&apos;s trusted marketplace, transparent pricing,
            verified merchants, real earnings.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/products"
              className="block rounded-full bg-white px-7 py-[14px] text-[15px] font-medium text-awaown-purple"
            >
              Start shopping
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="#for-merchants"
              className="block rounded-full bg-white/20 px-7 py-[14px] text-[15px] font-medium text-white"
            >
              Sell on AwaOwn
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="#for-affiliates"
              className="block rounded-full bg-white/20 px-7 py-[14px] text-[15px] font-medium text-white"
            >
              Earn as affiliate
            </Link>
          </motion.div>
        </div>

        <div className="h-px w-full max-w-[520px] bg-white/20" />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <p className="text-[13px] text-white/70">Payments powered by</p>
          <span className="flex items-center rounded-full bg-white/15 px-4 py-2.5">
            <PaystackLogo className="h-[14px] w-auto" />
          </span>
          <span className="rounded-full bg-white/15 px-4 py-2 text-[13px] font-medium text-white">
            Bank Transfer
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinalCTA;
