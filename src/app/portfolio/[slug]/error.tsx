"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ReportError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="text-xl font-bold text-foreground">حدث خطأ أثناء تحميل التقرير</h1>
      <p className="text-sm text-muted-foreground">حاول إعادة المحاولة، أو عد إلى لوحة المستخدم.</p>
      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={reset}>
          إعادة المحاولة
        </Button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
