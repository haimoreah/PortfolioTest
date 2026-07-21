import { Layers } from "lucide-react";
import { generateAssetQualitySummary } from "@/lib/scoring";
import { ASSET_QUALITY_RULES } from "@/lib/scoring/scoring-rules";
import { formatPercent } from "@/lib/formatters";
import type { AssetQuality, Portfolio } from "@/types/portfolio";
import type { AssetQualityScoreResult } from "@/types/scoring";
import { Badge } from "@/components/ui/badge";
import { RatingBadge } from "./rating-badge";
import { ScoreAccordionSection } from "./score-accordion-section";
import { ScoringCriteriaTable, type ScoringCriteriaRow } from "./scoring-criteria-table";

const assetQualityRows: ScoringCriteriaRow[] = [
  { range: "95% فأكثر", points: `${ASSET_QUALITY_RULES[0].score} / 15`, label: ASSET_QUALITY_RULES[0].label },
  { range: "من 90% إلى أقل من 95%", points: `${ASSET_QUALITY_RULES[1].score} / 15`, label: ASSET_QUALITY_RULES[1].label },
  { range: "من 70% إلى أقل من 90%", points: `${ASSET_QUALITY_RULES[2].score} / 15`, label: ASSET_QUALITY_RULES[2].label },
  { range: "من 50% إلى أقل من 70%", points: `${ASSET_QUALITY_RULES[3].score} / 15`, label: ASSET_QUALITY_RULES[3].label },
  { range: "أقل من 50%", points: `${ASSET_QUALITY_RULES[4].score} / 15`, label: ASSET_QUALITY_RULES[4].label },
];

const QUALITY_TONE: Record<AssetQuality, "success" | "primary" | "destructive"> = {
  high: "success",
  medium: "primary",
  speculative: "destructive",
};

const QUALITY_LABEL: Record<AssetQuality, string> = {
  high: "جودة عالية",
  medium: "جودة متوسطة",
  speculative: "مضاربي",
};

export function AssetQualitySection({
  assetQuality,
  portfolio,
}: {
  assetQuality: AssetQualityScoreResult;
  portfolio: Portfolio;
}) {
  return (
    <ScoreAccordionSection
      id="asset-quality"
      title="جودة الأصول"
      icon={<Layers className="h-5 w-5" aria-hidden />}
      score={assetQuality.score}
      maxScore={assetQuality.maxScore}
      rating={assetQuality.rating}
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        يقيس هذا القسم مدى تركّز المحفظة في أصول رقمية ذات جودة عالية مقابل الأصول الأكثر مضاربة.
      </p>

      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/60 p-4">
        <span className="text-sm font-semibold text-foreground">نسبة جودة الأصول</span>
        <span className="text-lg font-extrabold tabular-nums text-foreground">{formatPercent(assetQuality.assetQualityPercent)}</span>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
        <span className="text-sm font-semibold text-foreground">
          النتيجة: {assetQuality.score} / {assetQuality.maxScore}
        </span>
        <RatingBadge rating={assetQuality.rating} />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-bold text-foreground">الأصول في المحفظة</h4>
        <div className="flex flex-wrap gap-2">
          {portfolio.assets.map((asset) => (
            <Badge key={asset.symbol} tone={QUALITY_TONE[asset.quality]} title={QUALITY_LABEL[asset.quality]}>
              {asset.symbol}
              {asset.allocation !== undefined ? ` · ${formatPercent(asset.allocation, 0)}` : ""}
            </Badge>
          ))}
        </div>
      </div>

      <ScoringCriteriaTable title="معايير جودة الأصول" rows={assetQualityRows} />

      <p className="rounded-xl bg-muted/60 p-4 text-sm leading-relaxed text-foreground">
        {generateAssetQualitySummary(assetQuality, portfolio)}
      </p>
    </ScoreAccordionSection>
  );
}
