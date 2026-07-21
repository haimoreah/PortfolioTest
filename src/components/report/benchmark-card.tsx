import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { BenchmarkComparisonItem, ComparisonStatus } from "@/types/scoring";
import { Card } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/formatters";

const STATUS_LABELS: Record<ComparisonStatus, string> = {
  "above-average": "أعلى من المتوسط",
  "better-than-average": "أفضل من المتوسط",
  "within-average": "ضمن المتوسط",
  "below-average": "أقل من المتوسط",
};

const STATUS_CLASSES: Record<ComparisonStatus, { text: string; bg: string; border: string }> = {
  "above-average": { text: "text-success", bg: "bg-success/10", border: "border-success/30" },
  "better-than-average": { text: "text-success", bg: "bg-success/10", border: "border-success/30" },
  "within-average": { text: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
  "below-average": { text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
};

function formatValue(value: number, unit: BenchmarkComparisonItem["unit"]): string {
  return unit === "percent" ? formatPercent(value) : formatNumber(value, 2);
}

export function BenchmarkCard({ item }: { item: BenchmarkComparisonItem }) {
  const classes = STATUS_CLASSES[item.status];
  const TrendIcon = item.status === "within-average" ? Minus : item.isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <Card className="flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{item.label}</span>
          {item.englishLabel ? <span className="text-xs text-muted-foreground">{item.englishLabel}</span> : null}
        </div>
        <span
          className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${classes.bg} ${classes.text} ${classes.border}`}
        >
          <TrendIcon className="h-3.5 w-3.5" aria-hidden />
          {STATUS_LABELS[item.status]}
        </span>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">قيمة المحفظة</span>
          <span className="text-xl font-extrabold tabular-nums text-foreground">
            {formatValue(item.portfolioValue, item.unit)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">متوسط المحافظ</span>
          <span className="text-sm font-semibold tabular-nums text-muted-foreground">
            {formatValue(item.benchmarkValue, item.unit)}
          </span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        الفرق:{" "}
        <span className={`font-semibold tabular-nums ${classes.text}`}>
          {item.difference >= 0 ? "+" : ""}
          {formatValue(item.difference, item.unit)}
        </span>
        {item.differencePercent !== null ? (
          <span className="tabular-nums"> ({item.differencePercent >= 0 ? "+" : ""}{formatPercent(item.differencePercent, 1)})</span>
        ) : null}
      </div>
    </Card>
  );
}
