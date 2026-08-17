// Dummy data for the AwaOwn merchant dashboard.

import { productImages, formatPrice } from "@/lib/shop-data";

export { formatPrice };

export const merchantProfile = {
  storeName: "Fashion Vault",
  ownerName: "John Doe",
  verified: true,
  rating: 4.8,
  joinedDate: "2025-11-02",
  walletBalance: 182500,
  escrowBalance: 64000,
};

export const merchantStats = {
  revenueToday: 42500,
  ordersToday: 3,
  totalProducts: 6,
  totalOrders: 128,
  avgRating: 4.8,
};

export const merchantSeedProducts = [
  {
    id: "mp-1",
    title: "Ankara Print Maxi Dress",
    image: productImages.dress,
    price: 15000,
    stock: 24,
    status: "active",
    offerCommission: true,
    hideStock: false,
  },
  {
    id: "mp-2",
    title: "Classic Court Sneakers",
    image: productImages.sneakerWhite,
    price: 28000,
    stock: 40,
    status: "active",
    offerCommission: true,
    hideStock: false,
  },
  {
    id: "mp-3",
    title: "Wireless Earbuds Pro",
    image: productImages.earbuds,
    price: 22000,
    stock: 0,
    status: "active",
    offerCommission: false,
    hideStock: false,
  },
  {
    id: "mp-4",
    title: "Aviator Sunglasses",
    image: productImages.glasses,
    price: 12000,
    stock: 30,
    status: "active",
    offerCommission: true,
    hideStock: true,
  },
  {
    id: "mp-5",
    title: "Glow Cosmetics Gift Set",
    image: productImages.cosmetics,
    price: 9500,
    stock: 50,
    status: "draft",
    offerCommission: false,
    hideStock: false,
  },
  {
    id: "mp-6",
    title: "Premium Human Hair Bundle",
    image: productImages.hair,
    price: 35000,
    stock: 18,
    status: "active",
    offerCommission: true,
    hideStock: false,
  },
];

export const merchantSeedOrders = [
  {
    id: "AWO-91042",
    customerName: "Amara Obi",
    items: [{ title: "Ankara Print Maxi Dress", qty: 1, image: productImages.dress }],
    total: 15000,
    status: "awaiting_confirmation",
    placedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "AWO-90811",
    customerName: "Tunde Bakare",
    items: [
      { title: "Classic Court Sneakers", qty: 1, image: productImages.sneakerWhite },
      { title: "Aviator Sunglasses", qty: 1, image: productImages.glasses },
    ],
    total: 40000,
    status: "processing",
    placedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "AWO-90233",
    customerName: "Chiamaka Eze",
    items: [{ title: "Premium Human Hair Bundle", qty: 1, image: productImages.hair }],
    total: 35000,
    status: "shipped",
    placedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "AWO-88710",
    customerName: "Bola Fashina",
    items: [{ title: "Ankara Print Maxi Dress", qty: 2, image: productImages.dress }],
    total: 30000,
    status: "delivered",
    placedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const merchantPayouts = [
  { id: "PO-3391", amount: 58000, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), status: "paid" },
  { id: "PO-3204", amount: 41500, date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), status: "paid" },
  { id: "PO-3098", amount: 64000, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), status: "paid" },
];

export const MERCHANT_ORDER_STATUS_LABEL = {
  awaiting_confirmation: "Awaiting Confirmation",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const MERCHANT_ORDER_STATUS_TONE = {
  awaiting_confirmation: "bg-amber-100 text-amber-700",
  processing: "bg-shop-accent-1-light text-shop-accent-1",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
};
