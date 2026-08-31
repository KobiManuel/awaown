"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, Truck, Mail, MessageSquare, ShieldAlert, Check } from "lucide-react";
import { PAYMENT_GATEWAY_OPTIONS } from "@/lib/admin-data";
import { updateSettings } from "@/lib/store/adminSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const Toggle = ({ on, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-shop-accent-1" : "bg-shop-border"}`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] duration-200 ${
        on ? "left-[22px]" : "left-0.5"
      }`}
    />
  </button>
);

export default function AdminSettingsPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const settings = useSelector((s) => s.admin.settings);

  const handleUpdate = (patch, label) => {
    dispatch(updateSettings(patch));
    showToast(label);
  };

  const togglePaymentGateway = (id) => {
    const current = settings.paymentGateways || [];
    const active = current.includes(id);
    if (active && current.length === 1) {
      showToast("At least one payment gateway must stay enabled");
      return;
    }
    const next = active ? current.filter((g) => g !== id) : [...current, id];
    handleUpdate({ paymentGateways: next }, active ? `${id} disabled` : `${id} enabled`);
  };

  return (
    <div className="flex flex-col gap-4 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Platform Settings" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-0">
        Payment gateways, shipping, notifications, security, integrations and system preferences.
      </p>

      <div className="flex flex-col gap-3 px-4 lg:px-0">
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
            {PAYMENT_GATEWAY_OPTIONS.map((g) => {
              const enabled = (settings.paymentGateways || []).includes(g.id);
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
          <span className="text-[12.5px] capitalize text-shop-text">{settings.shippingProvider.replace("_", " ")}</span>
        </div>
        <div className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
          <span className="flex items-center gap-2.5 text-[13px] font-medium text-shop-heading">
            <Mail className="h-4.5 w-4.5 text-shop-accent-1" />
            Email Provider
          </span>
          <span className="text-[12.5px] capitalize text-shop-text">{settings.emailProvider}</span>
        </div>
        <div className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
          <span className="flex items-center gap-2.5 text-[13px] font-medium text-shop-heading">
            <MessageSquare className="h-4.5 w-4.5 text-shop-accent-1" />
            SMS Provider
          </span>
          <span className="text-[12.5px] capitalize text-shop-text">{settings.smsProvider}</span>
        </div>
        <div className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
          <span className="flex items-center gap-2.5 text-[13px] font-medium text-shop-heading">
            <ShieldAlert className="h-4.5 w-4.5 text-shop-accent-1" />
            Require 2FA for staff
          </span>
          <Toggle
            on={settings.twoFactorRequired}
            onClick={() => handleUpdate({ twoFactorRequired: !settings.twoFactorRequired }, "2FA requirement updated")}
          />
        </div>
        <div className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
          <span className="text-[13px] font-medium text-shop-heading">Maintenance Mode</span>
          <Toggle
            on={settings.maintenanceMode}
            onClick={() => handleUpdate({ maintenanceMode: !settings.maintenanceMode }, "Maintenance mode updated")}
          />
        </div>
      </div>
    </div>
  );
}
