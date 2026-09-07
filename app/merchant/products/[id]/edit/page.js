"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/app/Components/Merchant/ProductForm";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import {
  useGetMerchantProductsQuery,
  useUpdateMerchantProductMutation,
} from "@/lib/api/merchantApi";
import { errorMessage } from "@/lib/api/errorMessage";

export default function EditMerchantProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const showToast = useToast();

  const { data, isLoading } = useGetMerchantProductsQuery();
  const product = useMemo(
    () => (data?.items ?? []).find((p) => p.productId === id),
    [data, id],
  );
  const [update, { isLoading: saving }] = useUpdateMerchantProductMutation();

  const handleSubmit = async (body, { asDraft }) => {
    const wasDraft = product.status === "DRAFT";
    try {
      await update({ id: product.productId, ...body }).unwrap();
      showToast(
        asDraft
          ? "Draft saved"
          : wasDraft
            ? "Published — sent for admin review"
            : "Product updated",
      );
      router.push("/merchant/products");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  if (isLoading || (!product && !data)) {
    return (
      <div className="flex flex-col gap-4 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
        <AppHeader
          title="Edit Product"
          backHref="/merchant/products"
          showBackOnDesktop
        />
        <div className="px-4">
          <Skeleton className="h-64 w-full rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader
          title="Edit Product"
          backHref="/merchant/products"
          showBackOnDesktop
        />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This product couldn&apos;t be found.
        </p>
      </div>
    );
  }

  return (
    <ProductForm
      key={product.productId}
      product={product}
      submitting={saving}
      onSubmit={handleSubmit}
    />
  );
}
