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
        <SiteHeader />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
