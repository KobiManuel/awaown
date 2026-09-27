// Real bank list for merchant payouts and partner withdrawals now comes from
// Paystack (lib/api/paymentsApi.js's useGetBanksQuery) instead of a hardcoded
// stand-in here.

export const PLATFORM_PARTNER_FEE_RATE = 0.2; // AwaOwn keeps 20% of a partner's profit share
export const MERCHANT_PAYOUT_FEE_RATE = 0.025; // 2.5% processing fee on merchant withdrawals
