import React from "react";

const banners = [
  {
    image: "/v2/images/sub-banner-1.avif",
    subheading: "",
    heading: "Stain Blue Lounge Arm Chair",
    price: "Starts at: ₦69.99",
  },
  {
    image: "/v2/images/sub-banner-2.avif",
    subheading: "",
    heading: "Fashion Rose Gold Silver Watch",
    price: "Starts at: ₦59.50",
  },
  {
    image: "/v2/images/sub-banner-3.avif",
    subheading: "",
    heading: "Boult Audio & 100H Playtime",
    price: "Starts at: ₦99.50",
  },
];

const ThreeBannerRow = () => {
  return (
    <div className="mx-auto mt-8 grid w-full max-w-[1460px] grid-cols-1 gap-5 px-4 font-shop sm:grid-cols-3 md:mt-12 md:px-8">
      {banners.map((b) => (
        <div key={b.heading} className="group relative w-full aspect-[446/180] overflow-hidden rounded-[12px] bg-shop-bg">
          <a href="#" className="absolute inset-0 block overflow-hidden">
            <img
              src={b.image}
              alt={b.heading}
              className="h-full w-full object-cover transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.15]"
            />
          </a>
          <div className="pointer-events-none absolute top-0 right-[7%] flex h-full flex-col items-start justify-center gap-1 text-left text-shop-heading sm:items-end sm:text-right">
            <p className="max-w-[160px] text-[14px] font-semibold leading-[18px] sm:max-w-[190px] sm:text-[17px] sm:leading-[22px] md:text-[19px] md:leading-[24px]">
              {b.heading}
            </p>
            <p className="text-[12px] font-medium sm:text-[13px]">
              {b.price.split(":")[0]}:{" "}
              <strong>{b.price.split(":")[1]}</strong>
            </p>
            <a
              href="#"
              className="pointer-events-auto mt-1 w-fit text-[12px] font-semibold underline decoration-2 underline-offset-4 sm:text-[13px] hover:text-shop-accent-1"
            >
              Shop Now
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreeBannerRow;
