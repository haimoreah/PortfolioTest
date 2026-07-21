import type { Portfolio } from "@/types/portfolio";
import type { DrawdownCriterionResult, RiskScoreResult, SharpeCriterionResult } from "@/types/scoring";
import { DRAWDOWN_RULES, MAX_SCORES, SHARPE_RULES, getRating } from "./scoring-rules";

function findSharpeRule(sharpeRatio: number) {
  return (
    SHARPE_RULES.find((rule) => sharpeRatio >= rule.min && (rule.max === null || sharpeRatio < rule.max)) ??
    SHARPE_RULES[SHARPE_RULES.length - 1]
  );
}

function findDrawdownRule(drawdownPercent: number) {
  return (
    DRAWDOWN_RULES.find((rule) => {
      if (drawdownPercent < rule.min) return false;
      if (rule.max === null) return true;
      return rule.maxInclusive ? drawdownPercent <= rule.max : drawdownPercent < rule.max;
    }) ?? DRAWDOWN_RULES[DRAWDOWN_RULES.length - 1]
  );
}

export function calculateSharpeScore(sharpeRatio: number): SharpeCriterionResult {
  const rule = findSharpeRule(sharpeRatio);
  return {
    sharpeRatio,
    score: rule.score,
    maxScore: MAX_SCORES.sharpe,
    rating: getRating((rule.score / MAX_SCORES.sharpe) * 100),
  };
}

export function calculateDrawdownScore(maximumDrawdownPercent: number): DrawdownCriterionResult {
  const rule = findDrawdownRule(maximumDrawdownPercent);
  return {
    maximumDrawdownPercent,
    score: rule.score,
    maxScore: MAX_SCORES.drawdown,
    rating: getRating((rule.score / MAX_SCORES.drawdown) * 100),
  };
}

export function calculateRiskScore(portfolio: Portfolio): RiskScoreResult {
  const sharpe = calculateSharpeScore(portfolio.sharpeRatio);
  const drawdown = calculateDrawdownScore(portfolio.maximumDrawdownPercent);
  const score = sharpe.score + drawdown.score;
  const maxScore = MAX_SCORES.risk;

  return {
    sharpe,
    drawdown,
    score,
    maxScore,
    rating: getRating((score / maxScore) * 100),
  };
}
