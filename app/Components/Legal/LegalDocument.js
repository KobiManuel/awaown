import React from "react";

/** Renders one legal document's sections - shared by the /legal page and the
 * merchant onboarding gate, so both read from the same source structure. */
export default function LegalDocument({ doc, headingLevel = "h2" }) {
  const Heading = headingLevel;
  return (
    <section id={doc.id} className="flex flex-col gap-4 scroll-mt-24">
      <div>
        <Heading className="text-[19px] font-bold text-shop-heading md:text-[22px]">
          {doc.title}
        </Heading>
        {doc.meta && (
          <p className="mt-1 text-[11.5px] leading-[17px] text-shop-text/60">{doc.meta}</p>
        )}
      </div>
      {doc.sections.map((s, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          {s.heading && (
            <h3 className="text-[14px] font-semibold text-shop-heading">{s.heading}</h3>
          )}
          {s.paragraphs.map((p, j) => (
            <p key={j} className="text-[13px] leading-[21px] text-shop-text">
              {p}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}
