import { Scale } from "lucide-react";
import type { BenchmarkComparisonItem } from "@/types/scoring";
import { BenchmarkCard } from "./benchmark-card";

export function BenchmarkComparison({ comparisons }: { comparisons: BenchmarkComparisonItem[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-sm print-no-shadow sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Scale className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="text-lg font-bold text-card-foreground">مقارنة مع متوسط المحافظ</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {comparisons.map((item) => (
          <BenchmarkCard key={item.key} item={item} />
        ))}
      </div>
    </section>
  );
}
