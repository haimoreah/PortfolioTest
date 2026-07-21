"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Rating } from "@/types/scoring";

interface ScoreCircleProps {
  score: number;
  maxScore: number;
  rating: Rating;
  size?: number;
}

export function ScoreCircle({ score, maxScore, rating, size = 168 }: ScoreCircleProps) {
  const prefersReducedMotion = useReducedMotion();
  const percent = maxScore > 0 ? Math.min(100, Math.max(0, (score / maxScore) * 100)) : 0;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - percent / 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold tabular-nums text-foreground">{Math.round(score)}</span>
        <span className="text-sm font-medium text-muted-foreground">من {maxScore}</span>
        <span className={`mt-1 text-sm font-bold ${rating.textColor}`}>{rating.label}</span>
      </div>
    </div>
  );
}
