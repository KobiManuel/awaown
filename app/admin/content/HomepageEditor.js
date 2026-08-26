"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { ImagePlus, Plus, Trash2, Quote } from "lucide-react";
import { saveHomepageContent } from "@/lib/store/adminSlice";
import { readImageAsCompressedDataURL } from "@/lib/file-utils";
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
    if (multiline) {
      return (
        <textarea
          autoFocus
          rows={3}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={commit}
          className={`${className} w-full resize-none rounded-[4px] border border-shop-accent-1 bg-white px-1.5 py-1 text-shop-heading outline-none`}
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
        className={`${className} w-full rounded-[4px] border border-shop-accent-1 bg-white px-1.5 py-1 text-shop-heading outline-none`}
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

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readImageAsCompressedDataURL(file);
    onPick(dataUrl);
    showToast("Image updated");
    e.target.value = "";
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={label}
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
      >
        <ImagePlus className="h-4 w-4" />
      </button>
    </>
  );
}

function DimensionHint({ text }) {
  return <p className="text-[10.5px] text-shop-text/50">Recommended image size: {text}</p>;
}

function SectionShell({ title, children }) {
  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-shop-border bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-shop-text/50">{title}</p>
      {children}
    </div>
  );
}

function HeroEditor({ data, onChange }) {
  const updateSlide = (i, patch) => {
    onChange({ slides: data.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  };

  return (
    <SectionShell title="Hero Banner">
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

function ThreeBannerEditor({ data, onChange }) {
  const updateBanner = (i, patch) => {
    onChange({ banners: data.banners.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) });
  };

  return (
    <SectionShell title="3-Card Row (right after Hero)">
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

function DealOfWeekEditor({ deal, featured, onDealChange, onFeaturedChange }) {
  return (
    <SectionShell title="Deal of the Week & Featured Products">
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

function TwoBannerEditor({ data, onChange }) {
  const updateBanner = (i, patch) => {
    onChange({ banners: data.banners.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) });
  };

  return (
    <SectionShell title="2-Banner Row (after Deal of the Week / Featured Products)">
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

function OneBannerEditor({ data, onChange }) {
  return (
    <SectionShell title="Banner (right before Reviews)">
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

function ReviewsEditor({ data, onChange }) {
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
    <SectionShell title="Reviews">
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

export default function HomepageEditor() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const homepageContent = useSelector((s) => s.admin.homepageContent);
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(homepageContent)));

  const updateSection = (key, patch) => {
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const handleSave = () => {
    dispatch(saveHomepageContent(draft));
    showToast("Homepage content saved");
  };

  return (
    <div className="flex flex-col gap-4 px-4 pb-4 lg:px-8">
      <HeroEditor data={draft.hero} onChange={(patch) => updateSection("hero", patch)} />
      <ThreeBannerEditor data={draft.threeBannerRow} onChange={(patch) => updateSection("threeBannerRow", patch)} />
      <DealOfWeekEditor
        deal={draft.dealOfWeek}
        featured={draft.featuredProducts}
        onDealChange={(patch) => updateSection("dealOfWeek", patch)}
        onFeaturedChange={(patch) => updateSection("featuredProducts", patch)}
      />
      <TwoBannerEditor data={draft.twoBannerRow} onChange={(patch) => updateSection("twoBannerRow", patch)} />
      <OneBannerEditor data={draft.oneBannerRow} onChange={(patch) => updateSection("oneBannerRow", patch)} />
      <ReviewsEditor data={draft.reviews} onChange={(patch) => updateSection("reviews", patch)} />

      <div className="sticky bottom-4 z-30 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-shop-accent-1 px-6 py-3 text-[13px] font-semibold text-white shadow-lg hover:bg-shop-accent-1-dark"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
