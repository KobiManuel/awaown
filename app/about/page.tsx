import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import AboutContent from "./AboutContent";

export const metadata = {
  title: "About AwaOwn",
  description:
    "AwaOwn is a digital marketplace connecting Merchants, Partners, Inventory Investors and Customers in one ecosystem, with escrow-protected payments and verified participants.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />
      <AboutContent />
      <Footer />
    </div>
  );
}
