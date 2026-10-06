"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { isValidNigerianPhone } from "@/lib/phone";

const FIELD =
  "w-full rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-shop-accent-1";

export default function TrackOrderClient() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");

  const phoneValid = isValidNigerianPhone(phone);
  const isValid = reference.trim().length > 3 && phoneValid;

  const submit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    router.push(
      `/orders/track/${encodeURIComponent(reference.trim())}?phone=${encodeURIComponent(phone.trim())}`,
    );
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] px-4 py-10 font-shop md:py-16">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <PackageSearch className="h-8 w-8 text-shop-accent-1" strokeWidth={1.5} />
        <h1 className="text-[20px] font-semibold text-shop-heading">Track an Order</h1>
        <p className="max-w-[380px] text-[13px] text-shop-text/70">
          No account needed - enter the order reference (from your confirmation
          email) and the phone number you checked out with.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Order reference"
          className={FIELD}
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          inputMode="tel"
          className={FIELD}
        />
        {phone.length > 0 && !phoneValid && (
          <p className="-mt-1.5 text-[11.5px] text-red-600">
            Enter a valid Nigerian phone number.
          </p>
        )}
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-[8px] bg-shop-accent-1 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Find Order
        </button>
      </form>
    </div>
  );
}
