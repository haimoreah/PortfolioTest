"use client";

import { ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ScreenshotUploader, type UploadedImage } from "@/components/analyze/screenshot-uploader";
import { Button } from "@/components/ui/button";
import { ReportView } from "@/components/report/report-view";
import { demoBenchmarks } from "@/data/demo-portfolio";
import type { AnalyzePortfolioResponse, ExtractedPortfolioData } from "@/types/analyze";
import type { Portfolio } from "@/types/portfolio";

type Step = { name: "upload" } | { name: "report"; portfolio: Portfolio };

// Tier classification for asset quality calculation
const TIER1 = new Set(["BTC", "ETH"]);
const TIER2 = new Set(["SOL", "BNB", "XRP", "ADA", "DOT", "AVAX", "MATIC", "LINK", "UNI", "LTC",
  "ATOM", "XLM", "TRX", "TON", "NEAR", "ICP", "FIL", "VET", "ALGO", "USDT", "USDC", "BUSD"]);

function calcAssetQualityFromList(assets: Array<{ symbol: string; allocation?: number }>): number {
  if (!assets.length) return 50;
  let weightedSum = 0;
  let totalAlloc = 0;
  for (const a of assets) {
    const alloc = a.allocation ?? (100 / assets.length);
    const sym = a.symbol.toUpperCase().replace(/USDT$|BUSD$/, "");
    const quality = TIER1.has(sym) ? 100 : TIER2.has(sym) ? 75 : 45;
    weightedSum += quality * alloc;
    totalAlloc += alloc;
  }
  return totalAlloc > 0 ? Math.round(weightedSum / totalAlloc) : 50;
}

function extractionToPortfolio(data: ExtractedPortfolioData): Portfolio {
  const now = new Date().toISOString();
  const assets = (data.assets ?? []).map((a) => ({ symbol: a.symbol, allocation: a.allocation, quality: "medium" as const }));
  // Use explicit metric if provided, otherwise calculate from asset list
  const assetQualityPercent = data.assetQualityPercent != null
    ? data.assetQualityPercent
    : calcAssetQualityFromList(assets);
  return {
    id: "custom-analysis",
    slug: "custom-analysis",
    traderName: data.traderName?.trim() || "محفظتي",
    reportName: "ME Spot Portfolio Score",
    tradingType: data.tradingType ?? "spot",
    aum: data.aum ?? 0,
    traderCapital: data.traderCapital ?? 0,
    copiersCount: data.copiersCount ?? 0,
    profitSharingPercent: data.profitSharingPercent ?? 0,
    tradingDays: data.tradingDays ?? 0,
    netProfit: data.netProfit ?? 0,
    roiPercent: data.roiPercent ?? 0,
    sharpeRatio: data.sharpeRatio ?? 0,
    maximumDrawdownPercent: data.maximumDrawdownPercent ?? 0,
    totalTrades: data.totalTrades ?? 0,
    winRatePercent: data.winRatePercent ?? 0,
    winningDays: data.winningDays ?? 0,
    losingDays: data.losingDays ?? 0,
    assets,
    assetQualityPercent,
    stabilityLevel: data.stabilityLevel ?? "moderate",
    largestAsset: data.largestAsset?.trim() || data.assets?.[0]?.symbol || "—",
    createdAt: now,
    updatedAt: now,
  };
}

export default function AnalyzePortfolioPage() {
  const [step, setStep] = useState<Step>({ name: "upload" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  async function handleAnalyze(images: UploadedImage[]) {
    setIsAnalyzing(true);
    setErrorMessage(undefined);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/analyze-portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: images.map((image) => image.dataUrl) }),
      });

      const payload = await response.json() as AnalyzePortfolioResponse;

      if (!response.ok) {
        setErrorMessage((payload as { error?: string }).error ?? "تعذّر تحليل الصور. حاول مرة أخرى.");
        return;
      }

      setStep({ name: "report", portfolio: extractionToPortfolio(payload.data) });
    } catch {
      setErrorMessage("تعذّر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (step.name === "report") {
    return (
      <>
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-6 sm:px-6">
          <Button variant="outline" size="sm" onClick={() => setStep({ name: "upload" })}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            تحليل محفظة أخرى
          </Button>
        </div>
        <ReportView portfolio={step.portfolio} benchmarks={demoBenchmarks} />
      </>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 sm:py-16">
      <Link href="/" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowRight className="h-4 w-4" aria-hidden />
        العودة للرئيسية
      </Link>

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">قيّم محفظتك</h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          ارفع سكرين شوت لمحفظتك، واحصل على تقرير ME Spot Portfolio Score الكامل فوراً.
        </p>
      </div>

      <ScreenshotUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} errorMessage={errorMessage} />
    </div>
  );
}
