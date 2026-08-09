"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Store,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import ListItem from "./list-item";
import { categories } from "./categories";
import logo from "@/public/images/logo.png";

import homeThumb from "@/public/assets/images/how-it-works_home.png";
import shopThumb from "@/public/assets/images/how-it-works.png";
import aboutThumb from "@/public/assets/images/how-it-works_about.png";
import contactThumb from "@/public/assets/images/how-it-works_contact.png";
import sellThumb from "@/public/assets/images/how-it-works_sell.png";

const mobileMenuItems = [
  {
    title: "Home",
    subtitle: "Discover verified merchants and the best deals across Nigeria.",
    img: homeThumb,
    href: "/",
  },
  {
    title: "Shop",
    subtitle: "Browse thousands of products from verified merchants.",
    img: shopThumb,
    href: "/products",
  },
  {
    title: "Categories",
    icon: ShoppingBag,
    href: "/products",
  },
  {
    title: "FAQ",
    icon: HelpCircle,
    href: "#",
  },
  {
    title: "About Us",
    subtitle: "Welcome to AwaOwn — Nigeria's trusted marketplace.",
    img: aboutThumb,
    href: "/about",
  },
  {
    title: "Contact Us",
    subtitle: "Connect with AwaOwn for support or feedback.",
    img: contactThumb,
    href: "mailto:hello@awaown.com",
  },
  {
    title: "Sell on AwaOwn",
    subtitle: "Explore guides to kickstart your journey as a merchant.",
    img: sellThumb,
    href: "/#for-merchants",
  },
];

const MenuIcon = ({ active, onClick }) => (
  <button
    onClick={onClick}
    aria-label="Toggle Menu"
    className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px]"
  >
    <span
      className={`h-[2px] w-5 rounded-full bg-[#0A0A13] transition-all duration-300 ${
        active ? "translate-y-[7px] rotate-45" : ""
      }`}
    />
    <span
      className={`h-[2px] w-5 rounded-full bg-[#0A0A13] transition-all duration-300 ${
        active ? "opacity-0" : ""
      }`}
    />
    <span
      className={`h-[2px] w-5 rounded-full bg-[#0A0A13] transition-all duration-300 ${
        active ? "-translate-y-[7px] -rotate-45" : ""
      }`}
    />
  </button>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((v) => !v);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="relative z-[60] flex w-full max-w-[1240px] items-center justify-between gap-3 rounded-full border border-black/5 bg-white/95 px-3 py-1.5 shadow-[0_8px_30px_rgba(10,10,19,0.08)] backdrop-blur lg:gap-6 lg:px-5">
        {/* Logo */}
        <Link href="/" className="relative h-11 w-[130px] shrink-0 sm:h-12 sm:w-[150px] lg:h-14 lg:w-[170px]">
          <div className="absolute left-[20px] top-1/2 -translate-y-1/2 scale-[1.8] lg:left-[32px]">
            <Image
              src={logo}
              alt="AwaOwn"
              className="h-11 w-auto object-contain sm:h-12 lg:h-14"
              priority
            />
          </div>
        </Link>

        {/* Search - desktop */}
        <div className="hidden md:flex flex-1 max-w-[340px] items-center">
          <div className="flex w-full items-center rounded-full bg-grey-100 pl-4 pr-1 py-1">
            <input
              type="text"
              placeholder="Search products, brands..."
              className="w-full bg-transparent text-[14px] text-grey-p600 placeholder:text-grey-400 outline-none"
            />
            <button
              type="button"
              aria-label="Search"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-awaown-green text-white"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Nav links - desktop */}
        <div className="hidden lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/products" className={navigationMenuTriggerStyle()}>
                  Shop
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[440px] gap-2 p-4 md:grid-cols-2">
                    {categories.map((c) => (
                      <ListItem
                        key={c.slug}
                        href={`/products?category=${c.slug}`}
                        title={c.title}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" className={navigationMenuTriggerStyle()}>
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="mailto:hello@awaown.com"
                  className={navigationMenuTriggerStyle()}
                >
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right cluster - desktop */}
        <div className="hidden lg:flex items-center gap-1 text-grey-p600 shrink-0">
          <Link
            href="#"
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-grey-100"
          >
            <User className="h-[18px] w-[18px]" />
          </Link>
          <Link
            href="#"
            aria-label="Wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-grey-100"
          >
            <Heart className="h-[18px] w-[18px]" />
          </Link>
          <Link
            href="#"
            aria-label="Cart"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-grey-100"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
          </Link>
        </div>

        {/* Hamburger - mobile */}
        <div className="flex lg:hidden items-center gap-1">
          <Link
            href="#"
            aria-label="Cart"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-grey-100"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
          </Link>
          <MenuIcon active={isOpen} onClick={toggleMenu} />
        </div>
      </div>

      {/* Mobile dropdown panel - styled after the v1 "How it Works" mega menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[4px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="fixed left-1/2 top-[80px] z-50 flex max-h-[calc(100vh-104px)] w-[92%] max-w-[420px] -translate-x-1/2 flex-col overflow-hidden rounded-[24px] bg-[#F7F7F9] shadow-[0_20px_50px_rgba(10,10,19,0.18)] lg:hidden"
            >
              <div className="hide-scrollbar flex flex-col gap-1 overflow-y-auto p-4">
                {mobileMenuItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={toggleMenu}
                      className={`flex items-center gap-4 rounded-[10px] p-3 transition-colors hover:bg-black/[0.04] ${
                        idx !== mobileMenuItems.length - 1
                          ? "border-b border-black/[0.06]"
                          : ""
                      }`}
                    >
                      {item.img ? (
                        <Image
                          src={item.img}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-[10px] object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-black/[0.04] text-[#0A0A13]">
                          <Icon className="h-5 w-5" />
                        </div>
                      )}
                      <span className="flex flex-col gap-1">
                        <span className="text-[16px] font-semibold text-[#0A0A13]">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="text-[13px] leading-[18px] text-grey-500">
                            {item.subtitle}
                          </span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <div className="border-t border-black/[0.06] p-4">
                <Link
                  href="/products"
                  onClick={toggleMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-awaown-green py-4 text-[15px] font-medium text-white"
                >
                  <Store className="h-4 w-4" />
                  Start shopping
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
