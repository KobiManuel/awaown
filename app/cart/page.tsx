import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";
import CartClient from "./CartClient";

export const metadata = {
  title: "Cart — AwaOwn",
  description: "Review the items in your AwaOwn shopping cart.",
};

export default function CartPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />
      <CartClient />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
