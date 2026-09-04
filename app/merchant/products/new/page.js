"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  PRODUCT_CATEGORIES,
  PROCESSING_TIME_OPTIONS,
  PARTNER_PROGRAM_MIN_PROFIT,
} from "@/lib/merchant-data";
import { useMediaUpload } from "@/lib/api/mediaApi";
import { useCreateMerchantProductMutation } from "@/lib/api/merchantApi";
import { errorMessage } from "@/lib/api/errorMessage";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import VarietyRow, { newVariety } from "@/app/Components/Merchant/VarietyRow";

const MAX_IMAGES = 4;

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
  const showToast = useToast();
  const [createProduct, { isLoading: submitting }] =
    useCreateMerchantProductMutation();
  const { upload: uploadProductImage, uploading: imageUploading } =
    useMediaUpload("products");
  const { upload: uploadProductFile, uploading: fileUploading } =
    useMediaUpload("products");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0].slug);
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

  // variable products: one option dimension + its varieties
  const [optionName, setOptionName] = useState("");
  const [varieties, setVarieties] = useState([newVariety(), newVariety()]);

  const [bundleItems, setBundleItems] = useState([]);
  const [bundleItemTitle, setBundleItemTitle] = useState("");
  const [bundleItemImage, setBundleItemImage] = useState(null);

  const [offerCommission, setOfferCommission] = useState(false);
  const [partnerProfitAmount, setPartnerProfitAmount] = useState("");
  const [hideStock, setHideStock] = useState(false);
  const [backInStockAlerts, setBackInStockAlerts] = useState(true);

  // Digital products skip the Simple/Variable/Group distinction entirely.
  useEffect(() => {
    if (deliveryType === "digital") setProductType("simple");
  }, [deliveryType]);

  const handleImageChange = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await uploadProductImage(file);
    if (!url) {
      showToast("Image upload failed");
      return;
    }
    setImages((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await uploadProductFile(file, { image: false });
    if (url) setVideo(url);
    else showToast("Video upload failed");
  };

  const handleDigitalFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await uploadProductFile(file, { image: false });
    if (url) setDigitalFile(url);
    else showToast("File upload failed");
  };

  const handleBundleItemImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await uploadProductImage(file);
    if (url) setBundleItemImage(url);
    else showToast("Image upload failed");
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

  const removeBundleItem = (id) =>
    setBundleItems((prev) => prev.filter((b) => b.id !== id));

  const updateVariety = (key, patch) =>
    setVarieties((v) => v.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  const addVariety = () => setVarieties((v) => [...v, newVariety()]);
  const removeVariety = (key) =>
    setVarieties((v) => (v.length > 1 ? v.filter((r) => r.key !== key) : v));

  const cleanVarieties = varieties.filter((v) => v.label.trim());
  const varietiesValid =
    cleanVarieties.length >= 1 &&
    cleanVarieties.every((v) => Number(v.price) > 0 && v.stock !== "");

  const partnerRateValid =
    !offerCommission ||
    (partnerProfitAmount &&
      Number(partnerProfitAmount) >= PARTNER_PROGRAM_MIN_PROFIT);

  const previewPrice = hasVariants
    ? Math.min(...(cleanVarieties.map((v) => Number(v.price) || Infinity), Infinity))
    : Number(price) || 0;

  const isValid = isGroup
    ? title.trim().length > 0 && bundleItems.length >= 2 && price && stock !== ""
    : hasVariants
      ? title.trim().length > 0 &&
        optionName.trim().length > 0 &&
        varietiesValid &&
        partnerRateValid
      : title.trim().length > 0 &&
        price &&
        (deliveryType === "digital" || stock !== "") &&
        partnerRateValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    const body = {
      title: title.trim(),
      description: description.trim(),
      category,
      deliveryType,
      digitalFileUrl: deliveryType === "digital" ? digitalFile : undefined,
      processingTime: deliveryType === "digital" ? "same_day" : processingTime,
      images: images.filter(Boolean),
      productType,
      price: hasVariants ? previewPrice : Number(price),
      stock: deliveryType === "digital" ? undefined : hasVariants ? undefined : Number(stock),
      hideStock: isGroup ? false : hideStock,
      backInStockAlerts: isGroup ? false : backInStockAlerts,
      offerCommission: isGroup ? false : offerCommission,
      partnerProfitAmount:
        !isGroup && offerCommission ? Number(partnerProfitAmount) : undefined,
    };

    if (hasVariants) {
      body.optionName = optionName.trim();
      body.variants = cleanVarieties.map((v) => ({
        label: v.label.trim(),
        price: Number(v.price),
        stock: Number(v.stock || 0),
        image: v.image || null,
      }));
    }
    if (isGroup) {
      body.groupItems = bundleItems.map((b) => ({ title: b.title, image: b.image }));
    }

    try {
      await createProduct(body).unwrap();
      showToast(`${title.trim()} submitted for admin review`);
      router.push("/merchant/products");
    } catch (err) {
      showToast(errorMessage(err));
    }
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
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
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
          ) : null}
          {deliveryType === "digital" ? (
            <p className="text-[11px] text-shop-text/60">
              Any file type is accepted — PDF, ZIP, MP3, video, or anything else buyers need.
            </p>
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

        {/* Media — not shown for digital products */}
        {deliveryType !== "digital" && (
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] font-semibold text-shop-heading">Product Photos</p>
            <p className="text-[11.5px] text-shop-text">
              Add a few angles — shoppers convert better when they can see the product clearly.
              {hasVariants && " Each variety can also carry its own photo below."}
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                <label
                  key={i}
                  className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-shop-border bg-shop-bg"
                >
                  {images[i] ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
        )}

        {/* Product type — not shown for digital */}
        {deliveryType !== "digital" && (
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] font-semibold text-shop-heading">Product type</p>
            <p className="text-[11.5px] text-shop-text">
              Choose how this product is sold — as-is, with options like colour or size, or as a
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
                description="e.g. colour, size — each variety priced and stocked separately."
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
        )}

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
                          // eslint-disable-next-line @next/next/no-img-element
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
                    // eslint-disable-next-line @next/next/no-img-element
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
        ) : hasVariants ? (
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-shop-heading">
                What do the varieties differ by?
              </span>
              <input
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
                placeholder="e.g. Colour, Size, Length, Flavour"
                className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
              />
            </label>

            <div className="flex flex-col gap-2.5">
              <p className="text-[13px] font-semibold text-shop-heading">
                Varieties ({cleanVarieties.length})
              </p>
              <p className="text-[11px] text-shop-text/60">
                Each variety has its own price, stock count and (optionally) photo — shoppers pick one before adding to cart.
              </p>
              {varieties.map((v) => (
                <VarietyRow
                  key={v.key}
                  value={v}
                  onChange={(patch) => updateVariety(v.key, patch)}
                  onRemove={() => removeVariety(v.key)}
                  canRemove={varieties.length > 1}
                />
              ))}
              <button
                type="button"
                onClick={addVariety}
                className="flex w-fit items-center gap-1.5 text-[12.5px] font-semibold text-shop-accent-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add another variety
              </button>
            </div>
          </div>
        ) : (
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
            {deliveryType !== "digital" && (
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
            )}
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
              <p className="rounded-[8px] bg-emerald-50 px-3 py-2 text-[11.5px] leading-[16px] text-emerald-800">
                💡 The more profit you offer, the more partners will pick up your
                product — a higher rate is the fastest way to attract top
                partners and move stock.
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
                  {partnerProfitAmount && partnerRateValid && previewPrice > 0 && Number.isFinite(previewPrice) && (
                    <p className="rounded-[8px] bg-shop-bg p-3 text-[11.5px] leading-[17px] text-shop-text">
                      Customers still see <span className="font-semibold text-shop-heading">{formatPrice(previewPrice)}</span>.
                      Partners will see a partner price of{" "}
                      <span className="font-semibold text-shop-heading">
                        {formatPrice(previewPrice - Number(partnerProfitAmount))}
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

            {/* Stock visibility + restock alerts — not applicable to digital */}
            {deliveryType !== "digital" && (
              <div className="flex flex-col gap-2.5">
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
                <label className="flex items-center justify-between rounded-[10px] border border-shop-border p-3.5">
                  <span className="flex flex-col">
                    <span className="text-[13px] font-medium text-shop-heading">
                      Let shoppers ask for a back-in-stock email
                    </span>
                    <span className="text-[11px] text-shop-text/60">
                      When it sells out, shoppers can opt in and we email them the moment you restock.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={backInStockAlerts}
                    onChange={(e) => setBackInStockAlerts(e.target.checked)}
                    className="h-4.5 w-4.5 accent-[#6d28d9]"
                  />
                </label>
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={!isValid || submitting || imageUploading || fileUploading}
          className="rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
        >
          {imageUploading || fileUploading ? "Uploading…" : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}
