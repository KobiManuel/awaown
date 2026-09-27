"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useGetBanksQuery, useResolveAccountMutation } from "@/lib/api/paymentsApi";
import { errorMessage } from "@/lib/api/errorMessage";

/**
 * Bank + account number + live Paystack-resolved account name, shared by the
 * merchant payout and partner withdrawal forms. The account name is never a
 * free-text field the requester types - it's always whatever Paystack
 * resolves for the number, so a mistyped account or a mismatched name is
 * caught here instead of only surfacing once someone tries to wire it.
 */
export function useBankAccountFields() {
  const { data: banks, isLoading: banksLoading } = useGetBanksQuery();
  const [resolveAccount, resolveState] = useResolveAccountMutation();
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumberRaw] = useState("");
  // Tagged with the exact bank+number they were resolved for, so a change to
  // either input makes the last result stale without needing to clear state
  // from inside the effect itself - it just stops matching `key` below.
  const [result, setResult] = useState({ key: "", name: "", error: "" });

  const setAccountNumber = (value) =>
    setAccountNumberRaw(value.replace(/[^0-9]/g, "").slice(0, 10));

  const key = `${bankCode}:${accountNumber}`;

  useEffect(() => {
    if (!bankCode || accountNumber.length !== 10) return;
    const t = setTimeout(() => {
      resolveAccount({ accountNumber, bankCode })
        .unwrap()
        .then((res) => setResult({ key, name: res.accountName, error: "" }))
        .catch((err) =>
          setResult({
            key,
            name: "",
            error: errorMessage(err, "Could not verify that account"),
          }),
        );
    }, 500);
    return () => clearTimeout(t);
  }, [bankCode, accountNumber, key, resolveAccount]);

  const bankName = (banks ?? []).find((b) => b.code === bankCode)?.name ?? "";
  const resolvedName = result.key === key ? result.name : "";
  const resolveError = result.key === key ? result.error : "";

  return {
    banks: banks ?? [],
    banksLoading,
    bankCode,
    setBankCode,
    accountNumber,
    setAccountNumber,
    bankName,
    resolvedName,
    resolveError,
    resolving: resolveState.isLoading,
    ready: !!resolvedName,
  };
}

const FIELD =
  "w-full rounded-[10px] border border-shop-border px-3.5 py-3 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1";

export default function BankAccountFields({ fields }) {
  const {
    banks,
    banksLoading,
    bankCode,
    setBankCode,
    accountNumber,
    setAccountNumber,
    resolvedName,
    resolveError,
    resolving,
  } = fields;

  return (
    <>
      <select
        value={bankCode}
        onChange={(e) => setBankCode(e.target.value)}
        disabled={banksLoading}
        className={`mb-2.5 ${FIELD}`}
      >
        <option value="">
          {banksLoading ? "Loading banks…" : "Select your bank"}
        </option>
        {banks.map((b) => (
          <option key={b.code} value={b.code}>
            {b.name}
          </option>
        ))}
      </select>

      <input
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        placeholder="Account number"
        inputMode="numeric"
        className={`mb-2.5 ${FIELD}`}
      />

      {resolving && (
        <p className="mb-5 flex items-center gap-1.5 text-[12px] text-shop-text/70">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Verifying account…
        </p>
      )}
      {!resolving && resolvedName && (
        <p className="mb-5 flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {resolvedName}
        </p>
      )}
      {!resolving && resolveError && (
        <p className="mb-5 flex items-center gap-1.5 text-[12px] font-medium text-red-600">
          <XCircle className="h-4 w-4 shrink-0" />
          {resolveError}
        </p>
      )}
      {!resolving && !resolvedName && !resolveError && (
        <p className="mb-5 text-[11.5px] text-shop-text/50">
          We&apos;ll confirm the account name once your bank and 10-digit
          account number are both in.
        </p>
      )}
    </>
  );
}
