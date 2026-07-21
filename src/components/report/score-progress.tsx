import type { Rating } from "@/types/scoring";
import { ProgressBar } from "@/components/ui/progress-bar";
import { RatingBadge } from "./rating-badge";

interface ScoreProgressProps {
  label: string;
  score: number;
  maxScore: number;
  rating: Rating;
}

export function ScoreProgress({ label, score, maxScore, rating }: ScoreProgressProps) {
  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <RatingBadge rating={rating} />
          <span className="text-sm font-bold tabular-nums text-foreground">
            {score} / {maxScore}
          </span>
        </div>
      </div>
      <ProgressBar value={score} max={maxScore} aria-label={`${label}: ${score} من ${maxScore}`} />
    </div>
  );
}
