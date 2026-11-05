"use client";

import React, { useState } from "react";
import { Tag, Plus, Mail, ImagePlus, X, Send, Loader2, Trash2, Pencil, ChevronDown } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import MoneyInput from "@/app/Components/Inputs/MoneyInput";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetAdminCouponsQuery,
  useSaveAdminCouponMutation,
  useDeleteAdminCouponMutation,
  useGetAdminCampaignsQuery,
  useGetAdminCampaignQuery,
  useGetAdminCampaignRecipientsQuery,
  useSendAdminCampaignMutation,
} from "@/lib/api/adminApi";
import { useMediaUpload } from "@/lib/api/mediaApi";
import { errorMessage } from "@/lib/api/errorMessage";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

const MAX_CAMPAIGN_IMAGES = 4;

const STATUS_TONE = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  SCHEDULED: "bg-shop-accent-1-light text-shop-accent-1",
  EXPIRED: "bg-shop-bg text-shop-text",
};

const AUDIENCES = [
  { id: "everyone", label: "Everyone" },
  { id: "customers", label: "Customers" },
  { id: "signed_up_customers", label: "Signed Up Customers" },
  { id: "purchasing_customers", label: "Purchasers" },
  { id: "merchants", label: "Merchants" },
  { id: "partners", label: "Partners" },
  { id: "subscribers", label: "Newsletter Subscribers" },
];

const AUDIENCE_LABEL = Object.fromEntries(
  AUDIENCES.map((a) => [a.id, a.label]),
);

// Campaign.audience is stored comma-joined when more than one category was
// picked (see AdminService.sendCampaign) - map each id back to its label.
function formatAudience(idsCsv) {
  return (idsCsv || "")
    .split(",")
    .map((id) => AUDIENCE_LABEL[id.trim()] || id.trim().replace(/_/g, " "))
    .join(", ");
}

// Counts come from the same /admin/campaigns/recipients call the section
// below renders - one source of truth, so a pill's number never drifts from
// what the expanded checklist actually shows.
function AudiencePill({ id, label, selected, onToggle }) {
  const { data: members } = useGetAdminCampaignRecipientsQuery(id);
  const count = members?.length ?? 0;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-3.5 py-2 text-[12px] font-semibold ${
        selected
          ? "border-shop-accent-1 bg-shop-accent-1 text-white"
          : "border-shop-border bg-white text-shop-text"
      }`}
    >
      {label} ({count.toLocaleString()})
    </button>
  );
}

function AudienceSection({
  id,
  label,
  excludedEmails,
  onToggleRecipient,
  onSelectAll,
  onSelectNone,
  open,
  onToggleOpen,
}) {
  const { data: members, isFetching } = useGetAdminCampaignRecipientsQuery(id);
  const total = members?.length ?? 0;
  const excludedHere = (members ?? []).filter((m) =>
    excludedEmails.has(m.email),
  ).length;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex items-center justify-between rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[12px] font-semibold text-shop-heading"
      >
        <span>
          {isFetching
            ? `Loading ${label}…`
            : `${(total - excludedHere).toLocaleString()} of ${total.toLocaleString()} (${label}) will receive this`}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-shop-text/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="flex max-h-56 flex-col gap-0.5 overflow-y-auto rounded-[8px] border border-shop-border bg-white p-1.5">
          {isFetching ? (
            <p className="p-2 text-[11.5px] text-shop-text/50">Loading…</p>
          ) : total === 0 ? (
            <p className="p-2 text-[11.5px] text-shop-text/50">
              No one in this category yet.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-shop-border px-2 pb-1.5">
                <button
                  type="button"
                  onClick={() => onSelectAll(members)}
                  className="text-[11px] font-semibold text-shop-accent-1"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => onSelectNone(members)}
                  className="text-[11px] font-semibold text-shop-text/60"
                >
                  Select none
                </button>
              </div>
              {members.map((m) => (
                <label
                  key={m.email}
                  className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 text-[12px] text-shop-heading hover:bg-shop-bg"
                >
                  <input
                    type="checkbox"
                    checked={!excludedEmails.has(m.email)}
                    onChange={() => onToggleRecipient(m.email)}
                    className="h-3.5 w-3.5 shrink-0 accent-shop-accent-1"
                  />
                  <span className="min-w-0 flex-1 truncate">{m.name}</span>
                  <span className="shrink-0 truncate text-[10.5px] text-shop-text/50">
                    {m.email}
                  </span>
                </label>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CampaignDetailModal({ id, onClose }) {
  useBodyScrollLock(true);
  const { data, isLoading } = useGetAdminCampaignQuery(id);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 p-0 font-shop lg:items-center lg:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-[560px] flex-col gap-3 overflow-y-auto rounded-t-[20px] bg-white p-5 lg:rounded-[16px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[14px] font-semibold text-shop-heading">
              {data?.subject ?? "Campaign"}
            </p>
            {data && (
              <p className="text-[11.5px] text-shop-text/60">
                Sent to {data.recipientCount.toLocaleString()} recipient
                {data.recipientCount === 1 ? "" : "s"} ·{" "}
                <span>{formatAudience(data.audience)}</span> ·{" "}
                {new Date(data.sentAt).toLocaleString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-shop-bg"
          >
            <X className="h-4 w-4 text-shop-heading" />
          </button>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
          What recipients saw
        </p>
        {isLoading || !data ? (
          <div className="flex h-[420px] items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-shop-text/40" />
          </div>
        ) : (
          <iframe
            title="Campaign email preview"
            srcDoc={data.preview?.html ?? ""}
            className="h-[420px] w-full rounded-[10px] border border-shop-border bg-white"
          />
        )}
      </div>
    </div>
  );
}

export default function AdminMarketingPage() {
  const showToast = useToast();
  const confirm = useConfirm();
  const { data: coupons, isLoading: couponsLoading } = useGetAdminCouponsQuery();
  const [saveCoupon, saveCouponState] = useSaveAdminCouponMutation();
  const [deleteCoupon] = useDeleteAdminCouponMutation();
  // Sending runs in the background - a light poll while this page is open
  // means progress updates on its own instead of needing a manual refresh.
  const { data: campaigns, isLoading: campaignsLoading } =
    useGetAdminCampaignsQuery(undefined, { pollingInterval: 5000 });
  const [sendCampaign, sendState] = useSendAdminCampaignMutation();
  const { upload, uploading } = useMediaUpload("campaigns");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [campaignOpen, setCampaignOpen] = useState(false);
  const [audiences, setAudiences] = useState(["everyone"]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [campaignImages, setCampaignImages] = useState([]);
  const [viewingCampaignId, setViewingCampaignId] = useState(null);
  const [excludedEmails, setExcludedEmails] = useState(() => new Set());
  const [openSections, setOpenSections] = useState(() => new Set());
  // Only used to estimate the toast's recipient count right after sending,
  // before the real server-computed count comes back - the actual picker UI
  // is one AudienceSection per selected category (each audience's exact
  // count/roster, not this union), so counts never drift between the two.
  const { data: audienceMembers } = useGetAdminCampaignRecipientsQuery(
    audiences.join(","),
    { skip: !campaignOpen || audiences.length === 0 },
  );

  // Several specific categories can be combined in one send, e.g. Customers
  // + Partners - but "Everyone" already covers every category, so it's
  // exclusive: picking it drops anything else, and picking anything else
  // while it's active drops it instead of adding to it.
  const toggleAudience = (id) => {
    setAudiences((prev) => {
      if (id === "everyone") {
        return prev.length === 1 && prev[0] === "everyone" ? [] : ["everyone"];
      }
      const withoutEveryone = prev.filter((x) => x !== "everyone");
      return withoutEveryone.includes(id)
        ? withoutEveryone.filter((x) => x !== id)
        : [...withoutEveryone, id];
    });
  };

  const toggleSection = (id) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllInAudience = (members) => {
    setExcludedEmails((prev) => {
      const next = new Set(prev);
      members.forEach((m) => next.delete(m.email));
      return next;
    });
  };

  const selectNoneInAudience = (members) => {
    setExcludedEmails((prev) => {
      const next = new Set(prev);
      members.forEach((m) => next.add(m.email));
      return next;
    });
  };

  const resetCouponForm = () => {
    setEditingCouponId(null);
    setCode("");
    setType("percent");
    setValue("");
    setMinSpend("");
    setUsageLimit("");
    setStartsAt("");
    setExpiresAt("");
    setFormOpen(false);
  };

  const openCreateCoupon = () => {
    resetCouponForm();
    setFormOpen((v) => !v);
  };

  const openEditCoupon = (c) => {
    setEditingCouponId(c.id);
    setCode(c.code);
    setType(c.type);
    setValue(String(c.value));
    setMinSpend(c.minSpend ? String(c.minSpend) : "");
    setUsageLimit(c.usageLimit ? String(c.usageLimit) : "");
    setStartsAt(c.startsAt ? c.startsAt.slice(0, 10) : "");
    setExpiresAt(c.expiresAt ? c.expiresAt.slice(0, 10) : "");
    setFormOpen(true);
  };

  const saveCouponSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !value) return;
    try {
      await saveCoupon({
        id: editingCouponId || undefined,
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minSpend: Number(minSpend) || 0,
        // null (not undefined) so clearing the field during an edit actually
        // clears it server-side, instead of leaving the old value in place.
        usageLimit: Number(usageLimit) || null,
        startsAt: startsAt ? new Date(startsAt).toISOString() : null,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        ...(editingCouponId ? {} : { status: "ACTIVE" }),
      }).unwrap();
      showToast(
        editingCouponId
          ? `Coupon "${code.toUpperCase()}" updated`
          : `Coupon "${code.toUpperCase()}" created`,
      );
      resetCouponForm();
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const cycleCouponStatus = async (c) => {
    if (c.status === "EXPIRED") return;
    const next = c.status === "ACTIVE" ? "SCHEDULED" : "ACTIVE";
    try {
      await saveCoupon({ id: c.id, code: c.code, type: c.type, value: c.value, status: next }).unwrap();
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const removeCoupon = async (c) => {
    const res = await confirm({
      title: `Delete coupon "${c.code}"?`,
      message:
        c.usageCount > 0
          ? `This coupon has been used ${c.usageCount} time${c.usageCount === 1 ? "" : "s"}. Deleting it only stops future use - past orders keep their discount.`
          : "This cannot be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!res) return;
    try {
      await deleteCoupon(c.id).unwrap();
      showToast(`Coupon "${c.code}" deleted`);
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const toggleRecipient = (email) => {
    setExcludedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const addCampaignImages = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const room = MAX_CAMPAIGN_IMAGES - campaignImages.length;
    for (const file of files.slice(0, room)) {
      const url = await upload(file);
      if (url) setCampaignImages((prev) => [...prev, url]);
    }
  };

  const send = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim() || audiences.length === 0) return;
    try {
      // Sending happens in the background after this resolves - the
      // freshly-created campaign (most recent) carries the real,
      // server-computed recipient count, not the client-side KPI estimate.
      const result = await sendCampaign({
        subject: subject.trim(),
        body: body.trim(),
        audiences,
        images: campaignImages,
        excludedEmails: Array.from(excludedEmails),
      }).unwrap();
      const count =
        result?.[0]?.recipientCount ??
        (audienceMembers?.length ?? 0) - excludedEmails.size;
      showToast(
        count
          ? `Campaign queued for ${count.toLocaleString()} recipients`
          : "No recipients found for that audience",
      );
      setSubject("");
      setBody("");
      setCampaignImages([]);
      setAudiences(["everyone"]);
      setExcludedEmails(new Set());
      setOpenSections(new Set());
      setCampaignOpen(false);
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="Marketing"
        backHref="/admin"
        right={
          <button
            type="button"
            onClick={openCreateCoupon}
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1-light px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-1"
          >
            <Plus className="h-3.5 w-3.5" />
            New Coupon
          </button>
        }
      />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Coupons, campaigns, flash sales, email and push notifications.
      </p>

      {formOpen && (
        <form
          onSubmit={saveCouponSubmit}
          className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border bg-shop-bg p-4 lg:mx-8"
        >
          {editingCouponId && (
            <p className="text-[12px] font-semibold text-shop-accent-1">
              Editing {code}
            </p>
          )}
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Coupon code (e.g. SAVE15)"
            className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] uppercase outline-none focus:border-shop-accent-1"
          />
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
            >
              <option value="percent">% off</option>
              <option value="fixed">₦ off</option>
            </select>
            <MoneyInput
              value={value}
              onChange={setValue}
              placeholder={type === "percent" ? "10" : "1,500"}
              className="flex-1 rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
            />
          </div>
          <div>
            <MoneyInput
              value={minSpend}
              onChange={setMinSpend}
              placeholder="Minimum spend (optional)"
              className="w-full rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
            />
            <p className="mt-1 text-[11px] text-shop-text/50">
              The cart subtotal has to reach this before the coupon applies -
              e.g. 10,000 means it only works on orders of ₦10,000+. Leave
              blank to allow any order size.
            </p>
          </div>
          <div>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="Usage limit (optional)"
                className="flex-1 rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
              />
            </div>
            <p className="mt-1 text-[11px] text-shop-text/50">
              How many times this code can be redeemed in total, across every
              customer - e.g. 100 means it stops working after the 100th
              successful use. Leave blank for unlimited uses.
            </p>
          </div>
          <div>
            <div className="flex gap-2">
              <label className="flex flex-1 flex-col gap-1">
                <span className="text-[10.5px] font-medium text-shop-text/60">
                  Starts
                </span>
                <input
                  type="date"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-text outline-none focus:border-shop-accent-1"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1">
                <span className="text-[10.5px] font-medium text-shop-text/60">
                  Expires
                </span>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-text outline-none focus:border-shop-accent-1"
                />
              </label>
            </div>
            <p className="mt-1 text-[11px] text-shop-text/50">
              Leave either blank for no start delay / no expiry.
            </p>
          </div>
          <div className="flex gap-2">
            {editingCouponId && (
              <button
                type="button"
                onClick={resetCouponForm}
                className="rounded-[8px] border border-shop-border px-4 py-2.5 text-[13px] font-semibold text-shop-heading"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saveCouponState.isLoading}
              className="flex-1 rounded-[8px] bg-shop-accent-1 py-2.5 text-[13px] font-semibold text-white disabled:opacity-70"
            >
              {editingCouponId ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <Tag className="h-4 w-4 text-shop-accent-1" />
          Coupons
        </p>
        {couponsLoading ? (
          <SkeletonRows count={2} />
        ) : (
          <div className="flex flex-col gap-2">
            {(coupons ?? []).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-shop-heading">
                    {c.code}
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">
                    {c.type === "percent" ? `${c.value}% off` : `₦${c.value} off`}
                    {c.minSpend ? ` · min ₦${c.minSpend.toLocaleString()}` : ""} ·{" "}
                    {c.usageCount}
                    {c.usageLimit ? `/${c.usageLimit}` : ""} uses
                    {c.startsAt
                      ? ` · starts ${new Date(c.startsAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`
                      : ""}
                    {c.expiresAt
                      ? ` · expires ${new Date(c.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    disabled={c.status === "EXPIRED"}
                    onClick={() => cycleCouponStatus(c)}
                    className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold capitalize disabled:cursor-not-allowed ${STATUS_TONE[c.status]}`}
                  >
                    {c.status.toLowerCase()}
                  </button>
                  <button
                    type="button"
                    aria-label={`Edit coupon ${c.code}`}
                    onClick={() => openEditCoupon(c)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-shop-text/50 hover:bg-shop-bg hover:text-shop-accent-1"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete coupon ${c.code}`}
                    onClick={() => removeCoupon(c)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-shop-text/50 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
            <Mail className="h-4 w-4 text-shop-accent-1" />
            Email Campaigns
          </p>
          <button
            type="button"
            onClick={() => setCampaignOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1-light px-3 py-1.5 text-[12px] font-semibold text-shop-accent-1"
          >
            <Plus className="h-3.5 w-3.5" />
            New Campaign
          </button>
        </div>

        {campaignOpen && (
          <form
            onSubmit={send}
            className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-shop-bg p-4"
          >
            <span className="text-[12px] font-semibold text-shop-heading">
              Send to (tap to combine categories)
            </span>
            <div className="-mt-1.5 flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <AudiencePill
                  key={a.id}
                  id={a.id}
                  label={a.label}
                  selected={audiences.includes(a.id)}
                  onToggle={() => toggleAudience(a.id)}
                />
              ))}
            </div>
            <div className="-mt-1 flex flex-col gap-2">
              {audiences.map((id) => (
                <AudienceSection
                  key={id}
                  id={id}
                  label={AUDIENCE_LABEL[id] ?? id}
                  excludedEmails={excludedEmails}
                  onToggleRecipient={toggleRecipient}
                  onSelectAll={selectAllInAudience}
                  onSelectNone={selectNoneInAudience}
                  open={openSections.has(id)}
                  onToggleOpen={() => toggleSection(id)}
                />
              ))}
            </div>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Write your message..."
              className="resize-none rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
            />
            <div className="flex flex-wrap gap-2.5">
              {campaignImages.map((img, i) => (
                <div
                  key={i}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border border-shop-border"
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCampaignImages((p) => p.filter((_, k) => k !== i))
                    }
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {campaignImages.length < MAX_CAMPAIGN_IMAGES && (
                <label className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-dashed border-shop-border bg-white">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-shop-text/40" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-shop-text/40" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={addCampaignImages}
                  />
                </label>
              )}
            </div>
            <button
              type="submit"
              disabled={
                !subject.trim() ||
                !body.trim() ||
                audiences.length === 0 ||
                sendState.isLoading
              }
              className="flex items-center justify-center gap-1.5 rounded-[8px] bg-shop-accent-1 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
            >
              {sendState.isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Send Campaign
            </button>
          </form>
        )}

        <div className="flex flex-col gap-2">
          {campaignsLoading ? (
            <SkeletonRows count={2} />
          ) : (campaigns ?? []).length === 0 ? (
            <p className="py-6 text-center text-[12.5px] text-shop-text/60">
              No campaigns sent yet.
            </p>
          ) : (
            campaigns.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setViewingCampaignId(c.id)}
                className="flex flex-col gap-1.5 rounded-[14px] border border-shop-border bg-white p-3.5 text-left hover:border-shop-accent-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-shop-heading">
                    {c.subject}
                  </p>
                  <span className="shrink-0 rounded-full bg-shop-accent-1-light px-2 py-0.5 text-[10.5px] font-semibold text-shop-accent-1">
                    {formatAudience(c.audience)}
                  </span>
                </div>
                <p className="line-clamp-2 text-[11.5px] text-shop-text/70">
                  {c.body}
                </p>
                {c.images?.length > 0 && (
                  <div className="flex gap-1.5 pt-0.5">
                    {c.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="h-10 w-10 rounded-[6px] object-cover"
                      />
                    ))}
                  </div>
                )}
                <p className="text-[10.5px] text-shop-text/50">
                  {c.status === "sending"
                    ? `Sending… ${c.sentCount.toLocaleString()} of ${c.recipientCount.toLocaleString()} sent`
                    : c.status === "failed"
                      ? `Stopped after ${c.sentCount.toLocaleString()} of ${c.recipientCount.toLocaleString()} sent`
                      : `Sent to ${c.recipientCount.toLocaleString()} recipient${c.recipientCount === 1 ? "" : "s"}`}
                  {" · "}
                  {new Date(c.sentAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {viewingCampaignId && (
        <CampaignDetailModal
          id={viewingCampaignId}
          onClose={() => setViewingCampaignId(null)}
        />
      )}
    </div>
  );
}
