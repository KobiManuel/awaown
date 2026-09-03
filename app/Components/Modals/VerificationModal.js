"use client";

import React, { useState } from "react";
import { ShieldCheck, Upload, CheckCircle2, Loader2, X } from "lucide-react";
import { ID_TYPES } from "@/lib/merchant-data";
import { useMediaUpload } from "@/lib/api/mediaApi";
import {
  useGetMerchantVerificationQuery,
  useSubmitMerchantVerificationMutation,
} from "@/lib/api/merchantApi";
import {
  useGetPartnerVerificationQuery,
  useSubmitPartnerVerificationMutation,
} from "@/lib/api/partnerApi";
import { errorMessage } from "@/lib/api/errorMessage";
import ModalShell from "./ModalShell";

const UploadSlot = ({ label, image, onChange }) => {
  const inputRef = React.useRef(null);
  const { upload, uploading } = useMediaUpload("kyc");
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-semibold text-shop-heading">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-shop-border bg-shop-bg disabled:opacity-70"
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-shop-accent-1" />
        ) : image ? (
          <img src={image} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-shop-text/60">
            <Upload className="h-5 w-5" />
            <span className="text-[11.5px]">Tap to upload</span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          e.target.value = "";
          const url = await upload(file);
          if (url) onChange(url);
        }}
      />
    </div>
  );
};

const VerificationModal = ({ modalProps }) => {
  const role = modalProps?.role === "partner" ? "partner" : "merchant";

  const merchantVerif = useGetMerchantVerificationQuery(undefined, {
    skip: role !== "merchant",
  });
  const partnerVerif = useGetPartnerVerificationQuery(undefined, {
    skip: role !== "partner",
  });
  const [submitMerchant, merchantSubmit] =
    useSubmitMerchantVerificationMutation();
  const [submitPartner, partnerSubmit] = useSubmitPartnerVerificationMutation();

  const verification =
    role === "partner" ? partnerVerif.data : merchantVerif.data;
  const submit = role === "partner" ? submitPartner : submitMerchant;
  const submitting =
    role === "partner" ? partnerSubmit.isLoading : merchantSubmit.isLoading;

  const [idType, setIdType] = useState(ID_TYPES[0].id);
  const [idNumber, setIdNumber] = useState("");
  const [idFrontUrl, setIdFrontUrl] = useState(null);
  const [idBackUrl, setIdBackUrl] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [error, setError] = useState("");

  const isValid =
    idNumber.trim().length >= 5 && idFrontUrl && idBackUrl && selfieUrl;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setError("");
    try {
      await submit({
        idType,
        idNumber: idNumber.trim(),
        idFrontUrl,
        idBackUrl,
        selfieUrl,
      }).unwrap();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const status = verification?.status;
  const showVerified = status === "VERIFIED";
  const showPending = status === "PENDING";
  const showRejected = status === "REJECTED";

  return (
    <ModalShell variant="sheet">
      {(close) => (
        <>
          {showVerified ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2
                  className="h-8 w-8 text-emerald-600"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-shop-heading">
                  You&apos;re Verified!
                </p>
                <p className="mt-1 text-[12.5px] text-shop-text">
                  You can now request a payout at any time.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="w-full rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white hover:bg-shop-accent-1-dark"
              >
                Done
              </button>
            </div>
          ) : showPending ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-shop-accent-1" />
              <div>
                <p className="text-[14px] font-semibold text-shop-heading">
                  Reviewing your documents…
                </p>
                <p className="mt-1 text-[12.5px] text-shop-text">
                  Our team will review this and update you shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="w-full rounded-[10px] border border-shop-border py-3 text-[13.5px] font-semibold text-shop-heading"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className="h-5 w-5 text-shop-accent-1"
                    strokeWidth={1.75}
                  />
                  <p className="text-[16px] font-semibold text-shop-heading">
                    Verify Your Identity
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-shop-bg"
                >
                  <X className="h-4.5 w-4.5 text-shop-heading" />
                </button>
              </div>

              {showRejected && verification?.reviewNote && (
                <p className="mb-3 rounded-[8px] bg-red-50 px-3 py-2 text-[12px] text-shop-accent-3">
                  Previous submission rejected: {verification.reviewNote}
                </p>
              )}

              <p className="mb-4 text-[12.5px] leading-[18px] text-shop-text">
                Merchants and Partners must verify their identity before
                requesting a payout. Upload both sides of a government-issued ID
                and a selfie of you holding it.
              </p>

              <div className="mb-3 flex flex-col gap-1.5">
                <span className="text-[12.5px] font-semibold text-shop-heading">
                  ID Type
                </span>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
                >
                  {ID_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 flex flex-col gap-1.5">
                <span className="text-[12.5px] font-semibold text-shop-heading">
                  ID Number
                </span>
                <input
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Enter your ID number"
                  className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
                />
              </div>

              <div className="mb-3 grid grid-cols-2 gap-3">
                <UploadSlot
                  label="ID Document (Front)"
                  image={idFrontUrl}
                  onChange={setIdFrontUrl}
                />
                <UploadSlot
                  label="ID Document (Back)"
                  image={idBackUrl}
                  onChange={setIdBackUrl}
                />
              </div>
              <div className="mb-5 grid grid-cols-2 gap-3">
                <UploadSlot
                  label="Selfie Holding ID"
                  image={selfieUrl}
                  onChange={setSelfieUrl}
                />
              </div>

              {error && (
                <p className="mb-3 text-[12.5px] font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit for Verification
              </button>
            </>
          )}
        </>
      )}
    </ModalShell>
  );
};

export default VerificationModal;
