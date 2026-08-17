import { createSlice } from "@reduxjs/toolkit";
import { earningsSeed, partnerProfile } from "@/lib/partner-data";

const initialState = {
  earnings: earningsSeed,
  walletBalance: partnerProfile.walletBalance,
  withdrawals: [],
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    hydratePartner(state, action) {
      if (action.payload?.earnings?.length) state.earnings = action.payload.earnings;
      if (typeof action.payload?.walletBalance === "number") {
        state.walletBalance = action.payload.walletBalance;
      }
      if (action.payload?.withdrawals) state.withdrawals = action.payload.withdrawals;
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
  },
});

export const { hydratePartner, requestWithdrawal } = partnerSlice.actions;
export default partnerSlice.reducer;
