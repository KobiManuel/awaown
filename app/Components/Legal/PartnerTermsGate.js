"use client";

import React, { useState } from "react";
import { ScrollText } from "lucide-react";
import LegalDocument from "./LegalDocument";
import { LEGAL_DOCUMENTS, PARTNER_TERMS_DOC_IDS } from "@/lib/legal-content";

const partnerDocs = LEGAL_DOCUMENTS.filter((d) => PARTNER_TERMS_DOC_IDS.includes(d.id));

/**
 * Full-screen, uncloseable - no X, no backdrop click, no Escape. A Partner
 * must read this and check the box before onboarding continues. Deliberately
 * has no "skip"/"remind me later" path. Mirrors MerchantTermsGate.
 */
export default function PartnerTermsGate({ onAccept, submitting, error }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white font-shop">
      <div className="flex items-center gap-2 border-b border-shop-border px-4 py-4 md:px-8">
        <ScrollText className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />
        <div>
          <p className="text-[14px] font-semibold text-shop-heading">
            Before you continue
          </p>
          <p className="text-[11.5px] text-shop-text/60">
            Please read the AwaOwn Terms of Use and Partner Agreement
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-12">
          {partnerDocs.map((doc) => (
            <LegalDocument key={doc.id} doc={doc} />
          ))}
        </div>
      </div>

      <div className="border-t border-shop-border bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-3">
          <label className="flex items-start gap-2.5 text-[13px] text-shop-heading">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-shop-accent-1"
            />
            I have read and agree to the AwaOwn Terms of Use and Partner Agreement.
          </label>
          {error && (
            <p className="text-[12.5px] text-shop-accent-3">{error}</p>
          )}
          <button
            type="button"
            onClick={onAccept}
            disabled={!checked || submitting}
            className="w-full rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
