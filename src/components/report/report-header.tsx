import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters";
import type { Portfolio } from "@/types/portfolio";
import type { PortfolioScoreResult } from "@/types/scoring";
import { generateExecutiveSummary } from "@/lib/scoring";
import { ReportActions } from "./report-actions";
import { ScoreCircle } from "./score-circle";

interface ReportHeaderProps {
  portfolio: Portfolio;
  scoreResult: PortfolioScoreResult;
}

export function ReportHeader({ portfolio, scoreResult }: ReportHeaderProps) {
  const summaryLine = generateExecutiveSummary(portfolio, scoreResult.finalScore);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-card">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_55%)]"
      />

      <div className="relative flex flex-col gap-6 p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="print-hidden inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
            العودة للوحة المستخدم
          </Link>
          <ReportActions />
        </div>

        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-start">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge tone="primary">Spot فقط</Badge>
              <span className="text-xs text-muted-foreground">
                آخر تحديث: {formatDate(portfolio.updatedAt)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-muted-foreground">{portfolio.traderName}</span>
              <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{portfolio.reportName}</h1>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">{summaryLine}</p>
          </div>

          <ScoreCircle score={scoreResult.finalScore} maxScore={scoreResult.maxFinalScore} rating={scoreResult.rating} />
        </div>
      </div>
    </div>
  );
}
