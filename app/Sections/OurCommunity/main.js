import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Video,
  Lightbulb,
  Trophy,
  Megaphone,
  ArrowRight,
  Calendar,
} from "lucide-react";
import SectionHeader from "@/app/Components/Section/SectionHeader";

const ArrowChip = ({ bg = "bg-shop-accent-1", text = "text-white" }) => (
  <span
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${bg} ${text}`}
  >
    <ArrowRight className="h-4 w-4" />
  </span>
);

const PillButton = ({ children, href = "#", chipBg, chipText = "text-white" }) => (
  <Link
    href={href}
    className="inline-flex w-fit items-center gap-3 rounded-full bg-white py-1 pl-4 pr-1 text-[13px] font-semibold text-shop-heading transition-transform hover:scale-[1.03]"
  >
    {children}
    <ArrowChip bg={chipBg} text={chipText} />
  </Link>
);

const IconChip = ({ icon: Icon, label }) => (
  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 py-1.5 pl-1.5 pr-4 text-[12px] font-semibold text-white">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-shop-accent-1">
      <Icon className="h-3 w-3" />
    </span>
    {label}
  </span>
);

const VendorSpotlight = () => (
  <div className="relative col-span-1 flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[20px] p-6 md:col-span-2">
    <Image
      src="/assets/images/companies/fashion-vault.png"
      alt="Fashion Vault"
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 60vw"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
    <div className="relative flex flex-col gap-3">
      <IconChip icon={Trophy} label="Vendor of the Week" />
      <h3 className="max-w-[380px] text-[22px] font-bold leading-[28px] text-white">
        Fashion Vault
      </h3>
      <p className="max-w-[380px] text-[13px] leading-[20px] text-white/75">
        Handcrafted accessories and boutique fashion, rated 4.9 by shoppers
        across Lagos. This week we&apos;re spotlighting their new collection.
      </p>
      <PillButton href="/shop/fashion-vault" chipBg="bg-shop-accent-1">
        Visit Store
      </PillButton>
    </div>
  </div>
);

const WebinarSpotlight = () => (
  <div className="col-span-1 flex min-h-[280px] flex-col justify-between rounded-[20px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-6">
    <div className="flex flex-col gap-3">
      <IconChip icon={Video} label="Upcoming Webinar" />
      <h3 className="text-[17px] font-bold leading-[23px] text-white">
        Scaling Your Store: Inventory &amp; Fulfilment 101
      </h3>
      <p className="flex items-center gap-1.5 text-[12px] text-white/70">
        <Calendar className="h-3.5 w-3.5" />
        Thu, Aug 14 &middot; 4:00 PM WAT
      </p>
    </div>
    <div className="mt-4 border-t border-white/15 pt-4">
      <PillButton chipBg="bg-[#C6F24C]" chipText="text-shop-heading">
        Save Your Seat
      </PillButton>
    </div>
  </div>
);

const TipOfTheWeek = () => (
  <div className="col-span-1 flex min-h-[220px] flex-col justify-between rounded-[20px] bg-[#C6F24C] p-6">
    <div className="flex items-start justify-between">
      <span className="text-[12px] font-bold uppercase tracking-wide text-shop-heading/70">
        Community Tip
      </span>
      <Lightbulb className="h-6 w-6 text-shop-heading" />
    </div>
    <p className="text-[15px] font-semibold leading-[22px] text-shop-heading">
      Add at least 3 product photos from different angles &mdash; listings
      with multiple photos see 40% more clicks.
    </p>
  </div>
);

const ChallengeOfTheWeek = () => (
  <div className="col-span-1 flex min-h-[220px] flex-col justify-between rounded-[20px] bg-[#FF6A45] p-6">
    <IconChip icon={Trophy} label="Challenge of the Week" />
    <p className="text-[14px] font-semibold leading-[21px] text-white">
      Share your AwaOwn haul on Instagram and tag @awaown for a chance to win
      &#8358;20,000 in shopping credit.
    </p>
    <PillButton chipBg="bg-shop-accent-1">Join Challenge</PillButton>
  </div>
);

const Announcement = () => (
  <div className="col-span-1 flex min-h-[220px] flex-col justify-between rounded-[20px] bg-shop-accent-2 p-6">
    <IconChip icon={Megaphone} label="Announcement" />
    <div className="flex flex-col gap-1">
      <p className="text-[14px] font-semibold leading-[21px] text-white">
        Nationwide delivery is now available to all 36 states &mdash; check
        your area at checkout.
      </p>
      <p className="text-[12px] text-white/50">Aug 10, 2026</p>
    </div>
  </div>
);

const OurCommunity = () => {
  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <SectionHeader title="Our Community" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <VendorSpotlight />
        <WebinarSpotlight />
        <TipOfTheWeek />
        <ChallengeOfTheWeek />
        <Announcement />
      </div>
    </div>
  );
};

export default OurCommunity;
