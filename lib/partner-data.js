// Dummy data for the AwaOwn partner dashboard.
// Terminology per the project spec: no "affiliate"/"commission" — partners make
// profit from reselling products at a partner discount. AwaOwn keeps 20% of a
// partner's profit share as a platform fee (see lib/payout-banks.js).

import { productImages, formatPrice } from "@/lib/shop-data";
import { PLATFORM_PARTNER_FEE_RATE } from "@/lib/payout-banks";

export { formatPrice };

export function splitPartnerProfit(grossProfit) {
  const platformFee = Math.round(grossProfit * PLATFORM_PARTNER_FEE_RATE);
  return { grossProfit, platformFee, netProfit: grossProfit - platformFee };
}

export const partnerProfile = {
  name: "John Doe",
  referralCode: "JOHNDOE15",
  referralLink: "https://awaown.com/store/JOHNDOE15",
  totalReferrals: 34,
};

// Earnings history: gross profit is what the merchant set aside for partners on
// that sale; AwaOwn keeps a 20% platform fee out of it; the rest is the partner's
// net profit. "escrow" = still held pending delivery confirmation, "cleared" =
// released and available in the partner's wallet balance.
export const earningsSeed = [
  {
    id: "ern-1",
    product: "Classic Court Sneakers",
    saleAmount: 28000,
    ...splitPartnerProfit(4500),
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "cleared",
  },
  {
    id: "ern-2",
    product: "Ankara Print Maxi Dress",
    saleAmount: 15000,
    ...splitPartnerProfit(2500),
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "cleared",
  },
  {
    id: "ern-3",
    product: "Premium Human Hair Bundle",
    saleAmount: 35000,
    ...splitPartnerProfit(5000),
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "escrow",
  },
];

export const earnableProductImages = {
  "Ankara Print Maxi Dress": productImages.dress,
  "Classic Court Sneakers": productImages.sneakerWhite,
  "Wireless Earbuds Pro": productImages.earbuds,
  "Aviator Sunglasses": productImages.glasses,
  "Glow Cosmetics Gift Set": productImages.cosmetics,
  "Premium Human Hair Bundle": productImages.hair,
};

export const EARNING_STATUS_LABEL = {
  escrow: "In Escrow",
  cleared: "Cleared",
};

export const EARNING_STATUS_TONE = {
  escrow: "bg-amber-100 text-amber-700",
  cleared: "bg-emerald-100 text-emerald-700",
};
