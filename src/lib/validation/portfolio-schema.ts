import { z } from "zod";

const finiteNumber = z.number().finite();

const nonNegativeFiniteNumber = finiteNumber.min(0);

const percent0to100 = finiteNumber.min(0).max(100);

export const portfolioAssetSchema = z.object({
  symbol: z.string().min(1),
  allocation: finiteNumber.min(0).max(100).optional(),
  quality: z.enum(["high", "medium", "speculative"]),
});

export const portfolioSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  traderName: z.string().min(1),
  reportName: z.string().min(1),
  tradingType: z.enum(["spot", "futures", "margin"]),

  aum: nonNegativeFiniteNumber,
  traderCapital: nonNegativeFiniteNumber,
  copiersCount: nonNegativeFiniteNumber,
  profitSharingPercent: percent0to100,

  tradingDays: nonNegativeFiniteNumber,
  netProfit: finiteNumber,
  roiPercent: finiteNumber,
  sharpeRatio: finiteNumber,
  maximumDrawdownPercent: nonNegativeFiniteNumber,

  totalTrades: nonNegativeFiniteNumber,
  winRatePercent: percent0to100,
  winningDays: nonNegativeFiniteNumber,
  losingDays: nonNegativeFiniteNumber,

  assets: z.array(portfolioAssetSchema),
  assetQualityPercent: percent0to100,
  stabilityLevel: z.enum(["very-stable", "stable", "moderate", "unstable"]),
  largestAsset: z.string().min(1),

  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const portfolioBenchmarksSchema = z.object({
  sharpeRatio: finiteNumber,
  maximumDrawdownPercent: nonNegativeFiniteNumber,
  roiPercent: finiteNumber,
  winRatePercent: percent0to100,
  assetQualityPercent: percent0to100,
});

export function validatePortfolio(data: unknown) {
  return portfolioSchema.safeParse(data);
}

export function validatePortfolioBenchmarks(data: unknown) {
  return portfolioBenchmarksSchema.safeParse(data);
}
