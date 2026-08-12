"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import Banner1 from "@/public/images/landing-banner-01.png";
import Banner2 from "@/public/images/landing-banner-02.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Banners = () => {
  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-5 px-5 pt-10 md:gap-8 md:px-5">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
        className="relative w-full overflow-hidden rounded-[24px] lg:rounded-[32px]"
      >
        <Image
          src={Banner1}
          alt="Shop verified merchants on AwaOwn"
          className="w-full h-auto"
          priority={false}
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        variants={fadeInUp}
        className="relative w-full overflow-hidden rounded-[24px] lg:rounded-[32px]"
      >
        <Image
          src={Banner2}
          alt="Earn as an AwaOwn affiliate"
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  );
};

export default Banners;
