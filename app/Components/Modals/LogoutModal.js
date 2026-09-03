"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import { clearAuth } from "@/lib/store/authSlice";
import { closeModal } from "@/lib/store/modalSlice";
import { useLogoutMutation } from "@/lib/api/authApi";
import ModalShell from "./ModalShell";

const LOGIN_HREF = {
  customer: "/login/customer",
  merchant: "/login/merchant",
  partner: "/login/partner",
  admin: "/login/admin",
};

const LogoutModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const role = useSelector((s) => s.auth.role);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleConfirm = async () => {
    try {
      if (role) await logout({ role }).unwrap();
    } catch {
      // even if the server call fails, drop the local session
    }
    dispatch(clearAuth());
    dispatch(closeModal());
    router.push(LOGIN_HREF[role] || "/");
  };

  return (
    <ModalShell variant="popup">
      {(close) => (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <LogOut className="h-6 w-6 text-shop-accent-3" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[16px] font-semibold text-shop-heading">Log out of AwaOwn?</p>
            <p className="mt-1 text-[13px] leading-[19px] text-shop-text">
              You&apos;ll need to sign in again to access your cart, orders and wishlist.
            </p>
          </div>
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
              {isLoading ? "Logging out…" : "Log Out"}
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default LogoutModal;
