import Header from "@/app/v1/Components/Header/header";
import Footer from "@/app/v1/Components/Footer/footer";
import Testimonials from "@/app/v1/Sections/Testimonials/main";
import { ShieldCheck, HandCoins, Users } from "lucide-react";

export const metadata = {
  title: "About — AwaOwn",
  description:
    "AwaOwn is Nigeria's trusted marketplace where shoppers save, merchants grow, and affiliates earn, all in one platform.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Verified, always",
    description:
      "Every merchant on AwaOwn is vetted before they can list a single product, so you can shop with confidence.",
  },
  {
    icon: HandCoins,
    title: "Transparent earnings",
    description:
      "Merchants keep 85–97% of every sale and affiliates get paid on time, every time, with full visibility into every transaction.",
  },
  {
    icon: Users,
    title: "Built for everyone",
    description:
      "Whether you're buying, selling or sharing, AwaOwn gives you the tools to win on Nigeria's most transparent social marketplace.",
  },
];

const stats = [
  { value: "10+", label: "Verified merchants" },
  { value: "50+", label: "Products listed" },
  { value: "30+", label: "Affiliates earning" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      <Header />

      <div className="bg-gradient-to-b from-[#E8F7EE] to-[#F8FBF8] pb-16 pt-32 md:pt-40 lg:rounded-b-[54px]">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6 px-5 text-center">
          <span className="rounded-full border border-[#CDCBF9] bg-[#4361FF1A] px-3 py-1 text-[14px] font-medium text-[#827CF1]">
            About AwaOwn
          </span>
          <h1 className="font-['TomatoGrotesk'] text-[36px] font-semibold leading-[42px] text-[#0A0A13] md:text-[56px] md:leading-[60px]">
            Nigeria&apos;s trusted marketplace
          </h1>
          <p className="max-w-[600px] text-[16px] leading-[26px] text-grey-500 md:text-[18px] md:leading-[28px]">
            AwaOwn is where shoppers save, merchants grow, and affiliates
            earn, all in one platform. We connect verified merchants across
            Nigeria with shoppers who want honest prices and affiliates who
            want to earn real money sharing products they love.
          </p>
        </div>

        <div className="mx-auto mt-14 flex max-w-[700px] flex-wrap items-center justify-center gap-x-14 gap-y-6 px-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <p className="font-['TomatoGrotesk'] text-[30px] font-semibold text-[#0A0A13]">
                {s.value}
              </p>
              <p className="text-[13px] text-grey-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-[40px] px-5 pt-[60px] md:pt-[100px]">
        <div className="flex w-full flex-col items-center justify-center gap-[14px] text-center">
          <h2 className="max-w-[600px] font-['TomatoGrotesk'] text-[28px] font-semibold leading-[34px] text-[#0A0A13] md:text-[40px] md:leading-[46px]">
            What we stand for
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="flex flex-col gap-5 rounded-[24px] bg-[#F0F0F5] p-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-awaown-green">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-['TomatoGrotesk'] text-[20px] font-medium text-[#0A0A13]">
                    {v.title}
                  </h3>
                  <p className="text-[15px] leading-[24px] text-grey-500">
                    {v.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Testimonials />

      <Footer />
    </div>
  );
}
