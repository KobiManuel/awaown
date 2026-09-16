import { createSlice } from "@reduxjs/toolkit";

// A partner store is its own thing, kept apart from the main site's cart
// (cartSlice) - items are namespaced by store code so browsing several
// different partner stores over time never mixes their carts together.
const initialState = {
  byStore: {}, // { [code]: { id, productId, variantId, variantLabel, title, image, price, qty, maxQty }[] }
};

const partnerCartSlice = createSlice({
  name: "partnerCart",
  initialState,
  reducers: {
    hydratePartnerCart(state, action) {
      state.byStore = action.payload || {};
    },
    addPartnerCartItem(state, action) {
      const { code, item } = action.payload;
      const list = state.byStore[code] || (state.byStore[code] = []);
      const existing = list.find((i) => i.id === item.id);
      if (existing) {
        existing.qty += item.qty;
      } else {
        list.push(item);
      }
    },
    removePartnerCartItem(state, action) {
      const { code, id } = action.payload;
      if (!state.byStore[code]) return;
      state.byStore[code] = state.byStore[code].filter((i) => i.id !== id);
    },
    updatePartnerCartQty(state, action) {
      const { code, id, qty } = action.payload;
      const item = state.byStore[code]?.find((i) => i.id === id);
      if (item) item.qty = Math.max(1, qty);
    },
    clearPartnerCartForStore(state, action) {
      delete state.byStore[action.payload];
    },
  },
});

export const {
  hydratePartnerCart,
  addPartnerCartItem,
  removePartnerCartItem,
  updatePartnerCartQty,
  clearPartnerCartForStore,
} = partnerCartSlice.actions;
export default partnerCartSlice.reducer;
