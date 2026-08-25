import { createSlice } from "@reduxjs/toolkit";
import { merchantSeedProducts, merchantSeedOrders, merchantPayoutsSeed } from "@/lib/merchant-data";
import { MERCHANT_PAYOUT_FEE_RATE } from "@/lib/payout-banks";

const initialState = {
  products: merchantSeedProducts,
  orders: merchantSeedOrders,
  payouts: merchantPayoutsSeed,
  walletBalance: 182500,
  escrowBalance: 64000,
  storeBanner: null,
  storeLogo: null,
  storeBio: null,
  storeDetails: {
    state: null,
    address: null,
    phone: null,
  },
  verification: {
    status: "unverified", // unverified | pending | verified
    idType: null,
    idNumber: null,
    idImage: null,
    selfieImage: null,
    submittedAt: null,
  },
};

const merchantSlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {
    hydrateMerchant(state, action) {
      const payload = action.payload || {};
      if (payload.products?.length) state.products = payload.products;
      if (payload.orders?.length) state.orders = payload.orders;
      if (payload.payouts) state.payouts = payload.payouts;
      if (typeof payload.walletBalance === "number") state.walletBalance = payload.walletBalance;
      if (typeof payload.escrowBalance === "number") state.escrowBalance = payload.escrowBalance;
      if (payload.storeBanner) state.storeBanner = payload.storeBanner;
      if (payload.storeLogo) state.storeLogo = payload.storeLogo;
      if (payload.storeBio) state.storeBio = payload.storeBio;
      if (payload.storeDetails) state.storeDetails = payload.storeDetails;
      if (payload.verification) state.verification = payload.verification;
    },
    setStoreBanner(state, action) {
      state.storeBanner = action.payload;
    },
    setStoreLogo(state, action) {
      state.storeLogo = action.payload;
    },
    setStoreBio(state, action) {
      state.storeBio = action.payload;
    },
    setStoreDetails(state, action) {
      state.storeDetails = { ...state.storeDetails, ...action.payload };
    },
    saveStoreProfile(state, action) {
      const draft = action.payload || {};
      state.storeBanner = draft.storeBanner ?? null;
      state.storeLogo = draft.storeLogo ?? null;
      state.storeBio = draft.storeBio ?? null;
      state.storeDetails = draft.storeDetails ?? state.storeDetails;
    },
    addProduct(state, action) {
      state.products.unshift(action.payload);
    },
    toggleProductField(state, action) {
      const { id, field } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) product[field] = !product[field];
    },
    removeProduct(state, action) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    adminSetProductApproval(state, action) {
      const { id, approvalStatus, reason } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.approvalStatus = approvalStatus;
        product.rejectionReason = approvalStatus === "rejected" ? reason || null : null;
      }
    },
    confirmOrderReady(state, action) {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order && order.status === "awaiting_confirmation") {
        order.status = "processing";
        order.statusHistory = [
          ...(order.statusHistory || []),
          { status: "processing", at: new Date().toISOString() },
        ];
      }
    },
    requestPayout(state, action) {
      const { amount, bank } = action.payload;
      const fee = Math.round(amount * MERCHANT_PAYOUT_FEE_RATE);
      const net = amount - fee;
      state.walletBalance -= amount;
      state.payouts.unshift({
        id: `PO-${Math.floor(1000 + Math.random() * 8999)}`,
        amount,
        fee,
        net,
        bank,
        date: new Date().toISOString(),
        status: "processing",
      });
    },
    submitVerification(state, action) {
      state.verification = {
        status: "pending",
        ...action.payload,
        submittedAt: new Date().toISOString(),
      };
    },
    approveVerification(state) {
      if (state.verification.status === "pending") {
        state.verification.status = "verified";
      }
    },
    adminSetVerificationStatus(state, action) {
      state.verification.status = action.payload;
    },
  },
});

export const {
  hydrateMerchant,
  setStoreBanner,
  setStoreLogo,
  setStoreBio,
  setStoreDetails,
  saveStoreProfile,
  addProduct,
  toggleProductField,
  removeProduct,
  adminSetProductApproval,
  confirmOrderReady,
  requestPayout,
  submitVerification,
  approveVerification,
  adminSetVerificationStatus,
} = merchantSlice.actions;
export default merchantSlice.reducer;
