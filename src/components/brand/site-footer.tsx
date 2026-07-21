import { BRAND_NAME, PERSONAL_PAGE_URL } from "@/lib/brand";

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer print-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4" style={{ direction: "ltr" }}>
        <a
          href={PERSONAL_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/70 transition-colors hover:text-primary"
        >
          <InstagramIcon size={13} />
          <span>تابع {BRAND_NAME}</span>
        </a>

        <span className="text-xs text-muted-foreground/70" style={{ direction: "rtl" }}>
          © 2026 {BRAND_NAME}
        </span>
      </div>
    </footer>
  );
}
