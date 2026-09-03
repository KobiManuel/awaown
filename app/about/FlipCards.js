"use client";

import React from "react";
import {
  ShieldCheck,
  BadgeCheck,
  Truck,
  Store,
  Sparkles,
} from "lucide-react";

const CARDS = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    front:
      "Our customers are protected through escrow-backed transactions, helping safeguard payments and provide greater confidence throughout the transaction.",
    back: "Money is only released to the seller once you confirm the order arrived as described. A refund request pauses the release until it's resolved.",
  },
  {
    icon: BadgeCheck,
    title: "KYC Verification",
    front:
      "KYC verification helps establish the identity of everyone involved, creating a more trusted marketplace for all participants.",
    back: "Merchants, Partners and inventory investors are identity-checked before they can transact — so you always know who you're dealing with.",
  },
  {
    icon: Truck,
    title: "Delivery & Fulfilment",
    front:
      "From order to doorstep, orders are supported through our delivery partners, helping ensure products get to customers efficiently.",
    back: "Follow every order from checkout to your door, with status updates and partner couriers handling the last mile.",
  },
  {
    icon: Store,
    title: "Personalised Digital Stores",
    front:
      "Partners can create and personalise their own digital stores — from their store name and profile to the products they choose to feature — giving them a space that feels like their own business.",
    back: "Pick your name, theme and product line-up. Share one link and your whole store travels with it.",
  },
  {
    icon: Sparkles,
    title: "Product Discovery & Distribution",
    front:
      "Merchants can get their products in front of new customers through the AwaOwn marketplace, Partner stores and Partner audiences, creating more opportunities for products to be discovered and sold.",
    back: "One listing, many storefronts: the main marketplace plus every Partner who adds your product to their shop.",
  },
];

function FlipCard({ icon: Icon, title, front, back }) {
  return (
    <div className="group h-[300px] [perspective:1400px]">
      <div className="relative h-full w-full rounded-[18px] transition-transform duration-[600ms] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 flex flex-col gap-4 rounded-[18px] border border-shop-border bg-white p-6 [backface-visibility:hidden]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-shop-accent-1-light">
            <Icon className="h-6 w-6 text-shop-accent-1" strokeWidth={1.75} />
          </span>
          <h3 className="text-[17px] font-semibold text-shop-heading">{title}</h3>
          <p className="text-[13.5px] leading-[21px] text-shop-text">{front}</p>
          <span className="mt-auto text-[11.5px] font-medium uppercase tracking-wide text-shop-accent-1">
            Hover to flip
          </span>
        </div>
        {/* Back */}
        <div className="absolute inset-0 flex flex-col justify-center gap-3 rounded-[18px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-6 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <h3 className="text-[17px] font-semibold">{title}</h3>
          <p className="text-[14px] leading-[22px] text-white/90">{back}</p>
        </div>
      </div>
    </div>
  );
}

export default function FlipCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((c) => (
        <FlipCard key={c.title} {...c} />
      ))}
    </div>
  );
}
