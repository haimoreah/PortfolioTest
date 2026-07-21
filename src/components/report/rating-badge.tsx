import type { Rating } from "@/types/scoring";
import { cn } from "@/lib/utils";

export function RatingBadge({ rating, className }: { rating: Rating; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        rating.backgroundColor,
        rating.textColor,
        rating.borderColor,
        className,
      )}
    >
      {rating.label}
    </span>
  );
}
