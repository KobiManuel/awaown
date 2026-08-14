import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null, // { name, email }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state, action) {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      }
    },
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    topUpWallet(state, action) {
      if (state.user) {
        state.user.walletBalance = (state.user.walletBalance || 0) + action.payload;
      }
    },
  },
});

export const { hydrateAuth, login, logout, topUpWallet } = authSlice.actions;
export default authSlice.reducer;
