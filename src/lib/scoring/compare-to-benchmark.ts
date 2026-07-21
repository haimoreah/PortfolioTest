import type { Portfolio, PortfolioBenchmarks } from "@/types/portfolio";
import type { BenchmarkComparisonItem, ComparisonDirection, ComparisonStatus } from "@/types/scoring";

const WITHIN_AVERAGE_TOLERANCE_PERCENT = 3;

interface ComparisonDefinition {
  key: string;
  label: string;
  englishLabel?: string;
  direction: ComparisonDirection;
  unit: "percent" | "ratio";
  portfolioValue: number;
  benchmarkValue: number;
}

function resolveStatus(
  difference: number,
  direction: ComparisonDirection,
  portfolioValue: number,
  benchmarkValue: number,
): { status: ComparisonStatus; isPositiveTrend: boolean } {
  const referenceMagnitude = Math.max(Math.abs(benchmarkValue), Math.abs(portfolioValue), 1e-9);
  const differencePercentOfBenchmark = (Math.abs(difference) / referenceMagnitude) * 100;

  if (differencePercentOfBenchmark <= WITHIN_AVERAGE_TOLERANCE_PERCENT) {
    return { status: "within-average", isPositiveTrend: true };
  }

  const isBetter = direction === "higher-is-better" ? difference > 0 : difference < 0;

  if (isBetter) {
    return {
      status: direction === "higher-is-better" ? "above-average" : "better-than-average",
      isPositiveTrend: true,
    };
  }

  return { status: "below-average", isPositiveTrend: false };
}

function buildComparisonItem(definition: ComparisonDefinition): BenchmarkComparisonItem {
  const { key, label, englishLabel, direction, unit, portfolioValue, benchmarkValue } = definition;
  const difference = portfolioValue - benchmarkValue;
  const differencePercent = benchmarkValue !== 0 ? (difference / Math.abs(benchmarkValue)) * 100 : null;
  const { status, isPositiveTrend } = resolveStatus(difference, direction, portfolioValue, benchmarkValue);

  return {
    key,
    label,
    englishLabel,
    portfolioValue,
    benchmarkValue,
    difference,
    differencePercent,
    status,
    direction,
    isPositiveTrend,
    unit,
  };
}

export function compareToBenchmark(
  portfolio: Portfolio,
  benchmarks: PortfolioBenchmarks,
): BenchmarkComparisonItem[] {
  return [
    buildComparisonItem({
      key: "sharpeRatio",
      label: "معدل شارب",
      englishLabel: "Sharpe Ratio",
      direction: "higher-is-better",
      unit: "ratio",
      portfolioValue: portfolio.sharpeRatio,
      benchmarkValue: benchmarks.sharpeRatio,
    }),
    buildComparisonItem({
      key: "maximumDrawdownPercent",
      label: "أقصى تراجع",
      englishLabel: "Maximum Drawdown",
      direction: "lower-is-better",
      unit: "percent",
      portfolioValue: portfolio.maximumDrawdownPercent,
      benchmarkValue: benchmarks.maximumDrawdownPercent,
    }),
    buildComparisonItem({
      key: "roiPercent",
      label: "العائد على الاستثمار",
      englishLabel: "ROI",
      direction: "higher-is-better",
      unit: "percent",
      portfolioValue: portfolio.roiPercent,
      benchmarkValue: benchmarks.roiPercent,
    }),
    buildComparisonItem({
      key: "winRatePercent",
      label: "معدل الفوز",
      englishLabel: "Win Rate",
      direction: "higher-is-better",
      unit: "percent",
      portfolioValue: portfolio.winRatePercent,
      benchmarkValue: benchmarks.winRatePercent,
    }),
    buildComparisonItem({
      key: "assetQualityPercent",
      label: "جودة الأصول",
      englishLabel: "Asset Quality",
      direction: "higher-is-better",
      unit: "percent",
      portfolioValue: portfolio.assetQualityPercent,
      benchmarkValue: benchmarks.assetQualityPercent,
    }),
  ];
}
