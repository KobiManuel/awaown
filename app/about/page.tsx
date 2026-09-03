import Link from "next/link";
import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import { Store, Users2, Coins, ShoppingBag, ArrowRight } from "lucide-react";
import FlipCards from "./FlipCards";

export const metadata = {
  title: "About AwaOwn",
  description:
    "AwaOwn is a digital marketplace connecting Merchants, Partners, Inventory investors and Customers in one ecosystem — with escrow-protected payments and verified participants.",
};

const ROLES = [
  {
    icon: Store,
    title: "Merchants",
    body: "Bring products and businesses to the marketplace. From local manufacturers and wholesalers to retailers, independent business owners and growing small businesses — AwaOwn gives merchants another way to reach customers and grow their sales.",
  },
  {
    icon: Users2,
    title: "Partners",
    body: "Build their own digital stores, curate products, promote them to their audiences and earn from sales — without having to buy or hold inventory themselves.",
  },
  {
    icon: Coins,
    title: "Inventory investors",
    body: "Participate by backing high-demand products or purchasing inventory through AwaOwn. They generate a steady income stream and build lasting wealth directly from product-sales profits.",
  },
  {
    icon: ShoppingBag,
    title: "Customers",
    body: "Discover and purchase products from businesses across the AwaOwn ecosystem, with every payment safely held in escrow until order delivery is confirmed.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-10 font-shop md:px-8 md:py-16">
        {/* Hero */}
        <section className="flex flex-col gap-4">
          <span className="w-fit rounded-full bg-shop-accent-1-light px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-shop-accent-1">
            About Us
          </span>
          <h1 className="max-w-[760px] text-[28px] font-bold leading-[36px] text-shop-heading md:text-[40px] md:leading-[48px]">
            What if you didn&apos;t have to build a business alone?
          </h1>
          <p className="max-w-[720px] text-[15px] leading-[24px] text-shop-text md:text-[16px]">
            Commerce has always been about more. AwaOwn is a digital marketplace built to
            connect Merchants, Partners, Inventory investors and Customers in a single
            ecosystem — creating more ways for people to participate in commerce and build
            businesses.
          </p>
        </section>

        {/* Roles */}
        <section className="mt-14 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[22px] font-semibold text-shop-heading md:text-[26px]">
              A marketplace built around opportunity
            </h2>
            <p className="max-w-[760px] text-[14.5px] leading-[23px] text-shop-text">
              At AwaOwn, we bring together different parts of commerce. Different roles.
              One marketplace. More possibilities.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ROLES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-[16px] border border-shop-border bg-white p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-shop-accent-1-light">
                  <Icon className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />
                </span>
                <h3 className="text-[16px] font-semibold text-shop-heading">{title}</h3>
                <p className="text-[13.5px] leading-[21px] text-shop-text">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why AwaOwn */}
        <section className="mt-14 rounded-[20px] bg-white p-6 md:p-10">
          <h2 className="text-[22px] font-semibold text-shop-heading md:text-[26px]">
            Why AwaOwn?
          </h2>
          <p className="mt-3 max-w-[820px] text-[14.5px] leading-[24px] text-shop-text">
            We believe there should be more ways to participate in commerce. You may have
            products. You may have capital. You may have an audience. You may know how to
            sell. AwaOwn brings these different strengths together, creating an ecosystem
            where businesses can reach customers, Partners can build businesses, inventory
            can find opportunity, and customers can discover products.
          </p>

          <div className="mt-8 border-t border-shop-border pt-8">
            <h3 className="text-[18px] font-semibold text-shop-heading">Our vision</h3>
            <p className="mt-2 max-w-[820px] text-[14.5px] leading-[24px] text-shop-text">
              To create a more inclusive commerce ecosystem that enables more individuals
              to participate, start businesses and generate opportunities — thereby
              fostering the circulation of wealth. We&apos;re building AwaOwn for the way
              commerce is evolving, where products, businesses, people, capital and
              customers can connect in more ways.
            </p>
            <p className="mt-4 text-[15px] font-semibold text-shop-heading">
              This is AwaOwn.
            </p>
          </div>
        </section>

        {/* Flip cards */}
        <section className="mt-14 flex flex-col gap-6">
          <h2 className="text-[22px] font-semibold text-shop-heading md:text-[26px]">
            What holds the ecosystem together
          </h2>
          <FlipCards />
        </section>

        {/* CTA */}
        <section className="mt-14 flex flex-col items-start gap-4 rounded-[20px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-6 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="text-[20px] font-semibold md:text-[24px]">
              Find your place in the marketplace
            </h2>
            <p className="mt-1 text-[13.5px] text-white/80">
              Shop, sell, resell or invest — pick the role that fits you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-shop-heading"
            >
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-[13px] font-semibold text-white ring-1 ring-white/40"
            >
              Become a Merchant or Partner
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
