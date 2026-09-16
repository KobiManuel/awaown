import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";
import LegalDocument from "@/app/Components/Legal/LegalDocument";
import { LEGAL_DOCUMENTS } from "@/lib/legal-content";

export const metadata = {
  title: "Legal · AwaOwn",
  description:
    "AwaOwn's Terms of Use, Merchant and Partner Agreements, Shopper Terms, Buyer Protection, Privacy, Cookie and Prohibited Products policies.",
};

export default function LegalPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Header />
      <main className="mx-auto w-full max-w-[820px] flex-1 px-4 py-10 font-shop md:px-8 md:py-16">
        <h1 className="text-[26px] font-bold text-shop-heading md:text-[32px]">
          Legal
        </h1>
        <p className="mt-2 text-[13.5px] leading-[21px] text-shop-text">
          Every policy that governs using AwaOwn - as a Shopper, Merchant or Partner -
          in one place.
        </p>

        <nav className="my-6 flex flex-col gap-1.5 rounded-[14px] border border-shop-border bg-shop-bg p-4">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
            On this page
          </p>
          {LEGAL_DOCUMENTS.map((doc) => (
            <a
              key={doc.id}
              href={`#${doc.id}`}
              className="text-[13px] font-medium text-shop-accent-1 hover:underline"
            >
              {doc.title}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-12">
          {LEGAL_DOCUMENTS.map((doc) => (
            <LegalDocument key={doc.id} doc={doc} />
          ))}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
