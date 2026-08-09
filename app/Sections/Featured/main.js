"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { featuredProducts } from "./products";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Featured = () => {
  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-[40px] px-5 pt-[60px] md:gap-[60px] md:pt-[100px]">
      <div className="flex w-full flex-col items-center justify-center gap-[14px] text-center">
        <span className="rounded-full border border-[#CDCBF9] bg-[#4361FF1A] px-3 py-1 text-[14px] font-medium text-[#827CF1]">
          Featured
        </span>
        <h2 className="max-w-[600px] font-['TomatoGrotesk'] text-[32px] font-semibold leading-[38px] text-[#0A0A13] md:text-[48px] md:leading-[54px]">
          New &amp; popular
        </h2>
        <p className="max-w-[520px] text-[16px] leading-[26px] text-grey-500 md:text-[18px] md:leading-[28px]">
          Freshly-landed products from our verified merchants.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {featuredProducts.map((product, idx) => (
          <motion.div
            key={product.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
            variants={fadeInUp}
            className="flex flex-col gap-3"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#F0F0F5]">
              {product.onSale && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-[#0A0A13] px-3 py-1 text-[11px] font-medium text-white">
                  Sale
                </span>
              )}
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[12px] text-grey-400">{product.brand}</p>
              <p className="text-[15px] font-medium text-[#0A0A13] md:text-[16px]">
                {product.title}
              </p>
              <p className="text-[12px] text-grey-400">{product.rating}</p>
              {product.price && (
                <p className="text-[15px] font-medium text-[#0A0A13]">
                  {product.onSale ? (
                    <>
                      <span className="mr-2 text-[13px] text-grey-400 line-through">
                        ₦{product.originalPrice}
                      </span>
                      ₦{product.price}
                    </>
                  ) : (
                    <>₦{product.price}</>
                  )}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          href="/products"
          className="rounded-full border border-[#0A0A13]/15 px-7 py-[14px] text-[15px] font-medium text-[#0A0A13] transition-colors hover:bg-grey-100"
        >
          Browse all products
        </Link>
      </div>
    </div>
  );
};

export default Featured;
