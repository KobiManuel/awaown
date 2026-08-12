"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp } from "lucide-react";
import BreathingRect from "@/app/v1/Components/UI/BreathingRect/BreathingRect";

const points = [
  "Get verified in 24–48 hours",
  "Keep 85–97% of every sale",
  "Built-in affiliate traffic",
  "Direct-to-bank payouts",
  "Zero listing fees",
  "Order & revenue dashboard",
];

const ForMerchants = () => {
  return (
    <div
      id="for-merchants"
      className="relative mx-auto mt-[60px] flex w-full max-w-[1360px] flex-col overflow-hidden bg-gradient-to-r from-[#827BFF] to-[#5B72E8] px-6 py-10 md:mt-[100px] md:px-[80px] md:py-[64px] lg:flex-row lg:items-center lg:rounded-[54px]"
    >
      <div className="relative z-10 flex flex-col gap-8 lg:w-1/2">
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[13px] font-medium text-white">
            For merchants
          </span>
          <h2 className="font-['TomatoGrotesk'] text-[32px] font-semibold leading-[38px] text-white md:text-[44px] md:leading-[50px]">
            Start selling to customers across Nigeria
          </h2>
          <p className="max-w-[480px] text-[15px] leading-[24px] text-[#ffffffcd] md:text-[16px]">
            Join merchants already growing their business on Nigeria&apos;s
            most transparent social marketplace.
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
            className="flex items-center gap-3 rounded-[20px] bg-white px-7 py-4 text-[15px] font-medium text-[#0A0A13]"
          >
            Register as a merchant
          </Link>
        </motion.div>
      </div>

      <div className="relative z-10 mt-12 flex justify-center lg:mt-0 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="flex w-full max-w-[380px] flex-col gap-4 rounded-[24px] bg-white p-6 shadow-[0_30px_60px_rgba(10,10,19,0.25)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-grey-400">This month</p>
            <span className="h-2 w-2 rounded-full bg-awaown-green" />
          </div>
          <div className="flex items-end justify-between">
            <p className="font-['TomatoGrotesk'] text-[30px] font-semibold text-[#0A0A13]">
              ₦9,480,000
            </p>
            <div className="flex items-center gap-1 rounded-full bg-[#E7F8EF] px-2 py-1 text-[12px] font-medium text-[#12B76A]">
              <TrendingUp className="h-3.5 w-3.5" />
              28% vs last
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between rounded-[16px] bg-[#FAFAFF] p-4">
            <div className="flex flex-col gap-1">
              <p className="text-[13px] font-medium text-[#0A0A13]">
                New order
              </p>
              <p className="text-[13px] text-grey-500">Silk dress × 2</p>
              <p className="text-[12px] text-grey-400">
                Shipped to Abuja
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-awaown-purple/15 text-awaown-purple">
              ✓
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute -bottom-[220px] -left-[220px] opacity-60">
        <BreathingRect width="580px" height="500px" />
      </div>
      <div className="pointer-events-none absolute -right-[240px] -top-[180px] opacity-60">
        <BreathingRect width="580px" height="500px" />
      </div>
    </div>
  );
};

export default ForMerchants;
