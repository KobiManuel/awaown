"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { ShieldCheck, User, Clock, Loader2, PackageSearch, CheckCircle2, X } from "lucide-react";
import { getTheme, getAccent, getFontPairing } from "@/lib/partner-store-options";
import { buildPartnerThemeVars } from "@/lib/partner-theme-vars";
import { STORE_FONT_FAMILIES } from "@/app/Components/PartnerStore/storeFonts";
import ProductCard from "@/app/Components/Product/ProductCard";
import StorePattern from "@/app/Components/PartnerStore/StorePattern";
import PartnerCartButton from "@/app/Components/PartnerStore/PartnerCartButton";
import { useGetPartnerStorefrontQuery } from "@/lib/api/storefrontApi";
import { rememberRef } from "@/lib/partner-ref";

export default function PublicPartnerStorePage() {
  const { code } = useParams();
  const { data: store, isLoading, isError } = useGetPartnerStorefrontQuery(code);

  // Set the attribution cookie as soon as the store loads - a buyer can quick-add
  // straight from a card here without ever opening a product detail page, so the
  // cookie can't wait until then to exist.
  useEffect(() => {
    if (store?.code) rememberRef(store.code);
  }, [store?.code]);

  // Purely informational - never gates or redirects a guest. PublicCommerceGate
  // (mounted in the root layout for every non-dashboard route) already silently
  // tries to re-establish a customer session from the httpOnly refresh cookie on
  // every page load, so by the time this renders, Redux already knows whether
  // the visitor is a signed-in AwaOwn customer. Surfacing that here just tells
  // them their purchase will also land in their own dashboard, not just this
  // store's guest order-lookup-by-phone flow.
  const authStatus = useSelector((s) => s.auth.status);
  const authUser = useSelector((s) => s.auth.user);
  const [authBannerDismissed, setAuthBannerDismissed] = useState(false);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    const t = setTimeout(() => setAuthBannerDismissed(true), 8000);
    return () => clearTimeout(t);
  }, [authStatus]);

  const showAuthBanner =
    authStatus === "authenticated" && !!authUser && !authBannerDismissed;

  const theme = getTheme(store?.theme);
  const accent = getAccent(store?.accent);
  const fontPairing = getFontPairing(store?.font);
  const headingFont = STORE_FONT_FAMILIES[fontPairing.heading];
  const bodyFont = STORE_FONT_FAMILIES[fontPairing.body];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-shop-accent-1" />
      </div>
    );
  }

  if (isError || !store) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-8 text-center font-shop">
        <p className="text-[15px] font-semibold text-shop-heading">
          Store not found
        </p>
        <p className="text-[13px] text-shop-text">
          This partner store link may be inactive.
        </p>
      </div>
    );
  }

  const products = store.products ?? [];

  return (
    <div
      data-store-theme=""
      className="relative min-h-screen w-full"
      style={{
        ...buildPartnerThemeVars(store.theme, store.accent, store.font),
        backgroundColor: theme.pageBg,
        color: theme.textColor,
        fontFamily: bodyFont.style.fontFamily,
      }}
    >
      {authStatus === "authenticated" && authUser && (
        <div
          className={`fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-300 ${
            showAuthBanner
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0"
          }`}
        >
          <div
            className="flex w-full max-w-[420px] items-start gap-3 rounded-[14px] border p-4 shadow-lg"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
              color: theme.textColor,
            }}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accent.value}1a` }}
            >
              <CheckCircle2 className="h-4.5 w-4.5" style={{ color: accent.value }} />
            </span>
            <div className="flex-1">
              <p className="text-[13.5px] font-semibold">
                Signed in as {authUser.name?.split(" ")[0] || "you"}
              </p>
              <p
                className="mt-0.5 text-[12px] leading-[17px]"
                style={{ color: theme.subtleText }}
              >
                Any order you place here will also show up in your AwaOwn
                dashboard.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAuthBannerDismissed(true)}
              aria-label="Dismiss"
              className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      {store.pattern && store.pattern !== "none" && (
        <StorePattern
          pattern={store.pattern}
          color={accent.value}
          opacity={theme.id === "bold" ? 0.26 : 0.17}
        />
      )}
      <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-4 py-8">
        <div
          className="relative h-40 w-full overflow-hidden rounded-[20px] sm:h-56"
          style={{
            backgroundColor: accent.value,
            backgroundImage: store.bannerUrl
              ? `url(${store.bannerUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {store.bannerUrl && <div className="absolute inset-0 bg-black/25" />}
        </div>

        <div
          className="-mt-16 flex flex-col gap-5 rounded-[16px] border p-5 sm:-mt-20 sm:flex-row sm:items-end sm:gap-5"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
        >
          <div
            className="relative -mt-16 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 shadow sm:-mt-20 sm:h-28 sm:w-28"
            style={{ borderColor: theme.cardBg, backgroundColor: accent.value }}
          >
            {store.profileImageUrl ? (
              <img
                src={store.profileImageUrl}
                alt={store.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-9 w-9 text-white" strokeWidth={1.75} />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h1
                className="text-[20px] font-bold sm:text-[24px]"
                style={{
                  fontFamily: headingFont.style.fontFamily,
                  color: theme.textColor,
                }}
              >
                {store.name}
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-700">
                Store Open
              </span>
            </div>
            <p
              className="max-w-[560px] pt-2 text-[13px] leading-[19px]"
              style={{ color: theme.subtleText }}
            >
              {store.bio || "Curated picks, shared with you on AwaOwn."}
            </p>
            <div
              className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[12px] font-semibold"
              style={{ color: theme.subtleText }}
            >
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Powered by AwaOwn
              </span>
              <Link href={`/store/${store.code}/orders`} className="flex items-center gap-1 hover:underline">
                <PackageSearch className="h-3.5 w-3.5" />
                Track an order
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p
            className="text-[14px] font-semibold"
            style={{
              color: theme.textColor,
              fontFamily: headingFont.style.fontFamily,
            }}
          >
            Products
          </p>
          {products.length === 0 ? (
            <p
              className="py-16 text-center text-[13px]"
              style={{ color: theme.subtleText }}
            >
              This store doesn&apos;t have any products yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  bordered
                  hrefExtra={`?ref=${store.code}`}
                  refCode={store.code}
                  hideVendor
                />
              ))}
            </div>
          )}
        </div>

        <div
          className="flex flex-col items-center gap-2 rounded-[14px] border p-5 text-center"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
        >
          <ShieldCheck className="h-5 w-5" style={{ color: accent.value }} />
          <p className="text-[12.5px]" style={{ color: theme.subtleText }}>
            Every purchase is protected by AwaOwn&apos;s payment protection policy.
          </p>
        </div>
      </div>
      <PartnerCartButton code={store.code} />
    </div>
  );
}
