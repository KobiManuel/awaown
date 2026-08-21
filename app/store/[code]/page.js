"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { ShieldCheck, Package, User } from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";
import { getTheme, getAccent, getFontPairing } from "@/lib/partner-store-options";
import { STORE_FONT_FAMILIES } from "@/app/Components/PartnerStore/storeFonts";

export default function PublicPartnerStorePage() {
  const storeName = useSelector((s) => s.partner.storeName);
  const storeBio = useSelector((s) => s.partner.storeBio);
  const storeProfileImage = useSelector((s) => s.partner.storeProfileImage);
  const storeBanner = useSelector((s) => s.partner.storeBanner);
  const storeProductIds = useSelector((s) => s.partner.storeProductIds);
  const themeId = useSelector((s) => s.partner.storeTheme);
  const accentId = useSelector((s) => s.partner.storeAccent);
  const fontId = useSelector((s) => s.partner.storeFont);
  const merchantProducts = useSelector((s) => s.merchant.products);

  const products = merchantProducts.filter((p) => storeProductIds.includes(p.id));
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
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-4 py-10">
        <div
          className="relative flex flex-col items-center gap-3 overflow-hidden rounded-[20px] p-8 text-center"
          style={{
            backgroundColor: accent.value,
            backgroundImage: storeBanner ? `url(${storeBanner})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {storeBanner && <div className="absolute inset-0 bg-black/30" />}
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/20">
            {storeProfileImage ? (
              <img src={storeProfileImage} alt={storeName} className="h-full w-full object-cover" />
            ) : (
              <User className="h-7 w-7 text-white" strokeWidth={1.75} />
            )}
          </div>
          <h1
            className="relative text-[22px] font-bold text-white"
            style={{ fontFamily: headingFont.style.fontFamily }}
          >
            {storeName}
          </h1>
          <p className="relative text-[13px] text-white/85">
            {storeBio || "Curated picks, shared with you on AwaOwn"}
          </p>
        </div>

        <p className="text-center text-[11px]" style={{ color: theme.subtleText }}>
          Powered by AwaOwn
        </p>

        {products.length === 0 ? (
          <p className="py-16 text-center text-[13px]" style={{ color: theme.subtleText }}>
            This store doesn&apos;t have any products yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col overflow-hidden rounded-[14px] border"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <div
                  className="relative flex aspect-square w-full items-center justify-center"
                  style={{ backgroundColor: theme.pageBg }}
                >
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain p-4"
                      sizes="200px"
                    />
                  ) : (
                    <Package className="h-8 w-8" style={{ color: theme.subtleText }} strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <p
                    className="line-clamp-1 text-[12.5px] font-medium"
                    style={{ color: theme.textColor }}
                  >
                    {product.title}
                  </p>
                  <p className="text-[13.5px] font-semibold" style={{ color: accent.value }}>
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

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
