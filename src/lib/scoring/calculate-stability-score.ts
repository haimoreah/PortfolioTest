import type { Portfolio } from "@/types/portfolio";
import type { StabilityScoreResult } from "@/types/scoring";
import { MAX_SCORES, STABILITY_RULES, getRating } from "./scoring-rules";

export function calculateWinningDaysRatioPercent(portfolio: Portfolio): number {
  const totalDays = portfolio.winningDays + portfolio.losingDays;
  if (totalDays <= 0) {
    return 0;
  }
  return (portfolio.winningDays / totalDays) * 100;
}

export function calculateStabilityScore(portfolio: Portfolio): StabilityScoreResult {
  const rule =
    STABILITY_RULES.find((row) => row.level === portfolio.stabilityLevel) ??
    STABILITY_RULES[STABILITY_RULES.length - 1];

  const score = rule.score;
  const maxScore = MAX_SCORES.stability;

  return {
    stabilityLevel: rule.arabicLevel,
    winningDaysRatioPercent: calculateWinningDaysRatioPercent(portfolio),
    score,
    maxScore,
    rating: getRating((score / maxScore) * 100),
  };
}
