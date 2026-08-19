"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, Loader2, MapPin, Check } from "lucide-react";
import { savedAddresses, paymentMethods, formatPrice } from "@/lib/dashboard-data";
import { placeOrder, generateOrderId } from "@/lib/store/ordersSlice";
import { clearCart } from "@/lib/store/cartSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { PaystackLogo } from "@/app/Components/Icons/BrandLogos";

const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 1500;

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);

  const [addressId, setAddressId] = useState(
    savedAddresses.find((a) => a.isDefault)?.id || savedAddresses[0]?.id,
  );
  const [payment, setPayment] = useState(paymentMethods[0].id);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!placing && items.length === 0) {
      router.replace("/dashboard/cart");
    }
  }, [items.length, placing, router]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (placing || items.length === 0) return;
    setPlacing(true);
    const orderId = generateOrderId();
    const address = savedAddresses.find((a) => a.id === addressId);

    setTimeout(() => {
      dispatch(
        placeOrder({
          id: orderId,
          items: items.map((i) => ({
            id: i.id,
            title: i.title,
            image: i.image,
            variantLabel: i.variantLabel || null,
            price: i.price,
            qty: i.qty,
          })),
          subtotal,
          shipping,
          total,
          address,
          paymentMethod: payment,
        }),
      );
      dispatch(clearCart());
      router.push(`/dashboard/orders/${orderId}?placed=true`);
    }, 1400);
  };

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Checkout" backHref="/dashboard/cart" showBackOnDesktop />

      <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-8 lg:px-8">
      <div className="flex flex-col gap-5 lg:col-span-2">
      {/* Delivery address */}
      <div className="flex flex-col gap-2.5 px-4 lg:px-0">
        <p className="text-[13px] font-semibold text-shop-heading">Delivery Address</p>
        {savedAddresses.map((addr) => {
          const active = addressId === addr.id;
          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => setAddressId(addr.id)}
              className={`flex items-start gap-3 rounded-[12px] border p-3.5 text-left transition-colors ${
                active ? "border-shop-accent-1 bg-shop-accent-1-light" : "border-shop-border"
              }`}
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  active ? "bg-white" : "bg-shop-bg"
                }`}
              >
                <MapPin className="h-4 w-4 text-shop-accent-1" strokeWidth={1.75} />
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
              {active && <Check className="mt-1 h-4 w-4 shrink-0 text-shop-accent-1" />}
            </button>
          );
        })}
      </div>

      {/* Payment method */}
      <div className="flex flex-col gap-2.5 px-4 lg:px-0">
        <p className="text-[13px] font-semibold text-shop-heading">Payment Method</p>
        {paymentMethods.map((method) => {
          const active = payment === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setPayment(method.id)}
              className={`flex items-center justify-between rounded-[12px] border p-3.5 text-left transition-colors ${
                active ? "border-shop-accent-1 bg-shop-accent-1-light" : "border-shop-border"
              }`}
            >
              <div className="flex items-center gap-3">
                {method.id === "card" && <PaystackLogo className="h-8 w-8 shrink-0" />}
                <div>
                  <p className="text-[13px] font-semibold text-shop-heading">{method.label}</p>
                  <p className="text-[12px] text-shop-text">{method.description}</p>
                </div>
              </div>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? "border-shop-accent-1" : "border-shop-border"
                }`}
              >
                {active && <span className="h-2.5 w-2.5 rounded-full bg-shop-accent-1" />}
              </span>
            </button>
          );
        })}
      </div>

      </div>

      <div className="flex flex-col gap-4 px-4 lg:sticky lg:top-24 lg:col-span-1 lg:px-0">
      {/* Escrow explainer */}
      <div className="flex items-start gap-3 rounded-[12px] bg-shop-bg p-3.5">
        <ShieldCheck className="h-5 w-5 shrink-0 text-shop-accent-1" strokeWidth={1.75} />
        <p className="text-[12px] leading-[18px] text-shop-text">
          Your payment is held securely in <strong className="text-shop-heading">Escrow</strong>{" "}
          and only released to the merchant after you confirm delivery.
        </p>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-2 rounded-[14px] border border-shop-border p-4">
        <p className="mb-1 text-[13px] font-semibold text-shop-heading">Order Summary</p>
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between text-[12.5px] text-shop-text">
            <span className="line-clamp-1 pr-2">
              {i.title} × {i.qty}
            </span>
            <span className="shrink-0 font-medium text-shop-heading">
              {formatPrice(i.price * i.qty)}
            </span>
          </div>
        ))}
        <div className="mt-1 flex items-center justify-between border-t border-shop-border pt-2 text-[13px] text-shop-text">
          <span>Subtotal</span>
          <span className="font-medium text-shop-heading">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px] text-shop-text">
          <span>Shipping</span>
          <span className="font-medium text-shop-heading">
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-shop-border pt-2 text-[14px] font-semibold text-shop-heading">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={placing || items.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {placing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Placing your order...
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
