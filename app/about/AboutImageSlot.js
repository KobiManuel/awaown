"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useImageCropUpload } from "@/app/Components/Media/useImageCropUpload";
import { useSaveAboutImageMutation } from "@/lib/api/adminApi";

/**
 * One placeholder section on the About page. Shows the admin-uploaded image
 * for `sectionKey` when there is one, otherwise a plain grey box.
 *
 * `editable` must be passed explicitly by the caller (true only from inside
 * the admin panel, where a single already-correct admin session already
 * exists via AppFrame) - this component never runs its own auth check.
 * Detecting "is this viewer an admin" from a public page would mean running
 * a second, competing session bootstrap alongside the one every page's root
 * layout already runs for guest cart/wishlist sync, and the two fight over
 * the same shared auth state (this shipped once and caused an infinite
 * render loop - see git history - don't reintroduce it).
 */
export default function AboutImageSlot({
  sectionKey,
  value,
  alt = "",
  aspect,
  editable = false,
  className = "",
  style,
}) {
  const { pickAndCrop, uploading, modal } = useImageCropUpload("about");
  const [saveImage] = useSaveAboutImageMutation();
  const fileRef = useRef(null);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await pickAndCrop(file, { aspect, title: "Crop the photo" });
    if (url) saveImage({ key: sectionKey, url });
  };

  const box = (
    <div
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={style}
    >
      {value && (
        <Image src={value} alt={alt} fill className="object-cover" sizes="600px" />
      )}
      {uploading && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </span>
      )}
      {editable && !uploading && (
        <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 text-transparent transition-colors hover:bg-black/40 hover:text-white">
          <Camera className="h-5 w-5" strokeWidth={1.75} />
          <span className="text-[12.5px] font-semibold">
            {value ? "Replace image" : "Upload image"}
          </span>
        </span>
      )}
    </div>
  );

  if (!editable) return box;

  return (
    <button
      type="button"
      onClick={() => fileRef.current?.click()}
      disabled={uploading}
      className="block w-full text-left"
      aria-label={value ? "Replace image" : "Upload image"}
    >
      {box}
      {modal}
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        className="hidden"
        onChange={pick}
      />
    </button>
  );
}
