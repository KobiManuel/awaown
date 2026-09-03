import React from "react";
import HomeProductRow from "@/app/Sections/HomeProductRow";

const BestSelling = () => (
  <HomeProductRow title="Best Selling Products" params={{ sort: "rating" }} />
);

export default BestSelling;
