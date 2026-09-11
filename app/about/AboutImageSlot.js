"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useImageCropUpload } from "@/app/Components/Media/useImageCropUpload";
import { useSaveAboutImageMutation } from "@/lib/api/adminApi";
import { useIsAdminViewer } from "@/lib/useIsAdminViewer";

/**
 * One placeholder section on the public About page. Shows the admin-uploaded
 * image for `sectionKey` when there is one, otherwise a plain grey box. When
 * the viewer is a signed-in admin, the box itself becomes clickable - pick,
 * crop and upload an image and it's saved immediately for every visitor.
 */
export default function AboutImageSlot({
  sectionKey,
  value,
  alt = "",
  aspect,
  className = "",
}) {
  const isAdmin = useIsAdminViewer();
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
      className={`relative overflow-hidden rounded-[16px] bg-gray-200 ${className}`}
    >
      {value && (
        <Image src={value} alt={alt} fill className="object-cover" sizes="600px" />
      )}
      {uploading && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </span>
      )}
      {isAdmin && !uploading && (
        <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 text-transparent transition-colors hover:bg-black/40 hover:text-white">
          <Camera className="h-5 w-5" strokeWidth={1.75} />
          <span className="text-[12.5px] font-semibold">
            {value ? "Replace image" : "Upload image"}
          </span>
        </span>
      )}
    </div>
  );

  if (!isAdmin) return box;

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
