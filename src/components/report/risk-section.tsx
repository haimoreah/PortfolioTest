import { ShieldCheck } from "lucide-react";
import { generateRiskSummary } from "@/lib/scoring";
import { formatNumber, formatPercent } from "@/lib/formatters";
import type { RiskScoreResult } from "@/types/scoring";
import { DRAWDOWN_RULES, SHARPE_RULES } from "@/lib/scoring/scoring-rules";
import { RatingBadge } from "./rating-badge";
import { ScoreAccordionSection } from "./score-accordion-section";
import { ScoringCriteriaTable, type ScoringCriteriaRow } from "./scoring-criteria-table";

const sharpeRows: ScoringCriteriaRow[] = [
  { range: "3.00 فأكثر", points: `${SHARPE_RULES[0].score} / 20`, label: SHARPE_RULES[0].label },
  { range: "من 2.00 إلى أقل من 3.00", points: `${SHARPE_RULES[1].score} / 20`, label: SHARPE_RULES[1].label },
  { range: "من 1.00 إلى أقل من 2.00", points: `${SHARPE_RULES[2].score} / 20`, label: SHARPE_RULES[2].label },
  { range: "من 0.50 إلى أقل من 1.00", points: `${SHARPE_RULES[3].score} / 20`, label: SHARPE_RULES[3].label },
  { range: "أقل من 0.50", points: `${SHARPE_RULES[4].score} / 20`, label: SHARPE_RULES[4].label },
];

const drawdownRows: ScoringCriteriaRow[] = [
  { range: "أقل من 2%", points: `${DRAWDOWN_RULES[0].score} / 20`, label: DRAWDOWN_RULES[0].label },
  { range: "من 2% إلى أقل من 5%", points: `${DRAWDOWN_RULES[1].score} / 20`, label: DRAWDOWN_RULES[1].label },
  { range: "من 5% إلى أقل من 10%", points: `${DRAWDOWN_RULES[2].score} / 20`, label: DRAWDOWN_RULES[2].label },
  { range: "من 10% إلى 20% (شاملة)", points: `${DRAWDOWN_RULES[3].score} / 20`, label: DRAWDOWN_RULES[3].label },
  { range: "أكثر من 20%", points: `${DRAWDOWN_RULES[4].score} / 20`, label: DRAWDOWN_RULES[4].label },
];

export function RiskSection({ risk }: { risk: RiskScoreResult }) {
  return (
    <ScoreAccordionSection
      id="risk"
      title="تقييم المخاطر"
      icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
      score={risk.score}
      maxScore={risk.maxScore}
      rating={risk.rating}
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        يقيس هذا القسم مستوى المخاطر التي تتحملها المحفظة أثناء تحقيق الأرباح، بالاعتماد على Sharpe Ratio وMaximum
        Drawdown.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">Sharpe Ratio</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{formatNumber(risk.sharpe.sharpeRatio, 2)}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">نقاط Sharpe</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{risk.sharpe.score} / {risk.sharpe.maxScore}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">Maximum Drawdown</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{formatPercent(risk.drawdown.maximumDrawdownPercent)}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/60 p-3">
          <span className="block text-xs text-muted-foreground">نقاط Drawdown</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">{risk.drawdown.score} / {risk.drawdown.maxScore}</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
        <span className="text-sm font-semibold text-foreground">النتيجة: {risk.score} / {risk.maxScore}</span>
        <RatingBadge rating={risk.rating} />
      </div>

      <ScoringCriteriaTable title="معايير Sharpe Ratio" rows={sharpeRows} />
      <ScoringCriteriaTable title="معايير Maximum Drawdown" rows={drawdownRows} />

      <p className="rounded-xl bg-muted/60 p-4 text-sm leading-relaxed text-foreground">{generateRiskSummary(risk)}</p>
    </ScoreAccordionSection>
  );
}
