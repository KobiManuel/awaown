"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mail, Loader2, Send, Check } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetEmailTemplatesQuery,
  useGetEmailTemplateQuery,
  usePreviewEmailTemplateMutation,
  useSaveEmailTemplateMutation,
  useTestEmailTemplateMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

const FIELD =
  "w-full rounded-[8px] border border-shop-border px-3 py-2 text-[12.5px] text-shop-heading outline-none focus:border-shop-accent-1";

function Editor({ tplKey }) {
  const showToast = useToast();
  const { data, isLoading } = useGetEmailTemplateQuery(tplKey);
  const [save, saveState] = useSaveEmailTemplateMutation();
  const [preview] = usePreviewEmailTemplateMutation();
  const [sendTest, testState] = useTestEmailTemplateMutation();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [html, setHtml] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => {
    if (data) {
      setSubject(data.subject ?? "");
      setBody(data.body ?? "");
      setEnabled(data.enabled ?? true);
      setHtml(data.preview?.html ?? "");
    }
  }, [data]);

  const dirty =
    data &&
    (subject !== data.subject || body !== data.body || enabled !== data.enabled);

  // Live preview: re-render the sample email a beat after the admin stops
  // typing, so the panel below always reflects the current draft (no button).
  useEffect(() => {
    if (!data) return;
    const t = setTimeout(async () => {
      try {
        const res = await preview({ key: tplKey, subject, body }).unwrap();
        setHtml(res.html);
      } catch {
        /* keep the last good preview */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [subject, body, tplKey, data, preview]);

  const doSave = async () => {
    try {
      await save({ key: tplKey, subject, body, enabled }).unwrap();
      showToast("Template saved");
    } catch (e) {
      showToast(errorMessage(e));
    }
  };

  const doTest = async () => {
    try {
      const res = await sendTest({ key: tplKey }).unwrap();
      showToast(`Test sent to ${res.to}`);
    } catch (e) {
      showToast(errorMessage(e));
    }
  };

  const insertVar = (v) => {
    const el = bodyRef.current;
    const token = `{{${v}}}`;
    if (!el) return setBody((b) => b + token);
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    setBody(body.slice(0, start) + token + body.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + token.length;
    });
  };

  if (isLoading || !data) {
    return (
      <div className="flex-1 p-4">
        <SkeletonRows count={5} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-shop-heading">{data.name}</p>
          <p className="text-[11px] text-shop-text/60">
            {data.group} · key <code>{tplKey}</code>
          </p>
        </div>
        <label
          className="flex items-center gap-2 text-[12px] font-medium text-shop-heading"
          title="When off, AwaOwn stops sending this email entirely (save to apply)."
        >
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 accent-shop-accent-1"
          />
          {enabled ? "Sending" : "Paused"}
        </label>
      </div>
      <p className="-mt-2 text-[10.5px] text-shop-text/50">
        &ldquo;Sending&rdquo; is this email&apos;s on/off switch — turn it off to
        stop AwaOwn sending it (e.g. pause review-request nudges). The preview
        below updates as you edit.
      </p>

      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
          Subject
        </span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} className={FIELD} />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
          Body
        </span>
        <textarea
          ref={bodyRef}
          rows={12}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={`${FIELD} resize-none font-mono text-[12px] leading-[18px]`}
        />
        <p className="text-[10.5px] text-shop-text/50">
          Blank line = new paragraph. Links: [label](https://…). Placeholders below.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(data.vars ?? []).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => insertVar(v)}
            className="rounded-full bg-shop-accent-1-light px-2.5 py-1 text-[10.5px] font-medium text-shop-accent-1 hover:bg-shop-accent-1 hover:text-white"
          >
            {`{{${v}}}`}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={doSave}
          disabled={!dirty || saveState.isLoading}
          className="flex items-center gap-1.5 rounded-[8px] bg-shop-accent-1 px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-50"
        >
          {saveState.isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          Save
        </button>
        <button
          type="button"
          onClick={doTest}
          disabled={testState.isLoading}
          className="flex items-center gap-1.5 rounded-[8px] border border-shop-border px-4 py-2 text-[12px] font-semibold text-shop-heading disabled:opacity-50"
        >
          {testState.isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          Send test to me
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
          Preview (sample data)
        </span>
        <iframe
          title="Email preview"
          srcDoc={html}
          className="h-[420px] w-full rounded-[10px] border border-shop-border bg-white"
        />
      </div>
    </div>
  );
}

export default function AdminEmailsPage() {
  const { data, isLoading } = useGetEmailTemplatesQuery();
  const items = data?.items ?? [];
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected && items.length) setSelected(items[0].key);
  }, [items, selected]);

  const byGroup = items.reduce((acc, t) => {
    (acc[t.group] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div className="flex flex-col pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1200px]">
      <AppHeader title="Email Templates" backHref="/admin" />
      <p className="px-4 pb-3 text-[11.5px] text-shop-text/60 lg:px-8">
        Every email AwaOwn sends to customers, merchants and partners. Edit the
        wording, pause any you don&apos;t want sent, and send yourself a test.
      </p>

      <div className="mx-4 flex flex-col overflow-hidden rounded-[14px] border border-shop-border lg:mx-8 lg:flex-row">
        <div className="w-full shrink-0 border-b border-shop-border bg-white lg:w-[260px] lg:border-b-0 lg:border-r">
          {isLoading ? (
            <div className="p-4">
              <SkeletonRows count={6} />
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto py-2">
              {Object.entries(byGroup).map(([group, list]) => (
                <div key={group}>
                  <p className="px-4 pb-1 pt-3 text-[10.5px] font-semibold uppercase tracking-wide text-shop-text/50">
                    {group}
                  </p>
                  {list.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setSelected(t.key)}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-left text-[12px] ${
                        selected === t.key
                          ? "bg-shop-accent-1-light font-semibold text-shop-accent-1"
                          : "text-shop-heading hover:bg-shop-bg"
                      }`}
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0 opacity-60" />
                      <span className="flex-1 truncate">{t.name}</span>
                      {!t.enabled && (
                        <span className="rounded-full bg-shop-bg px-1.5 py-0.5 text-[9px] font-semibold text-shop-text/60">
                          paused
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="flex flex-1 bg-shop-bg">
            <Editor key={selected} tplKey={selected} />
          </div>
        )}
      </div>
    </div>
  );
}
