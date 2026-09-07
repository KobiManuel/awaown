import Image from "next/image";

export const metadata = {
  title: "We'll be back soon · AwaOwn",
  robots: { index: false, follow: false },
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function getMessage() {
  try {
    const r = await fetch(`${API}/site/status`, { cache: "no-store" });
    if (r.ok) {
      const s = (await r.json()) as { message?: string };
      if (s.message) return s.message;
    }
  } catch {
    /* ignore */
  }
  return "We're making some improvements and will be back shortly.";
}

export default async function MaintenancePage() {
  const message = await getMessage();
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-shop-bg px-6 py-16 text-center font-shop">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-5">
        <Image
          src="/v2/images/awa-logo.webp"
          alt="AwaOwn"
          width={130}
          height={34}
          className="h-8 w-auto"
        />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-shop-accent-1-light text-[26px]">
          🛠️
        </div>
        <h1 className="text-[22px] font-bold text-shop-heading md:text-[26px]">
          We&apos;ll be back soon
        </h1>
        <p className="text-[14px] leading-[22px] text-shop-text">{message}</p>
        <p className="text-[12px] text-shop-text/60">Thanks for your patience.</p>
      </div>
    </div>
  );
}
