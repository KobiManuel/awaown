"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useImageCropUpload } from "@/app/Components/Media/useImageCropUpload";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

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
 *
 * In editable mode this only uploads the file and hands the resulting URL to
 * `onPick` - it does not save anything itself. The admin page owns the draft
 * and its own Save Changes button, same as every other content section.
 */
export default function AboutImageSlot({
  value,
  alt = "",
  aspect,
  editable = false,
  onPick,
  className = "",
  style,
}) {
  const { pickAndCrop, uploading, modal } = useImageCropUpload("about");
  const showToast = useToast();
  const fileRef = useRef(null);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await pickAndCrop(file, { aspect, title: "Crop the photo" });
    // Also resolves null if the admin cancels the cropper, so this wording
    // has to be accurate for both that and a genuine upload failure.
    if (url) onPick?.(url);
    else showToast("No image was saved");
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
    <>
      {/* The crop modal must be a sibling of this button, never a child of it -
          any click inside the cropper (dragging the crop area, hitting Apply)
          would otherwise bubble up to this button's onClick and reopen the
          native file picker mid-crop. */}
      {modal}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="block w-full text-left"
        aria-label={value ? "Replace image" : "Upload image"}
      >
        {box}
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          className="hidden"
          onChange={pick}
        />
      </button>
    </>
  );
}
