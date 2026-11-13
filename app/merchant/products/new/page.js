"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/app/Components/Merchant/ProductForm";
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
      return true;
    } catch (err) {
      showToast(errorMessage(err));
      return false;
    }
  };

  // Fire-and-forget: called when the form unmounts (navigated away, closed
  // tab's SPA route, etc.) with unsaved work still on it. No navigation here
  // - the user's already leaving on their own; this just makes sure what
  // they typed isn't lost. See ProductForm's autosave-on-exit effect.
  const handleAutoSaveDraft = async (body) => {
    try {
      await createProduct(body).unwrap();
      showToast("Your draft was saved automatically");
    } catch {
      showToast("Couldn't auto-save your draft - it wasn't saved");
    }
  };

  return (
    <ProductForm
      submitting={isLoading}
      onSubmit={handleSubmit}
      onAutoSaveDraft={handleAutoSaveDraft}
    />
  );
}
