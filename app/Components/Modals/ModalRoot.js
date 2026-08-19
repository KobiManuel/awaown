"use client";

import React from "react";
import { useSelector } from "react-redux";
import { MODAL_TYPES } from "@/lib/store/modalSlice";
import LogoutModal from "./LogoutModal";
import TopUpModal from "./TopUpModal";
import WithdrawModal from "./WithdrawModal";
import MerchantPayoutModal from "./MerchantPayoutModal";
import VerificationModal from "./VerificationModal";

// Add new modals here: MODAL_TYPES.FOO -> <FooModal />.
const MODAL_COMPONENTS = {
  [MODAL_TYPES.LOGOUT]: LogoutModal,
  [MODAL_TYPES.TOP_UP]: TopUpModal,
  [MODAL_TYPES.WITHDRAW]: WithdrawModal,
  [MODAL_TYPES.MERCHANT_PAYOUT]: MerchantPayoutModal,
  [MODAL_TYPES.VERIFY_IDENTITY]: VerificationModal,
};

const ModalRoot = () => {
  const modalType = useSelector((s) => s.modal.modalType);
  const modalProps = useSelector((s) => s.modal.modalProps);
  if (!modalType) return null;

  const ModalComponent = MODAL_COMPONENTS[modalType];
  if (!ModalComponent) return null;

  return <ModalComponent modalProps={modalProps} />;
};

export default ModalRoot;
