// Dummy data for the AwaOwn admin panel.

import { productImages, formatPrice } from "@/lib/shop-data";

export { formatPrice };

export const adminProfile = {
  name: "Ada Nwosu",
  role: "Super Admin",
  email: "ada.nwosu@awaown.com",
};

export const businessOverview = {
  revenueToday: 612500,
  ordersToday: 34,
  customers: 4820,
  merchants: 186,
  partners: 412,
  escrowBalance: 3420000,
};

export const todaysSnapshot = {
  revenue: 612500,
  orders: 34,
  newCustomers: 21,
  newMerchants: 3,
  newPartners: 7,
};

export const platformHealth = [
  { id: "website", label: "Website", status: "green" },
  { id: "payments", label: "Payment Gateway", status: "green" },
  { id: "escrow", label: "Escrow", status: "green" },
  { id: "email_sms", label: "Email / SMS", status: "amber" },
  { id: "integrations", label: "Integrations", status: "green" },
];

export const recentActivity = [
  { id: "act-1", text: "Merchant \"Glow Beauty NG\" submitted identity verification", at: new Date(Date.now() - 12 * 60 * 1000).toISOString() },
  { id: "act-2", text: "Order AWO-91042 payment confirmed — escrow held", at: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
  { id: "act-3", text: "Partner \"Ifeoma K.\" requested a withdrawal of ₦18,500", at: new Date(Date.now() - 65 * 60 * 1000).toISOString() },
  { id: "act-4", text: "Order AWO-88710 delivered — escrow released to merchant", at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: "act-5", text: "New coupon \"WELCOME10\" published", at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
];

export const campaignCalendar = [
  { id: "camp-1", title: "WELCOME10 coupon expires", date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "camp-2", title: "Flash Sale — Fashion Week", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "camp-3", title: "Black Friday campaign launch", date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString() },
];

export const AUTOMATION_RULES_SEED = [
  {
    id: "auto-1",
    trigger: "Merchant is verified",
    action: "Send welcome email automatically",
    enabled: true,
  },
  {
    id: "auto-2",
    trigger: "Partner joins",
    action: "Send onboarding resources automatically",
    enabled: true,
  },
  {
    id: "auto-3",
    trigger: "Order is delivered",
    action: "Ask the customer for a review",
    enabled: true,
  },
  {
    id: "auto-4",
    trigger: "Withdrawal is approved",
    action: "Notify the user instantly",
    enabled: true,
  },
  {
    id: "auto-5",
    trigger: "Customer abandons cart",
    action: "Send a reminder after a few hours",
    enabled: false,
  },
];

export const AUDIT_LOG_SEED = [
  { id: "log-1", admin: "Ada Nwosu", action: "Approved merchant verification for Fashion Vault", at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "log-2", admin: "Ada Nwosu", action: "Published banner \"Free Shipping Week\"", at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "log-3", admin: "Tunde Alabi", action: "Approved payout PO-3391 (₦56,550)", at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
];

export const TEAM_ROLES = [
  { id: "super_admin", label: "Super Admin", description: "Full access to every module." },
  { id: "operations", label: "Operations", description: "Orders, merchants, partners, products." },
  { id: "finance", label: "Finance", description: "Escrow, payouts, refunds, reports." },
  { id: "marketing", label: "Marketing", description: "Coupons, campaigns, broadcasts, content." },
  { id: "support", label: "Support", description: "Customer profiles, complaints, support history." },
  { id: "content", label: "Content", description: "Homepage content, banners, FAQs, blogs." },
];

export const teamMembersSeed = [
  { id: "tm-1", name: "Ada Nwosu", email: "ada.nwosu@awaown.com", role: "super_admin" },
  { id: "tm-2", name: "Tunde Alabi", email: "tunde.alabi@awaown.com", role: "finance" },
  { id: "tm-3", name: "Zainab Yusuf", email: "zainab.yusuf@awaown.com", role: "support" },
  { id: "tm-4", name: "Chidi Eze", email: "chidi.eze@awaown.com", role: "marketing" },
];

export const merchantsDirectory = [
  { id: "m-1", storeName: "Fashion Vault", owner: "John Doe", status: "active", verification: "unverified", products: 6, rating: 4.8, joinedAt: "2025-11-02" },
  { id: "m-2", storeName: "Glow Beauty NG", owner: "Ifeoma Chukwu", status: "active", verification: "pending", products: 14, rating: 4.6, joinedAt: "2026-01-14" },
  { id: "m-3", storeName: "TechHub Lagos", owner: "Emeka Obi", status: "active", verification: "verified", products: 22, rating: 4.7, joinedAt: "2025-08-21" },
  { id: "m-4", storeName: "Urban Soles", owner: "Ngozi Adeyemi", status: "suspended", verification: "verified", products: 9, rating: 4.2, joinedAt: "2025-06-03" },
  { id: "m-5", storeName: "Kaba & Co", owner: "Bashir Musa", status: "active", verification: "unverified", products: 3, rating: 4.9, joinedAt: "2026-02-28" },
];

export const partnersDirectory = [
  { id: "p-1", name: "John Doe", storeName: "John's Store", status: "active", verification: "unverified", referrals: 34, netProfit: 128400, joinedAt: "2025-12-10" },
  { id: "p-2", name: "Ifeoma K.", storeName: "Ify's Picks", status: "active", verification: "verified", referrals: 61, netProfit: 214800, joinedAt: "2025-09-18" },
  { id: "p-3", name: "Tobi Adebanjo", storeName: "TobiFinds", status: "active", verification: "pending", referrals: 12, netProfit: 34200, joinedAt: "2026-02-02" },
  { id: "p-4", name: "Grace Effiong", storeName: "Grace's Corner", status: "suspended", verification: "verified", referrals: 8, netProfit: 9600, joinedAt: "2025-10-25" },
];

export const customersDirectory = [
  { id: "c-1", name: "John Doe", email: "john.doe@awaown.com", orders: 6, totalSpend: 214000, wallet: 48000, joinedAt: "2025-11-20" },
  { id: "c-2", name: "Amara Obi", email: "amara.obi@example.com", orders: 3, totalSpend: 87500, wallet: 0, joinedAt: "2026-01-05" },
  { id: "c-3", name: "Tunde Bakare", email: "tunde.bakare@example.com", orders: 11, totalSpend: 412000, wallet: 12500, joinedAt: "2025-07-14" },
  { id: "c-4", name: "Chiamaka Eze", email: "chiamaka.eze@example.com", orders: 2, totalSpend: 35000, wallet: 0, joinedAt: "2026-02-18" },
];

export const complaintsSeed = [
  { id: "cmp-1", customer: "Amara Obi", order: "AWO-91042", subject: "Item not as described", status: "open", at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: "cmp-2", customer: "Tunde Bakare", order: "AWO-90811", subject: "Delivery delayed", status: "resolved", at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];

export const refundsSeed = [
  { id: "rf-1", order: "AWO-88710", customer: "Bola Fashina", amount: 30000, status: "pending", at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
  { id: "rf-2", order: "AWO-90233", customer: "Chiamaka Eze", amount: 35000, status: "approved", at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
];

export const failedPaymentsSeed = [
  { id: "fp-1", order: "AWO-91099", customer: "Grace Effiong", amount: 18500, reason: "Card declined", at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
];

export const BANNER_LOCATIONS = [
  "Homepage Hero",
  "Homepage — Three Banner Row",
  "Homepage — Two Banner Row",
  "Homepage — One Banner Row",
  "Category Page",
];

export const contentBanners = [
  { id: "cb-1", title: "Free Shipping Week", location: "Homepage Hero", status: "live" },
  { id: "cb-2", title: "New Year Sale", location: "Category Page", status: "scheduled" },
  { id: "cb-3", title: "Black Friday Countdown", location: "Homepage Hero", status: "draft" },
];

// Mirrors the copy currently hardcoded in app/Sections/OurCommunity/main.js — lets an
// admin edit the "Our Community" homepage section from the panel. Editing here does not
// yet feed the live component (no backend to persist/serve it from); see the notice on
// the admin Content page.
export const communitySectionDefaults = {
  vendorSpotlight: {
    vendorName: "Fashion Vault",
    description:
      "Handcrafted accessories and boutique fashion, rated 4.9 by shoppers across Lagos. This week we're spotlighting their new collection.",
    buttonText: "Visit Store",
    image: "/assets/images/companies/fashion-vault.png",
  },
  webinar: {
    title: "Scaling Your Store: Inventory & Fulfilment 101",
    dateText: "Thu, Aug 14 · 4:00 PM WAT",
    buttonText: "Save Your Seat",
  },
  tip: {
    text: "Add at least 3 product photos from different angles — listings with multiple photos see 40% more clicks.",
  },
  challenge: {
    text: "Share your AwaOwn haul on Instagram and tag @awaown for a chance to win ₦20,000 in shopping credit.",
    buttonText: "Join Challenge",
  },
  announcement: {
    text: "Nationwide delivery is now available to all 36 states — check your area at checkout.",
    date: "Aug 10, 2026",
  },
};

// Mirrors the copy currently hardcoded across the homepage section components
// (HeroSlider, ThreeBannerRow, DealOfWeek, TwoBannerRow, OneBannerRow, Testimonials) —
// lets an admin edit those sections from the panel. Editing here does not yet feed the
// live homepage (no backend to persist/serve it from); see the notice on the admin
// Content page.
export const homepageContentDefaults = {
  hero: {
    slides: [
      {
        image: "/v2/images/main-banner-1.webp",
        discount: "FLAT 40% DISCOUNT",
        title: "Unihertz Tank 3 Pro 5G Smartphone",
        price: "STARTS AT: ₦599.50",
      },
      {
        image: "/v2/images/main-banner-2.webp",
        discount: "FLAT 30% DISCOUNT",
        title: "Women's Solid Formal Pink Blazer",
        price: "STARTS AT: ₦69.50",
      },
    ],
  },
  threeBannerRow: {
    banners: [
      { image: "/v2/images/sub-banner-1.avif", heading: "Stain Blue Lounge Arm Chair", price: "Starts at: ₦69.99" },
      { image: "/v2/images/sub-banner-2.avif", heading: "Fashion Rose Gold Silver Watch", price: "Starts at: ₦59.50" },
      { image: "/v2/images/sub-banner-3.avif", heading: "Boult Audio & 100H Playtime", price: "Starts at: ₦99.50" },
    ],
  },
  dealOfWeek: {
    vendor: "Apple",
    title: "iPhone 13, 128GB, Pink - Unlocked Premium",
    price: 200,
    compareAt: 1200,
    rating: 4,
    reviews: 38,
    image: "/assets/images/iphone.png",
  },
  featuredProducts: {
    sectionTitle: "Featured Products",
  },
  twoBannerRow: {
    banners: [
      { image: "/v2/images/cms-banner-1.webp", subheading: "Up To 20% Off", heading: "White & Blue Casual Sneakers", buttonText: "Shop Now" },
      { image: "/v2/images/cms-banner-2.webp", subheading: "Up To 25% Off", heading: "Casual Short Sleeve Solid Top", buttonText: "Shop Now" },
    ],
  },
  oneBannerRow: {
    image: "/v2/images/offer-banner-1.webp",
    subheading: "Limited Offer",
    heading: "Buy Best Refurbished Apple iPhone 12 Mini Online",
    buttonText: "Shop Now",
  },
  reviews: {
    sectionTitle: "Reviews",
    testimonials: [
      { name: "Augusta Wind", role: "Web Designer", quote: "Lorem Ipsum is simply dummy text of the printing and typesetting industry, lorem a has been the industry's standard dummy specimen book." },
      { name: "Reema Ghurde", role: "Manager", quote: "Lorem Ipsum is simply dummy text of the printing and typesetting industry, lorem a has been the industry's standard dummy specimen book." },
      { name: "Luies Charls", role: "CEO", quote: "Lorem Ipsum is simply dummy text of the printing and typesetting industry, lorem a has been the industry's standard dummy specimen book." },
      { name: "Stefanie Ford", role: "Founder", quote: "Lorem Ipsum is simply dummy text of the printing and typesetting industry, lorem a has been the industry's standard dummy specimen book." },
    ],
  },
};

export const faqsSeed = [
  { id: "faq-1", question: "How does escrow work?", status: "published" },
  { id: "faq-2", question: "How do I become a Partner?", status: "published" },
  { id: "faq-3", question: "What are the payout processing times?", status: "draft" },
];

export const couponsSeed = [
  { id: "cp-1", code: "WELCOME10", discount: "10% off", uses: 342, status: "active", expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "cp-2", code: "FLASH20", discount: "20% off", uses: 89, status: "scheduled", expires: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "cp-3", code: "EXPIRED5", discount: "5% off", uses: 1204, status: "expired", expires: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
];

export const EMAIL_AUDIENCES = [
  { id: "all", label: "Everyone" },
  { id: "merchants", label: "Merchants" },
  { id: "partners", label: "Partners" },
  { id: "customers", label: "Customers" },
];

export const emailCampaignsSeed = [
  {
    id: "ec-1",
    subject: "Welcome to the new AwaOwn Partner Program",
    body: "We've refreshed the Partner Program with faster payouts and a new store customization tool. Log in to check it out.",
    images: [],
    audience: "partners",
    recipientCount: 412,
    sentAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const salesReportSeed = [
  { period: "This Week", revenue: 4820000, orders: 218 },
  { period: "Last Week", revenue: 4310000, orders: 196 },
  { period: "This Month", revenue: 18650000, orders: 842 },
];

export const platformSettingsDefaults = {
  paymentGateway: "paystack",
  shippingProvider: "gig_logistics",
  emailProvider: "sendgrid",
  smsProvider: "termii",
  twoFactorRequired: true,
  maintenanceMode: false,
};

export const VERIFICATION_TONE = {
  verified: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  unverified: "bg-red-50 text-shop-accent-3",
};

export const HEALTH_TONE = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
};
