import { createSlice } from "@reduxjs/toolkit";
import { earningsSeed, partnerProfile } from "@/lib/partner-data";
import { STORE_CUSTOMIZATION_DEFAULTS } from "@/lib/partner-store-options";

// Wallet balance only ever reflects "cleared" (released from escrow) earnings.
const initialWallet = earningsSeed
  .filter((e) => e.status === "cleared")
  .reduce((sum, e) => sum + e.netProfit, 0);

const initialState = {
  earnings: earningsSeed,
  walletBalance: initialWallet,
  withdrawals: [],
  storeName: `${partnerProfile.name.split(" ")[0]}'s Store`,
  storeProductIds: [],
  storeProfileImage: null,
  storeBanner: null,
  storeBio: "",
  storeTheme: STORE_CUSTOMIZATION_DEFAULTS.theme,
  storeAccent: STORE_CUSTOMIZATION_DEFAULTS.accent,
  storeFont: STORE_CUSTOMIZATION_DEFAULTS.font,
  verification: {
    status: "unverified", // unverified | pending | verified
    idType: null,
    idNumber: null,
    idImage: null,
    selfieImage: null,
    submittedAt: null,
  },
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    hydratePartner(state, action) {
      const payload = action.payload || {};
      if (payload.earnings?.length) state.earnings = payload.earnings;
      if (typeof payload.walletBalance === "number") state.walletBalance = payload.walletBalance;
      if (payload.withdrawals) state.withdrawals = payload.withdrawals;
      if (payload.storeName) state.storeName = payload.storeName;
      if (payload.storeProductIds) state.storeProductIds = payload.storeProductIds;
      if (payload.storeProfileImage !== undefined) state.storeProfileImage = payload.storeProfileImage;
      if (payload.storeBanner !== undefined) state.storeBanner = payload.storeBanner;
      if (payload.storeBio !== undefined) state.storeBio = payload.storeBio;
      if (payload.storeTheme) state.storeTheme = payload.storeTheme;
      if (payload.storeAccent) state.storeAccent = payload.storeAccent;
      if (payload.storeFont) state.storeFont = payload.storeFont;
      if (payload.verification) state.verification = payload.verification;
    },
    requestWithdrawal(state, action) {
      const { amount, bank } = action.payload;
      state.walletBalance -= amount;
      state.withdrawals.unshift({
        id: `WD-${Math.floor(10000 + Math.random() * 89999)}`,
        amount,
        bank,
        date: new Date().toISOString(),
        status: "pending",
      });
    },
    setStoreName(state, action) {
      state.storeName = action.payload;
    },
    addToStore(state, action) {
      if (!state.storeProductIds.includes(action.payload)) {
        state.storeProductIds.push(action.payload);
      }
    },
    removeFromStore(state, action) {
      state.storeProductIds = state.storeProductIds.filter((id) => id !== action.payload);
    },
    setStoreProfileImage(state, action) {
      state.storeProfileImage = action.payload;
    },
    setStoreBanner(state, action) {
      state.storeBanner = action.payload;
    },
    setStoreBio(state, action) {
      state.storeBio = action.payload;
    },
    setStoreTheme(state, action) {
      state.storeTheme = action.payload;
    },
    setStoreAccent(state, action) {
      state.storeAccent = action.payload;
    },
    setStoreFont(state, action) {
      state.storeFont = action.payload;
    },
    resetStoreCustomization(state) {
      state.storeProfileImage = null;
      state.storeBanner = null;
      state.storeBio = "";
      state.storeTheme = STORE_CUSTOMIZATION_DEFAULTS.theme;
      state.storeAccent = STORE_CUSTOMIZATION_DEFAULTS.accent;
      state.storeFont = STORE_CUSTOMIZATION_DEFAULTS.font;
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
  hydratePartner,
  requestWithdrawal,
  setStoreName,
  addToStore,
  removeFromStore,
  adminSetVerificationStatus,
  setStoreProfileImage,
  setStoreBanner,
  setStoreBio,
  setStoreTheme,
  setStoreAccent,
  setStoreFont,
  resetStoreCustomization,
  submitVerification,
  approveVerification,
} = partnerSlice.actions;
export default partnerSlice.reducer;
