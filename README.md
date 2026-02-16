# MyThing — Personal Knowledge Platform

**Live:** https://shangthing.vercel.app  
**Author:** Xiaobing (Peter) Shang  
**Stack:** Next.js 15 · React 19 · TypeScript · PostgreSQL · Gemini 2.5 · NextAuth v5 · Vercel

---

## Quick Start

```bash
git clone https://github.com/icetonges/mything.git
cd mything
npm install
cp .env.example .env.local   # Fill in all variables
npm run db:push               # Push Prisma schema to Neon
npm run dev                   # Start at localhost:3000
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Auth | NextAuth.js v5 — Google OAuth + passphrase fallback |
| Database | PostgreSQL via Neon (Vercel Postgres) + Prisma ORM |
| AI | Gemini 2.5 Flash with 4-model fallback chain |
| Email | Nodemailer → Gmail SMTP |
| Deployment | Vercel with CI/CD |
| Scraper | Python 3.12 + feedparser + GitHub Actions |

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page — highlights, AI agent, contact |
| `/tech-trends` | Public | Auto-aggregated tech news |
| `/my-work` | Public | Portfolio showcase |
| `/ai-ml` | Public | AI/ML knowledge base |
| `/fed-finance` | Public | Federal financial management |
| `/notes` | **Private** | Daily thought capture + AI analysis |
| `/family` | **Private** | Family space + math helper |
| `/archive` | **Private** | Note inventory + search |
| `/archive/[slug]` | **Private** | Auto-generated note pages |

## Adding a New Tab

Edit `lib/navigation.ts` — add one entry to `NAV_ITEMS`. That's it.
All navigation menus, footers, and the home page update automatically.

## Running the Scraper Locally

```bash
pip install feedparser requests google-generativeai python-dateutil
export GEMINI_API_KEY=your_key
export SCRAPER_TOKEN=your_token
export SITE_URL=https://shangthing.vercel.app
python scripts/scrape_tech_news.py
```

## Environment Variables

See `.env.example` for the complete list with instructions.

## Key Architecture Decisions

- **Single navigation source:** `lib/navigation.ts` drives all menus, auth middleware, and home cards
- **Dark mode default:** `:root` = dark, `.light` = override (no flash)
- **Agentic AI:** Gemini function-calling loop with model fallback chain
- **Owner-only auth:** Only `OWNER_EMAIL` can authenticate — no public signup
- **Auto-archive:** Each saved note gets a permanent URL at `/archive/[date-headline-slug]`

---

*Built by Peter Shang as an AI Enabler — architecting, validating, and integrating AI-augmented workflows.*
