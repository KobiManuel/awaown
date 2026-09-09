"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, MapPin, Check, Wallet, Tag, Zap } from "lucide-react";
import { formatPrice } from "@/lib/dashboard-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { PaystackLogo } from "@/app/Components/Icons/BrandLogos";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCartQuery, useGetAddressesQuery } from "@/lib/api/commerceApi";
import { useGetWalletQuery } from "@/lib/api/walletApi";
import { useGetProductQuery } from "@/lib/api/catalogApi";
import {
  useCheckoutMutation,
  useConfirmPaymentMutation,
} from "@/lib/api/ordersApi";
import { errorMessage } from "@/lib/api/errorMessage";
import { openPaystackPopup } from "@/lib/paystack";
import { readBuyNow, clearBuyNow } from "@/lib/express-checkout";

const SHIPPING_FEE = 1500;

const METHODS = [
  { id: "CARD", label: "Debit / Credit Card", description: "Visa, Mastercard, Verve. Secured by Paystack" },
  { id: "WALLET", label: "AwaOwn Wallet", description: "Pay from your wallet balance" },
  { id: "TRANSFER", label: "Bank Transfer", description: "Pay via your bank app" },
];

export default function CheckoutPage() {
  const router = useRouter();

  // "Buy Now" mode: one item, read from the tab, never from the cart.
  const [buyNow] = useState(() => readBuyNow());
  const isBuyNow = !!buyNow;

  const { data: cart, isLoading: cartLoading } = useGetCartQuery(undefined, {
    skip: isBuyNow,
  });
  const { data: bnProduct, isLoading: bnLoading } = useGetProductQuery(
    buyNow?.slug,
    { skip: !isBuyNow },
  );
  const { data: addresses, isLoading: addrLoading } = useGetAddressesQuery();
  const { data: wallet } = useGetWalletQuery();

  const [checkout, checkoutState] = useCheckoutMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

  const [addressId, setAddressId] = useState("");
  const [payment, setPayment] = useState("CARD");
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const buyNowLine = useMemo(() => {
    if (!isBuyNow || !bnProduct) return null;
    const variant = buyNow.variantId
      ? (bnProduct.variants ?? []).find((v) => v.id === buyNow.variantId)
      : null;
    const unitPrice = variant?.price ?? bnProduct.price;
    const qty = Math.max(1, buyNow.qty || 1);
    return {
      id: "buynow",
      title: bnProduct.title,
      qty,
      lineTotal: unitPrice * qty,
    };
  }, [isBuyNow, bnProduct, buyNow]);

  const loading = isBuyNow ? bnLoading : cartLoading;
  const items = isBuyNow ? (buyNowLine ? [buyNowLine] : []) : (cart?.items ?? []);
  const subtotal = isBuyNow
    ? (buyNowLine?.lineTotal ?? 0)
    : (cart?.subtotal ?? 0);
  const shipping = items.length ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!addressId && addresses?.length) {
      setAddressId(addresses.find((a) => a.isDefault)?.id || addresses[0].id);
    }
  }, [addresses, addressId]);

  useEffect(() => {
    if (busy || loading) return;
    if (isBuyNow) {
      // buy-now item missing / expired: send them back to the product
      if (!bnLoading && !bnProduct) {
        clearBuyNow();
        router.replace(buyNow?.slug ? `/product/${buyNow.slug}` : "/");
      }
      return;
    }
    if (items.length === 0) router.replace("/dashboard/cart");
  }, [busy, loading, isBuyNow, bnLoading, bnProduct, items.length, router, buyNow]);

  const walletShort =
    payment === "WALLET" && wallet && wallet.balance < total;

  const finishOrder = async (reference) => {
    try {
      await confirmPayment(reference).unwrap();
    } catch {
      // payment may still be settling; the order page shows the real state
    }
    router.push(`/dashboard/orders/${reference}?placed=true`);
  };

  const openPaystack = async (accessUrl, accessCode, reference) => {
    try {
      sessionStorage.setItem("awaown_pending_order", reference);
    } catch {}
    await openPaystackPopup({
      accessCode,
      fallbackUrl: accessUrl,
      onSuccess: () => finishOrder(reference),
      onCancel: () => {
        setBusy(false);
        setError(
          "Payment cancelled. Your order is saved, and you can pay from the order page.",
        );
        router.push(`/dashboard/orders/${reference}`);
      },
      onError: (err) => {
        setBusy(false);
        setError(err?.message || "Payment could not be completed.");
      },
    });
  };

  const placeOrder = async () => {
    if (busy || !items.length) return;
    setError("");
    setBusy(true);
    try {
      const res = await checkout({
        addressId,
        paymentMethod: payment,
        couponCode: coupon.trim() || undefined,
        buyNow: isBuyNow
          ? {
              productId: buyNow.productId,
              variantId: buyNow.variantId || undefined,
              qty: Math.max(1, buyNow.qty || 1),
              ref: buyNow.ref || undefined,
            }
          : undefined,
      }).unwrap();
      if (isBuyNow) clearBuyNow();

      const reference = res.reference;
      const pay = res.payment;

      if (pay?.provider === "paystack" && pay.accessCode) {
        await openPaystack(pay.authorizationUrl, pay.accessCode, reference);
        return;
      }
      if (pay?.provider === "paystack" && pay.authorizationUrl) {
        try {
          sessionStorage.setItem("awaown_pending_order", reference);
        } catch {}
        window.location.href = pay.authorizationUrl;
        return;
      }

      // mock gateway (dev) or wallet: no popup needed
      if (pay) {
        await confirmPayment(reference).unwrap();
      }
      router.push(`/dashboard/orders/${reference}?placed=true`);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title={isBuyNow ? "Express Checkout" : "Checkout"}
        backHref={
          isBuyNow && buyNow?.slug
            ? `/product/${buyNow.slug}`
            : "/dashboard/cart"
        }
        showBackOnDesktop
      />

      <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-8 lg:px-8">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <div className="flex flex-col gap-2.5 px-4 lg:px-0">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-shop-heading">
                Delivery Address
              </p>
              <Link
                href="/dashboard/addresses"
                className="text-[12px] font-semibold text-shop-accent-1"
              >
                Manage
              </Link>
            </div>
            {addrLoading ? (
              <Skeleton className="h-20 w-full rounded-[12px]" />
            ) : addresses?.length === 0 ? (
              <Link
                href="/dashboard/addresses"
                className="rounded-[12px] border border-dashed border-shop-border p-4 text-center text-[12.5px] text-shop-accent-1"
              >
                + Add a delivery address
              </Link>
            ) : (
              addresses.map((addr) => {
                const active = addressId === addr.id;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => setAddressId(addr.id)}
                    className={`flex items-start gap-3 rounded-[12px] border p-3.5 text-left transition-colors ${
                      active
                        ? "border-shop-accent-1 bg-shop-accent-1-light"
                        : "border-shop-border"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        active ? "bg-white" : "bg-shop-bg"
                      }`}
                    >
                      <MapPin
                        className="h-4 w-4 text-shop-accent-1"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-shop-heading">
                        {addr.label} · {addr.name}
                      </p>
                      <p className="text-[12px] leading-[18px] text-shop-text">
                        {addr.line1}, {addr.city}, {addr.state}
                      </p>
                      <p className="text-[12px] text-shop-text/70">{addr.phone}</p>
                    </div>
                    {active && (
                      <Check className="mt-1 h-4 w-4 shrink-0 text-shop-accent-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex flex-col gap-2.5 px-4 lg:px-0">
            <p className="text-[13px] font-semibold text-shop-heading">
              Payment Method
            </p>
            {METHODS.map((method) => {
              const active = payment === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPayment(method.id)}
                  className={`flex items-center justify-between rounded-[12px] border p-3.5 text-left transition-colors ${
                    active
                      ? "border-shop-accent-1 bg-shop-accent-1-light"
                      : "border-shop-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {method.id === "CARD" && (
                      <PaystackLogo className="h-8 w-8 shrink-0" />
                    )}
                    {method.id === "WALLET" && (
                      <Wallet className="h-6 w-6 shrink-0 text-shop-accent-1" />
                    )}
                    <div>
                      <p className="text-[13px] font-semibold text-shop-heading">
                        {method.label}
                      </p>
                      <p className="text-[12px] text-shop-text">
                        {method.id === "WALLET" && wallet
                          ? `Balance: ${formatPrice(wallet.balance)}`
                          : method.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? "border-shop-accent-1" : "border-shop-border"
                    }`}
                  >
                    {active && (
                      <span className="h-2.5 w-2.5 rounded-full bg-shop-accent-1" />
                    )}
                  </span>
                </button>
              );
            })}
            {walletShort && (
              <p className="text-[12px] font-medium text-red-600">
                Wallet balance is too low. Top up or pick another method.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 px-4 lg:px-0">
            <p className="text-[13px] font-semibold text-shop-heading">
              Coupon code
            </p>
            <div className="flex items-center gap-2 rounded-[10px] border border-shop-border px-3 py-2.5">
              <Tag className="h-4 w-4 text-shop-text/50" />
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="WELCOME10"
                className="w-full bg-transparent text-[13px] uppercase text-shop-heading outline-none placeholder:text-shop-text/40"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-4 lg:sticky lg:top-24 lg:col-span-1 lg:px-0">
          <div className="flex items-start gap-3 rounded-[12px] bg-shop-bg p-3.5">
            <ShieldCheck
              className="h-5 w-5 shrink-0 text-shop-accent-1"
              strokeWidth={1.75}
            />
            <p className="text-[12px] leading-[18px] text-shop-text">
              Your payment is held securely in{" "}
              <strong className="text-shop-heading">Escrow</strong> and only
              released to the merchant after you confirm delivery.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-[14px] border border-shop-border p-4">
            <p className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
              {isBuyNow && <Zap className="h-3.5 w-3.5 text-shop-accent-1" />}
              Order Summary
            </p>
            {isBuyNow && (
              <p className="-mt-1 mb-1 text-[11px] text-shop-text/70">
                Buying this item now - it is not added to your cart.
              </p>
            )}
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              items.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between text-[12.5px] text-shop-text"
                >
                  <span className="line-clamp-1 pr-2">
                    {i.title} × {i.qty}
                  </span>
                  <span className="shrink-0 font-medium text-shop-heading">
                    {formatPrice(i.lineTotal)}
                  </span>
                </div>
              ))
            )}
            <div className="mt-1 flex items-center justify-between border-t border-shop-border pt-2 text-[13px] text-shop-text">
              <span>Subtotal</span>
              <span className="font-medium text-shop-heading">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-shop-text">
              <span>Shipping</span>
              <span className="font-medium text-shop-heading">
                {formatPrice(shipping)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-shop-border pt-2 text-[14px] font-semibold text-shop-heading">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {error && (
            <p className="text-[13px] font-medium text-red-600">{error}</p>
          )}

          <button
            type="button"
            onClick={placeOrder}
            disabled={
              busy ||
              checkoutState.isLoading ||
              !items.length ||
              !addressId ||
              walletShort
            }
            className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy || checkoutState.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Placing your order…
              </>
            ) : (
              `Place Order · ${formatPrice(total)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
