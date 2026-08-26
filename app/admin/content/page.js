"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  Image as ImageIcon,
  HelpCircle,
  Users,
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  Info,
} from "lucide-react";
import { faqsSeed, BANNER_LOCATIONS } from "@/lib/admin-data";
import {
  toggleBannerStatus,
  addBanner,
  updateBanner,
  removeBanner,
  saveCommunitySection,
} from "@/lib/store/adminSlice";
import { readImageAsCompressedDataURL } from "@/lib/file-utils";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const STATUS_TONE = {
  live: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-shop-accent-1-light text-shop-accent-1",
  draft: "bg-shop-bg text-shop-text",
  published: "bg-emerald-100 text-emerald-700",
};

const FIELD = "w-full rounded-[8px] border border-shop-border px-3 py-2 text-[12.5px] text-shop-heading outline-none focus:border-shop-accent-1";
const LABEL = "text-[10.5px] font-semibold uppercase tracking-wide text-shop-text/60";

function BannerEditor() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const banners = useSelector((s) => s.admin.banners);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: "", location: BANNER_LOCATIONS[0] });

  const startEdit = (banner) => {
    setEditingId(banner.id);
    setDraft({ title: banner.title, location: banner.location });
  };

  const handleAdd = () => {
    const banner = { id: `cb-${Date.now()}`, title: "New Banner", location: BANNER_LOCATIONS[0], status: "draft" };
    dispatch(addBanner(banner));
    startEdit(banner);
  };

  const handleSave = (id) => {
    dispatch(updateBanner({ id, changes: draft }));
    showToast("Banner saved");
    setEditingId(null);
  };

  const handleRemove = (banner) => {
    dispatch(removeBanner(banner.id));
    showToast(`"${banner.title}" removed`);
    if (editingId === banner.id) setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-2.5 px-4 lg:px-8">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <ImageIcon className="h-4 w-4 text-shop-accent-1" />
          Banners
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-full bg-shop-accent-1-light px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Banner
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {banners.map((b) => (
          <div key={b.id} className="rounded-[14px] border border-shop-border bg-white p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-shop-heading">{b.title}</p>
                <p className="text-[11.5px] text-shop-text/70">{b.location}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(toggleBannerStatus(b.id));
                    showToast(`"${b.title}" updated`);
                  }}
                  className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold capitalize ${STATUS_TONE[b.status]}`}
                >
                  {b.status}
                </button>
                <button
                  type="button"
                  aria-label="Edit banner"
                  onClick={() => (editingId === b.id ? setEditingId(null) : startEdit(b))}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-shop-text hover:bg-shop-bg"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Remove banner"
                  onClick={() => handleRemove(b)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {editingId === b.id && (
              <div className="mt-3 flex flex-col gap-2.5 border-t border-shop-border pt-3">
                <div className="flex flex-col gap-1">
                  <span className={LABEL}>Title</span>
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                    className={FIELD}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={LABEL}>Location</span>
                  <select
                    value={draft.location}
                    onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
                    className={FIELD}
                  >
                    {BANNER_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleSave(b.id)}
                  className="self-start rounded-[8px] bg-shop-accent-1 px-4 py-2 text-[12px] font-semibold text-white"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const COMMUNITY_CARDS = [
  {
    key: "vendorSpotlight",
    label: "Vendor Spotlight",
    fields: [
      { name: "vendorName", label: "Vendor Name", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "buttonText", label: "Button Text", type: "text" },
      { name: "image", label: "Image", type: "image" },
    ],
  },
  {
    key: "webinar",
    label: "Upcoming Webinar",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "dateText", label: "Date / Time", type: "text" },
      { name: "buttonText", label: "Button Text", type: "text" },
    ],
  },
  {
    key: "tip",
    label: "Community Tip",
    fields: [{ name: "text", label: "Tip", type: "textarea" }],
  },
  {
    key: "challenge",
    label: "Challenge of the Week",
    fields: [
      { name: "text", label: "Challenge", type: "textarea" },
      { name: "buttonText", label: "Button Text", type: "text" },
    ],
  },
  {
    key: "announcement",
    label: "Announcement",
    fields: [
      { name: "text", label: "Announcement", type: "textarea" },
      { name: "date", label: "Date", type: "text" },
    ],
  },
];

function CommunityCardEditor({ card, values, onSave }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(values);
  const fileInputRef = useRef(null);

  const openEditor = () => {
    setDraft(values);
    setOpen(true);
  };

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const image = await readImageAsCompressedDataURL(file);
    setDraft((p) => ({ ...p, image }));
    e.target.value = "";
  };

  return (
    <div className="rounded-[14px] border border-shop-border bg-white p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-shop-heading">{card.label}</p>
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openEditor())}
          className="flex h-7 w-7 items-center justify-center rounded-full text-shop-text hover:bg-shop-bg"
          aria-label={`Edit ${card.label}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-2.5 border-t border-shop-border pt-3">
          {card.fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-1">
              <span className={LABEL}>{f.label}</span>
              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={draft[f.name] ?? ""}
                  onChange={(e) => setDraft((p) => ({ ...p, [f.name]: e.target.value }))}
                  className={`${FIELD} resize-none`}
                />
              ) : f.type === "image" ? (
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-[8px] bg-shop-bg">
                    {draft.image && (
                      <Image src={draft.image} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImagePick}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-full border border-shop-border px-3 py-1.5 text-[11.5px] font-semibold text-shop-heading"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    Change Image
                  </button>
                </div>
              ) : (
                <input
                  value={draft[f.name] ?? ""}
                  onChange={(e) => setDraft((p) => ({ ...p, [f.name]: e.target.value }))}
                  className={FIELD}
                />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              onSave(draft);
              setOpen(false);
            }}
            className="self-start rounded-[8px] bg-shop-accent-1 px-4 py-2 text-[12px] font-semibold text-white"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

function CommunitySectionEditor() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const communitySection = useSelector((s) => s.admin.communitySection);

  const handleSaveCard = (key, values) => {
    dispatch(saveCommunitySection({ ...communitySection, [key]: values }));
    showToast("Community section updated");
  };

  return (
    <div className="flex flex-col gap-2.5 px-4 lg:px-8">
      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
        <Users className="h-4 w-4 text-shop-accent-1" />
        Our Community
      </p>
      <div className="flex flex-col gap-2">
        {COMMUNITY_CARDS.map((card) => (
          <CommunityCardEditor
            key={card.key}
            card={card}
            values={communitySection[card.key]}
            onSave={(values) => handleSaveCard(card.key, values)}
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminContentPage() {
  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Content" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Homepage content, banners, FAQs, announcements, categories, blogs and static pages.
      </p>

      <div className="mx-4 flex items-center gap-3 rounded-[12px] bg-amber-50 p-3.5 lg:mx-8">
        <Info className="h-4.5 w-4.5 shrink-0 text-amber-700" strokeWidth={1.75} />
        <p className="text-[12px] leading-[18px] text-amber-800">
          Changes here save to the admin panel, but won&apos;t appear on the live homepage
          until content editing is wired up to a real backend.
        </p>
      </div>

      <BannerEditor />

      <CommunitySectionEditor />

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <HelpCircle className="h-4 w-4 text-shop-accent-1" />
          FAQs
        </p>
        <div className="flex flex-col gap-2">
          {faqsSeed.map((f) => (
            <div key={f.id} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <p className="text-[13px] text-shop-heading">{f.question}</p>
              <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold capitalize ${STATUS_TONE[f.status]}`}>
                {f.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
