import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import authReducer from "./authSlice";
import ordersReducer from "./ordersSlice";
import modalReducer from "./modalSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      wishlist: wishlistReducer,
      auth: authReducer,
      orders: ordersReducer,
      modal: modalReducer,
    },
  });
