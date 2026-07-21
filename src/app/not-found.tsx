import { Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Compass className="h-8 w-8" aria-hidden />
      </span>
      <h1 className="text-3xl font-extrabold text-foreground">404</h1>
      <h2 className="text-lg font-bold text-foreground">الصفحة غير موجودة</h2>
      <p className="text-sm text-muted-foreground">
        عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى مكان آخر.
      </p>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}
