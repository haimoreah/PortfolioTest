import { BRAND_NAME, PERSONAL_PAGE_URL } from "@/lib/brand";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function SiteHeader() {
  return (
    <header className="site-header print-hidden">
      <div className="site-header-inner">
        <a
          href={PERSONAL_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-link"
          aria-label={`${BRAND_NAME} على إنستغرام`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE}/brand/mr-amwal-logo.png`} alt={BRAND_NAME} width={40} height={40} className="brand-logo" />
          <span className="brand-name">{BRAND_NAME}</span>
        </a>
      </div>
    </header>
  );
}
