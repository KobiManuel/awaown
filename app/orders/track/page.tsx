import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";
import TrackOrderClient from "./TrackOrderClient";

export const metadata = {
  title: "Track an Order · AwaOwn",
  description: "Look up an AwaOwn order with its reference and phone number.",
};

export default function TrackOrderPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />
      <TrackOrderClient />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
