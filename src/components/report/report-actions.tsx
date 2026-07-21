"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Printer, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ReportActions() {
  const [showToast, setShowToast] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 2200);
    } catch {
      setShowToast(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="print-hidden relative flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleShare} aria-label="نسخ رابط التقرير">
        <Share2 className="h-4 w-4" aria-hidden />
        مشاركة
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint} aria-label="طباعة التقرير">
        <Printer className="h-4 w-4" aria-hidden />
        طباعة
      </Button>

      <AnimatePresence>
        {showToast ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            role="status"
            className="absolute top-full mt-2 flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success shadow-sm"
            style={{ insetInlineEnd: 0 }}
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            تم نسخ رابط التقرير
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
