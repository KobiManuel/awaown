// Shared demo content for the AwaOwn homepage.
// Images are pooled from the extracted site assets + the existing
// AwaOwn/Awashop product photography, reused across cards.

import { getProductId } from "@/lib/product-id";

export const productImages = {
  earbuds: "/v2/images/04_2744fbb7-f6a1-43fe-ac37-0d9e0e184ef0.jpg",
  iphone: "/assets/images/iphone.png",
  trackIphone: "/assets/images/track-iphone.png",
  glasses: "/assets/images/glasses.png",
  sneakerWhite: "/assets/images/nike-97.png",
  sneakerBrown: "/assets/images/nike-97-brown.png",
  sneakerGreen: "/assets/images/nike-97-green.png",
  dress: "/assets/images/dress.png",
  cosmetics: "/assets/images/cosmetics.png",
  hair: "/assets/images/hair.png",
  real16: "/v2/images/16.jpg",
  real21: "/v2/images/21.jpg",
};

const swatchSets = [
  ["#111111", "#0BB96D", "#93C5FD"],
  ["#DD3842", "#6D28D9", "#111111"],
  ["#EED6B0", "#7779F9", "#111111"],
];

export const latestProducts = [
  {
    title: "Google Pixel Buds, Pixelbook Go, Nest Wifi",
    vendor: "Apple",
    price: 90,
    compareAt: 97,
    image: productImages.earbuds,
    hoverImage: productImages.trackIphone,
    badge: "-7%",
    swatches: swatchSets[0],
  },
  {
    title: "Watch Apple SE 44mm GPS+Cellular Gold",
    vendor: "Apple",
    price: 80,
    compareAt: 100,
    image: productImages.real16,
    hoverImage: productImages.real21,
    badge: "-20%",
    swatches: swatchSets[1],
  },
  {
    title: "Women Solid Round Neck Cotton T-Shirt",
    vendor: "AwaOwn",
    price: 24.5,
    compareAt: null,
    image: productImages.dress,
    hoverImage: productImages.cosmetics,
    swatches: swatchSets[2],
  },
  {
    title: "ADRO Men Print Regular Fit Hoodie",
    vendor: "Adro",
    price: 39.99,
    compareAt: 49.99,
    image: productImages.hair,
    hoverImage: productImages.dress,
    badge: "Sale",
    swatches: swatchSets[0],
  },
  {
    title: "Jack & Jones Men Embroidered Cap",
    vendor: "Jack & Jones",
    price: 19.99,
    compareAt: null,
    image: productImages.cosmetics,
    hoverImage: productImages.hair,
    swatches: swatchSets[1],
  },
  {
    title: "Nike Air Gold Pink V Series Cast Shoes",
    vendor: "Nike",
    price: 75,
    compareAt: 90,
    image: productImages.sneakerWhite,
    hoverImage: productImages.sneakerBrown,
    badge: "-16%",
    swatches: swatchSets[2],
  },
  {
    title: "MVMT Chrono Analog Black Dial Watch",
    vendor: "MVMT",
    price: 65,
    compareAt: null,
    image: productImages.real21,
    hoverImage: productImages.real16,
    swatches: swatchSets[0],
  },
  {
    title: "Google Home - Smart Home Speaker",
    vendor: "Google",
    price: 55,
    compareAt: 70,
    image: productImages.iphone,
    hoverImage: productImages.trackIphone,
    badge: "Sale",
    swatches: swatchSets[1],
  },
];

export const bestSellingProducts = [
  {
    title: "Apple iPad Pro (12.9-inch, Wi-Fi + Cellular, 64GB)",
    vendor: "Apple",
    price: 899,
    compareAt: 999,
    image: productImages.trackIphone,
    hoverImage: productImages.iphone,
    badge: "-10%",
    swatches: swatchSets[2],
  },
  {
    title: "iPhone 13, 128GB, Pink - Unlocked Premium",
    vendor: "Apple",
    price: 200,
    compareAt: 1200,
    image: productImages.iphone,
    hoverImage: productImages.real16,
    badge: "Sale",
    swatches: swatchSets[0],
  },
  {
    title: "Moshi Venturo Premium Laptop Backpack",
    vendor: "Moshi",
    price: 84,
    compareAt: null,
    image: productImages.hair,
    hoverImage: productImages.cosmetics,
    swatches: swatchSets[1],
  },
  {
    title: "DELL Inspiron Core i5 11th Gen Thin Laptop",
    vendor: "Dell",
    price: 649,
    compareAt: 720,
    image: productImages.real16,
    hoverImage: productImages.real21,
    badge: "-10%",
    swatches: swatchSets[2],
  },
  {
    title: "Evans Lichfield Sunningdale Velvet Pillow",
    vendor: "Evans Lichfield",
    price: 22,
    compareAt: null,
    image: productImages.dress,
    hoverImage: productImages.hair,
    swatches: swatchSets[0],
  },
  {
    title: "Bottle Grinder Set Ceramic Spice Mill",
    vendor: "AwaOwn",
    price: 18.5,
    compareAt: 24,
    image: productImages.cosmetics,
    hoverImage: productImages.dress,
    badge: "Sale",
    swatches: swatchSets[1],
  },
  {
    title: "Rico Lounge Chair | Single Sofas & Poufs",
    vendor: "Rico",
    price: 240,
    compareAt: 280,
    image: productImages.glasses,
    hoverImage: productImages.real21,
    badge: "-14%",
    swatches: swatchSets[2],
  },
  {
    title: "Nike Air Gold Pink V Series Cast Shoes",
    vendor: "Nike",
    price: 75,
    compareAt: 90,
    image: productImages.sneakerGreen,
    hoverImage: productImages.sneakerWhite,
    swatches: swatchSets[0],
  },
];

export const fashionTabs = {
  Fashion: [
    { title: "Watch Apple SE 44mm GPS+Cellular Gold", vendor: "Apple", price: 80, compareAt: 100, image: productImages.real16, hoverImage: productImages.real21, swatches: swatchSets[0] },
    { title: "Women Solid Round Neck Cotton T-Shirt", vendor: "AwaOwn", price: 24.5, compareAt: null, image: productImages.dress, hoverImage: productImages.cosmetics, swatches: swatchSets[1] },
    { title: "ADRO Men Print Regular Fit Hoodie", vendor: "Adro", price: 39.99, compareAt: 49.99, image: productImages.hair, hoverImage: productImages.dress, badge: "Sale", swatches: swatchSets[2] },
    { title: "Jack & Jones Men Embroidered Cap", vendor: "Jack & Jones", price: 19.99, compareAt: null, image: productImages.cosmetics, hoverImage: productImages.hair, swatches: swatchSets[0] },
    { title: "Nike Air Gold Pink V Series Cast Shoes", vendor: "Nike", price: 75, compareAt: 90, image: productImages.sneakerBrown, hoverImage: productImages.sneakerGreen, badge: "-16%", swatches: swatchSets[1] },
  ],
  Furniture: [
    { title: "Rico Lounge Chair | Single Sofas & Poufs", vendor: "Rico", price: 240, compareAt: 280, image: productImages.glasses, hoverImage: productImages.real21, badge: "-14%", swatches: swatchSets[0] },
    { title: "Bottle Grinder Set Ceramic Spice Mill", vendor: "AwaOwn", price: 18.5, compareAt: 24, image: productImages.cosmetics, hoverImage: productImages.dress, badge: "Sale", swatches: swatchSets[1] },
    { title: "Evans Lichfield Sunningdale Velvet Pillow", vendor: "Evans Lichfield", price: 22, compareAt: null, image: productImages.dress, hoverImage: productImages.hair, swatches: swatchSets[2] },
    { title: "Google Home - Smart Home Speaker", vendor: "Google", price: 55, compareAt: 70, image: productImages.iphone, hoverImage: productImages.trackIphone, badge: "Sale", swatches: swatchSets[0] },
    { title: "Moshi Venturo Premium Laptop Backpack", vendor: "Moshi", price: 84, compareAt: null, image: productImages.hair, hoverImage: productImages.cosmetics, swatches: swatchSets[1] },
  ],
  Electronic: [
    { title: "Apple iPad Pro (12.9-inch, Wi-Fi + Cellular, 64GB)", vendor: "Apple", price: 899, compareAt: 999, image: productImages.trackIphone, hoverImage: productImages.iphone, badge: "-10%", swatches: swatchSets[2] },
    { title: "iPhone 13, 128GB, Pink - Unlocked Premium", vendor: "Apple", price: 200, compareAt: 1200, image: productImages.iphone, hoverImage: productImages.real16, badge: "Sale", swatches: swatchSets[0] },
    { title: "Google Pixel Buds, Pixelbook Go, Nest Wifi", vendor: "Google", price: 90, compareAt: 97, image: productImages.earbuds, hoverImage: productImages.trackIphone, badge: "-7%", swatches: swatchSets[1] },
    { title: "DELL Inspiron Core i5 11th Gen Thin Laptop", vendor: "Dell", price: 649, compareAt: 720, image: productImages.real16, hoverImage: productImages.real21, badge: "-10%", swatches: swatchSets[2] },
    { title: "Unihertz Tank 3 Pro 5G Smartphone", vendor: "Unihertz", price: 599.5, compareAt: null, image: productImages.trackIphone, hoverImage: productImages.iphone, swatches: swatchSets[0] },
  ],
};

export const dealOfTheWeek = {
  title: "iPhone 13, 128GB, Pink - Unlocked Premium",
  vendor: "Apple",
  price: 200,
  compareAt: 1200,
  image: productImages.iphone,
  hoverImage: productImages.trackIphone,
  swatches: swatchSets[0],
  rating: 4,
  reviews: 38,
  description:
    "Latest generation smartphone with all-day battery life, a stunning Super Retina display, and a pro-grade camera system.",
  endsAt: () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString();
  },
};

export const categories = [
  { title: "Cabinet Table", count: 6, image: productImages.glasses, color: "#EDE9FE" },
  { title: "Men's Clothes", count: 8, image: productImages.hair, color: "#FCE7F3" },
  { title: "Sneakers Shoes", count: 4, image: productImages.sneakerGreen, color: "#DCFCE7" },
  { title: "Silver Earrings", count: 5, image: productImages.cosmetics, color: "#FEF3C7" },
  { title: "Leather Watch", count: 3, image: productImages.real21, color: "#DBEAFE" },
  { title: "Headphones", count: 6, image: productImages.earbuds, color: "#FFE4E6" },
  { title: "Sunglasses", count: 5, image: productImages.glasses, color: "#E0E7FF" },
  { title: "Women's Bag", count: 4, image: productImages.dress, color: "#FAE8FF" },
];

export const brands = [
  "Apple", "Nike", "Google", "Dell", "MVMT", "Moshi", "Boult", "Adro",
];

export const testimonials = [
  {
    name: "Chiamaka Nwosu",
    role: "Verified Buyer, Lagos",
    quote:
      "I was skeptical about shopping online in Nigeria until I found AwaOwn. Escrow means my money is only released after I confirm delivery — that alone won me over.",
  },
  {
    name: "Ifeoma Chukwu",
    role: "Merchant, Glow Beauty NG",
    quote:
      "Since listing on AwaOwn, my orders have grown month over month. Onboarding was simple and payouts land on time, every time — I'd recommend it to any Nigerian vendor.",
  },
  {
    name: "Tunde Bakare",
    role: "Verified Buyer, Ibadan",
    quote:
      "Fast delivery, real reviews, and a support team that actually responds. AwaOwn feels built for how Nigerians actually shop.",
  },
  {
    name: "Emeka Obi",
    role: "Verified Buyer, Abuja",
    quote:
      "I've bought electronics and fashion items here without a single hitch. The tracking updates keep me informed the whole way.",
  },
];

export const purchaseNotifications = [
  { title: "Apple iPad Pro (12.9-inch, Wi-Fi + Cellular, 64GB)", image: productImages.trackIphone, location: "Lagos" },
  { title: "Google Pixel Buds, Pixelbook Go, Nest Wifi", image: productImages.earbuds, location: "Abuja" },
  { title: "Nike Air Gold Pink V Series Cast Shoes", image: productImages.sneakerWhite, location: "Port Harcourt" },
  { title: "Women's Solid Formal Pink Blazer", image: productImages.dress, location: "Ibadan" },
  { title: "MVMT Chrono Analog Black Dial Watch", image: productImages.real21, location: "Enugu" },
  { title: "iPhone 13, 128GB, Pink - Unlocked Premium", image: productImages.iphone, location: "Kano" },
];

// Kept in the same {title, href, children} shape as before so MobileMenu,
// CategorySidebar and FloatingCategoryTrigger don't need to change — but the
// content now matches AwaOwn's real category taxonomy (the same 8 main groups
// as PRODUCT_CATEGORIES in lib/merchant-data.js, which merchants pick from
// when listing a product — that one is a flat list with no sub-items, while
// this menu still shows sub-item children for homepage navigation). Duplicated
// here rather than imported to avoid a circular import (merchant-data.js
// already imports from this file).
export const categoryMenu = [
  { title: "Fashion & Apparel", href: "#", children: ["Men's Clothing", "Women's Clothing", "Children's Wear", "Traditional Attire"] },
  { title: "Electronics & Gadgets", href: "#", children: ["Smartphones", "Laptops & PCs", "Smart Watches", "Accessories"] },
  { title: "Beauty & Health", href: "#", children: ["Skincare", "Hair Care", "Fragrances", "Vitamins"] },
  { title: "Food & Groceries", href: "#", children: ["Dry Foods", "Snacks", "Beverages", "Organic & Natural"] },
  { title: "Home & Living", href: "#", children: ["Furniture", "Kitchen & Dining", "Bedding & Bath", "Decor"] },
  { title: "Sports & Fitness", href: "#", children: ["Gym Equipment", "Sportswear", "Outdoor Sports", "Cycling"] },
  { title: "Automobiles", href: "#", children: ["Car Accessories", "Spare Parts", "Tyres & Wheels", "Car Care"] },
  { title: "Books & Education", href: "#", children: ["Textbooks", "Fiction", "Business", "Children's Books"] },
];

export const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  {
    title: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Top Deals", href: "/shop?deals=1" },
    ],
  },
  { title: "Categories", href: "/shop", categories: true },
  { title: "Contact", href: "/#community" },
  { title: "Community", href: "/#community" },
];

export function formatPrice(value) {
  return `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Looks a home-page product up by the same slug id ProductCard.js derives via
// getProductId() — lets /product/[id] resolve a click from the home page even
// though this catalogue has no id field of its own and isn't the same list
// lib/dashboard-data.js uses (that one has richer per-product detail; this one
// doesn't, which is why /product/[id] renders it with fewer fields).
export function getShopProductById(id) {
  const all = [...latestProducts, ...bestSellingProducts];
  return all.find((p) => getProductId(p) === id) || null;
}
