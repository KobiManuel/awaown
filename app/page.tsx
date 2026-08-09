import Header from "@/app/Components/Header/header";
import Hero from "@/app/Components/Hero/hero";
import Banners from "@/app/Components/Banners/banners";
import HowItWorks from "@/app/Sections/HowItWorks/main";
import ShopByCategory from "@/app/Sections/ShopByCategory/main";
import NewAndPopular from "@/app/Sections/NewAndPopular/main";
import ForMerchants from "@/app/Sections/ForMerchants/main";
import GetStarted from "@/app/home/v2/GetStarted/main";
import ForAffiliates from "@/app/Sections/ForAffiliates/main";
import Testimonials from "@/app/Sections/Testimonials/main";
import Companies from "@/app/Components/v2/Companies/main";
import FinalCTA from "@/app/Sections/FinalCTA/main";
import Footer from "@/app/Components/Footer/footer";

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
