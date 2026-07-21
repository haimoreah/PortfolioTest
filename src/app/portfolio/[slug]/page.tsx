import { AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";
import { AssetQualitySection } from "@/components/report/asset-quality-section";
import { BenchmarkComparison } from "@/components/report/benchmark-comparison";
import { ExecutiveSummary } from "@/components/report/executive-summary";
import { PerformanceSection } from "@/components/report/performance-section";
import { PortfolioDataSection } from "@/components/report/portfolio-data-section";
import { ReportHeader } from "@/components/report/report-header";
import { RiskSection } from "@/components/report/risk-section";
import { StabilitySection } from "@/components/report/stability-section";
import { TradingHistorySection } from "@/components/report/trading-history-section";
import { portfolioRepository } from "@/data/portfolio-repository";
import { calculatePortfolioScore, compareToBenchmark } from "@/lib/scoring";
import { validatePortfolio } from "@/lib/validation/portfolio-schema";

export async function generateStaticParams() {
  const { portfolioRepository } = await import("@/data/portfolio-repository");
  // portfolioRepository is in-memory; we list all known slugs so Next.js can
  // pre-render each portfolio page at build time.
  const slugs = ["amwal-w-enta-qaed"];
  return slugs.map((slug) => ({ slug }));
}

interface ReportPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PortfolioReportPage({ params }: ReportPageProps) {
  const { slug } = await params;
  const portfolio = await portfolioRepository.getPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  const validation = validatePortfolio(portfolio);
  if (!validation.success) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="text-xl font-bold text-foreground">لا توجد بيانات كافية لإنشاء التقييم</h1>
        <p className="text-sm text-muted-foreground">
          تحقق من بيانات هذه المحفظة وحاول مرة أخرى، أو تواصل مع فريق الدعم إذا استمرت المشكلة.
        </p>
      </div>
    );
  }

  const benchmarks = await portfolioRepository.getBenchmarks();
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
    </div>
  );
}
