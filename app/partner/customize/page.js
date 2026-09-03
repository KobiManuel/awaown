"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ImagePlus, User, Eye, RotateCcw, Check, Loader2 } from "lucide-react";
import { useMediaUpload } from "@/lib/api/mediaApi";
import {
  STORE_THEMES,
  STORE_ACCENTS,
  STORE_FONTS,
  STORE_CUSTOMIZATION_DEFAULTS,
} from "@/lib/partner-store-options";
import { STORE_FONT_FAMILIES } from "@/app/Components/PartnerStore/storeFonts";
import { buildPartnerThemeVars } from "@/lib/partner-theme-vars";
import { useThemePreview } from "@/app/Components/Dashboard/ThemePreviewContext";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import {
  useGetPartnerOverviewQuery,
  useSavePartnerCustomizationMutation,
} from "@/lib/api/partnerApi";
import { errorMessage } from "@/lib/api/errorMessage";

function fromProfile(p) {
  return {
    storeName: p?.storeName ?? "",
    storeBio: p?.bio ?? "",
    storeProfileImage: p?.profileImageUrl ?? null,
    storeBanner: p?.bannerUrl ?? null,
    storeTheme: p?.theme ?? STORE_CUSTOMIZATION_DEFAULTS.theme,
    storeAccent: p?.accent ?? STORE_CUSTOMIZATION_DEFAULTS.accent,
    storeFont: p?.font ?? STORE_CUSTOMIZATION_DEFAULTS.font,
  };
}

export default function PartnerCustomizePage() {
  const showToast = useToast();
  const setThemePreview = useThemePreview();
  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const { data: overview } = useGetPartnerOverviewQuery();
  const [saveCustomization, { isLoading: saving }] =
    useSavePartnerCustomizationMutation();
  const { upload: uploadStoreImage, uploading: imageUploading } =
    useMediaUpload("stores");

  const saved = fromProfile(overview?.profile);
  const [draft, setDraft] = useState(null);
  const refCode = overview?.profile?.referralCode;

  useEffect(() => {
    if (overview?.profile && !draft) setDraft(fromProfile(overview.profile));
  }, [overview, draft]);

  // Live-reskins the whole Partner dashboard shell as the draft theme changes,
  // reverting to the saved theme the moment this page is left without saving.
  useEffect(() => {
    if (!draft) return;
    setThemePreview(
      buildPartnerThemeVars(draft.storeTheme, draft.storeAccent, draft.storeFont),
    );
    return () => setThemePreview(null);
  }, [draft, setThemePreview]);

  if (!draft) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-shop-accent-1" />
      </div>
    );
  }

  const { storeName, storeBio, storeProfileImage, storeBanner, storeTheme, storeAccent, storeFont } = draft;
  const isDirty = Object.keys(saved).some((key) => saved[key] !== draft[key]);

  const update = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleProfileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await uploadStoreImage(file);
    if (url) update({ storeProfileImage: url });
    else showToast("Image upload failed");
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await uploadStoreImage(file);
    if (url) update({ storeBanner: url });
    else showToast("Image upload failed");
  };

  const handleReset = () => {
    setDraft({
      ...draft,
      storeProfileImage: null,
      storeBanner: null,
      storeBio: "",
      storeTheme: STORE_CUSTOMIZATION_DEFAULTS.theme,
      storeAccent: STORE_CUSTOMIZATION_DEFAULTS.accent,
      storeFont: STORE_CUSTOMIZATION_DEFAULTS.font,
    });
  };

  const handleSave = async () => {
    try {
      await saveCustomization({
        storeName: draft.storeName,
        bio: draft.storeBio,
        profileImageUrl: draft.storeProfileImage,
        bannerUrl: draft.storeBanner,
        theme: draft.storeTheme,
        accent: draft.storeAccent,
        font: draft.storeFont,
      }).unwrap();
      showToast("Store changes saved");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader
        title="Customize My Store"
        backHref="/partner/account"
        showBackOnDesktop
        right={
          <Link
            href={refCode ? `/store/${refCode}` : "#"}
            target="_blank"
            className="flex items-center gap-1.5 text-[12px] font-semibold text-shop-accent-1"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Link>
        }
      />

      <div className="flex flex-col gap-6 px-4 lg:px-0">
        <p className="rounded-[10px] bg-shop-bg p-3.5 text-[12px] leading-[18px] text-shop-text">
          Make your store feel like yours — customers will still recognize it&apos;s
          powered by AwaOwn, and every purchase stays protected by AwaOwn&apos;s
          payment protection policy.
        </p>

        {isDirty && (
          <p className="flex items-center gap-1.5 rounded-[10px] bg-amber-50 p-3 text-[12px] text-amber-800">
            Your dashboard is showing these changes live — they won&apos;t apply for
            your visitors, or stay after you leave this page, until you hit Save
            Changes.
          </p>
        )}

        {/* Banner + profile image */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-shop-heading">Banner Image</p>
          <div
            className="relative flex h-28 items-end overflow-hidden rounded-[14px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 bg-cover bg-center"
            style={storeBanner ? { backgroundImage: `url(${storeBanner})` } : undefined}
          >
            <div className="absolute inset-0 bg-black/10" />
            <button
              type="button"
              onClick={() => profileInputRef.current?.click()}
              className="absolute left-3 bottom-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow"
            >
              {storeProfileImage ? (
                <img src={storeProfileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-6 w-6 text-shop-text/50" />
              )}
            </button>
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              disabled={imageUploading}
              className="relative m-3 ml-auto flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-shop-heading disabled:opacity-60"
            >
              {imageUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {storeBanner ? "Change Banner" : "Add Banner"}
            </button>
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
            <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileChange} />
          </div>
          <p className="text-[11px] text-shop-text/60">Tap the circle to set your profile image.</p>
        </div>

        {/* Store name + bio */}
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-shop-heading">Store Name</span>
            <input
              value={storeName}
              onChange={(e) => update({ storeName: e.target.value })}
              className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-shop-heading">Store Bio</span>
            <textarea
              value={storeBio}
              onChange={(e) => update({ storeBio: e.target.value })}
              rows={2}
              placeholder="Tell visitors what your store is about"
              className="resize-none rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
            />
          </label>
        </div>

        {/* Theme */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-shop-heading">Theme</p>
          <div className="grid grid-cols-3 gap-2.5">
            {STORE_THEMES.map((theme) => {
              const active = storeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => update({ storeTheme: theme.id })}
                  className={`flex flex-col gap-2 rounded-[12px] border p-2.5 text-left transition-colors ${
                    active ? "border-shop-accent-1" : "border-shop-border"
                  }`}
                >
                  <div
                    className="flex h-10 w-full items-center justify-center rounded-[8px] border"
                    style={{ backgroundColor: theme.pageBg, borderColor: theme.border }}
                  >
                    <div
                      className="h-5 w-5 rounded-full"
                      style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
                    />
                  </div>
                  <span className="flex items-center gap-1 text-[11.5px] font-medium text-shop-heading">
                    {active && <Check className="h-3 w-3 text-shop-accent-1" />}
                    {theme.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-shop-heading">Accent Color</p>
          <div className="flex flex-wrap gap-3">
            {STORE_ACCENTS.map((accent) => {
              const active = storeAccent === accent.id;
              return (
                <button
                  key={accent.id}
                  type="button"
                  onClick={() => update({ storeAccent: accent.id })}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      active ? "ring-2 ring-offset-2 ring-shop-heading" : ""
                    }`}
                    style={{ backgroundColor: accent.value }}
                  >
                    {active && <Check className="h-4 w-4 text-white" />}
                  </span>
                  <span className="text-[11px] text-shop-text">{accent.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font pairing */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-shop-heading">Fonts</p>
          <div className="flex flex-col gap-2">
            {STORE_FONTS.map((pair) => {
              const active = storeFont === pair.id;
              const headingFont = STORE_FONT_FAMILIES[pair.heading];
              const bodyFont = STORE_FONT_FAMILIES[pair.body];
              return (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => update({ storeFont: pair.id })}
                  className={`flex items-center justify-between rounded-[10px] border p-3 text-left transition-colors ${
                    active ? "border-shop-accent-1 bg-shop-accent-1-light" : "border-shop-border"
                  }`}
                >
                  <div>
                    <p
                      className="text-[15px] font-semibold text-shop-heading"
                      style={{ fontFamily: headingFont.style.fontFamily }}
                    >
                      {pair.label} heading
                    </p>
                    <p
                      className="text-[12px] text-shop-text"
                      style={{ fontFamily: bodyFont.style.fontFamily }}
                    >
                      Body text sample for your store
                    </p>
                  </div>
                  {active && <Check className="h-4 w-4 shrink-0 text-shop-accent-1" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-shop-border py-3 text-[13px] font-semibold text-shop-text hover:bg-shop-bg"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-shop-accent-1 py-3 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-shop-border disabled:text-shop-text/60"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
