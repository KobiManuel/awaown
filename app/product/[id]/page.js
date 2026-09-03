import { SITE_URL } from "@/lib/site-config";
import ProductView from "./ProductView";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const SITE = SITE_URL;

async function getProduct(slug) {
  try {
    const res = await fetch(`${API}/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) {
    return { title: "Product not found — AwaOwn" };
  }
  const priceLabel = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(p.price);
  const description = (
    p.description ||
    `${p.title} from ${p.vendor} on AwaOwn — escrow-protected checkout.`
  ).slice(0, 160);
  const image = p.images?.[0]?.startsWith("http")
    ? p.images[0]
    : `${SITE}${p.images?.[0] ?? ""}`;
  const url = `${SITE}/product/${p.slug}`;

  return {
    title: `${p.title} — ${priceLabel}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: p.title,
      description,
      images: image ? [{ url: image }] : [],
      siteName: "AwaOwn",
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default function ProductPage() {
  return <ProductView />;
}
