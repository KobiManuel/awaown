import Link from "next/link";
import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import { ArrowRight, Wrench } from "lucide-react";
import FlipCards from "./FlipCards";

export const metadata = {
  title: "About AwaOwn",
  description:
    "AwaOwn is a digital marketplace connecting Merchants, Partners, Inventory investors and Customers in one ecosystem, with escrow-protected payments and verified participants.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-10 font-shop md:px-8 md:py-16">
        <section className="flex flex-col items-center gap-4 rounded-[20px] bg-white px-6 py-14 text-center md:py-20">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-shop-accent-1-light">
            <Wrench className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />
          </span>
          <h1 className="text-[24px] font-bold text-shop-heading md:text-[30px]">
            Our About page is being redesigned
          </h1>
          <p className="max-w-[440px] text-[14px] leading-[22px] text-shop-text">
            We&apos;re still working on this one. Check back soon, or head to the
            shop in the meantime.
          </p>
          <Link
            href="/shop"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-shop-accent-1 px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            Start shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Kept in place for the upcoming redesign - not final content. */}
        <section className="mt-14 flex flex-col gap-6">
          <h2 className="text-[22px] font-semibold text-shop-heading md:text-[26px]">
            What holds the ecosystem together
          </h2>
          <FlipCards />
        </section>
      </main>

      <Footer />
    </div>
  );
}
