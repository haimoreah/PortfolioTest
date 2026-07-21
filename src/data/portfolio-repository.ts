import type { Portfolio, PortfolioBenchmarks } from "@/types/portfolio";
import { demoBenchmarks, demoPortfolio } from "./demo-portfolio";

/**
 * Data-access layer for portfolios. Components should depend only on this
 * module, never on `demo-portfolio.ts` directly, so the in-memory demo data
 * can be replaced later by a database or an external API without touching
 * any UI code.
 */
export interface PortfolioRepository {
  getPortfolioBySlug(slug: string): Promise<Portfolio | null>;
  getBenchmarks(): Promise<PortfolioBenchmarks>;
}

class DemoPortfolioRepository implements PortfolioRepository {
  private readonly portfolios: Portfolio[] = [demoPortfolio];

  async getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
    return this.portfolios.find((portfolio) => portfolio.slug === slug) ?? null;
  }

  async getBenchmarks(): Promise<PortfolioBenchmarks> {
    return demoBenchmarks;
  }
}

export const portfolioRepository: PortfolioRepository = new DemoPortfolioRepository();
