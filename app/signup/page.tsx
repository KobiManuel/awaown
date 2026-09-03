"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Store, Users2, ArrowRight } from "lucide-react";
import RoleCard from "@/app/Components/Auth/RoleCard";

type Role = "customer" | "merchant" | "partner" | "";

const roles: {
  id: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "customer",
    title: "Customer",
    description: "Shop from verified merchants and track every order.",
    icon: <ShoppingBag className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />,
  },
  {
    id: "merchant",
    title: "Merchant",
    description: "Open a store, list products and receive secure payouts.",
    icon: <Store className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />,
  },
  {
    id: "partner",
    title: "Partner",
    description:
      "Share products with your audience and make profit from every sale.",
    icon: <Users2 className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />,
  },
];

export default function SignupRolePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Role>("");

  const handleContinue = () => {
    if (!selected) return;
    router.push(`/login/${selected}?mode=signup`);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-shop-bg p-4 font-shop">
      <div className="w-full max-w-[480px] overflow-hidden rounded-[24px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col items-center gap-6 bg-gradient-to-b from-shop-accent-1/10 to-white px-6 py-10 sm:px-10">
          <Link
            href="/"
            className="self-start text-[13px] font-semibold text-shop-accent-1 hover:underline"
          >
            ← Go back
          </Link>

          <div className="relative h-14 w-[190px]">
            <Image
              src="/v2/images/awa-logo.webp"
              alt="AwaOwn"
              fill
              className="object-contain"
              priority
            />
          </div>

          <p className="text-center text-[19px] font-semibold text-shop-heading">
            Create your AwaOwn account
          </p>

          <div className="flex w-full flex-col gap-3">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                icon={role.icon}
                title={role.title}
                description={role.description}
                selected={selected === role.id}
                onClick={() => setSelected(role.id)}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={!selected}
            onClick={handleContinue}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors enabled:hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-[14px] text-shop-text">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-shop-accent-1 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
