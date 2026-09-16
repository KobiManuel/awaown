"use client";

import React, { useMemo, useState } from "react";
import { Users2, Loader2, AlertTriangle } from "lucide-react";
import MoneyInput from "@/app/Components/Inputs/MoneyInput";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { PARTNER_PROGRAM_MIN_PROFIT, formatPrice } from "@/lib/merchant-data";
import {
  useGetMerchantProductsQuery,
  useUpdateMerchantProductMutation,
} from "@/lib/api/merchantApi";

/**
 * Some Partner Program products were enrolled back when the old merchant
 * accounts allowed profit shares as low as 300-400 naira. The platform's
 * minimum is now 1,000 - this uncloseable gate catches any merchant still
 * carrying a legacy rate below that and makes them fix it before they can
 * use the dashboard. No X, no backdrop click, no Escape, no skip.
 */
export default function PartnerProgramComplianceGate() {
  const showToast = useToast();
  const { data, isLoading } = useGetMerchantProductsQuery();
  const [updateProduct] = useUpdateMerchantProductMutation();
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const flagged = useMemo(
    () =>
      (data?.items ?? []).filter(
        (p) =>
          p.offerCommission &&
          (p.partnerProfitAmount ?? 0) < PARTNER_PROGRAM_MIN_PROFIT,
      ),
    [data],
  );

  if (isLoading || flagged.length === 0) return null;

  const draftFor = (p) => drafts[p.id] ?? String(p.partnerProfitAmount ?? "");
  const isValid = (p) => Number(draftFor(p)) >= PARTNER_PROGRAM_MIN_PROFIT;
  const allValid = flagged.every(isValid);

  const saveOne = async (p) => {
    if (!isValid(p)) return;
    setSavingId(p.id);
    try {
      await updateProduct({
        id: p.id,
        partnerProfitAmount: Number(draftFor(p)),
      }).unwrap();
      showToast(`${p.title} updated`);
    } catch {
      showToast(`Could not update ${p.title}`);
    } finally {
      setSavingId(null);
    }
  };

  const saveAll = async () => {
    if (!allValid) return;
    setSavingId("__all__");
    try {
      await Promise.all(
        flagged.map((p) =>
          updateProduct({
            id: p.id,
            partnerProfitAmount: Number(draftFor(p)),
          }).unwrap(),
        ),
      );
      showToast("Partner profit shares updated");
    } catch {
      showToast("Some products could not be updated - check the list below");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white font-shop">
      <div className="flex items-center gap-2 border-b border-shop-border px-4 py-4 md:px-8">
        <AlertTriangle className="h-5 w-5 text-amber-500" strokeWidth={1.75} />
        <div>
          <p className="text-[14px] font-semibold text-shop-heading">
            Update your Partner Program profit shares
          </p>
          <p className="text-[11.5px] text-shop-text/60">
            AwaOwn&apos;s minimum Partner profit is now{" "}
            {formatPrice(PARTNER_PROGRAM_MIN_PROFIT)}. Update the{" "}
            {flagged.length === 1 ? "product below" : `${flagged.length} products below`}{" "}
            before continuing.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-3">
          <p className="flex items-center gap-1.5 text-[12px] text-shop-text/70">
            <Users2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Customers still see your normal price - this only changes what
            Partners earn per sale.
          </p>
          {flagged.map((p) => {
            const valid = isValid(p);
            const saving = savingId === p.id || savingId === "__all__";
            return (
              <div
                key={p.id}
                className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border p-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-shop-heading">
                    {p.title}
                  </p>
                  <p className="text-[11.5px] text-shop-text/60">
                    Current profit: {formatPrice(p.partnerProfitAmount ?? 0)} ·
                    Price: {formatPrice(p.price)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <MoneyInput
                    value={draftFor(p)}
                    onChange={(v) =>
                      setDrafts((d) => ({ ...d, [p.id]: v }))
                    }
                    placeholder={String(PARTNER_PROGRAM_MIN_PROFIT)}
                    className={`w-[120px] rounded-[10px] border px-3 py-2 text-[13px] outline-none ${
                      valid
                        ? "border-shop-border"
                        : "border-shop-accent-3 bg-shop-accent-3/5"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => saveOne(p)}
                    disabled={!valid || saving}
                    className="rounded-[10px] bg-shop-accent-1-light px-3 py-2 text-[12px] font-semibold text-shop-accent-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingId === p.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-shop-border bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-2">
          {!allValid && (
            <p className="text-[11.5px] text-shop-accent-3">
              Every product must be at least {formatPrice(PARTNER_PROGRAM_MIN_PROFIT)}{" "}
              before you can continue.
            </p>
          )}
          <button
            type="button"
            onClick={saveAll}
            disabled={!allValid || savingId != null}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingId === "__all__" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Save All &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
