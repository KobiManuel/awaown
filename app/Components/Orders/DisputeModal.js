"use client";

import React, { useState } from "react";
import { Loader2, X, ImagePlus } from "lucide-react";
import { useImageCropUpload } from "@/app/Components/Media/useImageCropUpload";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

/**
 * "Report a problem" form, shared by the signed-in customer's order page and
 * a guest's (partner-store) order tracking page. Photo evidence needs an
 * authenticated upload (/media/upload requires a session), so a guest buyer
 * gets the same reason/description flow without the photo step rather than
 * a broken upload button - `allowPhotos` gates that section.
 */
export default function DisputeModal({
  onClose,
  onSubmit,
  submitting,
  allowPhotos = true,
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const { pickAndCrop, uploading, modal } = useImageCropUpload("disputes");
  useBodyScrollLock(true);

  const addImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || images.length >= 4) return;
    const url = await pickAndCrop(file, { aspect: 1, title: "Crop the photo" });
    if (url) setImages((p) => [...p, url]);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 p-0 font-shop sm:items-center sm:p-4">
      {allowPhotos && modal}
      <div className="flex max-h-[92vh] w-full max-w-[440px] flex-col gap-3 overflow-y-auto rounded-t-[18px] bg-white p-5 sm:rounded-[18px]">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-shop-heading">
            Report a problem
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-shop-text/50 hover:text-shop-heading"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-[12px] leading-[17px] text-shop-text">
          Tell us what went wrong. Our team reviews every report and your payment
          stays in escrow until it&apos;s resolved.
        </p>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-shop-heading">
            What&apos;s the issue?
          </span>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          >
            <option value="">Select a reason</option>
            <option value="Item not received">Item not received</option>
            <option value="Wrong item delivered">Wrong item delivered</option>
            <option value="Item damaged / defective">
              Item damaged or defective
            </option>
            <option value="Item not as described">Item not as described</option>
            <option value="Missing parts / incomplete">
              Missing parts or incomplete
            </option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-shop-heading">
            Describe what happened
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Give us the details so we can help quickly"
            className="resize-none rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          />
        </label>

        {allowPhotos && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-semibold text-shop-heading">
              Photos <span className="font-normal text-shop-text/60">(up to 4)</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="relative h-16 w-16 overflow-hidden rounded-[8px] border border-shop-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((p) => p.filter((_, k) => k !== i))}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-[8px] border-2 border-dashed border-shop-border text-shop-text/50">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-shop-accent-1" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={addImage}
                  />
                </label>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          disabled={
            submitting || uploading || !reason || description.trim().length < 4
          }
          onClick={() =>
            onSubmit({
              reason,
              description: description.trim(),
              images,
            })
          }
          className="mt-1 flex items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Submit report
        </button>
      </div>
    </div>
  );
}
