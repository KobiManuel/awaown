"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle } from "lucide-react";
import { clearAuth } from "@/lib/store/authSlice";
import { closeModal } from "@/lib/store/modalSlice";
import { markSignedOut } from "@/lib/session-cookie";
import { useCloseAccountMutation } from "@/lib/api/authApi";
import { errorMessage } from "@/lib/api/errorMessage";
import ModalShell from "./ModalShell";

const LOGIN_HREF = {
  customer: "/login/customer",
  merchant: "/login/merchant",
  partner: "/login/partner",
};

const DeleteAccountModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const role = useSelector((s) => s.auth.role);
  const [closeAccount, { isLoading }] = useCloseAccountMutation();
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");
    try {
      await closeAccount({ role }).unwrap();
      markSignedOut(role);
      dispatch(clearAuth());
      dispatch(closeModal());
      router.push(LOGIN_HREF[role] || "/");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <ModalShell variant="popup">
      {(close) => (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-shop-accent-3" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[16px] font-semibold text-shop-heading">
              Delete your account?
            </p>
            <p className="mt-1 text-[13px] leading-[19px] text-shop-text">
              You&apos;ll be signed out everywhere and won&apos;t be able to sign
              back in. Your order and payment history stays on record for
              everyone else it involves - contact support if you ever need
              the account reopened.
            </p>
          </div>
          {error && (
            <p className="rounded-[10px] bg-red-50 px-3 py-2.5 text-[12.5px] leading-[18px] text-shop-accent-3">
              {error}
            </p>
          )}
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={close}
              className="flex-1 rounded-[10px] border border-shop-border py-3 text-[13.5px] font-semibold text-shop-heading"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 rounded-[10px] bg-shop-accent-3 py-3 text-[13.5px] font-semibold text-white disabled:opacity-70"
            >
              {isLoading ? "Deleting…" : "Delete Account"}
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default DeleteAccountModal;
