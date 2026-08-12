"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, MousePointerClick } from "lucide-react";
import BreathingRect from "@/app/v1/Components/UI/BreathingRect/BreathingRect";

const points = [
  "Instant referral link & code",
  "Up to 12% commission per sale",
  "Live click & conversion tracking",
  "Request payout anytime",
  "Your customers save too",
  "No upfront costs, ever",
];

const ForAffiliates = () => {
  return (
    <div
      id="for-affiliates"
      className="relative mx-auto mt-[40px] flex w-full max-w-[1360px] flex-col overflow-hidden bg-gradient-to-r from-[#0A6B3D] to-[#0E8A4F] px-6 py-10 md:mt-[60px] md:px-[80px] md:py-[64px] lg:flex-row-reverse lg:items-center lg:rounded-[54px]"
    >
      <div className="relative z-10 flex flex-col gap-8 lg:w-1/2">
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[13px] font-medium text-white">
            For affiliates
          </span>
          <h2 className="font-['TomatoGrotesk'] text-[32px] font-semibold leading-[38px] text-white md:text-[44px] md:leading-[50px]">
            Earn real money sharing products you love
          </h2>
          <p className="max-w-[480px] text-[15px] leading-[24px] text-[#eafff2cd] md:text-[16px]">
            No inventory. No shipping. No selling. Promote and share your
            link and earn commission on every sale.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 text-[14px] text-white"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />
              {point}
            </li>
          ))}
        </ul>

        <motion.div whileHover={{ scale: 1.05 }} className="w-fit">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-[20px] bg-white px-7 py-4 text-[15px] font-medium text-[#0A6B3D]"
          >
            Join the affiliate program
          </Link>
        </motion.div>
      </div>

      <div className="relative z-10 mt-12 flex justify-center lg:mt-0 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="relative flex w-full max-w-[380px] flex-col gap-5 rounded-[24px] bg-white p-6 shadow-[0_30px_60px_rgba(10,10,19,0.25)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-grey-400">My earnings</p>
            <span className="flex items-center gap-1 text-[12px] font-medium text-awaown-green">
              <span className="h-1.5 w-1.5 rounded-full bg-awaown-green" />
              Live
            </span>
          </div>
          <div>
            <p className="font-['TomatoGrotesk'] text-[30px] font-semibold text-[#0A0A13]">
              ₦2,450,000
            </p>
            <p className="text-[12px] text-grey-400">Lifetime earnings</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 rounded-[14px] bg-[#FAFAFF] p-3">
              <p className="text-[16px] font-semibold text-[#0A0A13]">312</p>
              <p className="text-[11px] text-grey-400">Clicks</p>
            </div>
            <div className="flex flex-col gap-1 rounded-[14px] bg-[#FAFAFF] p-3">
              <p className="text-[16px] font-semibold text-[#0A0A13]">28</p>
              <p className="text-[11px] text-grey-400">Sales</p>
            </div>
            <div className="flex flex-col gap-1 rounded-[14px] bg-[#FAFAFF] p-3">
              <p className="text-[16px] font-semibold text-[#0A0A13]">9%</p>
              <p className="text-[11px] text-grey-400">Rate</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[14px] border border-dashed border-grey-300 px-4 py-3">
            <span className="text-[13px] text-grey-500">Your link</span>
            <span className="text-[13px] font-medium text-awaown-green">
              awaown.com/?ref=XPUHVS
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-[14px] bg-[#0A0A13] px-4 py-3 text-white shadow-lg"
          >
            <MousePointerClick className="h-4 w-4 text-awaown-green-light" />
            <span className="text-[12px]">New sale, +₦48,000</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute -bottom-[220px] -right-[220px] opacity-40">
        <BreathingRect width="580px" height="500px" />
      </div>
      <div className="pointer-events-none absolute -left-[240px] -top-[180px] opacity-40">
        <BreathingRect width="580px" height="500px" />
      </div>
    </div>
  );
};

export default ForAffiliates;
