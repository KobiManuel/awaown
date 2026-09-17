"use client";

import React from "react";

/**
 * Renders a merchant's rich-text product description exactly as they
 * formatted it (headings, bold, lists, links). The HTML is sanitized by the
 * backend on every save - this is the one place on the storefront that's
 * allowed to trust it enough to use dangerouslySetInnerHTML.
 *
 * Also the safe path for legacy plain-text descriptions saved before this
 * editor existed: sanitizing plain text is a no-op, and `whitespace-pre-line`
 * still preserves their line breaks even though it's set via innerHTML.
 */
export default function FormattedDescription({ html, className = "" }) {
  if (!html) return null;
  // Older saved descriptions may still carry non-breaking spaces (U+00A0)
  // from a Word/Docs paste - left in, they glue the whole paragraph into
  // one unbreakable run and force mid-word breaks. New saves are cleaned
  // server-side, but this keeps already-stored ones rendering correctly.
  const normalized = html.replace(/ /g, " ");
  return (
    <>
      <div
        className={`awaown-description min-w-0 max-w-full whitespace-pre-line text-[13px] leading-[21px] text-shop-text ${className}`}
        dangerouslySetInnerHTML={{ __html: normalized }}
      />
      <style jsx global>{`
        .awaown-description {
          overflow-wrap: break-word;
        }
        .awaown-description :is(h1, h2, h3, h4) {
          font-weight: 600;
          color: var(--shop-heading, #1a1a1a);
          margin: 14px 0 6px;
          line-height: 1.35;
          overflow-wrap: break-word;
        }
        .awaown-description h1 {
          font-size: 18px;
        }
        .awaown-description h2 {
          font-size: 16px;
        }
        .awaown-description :is(h3, h4) {
          font-size: 14px;
        }
        .awaown-description :is(h1, h2, h3, h4):first-child {
          margin-top: 0;
        }
        .awaown-description p {
          margin: 0 0 10px;
        }
        .awaown-description p:last-child {
          margin-bottom: 0;
        }
        .awaown-description :is(ul, ol) {
          margin: 0 0 10px;
          padding-left: 20px;
        }
        .awaown-description li {
          margin-bottom: 3px;
        }
        .awaown-description blockquote {
          margin: 0 0 10px;
          padding-left: 12px;
          border-left: 3px solid var(--shop-border, #e5e7eb);
          color: inherit;
          opacity: 0.85;
        }
        .awaown-description a {
          color: var(--shop-accent-1, #6d28d9);
          text-decoration: underline;
        }
        .awaown-description strong {
          font-weight: 600;
        }
        .awaown-description img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </>
  );
}
