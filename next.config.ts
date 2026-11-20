import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary: all uploaded media (products, store banners/logos,
      // KYC docs, campaign images, partner store art)
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    // Routes every <Image> through Cloudinary's own CDN transformations
    // instead of Vercel's Image Optimization API - see lib/cloudinary-loader.js
    // for why (the free plan's optimization quota was the actual cause of
    // "broken images" that kept showing up once the catalog/traffic grew).
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.js",
  },
};

export default nextConfig;
