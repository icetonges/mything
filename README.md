# MyThing

Personal knowledge management, showcase, and AI-powered digital garden for Peter Shang.

**Target URL:** [mything.vercel.app](https://mything.vercel.app)

## Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS, Framer Motion, lucide-react
- **Auth:** NextAuth.js v5 (Auth.js) — Google OAuth + credentials fallback
- **DB:** Prisma + PostgreSQL (Neon/Vercel Postgres)
- **AI:** Google Gemini (chat, note summarization)
- **Deploy:** Vercel

## Setup

1. **Clone and install**
   ```bash
   cd mything
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env.local`
   - Set `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`)
   - Set `NEXTAUTH_URL` (local: `http://localhost:3000`, prod: `https://mything.vercel.app`)
   - Add Google OAuth credentials: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - Set `OWNER_EMAIL` and `OWNER_PASSPHRASE` for credentials fallback
   - Set `DATABASE_URL` (PostgreSQL)
   - Set `GEMINI_API_KEY` for AI features
   - Optional: `EMAIL_*` for contact form, `SCRAPER_TOKEN` for tech scraper

3. **Database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Run**
   ```bash
   npm run dev
   ```

## Tech news scraper

- Script: `scripts/scrape_tech_news.py`
- Dependencies: `pip install feedparser requests google-generativeai`
- Env: `GEMINI_API_KEY`, `SCRAPER_TOKEN`, `SITE_URL`
- GitHub Actions: `.github/workflows/scrape.yml` (cron daily + manual dispatch)
- Add repo secrets: `GEMINI_API_KEY`, `SCRAPER_TOKEN`

## Project structure

- `lib/navigation.ts` — single source of truth for all tabs
- `lib/constants.ts` — LINKS, site metadata
- `lib/projects.ts` — portfolio projects
- `app/(public)/` — public pages (Home, Tech Trends, My Work, AI & ML, Fed Finance)
- `app/(private)/` — auth-required (Notes, Family, Archive)
- `app/(auth)/login/` — login page

## License

Private. © Peter Shang.
