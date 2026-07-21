import type { Rating, RatingLabel } from "@/types/scoring";

export const MAX_SCORES = {
  risk: 40,
  sharpe: 20,
  drawdown: 20,
  performance: 20,
  assetQuality: 15,
  stability: 15,
  tradingType: 10,
  final: 100,
} as const;

interface RatingDefinition {
  min: number;
  label: RatingLabel;
  color: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

const OVERALL_RATING_TABLE: RatingDefinition[] = [
  {
    min: 90,
    label: "ممتاز",
    color: "emerald",
    backgroundColor: "bg-emerald-50 dark:bg-emerald-500/10",
    textColor: "text-emerald-700 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-500/30",
  },
  {
    min: 80,
    label: "جيد جداً",
    color: "blue",
    backgroundColor: "bg-blue-50 dark:bg-blue-500/10",
    textColor: "text-blue-700 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-500/30",
  },
  {
    min: 70,
    label: "جيد",
    color: "orange",
    backgroundColor: "bg-orange-50 dark:bg-orange-500/10",
    textColor: "text-orange-700 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-500/30",
  },
  {
    min: 60,
    label: "مقبول",
    color: "yellow",
    backgroundColor: "bg-yellow-50 dark:bg-yellow-500/10",
    textColor: "text-yellow-700 dark:text-yellow-400",
    borderColor: "border-yellow-200 dark:border-yellow-500/30",
  },
  {
    min: 0,
    label: "ضعيف",
    color: "red",
    backgroundColor: "bg-red-50 dark:bg-red-500/10",
    textColor: "text-red-700 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-500/30",
  },
];

/**
 * Score-to-rating mapping is centralized here so no component or scoring
 * function duplicates the color/label thresholds.
 */
export function getRating(scorePercent: number): Rating {
  const definition =
    OVERALL_RATING_TABLE.find((row) => scorePercent >= row.min) ??
    OVERALL_RATING_TABLE[OVERALL_RATING_TABLE.length - 1];

  const { min: _min, ...rating } = definition;
  void _min;
  return rating;
}

export interface SharpeRule {
  min: number;
  max: number | null;
  score: number;
  label: string;
}

export const SHARPE_RULES: SharpeRule[] = [
  { min: 3, max: null, score: 20, label: "ممتاز" },
  { min: 2, max: 3, score: 18, label: "جيد جداً" },
  { min: 1, max: 2, score: 15, label: "جيد" },
  { min: 0.5, max: 1, score: 10, label: "مقبول" },
  { min: -Infinity, max: 0.5, score: 5, label: "ضعيف" },
];

export interface DrawdownRule {
  min: number;
  max: number | null;
  /** When true, a value exactly equal to `max` still belongs to this bracket. */
  maxInclusive?: boolean;
  score: number;
  label: string;
}

export const DRAWDOWN_RULES: DrawdownRule[] = [
  { min: -Infinity, max: 2, score: 20, label: "ممتاز" },
  { min: 2, max: 5, score: 18, label: "جيد جداً" },
  { min: 5, max: 10, score: 15, label: "جيد" },
  { min: 10, max: 20, maxInclusive: true, score: 10, label: "مقبول" },
  { min: 20, max: null, score: 5, label: "ضعيف" },
];

export interface RoiRule {
  min: number;
  max: number | null;
  score: number;
  label: string;
}

export const ROI_RULES: RoiRule[] = [
  { min: 8, max: null, score: 20, label: "ممتاز" },
  { min: 5, max: 8, score: 18, label: "جيد جداً" },
  { min: 3, max: 5, score: 17, label: "جيد" },
  { min: 1, max: 3, score: 13, label: "مقبول" },
  { min: -Infinity, max: 1, score: 8, label: "ضعيف" },
];

export interface AssetQualityRule {
  min: number;
  max: number | null;
  score: number;
  label: string;
}

export const ASSET_QUALITY_RULES: AssetQualityRule[] = [
  { min: 95, max: null, score: 15, label: "ممتاز" },
  { min: 90, max: 95, score: 14, label: "جيد جداً" },
  { min: 70, max: 90, score: 13, label: "جيد" },
  { min: 50, max: 70, score: 10, label: "مقبول" },
  { min: -Infinity, max: 50, score: 6, label: "ضعيف" },
];

export interface StabilityRule {
  level: "very-stable" | "stable" | "moderate" | "unstable";
  score: number;
  label: string;
  arabicLevel: string;
}

export const STABILITY_RULES: StabilityRule[] = [
  { level: "very-stable", score: 15, label: "ممتاز", arabicLevel: "مستقر جداً" },
  { level: "stable", score: 13, label: "ممتاز", arabicLevel: "مستقر" },
  { level: "moderate", score: 10, label: "جيد", arabicLevel: "متوسط الاستقرار" },
  { level: "unstable", score: 6, label: "ضعيف", arabicLevel: "غير مستقر" },
];

export const TRADING_TYPE_LABELS: Record<string, string> = {
  spot: "Spot",
  futures: "Futures",
  margin: "Margin",
};
