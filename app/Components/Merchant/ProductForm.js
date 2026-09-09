"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Info,
  Loader2,
} from "lucide-react";
import {
  formatPrice,
  PRODUCT_CATEGORIES,
  PROCESSING_TIME_OPTIONS,
  PARTNER_PROGRAM_MIN_PROFIT,
  PARTNER_PLATFORM_FEE_RATE,
  partnerPayoutSuggestion,
} from "@/lib/merchant-data";
import { useMediaUpload } from "@/lib/api/mediaApi";
import { useImageCropUpload } from "@/app/Components/Media/useImageCropUpload";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import VariantAxisEditor, {
  newAxis,
} from "@/app/Components/Merchant/VariantAxisEditor";
import VariantMatrix from "@/app/Components/Merchant/VariantMatrix";
import ImagePickerSlot from "@/app/Components/Merchant/ImagePickerSlot";
import MoneyInput from "@/app/Components/Inputs/MoneyInput";
import {
  VARIANT_TYPE_PRESETS,
  isColorAxis,
  slugValue,
} from "@/lib/variant-options";

const MAX_AXES = 3;

function axisFromApi(ax) {
  const isPreset =
    VARIANT_TYPE_PRESETS.some((t) => t.id === ax.type) && ax.type !== "text";
  return {
    id: `ax-${ax.key || ax.name || Math.random()}`,
    type: isPreset ? ax.type : isColorAxis(ax) ? "color" : "custom",
    name: ax.name || "",
    useImages: !!ax.useImages,
    values: (ax.options || []).map((o) => ({
      label: o.label,
      swatch: o.swatch || null,
      image: o.image || null,
    })),
  };
}

function combosFromApi(variants) {
  const out = {};
  for (const v of variants || []) {
    const ov = v.options || v.optionValues || {};
    if (!Object.keys(ov).length) continue;
    const sig = Object.keys(ov)
      .sort()
      .map((k) => `${k}=${ov[k]}`)
      .join("|");
    out[sig] = {
      price: v.price != null ? String(v.price) : "",
      stock: v.stock != null ? String(v.stock) : "",
      image: v.image || null,
      excluded: false,
    };
  }
  return out;
}

const FIELD =
  "rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1";

const TypeCard = ({ selected, onClick, icon: Icon, title, description }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-1 flex-col gap-2 rounded-[14px] border p-4 text-left transition-colors ${
      selected
        ? "border-shop-accent-1 bg-shop-accent-1-light"
        : "border-shop-border bg-white"
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

function seed(product) {
  if (!product) {
    return {
      title: "",
      description: "",
      category: PRODUCT_CATEGORIES[0].slug,
      deliveryType: "physical",
      processingTime: PROCESSING_TIME_OPTIONS[1].id,
      digitalFile: null,
      images: [],
      video: null,
      productType: "simple",
      price: "",
      stock: "",
      weight: "",
      axes: [newAxis()],
      combos: {},
      bundleItems: [],
      offerCommission: false,
      partnerProfitAmount: "",
      hideStock: false,
      backInStockAlerts: true,
    };
  }
  const type = String(product.productType || "SIMPLE").toLowerCase();
  return {
    title: product.title ?? "",
    description: product.description ?? "",
    category: product.category ?? PRODUCT_CATEGORIES[0].slug,
    deliveryType: product.deliveryType === "DIGITAL" ? "digital" : "physical",
    processingTime: product.processingTime ?? PROCESSING_TIME_OPTIONS[1].id,
    digitalFile: product.digitalFileUrl ?? null,
    images: product.images ?? [],
    video: product.video ?? null,
    productType: type === "group" || type === "variable" ? type : "simple",
    price: product.price ? String(product.price) : "",
    stock: product.stock != null ? String(product.stock) : "",
    weight: product.weightKg != null ? String(product.weightKg) : "",
    axes: product.variantAxes?.length
      ? product.variantAxes.map(axisFromApi)
      : [newAxis()],
    combos: combosFromApi(product.variants),
    bundleItems: (product.groupItems ?? []).map((g, i) => ({
      id: `bi-${i}-${Date.now()}`,
      title: g.title,
      image: g.image ?? null,
    })),
    offerCommission: !!product.offerCommission,
    partnerProfitAmount: product.partnerProfitAmount
      ? String(product.partnerProfitAmount)
      : "",
    hideStock: !!product.hideStock,
    backInStockAlerts: product.backInStockAlerts ?? true,
  };
}

/**
 * The one product form used for both /merchant/products/new and
 * /merchant/products/[id]/edit. The parent handles the API call + navigation
 * via `onSubmit(body, { asDraft })`.
 */
export default function ProductForm({ product = null, submitting, onSubmit }) {
  const showToast = useToast();
  const init = useMemo(() => seed(product), []); // eslint-disable-line

  const {
    pickAndCrop: cropProductImage,
    uploading: imageUploading,
    modal: cropModal,
  } = useImageCropUpload("products");
  const { upload: uploadProductFile, uploading: fileUploading } =
    useMediaUpload("products");

  const [title, setTitle] = useState(init.title);
  const [description, setDescription] = useState(init.description);
  const [category, setCategory] = useState(init.category);
  const [deliveryType, setDeliveryType] = useState(init.deliveryType);
  const [processingTime, setProcessingTime] = useState(init.processingTime);
  const [digitalFile, setDigitalFile] = useState(init.digitalFile);
  const [images, setImages] = useState(init.images);
  const [video, setVideo] = useState(init.video);

  const [productType, setProductType] = useState(init.productType);
  const hasVariants = productType === "variable";
  const isGroup = productType === "group";
  const [price, setPrice] = useState(init.price);
  const [stock, setStock] = useState(init.stock);
  const [weight, setWeight] = useState(init.weight);
  const [uploadingSlot, setUploadingSlot] = useState(null);

  const [axes, setAxes] = useState(init.axes);
  const [combos, setCombos] = useState(init.combos);

  const [bundleItems, setBundleItems] = useState(init.bundleItems);
  const [bundleItemTitle, setBundleItemTitle] = useState("");
  const [bundleItemImage, setBundleItemImage] = useState(null);

  const [offerCommission, setOfferCommission] = useState(init.offerCommission);
  const [partnerProfitAmount, setPartnerProfitAmount] = useState(
    init.partnerProfitAmount,
  );
  const [hideStock, setHideStock] = useState(init.hideStock);
  const [backInStockAlerts, setBackInStockAlerts] = useState(
    init.backInStockAlerts,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (deliveryType === "digital") setProductType("simple");
  }, [deliveryType]);

  // ── images: [0] cover (may be null), [1..] contiguous extras ──────────
  const cover = images[0] ?? null;
  const extras = images.slice(1);

  const cropOne = async (file, slotKey) => {
    setUploadingSlot(slotKey);
    try {
      return await cropProductImage(file, {
        aspect: 1,
        title: "Crop the product photo",
      });
    } finally {
      setUploadingSlot(null);
    }
  };
  const handleCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await cropOne(file, "cover");
    if (url) setImages((prev) => [url, ...prev.slice(1)]);
  };
  const handleExtra = async (e, k) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await cropOne(file, k == null ? "new" : k);
    if (!url) return;
    setImages((prev) => {
      const next = prev.length ? [...prev] : [null];
      if (k == null) next.push(url);
      else next[k + 1] = url;
      return next;
    });
  };
  const removeCover = () => setImages((prev) => [null, ...prev.slice(1)]);
  const removeExtra = (k) =>
    setImages((prev) => prev.filter((_, i) => i !== k + 1));

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

  const updateAxis = (id, patch) =>
    setAxes((list) =>
      list.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );
  const addAxis = () =>
    setAxes((list) => (list.length < MAX_AXES ? [...list, newAxis()] : list));
  const removeAxis = (id) =>
    setAxes((list) => (list.length > 1 ? list.filter((a) => a.id !== id) : list));

  const productImages = images.filter(Boolean);

  // The axes that actually carry values, and the full combination list they
  // generate — shared by the validation checklist and the submit payload.
  const activeAxes = axes.filter(
    (a) => a.name.trim() && a.values.some((v) => v.label.trim()),
  );
  const comboRows = useMemo(() => {
    if (!activeAxes.length) return [];
    let acc = [{}];
    for (const a of activeAxes) {
      const key = slugValue(a.name) || "option";
      const opts = a.values
        .filter((v) => v.label.trim())
        .map((v) => slugValue(v.label) || v.label.trim().toLowerCase());
      const next = [];
      for (const partial of acc)
        for (const val of opts) next.push({ ...partial, [key]: val });
      acc = next;
    }
    return acc.map((ov) => ({
      sig: Object.keys(ov)
        .sort()
        .map((k) => `${k}=${ov[k]}`)
        .join("|"),
      optionValues: ov,
    }));
  }, [axes]); // eslint-disable-line react-hooks/exhaustive-deps

  const partnerRateValid =
    !offerCommission ||
    (partnerProfitAmount &&
      Number(partnerProfitAmount) >= PARTNER_PROGRAM_MIN_PROFIT);

  const basePrice = Number(price) || 0;
  const payoutSuggestion =
    basePrice > 0 ? partnerPayoutSuggestion(basePrice) : null;

  // ── what's blocking "Submit for Review" / "Publish" ──────────────────
  const problems = [];
  if (!title.trim()) problems.push("Add a product title.");
  if (deliveryType !== "digital" && !(basePrice > 0)) {
    problems.push(
      isGroup ? "Set the bundle price." : hasVariants ? "Set the base price." : "Set the price.",
    );
  }
  if (deliveryType !== "digital" && stock === "") {
    problems.push(
      isGroup
        ? "Set the bundle inventory quantity."
        : hasVariants
          ? "Set the base inventory quantity."
          : "Set the inventory quantity.",
    );
  }
  if (deliveryType === "digital" && !(basePrice > 0)) problems.push("Set the price.");
  if (isGroup && bundleItems.length < 2)
    problems.push("A bundle needs at least 2 items.");
  if (hasVariants) {
    if (!activeAxes.length)
      problems.push(
        "Add at least one variant type with values (e.g. Colour → Red, Blue).",
      );
    axes.forEach((a) => {
      if (a.values.some((v) => v.label.trim()) && !a.name.trim())
        problems.push("Give your custom variant type a name.");
    });
    const activeCombos = comboRows.filter((r) => !combos[r.sig]?.excluded);
    if (activeAxes.length && !activeCombos.length)
      problems.push("Keep at least one combination to sell.");
    if (
      activeCombos.some(
        (r) => !((Number(combos[r.sig]?.price) || basePrice) > 0),
      )
    )
      problems.push(
        "Every combination needs a price — set the default price above, or fill each row.",
      );
  }
  if (offerCommission && !partnerRateValid)
    problems.push(
      `Partner profit must be at least ${formatPrice(PARTNER_PROGRAM_MIN_PROFIT)}.`,
    );
  const isValid = problems.length === 0;

  const isCreate = !product;
  const isDraft = isCreate || product.status === "DRAFT";
  const primaryLabel =
    imageUploading || fileUploading
      ? "Uploading…"
      : isCreate
        ? "Submit for Review"
        : isDraft
          ? "Publish"
          : "Save Changes";
  const showDraftBtn = isCreate || isDraft;

  const submit = async (asDraft) => {
    if (submitting) return;
    if (asDraft ? !title.trim() : !isValid) return;

    const body = {
      title: title.trim(),
      description: description.trim(),
      category,
      deliveryType,
      digitalFileUrl: deliveryType === "digital" ? digitalFile : undefined,
      processingTime: deliveryType === "digital" ? "same_day" : processingTime,
      images: images.filter(Boolean),
      productType,
      price: basePrice,
      stock: deliveryType === "digital" ? undefined : Number(stock) || 0,
      hideStock: isGroup ? false : hideStock,
      backInStockAlerts: isGroup ? false : backInStockAlerts,
      offerCommission,
      partnerProfitAmount: offerCommission
        ? Number(partnerProfitAmount)
        : undefined,
      weightKg:
        deliveryType === "digital" || !weight ? undefined : Number(weight),
      // Only touch status on create or when moving a draft. Editing a live
      // product leaves status alone so the re-approval rule can tell an
      // inventory-only change from a real one.
      status: asDraft ? "DRAFT" : isDraft ? "ACTIVE" : undefined,
    };
    if (hasVariants) {
      body.variantAxes = activeAxes.map((a) => ({
        name: a.name.trim(),
        type: a.type,
        useImages: !!a.useImages,
        options: a.values
          .filter((v) => v.label.trim())
          .map((v) => ({
            label: v.label.trim(),
            swatch: a.type === "color" ? v.swatch || undefined : undefined,
            image: a.useImages ? v.image || undefined : undefined,
          })),
      }));
      body.variants = comboRows
        .filter((r) => !combos[r.sig]?.excluded)
        .map((r) => ({
          options: r.optionValues,
          price: Number(combos[r.sig]?.price) || basePrice,
          stock:
            combos[r.sig]?.stock != null && combos[r.sig]?.stock !== ""
              ? Number(combos[r.sig].stock)
              : Number(stock) || 0,
          image: combos[r.sig]?.image || undefined,
        }));
    }
    if (isGroup) {
      body.groupItems = bundleItems.map((b) => ({
        title: b.title,
        image: b.image,
      }));
    }
    await onSubmit(body, { asDraft });
  };

  const pricePlaceholder = hasVariants ? "15,000" : "15,000";

  return (
    <div className="flex flex-col gap-6 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      {cropModal}
      <AppHeader
        title={isCreate ? "Add Product" : "Edit Product"}
        backHref="/merchant/products"
        showBackOnDesktop
      />

      {product?.approvalStatus === "REJECTED" && product.rejectionReason && (
        <p className="mx-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-shop-accent-3 lg:mx-0">
          Rejected: {product.rejectionReason}. Fix it and it will be re-reviewed.
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(false);
        }}
        className="product-form flex flex-col gap-6 px-4 lg:px-0"
      >
        {/* ── Basic info ── */}
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-shop-heading">
              Product Title
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ankara Print Maxi Dress"
              className={FIELD}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-shop-heading">
              Description{" "}
              <span className="font-normal text-shop-text">(optional)</span>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell shoppers what makes this product great"
              className={`${FIELD} resize-none`}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-shop-heading">
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={FIELD}
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* ── Delivery type ── */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-shop-heading">
            How is this delivered?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TypeCard
              selected={deliveryType === "physical"}
              onClick={() => setDeliveryType("physical")}
              icon={Truck}
              title="Physical Product"
              description="Shipped to the buyer. Set a processing time below."
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
            <>
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
                <input
                  type="file"
                  className="hidden"
                  onChange={handleDigitalFileChange}
                />
              </label>
              <p className="text-[11px] text-shop-text/60">
                Any file type is accepted: PDF, ZIP, MP3, video, or anything else
                buyers need.
              </p>
            </>
          ) : (
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-shop-heading">
                Processing Time
              </span>
              <select
                value={processingTime}
                onChange={(e) => setProcessingTime(e.target.value)}
                className={FIELD}
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

        {/* ── Product type ── */}
        {deliveryType !== "digital" && (
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] font-semibold text-shop-heading">
              Product type
            </p>
            <p className="text-[11.5px] text-shop-text">
              Choose how this product is sold: as-is, with options like colour or
              size, or as a bundle of items sold together.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <TypeCard
                selected={productType === "simple"}
                onClick={() => setProductType("simple")}
                icon={Package}
                title="Simple product"
                description="Sold as-is, with one price and one inventory quantity."
              />
              <TypeCard
                selected={productType === "variable"}
                onClick={() => setProductType("variable")}
                icon={Layers}
                title={'Variable Product ("has options")'}
                description="Options like colour or size — each combination priced and stocked on its own."
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

        {/* ── Media (after the type choice) ── */}
        {deliveryType !== "digital" && (
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] font-semibold text-shop-heading">
              Product Photos
            </p>

            <div className="flex items-start gap-2 rounded-[10px] bg-amber-50 p-3 text-[11.5px] leading-[16px] text-amber-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span>
                The <span className="font-semibold">main cover image</span> must
                have a plain white background, for a clean, uniform look across
                the site. Buyers can still see your other background shots on the
                product page.
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-shop-heading">
                Main cover image
              </span>
              <label className="relative flex aspect-square w-full max-w-[180px] items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-shop-border bg-white">
                {cover ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt="Cover"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeCover();
                      }}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <span className="flex flex-col items-center gap-1 text-shop-text/50">
                    <Camera className="h-6 w-6" />
                    <span className="text-[10.5px]">White background</span>
                  </span>
                )}
                {uploadingSlot === "cover" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-white/80 text-[10.5px] font-medium text-shop-text">
                    <Loader2 className="h-5 w-5 animate-spin text-shop-accent-1" />
                    Uploading…
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCover}
                />
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-shop-heading">
                More photos{" "}
                <span className="font-normal text-shop-text/70">
                  (optional, any background — add as many as you need)
                </span>
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {extras.map((src, k) =>
                  src ? (
                    <label
                      key={k}
                      className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-shop-border bg-shop-bg"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Photo ${k + 2}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeExtra(k);
                        }}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {uploadingSlot === k && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                          <Loader2 className="h-4 w-4 animate-spin text-shop-accent-1" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleExtra(e, k)}
                      />
                    </label>
                  ) : null,
                )}

                <label className="relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border-2 border-dashed border-shop-border text-shop-text/50 hover:border-shop-accent-1 hover:text-shop-accent-1">
                  {uploadingSlot === "new" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-shop-accent-1" />
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span className="text-[9.5px] font-medium">Add photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleExtra(e, null)}
                  />
                </label>
              </div>
            </div>

            <p className="mt-1 text-[13px] font-semibold text-shop-heading">
              Product Video{" "}
              <span className="font-normal text-shop-text">(optional)</span>
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
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
              />
            </label>

            <label className="mt-1 flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-shop-heading">
                Weight{" "}
                <span className="font-normal text-shop-text/70">
                  (kg, optional — helps with shipping estimates)
                </span>
              </span>
              <input
                value={weight}
                onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
                inputMode="decimal"
                placeholder="e.g. 0.5"
                className={`w-full max-w-[180px] ${FIELD}`}
              />
            </label>
          </div>
        )}

        {/* ── Pricing / type-specific ── */}
        {isGroup ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 rounded-[10px] bg-shop-bg p-3.5 text-[11.5px] leading-[17px] text-shop-text">
              <p>
                <span className="font-semibold text-shop-heading">Step 1.</span>{" "}
                Add each item that&apos;s included in this bundle below.
              </p>
              <p>
                <span className="font-semibold text-shop-heading">Step 2.</span>{" "}
                Set one price and one inventory quantity for the whole bundle.
              </p>
              <p>
                <span className="font-semibold text-shop-heading">Step 3.</span>{" "}
                Publish. Shoppers buy the bundle as a single listing, not the
                items separately.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="text-[13px] font-semibold text-shop-heading">
                Items in this bundle ({bundleItems.length})
              </p>
              {bundleItems.length > 0 && (
                <div className="flex flex-col gap-2">
                  {bundleItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-[10px] border border-shop-border p-2.5"
                    >
                      <ImagePickerSlot
                        value={item.image}
                        onChange={(url) =>
                          setBundleItems((prev) =>
                            prev.map((b) =>
                              b.id === item.id ? { ...b, image: url } : b,
                            ),
                          )
                        }
                        sources={productImages}
                        size="h-11 w-11"
                        title="Crop the item photo"
                      />
                      <span className="flex-1 text-[12.5px] font-medium text-shop-heading">
                        {item.title}
                      </span>
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
                <ImagePickerSlot
                  value={bundleItemImage}
                  onChange={setBundleItemImage}
                  sources={productImages}
                  size="h-10 w-10"
                  title="Crop the item photo"
                />
                <input
                  value={bundleItemTitle}
                  onChange={(e) => setBundleItemTitle(e.target.value)}
                  placeholder="Item name, e.g. Matching Headwrap"
                  className={`flex-1 ${FIELD}`}
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
                <p className="text-[11px] text-shop-text/60">
                  Add at least 2 items to publish this bundle.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-shop-heading">
                  Bundle Price (₦)
                </span>
                <MoneyInput
                  value={price}
                  onChange={setPrice}
                  placeholder="e.g. 25,000"
                  className={FIELD}
                />
              </label>
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-shop-heading">
                  Bundle inventory quantity
                </span>
                <input
                  value={stock}
                  onChange={(e) => setStock(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  placeholder="e.g. 10"
                  className={FIELD}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-shop-heading">
                  {hasVariants ? "Default price (₦)" : "Price (₦)"}
                </span>
                <MoneyInput
                  value={price}
                  onChange={setPrice}
                  placeholder={pricePlaceholder}
                  className={FIELD}
                />
              </label>
              {deliveryType !== "digital" && (
                <label className="flex flex-1 flex-col gap-1.5">
                  <span className="text-[13px] font-semibold text-shop-heading">
                    {hasVariants
                      ? "Default inventory quantity"
                      : "Inventory quantity"}
                  </span>
                  <input
                    value={stock}
                    onChange={(e) =>
                      setStock(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    inputMode="numeric"
                    placeholder="24"
                    className={FIELD}
                  />
                </label>
              )}
            </div>

            {hasVariants && (
              <>
                <p className="-mt-2 text-[11px] text-shop-text/60">
                  The default price and quantity are this product&apos;s headline
                  numbers — used for the Partner Program and as the starting
                  value for each combination below.
                </p>

                <div className="flex flex-col gap-2.5">
                  <p className="text-[13px] font-semibold text-shop-heading">
                    Variant types
                  </p>
                  <p className="text-[11px] text-shop-text/60">
                    Add what this product varies by — Colour, Size, Material and
                    so on. Every combination of the values you enter becomes a
                    row you can price and stock separately.
                  </p>
                  {axes.map((a) => (
                    <VariantAxisEditor
                      key={a.id}
                      axis={a}
                      onChange={(patch) => updateAxis(a.id, patch)}
                      onRemove={() => removeAxis(a.id)}
                      canRemove={axes.length > 1}
                      productImages={productImages}
                    />
                  ))}
                  {axes.length < MAX_AXES && (
                    <button
                      type="button"
                      onClick={addAxis}
                      className="flex w-fit items-center gap-1.5 text-[12.5px] font-semibold text-shop-accent-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add another variant type
                    </button>
                  )}
                </div>

                <VariantMatrix
                  axes={axes}
                  combos={combos}
                  onChange={setCombos}
                  basePrice={price}
                  productImages={productImages}
                />
              </>
            )}
          </div>
        )}

        {/* Partner enrollment — available for every product type */}
        <>
            <div className="flex flex-col gap-2.5">
              <p className="text-[13px] font-semibold text-shop-heading">
                Enroll this {isGroup ? "bundle" : "product"} in the Partner
                Program?
              </p>
              <p className="text-[11.5px] text-shop-text">
                Partners can promote this product and earn a profit you choose.
                Customers still see your normal price.
              </p>
              <p className="rounded-[8px] bg-emerald-50 px-3 py-2 text-[11.5px] leading-[16px] text-emerald-800">
                💡 The more profit you offer, the more partners will pick up your
                product. A higher rate is the fastest way to attract top partners
                and move stock.
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
                      How much do you want to give partners? (min{" "}
                      {formatPrice(PARTNER_PROGRAM_MIN_PROFIT)})
                    </span>
                    <MoneyInput
                      value={partnerProfitAmount}
                      onChange={setPartnerProfitAmount}
                      placeholder={
                        payoutSuggestion
                          ? String(payoutSuggestion.low)
                          : "2,500"
                      }
                      className={FIELD}
                    />
                  </label>

                  {payoutSuggestion && (
                    <div className="flex flex-col gap-1.5 rounded-[8px] border border-shop-accent-1/30 bg-shop-accent-1-light/50 p-3">
                      <p className="text-[11.5px] leading-[16px] text-shop-heading">
                        For a{" "}
                        <span className="font-semibold">
                          {formatPrice(basePrice)}
                        </span>{" "}
                        {isGroup ? "bundle" : "product"}, standard partner payouts
                        are{" "}
                        <span className="font-semibold text-shop-accent-1">
                          {formatPrice(payoutSuggestion.low)} –{" "}
                          {formatPrice(payoutSuggestion.high)}
                        </span>
                        .
                      </p>
                      <p className="text-[10.5px] leading-[15px] text-shop-text/70">
                        {formatPrice(PARTNER_PROGRAM_MIN_PROFIT)} is our minimum,
                        but matching or beating these figures is the fastest way
                        to attract top partners and move stock.
                      </p>
                    </div>
                  )}

                  {partnerProfitAmount && !partnerRateValid && (
                    <p className="text-[11.5px] text-shop-accent-3">
                      The minimum Partner Program profit is{" "}
                      {formatPrice(PARTNER_PROGRAM_MIN_PROFIT)}.
                    </p>
                  )}
                  {partnerProfitAmount &&
                    partnerRateValid &&
                    basePrice > 0 && (
                      <p className="rounded-[8px] bg-shop-bg p-3 text-[11.5px] leading-[17px] text-shop-text">
                        Customers still see{" "}
                        <span className="font-semibold text-shop-heading">
                          {formatPrice(basePrice)}
                        </span>
                        . Partners buy in at{" "}
                        <span className="font-semibold text-shop-heading">
                          {formatPrice(basePrice - Number(partnerProfitAmount))}
                        </span>{" "}
                        and keep{" "}
                        <span className="font-semibold text-emerald-600">
                          {formatPrice(
                            Math.round(
                              Number(partnerProfitAmount) *
                                (1 - PARTNER_PLATFORM_FEE_RATE),
                            ),
                          )}
                        </span>{" "}
                        per sale (after AwaOwn&apos;s{" "}
                        {Math.round(PARTNER_PLATFORM_FEE_RATE * 100)}% platform
                        fee).
                      </p>
                    )}
                </div>
              )}
            </div>

            {!isGroup && deliveryType !== "digital" && (
              <div className="flex flex-col gap-2.5">
                <label className="flex items-center justify-between rounded-[10px] border border-shop-border p-3.5">
                  <span className="text-[13px] font-medium text-shop-heading">
                    Hide inventory quantity from shoppers
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
                      When it sells out, shoppers can opt in and we email them
                      the moment you restock.
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

        {!isValid && problems.length > 0 && (
          <div className="flex flex-col gap-1 rounded-[10px] border border-amber-200 bg-amber-50 p-3 text-[11.5px] leading-[16px] text-amber-800">
            <span className="font-semibold">
              {isCreate
                ? "To submit for review, fix the following (or Save as draft):"
                : isDraft
                  ? "To publish, fix the following (or keep it a draft):"
                  : "Fix the following to save:"}
            </span>
            <ul className="list-disc pl-4">
              {problems.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2.5 sm:flex-row-reverse">
          <button
            type="submit"
            disabled={!isValid || submitting || imageUploading || fileUploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {primaryLabel}
          </button>
          {showDraftBtn && (
            <button
              type="button"
              onClick={() => submit(true)}
              disabled={
                !title.trim() || submitting || imageUploading || fileUploading
              }
              className="flex-1 rounded-[10px] border border-shop-border py-3.5 text-[14px] font-semibold text-shop-heading transition-colors hover:bg-shop-bg disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-5"
            >
              {isCreate ? "Save as draft" : "Save draft"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
