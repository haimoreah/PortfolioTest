import { NextResponse } from "next/server";
import { extractPortfolioFromImages, PortfolioExtractionError, type ExtractionImage } from "@/lib/ai/extract-portfolio";

const MAX_IMAGES = 5;
const MAX_BASE64_LENGTH = 8_000_000; // ~6MB decoded, generous for a screenshot
const ALLOWED_MEDIA_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

interface AnalyzeRequestBody {
  images?: unknown;
}

function parseDataUrl(dataUrl: unknown): ExtractionImage | null {
  if (typeof dataUrl !== "string") return null;
  const match = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const [, mediaType, base64] = match;
  if (!ALLOWED_MEDIA_TYPES.has(mediaType)) return null;
  if (base64.length === 0 || base64.length > MAX_BASE64_LENGTH) return null;
  return { mediaType, base64 };
}

export async function POST(request: Request) {
  let body: AnalyzeRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  if (!Array.isArray(body.images) || body.images.length === 0) {
    return NextResponse.json({ error: "يجب رفع صورة واحدة على الأقل." }, { status: 400 });
  }

  if (body.images.length > MAX_IMAGES) {
    return NextResponse.json({ error: `الحد الأقصى ${MAX_IMAGES} صور في المرة الواحدة.` }, { status: 400 });
  }

  const images = body.images.map(parseDataUrl);
  if (images.some((image) => image === null)) {
    return NextResponse.json({ error: "صيغة صورة غير مدعومة. استخدم PNG أو JPEG أو WEBP." }, { status: 400 });
  }

  try {
    const result = await extractPortfolioFromImages(images as ExtractionImage[]);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PortfolioExtractionError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    console.error("Portfolio extraction failed", error);
    return NextResponse.json({ error: "تعذّر تحليل الصور. حاول مرة أخرى." }, { status: 500 });
  }
}
