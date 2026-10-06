import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";
import CheckoutShell from "./CheckoutShell";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout · AwaOwn",
  description: "Complete your AwaOwn order.",
};

export default function CheckoutPage() {
  return (
    <CheckoutShell>
      <Header />
      <CheckoutClient />
      <Footer />
      <ScrollToTop />
    </CheckoutShell>
  );
}
