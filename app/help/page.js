import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";
import HelpCentre from "@/app/Components/Dashboard/HelpCentre";

export const metadata = {
  title: "Help Centre · AwaOwn",
  description:
    "Answers to common questions about orders, escrow, payments and delivery on AwaOwn.",
};

// Public mirror of the dashboard Help Centre - same FAQs (no auth needed to
// read them), just without the "start a support conversation" link, which
// only makes sense once you have an account to attach the ticket to.
export default function PublicHelpPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />
      <main className="flex-1 py-6 md:py-10">
        <HelpCentre showHeader={false} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
