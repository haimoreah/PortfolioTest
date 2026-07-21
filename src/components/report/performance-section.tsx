import { TrendingUp } from "lucide-react";
import { generatePerformanceSummary } from "@/lib/scoring";
import { ROI_RULES } from "@/lib/scoring/scoring-rules";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import type { Portfolio } from "@/types/portfolio";
import type { PerformanceScoreResult } from "@/types/scoring";
import { RatingBadge } from "./rating-badge";
import { ScoreAccordionSection } from "./score-accordion-section";
import { ScoringCriteriaTable, type ScoringCriteriaRow } from "./scoring-criteria-table";

const roiRows: ScoringCriteriaRow[] = [
  { range: "8% فأكثر", points: `${ROI_RULES[0].score} / 20`, label: ROI_RULES[0].label },
  { range: "من 5% إلى أقل من 8%", points: `${ROI_RULES[1].score} / 20`, label: ROI_RULES[1].label },
  { range: "من 3% إلى أقل من 5%", points: `${ROI_RULES[2].score} / 20`, label: ROI_RULES[2].label },
  { range: "من 1% إلى أقل من 3%", points: `${ROI_RULES[3].score} / 20`, label: ROI_RULES[3].label },
  { range: "أقل من 1%", points: `${ROI_RULES[4].score} / 20`, label: ROI_RULES[4].label },
];

export function PerformanceSection({
  performance,
  portfolio,
}: {
  performance: PerformanceScoreResult;
  portfolio: Portfolio;
}) {
  return (
    <ScoreAccordionSection
      id="performance"
      title="تقييم الأداء"
      icon={<TrendingUp className="h-5 w-5" aria-hidden />}
      score={performance.score}
      maxScore={performance.maxScore}
      rating={performance.rating}
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        يقيس هذا القسم عائد المحفظة (ROI) خلال فترة التقييم، مع الاستئناس بمعدل النجاح وعدد الأيام الرابحة كبيانات
        داعمة.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">ROI</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{formatPercent(portfolio.roiPercent)}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">صافي الأرباح</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{formatCurrency(portfolio.netProfit)}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">Win Rate</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{formatPercent(portfolio.winRatePercent)}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">الأيام الرابحة</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{formatNumber(portfolio.winningDays)}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">أيام التداول</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{formatNumber(portfolio.tradingDays)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
        <span className="text-sm font-semibold text-foreground">
          النتيجة: {performance.score} / {performance.maxScore}
        </span>
        <RatingBadge rating={performance.rating} />
      </div>

      <ScoringCriteriaTable title="معايير ROI" rows={roiRows} />

      <p className="rounded-xl bg-muted/60 p-4 text-sm leading-relaxed text-foreground">
        {generatePerformanceSummary(performance, portfolio)}
      </p>
    </ScoreAccordionSection>
  );
}
