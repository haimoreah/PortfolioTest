import type { AssetQuality, StabilityLevel, TradingType } from "./portfolio";

export interface ExtractedAsset {
  symbol: string;
  allocation?: number;
  quality?: AssetQuality;
}

/**
 * Everything the vision model might be able to read off a portfolio
 * screenshot. Every field is optional — the model omits whatever it
 * cannot determine, and the review form asks the user to fill the rest
 * before the data is validated against `portfolioSchema` and scored.
 */
export interface ExtractedPortfolioData {
  traderName?: string;
  tradingType?: TradingType;
  aum?: number;
  traderCapital?: number;
  copiersCount?: number;
  profitSharingPercent?: number;
  tradingDays?: number;
  netProfit?: number;
  roiPercent?: number;
  sharpeRatio?: number;
  maximumDrawdownPercent?: number;
  totalTrades?: number;
  winRatePercent?: number;
  winningDays?: number;
  losingDays?: number;
  assetQualityPercent?: number;
  stabilityLevel?: StabilityLevel;
  largestAsset?: string;
  assets?: ExtractedAsset[];
}

export interface AnalyzePortfolioResponse {
  data: ExtractedPortfolioData;
  /** Field keys the model looked for but could not find in the screenshots. */
  missingFields: string[];
  /** Free-text notes from the model about ambiguity or low-confidence reads. */
  notes?: string;
}
