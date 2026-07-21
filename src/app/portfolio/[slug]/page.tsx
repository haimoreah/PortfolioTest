import { AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";
import { ReportView } from "@/components/report/report-view";
import { portfolioRepository } from "@/data/portfolio-repository";
import { validatePortfolio } from "@/lib/validation/portfolio-schema";

interface ReportPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PortfolioReportPage({ params }: ReportPageProps) {
  const { slug } = await params;
  const portfolio = await portfolioRepository.getPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  const validation = validatePortfolio(portfolio);
  if (!validation.success) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="text-xl font-bold text-foreground">لا توجد بيانات كافية لإنشاء التقييم</h1>
        <p className="text-sm text-muted-foreground">
          تحقق من بيانات هذه المحفظة وحاول مرة أخرى، أو تواصل مع فريق الدعم إذا استمرت المشكلة.
        </p>
      </div>
    );
  }

  const benchmarks = await portfolioRepository.getBenchmarks();

  return <ReportView portfolio={portfolio} benchmarks={benchmarks} />;
}
