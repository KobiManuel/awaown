"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tag, Plus, Mail, ImagePlus, X, Send } from "lucide-react";
import { toggleCouponStatus, addCoupon, sendEmailCampaign } from "@/lib/store/adminSlice";
import { EMAIL_AUDIENCES, customersDirectory } from "@/lib/admin-data";
import { readImageAsCompressedDataURL } from "@/lib/file-utils";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const MAX_CAMPAIGN_IMAGES = 4;

const STATUS_TONE = {
  active: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-shop-accent-1-light text-shop-accent-1",
  expired: "bg-shop-bg text-shop-text",
};

export default function AdminMarketingPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const coupons = useSelector((s) => s.admin.coupons);
  const emailCampaigns = useSelector((s) => s.admin.emailCampaigns);
  const merchantCount = useSelector((s) => s.admin.merchants.length);
  const partnerCount = useSelector((s) => s.admin.partners.length);
  const [formOpen, setFormOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");

  const [campaignOpen, setCampaignOpen] = useState(false);
  const [audience, setAudience] = useState("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [campaignImages, setCampaignImages] = useState([]);

  const customerCount = customersDirectory.length;
  const audienceCount = (id) => {
    if (id === "merchants") return merchantCount;
    if (id === "partners") return partnerCount;
    if (id === "customers") return customerCount;
    return merchantCount + partnerCount + customerCount;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!code || !discount) return;
    dispatch(
      addCoupon({
        id: `cp-${Date.now()}`,
        code: code.toUpperCase(),
        discount,
        uses: 0,
        status: "scheduled",
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    );
    showToast(`Coupon "${code.toUpperCase()}" created`);
    setCode("");
    setDiscount("");
    setFormOpen(false);
  };

  const handleCampaignImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = MAX_CAMPAIGN_IMAGES - campaignImages.length;
    const dataUrls = await Promise.all(files.slice(0, remaining).map(readImageAsCompressedDataURL));
    setCampaignImages((prev) => [...prev, ...dataUrls]);
    e.target.value = "";
  };

  const removeCampaignImage = (index) =>
    setCampaignImages((prev) => prev.filter((_, i) => i !== index));

  const handleSendCampaign = (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    const recipientCount = audienceCount(audience);
    dispatch(
      sendEmailCampaign({
        id: `ec-${Date.now()}`,
        subject: subject.trim(),
        body: body.trim(),
        images: campaignImages,
        audience,
        recipientCount,
        sentAt: new Date().toISOString(),
      }),
    );
    showToast(`Campaign sent to ${recipientCount} recipient${recipientCount === 1 ? "" : "s"}`);
    setSubject("");
    setBody("");
    setCampaignImages([]);
    setAudience("all");
    setCampaignOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="Marketing"
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
        <form onSubmit={handleAdd} className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border bg-shop-bg p-4 lg:mx-8">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Coupon code (e.g. SAVE15)"
            className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          />
          <input
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Discount (e.g. 15% off)"
            className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          />
          <button type="submit" className="rounded-[8px] bg-shop-accent-1 py-2.5 text-[13px] font-semibold text-white">
            Create Coupon
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <Tag className="h-4 w-4 text-shop-accent-1" />
          Coupons
        </p>
        <div className="flex flex-col gap-2">
          {coupons.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <div>
                <p className="text-[13px] font-semibold text-shop-heading">{c.code}</p>
                <p className="text-[11.5px] text-shop-text/70">{c.discount} · {c.uses} uses</p>
              </div>
              <button
                type="button"
                disabled={c.status === "expired"}
                onClick={() => {
                  dispatch(toggleCouponStatus(c.id));
                  showToast(`"${c.code}" updated`);
                }}
                className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold capitalize disabled:cursor-not-allowed ${STATUS_TONE[c.status]}`}
              >
                {c.status}
              </button>
            </div>
          ))}
        </div>
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
            onSubmit={handleSendCampaign}
            className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-shop-bg p-4"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-shop-heading">Send to</span>
              <div className="flex flex-wrap gap-2">
                {EMAIL_AUDIENCES.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAudience(a.id)}
                    className={`rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                      audience === a.id
                        ? "border-shop-accent-1 bg-shop-accent-1 text-white"
                        : "border-shop-border bg-white text-shop-text"
                    }`}
                  >
                    {a.label} ({audienceCount(a.id).toLocaleString()})
                  </button>
                ))}
              </div>
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

            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-shop-heading">
                Images <span className="font-normal text-shop-text">(optional)</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {campaignImages.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border border-shop-border">
                    <img src={img} alt={`Attachment ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeCampaignImage(i)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {campaignImages.length < MAX_CAMPAIGN_IMAGES && (
                  <label className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-dashed border-shop-border bg-white">
                    <ImagePlus className="h-5 w-5 text-shop-text/40" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleCampaignImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!subject.trim() || !body.trim()}
              className="flex items-center justify-center gap-1.5 rounded-[8px] bg-shop-accent-1 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
            >
              <Send className="h-3.5 w-3.5" />
              Send Campaign
            </button>
          </form>
        )}

        <div className="flex flex-col gap-2">
          {emailCampaigns.length === 0 ? (
            <p className="py-6 text-center text-[12.5px] text-shop-text/60">
              No campaigns sent yet.
            </p>
          ) : (
            emailCampaigns.map((c) => (
              <div key={c.id} className="flex flex-col gap-1.5 rounded-[14px] border border-shop-border bg-white p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-shop-heading">{c.subject}</p>
                  <span className="shrink-0 rounded-full bg-shop-accent-1-light px-2 py-0.5 text-[10.5px] font-semibold capitalize text-shop-accent-1">
                    {EMAIL_AUDIENCES.find((a) => a.id === c.audience)?.label || c.audience}
                  </span>
                </div>
                <p className="line-clamp-2 text-[11.5px] text-shop-text/70">{c.body}</p>
                {c.images?.length > 0 && (
                  <div className="flex gap-1.5 pt-0.5">
                    {c.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="h-10 w-10 rounded-[6px] object-cover" />
                    ))}
                  </div>
                )}
                <p className="text-[10.5px] text-shop-text/50">
                  Sent to {c.recipientCount.toLocaleString()} recipients ·{" "}
                  {new Date(c.sentAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
