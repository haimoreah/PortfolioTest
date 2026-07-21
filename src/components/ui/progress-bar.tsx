import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  "aria-label"?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  trackClassName,
  fillClassName,
  "aria-label": ariaLabel,
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", trackClassName, className)}
    >
      <div
        className={cn("h-full rounded-full bg-primary transition-[width] duration-500 ease-out", fillClassName)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
