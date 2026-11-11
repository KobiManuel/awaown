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

// Display metadata for a single Shipment's status - distinct from the
// order-wide OrderStatus above. Order status reflects the LEAST-advanced
// merchant leg (see backend OrdersService.rollOrderFromShipments); this is
// what lets a multi-merchant order show that one leg is further along than
// another instead of one collapsed status for every item.
export const SHIPMENT_STATUS_META = {
  pending: { label: "Preparing for pickup", tone: "bg-shop-bg text-shop-text" },
  created: { label: "Scheduled for pickup", tone: "bg-amber-100 text-amber-700" },
  picked_up: { label: "Picked up", tone: "bg-blue-100 text-blue-700" },
  dispatched: { label: "Out for delivery", tone: "bg-blue-100 text-blue-700" },
  delivered: { label: "Delivered", tone: "bg-emerald-100 text-emerald-700" },
  returned: { label: "Delivery issue", tone: "bg-red-100 text-red-700" },
  failed: { label: "Delivery issue", tone: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", tone: "bg-shop-bg text-shop-text" },
};

export function shipmentStatusMeta(status) {
  return (
    SHIPMENT_STATUS_META[status] || { label: status, tone: "bg-shop-bg text-shop-text" }
  );
}

const MOVING_SHIPMENT_STATUSES = ["picked_up", "dispatched", "delivered"];

// Rolls a list of per-merchant shipments into one "how far along is Shipped,
// really" summary - used to annotate the Shipped step on the order timeline
// instead of just asserting it's done because the order ever reached that
// status historically (which can go stale, e.g. after a manual correction).
export function shipmentProgress(shipments = []) {
  const total = shipments.length;
  const movedCount = shipments.filter((s) =>
    MOVING_SHIPMENT_STATUSES.includes(s.status),
  ).length;
  return {
    total,
    movedCount,
    allMoved: total > 0 && movedCount === total,
    partial: total > 1 && movedCount > 0 && movedCount < total,
  };
}

// Timeline steps shown on the order detail page, in order.
export const ORDER_STEPS = [
  { key: "ESCROW_HELD", label: "Payment Confirmed, Escrow Held" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "ESCROW_RELEASED", label: "Completed" },
];
