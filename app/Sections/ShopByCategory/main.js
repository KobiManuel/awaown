"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shirt,
  Cpu,
  HeartPulse,
  ShoppingBasket,
  Sofa,
  Dumbbell,
  Car,
  BookOpen,
} from "lucide-react";

const categories = [
  { title: "Fashion & Apparel", slug: "fashion-apparel", icon: Shirt, color: "#7779F9" },
  { title: "Electronics & Gadgets", slug: "electronics-gadgets", icon: Cpu, color: "#12A6F0" },
  { title: "Beauty & Health", slug: "beauty-health", icon: HeartPulse, color: "#FF6B81" },
  { title: "Food & Groceries", slug: "food-groceries", icon: ShoppingBasket, color: "#FF9D0B" },
  { title: "Home & Living", slug: "home-living", icon: Sofa, color: "#EED6B0", dark: true },
  { title: "Sports & Fitness", slug: "sports-fitness", icon: Dumbbell, color: "#0BB96D" },
  { title: "Automobiles", slug: "automobiles", icon: Car, color: "#0A0A13" },
  { title: "Books & Education", slug: "books-education", icon: BookOpen, color: "#31B7AC" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const ShopByCategory = () => {
  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-[40px] px-5 pt-[60px] md:gap-[60px] md:pt-[100px]">
      <div className="flex w-full flex-col items-center justify-center gap-[14px] text-center">
        <span className="rounded-full border border-[#CDCBF9] bg-[#4361FF1A] px-3 py-1 text-[14px] font-medium text-[#827CF1]">
          Browse
        </span>
        <h2 className="max-w-[600px] font-['TomatoGrotesk'] text-[32px] font-semibold leading-[38px] text-[#0A0A13] md:text-[48px] md:leading-[54px]">
          Shop by category
        </h2>
        <p className="max-w-[520px] text-[16px] leading-[26px] text-grey-500 md:text-[18px] md:leading-[28px]">
          From fashion to food to electronics, find exactly what you need.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.slug}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: (idx % 4) * 0.07 }}
              variants={fadeInUp}
              className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-[20px] p-5"
              style={{ backgroundColor: cat.color }}
            >
              <Icon
                className={`h-8 w-8 ${cat.dark ? "text-[#0A0A13]" : "text-white"}`}
              />
              <div className="flex flex-col gap-2">
                <p
                  className={`text-[15px] font-medium leading-[20px] md:text-[17px] ${
                    cat.dark ? "text-[#0A0A13]" : "text-white"
                  }`}
                >
                  {cat.title}
                </p>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={`w-fit text-[13px] underline underline-offset-2 ${
                    cat.dark ? "text-[#0A0A13]/70" : "text-white/80"
                  }`}
                >
                  Shop now
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopByCategory;
