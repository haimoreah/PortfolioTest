export type RatingLabel = "ممتاز" | "جيد جداً" | "جيد" | "مقبول" | "ضعيف";

export interface Rating {
  label: RatingLabel;
  color: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

export interface CriterionResult {
  score: number;
  maxScore: number;
  rating: Rating;
}

export interface SharpeCriterionResult extends CriterionResult {
  sharpeRatio: number;
}

export interface DrawdownCriterionResult extends CriterionResult {
  maximumDrawdownPercent: number;
}

export interface RiskScoreResult extends CriterionResult {
  sharpe: SharpeCriterionResult;
  drawdown: DrawdownCriterionResult;
}

export interface PerformanceScoreResult extends CriterionResult {
  roiPercent: number;
}

export interface AssetQualityScoreResult extends CriterionResult {
  assetQualityPercent: number;
}

export interface StabilityScoreResult extends CriterionResult {
  stabilityLevel: string;
  winningDaysRatioPercent: number;
}

export interface TradingTypeScoreResult extends CriterionResult {
  tradingType: string;
  isEligible: boolean;
}

export interface PortfolioScoreResult {
  risk: RiskScoreResult;
  performance: PerformanceScoreResult;
  assetQuality: AssetQualityScoreResult;
  stability: StabilityScoreResult;
  tradingType: TradingTypeScoreResult;
  finalScore: number;
  maxFinalScore: number;
  rating: Rating;
}

export type ComparisonDirection = "higher-is-better" | "lower-is-better";

export type ComparisonStatus = "above-average" | "better-than-average" | "within-average" | "below-average";

export interface BenchmarkComparisonItem {
  key: string;
  label: string;
  englishLabel?: string;
  portfolioValue: number;
  benchmarkValue: number;
  difference: number;
  differencePercent: number | null;
  status: ComparisonStatus;
  direction: ComparisonDirection;
  isPositiveTrend: boolean;
  unit: "percent" | "ratio";
}
