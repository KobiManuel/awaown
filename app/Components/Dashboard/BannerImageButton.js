"use client";

import React, { useRef } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useMediaUpload } from "@/lib/api/mediaApi";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

/**
 * The "Add / Edit Banner" pill on the merchant + partner dashboard headers.
 * Opens the OS file picker and uploads straight away (same behaviour on
 * desktop and mobile) instead of navigating off to a settings page.
 *
 *   <BannerImageButton hasBanner={!!p.bannerUrl} onUploaded={(url) => save({ bannerUrl: url })} />
 */
export default function BannerImageButton({
  hasBanner,
  onUploaded,
  folder = "stores",
  className = "",
}) {
  const inputRef = useRef(null);
  const showToast = useToast();
  const { upload, uploading } = useMediaUpload(folder);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await upload(file);
    if (!url) {
      showToast("Banner upload failed");
      return;
    }
    try {
      await onUploaded(url);
      showToast("Banner updated");
    } catch {
      showToast("Couldn't save the banner");
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11.5px] font-semibold text-shop-heading disabled:opacity-60 ${className}`}
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ImagePlus className="h-3.5 w-3.5" />
        )}
        {hasBanner ? "Edit Banner" : "Add Banner"}
      </button>
    </>
  );
}
