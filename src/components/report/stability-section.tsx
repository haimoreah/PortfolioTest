import { Activity } from "lucide-react";
import { generateStabilitySummary } from "@/lib/scoring";
import { STABILITY_RULES } from "@/lib/scoring/scoring-rules";
import { formatNumber, formatPercent } from "@/lib/formatters";
import type { Portfolio } from "@/types/portfolio";
import type { StabilityScoreResult } from "@/types/scoring";
import { RatingBadge } from "./rating-badge";
import { ScoreAccordionSection } from "./score-accordion-section";
import { ScoringCriteriaTable, type ScoringCriteriaRow } from "./scoring-criteria-table";

const stabilityRows: ScoringCriteriaRow[] = STABILITY_RULES.map((rule) => ({
  range: rule.arabicLevel,
  points: `${rule.score} / 15`,
  label: rule.label,
}));

export function StabilitySection({
  stability,
  portfolio,
}: {
  stability: StabilityScoreResult;
  portfolio: Portfolio;
}) {
  return (
    <ScoreAccordionSection
      id="stability"
      title="استقرار الأداء"
      icon={<Activity className="h-5 w-5" aria-hidden />}
      score={stability.score}
      maxScore={stability.maxScore}
      rating={stability.rating}
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        يقيس هذا القسم مدى اتساق أداء المحفظة عبر الأيام، اعتماداً على نسبة الأيام الرابحة ومستوى الاستقرار العام.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">الأيام الرابحة</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{formatNumber(portfolio.winningDays)}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">الأيام الخاسرة</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{formatNumber(portfolio.losingDays)}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">نسبة الأيام الرابحة</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{formatPercent(stability.winningDaysRatioPercent)}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">مستوى الاستقرار</span>
          <span className="text-lg font-extrabold text-foreground">{stability.stabilityLevel}</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
        <span className="text-sm font-semibold text-foreground">
          النتيجة: {stability.score} / {stability.maxScore}
        </span>
        <RatingBadge rating={stability.rating} />
      </div>

      <ScoringCriteriaTable title="معايير استقرار الأداء" rows={stabilityRows} />

      <p className="rounded-xl bg-muted/60 p-4 text-sm leading-relaxed text-foreground">
        {generateStabilitySummary(stability, portfolio)}
      </p>
    </ScoreAccordionSection>
  );
}
