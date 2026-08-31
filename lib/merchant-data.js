// Dummy data for the AwaOwn merchant dashboard.

import { productImages, formatPrice } from "@/lib/shop-data";

export { formatPrice };

export const merchantProfile = {
  storeName: "Fashion Vault",
  ownerName: "John Doe",
  rating: 4.8,
  joinedDate: "2025-11-02",
  bio: "Handpicked fashion, footwear and accessories — sourced and shipped from Abuja.",
};

export const merchantStats = {
  revenueToday: 42500,
  ordersToday: 3,
  totalProducts: 7,
  totalOrders: 128,
  avgRating: 4.8,
};

export const ID_TYPES = [
  { id: "nin", label: "National ID (NIN)" },
  { id: "voters_card", label: "Voter's Card" },
  { id: "passport", label: "International Passport" },
  { id: "drivers_license", label: "Driver's License" },
];

// Matches the live site's Categories mega-menu (awaown.com) — the same 8 main groups
// as lib/shop-data.js's categoryMenu (that one keeps its own copy for the homepage
// nav's sub-item dropdown; this one stays a flat {slug, label} list of just the main
// categories, no sub-list, for the merchant category picker, admin category labels,
// and partner marketplace category chips).
export const PRODUCT_CATEGORIES = [
  { slug: "fashion-apparel", label: "Fashion & Apparel" },
  { slug: "electronics-gadgets", label: "Electronics & Gadgets" },
  { slug: "beauty-health", label: "Beauty & Health" },
  { slug: "food-groceries", label: "Food & Groceries" },
  { slug: "home-living", label: "Home & Living" },
  { slug: "sports-fitness", label: "Sports & Fitness" },
  { slug: "automobiles", label: "Automobiles" },
  { slug: "books-education", label: "Books & Education" },
];

export const PROCESSING_TIME_OPTIONS = [
  { id: "same_day", label: "Same Day" },
  { id: "1_2_days", label: "1–2 Days" },
  { id: "3_5_days", label: "3–5 Days" },
  { id: "1_2_weeks", label: "1–2 Weeks" },
  { id: "1_2_months", label: "1–2 Months (custom / long-lead)" },
];

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

export const PARTNER_PROGRAM_MIN_PROFIT = 1000;

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
    approvalStatus: "approved",
    category: "fashion-apparel",
    processingTime: "1_2_days",
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
    approvalStatus: "approved",
    category: "sports-fitness",
    processingTime: "1_2_days",
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
    approvalStatus: "approved",
    category: "electronics-gadgets",
    processingTime: "same_day",
    offerCommission: true,
    partnerProfitAmount: 3000,
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
    approvalStatus: "approved",
    category: "electronics-gadgets",
    processingTime: "same_day",
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
    approvalStatus: "pending",
    category: "beauty-health",
    processingTime: "1_2_days",
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
    approvalStatus: "approved",
    category: "beauty-health",
    processingTime: "3_5_days",
    offerCommission: true,
    partnerProfitAmount: 5000,
    hideStock: false,
  },
  {
    id: "mp-7",
    title: "Smartphone Fast Charger Bundle",
    description: "20W fast charger with a reinforced braided USB-C cable.",
    images: [productImages.iphone],
    video: null,
    hasVariants: false,
    price: 8500,
    stock: 60,
    variants: [],
    status: "active",
    approvalStatus: "approved",
    category: "electronics-gadgets",
    processingTime: "same_day",
    offerCommission: true,
    partnerProfitAmount: 1500,
    hideStock: false,
  },
];

function historyFrom(placedAt, hoursAfterPlaced) {
  return new Date(new Date(placedAt).getTime() + hoursAfterPlaced * 60 * 60 * 1000).toISOString();
}

const placed1 = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
const placed2 = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString();
const placed3 = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
const placed4 = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString();

export const merchantSeedOrders = [
  {
    id: "AWO-91042",
    customerName: "Amara Obi",
    address: "22 Ademola Adetokunbo Street, Wuse 2, Abuja",
    items: [{ title: "Ankara Print Maxi Dress", qty: 1, image: productImages.dress }],
    total: 15000,
    status: "awaiting_confirmation",
    placedAt: placed1,
    statusHistory: [{ status: "awaiting_confirmation", at: placed1 }],
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
    placedAt: placed2,
    statusHistory: [
      { status: "awaiting_confirmation", at: placed2 },
      { status: "processing", at: historyFrom(placed2, 1.5) },
    ],
  },
  {
    id: "AWO-90233",
    customerName: "Chiamaka Eze",
    address: "5 Ziks Avenue, Awka, Anambra",
    items: [{ title: "Premium Human Hair Bundle", qty: 1, image: productImages.hair }],
    total: 35000,
    status: "shipped",
    placedAt: placed3,
    statusHistory: [
      { status: "awaiting_confirmation", at: placed3 },
      { status: "processing", at: historyFrom(placed3, 3) },
      { status: "shipped", at: historyFrom(placed3, 26) },
    ],
  },
  {
    id: "AWO-88710",
    customerName: "Bola Fashina",
    address: "9 Danube Street, Maitama, Abuja",
    items: [{ title: "Ankara Print Maxi Dress", qty: 2, image: productImages.dress }],
    total: 30000,
    status: "delivered",
    placedAt: placed4,
    statusHistory: [
      { status: "awaiting_confirmation", at: placed4 },
      { status: "processing", at: historyFrom(placed4, 2) },
      { status: "shipped", at: historyFrom(placed4, 27) },
      { status: "delivered", at: historyFrom(placed4, 96) },
    ],
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
