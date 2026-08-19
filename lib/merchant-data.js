// Dummy data for the AwaOwn merchant dashboard.

import { productImages, formatPrice } from "@/lib/shop-data";

export { formatPrice };

export const merchantProfile = {
  storeName: "Fashion Vault",
  ownerName: "John Doe",
  rating: 4.8,
  joinedDate: "2025-11-02",
};

export const merchantStats = {
  revenueToday: 42500,
  ordersToday: 3,
  totalProducts: 6,
  totalOrders: 128,
  avgRating: 4.8,
};

export const ID_TYPES = [
  { id: "nin", label: "National ID (NIN)" },
  { id: "voters_card", label: "Voter's Card" },
  { id: "passport", label: "International Passport" },
  { id: "drivers_license", label: "Driver's License" },
];

export const merchantSeedProducts = [
  {
    id: "mp-1",
    title: "Ankara Print Maxi Dress",
    description: "Vibrant Ankara print cotton maxi dress with a fitted waist.",
    images: [productImages.dress],
    video: null,
    hasVariants: false,
    price: 15000,
    stock: 24,
    variants: [],
    status: "active",
    offerCommission: true,
    partnerProfitAmount: 2500,
    hideStock: false,
  },
  {
    id: "mp-2",
    title: "Classic Court Sneakers",
    description: "Everyday leather court sneakers with a cushioned sole.",
    images: [productImages.sneakerWhite],
    video: null,
    hasVariants: false,
    price: 28000,
    stock: 40,
    variants: [],
    status: "active",
    offerCommission: true,
    partnerProfitAmount: 4500,
    hideStock: false,
  },
  {
    id: "mp-3",
    title: "Wireless Earbuds Pro",
    description: "Active noise-cancelling wireless earbuds, 30-hour battery.",
    images: [productImages.earbuds],
    video: null,
    hasVariants: false,
    price: 22000,
    stock: 0,
    variants: [],
    status: "active",
    offerCommission: false,
    partnerProfitAmount: null,
    hideStock: false,
  },
  {
    id: "mp-4",
    title: "Aviator Sunglasses",
    description: "Polarised aviator sunglasses with a lightweight metal frame.",
    images: [productImages.glasses],
    video: null,
    hasVariants: false,
    price: 12000,
    stock: 30,
    variants: [],
    status: "active",
    offerCommission: true,
    partnerProfitAmount: 2000,
    hideStock: true,
  },
  {
    id: "mp-5",
    title: "Glow Cosmetics Gift Set",
    description: "Matte foundation, lip duo and highlighter gift set.",
    images: [productImages.cosmetics],
    video: null,
    hasVariants: false,
    price: 9500,
    stock: 50,
    variants: [],
    status: "draft",
    offerCommission: false,
    partnerProfitAmount: null,
    hideStock: false,
  },
  {
    id: "mp-6",
    title: "Premium Human Hair Bundle",
    description: "100% virgin human hair, double-wefted, in multiple lengths.",
    images: [productImages.hair],
    video: null,
    hasVariants: false,
    price: 35000,
    stock: 18,
    variants: [],
    status: "active",
    offerCommission: true,
    partnerProfitAmount: 5000,
    hideStock: false,
  },
];

export const merchantSeedOrders = [
  {
    id: "AWO-91042",
    customerName: "Amara Obi",
    address: "22 Ademola Adetokunbo Street, Wuse 2, Abuja",
    items: [{ title: "Ankara Print Maxi Dress", qty: 1, image: productImages.dress }],
    total: 15000,
    status: "awaiting_confirmation",
    placedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "AWO-90811",
    customerName: "Tunde Bakare",
    address: "14 Allen Avenue, Ikeja, Lagos",
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
    address: "5 Ziks Avenue, Awka, Anambra",
    items: [{ title: "Premium Human Hair Bundle", qty: 1, image: productImages.hair }],
    total: 35000,
    status: "shipped",
    placedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "AWO-88710",
    customerName: "Bola Fashina",
    address: "9 Danube Street, Maitama, Abuja",
    items: [{ title: "Ankara Print Maxi Dress", qty: 2, image: productImages.dress }],
    total: 30000,
    status: "delivered",
    placedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const merchantPayoutsSeed = [
  { id: "PO-3391", amount: 58000, fee: 1450, net: 56550, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), status: "paid" },
  { id: "PO-3204", amount: 41500, fee: 1038, net: 40462, date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), status: "paid" },
  { id: "PO-3098", amount: 64000, fee: 1600, net: 62400, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), status: "paid" },
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

export const MERCHANT_ORDER_STEPS = [
  { key: "awaiting_confirmation", label: "Order Received" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export function merchantOrderStepIndex(status) {
  return MERCHANT_ORDER_STEPS.findIndex((s) => s.key === status);
}
