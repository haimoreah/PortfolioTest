import { PortfolioEntryCard } from "@/components/dashboard/portfolio-entry-card";
import { portfolioRepository } from "@/data/portfolio-repository";
import { demoPortfolio } from "@/data/demo-portfolio";

export default async function Home() {
  const portfolio = (await portfolioRepository.getPortfolioBySlug(demoPortfolio.slug)) ?? demoPortfolio;

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-16">
      <main className="flex w-full max-w-2xl flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground">
            ME
          </span>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">لوحة تقييم المحافظ</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            تقييم موضوعي وشفاف لمحافظ Spot Copy Trading، يعتمد على المخاطر والأداء واستقرار النتائج.
          </p>
        </div>

        <div className="w-full">
          <PortfolioEntryCard portfolio={portfolio} />
        </div>
      </main>
    </div>
  );
}
