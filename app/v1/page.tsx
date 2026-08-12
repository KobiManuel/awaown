import Header from "@/app/v1/Components/Header/header";
import Hero from "@/app/v1/Components/Hero/hero";
import Banners from "@/app/v1/Components/Banners/banners";
import HowItWorks from "@/app/v1/Sections/HowItWorks/main";
import ShopByCategory from "@/app/v1/Sections/ShopByCategory/main";
import NewAndPopular from "@/app/v1/Sections/NewAndPopular/main";
import ForMerchants from "@/app/v1/Sections/ForMerchants/main";
import GetStarted from "@/app/v1/home/v2/GetStarted/main";
import ForAffiliates from "@/app/v1/Sections/ForAffiliates/main";
import Testimonials from "@/app/v1/Sections/Testimonials/main";
import Companies from "@/app/v1/Components/v2/Companies/main";
import FinalCTA from "@/app/v1/Sections/FinalCTA/main";
import Footer from "@/app/v1/Components/Footer/footer";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <Hero />
      <Banners />
      <HowItWorks />
      <ShopByCategory />
      <NewAndPopular />
      <ForMerchants />
      <GetStarted />
      <ForAffiliates />
      <Testimonials />
      <Companies />
      <FinalCTA />
      <Footer />
    </div>
  );
}
