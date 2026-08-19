import { createSlice } from "@reduxjs/toolkit";

export const MODAL_TYPES = {
  LOGOUT: "LOGOUT",
  TOP_UP: "TOP_UP",
  WITHDRAW: "WITHDRAW",
  MERCHANT_PAYOUT: "MERCHANT_PAYOUT",
  VERIFY_IDENTITY: "VERIFY_IDENTITY",
};

const initialState = {
  modalType: null,
  modalProps: {},
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state, action) {
      state.modalType = action.payload.modalType;
      state.modalProps = action.payload.modalProps || {};
    },
    closeModal(state) {
      state.modalType = null;
      state.modalProps = {};
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
