---
name: Next.js basePath and client-side fetch
description: When Next.js app uses basePath, client fetch() calls must manually include the base path.
---

## Rule
`fetch("/api/route")` from a client component does NOT auto-prepend `basePath`. The browser sends to the origin root, bypassing any subdirectory proxy.

## Fix
In `next.config.ts`:
```ts
env: { NEXT_PUBLIC_BASE_PATH: "/mramwal/PortfolioTest" }
```
In client component:
```ts
fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/analyze-portfolio`, ...)
```

**Why:** `NEXT_PUBLIC_*` vars are baked at build time — requires rebuild after change. Link/Router components auto-use basePath but bare fetch() does not.
