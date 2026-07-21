import type { Portfolio } from "@/types/portfolio";
import type { AssetQualityScoreResult } from "@/types/scoring";
import { ASSET_QUALITY_RULES, MAX_SCORES, getRating } from "./scoring-rules";

function findAssetQualityRule(assetQualityPercent: number) {
  return (
    ASSET_QUALITY_RULES.find(
      (rule) => assetQualityPercent >= rule.min && (rule.max === null || assetQualityPercent < rule.max),
    ) ?? ASSET_QUALITY_RULES[ASSET_QUALITY_RULES.length - 1]
  );
}

export function calculateAssetQualityScore(portfolio: Portfolio): AssetQualityScoreResult {
  const rule = findAssetQualityRule(portfolio.assetQualityPercent);
  const score = rule.score;
  const maxScore = MAX_SCORES.assetQuality;

  return {
    assetQualityPercent: portfolio.assetQualityPercent,
    score,
    maxScore,
    rating: getRating((score / maxScore) * 100),
  };
}
