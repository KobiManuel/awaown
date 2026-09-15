"use client";

import React, { useEffect, useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { useGetAboutImagesQuery } from "@/lib/api/storefrontApi";
import { useSaveAboutImageMutation } from "@/lib/api/adminApi";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import AboutImageSlot from "@/app/about/AboutImageSlot";

const SECTIONS = [
  { key: "hero", label: "Hero banner" },
  { key: "merchants", label: "Merchants" },
  { key: "partners", label: "Partners" },
  { key: "investors", label: "Inventory Investors" },
  { key: "customers", label: "Customers" },
];

/** Same placeholder slots the public /about page shows - click one to upload,
 * then Save Changes commits them, same pattern as the rest of this page. */
export default function AboutEditor() {
  const showToast = useToast();
  const { data, isLoading } = useGetAboutImagesQuery();
  const [saveImage] = useSaveAboutImageMutation();
  const [isSaving, setIsSaving] = useState(false);

  const images = data?.images ?? {};
  const [draft, setDraft] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const ready = draft !== null;

  useEffect(() => {
    if (draft === null && data) {
      const seeded = Object.fromEntries(SECTIONS.map((s) => [s.key, images[s.key] ?? null]));
      setDraft(seeded);
      setBaseline(JSON.stringify(seeded));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const isDirty = ready && baseline !== null && JSON.stringify(draft) !== baseline;

  const updateImage = (key, url) => {
    setDraft((prev) => ({ ...prev, [key]: url }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const original = Object.fromEntries(SECTIONS.map((s) => [s.key, images[s.key] ?? null]));
      const jobs = SECTIONS.filter((s) => draft[s.key] !== original[s.key]).map((s) =>
        saveImage({ key: s.key, url: draft[s.key] }).unwrap(),
      );
      await Promise.all(jobs);
      setBaseline(JSON.stringify(draft));
      showToast("About page images saved");
    } catch {
      showToast("Could not save About page images");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
        <ImageIcon className="h-4 w-4 text-shop-accent-1" />
        About Page Images
      </p>
      <p className="text-[11.5px] text-shop-text/60">
        Click any box to upload the photo for that section, then Save Changes.
        This feeds the public{" "}
        <a href="/about" target="_blank" rel="noreferrer" className="text-shop-accent-1 underline">
          About Us page
        </a>
        .
      </p>
      {isLoading || !ready ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-shop-accent-1" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {SECTIONS.map((s) => (
              <div key={s.key} className="flex flex-col gap-1.5">
                <AboutImageSlot
                  value={draft[s.key]}
                  alt={s.label}
                  editable
                  onPick={(url) => updateImage(s.key, url)}
                  className="aspect-square w-full rounded-[16px]"
                />
                <span className="text-center text-[11px] font-medium text-shop-text">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {isDirty && (
            <div className="sticky bottom-4 z-30 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-full bg-shop-accent-1 px-6 py-3 text-[13px] font-semibold text-white shadow-lg hover:bg-shop-accent-1-dark disabled:opacity-60"
              >
                {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save Changes
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
