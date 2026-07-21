import { describe, expect, it } from "vitest";
import { demoPortfolio } from "@/data/demo-portfolio";
import {
  calculatePortfolioScore,
  calculateSharpeScore,
  calculateDrawdownScore,
  calculateTradingTypeScore,
} from "@/lib/scoring";
import type { Portfolio } from "@/types/portfolio";

describe("calculatePortfolioScore - demo portfolio", () => {
  const result = calculatePortfolioScore(demoPortfolio);

  it("scores risk section at 40/40", () => {
    expect(result.risk.score).toBe(40);
    expect(result.risk.maxScore).toBe(40);
  });

  it("scores performance section at 17/20", () => {
    expect(result.performance.score).toBe(17);
    expect(result.performance.maxScore).toBe(20);
  });

  it("scores asset quality section at 14/15", () => {
    expect(result.assetQuality.score).toBe(14);
    expect(result.assetQuality.maxScore).toBe(15);
  });

  it("scores stability section at 13/15", () => {
    expect(result.stability.score).toBe(13);
    expect(result.stability.maxScore).toBe(15);
  });

  it("scores trading type section at 10/10", () => {
    expect(result.tradingType.score).toBe(10);
    expect(result.tradingType.maxScore).toBe(10);
  });

  it("produces a final score of 94/100", () => {
    expect(result.finalScore).toBe(94);
    expect(result.maxFinalScore).toBe(100);
  });

  it("assigns the 'ممتاز' rating", () => {
    expect(result.rating.label).toBe("ممتاز");
  });
});

describe("calculateSharpeScore boundary values", () => {
  it("scores 20 at exactly 3.00", () => {
    expect(calculateSharpeScore(3).score).toBe(20);
  });

  it("scores 18 at exactly 2.00", () => {
    expect(calculateSharpeScore(2).score).toBe(18);
  });

  it("scores 18 just below 3.00", () => {
    expect(calculateSharpeScore(2.99).score).toBe(18);
  });

  it("scores 15 at exactly 1.00", () => {
    expect(calculateSharpeScore(1).score).toBe(15);
  });

  it("scores 10 at exactly 0.50", () => {
    expect(calculateSharpeScore(0.5).score).toBe(10);
  });

  it("scores 5 below 0.50", () => {
    expect(calculateSharpeScore(0.49).score).toBe(5);
  });
});

describe("calculateDrawdownScore boundary values", () => {
  it("scores 20 below 2%", () => {
    expect(calculateDrawdownScore(1.99).score).toBe(20);
  });

  it("scores 18 at exactly 2%", () => {
    expect(calculateDrawdownScore(2).score).toBe(18);
  });

  it("scores 15 at exactly 5%", () => {
    expect(calculateDrawdownScore(5).score).toBe(15);
  });

  it("scores 10 at exactly 10%", () => {
    expect(calculateDrawdownScore(10).score).toBe(10);
  });

  it("scores 10 at exactly 20% (inclusive upper bound)", () => {
    expect(calculateDrawdownScore(20).score).toBe(10);
  });

  it("scores 5 above 20%", () => {
    expect(calculateDrawdownScore(20.01).score).toBe(5);
  });
});

describe("calculateTradingTypeScore", () => {
  it("gives futures portfolios a score of 0 and marks them ineligible", () => {
    const futuresPortfolio: Portfolio = { ...demoPortfolio, tradingType: "futures" };
    const result = calculateTradingTypeScore(futuresPortfolio);
    expect(result.score).toBe(0);
    expect(result.isEligible).toBe(false);
  });

  it("gives margin portfolios a score of 0", () => {
    const marginPortfolio: Portfolio = { ...demoPortfolio, tradingType: "margin" };
    expect(calculateTradingTypeScore(marginPortfolio).score).toBe(0);
  });

  it("gives spot portfolios the full score", () => {
    expect(calculateTradingTypeScore(demoPortfolio).score).toBe(10);
  });
});

describe("final score clamping", () => {
  it("never exceeds 100", () => {
    const perfectPortfolio: Portfolio = {
      ...demoPortfolio,
      sharpeRatio: 10,
      maximumDrawdownPercent: 0,
      roiPercent: 20,
      assetQualityPercent: 100,
      stabilityLevel: "very-stable",
    };
    expect(calculatePortfolioScore(perfectPortfolio).finalScore).toBeLessThanOrEqual(100);
  });

  it("never drops below 0", () => {
    const worstPortfolio: Portfolio = {
      ...demoPortfolio,
      sharpeRatio: 0,
      maximumDrawdownPercent: 50,
      roiPercent: -10,
      assetQualityPercent: 0,
      stabilityLevel: "unstable",
      tradingType: "futures",
    };
    expect(calculatePortfolioScore(worstPortfolio).finalScore).toBeGreaterThanOrEqual(0);
  });
});

describe("winning days ratio division-by-zero safety", () => {
  it("returns 0 instead of NaN when there are no trading days recorded", () => {
    const noDaysPortfolio: Portfolio = { ...demoPortfolio, winningDays: 0, losingDays: 0 };
    const result = calculatePortfolioScore(noDaysPortfolio);
    expect(Number.isNaN(result.stability.winningDaysRatioPercent)).toBe(false);
    expect(result.stability.winningDaysRatioPercent).toBe(0);
  });
});
