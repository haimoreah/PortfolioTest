import type { Portfolio } from "@/types/portfolio";
import type {
  AssetQualityScoreResult,
  PerformanceScoreResult,
  RiskScoreResult,
  StabilityScoreResult,
} from "@/types/scoring";

function ratioLabel(score: number, maxScore: number): "full" | "high" | "mid" | "low" {
  const ratio = score / maxScore;
  if (ratio >= 1) return "full";
  if (ratio >= 0.75) return "high";
  if (ratio >= 0.5) return "mid";
  return "low";
}

export function generateRiskSummary(risk: RiskScoreResult): string {
  const level = ratioLabel(risk.score, risk.maxScore);
  const sharpeGood = risk.sharpe.sharpeRatio >= 2;
  const drawdownGood = risk.drawdown.maximumDrawdownPercent < 5;

  if (level === "full") {
    return "حققت المحفظة الدرجة الكاملة في تقييم المخاطر، بفضل ارتفاع Sharpe Ratio وانخفاض Maximum Drawdown، مما يعكس كفاءة عالية في إدارة المخاطر والمحافظة على رأس المال.";
  }

  if (level === "high") {
    return `حققت المحفظة نتيجة قوية في تقييم المخاطر (${risk.score}/${risk.maxScore})، مع ${
      sharpeGood ? "معدل شارب مرتفع" : "معدل شارب مقبول"
    } و${drawdownGood ? "تراجع محدود عن القمة" : "تراجع في الحدود المقبولة"}، ما يشير إلى إدارة مخاطر جيدة بشكل عام.`;
  }

  if (level === "mid") {
    return `أظهرت المحفظة مستوى متوسطاً من إدارة المخاطر (${risk.score}/${risk.maxScore})، ويُنصح بمراقبة معدل شارب ونسبة التراجع عن القمة لتحسين هذا القسم مستقبلاً.`;
  }

  return `أشارت النتيجة (${risk.score}/${risk.maxScore}) إلى ضعف نسبي في إدارة المخاطر، نتيجة انخفاض معدل شارب و/أو ارتفاع نسبة التراجع عن القمة، ما يستدعي مراجعة استراتيجية إدارة رأس المال.`;
}

export function generatePerformanceSummary(performance: PerformanceScoreResult, portfolio: Portfolio): string {
  const level = ratioLabel(performance.score, performance.maxScore);
  const winRateText =
    portfolio.winRatePercent >= 90
      ? "معدل نجاح مرتفع"
      : portfolio.winRatePercent >= 70
        ? "معدل نجاح جيد"
        : "معدل نجاح معتدل";

  if (level === "full" || level === "high") {
    return `حققت المحفظة عائداً إيجابياً خلال فترة التقييم (ROI ${portfolio.roiPercent}%)، مع ${winRateText} واستمرارية في تحقيق الأرباح على مدى ${portfolio.tradingDays} يوماً من التداول.`;
  }

  if (level === "mid") {
    return `سجلت المحفظة عائداً معتدلاً (ROI ${portfolio.roiPercent}%) مع ${winRateText}، ويمكن تحسين الأداء عبر زيادة كفاءة الصفقات المنفذة.`;
  }

  return `جاء أداء المحفظة أقل من المتوقع (ROI ${portfolio.roiPercent}%)، ويستدعي ذلك مراجعة استراتيجية التداول لتحسين العائد.`;
}

export function generateAssetQualitySummary(assetQuality: AssetQualityScoreResult, portfolio: Portfolio): string {
  const level = ratioLabel(assetQuality.score, assetQuality.maxScore);
  const highQualityCount = portfolio.assets.filter((asset) => asset.quality === "high").length;

  if (level === "full" || level === "high") {
    return `تتركز المحفظة في أصول ذات جودة عالية (${assetQuality.assetQualityPercent}%)، حيث تشكل الأصول عالية الجودة ${highQualityCount} من أصل ${portfolio.assets.length} أصولاً، مما يعزز استقرار المحفظة على المدى الطويل.`;
  }

  if (level === "mid") {
    return `تحتوي المحفظة على مزيج متوسط الجودة من الأصول (${assetQuality.assetQualityPercent}%)، مع وجود بعض الأصول الأكثر مضاربة ضمن التوزيع الحالي.`;
  }

  return `تشير نسبة جودة الأصول (${assetQuality.assetQualityPercent}%) إلى تركّز أعلى في الأصول المضاربية، ما قد يزيد من تقلب المحفظة.`;
}

export function generateStabilitySummary(stability: StabilityScoreResult, portfolio: Portfolio): string {
  const level = ratioLabel(stability.score, stability.maxScore);
  const winningDaysText = `${portfolio.winningDays} يوماً رابحاً من أصل ${portfolio.winningDays + portfolio.losingDays} يوماً`;

  if (level === "full" || level === "high") {
    return `أظهرت المحفظة استقراراً ملحوظاً في الأداء (${stability.stabilityLevel})، بتحقيق ${winningDaysText}، مما يعكس اتساقاً جيداً في النتائج اليومية.`;
  }

  if (level === "mid") {
    return `أظهرت المحفظة استقراراً متوسطاً (${stability.stabilityLevel})، مع تفاوت ملحوظ بين الأيام الرابحة والخاسرة.`;
  }

  return `أظهرت المحفظة تذبذباً واضحاً في الأداء اليومي (${stability.stabilityLevel})، ما يستدعي مزيداً من المراقبة لاستقرار النتائج.`;
}

export function generateExecutiveSummary(portfolio: Portfolio, finalScore: number): string {
  const level = ratioLabel(finalScore, 100);

  if (level === "full") {
    return "أداء متوازن مع إدارة مخاطر ممتازة.";
  }

  if (level === "high") {
    return "أداء جيد جداً مع إدارة مخاطر قوية.";
  }

  if (level === "mid") {
    return "أداء مقبول مع وجود مجال للتحسين.";
  }

  return "أداء يحتاج إلى مراجعة شاملة لإدارة المخاطر والاستراتيجية.";
}
