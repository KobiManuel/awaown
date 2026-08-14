import Header from "@/app/Components/Header/header";
import HeroSection from "@/app/Components/Hero/HeroSection";
import ThreeBannerRow from "@/app/Components/Banners/ThreeBannerRow";
import TwoBannerRow from "@/app/Components/Banners/TwoBannerRow";
import OneBannerRow from "@/app/Components/Banners/OneBannerRow";
import LatestProducts from "@/app/Sections/LatestProducts/main";
import ShopByCategories from "@/app/Sections/ShopByCategories/main";
import DealOfWeek from "@/app/Sections/DealOfWeek/main";
import BestSelling from "@/app/Sections/BestSelling/main";
import FreeShipping from "@/app/Sections/FreeShipping/main";
// import FashionTabs from "@/app/Sections/FashionTabs/main";
// import ShopByBrands from "@/app/Sections/ShopByBrands/main";
import Testimonials from "@/app/Sections/Testimonials/main";
import OurCommunity from "@/app/Sections/OurCommunity/main";
import Newsletter from "@/app/Sections/Newsletter/main";
import Footer from "@/app/Components/Footer/footer";
import PurchaseNotification from "@/app/Components/PurchaseNotification/main";
import FloatingCategoryTrigger from "@/app/Components/Header/FloatingCategoryTrigger";
import ScrollToTop from "@/app/Components/Header/ScrollToTop";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />
      <HeroSection />
      <ThreeBannerRow />
      <LatestProducts />
      <ShopByCategories />
      <DealOfWeek />
      <TwoBannerRow />
      <BestSelling />
      <FreeShipping />
      {/* <FashionTabs /> */}
      {/* <ShopByBrands /> */}
      <OneBannerRow />
      <Testimonials />
      <OurCommunity />
      <Newsletter />
      <Footer />
      <PurchaseNotification />
      <FloatingCategoryTrigger />
      <ScrollToTop />
    </div>
  );
}
