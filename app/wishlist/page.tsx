import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";
import { ToastProvider } from "@/app/Components/Dashboard/ToastContext";
import WishlistClient from "./WishlistClient";

export const metadata = {
  title: "Wishlist · AwaOwn",
  description: "Products you've saved for later on AwaOwn.",
};

export default function WishlistPage() {
  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full flex-col bg-shop-bg">
        <Header />
        <WishlistClient />
        <Footer />
        <ScrollToTop />
      </div>
    </ToastProvider>
  );
}
