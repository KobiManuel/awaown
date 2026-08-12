"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Tags, PackageCheck } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Compass,
    title: "Browse",
    description:
      "Explore thousands of products from verified merchants across 10+ categories.",
    color: "#7779F9",
  },
  {
    number: "2",
    icon: Tags,
    title: "Save",
    description:
      "Use a referral code at checkout to unlock exclusive discounts, straight from affiliates.",
    color: "#FFCF29",
  },
  {
    number: "3",
    icon: PackageCheck,
    title: "Shop",
    description:
      "Order with confidence, secure payments, tracked delivery, buyer protection.",
    color: "#0BB96D",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const HowItWorks = () => {
  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-[40px] px-5 pt-[60px] md:gap-[60px] md:pt-[100px]">
      <div className="flex w-full flex-col items-center justify-center gap-[14px] text-center">
        <span className="rounded-full border border-[#CDCBF9] bg-[#4361FF1A] px-3 py-1 text-[14px] font-medium text-[#827CF1]">
          How it works
        </span>
        <h2 className="max-w-[600px] font-['TomatoGrotesk'] text-[32px] font-semibold leading-[38px] text-[#0A0A13] md:text-[48px] md:leading-[54px]">
          One platform, three ways to win
        </h2>
        <p className="max-w-[520px] text-[16px] leading-[26px] text-grey-500 md:text-[18px] md:leading-[28px]">
          Whether you&apos;re buying, selling or sharing, there&apos;s a place
          for you on AwaOwn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              variants={fadeInUp}
              className="flex flex-col gap-5 rounded-[24px] bg-[#F0F0F5] p-8"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: step.color }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="font-['TomatoGrotesk'] text-[40px] font-semibold text-[#0A0A13]/10">
                  {step.number}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-['TomatoGrotesk'] text-[22px] font-medium text-[#0A0A13]">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-[24px] text-grey-500">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;
