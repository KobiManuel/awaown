"use client";

import React from "react";
import { useSelector } from "react-redux";
import { HelpCircle, Mail, MessageCircle } from "lucide-react";

import AppHeader from "@/app/Components/Dashboard/AppHeader";

export default function PartnerHelpPage() {
  const faqs = useSelector((s) => s.admin.faqs.filter((f) => f.status === "published"));

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Help Centre" backHref="/partner" />

      <div className="flex flex-col gap-2.5 px-4 lg:px-0">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <HelpCircle className="h-4 w-4 text-shop-accent-1" />
          Frequently Asked Questions
        </p>
        <div className="flex flex-col gap-2">
          {faqs.map((f) => (
            <div key={f.id} className="rounded-[14px] border border-shop-border bg-white p-3.5">
              <p className="text-[13px] font-medium text-shop-heading">{f.question}</p>
            </div>
          ))}
          {faqs.length === 0 && (
            <p className="py-6 text-center text-[12.5px] text-shop-text">No FAQs published yet.</p>
          )}
        </div>
      </div>

      <div className="mx-4 flex flex-col gap-2.5 rounded-[14px] bg-shop-bg p-4 lg:mx-0">
        <p className="text-[13px] font-semibold text-shop-heading">Still need help?</p>
        <a
          href="mailto:support@awaown.com"
          className="flex items-center gap-3 rounded-[10px] bg-white p-3 hover:bg-shop-accent-1-light"
        >
          <Mail className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
          <div>
            <p className="text-[12.5px] font-medium text-shop-heading">Email Support</p>
            <p className="text-[11px] text-shop-text/70">support@awaown.com</p>
          </div>
        </a>
        <a
          href="https://wa.me/2340000000000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-[10px] bg-white p-3 hover:bg-shop-accent-1-light"
        >
          <MessageCircle className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
          <div>
            <p className="text-[12.5px] font-medium text-shop-heading">Chat on WhatsApp</p>
            <p className="text-[11px] text-shop-text/70">Usually replies within a few hours</p>
          </div>
        </a>
      </div>
    </div>
  );
}
