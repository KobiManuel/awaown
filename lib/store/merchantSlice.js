import { createSlice } from "@reduxjs/toolkit";
import { merchantSeedProducts, merchantSeedOrders } from "@/lib/merchant-data";

const initialState = {
  products: merchantSeedProducts,
  orders: merchantSeedOrders,
};

const merchantSlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {
    hydrateMerchant(state, action) {
      if (action.payload?.products?.length) state.products = action.payload.products;
      if (action.payload?.orders?.length) state.orders = action.payload.orders;
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
    confirmOrderReady(state, action) {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order && order.status === "awaiting_confirmation") {
        order.status = "processing";
      }
    },
  },
});

export const {
  hydrateMerchant,
  addProduct,
  toggleProductField,
  removeProduct,
  confirmOrderReady,
} = merchantSlice.actions;
export default merchantSlice.reducer;
