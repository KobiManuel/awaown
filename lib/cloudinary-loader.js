// Custom next/image loader (see next.config.ts images.loaderFile).
//
// Every <Image> on the site now routes through this instead of Vercel's
// built-in Image Optimization API. Vercel's free Hobby plan caps that
// service at 1,000 optimized source images/month - once a deployment's
// catalog/traffic pushes past that, any image/size combo that hasn't
// already been cached starts failing with a 402
// OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED, which is exactly what was
// showing up as "broken images" on the storefront (most visibly when
// switching to a less-common product photo that had never been optimized
// before).
//
// Cloudinary already resizes/transforms/serves images reliably on its own
// CDN (that's the whole product) and this project already pays for it -
// building the transformation directly into the URL here means Vercel
// never touches these requests at all, so this limit no longer applies to
// any Cloudinary-hosted image (the vast majority: products, banners,
// avatars, store art).
export default function cloudinaryLoader({ src, width }) {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) {
    // Local/static asset (e.g. /v2/images/*) - nothing for Cloudinary to
    // transform, serve as-is.
    return src;
  }
  // f_auto: best format for the requesting browser (webp/avif/etc).
  // q_auto: Cloudinary's own quality algorithm - better than forwarding
  // next/image's generic `quality` prop.
  // c_limit: scales down to fit width, never upscales or crops.
  const transform = `f_auto,q_auto,c_limit,w_${width}`;
  return src.replace("/upload/", `/upload/${transform}/`);
}
