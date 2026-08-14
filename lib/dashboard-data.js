// Dummy data for the AwaOwn customer dashboard/app flow.
// Reuses the same product photography as the marketing site.

import { productImages, formatPrice } from "@/lib/shop-data";

export { formatPrice };

export const dashboardCategories = [
  { slug: "fashion", title: "Fashion", icon: "shirt", image: productImages.dress },
  { slug: "footwear", title: "Footwear", icon: "footprints", image: productImages.sneakerWhite },
  { slug: "electronics", title: "Electronics", icon: "smartphone", image: productImages.iphone },
  { slug: "beauty", title: "Beauty", icon: "sparkles", image: productImages.cosmetics },
  { slug: "hair", title: "Hair", icon: "scissors", image: productImages.hair },
  { slug: "accessories", title: "Accessories", icon: "watch", image: productImages.real16 },
];

export const products = [
  {
    id: "ankara-print-maxi-dress",
    title: "Ankara Print Maxi Dress",
    vendor: "AwaOwn Fashion",
    category: "fashion",
    rating: 4.6,
    reviewCount: 128,
    stock: 24,
    description:
      "A flowing maxi dress cut from vibrant Ankara print cotton, finished with a fitted waist and flared skirt. Handmade by verified merchants in Lagos.",
    images: [productImages.dress],
    price: 15000,
    compareAt: 19500,
    variants: [
      {
        name: "Size",
        key: "size",
        options: [
          { label: "S", value: "s" },
          { label: "M", value: "m" },
          { label: "L", value: "l" },
          { label: "XL", value: "xl" },
        ],
      },
    ],
  },
  {
    id: "classic-court-sneakers",
    title: "Classic Court Sneakers",
    vendor: "AwaOwn Footwear",
    category: "footwear",
    rating: 4.8,
    reviewCount: 342,
    stock: 40,
    description:
      "Everyday leather court sneakers with a cushioned sole and breathable lining. True to size, available in three colourways.",
    images: [productImages.sneakerWhite],
    price: 28000,
    compareAt: 34000,
    variants: [
      {
        name: "Color",
        key: "color",
        options: [
          { label: "White", value: "white", image: productImages.sneakerWhite, swatch: "#f5f5f5" },
          { label: "Brown", value: "brown", image: productImages.sneakerBrown, swatch: "#7b4a2d" },
          { label: "Green", value: "green", image: productImages.sneakerGreen, swatch: "#2f5233" },
        ],
      },
      {
        name: "Size",
        key: "size",
        options: [40, 41, 42, 43, 44, 45].map((n) => ({ label: String(n), value: String(n) })),
      },
    ],
  },
  {
    id: "wireless-earbuds-pro",
    title: "Wireless Earbuds Pro",
    vendor: "AwaOwn Electronics",
    category: "electronics",
    rating: 4.5,
    reviewCount: 512,
    stock: 65,
    description:
      "Active noise-cancelling wireless earbuds with 30-hour battery life via the charging case, and touch controls.",
    images: [productImages.earbuds],
    price: 22000,
    compareAt: 27500,
    variants: [],
  },
  {
    id: "iphone-13-128gb",
    title: "iPhone 13, 128GB",
    vendor: "AwaOwn Electronics",
    category: "electronics",
    rating: 4.9,
    reviewCount: 89,
    stock: 12,
    description:
      "Unlocked iPhone 13 with A15 Bionic chip, dual-camera system and all-day battery life. Comes with a 1-year AwaOwn warranty.",
    images: [productImages.iphone],
    price: 450000,
    compareAt: 520000,
    variants: [
      {
        name: "Color",
        key: "color",
        options: [
          { label: "Midnight", value: "midnight", image: productImages.iphone, swatch: "#1a1a1a" },
          { label: "Starlight", value: "starlight", image: productImages.trackIphone, swatch: "#e8e3d8" },
        ],
      },
      {
        name: "Storage",
        key: "storage",
        options: [
          { label: "128GB", value: "128gb" },
          { label: "256GB", value: "256gb" },
        ],
      },
    ],
  },
  {
    id: "aviator-sunglasses",
    title: "Aviator Sunglasses",
    vendor: "AwaOwn Fashion",
    category: "accessories",
    rating: 4.3,
    reviewCount: 76,
    stock: 30,
    description:
      "Polarised aviator sunglasses with a lightweight metal frame and UV400 protection.",
    images: [productImages.glasses],
    price: 12000,
    compareAt: null,
    variants: [],
  },
  {
    id: "cosmetics-gift-set",
    title: "Glow Cosmetics Gift Set",
    vendor: "AwaOwn Beauty",
    category: "beauty",
    rating: 4.7,
    reviewCount: 204,
    stock: 50,
    description:
      "A curated gift set with a matte foundation, lip duo and highlighter — suited to all skin tones.",
    images: [productImages.cosmetics],
    price: 9500,
    compareAt: null,
    variants: [],
  },
  {
    id: "premium-hair-bundle",
    title: "Premium Human Hair Bundle",
    vendor: "AwaOwn Hair",
    category: "hair",
    rating: 4.6,
    reviewCount: 158,
    stock: 18,
    description:
      "100% virgin human hair, double-wefted for durability. Choose your preferred length and texture.",
    images: [productImages.hair],
    price: 35000,
    compareAt: 42000,
    variants: [
      {
        name: "Length",
        key: "length",
        options: ["14in", "16in", "18in", "20in"].map((v) => ({ label: v, value: v })),
      },
      {
        name: "Texture",
        key: "texture",
        options: [
          { label: "Straight", value: "straight" },
          { label: "Wavy", value: "wavy" },
          { label: "Curly", value: "curly" },
        ],
      },
    ],
  },
  {
    id: "classic-leather-watch",
    title: "Classic Leather Watch",
    vendor: "AwaOwn Accessories",
    category: "accessories",
    rating: 4.4,
    reviewCount: 63,
    stock: 22,
    description:
      "A minimalist analog watch with a genuine leather strap and scratch-resistant glass face.",
    images: [productImages.real16],
    price: 32000,
    compareAt: null,
    variants: [
      {
        name: "Color",
        key: "color",
        options: [
          { label: "Black", value: "black", image: productImages.real16, swatch: "#1a1a1a" },
          { label: "Brown", value: "brown", image: productImages.real21, swatch: "#5c3a21" },
        ],
      },
    ],
  },
];

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getRelatedProducts(product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, limit);
}

// Builds a stable composite id + human label for a specific variant selection,
// and resolves the image that selection should display (falls back to the
// product's default image when the chosen options don't carry their own).
export function resolveVariant(product, selected) {
  if (!product.variants || product.variants.length === 0) {
    return { variantId: null, variantLabel: null, image: product.images[0], price: product.price };
  }

  const parts = [];
  const labelParts = [];
  let image = product.images[0];

  for (const group of product.variants) {
    const chosenValue = selected[group.key];
    const option = group.options.find((o) => o.value === chosenValue) || group.options[0];
    parts.push(`${group.key}-${option.value}`);
    labelParts.push(`${group.name}: ${option.label}`);
    if (option.image) image = option.image;
  }

  return {
    variantId: parts.join("|"),
    variantLabel: labelParts.join(" · "),
    image,
    price: product.price,
  };
}

export function defaultVariantSelection(product) {
  const selected = {};
  for (const group of product.variants || []) {
    selected[group.key] = group.options[0].value;
  }
  return selected;
}

export const savedAddresses = [
  {
    id: "addr-1",
    label: "Home",
    name: "John Doe",
    phone: "+234 803 210 5000",
    line1: "14 Danube Street, Maitama",
    city: "Abuja",
    state: "FCT",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    name: "John Doe",
    phone: "+234 803 210 5000",
    line1: "Plot 6, Gwarinpa Estate",
    city: "Abuja",
    state: "FCT",
    isDefault: false,
  },
];

export const paymentMethods = [
  {
    id: "card",
    label: "Debit / Credit Card",
    description: "Visa, Mastercard, Verve",
  },
  {
    id: "wallet",
    label: "AwaOwn Wallet",
    description: "Balance: ₦48,000.00",
  },
  {
    id: "transfer",
    label: "Bank Transfer",
    description: "Pay via your bank app",
  },
  {
    id: "pod",
    label: "Pay on Delivery",
    description: "Available in Abuja & Lagos",
  },
];

export const dummyUser = {
  name: "John Doe",
  email: "john.doe@awaown.com",
  phone: "+234 803 210 5000",
  walletBalance: 48000,
};

export const ORDER_STATUS_LABEL = {
  escrow: "Escrow Held",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const ORDER_STATUS_TONE = {
  escrow: "bg-shop-accent-1-light text-shop-accent-1",
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
};
