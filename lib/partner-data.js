// Dummy data for the AwaOwn partner (member) dashboard.
// Terminology per the project spec: no "affiliate"/"commission" — partners make
// profit from reselling products at a member discount.

import { productImages, formatPrice } from "@/lib/shop-data";

export { formatPrice };

const PROFIT_RATE = 0.15;

function withProfit(publicPrice) {
  const memberProfit = Math.round(publicPrice * PROFIT_RATE);
  return {
    publicPrice,
    memberDiscount: publicPrice - memberProfit,
    memberProfit,
  };
}

export const partnerProfile = {
  name: "John Doe",
  referralCode: "JOHNDOE15",
  referralLink: "https://awaown.com/r/JOHNDOE15",
  walletBalance: 36500,
  totalProfit: 128400,
  pendingProfit: 18200,
  totalReferrals: 34,
};

export const earnableProducts = [
  {
    id: "pp-1",
    title: "Ankara Print Maxi Dress",
    image: productImages.dress,
    ...withProfit(15000),
  },
  {
    id: "pp-2",
    title: "Classic Court Sneakers",
    image: productImages.sneakerWhite,
    ...withProfit(28000),
  },
  {
    id: "pp-3",
    title: "Premium Human Hair Bundle",
    image: productImages.hair,
    ...withProfit(35000),
  },
  {
    id: "pp-4",
    title: "Aviator Sunglasses",
    image: productImages.glasses,
    ...withProfit(12000),
  },
  {
    id: "pp-5",
    title: "Classic Leather Watch",
    image: productImages.real16,
    ...withProfit(32000),
  },
];

export const earningsSeed = [
  {
    id: "ern-1",
    product: "Classic Court Sneakers",
    saleAmount: 28000,
    profit: 4200,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "paid",
  },
  {
    id: "ern-2",
    product: "Ankara Print Maxi Dress",
    saleAmount: 15000,
    profit: 2250,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "paid",
  },
  {
    id: "ern-3",
    product: "Premium Human Hair Bundle",
    saleAmount: 35000,
    profit: 5250,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
];

export const PAYOUT_BANKS = [
  { id: "gtb", label: "GTBank •••• 4821" },
  { id: "zenith", label: "Zenith Bank •••• 0937" },
];
