import React from "react";
import HomeProductRow from "@/app/Sections/HomeProductRow";

const LatestProducts = () => (
  <HomeProductRow title="Latest Products" params={{ sort: "newest" }} />
);

export default LatestProducts;
