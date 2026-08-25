"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ShieldCheck, User } from "lucide-react";
import { getTheme, getAccent, getFontPairing } from "@/lib/partner-store-options";
import { STORE_FONT_FAMILIES } from "@/app/Components/PartnerStore/storeFonts";
import StorefrontProductCard from "@/app/Components/Product/StorefrontProductCard";

export default function PublicPartnerStorePage() {
  const storeName = useSelector((s) => s.partner.storeName);
  const storeBio = useSelector((s) => s.partner.storeBio);
  const storeProfileImage = useSelector((s) => s.partner.storeProfileImage);
  const storeBanner = useSelector((s) => s.partner.storeBanner);
  const storeProductIds = useSelector((s) => s.partner.storeProductIds);
  const ownProducts = useSelector((s) => s.partner.ownProducts);
  const themeId = useSelector((s) => s.partner.storeTheme);
  const accentId = useSelector((s) => s.partner.storeAccent);
  const fontId = useSelector((s) => s.partner.storeFont);
  const merchantProducts = useSelector((s) => s.merchant.products);
  const productDiscounts = useSelector((s) => s.partner.productDiscounts);

  const curatedProducts = merchantProducts
    .filter((p) => storeProductIds.includes(p.id))
    .map((p) => {
      const discount = productDiscounts[p.id] || 0;
      const buyerPrice = Math.max(0, p.price - (p.partnerProfitAmount || 0) - discount);
      return { ...p, price: buyerPrice };
    });
  const products = [...curatedProducts, ...ownProducts];

  const theme = getTheme(themeId);
  const accent = getAccent(accentId);
  const fontPairing = getFontPairing(fontId);
  const headingFont = STORE_FONT_FAMILIES[fontPairing.heading];
  const bodyFont = STORE_FONT_FAMILIES[fontPairing.body];

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: theme.pageBg, color: theme.textColor, fontFamily: bodyFont.style.fontFamily }}
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-4 py-8">
        {/* Banner */}
        <div
          className="relative h-40 w-full overflow-hidden rounded-[20px] sm:h-56"
          style={{
            backgroundColor: accent.value,
            backgroundImage: storeBanner ? `url(${storeBanner})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {storeBanner && <div className="absolute inset-0 bg-black/25" />}
        </div>

        {/* Identity card, overlapping the banner */}
        <div
          className="-mt-16 flex flex-col gap-5 rounded-[16px] border p-5 sm:-mt-20 sm:flex-row sm:items-end sm:gap-5"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
        >
          <div
            className="relative -mt-16 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 shadow sm:-mt-20 sm:h-28 sm:w-28"
            style={{ borderColor: theme.cardBg, backgroundColor: accent.value }}
          >
            {storeProfileImage ? (
              <img src={storeProfileImage} alt={storeName} className="h-full w-full object-cover" />
            ) : (
              <User className="h-9 w-9 text-white" strokeWidth={1.75} />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h1
                className="text-[20px] font-bold sm:text-[24px]"
                style={{ fontFamily: headingFont.style.fontFamily, color: theme.textColor }}
              >
                {storeName}
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-700">
                Store Open
              </span>
            </div>
            <p className="max-w-[560px] pt-2 text-[13px] leading-[19px]" style={{ color: theme.subtleText }}>
              {storeBio || "Curated picks, shared with you on AwaOwn."}
            </p>
            <p className="pt-2 text-[12px] font-semibold" style={{ color: theme.subtleText }}>
              Powered by AwaOwn
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-semibold" style={{ color: theme.textColor, fontFamily: headingFont.style.fontFamily }}>
            Products
          </p>
          {products.length === 0 ? (
            <p className="py-16 text-center text-[13px]" style={{ color: theme.subtleText }}>
              This store doesn&apos;t have any products yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <StorefrontProductCard key={product.id} product={product} accentColor={accent.value} />
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
          <Link
            href="/"
            className="mt-1 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white"
            style={{ backgroundColor: accent.value }}
          >
            Shop the Full AwaOwn Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
