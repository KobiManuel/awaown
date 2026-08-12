import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, title, vendor, price, image, qty }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action) {
      state.items = action.payload || [];
    },
    addToCart(state, action) {
      const { id, qty = 1, ...rest } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ id, qty, ...rest });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQty(state, action) {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.qty = Math.max(1, qty);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { hydrateCart, addToCart, removeFromCart, updateQty, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
