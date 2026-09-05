"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShieldCheck, User, Clock, Loader2 } from "lucide-react";
import { getTheme, getAccent, getFontPairing } from "@/lib/partner-store-options";
import { STORE_FONT_FAMILIES } from "@/app/Components/PartnerStore/storeFonts";
import PublicStoreProductCard from "@/app/Components/Product/PublicStoreProductCard";
import { useGetPartnerStorefrontQuery } from "@/lib/api/storefrontApi";

export default function PublicPartnerStorePage() {
  const { code } = useParams();
  const { data: store, isLoading, isError } = useGetPartnerStorefrontQuery(code);

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
        <Link
          href="/"
          className="mt-2 rounded-full bg-shop-accent-1 px-5 py-2.5 text-[13px] font-semibold text-white"
        >
          Go to AwaOwn
        </Link>
      </div>
    );
  }

  const products = store.products ?? [];

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: theme.pageBg,
        color: theme.textColor,
        fontFamily: bodyFont.style.fontFamily,
      }}
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-4 py-8">
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
              This store doesn&apos;t have any products yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <PublicStoreProductCard
                  key={product.slug}
                  product={product}
                  href={`/product/${product.slug}?ref=${store.code}`}
                  accentColor={accent.value}
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
    </div>
  );
}
