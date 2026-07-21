import type { Portfolio, PortfolioBenchmarks } from "@/types/portfolio";

const FIXED_TIMESTAMP = "2026-07-15T09:00:00.000Z";

export const demoPortfolio: Portfolio = {
  id: "amwal-w-enta-qaed",
  slug: "amwal-w-enta-qaed",
  traderName: "أموال وإنت قاعد",
  reportName: "ME Spot Portfolio Score",
  tradingType: "spot",

  aum: 12858,
  traderCapital: 1009,
  copiersCount: 6,
  profitSharingPercent: 30,

  tradingDays: 47,
  netProfit: 47.75,
  roiPercent: 4.77,
  sharpeRatio: 5.49,
  maximumDrawdownPercent: 1.03,

  totalTrades: 47,
  winRatePercent: 100,
  winningDays: 47,
  losingDays: 0,

  assets: [
    { symbol: "BTC", allocation: 32, quality: "high" },
    { symbol: "ETH", allocation: 18, quality: "high" },
    { symbol: "ADA", allocation: 10, quality: "medium" },
    { symbol: "DOT", allocation: 9, quality: "medium" },
    { symbol: "HBAR", allocation: 8, quality: "medium" },
    { symbol: "XLM", allocation: 7, quality: "medium" },
    { symbol: "APT", allocation: 6, quality: "medium" },
    { symbol: "TAO", allocation: 6, quality: "speculative" },
    { symbol: "RENDER", allocation: 4, quality: "speculative" },
  ],
  assetQualityPercent: 92,
  stabilityLevel: "stable",
  largestAsset: "BTC",

  createdAt: FIXED_TIMESTAMP,
  updatedAt: FIXED_TIMESTAMP,
};

export const demoBenchmarks: PortfolioBenchmarks = {
  sharpeRatio: 1.8,
  maximumDrawdownPercent: 8.4,
  roiPercent: 2.9,
  winRatePercent: 67,
  assetQualityPercent: 70,
};
