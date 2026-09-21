import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";
import { ToastProvider } from "@/app/Components/Dashboard/ToastContext";
import CartClient from "./CartClient";
import CartShell from "./CartShell";

export const metadata = {
  title: "Cart · AwaOwn",
  description: "Review the items in your AwaOwn shopping cart.",
};

export default function CartPage() {
  return (
    <CartShell>
      <ToastProvider>
        <Header />
        <CartClient />
        <Footer />
        <ScrollToTop />
      </ToastProvider>
    </CartShell>
  );
}
