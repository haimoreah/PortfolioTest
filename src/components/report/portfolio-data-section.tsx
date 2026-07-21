import { CalendarDays, Coins, Gauge, Percent, ShieldAlert, TrendingUp, Users, Wallet } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import type { Portfolio } from "@/types/portfolio";
import { MetricCard } from "./metric-card";
import { ScoreAccordionSection } from "./score-accordion-section";

export function PortfolioDataSection({ portfolio }: { portfolio: Portfolio }) {
  return (
    <ScoreAccordionSection id="portfolio-data" title="بيانات المحفظة" icon={<Wallet className="h-5 w-5" aria-hidden />}>
      <p className="text-sm leading-relaxed text-muted-foreground">
        نظرة شاملة على بيانات المحفظة الأساسية، بما في ذلك حجم الأصول المدارة ومؤشرات الأداء والمخاطر.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricCard icon={Coins} label="AUM" value={formatCurrency(portfolio.aum)} />
        <MetricCard icon={Wallet} label="رأس مال المتداول" value={formatCurrency(portfolio.traderCapital)} />
        <MetricCard icon={Users} label="عدد الناسخين" value={formatNumber(portfolio.copiersCount)} />
        <MetricCard icon={TrendingUp} label="صافي الأرباح" value={formatCurrency(portfolio.netProfit)} />
        <MetricCard icon={Gauge} label="ROI" value={formatPercent(portfolio.roiPercent)} />
        <MetricCard icon={ShieldAlert} label="Sharpe Ratio" value={formatNumber(portfolio.sharpeRatio, 2)} />
        <MetricCard icon={ShieldAlert} label="Maximum Drawdown" value={formatPercent(portfolio.maximumDrawdownPercent)} />
        <MetricCard icon={Percent} label="Profit Sharing" value={formatPercent(portfolio.profitSharingPercent)} />
        <MetricCard icon={CalendarDays} label="أيام التداول" value={formatNumber(portfolio.tradingDays)} />
      </div>
    </ScoreAccordionSection>
  );
}
