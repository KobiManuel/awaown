import { createSlice } from "@reduxjs/toolkit";

// Auth is session state, not persisted to localStorage anymore — the refresh
// token lives in an httpOnly cookie the browser holds, and the short-lived
// access token is kept in memory here and re-minted via /auth/:role/refresh on
// load or on a 401 (see lib/api/baseApi.js).
const initialState = {
  accessToken: null,
  role: null, // "customer" | "merchant" | "partner" | "admin"
  user: null, // { id, name, email, phone, role, status, walletBalance, ... }
  profile: null, // role-specific profile row from the API
  onboardingComplete: false,
  // "idle" until the first bootstrap attempt resolves; guards read this so they
  // don't redirect before we've had a chance to refresh the session.
  status: "idle", // idle | loading | authenticated | unauthenticated
};

// Flatten the API's { user, profile } into the shape the existing UI expects
// (it reads user.name / user.phone / user.walletBalance directly).
function shapeUser(payload) {
  if (!payload?.user) return null;
  const u = payload.user;
  const p = payload.profile || {};
  return {
    ...u,
    name: u.fullName,
    phone: p.phone ?? u.phone ?? null,
    walletBalance: u.walletBalance ?? 0,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
    },
    setAccessToken(state, action) {
      // Just the token — status only becomes "authenticated" once /auth/me
      // confirms the session (setMe / setSession).
      state.accessToken = action.payload;
    },
    authLoading(state) {
      state.status = "loading";
    },
    setSession(state, action) {
      const { accessToken, role } = action.payload;
      if (accessToken) state.accessToken = accessToken;
      if (role) state.role = role;
      state.user = shapeUser(action.payload);
      state.profile = action.payload.profile ?? null;
      state.onboardingComplete = !!action.payload.onboardingComplete;
      state.status = "authenticated";
    },
    setMe(state, action) {
      state.user = shapeUser(action.payload);
      state.profile = action.payload.profile ?? null;
      state.onboardingComplete = !!action.payload.onboardingComplete;
      state.status = "authenticated";
    },
    patchWalletBalance(state, action) {
      if (state.user) state.user.walletBalance = action.payload;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.profile = null;
      state.onboardingComplete = false;
      state.status = "unauthenticated";
      // keep `role` — it tells the login screen which dashboard was in use
    },
  },
});

export const {
  setRole,
  setAccessToken,
  authLoading,
  setSession,
  setMe,
  patchWalletBalance,
  clearAuth,
} = authSlice.actions;

// Back-compat: a few old components still import { login, logout } — keep thin
// shims so nothing breaks mid-migration. Remove once every caller is migrated.
export const login = setSession;
export const logout = clearAuth;
export const hydrateAuth = () => ({ type: "auth/noop" });
export const topUpWallet = (amount) => (dispatch, getState) => {
  const current = getState().auth.user?.walletBalance || 0;
  dispatch(patchWalletBalance(current + amount));
};

export default authSlice.reducer;
