"use client";

import ProductCard from "@/app/Components/Product/ProductCard";

// The whole app uses one product card — the marketing card with the white
// panel, hover-reveal action column and image swap. On the dashboard screens
// (which sit on a white background) it gets a border, matching the original
// dashboard card.
export default function AppProductCard(props) {
  return <ProductCard {...props} bordered={props.bordered ?? true} />;
}
