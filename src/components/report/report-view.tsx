import { AlertTriangle } from "lucide-react";
import { SiteFooter } from "@/components/brand/site-footer";
import type { Portfolio, PortfolioBenchmarks } from "@/types/portfolio";
import { calculatePortfolioScore, compareToBenchmark } from "@/lib/scoring";
import { AssetQualitySection } from "./asset-quality-section";
import { BenchmarkComparison } from "./benchmark-comparison";
import { ExecutiveSummary } from "./executive-summary";
import { PerformanceSection } from "./performance-section";
import { PortfolioDataSection } from "./portfolio-data-section";
import { ReportHeader } from "./report-header";
import { RiskSection } from "./risk-section";
import { StabilitySection } from "./stability-section";
import { TradingHistorySection } from "./trading-history-section";

export function ReportView({
  portfolio,
  benchmarks,
}: {
  portfolio: Portfolio;
  benchmarks: PortfolioBenchmarks;
}) {
  const scoreResult = calculatePortfolioScore(portfolio);
  const comparisons = compareToBenchmark(portfolio, benchmarks);
  const isEligible = portfolio.tradingType === "spot";

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <ReportHeader portfolio={portfolio} scoreResult={scoreResult} />

      {!isEligible ? (
        <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-destructive/30 bg-destructive/10 p-5 text-destructive">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p className="text-sm font-semibold leading-relaxed">
            هذه المحفظة غير مؤهلة. تقييم ME Spot Portfolio Score مخصص لمحافظ Spot فقط.
          </p>
        </div>
      ) : null}

      <ExecutiveSummary scoreResult={scoreResult} />

      <BenchmarkComparison comparisons={comparisons} />

      <RiskSection risk={scoreResult.risk} />
      <PerformanceSection performance={scoreResult.performance} portfolio={portfolio} />
      <AssetQualitySection assetQuality={scoreResult.assetQuality} portfolio={portfolio} />
      <StabilitySection stability={scoreResult.stability} portfolio={portfolio} />
      <PortfolioDataSection portfolio={portfolio} />
      <TradingHistorySection portfolio={portfolio} />

      <p className="print-force-open text-center text-xs text-muted-foreground">
        هذا التقرير لأغراض التقييم والمعلومات العامة فقط.
      </p>

      <SiteFooter />
    </div>
  );
}
