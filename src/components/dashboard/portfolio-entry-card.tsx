"use client";

import { ChartNoAxesCombined, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { RatingBadge } from "@/components/report/rating-badge";
import { calculatePortfolioScore } from "@/lib/scoring";
import type { Portfolio } from "@/types/portfolio";

interface PortfolioEntryCardProps {
  portfolio: Portfolio;
}

export function PortfolioEntryCard({ portfolio }: PortfolioEntryCardProps) {
  const router = useRouter();
  const scoreResult = calculatePortfolioScore(portfolio);
  const href = `/portfolio/${portfolio.slug}`;

  function navigate() {
    router.push(href);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate();
    }
  }

  return (
    <Card
      role="link"
      tabIndex={0}
      aria-label={`عرض تقرير ${portfolio.traderName}`}
      onClick={navigate}
      onKeyDown={handleKeyDown}
      className="group flex cursor-pointer flex-col gap-5 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-primary sm:p-8"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <ChartNoAxesCombined className="h-7 w-7" aria-hidden />
        </span>
        <RatingBadge rating={scoreResult.rating} />
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">{portfolio.traderName}</h2>
        <p className="text-sm text-muted-foreground">عرض تقييم محفظة Spot</p>
      </div>

      <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">الدرجة الحالية</span>
          <span className="text-3xl font-extrabold tabular-nums text-foreground">
            {scoreResult.finalScore}
            <span className="text-base font-semibold text-muted-foreground"> / {scoreResult.maxFinalScore}</span>
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors group-hover:bg-primary-hover">
          عرض التقرير
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Card>
  );
}
