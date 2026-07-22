import Anthropic from "@anthropic-ai/sdk";
import type { AnalyzePortfolioResponse, ExtractedPortfolioData } from "@/types/analyze";

const MODEL = "claude-sonnet-5";

const EXTRACTION_TOOL_NAME = "extract_portfolio_data";

const EXTRACTION_TOOL = {
  name: EXTRACTION_TOOL_NAME,
  description:
    "Records whatever Spot copy-trading portfolio metrics can be read off the provided screenshots. Omit any field that is not visible or cannot be confidently determined instead of guessing.",
  input_schema: {
    type: "object" as const,
    properties: {
      traderName: { type: "string", description: "The trader/strategy display name shown in the screenshot, if visible." },
      tradingType: { type: "string", enum: ["spot", "futures", "margin"], description: "The account/strategy trading type." },
      aum: { type: "number", description: "Assets under management, in USDT." },
      traderCapital: { type: "number", description: "The trader's own capital in the strategy, in USDT." },
      copiersCount: { type: "number", description: "Number of copiers/followers." },
      profitSharingPercent: { type: "number", description: "Profit sharing percentage (0-100)." },
      tradingDays: { type: "number", description: "Total number of trading days shown." },
      netProfit: { type: "number", description: "Net profit in USDT." },
      roiPercent: { type: "number", description: "Return on investment percentage." },
      sharpeRatio: { type: "number", description: "Sharpe ratio." },
      maximumDrawdownPercent: { type: "number", description: "Maximum drawdown percentage (positive number)." },
      totalTrades: { type: "number", description: "Total number of trades executed." },
      winRatePercent: { type: "number", description: "Win rate percentage (0-100)." },
      winningDays: { type: "number", description: "Number of winning days." },
      losingDays: { type: "number", description: "Number of losing days." },
      assetQualityPercent: {
        type: "number",
        description: "Only include if the screenshot explicitly shows an asset-quality metric; do not estimate this yourself.",
      },
      stabilityLevel: {
        type: "string",
        enum: ["very-stable", "stable", "moderate", "unstable"],
        description: "Only include if the screenshot explicitly shows a stability rating; do not estimate this yourself.",
      },
      largestAsset: { type: "string", description: "Symbol of the largest asset holding, e.g. BTC." },
      assets: {
        type: "array",
        description: "List of held assets visible in the screenshot.",
        items: {
          type: "object",
          properties: {
            symbol: { type: "string" },
            allocation: { type: "number", description: "Allocation percentage of this asset, if shown." },
          },
          required: ["symbol"],
        },
      },
      missingFields: {
        type: "array",
        items: { type: "string" },
        description: "Field names from this schema that you looked for but could not find in the screenshots.",
      },
      notes: {
        type: "string",
        description: "Any ambiguity, low-confidence reads, or context useful for a human reviewing this extraction.",
      },
    },
    required: ["missingFields"],
  },
};

export interface ExtractionImage {
  /** image/png, image/jpeg, image/webp */
  mediaType: string;
  base64: string;
}

export class PortfolioExtractionError extends Error {}

export async function extractPortfolioFromImages(images: ExtractionImage[]): Promise<AnalyzePortfolioResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new PortfolioExtractionError("ANTHROPIC_API_KEY غير مُعرّف في بيئة السيرفر.");
  }

  const client = new Anthropic({ apiKey });

  const imageBlocks: Anthropic.ImageBlockParam[] = images.map((image) => ({
    type: "image",
    source: {
      type: "base64",
      media_type: image.mediaType as "image/png" | "image/jpeg" | "image/webp",
      data: image.base64,
    },
  }));

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system:
      "You are extracting structured data from screenshots of a crypto Spot copy-trading portfolio (e.g. Binance/Bybit copy-trading dashboards) for a portfolio-scoring tool. Only report values you can actually read in the images. Never fabricate or estimate numbers that are not shown.",
    tools: [EXTRACTION_TOOL],
    tool_choice: { type: "tool", name: EXTRACTION_TOOL_NAME },
    messages: [
      {
        role: "user",
        content: [
          ...imageBlocks,
          {
            type: "text",
            text: "استخرج بيانات المحفظة الظاهرة في هذه الصور باستخدام أداة extract_portfolio_data.",
          },
        ],
      },
    ],
  });

  const toolUseBlock = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use" && block.name === EXTRACTION_TOOL_NAME,
  );

  if (!toolUseBlock) {
    throw new PortfolioExtractionError("لم يتمكن النظام من قراءة بيانات من الصور المرفوعة.");
  }

  const raw = toolUseBlock.input as Record<string, unknown>;
  const { missingFields, notes, ...data } = raw;

  // تحقق: إذا كانت الحقول الجوهرية كلها مفقودة، الصورة ليست لقطة محفظة
  const CRITICAL_FIELDS = ["roiPercent", "totalTrades", "winRatePercent", "netProfit", "tradingDays", "maximumDrawdownPercent"];
  const missing = Array.isArray(missingFields) ? missingFields as string[] : [];
  const foundCritical = CRITICAL_FIELDS.filter((f) => !(missing.includes(f)) && (data as Record<string, unknown>)[f] !== undefined);

  if (foundCritical.length === 0) {
    throw new PortfolioExtractionError(
      "الصورة المرفوعة لا تبدو لقطة شاشة لمحفظة Spot Copy Trading. يرجى رفع صورة من منصة نسخ التداول (Binance أو Bybit أو ما شابهها)."
    );
  }

  return {
    data: data as ExtractedPortfolioData,
    missingFields: missing.filter((f): f is string => typeof f === "string"),
    notes: typeof notes === "string" ? notes : undefined,
  };
}
