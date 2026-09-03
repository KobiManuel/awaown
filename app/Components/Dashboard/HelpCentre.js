"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Mail,
  MessageCircle,
  MessagesSquare,
  ChevronDown,
  Loader2,
} from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useGetPublicFaqsQuery } from "@/lib/api/storefrontApi";

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="rounded-[14px] border border-shop-border bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-3.5 text-left"
      >
        <span className="text-[13px] font-medium text-shop-heading">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-shop-text/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && a && (
        <p className="border-t border-shop-border px-3.5 py-3 text-[12.5px] leading-[19px] text-shop-text">
          {a}
        </p>
      )}
    </div>
  );
}

export default function HelpCentre({ backHref, supportHref }) {
  const { data, isLoading } = useGetPublicFaqsQuery();
  const faqs = data?.items ?? [];
  const [openId, setOpenId] = useState(null);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Help Centre" backHref={backHref} showBackOnDesktop />

      <div className="flex flex-col gap-2.5 px-4 lg:px-0">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <HelpCircle className="h-4 w-4 text-shop-accent-1" />
          Frequently Asked Questions
        </p>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-shop-accent-1" />
            </div>
          ) : faqs.length === 0 ? (
            <p className="py-6 text-center text-[12.5px] text-shop-text">
              No FAQs published yet.
            </p>
          ) : (
            faqs.map((f) => (
              <FaqItem
                key={f.id}
                q={f.question}
                a={f.answer}
                open={openId === f.id}
                onToggle={() => setOpenId(openId === f.id ? null : f.id)}
              />
            ))
          )}
        </div>
      </div>

      <div className="mx-4 flex flex-col gap-2.5 rounded-[14px] bg-shop-bg p-4 lg:mx-0">
        <p className="text-[13px] font-semibold text-shop-heading">Still need help?</p>
        {supportHref && (
          <Link
            href={supportHref}
            className="flex items-center gap-3 rounded-[10px] bg-white p-3 hover:bg-shop-accent-1-light"
          >
            <MessagesSquare className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
            <div>
              <p className="text-[12.5px] font-medium text-shop-heading">
                Start a support conversation
              </p>
              <p className="text-[11px] text-shop-text/70">
                Message our team and track their reply here
              </p>
            </div>
          </Link>
        )}
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
          href="https://wa.me/2348032105000"
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
