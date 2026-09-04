"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Shapes, ImagePlus, Loader2, X } from "lucide-react";
import {
  useGetAdminCategoriesQuery,
  useSaveAdminCategoryMutation,
  useSetCategoryDefaultImageMutation,
} from "@/lib/api/adminApi";
import { useImageCropUpload } from "@/app/Components/Media/useImageCropUpload";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

function CircleImagePicker({ src, label, uploading, onPick, onClear }) {
  const inputRef = useRef(null);
  const { pickAndCrop, uploading: busy, modal } = useImageCropUpload("categories");

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await pickAndCrop(file, {
      aspect: 1,
      title: `Position the ${label} image`,
    });
    if (url) onPick(url);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {modal}
      <div className="relative h-20 w-20">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy || uploading}
          className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-shop-border bg-shop-accent-1-light text-[22px] font-bold text-shop-accent-1"
        >
          {src ? (
            <Image src={src} alt={label} fill className="object-cover" sizes="80px" />
          ) : (
            label.charAt(0)
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100">
            {busy || uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
          </span>
        </button>
        {src && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label={`Remove ${label} image`}
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-shop-border bg-white text-red-500 shadow-sm hover:bg-red-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <span className="max-w-[92px] truncate text-center text-[11px] font-medium text-shop-text">
        {label}
      </span>
    </div>
  );
}

export default function CategoriesEditor() {
  const showToast = useToast();
  const { data, isLoading } = useGetAdminCategoriesQuery();
  const [saveCategory, saveState] = useSaveAdminCategoryMutation();
  const [setDefault, defaultState] = useSetCategoryDefaultImageMutation();

  const categories = data?.categories ?? [];
  const defaultImage = data?.defaultImage ?? null;
  const busy = saveState.isLoading || defaultState.isLoading;

  const updateCategory = async (id, imageUrl) => {
    try {
      await saveCategory({ id, imageUrl }).unwrap();
      showToast(imageUrl ? "Category image updated" : "Category image removed");
    } catch {
      showToast("Could not update category image");
    }
  };

  const updateDefault = async (imageUrl) => {
    try {
      await setDefault(imageUrl).unwrap();
      showToast(imageUrl ? "Default image set" : "Default image removed");
    } catch {
      showToast("Could not update the default image");
    }
  };

  return (
    <div className="flex flex-col gap-3 px-4 pb-4 lg:px-8">
      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
        <Shapes className="h-4 w-4 text-shop-accent-1" />
        Category Images
      </p>
      <p className="text-[11.5px] text-shop-text/60">
        These pictures fill the round category badges on the homepage and the
        shopper storefront. Click a badge to upload a new picture. The default
        image is used for any category without its own.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-shop-accent-1" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-[14px] border border-dashed border-shop-border bg-white p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
              Default image
            </p>
            <CircleImagePicker
              src={defaultImage}
              label="Default"
              uploading={defaultState.isLoading}
              onPick={updateDefault}
              onClear={() => updateDefault(null)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-[14px] border border-shop-border bg-white p-4 sm:grid-cols-4 md:grid-cols-6">
            {categories.map((cat) => (
              <CircleImagePicker
                key={cat.id}
                src={cat.imageUrl}
                label={cat.label}
                uploading={busy}
                onPick={(url) => updateCategory(cat.id, url)}
                onClear={() => updateCategory(cat.id, null)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
