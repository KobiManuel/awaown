"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IdCard, X } from "lucide-react";

const DocSlot = ({ label, image, onOpen }) => (
  <button
    type="button"
    onClick={() => image && onOpen({ label, image })}
    disabled={!image}
    className="flex flex-col gap-1.5 text-left disabled:cursor-default"
  >
    <span className="text-[11px] font-semibold text-shop-text/60">{label}</span>
    <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-[10px] bg-shop-bg transition-opacity hover:opacity-80">
      {image ? (
        <Image src={image} alt={label} fill className="object-cover" sizes="200px" />
      ) : (
        <span className="text-[11px] text-shop-text/40">Not submitted</span>
      )}
    </div>
  </button>
);

/** Full-size view of a KYC document image - the small 112px DocSlot thumbnail
 * is never enough to actually read an ID or compare a selfie. */
const DocLightbox = ({ doc, onClose }) => (
  <div
    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 font-shop"
    onClick={onClose}
  >
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
    >
      <X className="h-5 w-5" />
    </button>
    <div
      className="relative flex max-h-[85vh] w-full max-w-[720px] flex-col items-center gap-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative h-[70vh] w-full">
        <Image
          src={doc.image}
          alt={doc.label}
          fill
          className="object-contain"
          sizes="720px"
        />
      </div>
      <p className="text-[13px] font-medium text-white">{doc.label}</p>
      <a
        href={doc.image}
        target="_blank"
        rel="noreferrer"
        className="text-[12px] font-semibold text-white underline"
      >
        Open original in a new tab
      </a>
    </div>
  </div>
);

/**
 * KYC document block shown on an admin merchant/partner detail page -
 * identical for both, so it's shared rather than duplicated. Click any
 * thumbnail to view it full-size (click the backdrop, the X, or press Escape
 * to close - "Open original" works around any size limits of the inline view).
 */
export default function VerificationDocuments({ verification }) {
  const [openDoc, setOpenDoc] = useState(null);

  useEffect(() => {
    if (!openDoc) return;
    const onKey = (e) => e.key === "Escape" && setOpenDoc(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openDoc]);

  if (!verification) return null;
  const v = verification;

  return (
    <>
      <div className="mx-4 flex flex-col gap-2.5 lg:mx-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <IdCard className="h-4 w-4 text-shop-accent-1" />
          Verification Documents · {v.status}
        </p>
        {(v.idType || v.idNumber) && (
          <p className="text-[12px] text-shop-text">
            {[v.idType, v.idNumber].filter(Boolean).join(" · ")}
          </p>
        )}
        <div className="grid grid-cols-3 gap-3">
          <DocSlot label="ID Front" image={v.idFrontUrl} onOpen={setOpenDoc} />
          <DocSlot label="ID Back" image={v.idBackUrl} onOpen={setOpenDoc} />
          <DocSlot label="Selfie Holding ID" image={v.selfieUrl} onOpen={setOpenDoc} />
        </div>
        {v.reviewNote && (
          <p className="text-[11.5px] text-shop-accent-3">Review note: {v.reviewNote}</p>
        )}
      </div>
      {openDoc && <DocLightbox doc={openDoc} onClose={() => setOpenDoc(null)} />}
    </>
  );
}
