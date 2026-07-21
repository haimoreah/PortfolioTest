import { Coins, History, Layers, Percent, ThumbsDown, ThumbsUp, Trophy } from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { TRADING_TYPE_LABELS } from "@/lib/scoring/scoring-rules";
import type { Portfolio } from "@/types/portfolio";
import { MetricCard } from "./metric-card";
import { ScoreAccordionSection } from "./score-accordion-section";

export function TradingHistorySection({ portfolio }: { portfolio: Portfolio }) {
  return (
    <ScoreAccordionSection id="trading-history" title="سجل التداول" icon={<History className="h-5 w-5" aria-hidden />}>
      <p className="text-sm leading-relaxed text-muted-foreground">
        ملخص سلوك التداول داخل المحفظة، من حيث عدد الصفقات ومعدل النجاح وتوزيع الأصول.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricCard icon={Percent} label="عدد الصفقات" value={formatNumber(portfolio.totalTrades)} />
        <MetricCard icon={Trophy} label="معدل النجاح" value={formatPercent(portfolio.winRatePercent)} />
        <MetricCard icon={ThumbsUp} label="الأيام الرابحة" value={formatNumber(portfolio.winningDays)} />
        <MetricCard icon={ThumbsDown} label="الأيام الخاسرة" value={formatNumber(portfolio.losingDays)} />
        <MetricCard icon={Layers} label="عدد الأصول" value={formatNumber(portfolio.assets.length)} />
        <MetricCard icon={Coins} label="أكبر أصل" value={portfolio.largestAsset} />
      </div>

      <div className="rounded-xl border border-border bg-muted/60 p-4">
        <span className="text-sm text-muted-foreground">نوع التداول: </span>
        <span className="text-sm font-bold text-foreground">
          {TRADING_TYPE_LABELS[portfolio.tradingType] ?? portfolio.tradingType}
        </span>
      </div>
    </ScoreAccordionSection>
  );
}
