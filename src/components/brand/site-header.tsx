import Image from "next/image";
import { BRAND_NAME, PERSONAL_PAGE_URL } from "@/lib/brand";

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
          <Image src="/brand/mr-amwal-logo.png" alt={BRAND_NAME} width={40} height={40} className="brand-logo" priority />
          <span className="brand-name">{BRAND_NAME}</span>
        </a>
      </div>
    </header>
  );
}
