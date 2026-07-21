import { ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { PortfolioScoreResult } from "@/types/scoring";
import { RatingBadge } from "./rating-badge";
import { ScoreProgress } from "./score-progress";

export function ExecutiveSummary({ scoreResult }: { scoreResult: PortfolioScoreResult }) {
  const rows = [
    { label: "تقييم المخاطر", ...scoreResult.risk },
    { label: "تقييم الأداء", ...scoreResult.performance },
    { label: "جودة الأصول", ...scoreResult.assetQuality },
    { label: "استقرار الأداء", ...scoreResult.stability },
    { label: "نوع التداول", ...scoreResult.tradingType },
  ];

  return (
    <Card className="print-no-shadow">
      <div className="flex items-center gap-3 p-5 sm:p-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ClipboardList className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="text-lg font-bold text-card-foreground">الملخص التنفيذي</h3>
      </div>
      <CardContent className="flex flex-col divide-y divide-border">
        {rows.map((row) => (
          <ScoreProgress key={row.label} label={row.label} score={row.score} maxScore={row.maxScore} rating={row.rating} />
        ))}

        <div className="flex flex-col gap-3 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-base font-extrabold text-foreground">النتيجة النهائية</span>
            <div className="flex items-center gap-2">
              <RatingBadge rating={scoreResult.rating} />
              <span className="text-lg font-extrabold tabular-nums text-foreground">
                {scoreResult.finalScore} / {scoreResult.maxFinalScore}
              </span>
            </div>
          </div>
          <ProgressBar
            value={scoreResult.finalScore}
            max={scoreResult.maxFinalScore}
            className="h-3"
            aria-label={`النتيجة النهائية: ${scoreResult.finalScore} من ${scoreResult.maxFinalScore}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
