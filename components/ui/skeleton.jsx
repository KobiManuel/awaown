import { cn } from "@/lib/utils";

/**
 * Base shimmer block. Compose these to match a component's real layout so the
 * page doesn't jump when data arrives.
 *
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton className="h-40 w-full rounded-2xl" />
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-shop-border/60 dark:bg-white/10",
        className,
      )}
      {...props}
    />
  );
}

/** A line of text placeholder; `w` is a tailwind width class. */
export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

/** Product-card shaped placeholder, matches AppProductCard / StorefrontProductCard. */
export function SkeletonProductCard() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3.5 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

/** Grid of product-card skeletons. */
export function SkeletonProductGrid({ count = 6, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}

/** A list-row shaped placeholder (orders, notifications, payouts, etc.). */
export function SkeletonRows({ count = 4, className }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-shop-border p-4"
        >
          <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
