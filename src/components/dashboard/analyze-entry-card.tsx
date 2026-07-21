import { ScanSearch } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function AnalyzeEntryCard() {
  return (
    <Link href="/portfolio/analyze" className="block focus-visible:outline-2 focus-visible:outline-primary rounded-[var(--radius-card)]">
      <Card className="group flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] sm:p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-subtle text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <ScanSearch className="h-6 w-6" aria-hidden />
        </span>
        <div className="flex flex-1 flex-col gap-0.5">
          <h2 className="text-base font-bold text-foreground">قيّم محفظتك الخاصة</h2>
          <p className="text-sm text-muted-foreground">ارفع سكرين شوت واحصل على تقرير فوري</p>
        </div>
      </Card>
    </Link>
  );
}
