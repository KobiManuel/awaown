"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import SectionHeader from "@/app/Components/Section/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublicFaqsQuery } from "@/lib/api/storefrontApi";

const HomeFaqs = () => {
  const { data, isLoading } = useGetPublicFaqsQuery();
  const faqs = data?.items ?? [];
  const [openId, setOpenId] = useState(null);

  if (!isLoading && faqs.length === 0) return null;

  return (
    <div className="mx-auto mt-12 w-full max-w-[900px] px-4 font-shop md:mt-16 md:px-8">
      <SectionHeader title="Frequently Asked Questions" />
      <div className="flex flex-col gap-2.5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-[12px]" />
            ))
          : faqs.map((f) => {
              const open = openId === f.id;
              return (
                <div
                  key={f.id}
                  className="rounded-[12px] border border-shop-border bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : f.id)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="text-[14px] font-medium text-shop-heading">
                      {f.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-shop-text/50 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && f.answer && (
                    <p className="border-t border-shop-border px-5 py-4 text-[13.5px] leading-[21px] text-shop-text">
                      {f.answer}
                    </p>
                  )}
                </div>
              );
            })}
      </div>
      <p className="mt-4 text-center text-[13px] text-shop-text/70">
        Still have a question?{" "}
        <Link href="/dashboard/help" className="font-semibold text-shop-accent-1">
          Visit the Help Centre
        </Link>
      </p>
    </div>
  );
};

export default HomeFaqs;
