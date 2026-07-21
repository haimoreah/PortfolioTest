"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const MAX_IMAGES = 5;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  dataUrl: string;
}

interface ScreenshotUploaderProps {
  onAnalyze: (images: UploadedImage[]) => void;
  isAnalyzing: boolean;
  errorMessage?: string;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ScreenshotUploader({ onAnalyze, isAnalyzing, errorMessage }: ScreenshotUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const rejected = files.filter((file) => !ACCEPTED_TYPES.includes(file.type));
    if (rejected.length > 0) {
      setLocalError("الصيغ المدعومة فقط: PNG وJPEG وWEBP.");
      return;
    }

    if (images.length + files.length > MAX_IMAGES) {
      setLocalError(`الحد الأقصى ${MAX_IMAGES} صور.`);
      return;
    }

    setLocalError(null);
    const newImages = await Promise.all(
      files.map(async (file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        dataUrl: await readAsDataUrl(file),
      })),
    );
    setImages((current) => [...current, ...newImages]);
  }

  function removeImage(id: string) {
    setImages((current) => current.filter((image) => image.id !== id));
  }

  return (
    <Card className="flex flex-col gap-5 p-5 sm:p-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-bold text-foreground">ارفع سكرين شوت محفظتك</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          ارفع صورة أو أكثر من لوحة تحكم محفظة Spot Copy Trading (مثل Binance أو Bybit)، وسنقرأ منها الأرقام المتاحة
          تلقائياً.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {images.map((image) => (
          <div key={image.id} className="relative h-24 w-24 overflow-hidden rounded-[var(--radius-input)] border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not a next/image candidate */}
            <img src={image.previewUrl} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(image.id)}
              aria-label="إزالة الصورة"
              className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/70 text-white transition-colors hover:bg-destructive"
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-[var(--radius-input)] border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ImagePlus className="h-5 w-5" aria-hidden />
            <span className="text-xs font-semibold">إضافة صورة</span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {localError || errorMessage ? (
        <p className="text-sm font-medium text-destructive">{localError ?? errorMessage}</p>
      ) : null}

      <Button
        type="button"
        disabled={images.length === 0 || isAnalyzing}
        onClick={() => onAnalyze(images)}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            جارٍ تحليل الصور…
          </>
        ) : (
          "تحليل الصور"
        )}
      </Button>
    </Card>
  );
}
