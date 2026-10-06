"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ShieldCheck,
  Minus,
  Plus,
  X,
  PackageSearch,
  Zap,
  Tag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "@/lib/shop-data";
import { NIGERIAN_STATES, CITIES_BY_STATE } from "@/lib/merchant-data";
import { isValidNigerianPhone } from "@/lib/phone";
import { useCommerce } from "@/lib/useCommerce";
import { useAuthBootstrap } from "@/lib/api/useAuthBootstrap";
import { clearCart } from "@/lib/store/cartSlice";
import { readBuyNow, clearBuyNow } from "@/lib/express-checkout";
import { useGetProductQuery } from "@/lib/api/catalogApi";
import {
  useGuestCheckoutDirectMutation,
  useGuestConfirmPaymentMutation,
  useGetGuestShippingQuoteQuery,
  useGuestPreviewCouponMutation,
} from "@/lib/api/ordersApi";
import { errorMessage } from "@/lib/api/errorMessage";
import { openPaystackPopup } from "@/lib/paystack";
import FezDeliveryBanner from "@/app/Components/Delivery/FezDeliveryBanner";
import { trackMetaEvent } from "@/lib/metaPixel";

const FIELD =
  "w-full rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-shop-accent-1";

const METHODS = [
  { id: "CARD", label: "Debit / Credit Card" },
  { id: "TRANSFER", label: "Bank Transfer" },
];

// Shown only while the real quote is loading, or if it fails - the actual
// charge always comes from the backend's own computeShipping() at checkout.
const SHIPPING_FEE_FALLBACK = 5000;

function CheckoutInner() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const commerce = useCommerce();
  const { resolving, authed } = useAuthBootstrap("customer");

  // "Buy Now" mode: one item, read from the tab, never from the cart - same
  // stash /dashboard/checkout reads for a signed-in buyer.
  const [buyNow] = useState(() =>
    searchParams.get("mode") === "buynow" ? readBuyNow() : null,
  );
  const isBuyNow = !!buyNow;

  const cartItems = useSelector((s) => s.cart.items);
  const { data: bnProduct, isLoading: bnLoading } = useGetProductQuery(
    buyNow?.slug,
    { skip: !isBuyNow },
  );

  // A signed-in shopper has an account checkout (saved addresses, wallet) -
  // this page is guest-only, so bounce them there once we know who they are.
  useEffect(() => {
    if (!resolving && authed) {
      router.replace(
        isBuyNow ? "/dashboard/checkout?mode=buynow" : "/dashboard/checkout",
      );
    }
  }, [resolving, authed, isBuyNow, router]);

  const [guestCheckoutDirect, checkoutState] = useGuestCheckoutDirectMutation();
  const [guestConfirmPayment] = useGuestConfirmPaymentMutation();
  const [previewCoupon, previewCouponState] = useGuestPreviewCouponMutation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    line1: "",
    city: "",
    state: NIGERIAN_STATES[0],
  });
  const [payment, setPayment] = useState("CARD");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount }
  const [couponError, setCouponError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setAddressState = (e) => {
    const state = e.target.value;
    setForm((f) => ({
      ...f,
      state,
      city: CITIES_BY_STATE[state]?.includes(f.city) ? f.city : "",
    }));
  };
  const cityOptions = CITIES_BY_STATE[form.state] ?? [];

  const buyNowLine = useMemo(() => {
    if (!isBuyNow || !bnProduct) return null;
    const variant = buyNow.variantId
      ? (bnProduct.variants ?? []).find((v) => v.id === buyNow.variantId)
      : null;
    const unitPrice = variant?.price ?? bnProduct.price;
    const qty = Math.max(1, buyNow.qty || 1);
    return {
      id: "buynow",
      productId: bnProduct.productId,
      variantId: buyNow.variantId ?? null,
      ref: buyNow.ref ?? null,
      title: bnProduct.title,
      image: bnProduct.images?.[0] ?? null,
      deliveryType: bnProduct.deliveryType,
      qty,
      maxQty: variant?.maxQty ?? bnProduct.maxQty ?? null,
      lineTotal: unitPrice * qty,
      price: unitPrice,
    };
  }, [isBuyNow, bnProduct, buyNow]);

  const loading = isBuyNow ? bnLoading : false;
  const checkoutItems = isBuyNow ? (buyNowLine ? [buyNowLine] : []) : cartItems;
  const checkoutSubtotal = isBuyNow
    ? (buyNowLine?.lineTotal ?? 0)
    : checkoutItems.reduce((s, i) => s + i.price * i.qty, 0);

  const isDigitalOnly =
    checkoutItems.length > 0 &&
    checkoutItems.every((i) => i.deliveryType === "DIGITAL");

  const phoneValid = isValidNigerianPhone(form.phone);
  const isValid =
    form.name.trim().length > 1 &&
    phoneValid &&
    /\S+@\S+\.\S+/.test(form.email) &&
    (isDigitalOnly ||
      (form.line1.trim().length > 3 && form.city.trim().length > 1));

  const { data: shippingQuote, isFetching: shippingLoading } =
    useGetGuestShippingQuoteQuery(
      {
        items: checkoutItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          qty: i.qty,
        })),
        state: form.state,
      },
      { skip: isDigitalOnly || !checkoutItems.length },
    );
  const shipping =
    checkoutItems.length && !isDigitalOnly
      ? (shippingQuote?.shipping ?? SHIPPING_FEE_FALLBACK)
      : 0;
  const freeShipping = !!shippingQuote?.freeShipping;
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, checkoutSubtotal - discount) + shipping;

  const applyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    setCouponError("");
    try {
      const res = await previewCoupon({
        couponCode: code,
        items: checkoutItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          qty: i.qty,
        })),
      }).unwrap();
      if (res.valid) {
        setAppliedCoupon({ code: res.couponCode ?? code, discount: res.discount });
      } else {
        setAppliedCoupon(null);
        setCouponError(res.message || "That coupon code is not valid");
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(errorMessage(err));
    }
  };

  const onCouponChange = (value) => {
    setCoupon(value.toUpperCase());
    if (appliedCoupon) setAppliedCoupon(null);
    if (couponError) setCouponError("");
  };

  const finishOrder = async (reference) => {
    try {
      await guestConfirmPayment({ reference, phone: form.phone }).unwrap();
    } catch {
      // payment may still be settling - the order lookup page shows the real state
    }
    if (isBuyNow) clearBuyNow();
    else dispatch(clearCart());
    router.push(
      `/orders/track/${reference}?phone=${encodeURIComponent(form.phone)}&placed=true`,
    );
  };

  const placeOrder = async () => {
    if (busy || !isValid || !checkoutItems.length || shippingLoading) return;
    setError("");
    setBusy(true);
    trackMetaEvent("InitiateCheckout", {
      content_ids: checkoutItems.map((i) => i.productId),
      content_type: "product",
      num_items: checkoutItems.length,
      value: total,
      currency: "NGN",
    });
    try {
      const res = await guestCheckoutDirect({
        items: checkoutItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          qty: i.qty,
          ref: i.ref || undefined,
        })),
        address: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          ...(isDigitalOnly
            ? {}
            : {
                line1: form.line1.trim(),
                city: form.city.trim(),
                state: form.state,
              }),
        },
        paymentMethod: payment,
        couponCode: appliedCoupon?.code || undefined,
      }).unwrap();

      const reference = res.reference;
      const pay = res.payment;

      if (pay?.provider === "paystack" && pay.accessCode) {
        await openPaystackPopup({
          accessCode: pay.accessCode,
          fallbackUrl: pay.authorizationUrl,
          onSuccess: () => finishOrder(reference),
          onCancel: () => {
            setBusy(false);
            setError("Payment cancelled. You can try again.");
          },
          onError: (err) => {
            setBusy(false);
            setError(err?.message || "Payment could not be completed.");
          },
        });
        return;
      }
      if (pay?.provider === "paystack" && pay.authorizationUrl) {
        window.location.href = pay.authorizationUrl;
        return;
      }

      // Only reachable if the gateway isn't configured server-side (mock
      // mode) - still a completed order, just never actually charged.
      if (isBuyNow) clearBuyNow();
      else dispatch(clearCart());
      router.push(
        `/orders/track/${reference}?phone=${encodeURIComponent(form.phone)}&placed=true`,
      );
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  if (resolving || authed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-shop-accent-1" />
      </div>
    );
  }

  if (isBuyNow && !bnLoading && !bnProduct) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center gap-3 px-4 text-center font-shop">
        <p className="text-[14px] font-semibold text-shop-heading">
          This item is no longer available
        </p>
        <Link href="/" className="text-[13px] font-semibold text-shop-accent-1 hover:underline">
          &larr; Back to AwaOwn
        </Link>
      </div>
    );
  }

  if (!loading && !checkoutItems.length) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[500px] flex-col items-center justify-center gap-4 px-4 text-center font-shop">
        <p className="text-[15px] font-semibold text-shop-heading">Your cart is empty</p>
        <Link href="/" className="text-[13px] font-semibold text-shop-accent-1 hover:underline">
          &larr; Continue shopping
        </Link>
        <Link
          href="/orders/track"
          className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-accent-1 hover:underline"
        >
          <PackageSearch className="h-3.5 w-3.5" />
          Track an order
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-8 font-shop md:py-12">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[20px] font-semibold text-shop-heading">Checkout</h1>
        <Link
          href="/orders/track"
          className="flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-shop-accent-1 hover:underline"
        >
          <PackageSearch className="h-3.5 w-3.5" />
          Track an order
        </Link>
      </div>
      <p className="mb-6 text-[12.5px] text-shop-text/70">
        No account needed. Keep your phone number handy - it&apos;s how you&apos;ll
        look up this order later.
      </p>

      <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-8">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex flex-col gap-3 rounded-[10px] bg-shop-bg p-4">
            <p className="text-[13px] font-semibold text-shop-heading">Your details</p>
            <input value={form.name} onChange={set("name")} placeholder="Full name" className={FIELD} />
            <input
              value={form.phone}
              onChange={set("phone")}
              placeholder="Phone number (e.g. 0803 123 4567)"
              inputMode="tel"
              className={FIELD}
            />
            {form.phone.length > 0 && !phoneValid && (
              <p className="-mt-1.5 text-[11.5px] text-red-600">
                Enter a valid Nigerian phone number.
              </p>
            )}
            <input
              value={form.email}
              onChange={set("email")}
              placeholder="Email address"
              inputMode="email"
              className={FIELD}
            />
          </div>

          {isDigitalOnly ? (
            <div className="flex items-start gap-3 rounded-[10px] bg-shop-bg p-3.5">
              <Zap className="h-4.5 w-4.5 shrink-0 text-shop-accent-1" />
              <p className="text-[11.5px] leading-[17px] text-shop-text">
                This order is entirely digital - no shipping address needed.
                You&apos;ll get a download link right after payment.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-[10px] bg-shop-bg p-4">
              <p className="text-[13px] font-semibold text-shop-heading">Delivery address</p>
              <input value={form.line1} onChange={set("line1")} placeholder="Street address" className={FIELD} />
              <div className="flex gap-3">
                <select value={form.state} onChange={setAddressState} className={FIELD}>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={form.city}
                  onChange={set("city")}
                  disabled={!form.state}
                  className={`${FIELD} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <option value="">{form.state ? "City" : "Select state first"}</option>
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 rounded-[10px] bg-shop-bg p-4">
            <p className="mb-1 text-[13px] font-semibold text-shop-heading">Payment Method</p>
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPayment(m.id)}
                className={`flex items-center justify-between rounded-[8px] border p-3 text-left text-[13px] font-medium text-shop-heading transition-colors ${
                  payment === m.id ? "border-shop-accent-1" : "border-shop-border"
                }`}
              >
                {m.label}
                <span
                  className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 ${
                    payment === m.id ? "border-shop-accent-1" : "border-shop-border"
                  }`}
                >
                  {payment === m.id && <span className="h-2.5 w-2.5 rounded-full bg-shop-accent-1" />}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 rounded-[10px] bg-shop-bg p-4">
            <p className="mb-1 text-[13px] font-semibold text-shop-heading">Coupon code</p>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-[8px] border border-shop-border bg-white px-3 py-2.5">
                <Tag className="h-4 w-4 text-shop-text/50" />
                <input
                  value={coupon}
                  onChange={(e) => onCouponChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyCoupon();
                    }
                  }}
                  placeholder="WELCOME10"
                  className="w-full bg-transparent text-[13.5px] uppercase text-shop-heading outline-none placeholder:text-shop-text/40"
                />
              </div>
              <button
                type="button"
                onClick={applyCoupon}
                disabled={
                  !coupon.trim() ||
                  previewCouponState.isLoading ||
                  appliedCoupon?.code === coupon.trim().toUpperCase()
                }
                className="shrink-0 rounded-[8px] bg-shop-accent-1 px-4 py-2.5 text-[12.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {previewCouponState.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
            {couponError && (
              <p className="text-[12px] font-medium text-red-600">{couponError}</p>
            )}
            {appliedCoupon && (
              <p className="text-[12px] font-medium text-emerald-600">
                &ldquo;{appliedCoupon.code}&rdquo; applied - you save{" "}
                {formatPrice(appliedCoupon.discount)}.
              </p>
            )}
          </div>

          {!isDigitalOnly && (
            <FezDeliveryBanner status="Nationwide tracked delivery" />
          )}
        </div>

        <div className="mt-4 flex flex-col gap-4 lg:mt-0">
          <div className="flex items-start gap-3 rounded-[10px] bg-shop-bg p-3.5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-shop-accent-1" />
            <p className="text-[11.5px] leading-[17px] text-shop-text">
              Your payment is held securely in Escrow and only released to the
              seller after you confirm delivery.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-[10px] bg-white p-4">
            <p className="mb-1 text-[13px] font-semibold text-shop-heading">Order Summary</p>
            {isBuyNow && (
              <p className="-mt-1 mb-1 text-[11px] text-shop-text/70">
                Buying this item now - it is not added to your cart.
              </p>
            )}
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-shop-accent-1" />
            ) : (
              checkoutItems.map((i) => (
                <div key={i.id} className="flex items-center gap-2 text-[12.5px] text-shop-text">
                  <span className="line-clamp-1 flex-1 pr-2">{i.title}</span>
                  {!isBuyNow && (
                    <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-shop-border px-1.5 py-0.5">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => commerce.updateQty(i.id, i.qty - 1)}
                        className="flex h-5 w-5 items-center justify-center hover:text-shop-accent-1"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center">{i.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={i.maxQty != null && i.qty >= i.maxQty}
                        onClick={() => commerce.updateQty(i.id, i.qty + 1)}
                        className="flex h-5 w-5 items-center justify-center hover:text-shop-accent-1 disabled:opacity-40"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <span className="w-[72px] shrink-0 text-right font-medium text-shop-heading">
                    {formatPrice(i.price * i.qty)}
                  </span>
                  {!isBuyNow && (
                    <button
                      type="button"
                      aria-label={`Remove ${i.title}`}
                      onClick={() => commerce.removeFromCart(i.id)}
                      className="shrink-0 text-shop-text/50 hover:text-shop-accent-3"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
            <div className="mt-1 flex flex-col gap-1 border-t border-shop-border pt-2 text-[13px]">
              <div className="flex items-center justify-between text-shop-text">
                <span>Subtotal</span>
                <span className="font-medium text-shop-heading">{formatPrice(checkoutSubtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              {!isDigitalOnly && (
                <div className="flex items-center justify-between text-shop-text">
                  <span>Shipping</span>
                  <span className="font-medium text-shop-heading">
                    {shippingLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-shop-text/50" />
                    ) : freeShipping ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-shop-border pt-1.5 text-[14px] font-semibold text-shop-heading">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {error && <p className="text-[13px] font-medium text-red-600">{error}</p>}

          <button
            type="button"
            onClick={placeOrder}
            disabled={busy || checkoutState.isLoading || !isValid || shippingLoading}
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

export default function CheckoutClient() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}
