import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}

export function MetricCard({ icon: Icon, label, value, hint }: MetricCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xl font-extrabold tabular-nums text-foreground">{value}</span>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
    </Card>
  );
}
