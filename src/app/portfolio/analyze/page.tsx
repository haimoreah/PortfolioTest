"use client";

import { ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PortfolioReviewForm } from "@/components/analyze/portfolio-review-form";
import { ScreenshotUploader, type UploadedImage } from "@/components/analyze/screenshot-uploader";
import { Button } from "@/components/ui/button";
import { ReportView } from "@/components/report/report-view";
import { demoBenchmarks } from "@/data/demo-portfolio";
import type { AnalyzePortfolioResponse } from "@/types/analyze";
import type { Portfolio } from "@/types/portfolio";

type Step =
  | { name: "upload" }
  | { name: "review"; extraction: AnalyzePortfolioResponse }
  | { name: "report"; portfolio: Portfolio };

export default function AnalyzePortfolioPage() {
  const [step, setStep] = useState<Step>({ name: "upload" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  async function handleAnalyze(images: UploadedImage[]) {
    setIsAnalyzing(true);
    setErrorMessage(undefined);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/analyze-portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: images.map((image) => image.dataUrl) }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setErrorMessage(payload.error ?? "تعذّر تحليل الصور. حاول مرة أخرى.");
        return;
      }

      setStep({ name: "review", extraction: payload as AnalyzePortfolioResponse });
    } catch {
      setErrorMessage("تعذّر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (step.name === "report") {
    return (
      <>
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-6 sm:px-6">
          <Button variant="outline" size="sm" onClick={() => setStep({ name: "upload" })}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            تحليل محفظة أخرى
          </Button>
        </div>
        <ReportView portfolio={step.portfolio} benchmarks={demoBenchmarks} />
      </>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 sm:py-16">
      <Link href="/" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowRight className="h-4 w-4" aria-hidden />
        العودة للرئيسية
      </Link>

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">قيّم محفظتك</h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          ارفع سكرين شوت لمحفظتك، راجع البيانات المستخرجة، واحصل على تقرير ME Spot Portfolio Score الكامل فوراً.
        </p>
      </div>

      {step.name === "upload" ? (
        <ScreenshotUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} errorMessage={errorMessage} />
      ) : (
        <PortfolioReviewForm
          extracted={step.extraction.data}
          missingFields={step.extraction.missingFields}
          notes={step.extraction.notes}
          onBack={() => setStep({ name: "upload" })}
          onConfirm={(portfolio) => setStep({ name: "report", portfolio })}
        />
      )}
    </div>
  );
}
