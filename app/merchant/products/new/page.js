"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/app/Components/Merchant/ProductForm";
import RequireStoreAddress from "@/app/Components/Merchant/RequireStoreAddress";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useCreateMerchantProductMutation } from "@/lib/api/merchantApi";
import { errorMessage } from "@/lib/api/errorMessage";

export default function NewMerchantProductPage() {
  const router = useRouter();
  const showToast = useToast();
  const [createProduct, { isLoading }] = useCreateMerchantProductMutation();

  const handleSubmit = async (body, { asDraft }) => {
    try {
      await createProduct(body).unwrap();
      showToast(
        asDraft
          ? "Draft saved - finish it any time from your products"
          : `${body.title} submitted for admin review`,
      );
      router.push("/merchant/products");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <RequireStoreAddress>
      <ProductForm submitting={isLoading} onSubmit={handleSubmit} />
    </RequireStoreAddress>
  );
}
