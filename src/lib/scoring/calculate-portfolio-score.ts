import type { Portfolio } from "@/types/portfolio";
import type { PortfolioScoreResult } from "@/types/scoring";
import { calculateAssetQualityScore } from "./calculate-asset-quality-score";
import { calculatePerformanceScore } from "./calculate-performance-score";
import { calculateRiskScore } from "./calculate-risk-score";
import { calculateStabilityScore } from "./calculate-stability-score";
import { calculateTradingTypeScore } from "./calculate-trading-type-score";
import { MAX_SCORES, getRating } from "./scoring-rules";

export function calculatePortfolioScore(portfolio: Portfolio): PortfolioScoreResult {
  const risk = calculateRiskScore(portfolio);
  const performance = calculatePerformanceScore(portfolio);
  const assetQuality = calculateAssetQualityScore(portfolio);
  const stability = calculateStabilityScore(portfolio);
  const tradingType = calculateTradingTypeScore(portfolio);

  const rawScore = risk.score + performance.score + assetQuality.score + stability.score + tradingType.score;
  const finalScore = Math.min(MAX_SCORES.final, Math.max(0, rawScore));

  return {
    risk,
    performance,
    assetQuality,
    stability,
    tradingType,
    finalScore,
    maxFinalScore: MAX_SCORES.final,
    rating: getRating(finalScore),
  };
}
