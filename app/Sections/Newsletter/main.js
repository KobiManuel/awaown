"use client";

import React, { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { useSubscribeNewsletterMutation } from "@/lib/api/storefrontApi";
import { errorMessage } from "@/lib/api/errorMessage";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    try {
      await subscribe(email.trim()).unwrap();
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(errorMessage(err, "Couldn't subscribe - try again"));
    }
  };

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
          {submitted ? (
            <p className="mt-1 text-[14px] font-medium text-white">
              Thanks - we&apos;ll be in touch!
            </p>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="mt-1 flex w-full max-w-[420px] overflow-hidden rounded-[4px]"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="h-12 w-full flex-1 bg-white px-4 text-[14px] text-shop-heading outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 shrink-0 items-center gap-1.5 bg-shop-accent-1 px-6 text-[13px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-shop-accent-1-dark disabled:opacity-70"
                >
                  {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Subscribe
                </button>
              </form>
              {error && (
                <p className="text-[12.5px] font-medium text-white/90">{error}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
