import { describe, expect, it } from "vitest";
import { demoBenchmarks, demoPortfolio } from "@/data/demo-portfolio";
import { compareToBenchmark } from "@/lib/scoring";
import type { Portfolio, PortfolioBenchmarks } from "@/types/portfolio";

describe("compareToBenchmark - demo portfolio", () => {
  const comparisons = compareToBenchmark(demoPortfolio, demoBenchmarks);

  it("returns five comparison items in a stable order", () => {
    expect(comparisons.map((item) => item.key)).toEqual([
      "sharpeRatio",
      "maximumDrawdownPercent",
      "roiPercent",
      "winRatePercent",
      "assetQualityPercent",
    ]);
  });

  it("flags Sharpe Ratio as above average since higher is better", () => {
    const sharpe = comparisons.find((item) => item.key === "sharpeRatio")!;
    expect(sharpe.direction).toBe("higher-is-better");
    expect(sharpe.status).toBe("above-average");
    expect(sharpe.isPositiveTrend).toBe(true);
  });

  it("flags a lower Maximum Drawdown than the benchmark as a better-than-average result, not a bad one", () => {
    const drawdown = comparisons.find((item) => item.key === "maximumDrawdownPercent")!;
    expect(drawdown.direction).toBe("lower-is-better");
    expect(drawdown.portfolioValue).toBeLessThan(drawdown.benchmarkValue);
    expect(drawdown.status).toBe("better-than-average");
    expect(drawdown.isPositiveTrend).toBe(true);
  });

  it("flags ROI as above average", () => {
    const roi = comparisons.find((item) => item.key === "roiPercent")!;
    expect(roi.status).toBe("above-average");
  });
});

describe("compareToBenchmark - drawdown direction rules", () => {
  const benchmarks: PortfolioBenchmarks = { ...demoBenchmarks, maximumDrawdownPercent: 10 };

  it("treats a portfolio with a higher drawdown than the benchmark as below average", () => {
    const worsePortfolio: Portfolio = { ...demoPortfolio, maximumDrawdownPercent: 20 };
    const comparisons = compareToBenchmark(worsePortfolio, benchmarks);
    const drawdown = comparisons.find((item) => item.key === "maximumDrawdownPercent")!;
    expect(drawdown.status).toBe("below-average");
    expect(drawdown.isPositiveTrend).toBe(false);
  });

  it("treats a portfolio with a much lower drawdown than the benchmark as better than average", () => {
    const betterPortfolio: Portfolio = { ...demoPortfolio, maximumDrawdownPercent: 1 };
    const comparisons = compareToBenchmark(betterPortfolio, benchmarks);
    const drawdown = comparisons.find((item) => item.key === "maximumDrawdownPercent")!;
    expect(drawdown.status).toBe("better-than-average");
  });
});

describe("compareToBenchmark - within-average tolerance", () => {
  it("classifies near-identical values as within average", () => {
    const nearBenchmark: Portfolio = { ...demoPortfolio, roiPercent: demoBenchmarks.roiPercent * 1.01 };
    const comparisons = compareToBenchmark(nearBenchmark, demoBenchmarks);
    const roi = comparisons.find((item) => item.key === "roiPercent")!;
    expect(roi.status).toBe("within-average");
  });
});
