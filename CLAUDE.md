# CLAUDE.md

إرشادات للعمل داخل هذا المشروع (ME Spot Portfolio Score).

## بنية المشروع

- `src/types/` — أنواع TypeScript لبيانات المحفظة ونتائج التقييم.
- `src/data/` — `demo-portfolio.ts` (بيانات المثال) و`portfolio-repository.ts` (طبقة الوصول للبيانات، القابلة للاستبدال بقاعدة بيانات/API).
- `src/lib/scoring/` — محرك التقييم بالكامل: قواعد النقاط، حساب كل قسم، التجميع النهائي، توليد الخلاصات، والمقارنة بالمتوسط.
- `src/lib/validation/` — التحقق من صحة بيانات المحفظة عبر Zod.
- `src/lib/formatters.ts` — تنسيق موحّد للأرقام والعملة والنسب والتاريخ.
- `src/components/report/` — مكونات صفحة التقرير، بما فيها `report-view.tsx` (المكوّن المشترك الذي يجمّع التقرير كاملاً ويُستخدم من المسار الثابت ومن مسار التحليل معاً).
- `src/components/dashboard/` — بطاقات الدخول من الصفحة الرئيسية.
- `src/components/analyze/` — رفع السكرين شوت ونموذج مراجعة البيانات المستخرجة.
- `src/components/brand/` — الهيدر والفوتر المشتركين (هوية Mr_Amwal).
- `src/components/ui/` — مكونات عامة قابلة لإعادة الاستخدام (Card، Badge، Button، ProgressBar).
- `src/lib/ai/extract-portfolio.ts` — استدعاء Claude لاستخراج بيانات المحفظة من الصور (يتطلب `ANTHROPIC_API_KEY`).
- `src/app/` — الصفحات (App Router): `/`, `/portfolio/[slug]`, `/portfolio/analyze`, `/api/analyze-portfolio`, `not-found`.
- `tests/` — اختبارات Vitest لمحرك التقييم ومنطق المقارنة.

## قواعد أساسية

1. **لا تكرر منطق التقييم (scoring logic) في أي مكان خارج `src/lib/scoring/`.** أي قاعدة نقاط أو تقييم أو لون جديد يجب أن يُضاف هناك، وتستهلكه المكونات فقط.
2. **لا تكتب أي درجة (score) بشكل ثابت داخل JSX.** كل رقم يظهر في التقرير يجب أن يأتي من `calculatePortfolioScore` أو الدوال المشتقة منه.
3. الألوان والتقييمات (ممتاز/جيد جداً/جيد/مقبول/ضعيف) تأتي حصراً من `getRating()` في `scoring-rules.ts`.
4. حافظ على `dir="rtl"` و`lang="ar"` في `src/app/layout.tsx`، ولا تُدخل نصوصاً أو تخطيطات LTR بدون داعٍ.
5. حافظ على TypeScript strict mode — لا تستخدم `any` إلا عند الضرورة القصوى الموثقة.
6. بعد أي تعديل، شغّل بالترتيب:
   ```bash
   npm run lint
   npm run test:run
   npm run build
   ```
   ولا تعتبر المهمة منتهية إلا إذا مرّت الأوامر الثلاثة بدون أخطاء.
7. عند تعديل قواعد التقييم، حدّث الاختبارات في `tests/` (خصوصاً القيم الحدّية وبيانات المثال) لتبقى مطابقة للسلوك الجديد.
