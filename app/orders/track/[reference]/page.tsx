import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";
import OrderTrackingClient from "./OrderTrackingClient";

export const metadata = {
  title: "Order Details · AwaOwn",
  description: "Track your AwaOwn order.",
};

export default function OrderTrackingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />
      <OrderTrackingClient />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
