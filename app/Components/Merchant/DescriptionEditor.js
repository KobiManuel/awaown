"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Quill touches `document` on import, so it can only ever run in the
// browser - Next.js would otherwise try to render it on the server and crash.
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const MODULES = {
  toolbar: [
    [{ header: [false, 3, 2, 1] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "blockquote",
  "link",
];

/**
 * Rich text editor for a product description - headings, bold/italic,
 * lists, quotes and links. Stores/emits sanitized-on-save HTML; the backend
 * re-sanitizes on every write, so this only needs to give a good editing
 * experience, not be the security boundary itself.
 */
export default function DescriptionEditor({
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <div className={`awaown-description-editor rounded-[10px] ${className}`}>
      <ReactQuill
        theme="snow"
        value={value ?? ""}
        onChange={onChange}
        modules={MODULES}
        formats={FORMATS}
        placeholder={placeholder}
      />
      <style jsx global>{`
        .awaown-description-editor .ql-toolbar.ql-snow {
          border-color: var(--shop-border, #e5e7eb);
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          font-family: inherit;
        }
        .awaown-description-editor .ql-container.ql-snow {
          border-color: var(--shop-border, #e5e7eb);
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          font-family: inherit;
          font-size: 13.5px;
          min-height: 160px;
        }
        .awaown-description-editor .ql-editor {
          min-height: 160px;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
}
