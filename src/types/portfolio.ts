export type TradingType = "spot" | "futures" | "margin";

export type StabilityLevel = "very-stable" | "stable" | "moderate" | "unstable";

export type AssetQuality = "high" | "medium" | "speculative";

export interface PortfolioAsset {
  symbol: string;
  allocation?: number;
  quality: AssetQuality;
}

export interface Portfolio {
  id: string;
  slug: string;
  traderName: string;
  reportName: string;
  tradingType: TradingType;

  aum: number;
  traderCapital: number;
  copiersCount: number;
  profitSharingPercent: number;

  tradingDays: number;
  netProfit: number;
  roiPercent: number;
  sharpeRatio: number;
  maximumDrawdownPercent: number;

  totalTrades: number;
  winRatePercent: number;
  winningDays: number;
  losingDays: number;

  assets: PortfolioAsset[];
  assetQualityPercent: number;
  stabilityLevel: StabilityLevel;
  largestAsset: string;

  createdAt: string;
  updatedAt: string;
}

export interface PortfolioBenchmarks {
  sharpeRatio: number;
  maximumDrawdownPercent: number;
  roiPercent: number;
  winRatePercent: number;
  assetQualityPercent: number;
}
