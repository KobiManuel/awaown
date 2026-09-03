"use client";

import React from "react";
import {
  CreditCard,
  Truck,
  Mail,
  MessageSquare,
  ShieldAlert,
  Check,
} from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} from "@/lib/api/adminApi";

const GATEWAYS = [
  { id: "paystack", label: "Paystack" },
  { id: "flutterwave", label: "Flutterwave" },
  { id: "opay", label: "OPay" },
  { id: "stripe", label: "Stripe" },
];

const Toggle = ({ on, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
      on ? "bg-shop-accent-1" : "bg-shop-border"
    }`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] duration-200 ${
        on ? "left-[22px]" : "left-0.5"
      }`}
    />
  </button>
);

export default function AdminSettingsPage() {
  const showToast = useToast();
  const { data: settings, isLoading } = useGetAdminSettingsQuery();
  const [update] = useUpdateAdminSettingsMutation();

  const save = async (patch, label) => {
    try {
      await update(patch).unwrap();
      showToast(label || "Settings saved");
    } catch {
      showToast("Couldn't save the change");
    }
  };

  const gateways = settings?.paymentGateways ?? ["paystack"];

  const togglePaymentGateway = (id) => {
    const active = gateways.includes(id);
    if (active && gateways.length === 1) {
      showToast("At least one payment gateway must stay enabled");
      return;
    }
    const next = active ? gateways.filter((g) => g !== id) : [...gateways, id];
    save({ paymentGateways: next }, active ? `${id} disabled` : `${id} enabled`);
  };

  return (
    <div className="flex flex-col gap-4 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Platform Settings" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Payment gateways, shipping, notifications, security, integrations and system preferences.
      </p>

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <Skeleton className="h-48 w-full rounded-[14px]" />
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 lg:px-8">
          <div className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-3.5">
            <span className="flex items-center gap-2.5 text-[13px] font-medium text-shop-heading">
              <CreditCard className="h-4.5 w-4.5 text-shop-accent-1" />
              Payment Gateways
            </span>
            <p className="text-[11px] text-shop-text/60">
              More than one can be active at once — e.g. a fallback for cards the primary
              provider declines.
            </p>
            <div className="flex flex-wrap gap-2">
              {GATEWAYS.map((g) => {
                const enabled = gateways.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => togglePaymentGateway(g.id)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      enabled
                        ? "border-shop-accent-1 bg-shop-accent-1-light text-shop-accent-1"
                        : "border-shop-border text-shop-text"
                    }`}
                  >
                    {enabled && <Check className="h-3.5 w-3.5" />}
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
            <span className="flex items-center gap-2.5 text-[13px] font-medium text-shop-heading">
              <Truck className="h-4.5 w-4.5 text-shop-accent-1" />
              Shipping Provider
            </span>
            <span className="text-[12.5px] capitalize text-shop-text">
              {String(settings?.shippingProvider ?? "gig_logistics").replace(/_/g, " ")}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
            <span className="flex items-center gap-2.5 text-[13px] font-medium text-shop-heading">
              <Mail className="h-4.5 w-4.5 text-shop-accent-1" />
              Email Provider
            </span>
            <span className="text-[12.5px] capitalize text-shop-text">
              {settings?.emailProvider ?? "resend"}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
            <span className="flex items-center gap-2.5 text-[13px] font-medium text-shop-heading">
              <MessageSquare className="h-4.5 w-4.5 text-shop-accent-1" />
              SMS Provider
            </span>
            <span className="text-[12.5px] capitalize text-shop-text">
              {settings?.smsProvider ?? "termii"}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
            <div>
              <span className="flex items-center gap-2.5 text-[13px] font-medium text-shop-heading">
                <ShieldAlert className="h-4.5 w-4.5 text-shop-accent-1" />
                Require 2FA for staff
              </span>
              <p className="mt-0.5 text-[11px] text-shop-text/60">
                Admin accounts must set up two-factor auth.
              </p>
            </div>
            <Toggle
              on={!!settings?.twoFactorRequired}
              onClick={() =>
                save(
                  { twoFactorRequired: !settings?.twoFactorRequired },
                  "2FA requirement updated",
                )
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
            <div>
              <span className="text-[13px] font-medium text-shop-heading">Maintenance Mode</span>
              <p className="mt-0.5 text-[11px] text-shop-text/60">
                Blocks the public site for everyone but admins.
              </p>
            </div>
            <Toggle
              on={!!settings?.maintenanceMode}
              onClick={() =>
                save(
                  { maintenanceMode: !settings?.maintenanceMode },
                  "Maintenance mode updated",
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
