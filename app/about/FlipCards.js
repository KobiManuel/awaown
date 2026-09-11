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
    description:
      "Every order is escrow-backed - your payment is held safely and only released to the seller once you confirm it arrived as described. A refund request pauses that release until it's resolved.",
  },
  {
    icon: BadgeCheck,
    title: "KYC Verification",
    description:
      "Merchants, Partners and inventory investors are identity-checked before they can transact, establishing who everyone is and creating a more trusted marketplace for all participants.",
  },
  {
    icon: Truck,
    title: "Delivery & Fulfilment",
    description:
      "From order to doorstep, our delivery partners carry every order the last mile, with status updates along the way so you can follow it from checkout to your door.",
  },
  {
    icon: Store,
    title: "Personalised Digital Stores",
    description:
      "Partners can build and personalise their own digital store - name, profile and the products they choose to feature - then share one link and the whole store travels with it.",
  },
  {
    icon: Sparkles,
    title: "Product Discovery & Distribution",
    description:
      "Merchants get their products in front of new customers through the AwaOwn marketplace and every Partner storefront that lists them - one listing, many places to be discovered.",
  },
];

function FlipCard({ icon: Icon, title, description }) {
  return (
    <div className="group h-[300px] [perspective:1400px]">
      <div className="relative h-full w-full rounded-[18px] transition-transform duration-[600ms] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
        {/* Front - purple, just the title as the display text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[18px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-6 text-center text-white [backface-visibility:hidden]">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />
          </span>
          <h3 className="text-[19px] font-semibold">{title}</h3>
          <span className="mt-auto text-[11.5px] font-medium uppercase tracking-wide text-white/70">
            Hover to flip
          </span>
        </div>
        {/* Back - the description */}
        <div className="absolute inset-0 flex flex-col gap-3 rounded-[18px] border border-shop-border bg-white p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-shop-accent-1-light">
            <Icon className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />
          </span>
          <h3 className="text-[15.5px] font-semibold text-shop-heading">{title}</h3>
          <p className="text-[13.5px] leading-[21px] text-shop-text">{description}</p>
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
