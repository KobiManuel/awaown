import React from "react";
import Image from "next/image";
import {
  Video,
  Lightbulb,
  Trophy,
  Megaphone,
  ArrowRight,
  Calendar,
} from "lucide-react";
import SectionHeader from "@/app/Components/Section/SectionHeader";

const CardShell = ({ children, className = "" }) => (
  <div
    className={`flex flex-col gap-4 rounded-[10px] bg-white p-5 ${className}`}
  >
    {children}
  </div>
);

const Eyebrow = ({ icon: Icon, children, tone = "text-shop-accent-1" }) => (
  <span className={`flex w-fit items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide ${tone}`}>
    <Icon className="h-3.5 w-3.5" />
    {children}
  </span>
);

const VendorSpotlight = () => (
  <CardShell className="md:col-span-2 overflow-hidden p-0">
    <div className="relative aspect-[16/7] w-full overflow-hidden bg-shop-bg">
      <Image
        src="/images/hero-card-1.png"
        alt="Aria & Co. Boutique"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 60vw"
      />
    </div>
    <div className="flex flex-col gap-2 p-5 pt-1">
      <Eyebrow icon={Trophy}>Vendor of the Week</Eyebrow>
      <h3 className="text-[18px] font-semibold text-shop-heading">Aria &amp; Co. Boutique</h3>
      <p className="text-[13px] leading-[20px] text-shop-text">
        Handcrafted accessories and boutique fashion, rated 4.9 by shoppers
        across Lagos. This week we&apos;re spotlighting their new collection.
      </p>
      <a
        href="#"
        className="mt-1 flex w-fit items-center gap-1.5 text-[13px] font-semibold text-shop-accent-1 hover:underline"
      >
        Visit Store
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  </CardShell>
);

const WebinarSpotlight = () => (
  <CardShell className="justify-between bg-gradient-to-br from-shop-accent-1 to-shop-accent-1-dark text-white">
    <div className="flex flex-col gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
        <Video className="h-5 w-5" />
      </div>
      <Eyebrow icon={Calendar} tone="text-white/80">
        Upcoming Webinar
      </Eyebrow>
      <h3 className="text-[16px] font-semibold leading-[22px]">
        Scaling Your Store: Inventory &amp; Fulfilment 101
      </h3>
      <p className="text-[13px] text-white/75">Thu, Aug 14 &middot; 4:00 PM WAT</p>
    </div>
    <a
      href="#"
      className="flex w-fit items-center gap-1.5 rounded-[6px] bg-white px-4 py-2 text-[13px] font-semibold text-shop-accent-1 hover:bg-white/90"
    >
      Save Your Seat
    </a>
  </CardShell>
);

const TipOfTheWeek = () => (
  <CardShell>
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-shop-accent-1-light">
      <Lightbulb className="h-5 w-5 text-shop-accent-1" />
    </div>
    <Eyebrow icon={Lightbulb}>Community Tip</Eyebrow>
    <p className="text-[14px] leading-[21px] text-shop-heading">
      Add at least 3 product photos from different angles &mdash; listings
      with multiple photos see 40% more clicks.
    </p>
  </CardShell>
);

const ChallengeOfTheWeek = () => (
  <CardShell>
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-shop-accent-3/10">
      <Trophy className="h-5 w-5 text-shop-accent-3" />
    </div>
    <Eyebrow icon={Trophy} tone="text-shop-accent-3">
      Challenge of the Week
    </Eyebrow>
    <p className="text-[14px] leading-[21px] text-shop-heading">
      Share your AwaOwn haul on Instagram and tag @awaown for a chance to
      win &#8358;20,000 in shopping credit.
    </p>
    <a
      href="#"
      className="flex w-fit items-center gap-1.5 text-[13px] font-semibold text-shop-accent-1 hover:underline"
    >
      Join Challenge
      <ArrowRight className="h-3.5 w-3.5" />
    </a>
  </CardShell>
);

const Announcement = () => (
  <CardShell>
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-shop-bg">
      <Megaphone className="h-5 w-5 text-shop-heading" />
    </div>
    <Eyebrow icon={Megaphone} tone="text-shop-heading">
      Announcement
    </Eyebrow>
    <p className="text-[14px] leading-[21px] text-shop-heading">
      Nationwide delivery is now available to all 36 states &mdash; check
      your area at checkout.
    </p>
    <p className="text-[12px] text-shop-text/60">Aug 10, 2026</p>
  </CardShell>
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
