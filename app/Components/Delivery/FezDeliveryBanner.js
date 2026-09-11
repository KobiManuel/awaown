"use client";

import React from "react";
import { Truck } from "lucide-react";

const FEZ_LOGO =
  "https://cdn.prod.website-files.com/647068704f90b915daf19034/64708f8629b92d48d4457146_fez%20logo.svg";

const STATUS_COPY = {
  pending: "Preparing this order for pickup",
  created: "Scheduled for pickup",
  picked_up: "Picked up - on its way to the Fez hub",
  dispatched: "Out for delivery",
  delivered: "Delivered",
  returned: "There's an issue with this delivery - our team is on it",
  failed: "There's an issue with this delivery - our team is on it",
  cancelled: "Delivery was cancelled",
};

/**
 * Replaces raw carrier/waybill/tracking-link fields with a clean, branded
 * "delivery partner" card. Pass the furthest-along shipment status (or a
 * ready-made phrase) via `status`.
 */
export default function FezDeliveryBanner({ status, className = "" }) {
  const copy = STATUS_COPY[status] ?? status ?? "Handling delivery for this order";
  return (
    <div
      className={`mx-4 flex items-center gap-3 rounded-[12px] border border-shop-border bg-gradient-to-r from-shop-bg to-white p-3.5 ${className}`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-shop-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FEZ_LOGO} alt="Fez" className="h-5 w-5 object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-shop-heading">
          Delivery by Fez
          <Truck className="h-3.5 w-3.5 text-shop-accent-1" strokeWidth={1.75} />
        </p>
        <p className="truncate text-[11.5px] text-shop-text/70">{copy}</p>
      </div>
    </div>
  );
}
