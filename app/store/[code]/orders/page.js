"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, PackageSearch } from "lucide-react";
import { formatPrice } from "@/lib/shop-data";
import { isValidNigerianPhone } from "@/lib/phone";
import { statusMeta } from "@/lib/order-status";
import { useGetGuestOrderLookupQuery } from "@/lib/api/ordersApi";
import StoreThemeShell from "@/app/Components/PartnerStore/StoreThemeShell";

const FIELD =
  "w-full rounded-[8px] border border-shop-border bg-shop-surface px-3 py-2.5 text-[13.5px] outline-none focus:border-shop-accent-1";

export default function PartnerStoreOrdersLookupPage() {
  const { code } = useParams();
  const [phone, setPhone] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");

  const { data, isFetching, isError } = useGetGuestOrderLookupQuery(
    { storeCode: code, phone: submittedPhone },
    { skip: !submittedPhone },
  );

  const phoneValid = isValidNigerianPhone(phone);

  const submit = (e) => {
    e.preventDefault();
    if (phoneValid) setSubmittedPhone(phone.trim());
  };

  return (
    <StoreThemeShell>
      <div className="mx-auto w-full max-w-[560px] px-4 py-10 font-shop md:py-16">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <PackageSearch className="h-8 w-8 text-shop-accent-1" strokeWidth={1.5} />
          <h1 className="text-[20px] font-semibold">Your Orders</h1>
          <p className="max-w-[380px] text-[13px] opacity-70">
            No account needed - enter the phone number you checked out with to see
            your orders from this store.
          </p>
        </div>

        <form onSubmit={submit} className="flex gap-2">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            inputMode="tel"
            className={FIELD}
          />
          <button
            type="submit"
            disabled={!phoneValid}
            className="shrink-0 rounded-[8px] bg-shop-accent-1 px-5 text-[13.5px] font-semibold text-white disabled:opacity-50"
          >
            Find
          </button>
        </form>
        {phone.length > 0 && !phoneValid && (
          <p className="mt-1.5 text-[11.5px] text-red-500">Enter a valid Nigerian phone number.</p>
        )}

        {isFetching && (
          <div className="mt-8 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-shop-accent-1" />
          </div>
        )}

        {!isFetching && submittedPhone && isError && (
          <p className="mt-8 text-center text-[13px] opacity-70">
            Couldn&apos;t look that up right now. Try again in a moment.
          </p>
        )}

        {!isFetching && submittedPhone && data && data.length === 0 && (
          <p className="mt-8 text-center text-[13px] opacity-70">
            No orders found for that phone number at this store.
          </p>
        )}

        {!isFetching && data && data.length > 0 && (
          <div className="mt-8 flex flex-col gap-2.5">
            {data.map((o) => {
              const meta = statusMeta(o.status);
              return (
                <Link
                  key={o.reference}
                  href={`/store/${code}/orders/${o.reference}?phone=${encodeURIComponent(submittedPhone)}`}
                  className="flex items-center justify-between gap-3 rounded-[12px] border border-shop-border bg-shop-surface p-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold">{o.reference}</p>
                    <p className="line-clamp-1 text-[11.5px] opacity-70">
                      {o.items.map((i) => i.title).join(", ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.tone}`}>
                      {meta.label}
                    </span>
                    <span className="text-[12px] font-medium">{formatPrice(o.total)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </StoreThemeShell>
  );
}
