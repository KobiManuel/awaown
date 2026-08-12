import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, title, vendor, price, compareAt, image }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    hydrateWishlist(state, action) {
      state.items = action.payload || [];
    },
    toggleWishlist(state, action) {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id);
      } else {
        state.items.push(product);
      }
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { hydrateWishlist, toggleWishlist, removeFromWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
