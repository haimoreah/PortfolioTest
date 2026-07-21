import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { SiteHeader } from "@/components/brand/site-header";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ME Spot Portfolio Score",
  description: "لوحة تقييم محافظ Spot Copy Trading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative watermark sized by viewport height, not a fit for next/image's intrinsic sizing model */}
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/character.png`} alt="" aria-hidden="true" className="brand-watermark print-hidden" />
        <SiteHeader />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
