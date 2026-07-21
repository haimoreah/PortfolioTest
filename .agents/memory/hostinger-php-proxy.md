---
name: Hostinger PHP Proxy for Next.js
description: How to run Next.js on Hostinger shared hosting under a subdirectory, using PHP as reverse proxy to Node.js.
---

## Setup
- Node.js installed via nvm at `~/.nvm/versions/node/v20.20.2/bin/`
- App lives at `~/apps/portfolio/`, runs on port 3001 via PM2
- `~/domains/mr-amwal.com/public_html/mramwal/PortfolioTest/` contains `proxy.php` + `.htaccess`
- `.htaccess` routes all requests through `proxy.php` with `DirectorySlash Off` (prevents LiteSpeed trailing-slash redirect loop)
- `proxy.php` strips trailing slash before forwarding to Node.js (prevents 308 loop)
- ANTHROPIC_API_KEY stored in `~/apps/portfolio/.env.local` on VPS only — never committed

## Auto-restart
- PM2 process saved with `pm2 save`
- hPanel Cron Jobs (Advanced → Cron Jobs) runs `/home/u633640437/start-portfolio.sh` every 5 minutes
- `start-portfolio.sh` does `pm2 resurrect` or starts fresh if PM2 is down

## Why not LiteSpeed [P] proxy?
- Hostinger shared hosting disables mod_proxy in .htaccess — 503 error
- PHP curl workaround is the only option without root

**Why:** No root/sudo access; `crontab` command blocked from SSH but hPanel UI cron works.
