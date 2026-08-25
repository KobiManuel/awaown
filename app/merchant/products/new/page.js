"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Camera,
  Video,
  X,
  Plus,
  Trash2,
  Package,
  Layers,
  Boxes,
  Users2,
  FileDown,
  Truck,
} from "lucide-react";
import {
  formatPrice,
  PRODUCT_CATEGORY_GROUPS,
  PROCESSING_TIME_OPTIONS,
  PARTNER_PROGRAM_MIN_PROFIT,
} from "@/lib/merchant-data";
import { readFileAsDataURL, readImageAsCompressedDataURL } from "@/lib/file-utils";
import { addProduct } from "@/lib/store/merchantSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const MAX_IMAGES = 4;

function buildVariants(optionGroups, previous) {
  const groups = optionGroups
    .filter((g) => g.name.trim() && g.valuesText.trim())
    .map((g) => ({
      name: g.name.trim(),
      values: [...new Set(g.valuesText.split(",").map((v) => v.trim()).filter(Boolean))],
    }));
  if (groups.length === 0) {
    // Keep a price/stock row visible even before any option is named, so
    // merchants see up front that pricing is still required here — same as
    // the simple-product and bundle views.
    const existing = previous.find((v) => v.id === "default");
    return [existing || { id: "default", label: "Default", price: "", stock: "" }];
  }

  const combos = groups.reduce(
    (acc, group) => acc.flatMap((combo) => group.values.map((value) => ({ ...combo, [group.name]: value }))),
    [{}],
  );

  return combos.map((combo) => {
    const label = Object.values(combo).join(" / ");
    const existing = previous.find((v) => v.label === label);
    return existing || { id: label, label, price: "", stock: "" };
  });
}

const TypeCard = ({ selected, onClick, icon: Icon, title, description }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-1 flex-col gap-2 rounded-[14px] border p-4 text-left transition-colors ${
      selected ? "border-shop-accent-1 bg-shop-accent-1-light" : "border-shop-border bg-white"
    }`}
  >
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full ${
        selected ? "bg-white" : "bg-shop-bg"
      }`}
    >
      <Icon className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
    </div>
    <p className="text-[13.5px] font-semibold text-shop-heading">{title}</p>
    <p className="text-[11.5px] leading-[16px] text-shop-text">{description}</p>
  </button>
);

export default function NewMerchantProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const showToast = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(PRODUCT_CATEGORY_GROUPS[0].items[0].slug);
  const [deliveryType, setDeliveryType] = useState("physical"); // physical | digital
  const [processingTime, setProcessingTime] = useState(PROCESSING_TIME_OPTIONS[1].id);
  const [digitalFile, setDigitalFile] = useState(null);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const [productType, setProductType] = useState("simple"); // simple | variable | group
  const hasVariants = productType === "variable";
  const isGroup = productType === "group";
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [optionGroups, setOptionGroups] = useState([{ name: "", valuesText: "" }]);
  const [variants, setVariants] = useState([]);
  const [bulkPrice, setBulkPrice] = useState("");

  const [bundleItems, setBundleItems] = useState([]);
  const [bundleItemTitle, setBundleItemTitle] = useState("");
  const [bundleItemImage, setBundleItemImage] = useState(null);

  const [offerCommission, setOfferCommission] = useState(false);
  const [partnerProfitAmount, setPartnerProfitAmount] = useState("");
  const [hideStock, setHideStock] = useState(false);

  useEffect(() => {
    if (!hasVariants) return;
    setVariants((prev) => buildVariants(optionGroups, prev));
  }, [optionGroups, hasVariants]);

  const handleImageChange = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readImageAsCompressedDataURL(file);
    setImages((prev) => {
      const next = [...prev];
      next[index] = dataUrl;
      return next;
    });
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideo(await readFileAsDataURL(file));
  };

  const handleDigitalFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDigitalFile(await readFileAsDataURL(file));
  };

  const handleBundleItemImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBundleItemImage(await readImageAsCompressedDataURL(file));
  };

  const addBundleItem = () => {
    if (!bundleItemTitle.trim()) return;
    setBundleItems((prev) => [
      ...prev,
      { id: `bi-${Date.now()}`, title: bundleItemTitle.trim(), image: bundleItemImage },
    ]);
    setBundleItemTitle("");
    setBundleItemImage(null);
  };

  const removeBundleItem = (id) => setBundleItems((prev) => prev.filter((b) => b.id !== id));

  const addOptionGroup = () => setOptionGroups((g) => [...g, { name: "", valuesText: "" }]);
  const removeOptionGroup = (index) =>
    setOptionGroups((g) => g.filter((_, i) => i !== index));
  const updateOptionGroup = (index, field, value) =>
    setOptionGroups((g) => g.map((grp, i) => (i === index ? { ...grp, [field]: value } : grp)));

  const updateVariant = (id, field, value) =>
    setVariants((v) => v.map((row) => (row.id === id ? { ...row, [field]: value } : row)));

  const applyBulkPrice = () => {
    if (!bulkPrice) return;
    setVariants((v) => v.map((row) => ({ ...row, price: bulkPrice })));
  };

  const minPriceForPreview = hasVariants
    ? Math.min(...variants.map((v) => Number(v.price) || Infinity).filter((n) => n !== Infinity), Infinity)
    : Number(price) || 0;

  const partnerRateValid =
    !offerCommission || (partnerProfitAmount && Number(partnerProfitAmount) >= PARTNER_PROGRAM_MIN_PROFIT);

  const isValid = isGroup
    ? title.trim().length > 0 && bundleItems.length >= 2 && price && stock !== ""
    : title.trim().length > 0 &&
      (hasVariants
        ? variants.length > 0 && variants.every((v) => v.price && v.stock !== "")
        : price && stock !== "") &&
      partnerRateValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    dispatch(
      addProduct({
        id: `mp-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        category,
        deliveryType,
        digitalFile: deliveryType === "digital" ? digitalFile : null,
        processingTime: deliveryType === "digital" ? "same_day" : processingTime,
        images: images.filter(Boolean),
        video,
        productType,
        hasVariants,
        price: isGroup
          ? Number(price)
          : hasVariants
            ? (Number.isFinite(minPriceForPreview) ? minPriceForPreview : 0)
            : Number(price),
        stock: isGroup ? Number(stock) : hasVariants ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) : Number(stock),
        variants: hasVariants
          ? variants.map((v) => ({ id: v.id, label: v.label, price: Number(v.price), stock: Number(v.stock) }))
          : [],
        groupItems: isGroup ? bundleItems : [],
        status: "active",
        approvalStatus: "pending",
        offerCommission: isGroup ? false : offerCommission,
        partnerProfitAmount: !isGroup && offerCommission ? Number(partnerProfitAmount) : null,
        hideStock: isGroup ? false : hideStock,
      }),
    );
    showToast(`${title.trim()} submitted for admin review`);
    router.push("/merchant/products");
  };

  return (
    <div className="flex flex-col gap-6 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Add Product" backHref="/merchant/products" showBackOnDesktop />

      <form onSubmit={handleSubmit} className="product-form flex flex-col gap-6 px-4 lg:px-0">
        {/* Basic info */}
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-shop-heading">Product Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ankara Print Maxi Dress"
              className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-shop-heading">
              Description <span className="font-normal text-shop-text">(optional)</span>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell shoppers what makes this product great"
              className="resize-none rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-shop-heading">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
            >
              {PRODUCT_CATEGORY_GROUPS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        </div>

        {/* Delivery type */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-shop-heading">How is this delivered?</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TypeCard
              selected={deliveryType === "physical"}
              onClick={() => setDeliveryType("physical")}
              icon={Truck}
              title="Physical Product"
              description="Shipped to the buyer — set a processing time below."
            />
            <TypeCard
              selected={deliveryType === "digital"}
              onClick={() => setDeliveryType("digital")}
              icon={FileDown}
              title="Digital Product"
              description="A file or access link delivered instantly, no shipping."
            />
          </div>
          {deliveryType === "digital" ? (
            <label className="relative flex h-16 w-full items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-shop-border bg-shop-bg">
              {digitalFile ? (
                <span className="flex items-center gap-2 text-[12.5px] font-medium text-shop-heading">
                  <FileDown className="h-4 w-4 text-shop-accent-1" />
                  File attached
                </span>
              ) : (
                <span className="flex items-center gap-2 text-[12px] text-shop-text/60">
                  <FileDown className="h-4 w-4" />
                  Upload the file buyers receive after purchase
                </span>
              )}
              <input type="file" className="hidden" onChange={handleDigitalFileChange} />
            </label>
          ) : (
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-shop-heading">Processing Time</span>
              <select
                value={processingTime}
                onChange={(e) => setProcessingTime(e.target.value)}
                className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
              >
                {PROCESSING_TIME_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {/* Media */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-shop-heading">Product Photos</p>
          <p className="text-[11.5px] text-shop-text">
            Add a few angles — shoppers convert better when they can see the product clearly.
          </p>
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: MAX_IMAGES }).map((_, i) => (
              <label
                key={i}
                className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-shop-border bg-shop-bg"
              >
                {images[i] ? (
                  <>
                    <img src={images[i]} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setImages((prev) => prev.map((img, idx) => (idx === i ? null : img)));
                      }}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <Camera className="h-5 w-5 text-shop-text/40" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, i)}
                />
              </label>
            ))}
          </div>

          <p className="mt-1 text-[13px] font-semibold text-shop-heading">
            Product Video <span className="font-normal text-shop-text">(optional)</span>
          </p>
          <label className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-shop-border bg-shop-bg">
            {video ? (
              <>
                <video src={video} className="h-full w-full object-cover" muted />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setVideo(null);
                  }}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <span className="flex flex-col items-center gap-1.5 text-shop-text/60">
                <Video className="h-5 w-5" />
                <span className="text-[11.5px]">Tap to upload a short video</span>
              </span>
            )}
            <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
          </label>
        </div>

        {/* Product type */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-shop-heading">Product type</p>
          <p className="text-[11.5px] text-shop-text">
            Choose how this product is sold — as-is, with color/size options, or as a
            bundle of items sold together.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TypeCard
              selected={productType === "simple"}
              onClick={() => setProductType("simple")}
              icon={Package}
              title="Simple product"
              description="Sold as-is, with one price and one stock number."
            />
            <TypeCard
              selected={productType === "variable"}
              onClick={() => setProductType("variable")}
              icon={Layers}
              title={'Variable Product ("has options")'}
              description="e.g. color, size — priced separately."
            />
            <TypeCard
              selected={isGroup}
              onClick={() => setProductType("group")}
              icon={Boxes}
              title="Group product"
              description="A bundle of items sold together as one listing."
            />
          </div>
        </div>

        {isGroup ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 rounded-[10px] bg-shop-bg p-3.5 text-[11.5px] leading-[17px] text-shop-text">
              <p><span className="font-semibold text-shop-heading">Step 1.</span> Add each item that&apos;s included in this bundle below.</p>
              <p><span className="font-semibold text-shop-heading">Step 2.</span> Set one price and one stock count for the whole bundle.</p>
              <p><span className="font-semibold text-shop-heading">Step 3.</span> Publish — shoppers buy the bundle as a single listing, not the items separately.</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="text-[13px] font-semibold text-shop-heading">
                Items in this bundle ({bundleItems.length})
              </p>
              {bundleItems.length > 0 && (
                <div className="flex flex-col gap-2">
                  {bundleItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-[10px] border border-shop-border p-2.5">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-shop-bg">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-4.5 w-4.5 text-shop-text/40" />
                        )}
                      </div>
                      <span className="flex-1 text-[12.5px] font-medium text-shop-heading">{item.title}</span>
                      <button
                        type="button"
                        onClick={() => removeBundleItem(item.id)}
                        aria-label="Remove item"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-shop-text/50 hover:bg-shop-bg hover:text-shop-accent-3"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2">
                <label className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-dashed border-shop-border bg-shop-bg">
                  {bundleItemImage ? (
                    <img src={bundleItemImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-4 w-4 text-shop-text/40" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleBundleItemImageChange} />
                </label>
                <input
                  value={bundleItemTitle}
                  onChange={(e) => setBundleItemTitle(e.target.value)}
                  placeholder="Item name, e.g. Matching Headwrap"
                  className="flex-1 rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
                />
                <button
                  type="button"
                  onClick={addBundleItem}
                  disabled={!bundleItemTitle.trim()}
                  className="flex h-10 shrink-0 items-center gap-1 rounded-[8px] bg-shop-accent-1 px-3 text-[12.5px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
              {bundleItems.length < 2 && (
                <p className="text-[11px] text-shop-text/60">Add at least 2 items to publish this bundle.</p>
              )}
            </div>

            <div className="flex gap-3">
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-shop-heading">Bundle Price (₦)</span>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  placeholder="e.g. 25000"
                  className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-shop-heading">Bundle Stock</span>
                <input
                  value={stock}
                  onChange={(e) => setStock(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  placeholder="e.g. 10"
                  className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
                />
              </label>
            </div>
          </div>
        ) : !hasVariants ? (
          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-shop-heading">Price (₦)</span>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                placeholder="15000"
                className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-shop-heading">Stock</span>
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                placeholder="24"
                className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              {optionGroups.map((group, i) => (
                <div key={i} className="flex items-end gap-2">
                  <label className="flex w-28 shrink-0 flex-col gap-1.5">
                    <span className="text-[11.5px] font-semibold text-shop-heading">
                      Option Name
                    </span>
                    <input
                      value={group.name}
                      onChange={(e) => updateOptionGroup(i, "name", e.target.value)}
                      placeholder="Color"
                      className="rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
                    />
                  </label>
                  <label className="flex flex-1 flex-col gap-1.5">
                    <span className="text-[11.5px] font-semibold text-shop-heading">
                      Values (comma separated)
                    </span>
                    <input
                      value={group.valuesText}
                      onChange={(e) => updateOptionGroup(i, "valuesText", e.target.value)}
                      placeholder="Black, Brown, White"
                      className="rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
                    />
                  </label>
                  {optionGroups.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOptionGroup(i)}
                      aria-label="Remove option"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] text-shop-text/50 hover:bg-shop-bg hover:text-shop-accent-3"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <p className="text-[11px] text-shop-text/60">
                e.g. Colour, Size, Height, Variety — each becomes a separate option shoppers pick from.
              </p>
              <button
                type="button"
                onClick={addOptionGroup}
                className="flex w-fit items-center gap-1.5 text-[12.5px] font-semibold text-shop-accent-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add another option
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-shop-heading">
                    {variants.length === 1 && variants[0].id === "default"
                      ? "Pricing"
                      : `Pricing (${variants.length} options)`}
                  </p>
                </div>
                {variants.length === 1 && variants[0].id === "default" && (
                  <p className="text-[11px] text-shop-text/60">
                    Add an option name and values above to price each option separately —
                    until then, set a single price and stock below.
                  </p>
                )}
                <div className="flex items-center gap-2 rounded-[10px] bg-shop-bg p-2.5">
                  <span className="text-[11.5px] text-shop-text">Set the same price for all:</span>
                  <input
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    placeholder="₦"
                    className="w-24 rounded-[6px] border border-shop-border bg-white px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
                  />
                  <button
                    type="button"
                    onClick={applyBulkPrice}
                    className="rounded-[6px] bg-shop-accent-1 px-3 py-1.5 text-[11.5px] font-semibold text-white"
                  >
                    Apply to All
                  </button>
                </div>
                <div className="hidden items-center gap-2 px-2.5 sm:flex">
                  <span className="flex-1 text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
                    Option
                  </span>
                  <span className="w-28 text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
                    Price (₦)
                  </span>
                  <span className="w-24 text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
                    Stock
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex flex-col gap-2 rounded-[10px] border border-shop-border p-2.5 sm:flex-row sm:items-center"
                    >
                      <span className="text-[12.5px] font-medium text-shop-heading sm:flex-1">
                        {v.label}
                      </span>
                      <div className="flex gap-2">
                        <div className="flex flex-1 flex-col gap-1 sm:w-28 sm:flex-none">
                          <span className="text-[10px] font-medium uppercase tracking-wide text-shop-text/50 sm:hidden">
                            Price (₦)
                          </span>
                          <input
                            value={v.price}
                            onChange={(e) => updateVariant(v.id, "price", e.target.value.replace(/[^0-9]/g, ""))}
                            inputMode="numeric"
                            placeholder="e.g. 15000"
                            aria-label="Price (₦)"
                            className="w-full rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-1 sm:w-24 sm:flex-none">
                          <span className="text-[10px] font-medium uppercase tracking-wide text-shop-text/50 sm:hidden">
                            Items in Stock
                          </span>
                          <input
                            value={v.stock}
                            onChange={(e) => updateVariant(v.id, "stock", e.target.value.replace(/[^0-9]/g, ""))}
                            inputMode="numeric"
                            placeholder="e.g. 10"
                            aria-label="Number of items in stock"
                            className="w-full rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        )}

        {!isGroup && (
          <>
            {/* Partner enrollment */}
            <div className="flex flex-col gap-2.5">
              <p className="text-[13px] font-semibold text-shop-heading">
                Enroll this product in the Partner Program?
              </p>
              <p className="text-[11.5px] text-shop-text">
                Partners can promote this product and earn a profit you choose. Customers still
                see your normal price.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <TypeCard
                  selected={!offerCommission}
                  onClick={() => setOfferCommission(false)}
                  icon={Users2}
                  title="No"
                  description="Keep this product off the Partner Program."
                />
                <TypeCard
                  selected={offerCommission}
                  onClick={() => setOfferCommission(true)}
                  icon={Users2}
                  title="Yes"
                  description="Let Partners promote it and earn a profit."
                />
              </div>
              {offerCommission && (
                <div className="flex flex-col gap-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-semibold text-shop-heading">
                      How much do you want to give partners? (min {formatPrice(PARTNER_PROGRAM_MIN_PROFIT)})
                    </span>
                    <input
                      value={partnerProfitAmount}
                      onChange={(e) => setPartnerProfitAmount(e.target.value.replace(/[^0-9]/g, ""))}
                      inputMode="numeric"
                      placeholder="2500"
                      className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
                    />
                  </label>
                  {partnerProfitAmount && !partnerRateValid && (
                    <p className="text-[11.5px] text-shop-accent-3">
                      The minimum Partner Program profit is {formatPrice(PARTNER_PROGRAM_MIN_PROFIT)}.
                    </p>
                  )}
                  {partnerProfitAmount && partnerRateValid && Number.isFinite(minPriceForPreview) && minPriceForPreview > 0 && (
                    <p className="rounded-[8px] bg-shop-bg p-3 text-[11.5px] leading-[17px] text-shop-text">
                      Customers still see <span className="font-semibold text-shop-heading">{formatPrice(minPriceForPreview)}</span>.
                      Partners will see a partner price of{" "}
                      <span className="font-semibold text-shop-heading">
                        {formatPrice(minPriceForPreview - Number(partnerProfitAmount))}
                      </span>{" "}
                      and earn up to{" "}
                      <span className="font-semibold text-emerald-600">
                        {formatPrice(Number(partnerProfitAmount))}
                      </span>{" "}
                      in profit for promoting it.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Stock visibility */}
            <label className="flex items-center justify-between rounded-[10px] border border-shop-border p-3.5">
              <span className="text-[13px] font-medium text-shop-heading">
                Hide stock count from shoppers
              </span>
              <input
                type="checkbox"
                checked={hideStock}
                onChange={(e) => setHideStock(e.target.checked)}
                className="h-4.5 w-4.5 accent-[#6d28d9]"
              />
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={!isValid}
          className="rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
        >
          Submit for Review
        </button>
      </form>
    </div>
  );
}
