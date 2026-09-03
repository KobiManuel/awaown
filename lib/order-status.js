// Display metadata for the API's OrderStatus enum.

export const ORDER_STATUS_META = {
  PENDING_PAYMENT: { label: "Payment pending", tone: "bg-amber-100 text-amber-700" },
  ESCROW_HELD: { label: "Escrow held", tone: "bg-shop-accent-1-light text-shop-accent-1" },
  AWAITING_CONFIRMATION: { label: "Awaiting merchant", tone: "bg-amber-100 text-amber-700" },
  PROCESSING: { label: "Processing", tone: "bg-amber-100 text-amber-700" },
  SHIPPED: { label: "Shipped", tone: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "Delivered", tone: "bg-emerald-100 text-emerald-700" },
  ESCROW_RELEASED: { label: "Completed", tone: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", tone: "bg-red-100 text-red-700" },
  REFUND_REQUESTED: { label: "Refund requested", tone: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Refunded", tone: "bg-shop-bg text-shop-text" },
};

export function statusMeta(status) {
  return ORDER_STATUS_META[status] || { label: status, tone: "bg-shop-bg text-shop-text" };
}

// Timeline steps shown on the order detail page, in order.
export const ORDER_STEPS = [
  { key: "ESCROW_HELD", label: "Payment Confirmed — Escrow Held" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "ESCROW_RELEASED", label: "Completed" },
];
