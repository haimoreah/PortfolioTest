"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import type { Rating } from "@/types/scoring";
import { RatingBadge } from "./rating-badge";

interface ScoreAccordionSectionProps {
  id: string;
  title: string;
  icon: ReactNode;
  score?: number;
  maxScore?: number;
  rating?: Rating;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ScoreAccordionSection({
  id,
  title,
  icon,
  score,
  maxScore,
  rating,
  children,
  defaultOpen = false,
}: ScoreAccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const prefersReducedMotion = useReducedMotion();
  const panelId = useId();
  const buttonId = `${id}-trigger`;

  return (
    <Card className="print-no-shadow overflow-hidden">
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 p-5 text-start transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary sm:p-6"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </span>
          <span className="text-base font-bold text-foreground sm:text-lg">{title}</span>
        </span>

        <span className="flex items-center gap-3">
          {rating ? <RatingBadge rating={rating} className="hidden sm:inline-flex" /> : null}
          {score !== undefined && maxScore !== undefined ? (
            <span className="text-sm font-bold tabular-nums text-foreground">
              {score} / {maxScore}
            </span>
          ) : null}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground">
            {isOpen ? <Minus className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: "easeInOut" }}
            className="print-force-open overflow-hidden"
          >
            <div className="flex flex-col gap-5 border-t border-border p-5 sm:p-6">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
