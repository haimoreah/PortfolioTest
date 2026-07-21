# ME Spot Portfolio Score

تطبيق ويب عربي (RTL) لتقييم محافظ Spot Copy Trading. يعرض تقريراً كاملاً باسم **ME Spot Portfolio Score** يحسب نقاط المخاطر والأداء وجودة الأصول والاستقرار ونوع التداول تلقائياً من بيانات المحفظة، ويقارنها بمتوسط المحافظ، دون أي درجات ثابتة داخل الواجهة.

## المكدس التقني

- Next.js (App Router) + React + TypeScript (strict mode)
- Tailwind CSS
- Lucide React للأيقونات
- Framer Motion لحركات الفتح والإغلاق (Accordion)
- Zod للتحقق من صحة البيانات
- Vitest لاختبار محرك التقييم
- Anthropic SDK (Claude Vision) لتحليل سكرين شوت المحفظة في `/portfolio/analyze`

## التثبيت

```bash
npm install
```

## متغيرات البيئة

انسخ `.env.example` إلى `.env.local` وضع مفتاح Anthropic الخاص بك:

```bash
cp .env.example .env.local
```

```
ANTHROPIC_API_KEY=sk-ant-...
```

هذا المفتاح مطلوب فقط لميزة "قيّم محفظتك" (`/portfolio/analyze`) التي تحلل سكرين شوت المحفظة عبر Claude. باقي الصفحات (بما فيها تقرير أموال وإنت قاعد) لا تحتاج أي مفتاح ولا تتصل بأي خدمة خارجية.

## التشغيل في وضع التطوير

```bash
npm run dev
```

يفتح التطبيق على `http://localhost:3000`.

- الصفحة الرئيسية: `/`
- تقرير "أموال وإنت قاعد": `/portfolio/amwal-w-enta-qaed`
- تحليل محفظة المستخدم من سكرين شوت: `/portfolio/analyze`

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

الألوان والخطوط والمسافات معرّفة كمتغيرات CSS في `src/app/globals.css` (مثل `--primary`, `--background`, `--card`, `--radius`) وتُستهلك عبر Tailwind من خلال `@theme inline`. عدّل القيم هناك لتغيير الهوية البصرية بالكامل دون الحاجة لتعديل أي مكون. الهوية الحالية مطابقة لأداة `Mr_Haimore-capital-allocator` (لون العلامة التجارية، الخط Cairo، الهيدر والفوتر، شعار ورسمة الشخصية في `public/brand/`).

## تحليل محفظة المستخدم (`/portfolio/analyze`)

- يرفع المستخدم سكرين شوت واحد أو أكثر من لوحة تحكم محفظته (`src/components/analyze/screenshot-uploader.tsx`).
- الصور تُرسل إلى `POST /api/analyze-portfolio` (`src/app/api/analyze-portfolio/route.ts`) الذي يستدعي Claude عبر `src/lib/ai/extract-portfolio.ts` لاستخراج الحقول الظاهرة فقط — لا يتم تخمين أي رقم غير ظاهر بالصورة.
- المستخدم يراجع/يكمل الحقول الناقصة في `src/components/analyze/portfolio-review-form.tsx`، والتي تُتحقق عبر `portfolioSchema` نفسه قبل حساب النتيجة.
- النتيجة تُعرض عبر نفس مكون التقرير المستخدم في الصفحة الثابتة (`src/components/report/report-view.tsx`)، فلا يوجد أي تكرار لمنطق العرض أو التقييم بين المسارين.
- لا تُحفظ الصور ولا بيانات المحفظة على أي خادم أو قاعدة بيانات — التحليل يحدث لحظياً والنتيجة تُعرض للمستخدم فقط.

## ملاحظة

هذا التقرير لأغراض التقييم والمعلومات العامة فقط. مسار `/portfolio/[slug]` الثابت لا يعتمد على أي بيانات مالية حية أو API خارجي؛ الاستثناء الوحيد هو ميزة "قيّم محفظتك" الاختيارية التي تستخدم Claude لقراءة الأرقام من سكرين شوت يرفعه المستخدم بنفسه.
