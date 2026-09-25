import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  FileLock2,
  CreditCard,
  UserCog,
} from "lucide-react";

export const metadata = {
  title: "Data Privacy · AwaOwn",
  description:
    "How AwaOwn protects your personal information and keeps the ID documents you submit for verification secure.",
};

const SAFEGUARDS = [
  {
    icon: Lock,
    title: "Encrypted connections, always",
    body: "Every page and every request between your device and AwaOwn - browsing, checking out, uploading a document - travels over an encrypted (HTTPS) connection. Nobody sitting on the network in between can read it.",
  },
  {
    icon: FileLock2,
    title: "ID and verification documents stay private",
    body: "When a merchant or Partner submits an ID or business document to get verified, it's stored in a locked-down, private system - not a public web address anyone with a link could open. Our verification team can only view it through a secure link that's generated on demand and expires shortly after, so a document is never sitting out in the open.",
  },
  {
    icon: CreditCard,
    title: "We never see your card details",
    body: "Payments are processed by Paystack, a licensed and PCI-compliant payment provider. Your card number, expiry and CVV go straight to them - AwaOwn's own systems never receive or store that information.",
  },
  {
    icon: KeyRound,
    title: "Your password can't be read - by anyone",
    body: "Passwords are run through a one-way scrambling process before they're stored. That means even our own engineers can't look up what your password is - only you know it.",
  },
  {
    icon: UserCog,
    title: "Staff access is limited and logged",
    body: "Our team members can only see the information their role actually needs to do its job - Support doesn't see Finance data, and so on. Every sensitive action taken from our admin systems is recorded in an audit trail.",
  },
  {
    icon: ShieldCheck,
    title: "Built to fail safely",
    body: "Where something can't be verified or a request looks unusual, our systems are built to deny access by default rather than quietly let it through.",
  },
];

export default function DataPrivacyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />
      <main className="mx-auto w-full max-w-[820px] flex-1 px-4 py-10 font-shop md:px-8 md:py-16">
        <h1 className="text-[24px] font-bold text-shop-heading md:text-[30px]">
          Data Privacy
        </h1>
        <p className="mt-2 text-[13.5px] leading-[21px] text-shop-text">
          Shopping, selling or earning on AwaOwn means trusting us with real
          information about you - your contact details, your delivery
          address, sometimes an ID document to get verified as a Merchant or
          Partner. Here&apos;s a plain-language look at how we look after it.
        </p>

        <section className="mt-8 flex flex-col gap-3">
          <h2 className="text-[16px] font-semibold text-shop-heading">
            What We Collect, and Why
          </h2>
          <p className="text-[13px] leading-[20px] text-shop-text">
            We only collect what&apos;s actually needed to run the
            marketplace: account and contact details, delivery addresses,
            order and payment records, and - for Merchants and Partners -
            the identity-verification information Nigerian law and our own
            trust standards require before someone can sell or get paid on
            the platform. We don&apos;t collect information &quot;just in
            case,&quot; and we don&apos;t sell your data to anyone.
          </p>
        </section>

        <section className="mt-10 flex flex-col gap-4">
          <div>
            <h2 className="text-[16px] font-semibold text-shop-heading">
              How We Keep It Safe
            </h2>
            <p className="mt-1 text-[13px] leading-[20px] text-shop-text">
              A few of the specific safeguards behind the scenes:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SAFEGUARDS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-accent-1-light">
                  <Icon className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
                </span>
                <h3 className="text-[13.5px] font-semibold text-shop-heading">
                  {title}
                </h3>
                <p className="text-[12.5px] leading-[19px] text-shop-text">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 flex flex-col gap-3">
          <h2 className="text-[16px] font-semibold text-shop-heading">
            Your Verification Documents, Specifically
          </h2>
          <p className="text-[13px] leading-[20px] text-shop-text">
            ID documents and other verification files are treated with the
            highest level of protection we apply to any data on the
            platform. They&apos;re used only to confirm you are who you say
            you are, they&apos;re only ever viewed by our verification team
            when a review actually requires it, and they&apos;re never
            shared publicly or handed to another Merchant, Partner or
            Shopper.
          </p>
        </section>

        <section className="mt-10 flex flex-col gap-3">
          <h2 className="text-[16px] font-semibold text-shop-heading">
            You&apos;re Still in Control
          </h2>
          <p className="text-[13px] leading-[20px] text-shop-text">
            You can ask us what information we hold about you, ask us to
            correct it, or ask us to delete your account and associated
            data, subject to what we&apos;re legally required to keep (like
            order records, for tax and dispute purposes). Reach out to{" "}
            <a href="mailto:hello@awaown.com" className="text-shop-accent-1 underline">
              hello@awaown.com
            </a>{" "}
            for any of this.
          </p>
        </section>

        <p className="mt-10 text-[12.5px] leading-[19px] text-shop-text/70">
          This page explains our approach in plain language. For the full
          legal detail - what we collect, how long we keep it, and your
          rights under Nigerian data-protection law - see our{" "}
          <a href="/legal#awaown-privacy-policy" className="text-shop-accent-1 underline">
            Privacy Policy
          </a>{" "}
          in the Legal section.
        </p>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
