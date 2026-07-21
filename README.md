# ME Spot Portfolio Score

تطبيق ويب عربي (RTL) لتقييم محافظ Spot Copy Trading. يعرض تقريراً كاملاً باسم **ME Spot Portfolio Score** يحسب نقاط المخاطر والأداء وجودة الأصول والاستقرار ونوع التداول تلقائياً من بيانات المحفظة، ويقارنها بمتوسط المحافظ، دون أي درجات ثابتة داخل الواجهة.

## المكدس التقني

- Next.js (App Router) + React + TypeScript (strict mode)
- Tailwind CSS
- Lucide React للأيقونات
- Framer Motion لحركات الفتح والإغلاق (Accordion)
- Zod للتحقق من صحة البيانات
- Vitest لاختبار محرك التقييم

## التثبيت

```bash
npm install
```

## التشغيل في وضع التطوير

```bash
npm run dev
```

يفتح التطبيق على `http://localhost:3000`.

- الصفحة الرئيسية: `/`
- تقرير "أموال وإنت قاعد": `/portfolio/amwal-w-enta-qaed`

## الاختبار

```bash
npm run test        # وضع المراقبة (watch)
npm run test:run    # تشغيل الاختبارات مرة واحدة
```

تغطي الاختبارات محرك التقييم بالكامل: بيانات المثال (94/100)، القيم الحدّية لـ Sharpe وDrawdown، محافظ Futures/Margin، منطق المقارنة بالمتوسط، وحالات القسمة على صفر.

## الفحص والبناء

```bash
npm run lint
npm run build
npm run start
```

## أين يتم تعديل بيانات المحفظة؟

بيانات المثال موجودة في `src/data/demo-portfolio.ts` (الكائنان `demoPortfolio` و`demoBenchmarks`). عدّل القيم هناك مباشرة لتجربة سيناريوهات مختلفة — ستتحدث جميع النتائج والخلاصات في التقرير تلقائياً لأنها تُحسب بالكامل عبر محرك التقييم.

## أين يتم تعديل قواعد التقييم؟

كل قواعد التقييم معزولة في `src/lib/scoring/`:

- `scoring-rules.ts`: جداول النقاط (Sharpe، Drawdown، ROI، جودة الأصول، الاستقرار) ودالة `getRating` المركزية لتحديد التقييم واللون.
- `calculate-risk-score.ts`, `calculate-performance-score.ts`, `calculate-asset-quality-score.ts`, `calculate-stability-score.ts`, `calculate-trading-type-score.ts`: حساب كل قسم على حدة.
- `calculate-portfolio-score.ts`: تجميع النتيجة النهائية (مع تقييد القيمة بين 0 و100).
- `compare-to-benchmark.ts`: منطق المقارنة مع متوسط المحافظ، بما في ذلك اتجاه "الأقل أفضل" لـ Maximum Drawdown.
- `generate-summary.ts`: توليد الخلاصات النصية الديناميكية لكل قسم.

لا تُكرَّر هذه القواعد في أي مكون واجهة — المكونات تستهلك فقط نتائج محرك التقييم.

## كيفية استبدال Demo Repository بقاعدة بيانات أو API

طبقة الوصول للبيانات معزولة في `src/data/portfolio-repository.ts` خلف الواجهة `PortfolioRepository`:

```ts
interface PortfolioRepository {
  getPortfolioBySlug(slug: string): Promise<Portfolio | null>;
  getBenchmarks(): Promise<PortfolioBenchmarks>;
}
```

للانتقال إلى قاعدة بيانات أو API خارجي، أنشئ تطبيقاً جديداً لهذه الواجهة (مثلاً `DatabasePortfolioRepository`) يقرأ من مصدر البيانات الفعلي، ثم استبدل تصدير `portfolioRepository` في نفس الملف. لا حاجة لتعديل أي مكون واجهة لأن جميعها تستهلك `portfolioRepository` فقط.

## طريقة إضافة محفظة جديدة

1. أضف كائن `Portfolio` جديداً (بنفس شكل `demoPortfolio`) في مصدر البيانات المستخدم (Demo أو قاعدة بيانات).
2. تأكد أن قيمه تحقق `portfolioSchema` في `src/lib/validation/portfolio-schema.ts`.
3. زر الصفحة `/portfolio/<slug>` حيث `<slug>` هو حقل `slug` في الكائن.

## طريقة تغيير الهوية البصرية

الألوان والخطوط والمسافات معرّفة كمتغيرات CSS في `src/app/globals.css` (مثل `--primary`, `--background`, `--card`, `--radius`) وتُستهلك عبر Tailwind من خلال `@theme inline`. عدّل القيم هناك لتغيير الهوية البصرية بالكامل (بما في ذلك الوضع الليلي عبر `prefers-color-scheme: dark`) دون الحاجة لتعديل أي مكون.

## ملاحظة

هذا التقرير لأغراض التقييم والمعلومات العامة فقط، ولا يعتمد على بيانات مالية حية أو أي API خارجي.
