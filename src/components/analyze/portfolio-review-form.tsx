"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { validatePortfolio } from "@/lib/validation/portfolio-schema";
import type { AssetQuality, Portfolio, PortfolioAsset, StabilityLevel, TradingType } from "@/types/portfolio";
import type { ExtractedPortfolioData } from "@/types/analyze";
import { NumberField, SelectField, TextField } from "./form-fields";

const TRADING_TYPE_OPTIONS: { value: TradingType; label: string }[] = [
  { value: "spot", label: "Spot" },
  { value: "futures", label: "Futures" },
  { value: "margin", label: "Margin" },
];

const STABILITY_OPTIONS: { value: StabilityLevel; label: string }[] = [
  { value: "very-stable", label: "مستقر جداً" },
  { value: "stable", label: "مستقر" },
  { value: "moderate", label: "متوسط الاستقرار" },
  { value: "unstable", label: "غير مستقر" },
];

const ASSET_QUALITY_OPTIONS: { value: AssetQuality; label: string }[] = [
  { value: "high", label: "جودة عالية" },
  { value: "medium", label: "جودة متوسطة" },
  { value: "speculative", label: "مضاربي" },
];

interface FormState {
  traderName: string;
  tradingType: TradingType | undefined;
  aum: number | undefined;
  traderCapital: number | undefined;
  copiersCount: number | undefined;
  profitSharingPercent: number | undefined;
  tradingDays: number | undefined;
  netProfit: number | undefined;
  roiPercent: number | undefined;
  sharpeRatio: number | undefined;
  maximumDrawdownPercent: number | undefined;
  totalTrades: number | undefined;
  winRatePercent: number | undefined;
  winningDays: number | undefined;
  losingDays: number | undefined;
  assetQualityPercent: number | undefined;
  stabilityLevel: StabilityLevel | undefined;
  largestAsset: string;
  assets: PortfolioAsset[];
}

function buildInitialState(extracted: ExtractedPortfolioData): FormState {
  return {
    traderName: extracted.traderName ?? "محفظتي",
    tradingType: extracted.tradingType,
    aum: extracted.aum,
    traderCapital: extracted.traderCapital,
    copiersCount: extracted.copiersCount,
    profitSharingPercent: extracted.profitSharingPercent,
    tradingDays: extracted.tradingDays,
    netProfit: extracted.netProfit,
    roiPercent: extracted.roiPercent,
    sharpeRatio: extracted.sharpeRatio,
    maximumDrawdownPercent: extracted.maximumDrawdownPercent,
    totalTrades: extracted.totalTrades,
    winRatePercent: extracted.winRatePercent,
    winningDays: extracted.winningDays,
    losingDays: extracted.losingDays,
    assetQualityPercent: extracted.assetQualityPercent,
    stabilityLevel: extracted.stabilityLevel,
    largestAsset: extracted.largestAsset ?? "",
    assets: (extracted.assets ?? []).map((asset) => ({
      symbol: asset.symbol,
      allocation: asset.allocation,
      quality: asset.quality ?? "medium",
    })),
  };
}

interface PortfolioReviewFormProps {
  extracted: ExtractedPortfolioData;
  missingFields: string[];
  notes?: string;
  onConfirm: (portfolio: Portfolio) => void;
  onBack: () => void;
}

export function PortfolioReviewForm({ extracted, missingFields, notes, onConfirm, onBack }: PortfolioReviewFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(extracted));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const missing = useMemo(() => new Set(missingFields), [missingFields]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addAsset() {
    setForm((current) => ({
      ...current,
      assets: [...current.assets, { symbol: "", quality: "medium" }],
    }));
  }

  function updateAsset(index: number, patch: Partial<PortfolioAsset>) {
    setForm((current) => ({
      ...current,
      assets: current.assets.map((asset, i) => (i === index ? { ...asset, ...patch } : asset)),
    }));
  }

  function removeAsset(index: number) {
    setForm((current) => ({ ...current, assets: current.assets.filter((_, i) => i !== index) }));
  }

  function handleSubmit() {
    const now = new Date().toISOString();
    const candidate: Portfolio = {
      id: "custom-analysis",
      slug: "custom-analysis",
      traderName: form.traderName.trim() || "محفظتي",
      reportName: "ME Spot Portfolio Score",
      tradingType: form.tradingType ?? "spot",
      aum: form.aum ?? 0,
      traderCapital: form.traderCapital ?? 0,
      copiersCount: form.copiersCount ?? 0,
      profitSharingPercent: form.profitSharingPercent ?? 0,
      tradingDays: form.tradingDays ?? 0,
      netProfit: form.netProfit ?? 0,
      roiPercent: form.roiPercent ?? 0,
      sharpeRatio: form.sharpeRatio ?? 0,
      maximumDrawdownPercent: form.maximumDrawdownPercent ?? 0,
      totalTrades: form.totalTrades ?? 0,
      winRatePercent: form.winRatePercent ?? 0,
      winningDays: form.winningDays ?? 0,
      losingDays: form.losingDays ?? 0,
      assets: form.assets,
      assetQualityPercent: form.assetQualityPercent ?? 0,
      stabilityLevel: form.stabilityLevel ?? "moderate",
      largestAsset: form.largestAsset.trim() || form.assets[0]?.symbol || "—",
      createdAt: now,
      updatedAt: now,
    };

    const result = validatePortfolio(candidate);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onConfirm(candidate);
  }

  return (
    <div className="flex flex-col gap-5">
      {notes ? (
        <Card className="p-4 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">ملاحظة من التحليل: </span>
          {notes}
        </Card>
      ) : null}

      <Card className="flex flex-col gap-4 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-foreground">معلومات أساسية</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField id="traderName" label="اسم المحفظة" value={form.traderName} onChange={(v) => update("traderName", v)} />
          <SelectField
            id="tradingType"
            label="نوع التداول"
            value={form.tradingType}
            onChange={(v) => update("tradingType", v)}
            options={TRADING_TYPE_OPTIONS}
            missing={missing.has("tradingType")}
            error={errors.tradingType}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-foreground">حجم المحفظة</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField id="aum" label="AUM" suffix="USDT" value={form.aum} onChange={(v) => update("aum", v)} missing={missing.has("aum")} error={errors.aum} />
          <NumberField
            id="traderCapital"
            label="رأس مال المتداول"
            suffix="USDT"
            value={form.traderCapital}
            onChange={(v) => update("traderCapital", v)}
            missing={missing.has("traderCapital")}
            error={errors.traderCapital}
          />
          <NumberField
            id="copiersCount"
            label="عدد الناسخين"
            value={form.copiersCount}
            onChange={(v) => update("copiersCount", v)}
            missing={missing.has("copiersCount")}
            error={errors.copiersCount}
          />
          <NumberField
            id="profitSharingPercent"
            label="Profit Sharing"
            suffix="%"
            min={0}
            max={100}
            value={form.profitSharingPercent}
            onChange={(v) => update("profitSharingPercent", v)}
            missing={missing.has("profitSharingPercent")}
            error={errors.profitSharingPercent}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-foreground">الأداء والمخاطر</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField id="roiPercent" label="ROI" suffix="%" value={form.roiPercent} onChange={(v) => update("roiPercent", v)} missing={missing.has("roiPercent")} error={errors.roiPercent} />
          <NumberField
            id="netProfit"
            label="صافي الأرباح"
            suffix="USDT"
            value={form.netProfit}
            onChange={(v) => update("netProfit", v)}
            missing={missing.has("netProfit")}
            error={errors.netProfit}
          />
          <NumberField
            id="sharpeRatio"
            label="Sharpe Ratio"
            value={form.sharpeRatio}
            onChange={(v) => update("sharpeRatio", v)}
            missing={missing.has("sharpeRatio")}
            error={errors.sharpeRatio}
          />
          <NumberField
            id="maximumDrawdownPercent"
            label="Maximum Drawdown"
            suffix="%"
            min={0}
            value={form.maximumDrawdownPercent}
            onChange={(v) => update("maximumDrawdownPercent", v)}
            missing={missing.has("maximumDrawdownPercent")}
            error={errors.maximumDrawdownPercent}
          />
          <NumberField
            id="tradingDays"
            label="أيام التداول"
            min={0}
            value={form.tradingDays}
            onChange={(v) => update("tradingDays", v)}
            missing={missing.has("tradingDays")}
            error={errors.tradingDays}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-foreground">سجل التداول والاستقرار</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField
            id="totalTrades"
            label="عدد الصفقات"
            min={0}
            value={form.totalTrades}
            onChange={(v) => update("totalTrades", v)}
            missing={missing.has("totalTrades")}
            error={errors.totalTrades}
          />
          <NumberField
            id="winRatePercent"
            label="معدل النجاح"
            suffix="%"
            min={0}
            max={100}
            value={form.winRatePercent}
            onChange={(v) => update("winRatePercent", v)}
            missing={missing.has("winRatePercent")}
            error={errors.winRatePercent}
          />
          <NumberField
            id="winningDays"
            label="الأيام الرابحة"
            min={0}
            value={form.winningDays}
            onChange={(v) => update("winningDays", v)}
            missing={missing.has("winningDays")}
            error={errors.winningDays}
          />
          <NumberField
            id="losingDays"
            label="الأيام الخاسرة"
            min={0}
            value={form.losingDays}
            onChange={(v) => update("losingDays", v)}
            missing={missing.has("losingDays")}
            error={errors.losingDays}
          />
          <SelectField
            id="stabilityLevel"
            label="مستوى الاستقرار"
            value={form.stabilityLevel}
            onChange={(v) => update("stabilityLevel", v)}
            options={STABILITY_OPTIONS}
            missing={missing.has("stabilityLevel")}
            error={errors.stabilityLevel}
          />
          <NumberField
            id="assetQualityPercent"
            label="نسبة جودة الأصول"
            suffix="%"
            min={0}
            max={100}
            value={form.assetQualityPercent}
            onChange={(v) => update("assetQualityPercent", v)}
            missing={missing.has("assetQualityPercent")}
            error={errors.assetQualityPercent}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">الأصول</h3>
          <Button type="button" variant="outline" size="sm" onClick={addAsset}>
            <Plus className="h-4 w-4" aria-hidden />
            إضافة أصل
          </Button>
        </div>

        <TextField
          id="largestAsset"
          label="أكبر أصل"
          value={form.largestAsset}
          onChange={(v) => update("largestAsset", v)}
          missing={missing.has("largestAsset")}
          error={errors.largestAsset}
        />

        {form.assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد أصول مضافة بعد.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {form.assets.map((asset, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2 rounded-[var(--radius-input)] border border-border p-3">
                <TextField id={`asset-symbol-${index}`} label="الرمز" value={asset.symbol} onChange={(v) => updateAsset(index, { symbol: v.toUpperCase() })} />
                <NumberField
                  id={`asset-allocation-${index}`}
                  label="النسبة"
                  suffix="%"
                  min={0}
                  max={100}
                  value={asset.allocation}
                  onChange={(v) => updateAsset(index, { allocation: v })}
                />
                <SelectField
                  id={`asset-quality-${index}`}
                  label="الجودة"
                  value={asset.quality}
                  onChange={(v) => updateAsset(index, { quality: v })}
                  options={ASSET_QUALITY_OPTIONS}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeAsset(index)} aria-label="حذف الأصل">
                  <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          رجوع
        </Button>
        <Button type="button" onClick={handleSubmit}>
          احسب النتيجة
        </Button>
      </div>
    </div>
  );
}
