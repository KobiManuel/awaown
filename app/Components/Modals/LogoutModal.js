"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/store/authSlice";
import { closeModal } from "@/lib/store/modalSlice";
import ModalShell from "./ModalShell";

const LogoutModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleConfirm = () => {
    dispatch(logout());
    dispatch(closeModal());
    router.push("/");
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
              className="flex-1 rounded-[10px] bg-shop-accent-3 py-3 text-[13.5px] font-semibold text-white"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default LogoutModal;
