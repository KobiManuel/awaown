"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, ImagePlus, Plus, Trash2, Quote } from "lucide-react";
import {
  formatPrice,
  homepageContentDefaults,
  sectionVisibilityDefaults,
  communitySectionDefaults,
} from "@/lib/admin-data";
import {
  useGetHomepageCmsQuery,
  useSaveHomepageCmsMutation,
  useGetAdminMerchantsQuery,
} from "@/lib/api/adminApi";
import { useMediaUpload } from "@/lib/api/mediaApi";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const LABEL = "text-[10.5px] font-semibold uppercase tracking-wide text-shop-text/60";

// Click-to-edit text: renders as plain text matching the live homepage's own classes;
// clicking swaps it for a real input/textarea so an admin can type over or erase it,
// same interaction as the rest of this editor's fields.
function InlineText({ value, onChange, className = "", placeholder = "", multiline = false }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(value || "");

  const startEdit = () => {
    setLocal(value || "");
    setEditing(true);
  };

  const commit = () => {
    onChange(local);
    setEditing(false);
  };

  if (editing) {
    // The preview className often carries a light text colour (cards on dark or
    // coloured backgrounds). Strip anything that would make the text invisible
    // once it's on the white editing field, and force readable colours.
    const safe = className
      .split(/\s+/)
      .filter(
        (c) =>
          !/^!?text-(white|black)(\/\d+)?$/.test(c) &&
          !/^!?text-white\b/.test(c) &&
          !/^!?bg-/.test(c),
      )
      .join(" ");
    const editStyles =
      "w-full rounded-[4px] border border-shop-accent-1 bg-white! px-1.5 py-1 text-shop-heading! outline-none";
    if (multiline) {
      return (
        <textarea
          autoFocus
          rows={3}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={commit}
          className={`${safe} resize-none ${editStyles}`}
        />
      );
    }
    return (
      <input
        autoFocus
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        className={`${safe} ${editStyles}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className={`${className} cursor-text rounded-[4px] px-1.5 py-0.5 text-left outline-dashed outline-1 outline-transparent transition-colors hover:bg-white/15 hover:outline-white/50`}
    >
      {value || <span className="opacity-60">{placeholder}</span>}
    </button>
  );
}

function ImageEditButton({ onPick, label = "Change image" }) {
  const showToast = useToast();
  const inputRef = useRef(null);
  const { upload, uploading } = useMediaUpload("banners");

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await upload(file);
    if (url) {
      onPick(url);
      showToast("Image updated");
    } else {
      showToast("Image upload failed");
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={label}
        disabled={uploading}
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 disabled:opacity-60"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      </button>
    </>
  );
}

function DimensionHint({ text }) {
  return <p className="text-[10.5px] text-shop-text/50">Recommended image size: {text}</p>;
}

function VisibilityToggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={on ? "Hide this section from the homepage" : "Show this section on the homepage"}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-shop-accent-1" : "bg-shop-border"}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-[left] duration-200 ${
          on ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function SectionShell({ title, children, visible = true, onToggleVisible }) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-[16px] border border-shop-border bg-white p-5 ${
        visible ? "" : "opacity-60"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-shop-text/50">{title}</p>
        {onToggleVisible && (
          <label className="flex items-center gap-2">
            <span className="text-[10.5px] font-medium text-shop-text/60">
              {visible ? "Shown on homepage" : "Hidden"}
            </span>
            <VisibilityToggle on={visible} onClick={onToggleVisible} />
          </label>
        )}
      </div>
      {children}
    </div>
  );
}

function HeroEditor({ data, onChange, visible, onToggleVisible }) {
  const updateSlide = (i, patch) => {
    onChange({ slides: data.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  };

  return (
    <SectionShell title="Hero Banner" visible={visible} onToggleVisible={onToggleVisible}>
      <div className="grid grid-cols-2 gap-4">
        {data.slides.map((slide, i) => (
          <div key={i} className="group relative aspect-[1100/495] w-full overflow-hidden rounded-[10px] bg-shop-bg">
            <Image src={slide.image} alt="" fill className="object-cover" />
            <ImageEditButton onPick={(url) => updateSlide(i, { image: url })} />
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 px-6 text-white">
              <div className="pointer-events-auto">
                <InlineText
                  value={slide.discount}
                  onChange={(v) => updateSlide(i, { discount: v })}
                  className="text-[12px] font-medium uppercase tracking-wide"
                  placeholder="Discount label"
                />
              </div>
              <div className="pointer-events-auto">
                <InlineText
                  value={slide.title}
                  onChange={(v) => updateSlide(i, { title: v })}
                  className="max-w-[280px] text-[20px] font-semibold leading-[26px]"
                  placeholder="Slide title"
                  multiline
                />
              </div>
              <div className="pointer-events-auto">
                <InlineText
                  value={slide.price}
                  onChange={(v) => updateSlide(i, { price: v })}
                  className="text-[13px] font-medium"
                  placeholder="Price text"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <DimensionHint text="1100 × 495px per slide" />
    </SectionShell>
  );
}

function ThreeBannerEditor({ data, onChange, visible, onToggleVisible }) {
  const updateBanner = (i, patch) => {
    onChange({ banners: data.banners.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) });
  };

  return (
    <SectionShell title="3-Card Row (right after Hero)" visible={visible} onToggleVisible={onToggleVisible}>
      <div className="grid grid-cols-3 gap-4">
        {data.banners.map((b, i) => (
          <div key={i} className="group relative aspect-[446/180] w-full overflow-hidden rounded-[12px] bg-shop-bg">
            <Image src={b.image} alt="" fill className="object-cover" />
            <ImageEditButton onPick={(url) => updateBanner(i, { image: url })} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-end justify-center gap-1 px-4 text-right text-shop-heading">
              <div className="pointer-events-auto">
                <InlineText
                  value={b.heading}
                  onChange={(v) => updateBanner(i, { heading: v })}
                  className="max-w-[160px] text-[14px] font-semibold leading-[18px]"
                  placeholder="Heading"
                  multiline
                />
              </div>
              <div className="pointer-events-auto">
                <InlineText
                  value={b.price}
                  onChange={(v) => updateBanner(i, { price: v })}
                  className="text-[12px] font-medium"
                  placeholder="Price text"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <DimensionHint text="446 × 180px per card" />
    </SectionShell>
  );
}

function DealOfWeekEditor({ deal, featured, onDealChange, onFeaturedChange, visible, onToggleVisible }) {
  return (
    <SectionShell title="Deal of the Week & Featured Products" visible={visible} onToggleVisible={onToggleVisible}>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-3 rounded-[10px] bg-shop-bg p-4 lg:w-[280px] lg:shrink-0">
          <div className="group relative aspect-square w-full overflow-hidden rounded-[8px] bg-white">
            <Image src={deal.image} alt="" fill className="object-contain p-6" />
            <ImageEditButton onPick={(url) => onDealChange({ image: url })} />
          </div>
          <DimensionHint text="800 × 800px (square)" />
          <InlineText
            value={deal.vendor}
            onChange={(v) => onDealChange({ vendor: v })}
            className="w-fit rounded-full bg-shop-accent-1-light px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-shop-accent-1"
            placeholder="Vendor / badge"
          />
          <InlineText
            value={deal.title}
            onChange={(v) => onDealChange({ title: v })}
            className="text-[16px] font-semibold leading-[22px] text-shop-heading"
            placeholder="Product title"
            multiline
          />
          <div className="flex items-center gap-3">
            <InlineText
              value={String(deal.price)}
              onChange={(v) => onDealChange({ price: Number(v.replace(/[^0-9.]/g, "")) || 0 })}
              className="w-20 text-[18px] font-semibold text-shop-heading"
              placeholder="Price"
            />
            <InlineText
              value={String(deal.compareAt)}
              onChange={(v) => onDealChange({ compareAt: Number(v.replace(/[^0-9.]/g, "")) || 0 })}
              className="w-20 text-[13px] text-shop-text/60 line-through"
              placeholder="Compare-at"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className={LABEL}>Rating</span>
              <select
                value={deal.rating}
                onChange={(e) => onDealChange({ rating: Number(e.target.value) })}
                className="rounded-[6px] border border-shop-border px-2 py-1 text-[12px] text-shop-heading outline-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={LABEL}>Reviews</span>
              <InlineText
                value={String(deal.reviews)}
                onChange={(v) => onDealChange({ reviews: Number(v.replace(/[^0-9]/g, "")) || 0 })}
                className="w-14 text-[12px] text-shop-text/70"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <InlineText
            value={featured.sectionTitle}
            onChange={(v) => onFeaturedChange({ sectionTitle: v })}
            className="w-fit text-[16px] font-semibold text-shop-heading"
            placeholder="Section title"
          />
          <p className="text-[11.5px] text-shop-text/60">
            Products shown in this section come from the live product catalog — manage
            which products appear from Products, not here.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

function TwoBannerEditor({ data, onChange, visible, onToggleVisible }) {
  const updateBanner = (i, patch) => {
    onChange({ banners: data.banners.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) });
  };

  return (
    <SectionShell
      title="2-Banner Row (after Deal of the Week / Featured Products)"
      visible={visible}
      onToggleVisible={onToggleVisible}
    >
      <div className="grid grid-cols-2 gap-4">
        {data.banners.map((b, i) => (
          <div key={i} className="group relative aspect-[685/240] w-full overflow-hidden rounded-[12px] bg-shop-bg">
            <Image src={b.image} alt="" fill className="object-cover" />
            <ImageEditButton onPick={(url) => updateBanner(i, { image: url })} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-end justify-center gap-1.5 px-6 text-right text-white">
              <div className="pointer-events-auto">
                <InlineText
                  value={b.subheading}
                  onChange={(v) => updateBanner(i, { subheading: v })}
                  className="text-[12px] font-medium"
                  placeholder="Subheading"
                />
              </div>
              <div className="pointer-events-auto">
                <InlineText
                  value={b.heading}
                  onChange={(v) => updateBanner(i, { heading: v })}
                  className="max-w-[220px] text-[17px] font-semibold leading-[22px]"
                  placeholder="Heading"
                  multiline
                />
              </div>
              <div className="pointer-events-auto">
                <InlineText
                  value={b.buttonText}
                  onChange={(v) => updateBanner(i, { buttonText: v })}
                  className="text-[12px] font-semibold underline decoration-2 underline-offset-4"
                  placeholder="Button text"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <DimensionHint text="685 × 240px per banner" />
    </SectionShell>
  );
}

function OneBannerEditor({ data, onChange, visible, onToggleVisible }) {
  return (
    <SectionShell title="Banner (right before Reviews)" visible={visible} onToggleVisible={onToggleVisible}>
      <div className="group relative aspect-[1400/220] w-full overflow-hidden rounded-[16px] bg-shop-bg">
        <Image src={data.image} alt="" fill className="object-cover" />
        <ImageEditButton onPick={(url) => onChange({ image: url })} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-end justify-center gap-1.5 px-8 text-right text-white">
          <div className="pointer-events-auto">
            <InlineText
              value={data.subheading}
              onChange={(v) => onChange({ subheading: v })}
              className="text-[13px] font-medium"
              placeholder="Subheading"
            />
          </div>
          <div className="pointer-events-auto">
            <InlineText
              value={data.heading}
              onChange={(v) => onChange({ heading: v })}
              className="max-w-[400px] text-[20px] font-semibold leading-[26px]"
              placeholder="Heading"
              multiline
            />
          </div>
          <div className="pointer-events-auto">
            <InlineText
              value={data.buttonText}
              onChange={(v) => onChange({ buttonText: v })}
              className="text-[13px] font-semibold underline decoration-2 underline-offset-4"
              placeholder="Button text"
            />
          </div>
        </div>
      </div>
      <DimensionHint text="1400 × 220px" />
    </SectionShell>
  );
}

function ReviewsEditor({ data, onChange, visible, onToggleVisible }) {
  const updateTestimonial = (i, patch) => {
    onChange({ testimonials: data.testimonials.map((t, idx) => (idx === i ? { ...t, ...patch } : t)) });
  };
  const addTestimonial = () => {
    onChange({ testimonials: [...data.testimonials, { name: "New Reviewer", role: "Customer", quote: "" }] });
  };
  const removeTestimonial = (i) => {
    onChange({ testimonials: data.testimonials.filter((_, idx) => idx !== i) });
  };

  return (
    <SectionShell title="Reviews" visible={visible} onToggleVisible={onToggleVisible}>
      <div className="flex items-center justify-between">
        <InlineText
          value={data.sectionTitle}
          onChange={(v) => onChange({ sectionTitle: v })}
          className="w-fit text-[16px] font-semibold text-shop-heading"
          placeholder="Section title"
        />
        <button
          type="button"
          onClick={addTestimonial}
          className="flex items-center gap-1.5 rounded-full bg-shop-accent-1-light px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Review
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {data.testimonials.map((t, i) => (
          <div key={i} className="relative flex flex-col gap-3 rounded-[12px] bg-shop-bg p-5">
            <button
              type="button"
              onClick={() => removeTestimonial(i)}
              aria-label="Remove review"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-red-500 hover:bg-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <Quote className="h-5 w-5 text-shop-accent-1" />
            <InlineText
              value={t.quote}
              onChange={(v) => updateTestimonial(i, { quote: v })}
              className="text-[12.5px] leading-[19px] text-shop-text"
              placeholder="Quote"
              multiline
            />
            <div className="mt-auto flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light text-[12px] font-semibold text-shop-accent-1">
                {(t.name || "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <InlineText
                  value={t.name}
                  onChange={(v) => updateTestimonial(i, { name: v })}
                  className="text-[12.5px] font-semibold text-shop-heading"
                  placeholder="Name"
                />
                <InlineText
                  value={t.role}
                  onChange={(v) => updateTestimonial(i, { role: v })}
                  className="text-[11px] text-shop-text/70"
                  placeholder="Role"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

// Off by default (see sectionVisibilityDefaults) — a template for slotting in a new
// recurring homepage feature without a code change each time: pick a merchant, add a
// note, flip it on. The same shape could grow into "Partner of the Month" etc. later.
function MerchantOfWeekEditor({ data, onChange, visible, onToggleVisible }) {
  const { data: merchantsData } = useGetAdminMerchantsQuery();
  const merchants = merchantsData?.items ?? [];
  const selected = merchants.find((m) => m.id === data.merchantId);

  return (
    <SectionShell title="Merchant of the Week (extra — off by default)" visible={visible} onToggleVisible={onToggleVisible}>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1">
          <span className={LABEL}>Merchant</span>
          <select
            value={data.merchantId || ""}
            onChange={(e) => onChange({ merchantId: e.target.value })}
            className="rounded-[6px] border border-shop-border bg-white px-3 py-2 text-[12.5px] text-shop-heading outline-none focus:border-shop-accent-1"
          >
            <option value="">Select a merchant</option>
            {merchants.map((m) => (
              <option key={m.id} value={m.id}>
                {m.storeName}
              </option>
            ))}
          </select>
        </div>
        {selected && (
          <p className="text-[11px] text-shop-text/60">
            {selected.owner} · {formatPrice(selected.walletBalance || 0)} wallet balance
          </p>
        )}
        <div className="flex flex-col gap-1">
          <span className={LABEL}>Why they're featured</span>
          <InlineText
            value={data.note}
            onChange={(v) => onChange({ note: v })}
            className="text-[13px] text-shop-heading"
            placeholder="e.g. Fastest-growing store this month"
            multiline
          />
        </div>
      </div>
    </SectionShell>
  );
}

// Live preview of the homepage "Our Community" section, edited inline — same
// interaction model as every other section on this page.
function CommunityEditor({ data, onChange, visible, onToggleVisible }) {
  const vs = data.vendorSpotlight ?? {};
  const web = data.webinar ?? {};
  const tip = data.tip ?? {};
  const ch = data.challenge ?? {};
  const ann = data.announcement ?? {};

  const setCard = (key, patch) =>
    onChange({ [key]: { ...(data[key] ?? {}), ...patch } });

  return (
    <SectionShell title="Our Community" visible={visible} onToggleVisible={onToggleVisible}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Vendor spotlight */}
        <div className="relative col-span-1 flex min-h-[240px] flex-col justify-end overflow-hidden rounded-[20px] bg-shop-heading p-5 md:col-span-2">
          {vs.image && (
            <Image src={vs.image} alt="" fill className="object-cover opacity-70" sizes="60vw" />
          )}
          <ImageEditButton onPick={(url) => setCard("vendorSpotlight", { image: url })} />
          <div className="relative flex flex-col gap-2">
            <span className="w-fit rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">
              Vendor of the Week
            </span>
            <InlineText
              value={vs.vendorName}
              onChange={(v) => setCard("vendorSpotlight", { vendorName: v })}
              placeholder="Vendor name"
              className="text-[20px] font-bold text-white"
            />
            <InlineText
              value={vs.description}
              onChange={(v) => setCard("vendorSpotlight", { description: v })}
              placeholder="Short description"
              multiline
              className="max-w-[380px] text-[12.5px] leading-[19px] text-white/80"
            />
            <InlineText
              value={vs.buttonText}
              onChange={(v) => setCard("vendorSpotlight", { buttonText: v })}
              placeholder="Button text"
              className="w-fit rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-shop-heading"
            />
            <InlineText
              value={vs.buttonUrl}
              onChange={(v) => setCard("vendorSpotlight", { buttonUrl: v })}
              placeholder="Button link (optional — defaults to /shop)"
              className="text-[11px] text-white/70"
            />
          </div>
          <DimensionHint text="1200×800px" />
        </div>

        {/* Webinar */}
        <div className="col-span-1 flex min-h-[240px] flex-col justify-between rounded-[20px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-5">
          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">
              Upcoming Webinar
            </span>
            <InlineText
              value={web.title}
              onChange={(v) => setCard("webinar", { title: v })}
              placeholder="Webinar title"
              className="text-[15px] font-bold text-white"
            />
            <InlineText
              value={web.dateText}
              onChange={(v) => setCard("webinar", { dateText: v })}
              placeholder="Date / time"
              className="text-[12px] text-white/75"
            />
          </div>
          <div className="mt-3 flex flex-col gap-1.5 border-t border-white/15 pt-3">
            <InlineText
              value={web.buttonText}
              onChange={(v) => setCard("webinar", { buttonText: v })}
              placeholder="Button text"
              className="w-fit rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-shop-heading"
            />
            <InlineText
              value={web.url}
              onChange={(v) => setCard("webinar", { url: v })}
              placeholder="Registration link (Zoom, Meet, landing page…)"
              className="text-[11px] text-white/70"
            />
          </div>
        </div>

        {/* Tip */}
        <div className="col-span-1 flex min-h-[180px] flex-col justify-between rounded-[20px] bg-[#C6F24C] p-5">
          <span className="text-[11px] font-bold uppercase tracking-wide text-shop-heading/70">
            Community Tip
          </span>
          <InlineText
            value={tip.text}
            onChange={(v) => setCard("tip", { text: v })}
            placeholder="Share a tip"
            multiline
            className="text-[13.5px] font-semibold leading-[20px] text-shop-heading"
          />
        </div>

        {/* Challenge */}
        <div className="col-span-1 flex min-h-[180px] flex-col justify-between rounded-[20px] bg-[#FF6A45] p-5">
          <span className="w-fit rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">
            Challenge of the Week
          </span>
          <InlineText
            value={ch.text}
            onChange={(v) => setCard("challenge", { text: v })}
            placeholder="Challenge details"
            multiline
            className="text-[13px] font-semibold leading-[20px] text-white"
          />
          <InlineText
            value={ch.buttonText}
            onChange={(v) => setCard("challenge", { buttonText: v })}
            placeholder="Button text"
            className="w-fit rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-shop-heading"
          />
          <InlineText
            value={ch.buttonUrl}
            onChange={(v) => setCard("challenge", { buttonUrl: v })}
            placeholder="Button link (optional — defaults to /shop)"
            className="text-[11px] text-white/80"
          />
        </div>

        {/* Announcement */}
        <div className="col-span-1 flex min-h-[180px] flex-col justify-between rounded-[20px] bg-shop-accent-2 p-5">
          <span className="w-fit rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">
            Announcement
          </span>
          <div className="flex flex-col gap-1">
            <InlineText
              value={ann.text}
              onChange={(v) => setCard("announcement", { text: v })}
              placeholder="Announcement text"
              multiline
              className="text-[13px] font-semibold leading-[20px] text-white"
            />
            <InlineText
              value={ann.date}
              onChange={(v) => setCard("announcement", { date: v })}
              placeholder="Date"
              className="text-[11px] text-white/60"
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export default function HomepageEditor() {
  const showToast = useToast();
  const { data: cms, isLoading } = useGetHomepageCmsQuery();
  const [saveHomepageCms, { isLoading: isSaving }] = useSaveHomepageCmsMutation();

  // Only overrides are persisted server-side — deep-merge onto the code defaults so
  // sections the admin has never touched still render with their live homepage copy.
  const mergedContent = { ...homepageContentDefaults, ...(cms?.content ?? {}) };
  const mergedVisibility = {
    ...sectionVisibilityDefaults,
    ...(cms?.sectionVisibility ?? {}),
  };

  const mergedCommunity = {
    ...communitySectionDefaults,
    ...(cms?.community ?? {}),
  };

  const [draft, setDraft] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [community, setCommunity] = useState(null);
  const ready = draft !== null;

  // Seed local editing state once the server payload has arrived.
  useEffect(() => {
    if (draft === null && cms) {
      setDraft(JSON.parse(JSON.stringify(mergedContent)));
      setVisibility({ ...mergedVisibility });
      setCommunity(JSON.parse(JSON.stringify(mergedCommunity)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cms]);

  const updateSection = (key, patch) => {
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const updateCommunity = (patch) => {
    setCommunity((prev) => ({ ...prev, ...patch }));
  };

  const toggleVisible = (...keys) => {
    setVisibility((prev) => {
      const next = { ...prev };
      const turningOn = !prev[keys[0]];
      for (const key of keys) next[key] = turningOn;
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await saveHomepageCms({
        content: draft,
        sectionVisibility: visibility,
        community,
      }).unwrap();
      showToast("Homepage content saved");
    } catch {
      showToast("Could not save homepage content");
    }
  };

  if (isLoading || !ready) {
    return (
      <div className="flex items-center justify-center px-4 py-16 lg:px-8">
        <Loader2 className="h-5 w-5 animate-spin text-shop-accent-1" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-4 lg:px-8">
      <HeroEditor
        data={draft.hero}
        onChange={(patch) => updateSection("hero", patch)}
        visible={visibility.hero}
        onToggleVisible={() => toggleVisible("hero")}
      />
      <ThreeBannerEditor
        data={draft.threeBannerRow}
        onChange={(patch) => updateSection("threeBannerRow", patch)}
        visible={visibility.threeBannerRow}
        onToggleVisible={() => toggleVisible("threeBannerRow")}
      />
      <DealOfWeekEditor
        deal={draft.dealOfWeek}
        featured={draft.featuredProducts}
        onDealChange={(patch) => updateSection("dealOfWeek", patch)}
        onFeaturedChange={(patch) => updateSection("featuredProducts", patch)}
        visible={visibility.dealOfWeek}
        onToggleVisible={() => toggleVisible("dealOfWeek", "featuredProducts")}
      />
      <TwoBannerEditor
        data={draft.twoBannerRow}
        onChange={(patch) => updateSection("twoBannerRow", patch)}
        visible={visibility.twoBannerRow}
        onToggleVisible={() => toggleVisible("twoBannerRow")}
      />
      <OneBannerEditor
        data={draft.oneBannerRow}
        onChange={(patch) => updateSection("oneBannerRow", patch)}
        visible={visibility.oneBannerRow}
        onToggleVisible={() => toggleVisible("oneBannerRow")}
      />
      <ReviewsEditor
        data={draft.reviews}
        onChange={(patch) => updateSection("reviews", patch)}
        visible={visibility.reviews}
        onToggleVisible={() => toggleVisible("reviews")}
      />
      <MerchantOfWeekEditor
        data={draft.merchantOfWeek || { merchantId: "", note: "" }}
        onChange={(patch) => updateSection("merchantOfWeek", patch)}
        visible={visibility.merchantOfWeek}
        onToggleVisible={() => toggleVisible("merchantOfWeek")}
      />
      <CommunityEditor
        data={community}
        onChange={updateCommunity}
        visible={visibility.community !== false}
        onToggleVisible={() =>
          setVisibility((prev) => ({
            ...prev,
            community: prev.community === false ? true : false,
          }))
        }
      />

      <div className="sticky bottom-4 z-30 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-full bg-shop-accent-1 px-6 py-3 text-[13px] font-semibold text-white shadow-lg hover:bg-shop-accent-1-dark disabled:opacity-60"
        >
          {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
