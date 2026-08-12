import React from "react";
import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <div
        className="relative flex h-[272px] flex-col items-center justify-center gap-3 overflow-hidden rounded-[16px] px-6 text-center"
        style={{
          backgroundImage: "url(/v2/images/newsletter.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative flex flex-col items-center gap-3">
          <Mail className="h-7 w-7 text-white" />
          <h2 className="text-[22px] font-semibold text-white md:text-[28px]">
            Sign Up &amp; Subscribe To Our Newsletter
          </h2>
          <p className="max-w-[440px] text-[14px] text-white/85">
            Subscribe to our latest newsletter to get news about special discounts &amp; upcoming sales
          </p>
          <form className="mt-1 flex w-full max-w-[420px] overflow-hidden rounded-[4px]">
            <input
              type="email"
              placeholder="Email"
              className="h-12 w-full flex-1 bg-white px-4 text-[14px] text-shop-heading outline-none"
            />
            <button
              type="submit"
              className="h-12 shrink-0 bg-shop-accent-1 px-6 text-[13px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-shop-accent-1-dark"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
