"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Shapes, ImagePlus, Loader2, X } from "lucide-react";
import {
  useGetAdminCategoriesQuery,
  useSaveAdminCategoryMutation,
  useSetCategoryDefaultImageMutation,
} from "@/lib/api/adminApi";
import { useImageCropUpload } from "@/app/Components/Media/useImageCropUpload";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

function CircleImagePicker({ src, label, onPick, onClear }) {
  const inputRef = useRef(null);
  const { pickAndCrop, uploading, modal } = useImageCropUpload("categories");

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
          disabled={uploading}
          className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-shop-border bg-shop-accent-1-light text-[22px] font-bold text-shop-accent-1"
        >
          {src ? (
            <Image src={src} alt={label} fill className="object-cover" sizes="80px" />
          ) : (
            label.charAt(0)
          )}
          {/* Upload in progress - always visible, not gated behind hover, so the
              admin gets clear feedback even after moving off the picker (e.g.
              right after the crop modal closes). */}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/55">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </span>
          )}
          {!uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-transparent opacity-0 transition-opacity group-hover:bg-black/45 group-hover:text-white group-hover:opacity-100">
              <ImagePlus className="h-4 w-4" />
            </span>
          )}
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
  const [saveCategory] = useSaveAdminCategoryMutation();
  const [setDefault] = useSetCategoryDefaultImageMutation();
  const [isSaving, setIsSaving] = useState(false);

  const categories = data?.categories ?? [];
  const defaultImage = data?.defaultImage ?? null;

  // Local draft: { defaultImage, byId: { [categoryId]: imageUrl } }. Uploading
  // still happens immediately (Cloudinary needs a real file), but committing the
  // resulting URL to a category is deferred to "Save Changes" like every other
  // section on this page.
  const [draft, setDraft] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const ready = draft !== null;

  useEffect(() => {
    if (draft === null && data) {
      const seeded = {
        defaultImage,
        byId: Object.fromEntries(categories.map((c) => [c.id, c.imageUrl])),
      };
      setDraft(seeded);
      setBaseline(JSON.stringify(seeded));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const isDirty = ready && baseline !== null && JSON.stringify(draft) !== baseline;

  const updateCategory = (id, imageUrl) => {
    setDraft((prev) => ({ ...prev, byId: { ...prev.byId, [id]: imageUrl } }));
  };

  const updateDefault = (imageUrl) => {
    setDraft((prev) => ({ ...prev, defaultImage: imageUrl }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const jobs = [];
      if (draft.defaultImage !== defaultImage) {
        jobs.push(setDefault(draft.defaultImage).unwrap());
      }
      for (const cat of categories) {
        if (draft.byId[cat.id] !== cat.imageUrl) {
          jobs.push(
            saveCategory({ id: cat.id, imageUrl: draft.byId[cat.id] }).unwrap(),
          );
        }
      }
      await Promise.all(jobs);
      setBaseline(JSON.stringify(draft));
      showToast("Category images saved");
    } catch {
      showToast("Could not save category images");
    } finally {
      setIsSaving(false);
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
        shopper storefront. Click a badge to upload a new picture, then Save
        Changes. The default image is used for any category without its own.
      </p>

      {isLoading || !ready ? (
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
              src={draft.defaultImage}
              label="Default"
              onPick={updateDefault}
              onClear={() => updateDefault(null)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-[14px] border border-shop-border bg-white p-4 sm:grid-cols-4 md:grid-cols-6">
            {categories.map((cat) => (
              <CircleImagePicker
                key={cat.id}
                src={draft.byId[cat.id]}
                label={cat.label}
                onPick={(url) => updateCategory(cat.id, url)}
                onClear={() => updateCategory(cat.id, null)}
              />
            ))}
          </div>

          {isDirty && (
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
          )}
        </div>
      )}
    </div>
  );
}
