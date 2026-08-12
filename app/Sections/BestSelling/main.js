import React from "react";
import ProductCarousel from "@/app/Components/Product/ProductCarousel";
import { bestSellingProducts } from "@/lib/shop-data";

const BestSelling = () => {
  return (
    <div className="mt-12 md:mt-16">
      <ProductCarousel title="Best Selling Products" products={bestSellingProducts} />
    </div>
  );
};

export default BestSelling;
