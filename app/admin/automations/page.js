"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Zap, ArrowRight } from "lucide-react";
import { toggleAutomationRule } from "@/lib/store/adminSlice";
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

export default function AdminAutomationsPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const rules = useSelector((s) => s.admin.automationRules);

  return (
    <div className="flex flex-col gap-4 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="Automation Center" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-0">
        Create simple trigger → action automations instead of manual staff work.
      </p>

      <div className="flex flex-col gap-2.5 px-4 lg:px-0">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between gap-3 rounded-[14px] border border-shop-border bg-white p-3.5">
            <div className="flex min-w-0 items-center gap-2">
              <Zap className="h-4 w-4 shrink-0 text-shop-accent-1" strokeWidth={1.75} />
              <p className="text-[12.5px] text-shop-heading">
                <span className="font-semibold">When</span> {rule.trigger}
                <ArrowRight className="mx-1.5 inline h-3 w-3 text-shop-text/50" />
                <span className="font-semibold">{rule.action}</span>
              </p>
            </div>
            <Toggle
              on={rule.enabled}
              onClick={() => {
                dispatch(toggleAutomationRule(rule.id));
                showToast(`Automation ${rule.enabled ? "disabled" : "enabled"}`);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
