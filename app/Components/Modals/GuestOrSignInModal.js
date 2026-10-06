"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ShoppingBag, LogIn } from "lucide-react";
import { closeModal } from "@/lib/store/modalSlice";
import ModalShell from "./ModalShell";

const FLAG = "awaown_merge_guest";

const GuestOrSignInModal = ({ modalProps }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { guestHref = "/checkout", signInNext = "/dashboard/checkout" } =
    modalProps || {};

  const continueAsGuest = () => {
    dispatch(closeModal());
    router.push(guestHref);
  };

  const signIn = () => {
    // Whatever's in the guest cart right now should fold onto the account
    // once sign-in completes - same flag GuestCommerceMerge already looks for.
    try {
      localStorage.setItem(FLAG, "1");
    } catch {
      /* ignore */
    }
    dispatch(closeModal());
    router.push(`/login/customer?next=${encodeURIComponent(signInNext)}`);
  };

  return (
    <ModalShell variant="popup">
      {(close) => (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-shop-accent-1-light">
            <ShoppingBag className="h-6 w-6 text-shop-accent-1" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[16px] font-semibold text-shop-heading">
              How would you like to check out?
            </p>
            <p className="mt-1 text-[13px] leading-[19px] text-shop-text">
              Check out as a guest, or sign in to track this order from your account.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <button
              type="button"
              onClick={continueAsGuest}
              className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue as Guest
            </button>
            <button
              type="button"
              onClick={signIn}
              className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-shop-border py-3 text-[13.5px] font-semibold text-shop-heading"
            >
              <LogIn className="h-4 w-4" />
              Sign In / Create Account
            </button>
            <button
              type="button"
              onClick={close}
              className="mt-1 text-[12.5px] font-medium text-shop-text/60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default GuestOrSignInModal;
