"use client";

import React, { useState } from "react";
import { HelpCircle, Plus, Trash2, Info, LayoutTemplate, Loader2 } from "lucide-react";
import {
  useGetAdminFaqsQuery,
  useSaveAdminFaqMutation,
  useRemoveAdminFaqMutation,
} from "@/lib/api/adminApi";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useUndoBuffer } from "@/app/Components/Dashboard/UndoBar";
import HomepageEditor from "./HomepageEditor";

const STATUS_TONE = {
  live: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-shop-accent-1-light text-shop-accent-1",
  draft: "bg-shop-bg text-shop-text",
  published: "bg-emerald-100 text-emerald-700",
};

const FIELD =
  "w-full rounded-[8px] border border-shop-border px-3 py-2 text-[12.5px] text-shop-heading outline-none focus:border-shop-accent-1";
const LABEL = "text-[10.5px] font-semibold uppercase tracking-wide text-shop-text/60";

function FaqEditor() {
  const showToast = useToast();
  const { data: faqs = [], isLoading } = useGetAdminFaqsQuery();
  const [saveFaq, saveState] = useSaveAdminFaqMutation();
  const [removeFaq] = useRemoveAdminFaqMutation();
  const { run, bar } = useUndoBuffer();
  // per-row local edits, keyed by faq id
  const [drafts, setDrafts] = useState({});

  const draftFor = (f) =>
    drafts[f.id] ?? { question: f.question ?? "", answer: f.answer ?? "" };
  const setField = (f, key, value) =>
    setDrafts((d) => ({ ...d, [f.id]: { ...draftFor(f), [key]: value } }));
  const isDirty = (f) => {
    const d = drafts[f.id];
    return (
      !!d &&
      (d.question !== (f.question ?? "") || (d.answer ?? "") !== (f.answer ?? ""))
    );
  };

  const handleAdd = async () => {
    try {
      await saveFaq({
        question: "New question",
        answer: "Answer goes here.",
        status: "draft",
      }).unwrap();
      showToast("FAQ added — edit the question and answer below");
    } catch {
      showToast("Could not add FAQ");
    }
  };

  const handleSave = async (f) => {
    const d = draftFor(f);
    try {
      await saveFaq({ id: f.id, question: d.question, answer: d.answer }).unwrap();
      setDrafts((s) => {
        const n = { ...s };
        delete n[f.id];
        return n;
      });
      showToast("FAQ saved");
    } catch {
      showToast("Could not save FAQ");
    }
  };

  const handleToggleStatus = async (faq) => {
    const next = faq.status === "published" ? "draft" : "published";
    try {
      await saveFaq({ id: faq.id, status: next }).unwrap();
      showToast(`This FAQ is now ${next}`);
    } catch {
      showToast("Could not update FAQ");
    }
  };

  const handleRemove = async (faq) => {
    try {
      await removeFaq(faq.id).unwrap();
    } catch {
      showToast("Could not remove FAQ");
      return;
    }
    run(
      `"${faq.question}" removed — undo within 8 seconds`,
      async () => {
        await saveFaq({
          question: faq.question,
          answer: faq.answer ?? "",
          status: faq.status,
        }).unwrap();
        showToast("Undone");
      },
      () => {},
    );
  };

  return (
    <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <HelpCircle className="h-4 w-4 text-shop-accent-1" />
          FAQs
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-full bg-shop-accent-1-light px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add FAQ
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-shop-accent-1" />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {faqs.map((f) => {
            const d = draftFor(f);
            return (
              <div
                key={f.id}
                className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(f)}
                    className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold capitalize ${STATUS_TONE[f.status] ?? STATUS_TONE.draft}`}
                  >
                    {f.status}
                  </button>
                  <div className="flex items-center gap-1.5">
                    {isDirty(f) && (
                      <button
                        type="button"
                        onClick={() => handleSave(f)}
                        disabled={saveState.isLoading}
                        className="rounded-full bg-shop-accent-1 px-3 py-1 text-[11px] font-semibold text-white disabled:opacity-60"
                      >
                        Save
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="Remove FAQ"
                      onClick={() => handleRemove(f)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className={LABEL}>Question</span>
                  <input
                    value={d.question}
                    onChange={(e) => setField(f, "question", e.target.value)}
                    className={FIELD}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={LABEL}>Answer</span>
                  <textarea
                    rows={3}
                    value={d.answer}
                    onChange={(e) => setField(f, "answer", e.target.value)}
                    placeholder="Type the answer shoppers will see…"
                    className={`${FIELD} resize-none`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {bar}
    </div>
  );
}

export default function AdminContentPage() {
  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1200px]">
      <AppHeader title="Content" backHref="/admin" />

      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Homepage content, banners, FAQs, announcements, categories, blogs and static pages.
      </p>

      <div className="mx-4 flex items-center gap-3 rounded-[12px] bg-emerald-50 p-3.5 lg:mx-8">
        <Info className="h-4.5 w-4.5 shrink-0 text-emerald-700" strokeWidth={1.75} />
        <p className="text-[12px] leading-[18px] text-emerald-800">
          Changes here save to the platform and are served to the live homepage and
          storefront through the content API.
        </p>
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <LayoutTemplate className="h-4 w-4 text-shop-accent-1" />
          Homepage Sections
        </p>
        <p className="text-[11.5px] text-shop-text/60">
          This is how each section looks on the homepage. Click any text to edit or
          erase it, or use the image icon to swap a picture.
        </p>
      </div>
      <HomepageEditor />

      <FaqEditor />
    </div>
  );
}
