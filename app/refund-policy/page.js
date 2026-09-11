import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";

export const metadata = {
  title: "Refund Policy · AwaOwn",
  description:
    "When an order qualifies for a refund on AwaOwn, and what's eligible by product category.",
};

const CATEGORIES = [
  {
    label: "Fashion & Apparel",
    reasons: [
      "Wrong item/size/colour",
      "Damaged item",
      "Defective item",
      "Significantly different from listing",
    ],
  },
  {
    label: "Electronics & Gadgets",
    reasons: [
      "Wrong product/model",
      "Damaged item",
      "Defective/not working",
      "Missing advertised accessories",
      "Significantly different from listing",
    ],
  },
  {
    label: "Beauty & Health",
    reasons: [
      "Wrong product",
      "Expired product",
      "Damaged/leaking product",
      "Tampered packaging/seal",
      "Significantly different from listing",
    ],
  },
  {
    label: "Food & Groceries",
    reasons: [
      "Wrong item",
      "Expired product",
      "Spoiled/unsafe product",
      "Damaged product",
      "Compromised packaging",
    ],
  },
  {
    label: "Home & Living",
    reasons: [
      "Wrong item/variant",
      "Broken/cracked/chipped item",
      "Damaged item",
      "Defective item",
      "Significantly different from listing",
    ],
  },
  {
    label: "Sports & Fitness",
    reasons: [
      "Wrong product/variant",
      "Damaged item",
      "Defective item",
      "Missing advertised parts",
      "Significantly different from listing",
    ],
  },
  {
    label: "Automobile",
    reasons: [
      "Wrong product/part",
      "Damaged item",
      "Defective item",
      "Significantly different from listing",
    ],
  },
  {
    label: "Books & Education",
    reasons: [
      "Wrong book/edition/format",
      "Damaged item",
      "Significantly different from listing",
    ],
  },
  {
    label: "General Goods",
    reasons: [
      "Wrong item",
      "Damaged item",
      "Defective item",
      "Missing advertised parts/accessories",
      "Significantly different from listing",
      "Counterfeit/materially misrepresented product",
    ],
  },
];

const GENERAL_REASONS = [
  "Wrong item delivered",
  "Item significantly different from listing",
  "Item damaged on arrival",
  "Item defective",
  "Missing advertised parts/accessories",
  "Counterfeit or materially misrepresented product",
];

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />
      <main className="mx-auto w-full max-w-[820px] flex-1 px-4 py-10 font-shop md:px-8 md:py-16">
        <h1 className="text-[24px] font-bold text-shop-heading md:text-[30px]">
          Refund Policy
        </h1>
        <p className="mt-2 text-[13.5px] leading-[21px] text-shop-text">
          Every order on AwaOwn is escrow-protected - your payment is held
          until you confirm delivery, and a refund request pauses that
          release until it's resolved. Here's when an order qualifies.
        </p>

        <section className="mt-8 flex flex-col gap-3">
          <h2 className="text-[16px] font-semibold text-shop-heading">
            General Refund Policy
          </h2>
          <p className="text-[13px] leading-[20px] text-shop-text">
            An order is generally eligible for a refund when:
          </p>
          <ul className="flex flex-col gap-2">
            {GENERAL_REASONS.map((r) => (
              <li
                key={r}
                className="flex items-start gap-2 text-[13px] leading-[20px] text-shop-text"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-shop-accent-1" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 flex flex-col gap-5">
          <div>
            <h2 className="text-[16px] font-semibold text-shop-heading">
              Refund Eligibility by Category
            </h2>
            <p className="mt-1 text-[13px] leading-[20px] text-shop-text">
              Some categories carry a few extra reasons specific to that kind
              of product, on top of the general policy above.
            </p>
          </div>

          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="rounded-[14px] border border-shop-border bg-white p-4"
            >
              <h3 className="text-[13.5px] font-semibold text-shop-heading">
                {cat.label}
              </h3>
              <ul className="mt-2 flex flex-col gap-1.5">
                {cat.reasons.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-2 text-[12.5px] leading-[19px] text-shop-text"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-shop-text/40" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <p className="mt-10 text-[12.5px] leading-[19px] text-shop-text/70">
          To request a refund, open the order from{" "}
          <a href="/dashboard/orders" className="text-shop-accent-1 underline">
            Your Orders
          </a>{" "}
          and describe the issue - our team reviews every request individually
          alongside the reasons above.
        </p>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
