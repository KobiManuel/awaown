import React from "react";
import ProductCarousel from "@/app/Components/Product/ProductCarousel";
import { latestProducts } from "@/lib/shop-data";

const LatestProducts = () => {
  return (
    <div className="mt-12 md:mt-16">
      <ProductCarousel title="Latest Products" products={latestProducts} />
    </div>
  );
};

export default LatestProducts;
