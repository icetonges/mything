# MyThing Platform

**AI-Powered Full-Stack Knowledge Management System**

Built by [Peter Shang](https://linkedin.com/in/petershang) with Claude (Anthropic) • February 2026

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://shangthing.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-orange)](https://ai.google.dev/)

---

## 🚀 Overview

A production-grade personal knowledge platform featuring multi-agent AI, automated news aggregation from 22 premium sources, and intelligent summarization.

### Key Features

- ✅ **4 Specialized AI Agents** - Portfolio, Tech Trends, DoD Policy, Notes
- ✅ **22 Verified News Sources** - AI/ML, DoD, Federal, Tech
- ✅ **44 Articles per Run** - Every 6 hours via GitHub Actions
- ✅ **AI-Powered Summaries** - Gemini 2.5 Flash with function calling
- ✅ **Zero-Cost Deployment** - Vercel + Neon + GitHub Actions
- ✅ **Production-Ready** - Error handling, caching, rate limiting

---

## 📊 Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS  
**Backend:** Node.js, Prisma, PostgreSQL (Neon)  
**AI:** Gemini 2.5 Flash (@google/genai)  
**Automation:** Python 3.12, GitHub Actions  
**Deployment:** Vercel (serverless)

---

## 🎯 Core Capabilities

### 1. Multi-Agent AI System
Four specialized agents with native function calling:
- **Portfolio Agent** - Background, skills, achievements
- **Tech Trends Agent** - Latest AI/ML, tech news
- **DoD Policy Agent** - Budget, audit, IT policy
- **Notes Agent** - Capture and reflect on thoughts

### 2. Automated News Aggregation
Scrapes 22 sources across 8 categories:
- **AI/ML** (7 sources): Hugging Face, OpenAI, Anthropic, Google AI, The Batch, arXiv
- **DoD** (9 sources): DoD IG, GAO, DefenseScoop, C4ISRNET, Breaking Defense
- **General Tech** (6 sources): AWS, Hacker News, FedScoop, Schneier

### 3. Tech Pulse Dashboard
Real-time AI intelligence with:
- Executive Summary (3 sentences)
- AI/ML Highlight (LLMs, Agents, Tools)
- Category Highlights (8 categories)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Gemini API key
- Google OAuth credentials

### Installation

```bash
# Clone repository
git clone https://github.com/icetonges/mything.git
cd mything

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
npx prisma db push
npx prisma generate

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 📁 Project Structure

```
mything/
├── app/              # Next.js App Router
│   ├── (public)/     # Public pages
│   ├── (private)/    # Auth-protected pages
│   └── api/          # API routes
├── components/       # React components
├── lib/              # Core libraries
│   ├── ai/           # Multi-agent system
│   ├── gemini.ts     # Gemini API wrapper
│   └── prisma.ts     # Database client
├── prisma/           # Database schema
├── scripts/          # Python scraper
└── .github/workflows # Automation
```

---

## 🛠️ Configuration

### Required Environment Variables

```bash
# Auth
AUTH_SECRET=<openssl rand -base64 32>
GOOGLE_CLIENT_ID=<from console.cloud.google.com>
GOOGLE_CLIENT_SECRET=<from console.cloud.google.com>

# Database
DATABASE_URL=<from neon.tech>
DATABASE_URL_UNPOOLED=<from neon.tech>

# AI
GEMINI_API_KEY=<from aistudio.google.com>

# Scraper
SCRAPER_TOKEN=<openssl rand -hex 32>
```

See `.env.example` for complete list.

---

## 📊 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo to Vercel for automatic deployments
```

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy to any Node.js hosting platform
3. Configure environment variables
4. Setup GitHub Actions for scraper

---

## 🔧 Maintenance

### Daily
- Monitor scraper: GitHub Actions → "Auto-Scrape Tech News"
- Check database: Archive page (requires login)

### Weekly
- Review article quality: `/tech-trends`
- Monitor API usage: Google AI Studio

### Monthly
- Update dependencies: `npm update`
- Review news sources: `scripts/scrape_tech_news.py`
- Check for new Gemini models

---

## 📝 Documentation

- **[Complete Platform Documentation](.docs/MYTHING-PLATFORM-DOCUMENTATION.md)** - Full guide
- **[Deployment Guide](.docs/MYTHING-PLATFORM-DOCUMENTATION.md#-deployment-guide)** - Step-by-step
- **[Maintenance Guide](.docs/MYTHING-PLATFORM-DOCUMENTATION.md#-maintenance-guide)** - Operations
- **[Troubleshooting](.docs/MYTHING-PLATFORM-DOCUMENTATION.md#troubleshooting)** - Common issues

---

## 🏆 Key Achievements

- ✅ **24-hour build sprint** - Full platform from concept to production
- ✅ **6,500+ lines** - TypeScript, Python, SQL
- ✅ **Zero cost** - Free tier deployment
- ✅ **Production-grade** - Enterprise-level architecture

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 👤 Author

**Peter Shang**  
Federal Financial Manager | Data Scientist | Full-Stack Developer

- **LinkedIn:** [linkedin.com/in/petershang](https://linkedin.com/in/petershang)
- **GitHub:** [github.com/icetonges](https://github.com/icetonges)
- **Portfolio:** [petershang.vercel.app](https://petershang.vercel.app)
- **Platform:** [shangthing.vercel.app](https://shangthing.vercel.app)

---

## 🙏 Acknowledgments

Built with assistance from **Claude Sonnet 4.5** (Anthropic)

**Technologies:**
- Next.js (Vercel)
- Gemini API (Google DeepMind)
- Neon (Serverless PostgreSQL)
- Prisma (Database ORM)

**News Sources:**
- Hugging Face, OpenAI, Anthropic, Google AI
- DefenseScoop, C4ISRNET, Breaking Defense
- DoD IG, GAO, Federal Times

---

**Last Updated:** February 18, 2026 • **Status:** Production 🚀
