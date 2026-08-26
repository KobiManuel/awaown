import Link from "next/link";

const AnnouncementBar = () => {
  return (
    <div className="hidden border-b border-shop-border bg-white font-shop text-[13px] text-shop-text md:block">
      <div className="mx-auto grid w-full max-w-[1460px] grid-cols-3 items-center px-8 py-2">
        <div />
        <p className="text-center">
          Limited-Time Offers : Mid-Summer Season Sale Live Now -{" "}
          <a href="#" className="underline hover:text-shop-accent-1">
            SHOP NOW
          </a>
        </p>
        <div className="flex items-center justify-end gap-3">
          <Link
            href="#"
            className="rounded-[8px] bg-shop-accent-1 px-4 py-4 text-[13px] font-semibold leading-none text-white transition-colors hover:bg-shop-accent-1-dark"
          >
            Become a Merchant
          </Link>
          <Link
            href="#"
            className="rounded-[8px] bg-shop-accent-1-light px-4 py-4 text-[13px] font-semibold leading-none text-shop-accent-1-dark transition-colors hover:bg-shop-accent-1-light/70"
          >
            Become a Partner
          </Link>
          <Link href="/login" className="px-2 hover:text-shop-accent-1">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
