import { AnalyzeEntryCard } from "@/components/dashboard/analyze-entry-card";
import { PortfolioEntryCard } from "@/components/dashboard/portfolio-entry-card";
import { SiteFooter } from "@/components/brand/site-footer";
import { portfolioRepository } from "@/data/portfolio-repository";
import { demoPortfolio } from "@/data/demo-portfolio";

export default async function Home() {
  const portfolio = (await portfolioRepository.getPortfolioBySlug(demoPortfolio.slug)) ?? demoPortfolio;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:py-16">
      <main className="flex flex-1 flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-subtle px-4 py-1.5 text-sm font-semibold text-primary">
            ME Spot Portfolio Score
          </span>
          <h1
            className="font-extrabold text-foreground"
            style={{ fontSize: "clamp(30px, 5vw, 42px)", lineHeight: 1.1 }}
          >
            لوحة تقييم المحافظ
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            تقييم موضوعي وشفاف لمحافظ Spot Copy Trading، يعتمد على المخاطر والأداء واستقرار النتائج.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <PortfolioEntryCard portfolio={portfolio} />
          <AnalyzeEntryCard />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
