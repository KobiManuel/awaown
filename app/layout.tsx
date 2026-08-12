import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/app/Components/Providers/ReduxProvider";

const title = "AwaOwn — Shop. Sell. Earn.";
const description =
  "Discover verified merchants across Nigeria, grow your business with a powerful vendor dashboard, and earn real money sharing products you love, all from one platform.";
const siteUrl = "https://awaown-ten.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — AwaOwn",
  },
  description,
  keywords: [
    "AwaOwn",
    "Nigeria marketplace",
    "online shopping Nigeria",
    "verified merchants",
    "sell online Nigeria",
    "affiliate marketing Nigeria",
  ],
  applicationName: "AwaOwn",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "AwaOwn",
    title,
    description,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
