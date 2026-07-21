import type { Portfolio } from "@/types/portfolio";
import type { PerformanceScoreResult } from "@/types/scoring";
import { MAX_SCORES, ROI_RULES, getRating } from "./scoring-rules";

function findRoiRule(roiPercent: number) {
  return (
    ROI_RULES.find((rule) => roiPercent >= rule.min && (rule.max === null || roiPercent < rule.max)) ??
    ROI_RULES[ROI_RULES.length - 1]
  );
}

export function calculatePerformanceScore(portfolio: Portfolio): PerformanceScoreResult {
  const rule = findRoiRule(portfolio.roiPercent);
  const score = rule.score;
  const maxScore = MAX_SCORES.performance;

  return {
    roiPercent: portfolio.roiPercent,
    score,
    maxScore,
    rating: getRating((score / maxScore) * 100),
  };
}
