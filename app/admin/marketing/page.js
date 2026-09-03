"use client";

import React, { useState } from "react";
import { Tag, Plus, Mail, ImagePlus, X, Send, Loader2 } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetAdminOverviewQuery,
  useGetAdminCouponsQuery,
  useSaveAdminCouponMutation,
  useGetAdminCampaignsQuery,
  useSendAdminCampaignMutation,
} from "@/lib/api/adminApi";
import { useMediaUpload } from "@/lib/api/mediaApi";
import { errorMessage } from "@/lib/api/errorMessage";

const MAX_CAMPAIGN_IMAGES = 4;

const STATUS_TONE = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  SCHEDULED: "bg-shop-accent-1-light text-shop-accent-1",
  EXPIRED: "bg-shop-bg text-shop-text",
};

const AUDIENCES = [
  { id: "everyone", label: "Everyone" },
  { id: "customers", label: "Customers" },
  { id: "merchants", label: "Merchants" },
  { id: "partners", label: "Partners" },
];

export default function AdminMarketingPage() {
  const showToast = useToast();
  const { data: overview } = useGetAdminOverviewQuery();
  const { data: coupons, isLoading: couponsLoading } = useGetAdminCouponsQuery();
  const [saveCoupon, saveCouponState] = useSaveAdminCouponMutation();
  const { data: campaigns, isLoading: campaignsLoading } =
    useGetAdminCampaignsQuery();
  const [sendCampaign, sendState] = useSendAdminCampaignMutation();
  const { upload, uploading } = useMediaUpload("campaigns");

  const [formOpen, setFormOpen] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");
  const [minSpend, setMinSpend] = useState("");

  const [campaignOpen, setCampaignOpen] = useState(false);
  const [audience, setAudience] = useState("everyone");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [campaignImages, setCampaignImages] = useState([]);

  const kpis = overview?.kpis;
  const audienceCount = (id) => {
    if (!kpis) return 0;
    if (id === "merchants") return kpis.merchants;
    if (id === "partners") return kpis.partners;
    if (id === "customers") return kpis.customers;
    return kpis.customers + kpis.merchants + kpis.partners;
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim() || !value) return;
    try {
      await saveCoupon({
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minSpend: Number(minSpend) || 0,
        status: "ACTIVE",
      }).unwrap();
      showToast(`Coupon "${code.toUpperCase()}" created`);
      setCode("");
      setValue("");
      setMinSpend("");
      setFormOpen(false);
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const cycleCouponStatus = async (c) => {
    if (c.status === "EXPIRED") return;
    const next = c.status === "ACTIVE" ? "SCHEDULED" : "ACTIVE";
    try {
      await saveCoupon({ id: c.id, code: c.code, status: next }).unwrap();
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const addCampaignImages = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const room = MAX_CAMPAIGN_IMAGES - campaignImages.length;
    for (const file of files.slice(0, room)) {
      const url = await upload(file);
      if (url) setCampaignImages((prev) => [...prev, url]);
    }
  };

  const send = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    try {
      const count = audienceCount(audience);
      await sendCampaign({
        subject: subject.trim(),
        body: body.trim(),
        audience,
        images: campaignImages,
      }).unwrap();
      showToast(`Campaign sent to ${count.toLocaleString()} recipients`);
      setSubject("");
      setBody("");
      setCampaignImages([]);
      setAudience("everyone");
      setCampaignOpen(false);
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="Marketing"
        backHref="/admin"
        right={
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            aria-label="New coupon"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-shop-accent-1-light text-shop-accent-1"
          >
            <Plus className="h-4 w-4" />
          </button>
        }
      />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Coupons, campaigns, flash sales, email, SMS and push notifications.
      </p>

      {formOpen && (
        <form
          onSubmit={createCoupon}
          className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border bg-shop-bg p-4 lg:mx-8"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Coupon code (e.g. SAVE15)"
            className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] uppercase outline-none focus:border-shop-accent-1"
          />
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
            >
              <option value="percent">% off</option>
              <option value="fixed">₦ off</option>
            </select>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ""))}
              inputMode="numeric"
              placeholder={type === "percent" ? "10" : "1500"}
              className="flex-1 rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
            />
          </div>
          <input
            value={minSpend}
            onChange={(e) => setMinSpend(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode="numeric"
            placeholder="Minimum spend (optional)"
            className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          />
          <button
            type="submit"
            disabled={saveCouponState.isLoading}
            className="rounded-[8px] bg-shop-accent-1 py-2.5 text-[13px] font-semibold text-white disabled:opacity-70"
          >
            Create Coupon
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <Tag className="h-4 w-4 text-shop-accent-1" />
          Coupons
        </p>
        {couponsLoading ? (
          <SkeletonRows count={2} />
        ) : (
          <div className="flex flex-col gap-2">
            {(coupons ?? []).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div>
                  <p className="text-[13px] font-semibold text-shop-heading">
                    {c.code}
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">
                    {c.type === "percent" ? `${c.value}% off` : `₦${c.value} off`}
                    {c.minSpend ? ` · min ₦${c.minSpend.toLocaleString()}` : ""} ·{" "}
                    {c.usageCount} uses
                  </p>
                </div>
                <button
                  type="button"
                  disabled={c.status === "EXPIRED"}
                  onClick={() => cycleCouponStatus(c)}
                  className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold capitalize disabled:cursor-not-allowed ${STATUS_TONE[c.status]}`}
                >
                  {c.status.toLowerCase()}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
            <Mail className="h-4 w-4 text-shop-accent-1" />
            Email Campaigns
          </p>
          <button
            type="button"
            onClick={() => setCampaignOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1-light px-3 py-1.5 text-[12px] font-semibold text-shop-accent-1"
          >
            <Plus className="h-3.5 w-3.5" />
            New Campaign
          </button>
        </div>

        {campaignOpen && (
          <form
            onSubmit={send}
            className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-shop-bg p-4"
          >
            <span className="text-[12px] font-semibold text-shop-heading">Send to</span>
            <div className="-mt-1.5 flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAudience(a.id)}
                  className={`rounded-full border px-3.5 py-2 text-[12px] font-semibold ${
                    audience === a.id
                      ? "border-shop-accent-1 bg-shop-accent-1 text-white"
                      : "border-shop-border bg-white text-shop-text"
                  }`}
                >
                  {a.label} ({audienceCount(a.id).toLocaleString()})
                </button>
              ))}
            </div>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Write your message..."
              className="resize-none rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
            />
            <div className="flex flex-wrap gap-2.5">
              {campaignImages.map((img, i) => (
                <div
                  key={i}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border border-shop-border"
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCampaignImages((p) => p.filter((_, k) => k !== i))
                    }
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {campaignImages.length < MAX_CAMPAIGN_IMAGES && (
                <label className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-dashed border-shop-border bg-white">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-shop-text/40" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-shop-text/40" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={addCampaignImages}
                  />
                </label>
              )}
            </div>
            <button
              type="submit"
              disabled={!subject.trim() || !body.trim() || sendState.isLoading}
              className="flex items-center justify-center gap-1.5 rounded-[8px] bg-shop-accent-1 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
            >
              {sendState.isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Send Campaign
            </button>
          </form>
        )}

        <div className="flex flex-col gap-2">
          {campaignsLoading ? (
            <SkeletonRows count={2} />
          ) : (campaigns ?? []).length === 0 ? (
            <p className="py-6 text-center text-[12.5px] text-shop-text/60">
              No campaigns sent yet.
            </p>
          ) : (
            campaigns.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-1.5 rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-shop-heading">
                    {c.subject}
                  </p>
                  <span className="shrink-0 rounded-full bg-shop-accent-1-light px-2 py-0.5 text-[10.5px] font-semibold capitalize text-shop-accent-1">
                    {c.audience}
                  </span>
                </div>
                <p className="line-clamp-2 text-[11.5px] text-shop-text/70">
                  {c.body}
                </p>
                {c.images?.length > 0 && (
                  <div className="flex gap-1.5 pt-0.5">
                    {c.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="h-10 w-10 rounded-[6px] object-cover"
                      />
                    ))}
                  </div>
                )}
                <p className="text-[10.5px] text-shop-text/50">
                  Sent to {c.recipientCount.toLocaleString()} recipients ·{" "}
                  {new Date(c.sentAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
