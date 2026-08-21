"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { Camera, Video, X, Plus, Trash2, Package, Layers, Boxes, Check } from "lucide-react";
import { PRODUCT_CATEGORIES, PROCESSING_TIME_OPTIONS, formatPrice } from "@/lib/merchant-data";
import { readFileAsDataURL } from "@/lib/file-utils";
import { addOwnProduct } from "@/lib/store/partnerSlice";
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
  if (groups.length === 0) return [];

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

export default function NewPartnerProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const showToast = useToast();
  const existingProducts = useSelector((s) => s.partner.ownProducts);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0].slug);
  const [processingTime, setProcessingTime] = useState(PROCESSING_TIME_OPTIONS[1].id);
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
  const [groupProductIds, setGroupProductIds] = useState([]);

  const [hideStock, setHideStock] = useState(false);

  const groupCandidates = existingProducts.filter((p) => p.productType !== "group");
  const groupMembers = existingProducts.filter((p) => groupProductIds.includes(p.id));
  const groupMinPrice = groupMembers.length
    ? Math.min(...groupMembers.map((p) => p.price))
    : 0;

  const toggleGroupMember = (id) =>
    setGroupProductIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  useEffect(() => {
    if (!hasVariants) return;
    setVariants((prev) => buildVariants(optionGroups, prev));
  }, [optionGroups, hasVariants]);

  const handleImageChange = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
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

  const isValid = isGroup
    ? title.trim().length > 0 && groupProductIds.length >= 2
    : title.trim().length > 0 &&
      (hasVariants
        ? variants.length > 0 && variants.every((v) => v.price && v.stock !== "")
        : price && stock !== "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    dispatch(
      addOwnProduct({
        id: `pp-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        category,
        processingTime,
        images: images.filter(Boolean),
        video,
        productType,
        hasVariants,
        price: isGroup
          ? groupMinPrice
          : hasVariants
            ? (Number.isFinite(minPriceForPreview) ? minPriceForPreview : 0)
            : Number(price),
        stock: isGroup ? 0 : hasVariants ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) : Number(stock),
        variants: hasVariants
          ? variants.map((v) => ({ id: v.id, label: v.label, price: Number(v.price), stock: Number(v.stock) }))
          : [],
        groupProductIds: isGroup ? groupProductIds : [],
        status: "active",
        hideStock: isGroup ? true : hideStock,
      }),
    );
    showToast(`${title.trim()} added to your store`);
    router.push("/partner/store");
  };

  return (
    <div className="flex flex-col gap-6 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Add Product" backHref="/partner/store" showBackOnDesktop />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4 lg:px-0">
        <p className="rounded-[10px] bg-shop-bg p-3.5 text-[12px] leading-[18px] text-shop-text">
          Upload your own product to sell directly through your store — separate from
          products you add from the AwaOwn marketplace. It&apos;s still protected by
          AwaOwn&apos;s escrow and payment protection.
        </p>

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

        {/* Basic info */}
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-shop-heading">Product Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Handmade Beaded Necklace"
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
          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1.5">
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
            <label className="flex flex-1 flex-col gap-1.5">
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
          </div>
        </div>

        {/* Product type */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-shop-heading">Product type</p>
          <p className="text-[11.5px] text-shop-text">
            Choose how this product is sold — as-is, with color/size options, or as a
            bundle linking to products you&apos;ve already added.
          </p>
          <div className="flex gap-3">
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
              title="Has options"
              description="e.g. color, size — priced separately."
            />
            <TypeCard
              selected={isGroup}
              onClick={() => setProductType("group")}
              icon={Boxes}
              title="Group product"
              description="Bundle existing products together on one listing."
            />
          </div>
        </div>

        {isGroup ? (
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] font-semibold text-shop-heading">
              Choose products to include ({groupProductIds.length} selected)
            </p>
            <p className="text-[11.5px] text-shop-text">
              Pick at least 2 of your existing products. Each keeps its own price and
              stock — shoppers see them together, but buy them individually.
            </p>
            {groupCandidates.length === 0 ? (
              <p className="rounded-[10px] bg-shop-bg p-3.5 text-[12px] text-shop-text">
                You don&apos;t have any other products yet — add a simple or variable
                product first, then come back to bundle it into a group.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {groupCandidates.map((p) => {
                  const selected = groupProductIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleGroupMember(p.id)}
                      className={`flex items-center gap-3 rounded-[10px] border p-2.5 text-left transition-colors ${
                        selected ? "border-shop-accent-1 bg-shop-accent-1-light" : "border-shop-border"
                      }`}
                    >
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-shop-bg">
                        {p.images?.[0] ? (
                          <Image src={p.images[0]} alt={p.title} fill className="object-contain p-1" sizes="44px" />
                        ) : (
                          <Package className="h-4.5 w-4.5 text-shop-text/40" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">{p.title}</p>
                        <p className="text-[11px] text-shop-text/60">{formatPrice(p.price)}</p>
                      </div>
                      {selected && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            {groupMembers.length > 0 && (
              <p className="rounded-[8px] bg-shop-bg p-3 text-[11.5px] leading-[17px] text-shop-text">
                Shoppers will see this group starting from{" "}
                <span className="font-semibold text-shop-heading">{formatPrice(groupMinPrice)}</span>.
              </p>
            )}
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
              <button
                type="button"
                onClick={addOptionGroup}
                className="flex w-fit items-center gap-1.5 text-[12.5px] font-semibold text-shop-accent-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add another option
              </button>
            </div>

            {variants.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-shop-heading">
                    Pricing ({variants.length} options)
                  </p>
                </div>
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
                <div className="flex items-center gap-2 px-2.5">
                  <span className="flex-1 text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
                    Option
                  </span>
                  <span className="w-24 text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
                    Price (₦)
                  </span>
                  <span className="w-20 text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
                    Items in Stock
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-2 rounded-[10px] border border-shop-border p-2.5"
                    >
                      <span className="flex-1 text-[12.5px] font-medium text-shop-heading">
                        {v.label}
                      </span>
                      <input
                        value={v.price}
                        onChange={(e) => updateVariant(v.id, "price", e.target.value.replace(/[^0-9]/g, ""))}
                        inputMode="numeric"
                        placeholder="e.g. 15000"
                        aria-label="Price (₦)"
                        className="w-24 rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
                      />
                      <input
                        value={v.stock}
                        onChange={(e) => updateVariant(v.id, "stock", e.target.value.replace(/[^0-9]/g, ""))}
                        inputMode="numeric"
                        placeholder="e.g. 10"
                        aria-label="Number of items in stock"
                        className="w-20 rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stock visibility */}
        {!isGroup && (
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
        )}

        <button
          type="submit"
          disabled={!isValid}
          className="rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
        >
          Add to My Store
        </button>
      </form>
    </div>
  );
}
