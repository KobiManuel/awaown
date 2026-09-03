"use client";

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
import { useHomepageContent } from "@/lib/useHomepageContent";

const ArrowChip = ({ bg = "bg-shop-accent-1", text = "text-white" }) => (
  <span
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${bg} ${text}`}
  >
    <ArrowRight className="h-4 w-4" />
  </span>
);

const PillButton = ({ children, href = "/shop", external, chipBg, chipText = "text-white" }) => {
  const cls =
    "inline-flex w-fit items-center gap-3 rounded-full bg-white py-1 pl-4 pr-1 text-[13px] font-semibold text-shop-heading transition-transform hover:scale-[1.03]";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
        <ArrowChip bg={chipBg} text={chipText} />
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      <ArrowChip bg={chipBg} text={chipText} />
    </Link>
  );
};

const IconChip = ({ icon: Icon, label }) => (
  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 py-1.5 pl-1.5 pr-4 text-[12px] font-semibold text-white">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-shop-accent-1">
      <Icon className="h-3 w-3" />
    </span>
    {label}
  </span>
);

const OurCommunity = () => {
  const { community, visibility } = useHomepageContent();
  if (visibility.community === false) return null;

  const vs = community.vendorSpotlight ?? {};
  const web = community.webinar ?? {};
  const tip = community.tip ?? {};
  const ch = community.challenge ?? {};
  const ann = community.announcement ?? {};

  return (
    <div
      id="community"
      className="mx-auto mt-12 w-full max-w-[1460px] scroll-mt-24 px-4 font-shop md:mt-16 md:px-8"
    >
      <SectionHeader title="Our Community" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Vendor spotlight */}
        <div className="relative col-span-1 flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[20px] p-6 md:col-span-2">
          {vs.image && (
            <Image
              src={vs.image}
              alt={vs.vendorName || "Vendor spotlight"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
          <div className="relative flex flex-col gap-3">
            <IconChip icon={Trophy} label="Vendor of the Week" />
            <h3 className="max-w-[380px] text-[22px] font-bold leading-[28px] text-white">
              {vs.vendorName}
            </h3>
            <p className="max-w-[380px] text-[13px] leading-[20px] text-white/75">
              {vs.description}
            </p>
            {vs.buttonText && (
              <PillButton
                href={vs.buttonUrl || "/shop"}
                external={/^https?:\/\//.test(vs.buttonUrl || "")}
                chipBg="bg-shop-accent-1"
              >
                {vs.buttonText}
              </PillButton>
            )}
          </div>
        </div>

        {/* Webinar */}
        <div className="col-span-1 flex min-h-[280px] flex-col justify-between rounded-[20px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-6">
          <div className="flex flex-col gap-3">
            <IconChip icon={Video} label="Upcoming Webinar" />
            <h3 className="text-[17px] font-bold leading-[23px] text-white">{web.title}</h3>
            {web.dateText && (
              <p className="flex items-center gap-1.5 text-[12px] text-white/70">
                <Calendar className="h-3.5 w-3.5" />
                {web.dateText}
              </p>
            )}
          </div>
          {web.buttonText && (
            <div className="mt-4 border-t border-white/15 pt-4">
              <PillButton
                href={web.url || "/shop"}
                external={!!web.url}
                chipBg="bg-[#C6F24C]"
                chipText="text-shop-heading"
              >
                {web.buttonText}
              </PillButton>
            </div>
          )}
        </div>

        {/* Tip */}
        <div className="col-span-1 flex min-h-[220px] flex-col justify-between rounded-[20px] bg-[#C6F24C] p-6">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wide text-shop-heading/70">
              Community Tip
            </span>
            <Lightbulb className="h-6 w-6 text-shop-heading" />
          </div>
          <p className="text-[15px] font-semibold leading-[22px] text-shop-heading">
            {tip.text}
          </p>
        </div>

        {/* Challenge */}
        <div className="col-span-1 flex min-h-[220px] flex-col justify-between rounded-[20px] bg-[#FF6A45] p-6">
          <IconChip icon={Trophy} label="Challenge of the Week" />
          <p className="text-[14px] font-semibold leading-[21px] text-white">{ch.text}</p>
          {ch.buttonText && (
            <PillButton
              href={ch.buttonUrl || "/shop"}
              external={/^https?:\/\//.test(ch.buttonUrl || "")}
              chipBg="bg-shop-accent-1"
            >
              {ch.buttonText}
            </PillButton>
          )}
        </div>

        {/* Announcement */}
        <div className="col-span-1 flex min-h-[220px] flex-col justify-between rounded-[20px] bg-shop-accent-2 p-6">
          <IconChip icon={Megaphone} label="Announcement" />
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-semibold leading-[21px] text-white">{ann.text}</p>
            {ann.date && <p className="text-[12px] text-white/50">{ann.date}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurCommunity;
