"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { navLinks, categoryMenu } from "@/lib/shop-data";

const MobileMenu = ({ open, onClose }) => {
  const [expanded, setExpanded] = useState(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-0 top-0 z-[80] flex h-full w-[85%] max-w-[340px] flex-col overflow-y-auto bg-white font-shop lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between border-b border-shop-border p-4">
              <Image
                src="/v2/images/awa-logo.webp"
                alt="Optimall"
                width={130}
                height={40}
                className="h-8 w-auto object-contain"
              />
              <button type="button" aria-label="Close menu" onClick={onClose}>
                <X className="h-6 w-6 text-shop-heading" />
              </button>
            </div>

            <nav className="flex flex-col p-4">
              {navLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  className="border-b border-shop-border/60 py-3 text-[15px] font-medium text-shop-heading"
                >
                  {link.title}
                </a>
              ))}
            </nav>

            <div className="flex flex-col border-t border-shop-border p-4">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-shop-text/70">
                Shop By Categories
              </p>
              {categoryMenu.map((cat) => (
                <div key={cat.title} className="border-b border-shop-border/60">
                  <button
                    type="button"
                    onClick={() =>
                      cat.children
                        ? setExpanded(expanded === cat.title ? null : cat.title)
                        : undefined
                    }
                    className="flex w-full items-center justify-between py-2.5 text-left text-[14px] text-shop-heading"
                  >
                    {cat.title}
                    {cat.children && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          expanded === cat.title ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {cat.children && expanded === cat.title && (
                    <div className="flex flex-col gap-1 pb-2 pl-3">
                      {cat.children.map((c) => (
                        <a key={c} href="#" className="py-1 text-[13px] text-shop-text">
                          {c}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-2 border-t border-shop-border p-4">
              <a
                href="#"
                className="w-full rounded-[8px] bg-shop-accent-1 py-3 text-center text-[14px] font-semibold text-white"
              >
                Become a Merchant
              </a>
              <a
                href="#"
                className="w-full rounded-[8px] bg-shop-accent-1-light py-3 text-center text-[14px] font-semibold text-shop-accent-1-dark"
              >
                Become a Partner
              </a>
              <a
                href="/login"
                className="w-full py-2 text-center text-[14px] font-semibold text-shop-heading"
              >
                Login
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
