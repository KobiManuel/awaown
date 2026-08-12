import Header from "@/app/v1/Components/Header/header";
import Footer from "@/app/v1/Components/Footer/footer";
import Featured from "@/app/v1/Sections/Featured/main";
import ShopByCategory from "@/app/v1/Sections/ShopByCategory/main";

export const metadata = {
  title: "Shop — AwaOwn",
  description:
    "Browse verified merchants across Nigeria on AwaOwn's marketplace.",
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="pt-32 md:pt-40">
        <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center gap-4 px-5 text-center">
          <span className="rounded-full border border-[#CDCBF9] bg-[#4361FF1A] px-3 py-1 text-[14px] font-medium text-[#827CF1]">
            Shop
          </span>
          <h1 className="font-['TomatoGrotesk'] text-[32px] font-semibold leading-[38px] text-[#0A0A13] md:text-[48px] md:leading-[54px]">
            Products from verified merchants
          </h1>
          <p className="max-w-[520px] text-[16px] leading-[26px] text-grey-500">
            Discover thousands of products from verified merchants across
            Nigeria, all in one place.
          </p>
        </div>
      </div>

      <ShopByCategory />
      <Featured />

      <Footer />
    </div>
  );
}
