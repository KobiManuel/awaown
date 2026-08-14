import { createSlice } from "@reduxjs/toolkit";

export const ORDER_STEPS = [
  { key: "placed", label: "Order Placed" },
  { key: "escrow", label: "Payment Confirmed — Escrow Held" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "review", label: "Review" },
];

export function generateOrderId() {
  return `AWO-${Math.floor(10000 + Math.random() * 89999)}`;
}

function buildTimeline(reachedIndex, baseDate) {
  return ORDER_STEPS.map((step, i) => ({
    ...step,
    done: i <= reachedIndex,
    date:
      i <= reachedIndex
        ? new Date(baseDate.getTime() + i * 36e5).toISOString()
        : null,
  }));
}

const seedDate1 = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
const seedDate2 = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);

const seedOrders = [
  {
    id: "AWO-72910",
    placedAt: seedDate1.toISOString(),
    items: [
      {
        id: "classic-court-sneakers::color-white|size-42",
        title: "Classic Court Sneakers",
        image: "/assets/images/nike-97.png",
        variantLabel: "Color: White · Size: 42",
        price: 28000,
        qty: 1,
      },
    ],
    subtotal: 28000,
    shipping: 1500,
    total: 29500,
    address: {
      name: "Ada Chukwu",
      phone: "+234 803 210 5000",
      line1: "14 Danube Street, Maitama",
      city: "Abuja",
      state: "FCT",
    },
    paymentMethod: "card",
    status: "shipped",
    timeline: buildTimeline(3, seedDate1),
  },
  {
    id: "AWO-68144",
    placedAt: seedDate2.toISOString(),
    items: [
      {
        id: "wireless-earbuds-pro",
        title: "Wireless Earbuds Pro",
        image: "/v2/images/04_2744fbb7-f6a1-43fe-ac37-0d9e0e184ef0.jpg",
        variantLabel: null,
        price: 22000,
        qty: 1,
      },
      {
        id: "cosmetics-gift-set",
        title: "Glow Cosmetics Gift Set",
        image: "/assets/images/cosmetics.png",
        variantLabel: null,
        price: 9500,
        qty: 1,
      },
    ],
    subtotal: 31500,
    shipping: 1500,
    total: 33000,
    address: {
      name: "Ada Chukwu",
      phone: "+234 803 210 5000",
      line1: "14 Danube Street, Maitama",
      city: "Abuja",
      state: "FCT",
    },
    paymentMethod: "wallet",
    status: "delivered",
    timeline: buildTimeline(5, seedDate2),
  },
];

const initialState = {
  items: seedOrders,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    hydrateOrders(state, action) {
      if (action.payload && action.payload.length) {
        state.items = action.payload;
      }
    },
    placeOrder(state, action) {
      const now = new Date();
      state.items.unshift({
        placedAt: now.toISOString(),
        status: "escrow",
        timeline: buildTimeline(1, now),
        ...action.payload,
      });
    },
  },
});

export const { hydrateOrders, placeOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
