import type { Portfolio } from "@/types/portfolio";
import type { TradingTypeScoreResult } from "@/types/scoring";
import { MAX_SCORES, TRADING_TYPE_LABELS, getRating } from "./scoring-rules";

export function calculateTradingTypeScore(portfolio: Portfolio): TradingTypeScoreResult {
  const isEligible = portfolio.tradingType === "spot";
  const score = isEligible ? MAX_SCORES.tradingType : 0;
  const maxScore = MAX_SCORES.tradingType;

  return {
    tradingType: TRADING_TYPE_LABELS[portfolio.tradingType] ?? portfolio.tradingType,
    isEligible,
    score,
    maxScore,
    rating: getRating((score / maxScore) * 100),
  };
}
