# MyThing Platform - Complete Documentation
**AI-Powered Full-Stack Knowledge Management System**

Built by **Peter Shang** with **Claude (Anthropic)** • February 2026

---

## 🏆 What We Built

A production-grade, AI-powered personal knowledge platform featuring:

- ✅ **Multi-agent AI system** with 4 specialized agents
- ✅ **Automated news aggregation** from 22 premium sources
- ✅ **AI-powered summarization** using Gemini 2.5 Flash
- ✅ **Real-time chat interface** with function calling
- ✅ **Tech Pulse dashboard** with category intelligence
- ✅ **Dedicated AI/ML focus** for LLM/Agent updates
- ✅ **8 content categories** spanning tech, DoD, and federal
- ✅ **44 articles per run** from verified sources
- ✅ **Zero-cost deployment** on Vercel + Neon + GitHub Actions

---

## 📊 Platform Statistics

| Metric | Value |
|--------|-------|
| **Total Source Code** | ~6,500 lines |
| **Languages** | TypeScript, Python, SQL |
| **AI Models** | Gemini 2.5 Flash, Claude Sonnet 4.5 |
| **Database Records** | 500+ tech articles, 100+ daily notes |
| **Deployment** | Vercel (Next.js), Neon (PostgreSQL) |
| **News Sources** | 22 verified RSS/HTML feeds |
| **Categories** | 8 (AI/ML, Cloud, Cyber, Web, Federal, DoD×3) |
| **Articles/Day** | ~176 (44 per run × 4 runs) |
| **AI Agents** | 4 specialized (Portfolio, Tech, DoD, Notes) |
| **Development Time** | 24 hours (intensive collaboration) |

---

## 🎯 Core Capabilities

### 1. Multi-Agent AI System
**Location:** `lib/ai/`

Four specialized AI agents with native Gemini function calling:

| Agent | Purpose | Tools | Context |
|-------|---------|-------|---------|
| **Portfolio Agent** | Peter's background, skills, achievements | Platform stats, recent notes | CDFM, IBM Data Science, DoD experience |
| **Tech Trends Agent** | Latest tech news, AI trends | Search articles | Real-time database queries |
| **DoD Policy Agent** | Budget, audit, IT policy | Search DoD news | OMB A-11/A-123, FIAR expertise |
| **Notes Agent** | Capture thoughts, reflect | Save/retrieve notes | AI-powered insights |

**Key Files:**
- `lib/ai/agent.ts` - Core agent router and execution engine
- `lib/ai/tools.ts` - Function declarations and handlers
- `lib/gemini.ts` - Gemini API wrapper with fallback chain

**Technical Highlights:**
- Native function calling (not string parsing)
- Automatic tool routing based on context
- Iterative execution (up to 3-4 rounds)
- Database integration via Prisma
- Error handling with model fallback

---

### 2. Automated News Aggregation
**Location:** `scripts/`

Intelligent web scraper with 22 verified sources:

**AI/ML Sources (7 sources, 14 articles):**
- Hugging Face (open-source LLMs)
- OpenAI Blog (GPT updates)
- Anthropic News (Claude updates)
- Google AI Blog (Gemini updates)
- The Batch (Andrew Ng's newsletter)
- arXiv AI + ML (academic research)

**DoD Sources (9 sources, 18 articles):**
- DoD IG, GAO, POGO (Audit)
- DoD Comptroller, Defense One, Federal News (Budget)
- DefenseScoop, C4ISRNET, Breaking Defense (Updates)

**General Tech (6 sources, 12 articles):**
- AWS Blog, Hacker News, Schneier, FedScoop

**Key Files:**
- `scripts/scrape_tech_news.py` - Main scraper (227 lines)
- `scripts/requirements.txt` - Python dependencies
- `.github/workflows/scrape.yml` - GitHub Actions automation

**Features:**
- RSS + HTML parsing
- AI-powered summaries (Gemini)
- Rate limiting (1.5s between requests)
- Automatic categorization
- Duplicate detection
- 2 articles per source limit

**Runs:** Every 6 hours via GitHub Actions

---

### 3. AI-Powered Tech Pulse Dashboard
**Location:** `components/home/`, `app/api/tech-pulse/`

Real-time intelligence dashboard with three AI-generated sections:

#### A. Executive Summary
- 3-sentence overview of all tech news
- Professional tone with specific details
- Mentions technologies, agencies, dollar amounts

#### B. AI/ML Highlight (NEW! ⭐)
- 2-3 sentences focused ONLY on LLMs, AI Agents, ML
- Purple-themed box for visibility
- Specific model names (GPT, Claude, Gemini, Llama)
- Dedicated focus for AI enthusiasts

#### C. Category Highlights
- One-sentence summary per category (8 total)
- Max 20 words each
- Most important development highlighted

**Key Files:**
- `app/api/tech-pulse/summary/route.ts` - AI summary generation
- `components/home/TechPulsePanel.tsx` - Dashboard component
- `lib/gemini.ts` - Gemini API integration

**Technical Details:**
- Single Gemini API call for all summaries
- 2-hour server-side cache
- Structured JSON output
- Error handling with fallback messages

---

### 4. Real-Time AI Chat Widget
**Location:** `components/ai/`, `app/api/chat/`

Interactive chat interface with:
- Agent routing based on message content
- Function calling for database queries
- Conversation history (last 6 messages)
- Markdown rendering
- Loading states and error handling

**Key Files:**
- `components/ai/AIChatWidget.tsx` - Chat UI component
- `app/api/chat/route.ts` - Chat API endpoint
- `lib/ai/agent.ts` - Agent execution engine

---

## 📁 Project Structure

```
mything/
├── app/                                # Next.js 15 App Router
│   ├── (public)/                       # Public pages
│   │   ├── page.tsx                    # Home page
│   │   ├── tech-trends/page.tsx        # Tech news browser
│   │   ├── my-work/page.tsx            # Portfolio showcase
│   │   ├── ai-ml/page.tsx              # AI/ML deep dive
│   │   └── fed-finance/page.tsx        # Federal finance content
│   ├── (private)/                      # Auth-protected pages
│   │   ├── daily-notes/page.tsx        # Note-taking interface
│   │   └── archive/page.tsx            # System monitor
│   └── api/                            # API Routes
│       ├── chat/route.ts               # AI chat endpoint
│       ├── tech-trends/
│       │   ├── route.ts                # Article fetching
│       │   └── ingest/route.ts         # Scraper ingestion
│       ├── tech-pulse/
│       │   └── summary/route.ts        # AI summary generation
│       ├── notes/route.ts              # Notes CRUD
│       └── auth/[...nextauth]/route.ts # NextAuth handlers
│
├── components/                         # React Components
│   ├── ai/
│   │   └── AIChatWidget.tsx            # Chat interface
│   ├── home/
│   │   ├── TechPulsePanel.tsx          # Tech Pulse dashboard
│   │   └── PortfolioDashboard.tsx      # Stats + timeline
│   └── ui/                             # Reusable UI components
│
├── lib/                                # Core Libraries
│   ├── ai/
│   │   ├── agent.ts                    # Multi-agent system
│   │   └── tools.ts                    # Function declarations
│   ├── gemini.ts                       # Gemini API wrapper
│   ├── prisma.ts                       # Database client
│   ├── auth.ts                         # NextAuth config
│   └── constants.ts                    # App constants
│
├── prisma/
│   └── schema.prisma                   # Database schema (5 tables)
│
├── scripts/
│   ├── scrape_tech_news.py             # News scraper
│   └── requirements.txt                # Python dependencies
│
├── .github/workflows/
│   └── scrape.yml                      # Automated scraping (every 6hrs)
│
└── public/                             # Static assets
```

---

## 🗄️ Database Schema

**Platform:** Neon PostgreSQL (serverless)

### Tables (5)

#### 1. `User`
- User accounts (NextAuth)
- Email, name, image
- OAuth support (Google)

#### 2. `DailyNote`
- Personal notes with AI analysis
- Fields: content, headline, summary, keyIdeas, actionItems, themes, sentiment
- Soft delete support
- Created/updated timestamps

#### 3. `TechArticle`
- Aggregated tech news
- Fields: title, url, source, category, summary, publishedAt
- 8 categories: AI/ML, Cloud, Cybersecurity, Web Dev, Federal Tech, DoD Audit, DoD Budget, DoD Update
- Unique constraint on URL (prevents duplicates)

#### 4. `Session` & `VerificationToken`
- NextAuth session management
- JWT-based authentication

**Key Relationships:**
- User → DailyNote (one-to-many)
- User → Session (one-to-many)

---

## 🔧 Technology Stack

### Frontend
- **Framework:** Next.js 15.2.6 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.x
- **Icons:** Lucide React
- **Markdown:** react-markdown

### Backend
- **Runtime:** Node.js (Vercel Edge)
- **API:** Next.js API Routes
- **Authentication:** NextAuth v5 (beta)
- **Database ORM:** Prisma 5.22.0
- **Database:** Neon PostgreSQL (serverless)

### AI & ML
- **Primary Model:** Google Gemini 2.5 Flash
- **Fallback Model:** Gemini 2.5 Flash Lite
- **SDK:** @google/genai v1.41.0 (latest)
- **Capabilities:** Function calling, structured outputs, 1M context

### Automation
- **Scraper:** Python 3.12
- **Libraries:** feedparser, BeautifulSoup4, requests
- **Scheduler:** GitHub Actions (cron)
- **Frequency:** Every 6 hours

### Deployment
- **Hosting:** Vercel (Next.js)
- **Database:** Neon (PostgreSQL)
- **Domain:** shangthing.vercel.app
- **Environment:** Production (serverless)
- **Region:** Washington, D.C. (iad1)

---

## 🚀 Deployment Guide

### Prerequisites
1. **Accounts:**
   - GitHub (code repository)
   - Vercel (hosting)
   - Neon (database)
   - Google AI Studio (Gemini API key)
   - Google Cloud (OAuth credentials)

2. **API Keys:**
   - `GEMINI_API_KEY` - Get from aistudio.google.com
   - `GOOGLE_CLIENT_ID` - OAuth from console.cloud.google.com
   - `GOOGLE_CLIENT_SECRET` - OAuth secret
   - `AUTH_SECRET` - Generate: `openssl rand -base64 32`
   - `SCRAPER_TOKEN` - Generate: `openssl rand -hex 32`

3. **Database:**
   - `DATABASE_URL` - Pooled connection (from Neon)
   - `DATABASE_URL_UNPOOLED` - Direct connection (for migrations)

---

### Step-by-Step Deployment

#### 1. Clone & Install
```bash
git clone https://github.com/icetonges/mything.git
cd mything
npm install
```

#### 2. Configure Environment Variables

Create `.env.local`:
```bash
# Auth
AUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
OWNER_EMAIL=your@email.com
OWNER_PASSPHRASE=your-passphrase

# Database
DATABASE_URL=postgresql://...@...neon.tech/...?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://...@...neon.tech/...?sslmode=require

# AI
GEMINI_API_KEY=your-gemini-key

# Scraper
SCRAPER_TOKEN=your-random-token

# Email (optional)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=recipient@email.com

# Admin
ADMIN_SECRET=your-admin-secret
```

#### 3. Database Setup
```bash
# Push schema to Neon
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

#### 4. Local Development
```bash
npm run dev
# Open http://localhost:3000
```

#### 5. Deploy to Vercel

**Via Vercel CLI:**
```bash
npm i -g vercel
vercel login
vercel
```

**Via GitHub Integration:**
1. Connect GitHub repo to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy automatically on push

#### 6. Configure GitHub Secrets

For automated scraping, add secrets:
1. Go to GitHub → Settings → Secrets → Actions
2. Add:
   - `GEMINI_API_KEY`
   - `SCRAPER_TOKEN`

#### 7. Verify Deployment

✅ **Check homepage:** https://shangthing.vercel.app  
✅ **Test AI chat:** Click chat widget, ask a question  
✅ **View Tech Pulse:** Should see AI summary + categories  
✅ **Check scraper:** GitHub Actions → "Auto-Scrape Tech News"  

---

## 🛠️ Maintenance Guide

### Daily Operations

#### Monitor Scraper
- **Location:** GitHub → Actions → "Auto-Scrape Tech News"
- **Frequency:** Every 6 hours (12 AM, 6 AM, 12 PM, 6 PM UTC)
- **Expected:** ~44 articles per run, ~3 min execution time
- **Check:** Logs should show "Push ✅ SUCCEEDED"

#### Check Database Health
- **Access:** Archive page (requires login)
- **Monitor:**
  - Database connection: ✅ Configured
  - Auth (NextAuth): ✅ Configured
  - AI (Gemini API): ✅ Configured
  - Scraper Token: ✅ Configured
  - Email: ✅ Configured

---

### Weekly Maintenance

#### 1. Review Article Quality
```bash
# Check latest articles
Open https://shangthing.vercel.app/tech-trends
Filter by category
Verify relevance and quality
```

#### 2. Monitor API Usage
- **Gemini API:** Check usage at aistudio.google.com
- **Free tier:** 1M tokens/day (sufficient for platform)
- **Typical usage:** ~50K tokens/day

#### 3. Database Cleanup (Optional)
```sql
-- Remove articles older than 90 days
DELETE FROM "TechArticle" 
WHERE "publishedAt" < NOW() - INTERVAL '90 days';

-- Vacuum database (in Neon console)
VACUUM ANALYZE;
```

---

### Monthly Updates

#### 1. Dependency Updates
```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update Prisma
npm install prisma@latest @prisma/client@latest
npx prisma generate

# Test locally
npm run build
npm run dev
```

#### 2. Review News Sources
- Check if any RSS feeds are broken
- Add new sources if needed
- Remove dead sources
- Verify scraper success rate

#### 3. AI Model Updates
- Check for new Gemini models
- Update `MODEL_CHAIN` in `lib/gemini.ts` if needed
- Test function calling compatibility

---

### Troubleshooting

#### Scraper Fails
**Symptom:** GitHub Actions shows red X  
**Solution:**
1. Check logs for error message
2. Common issues:
   - RSS feed down → Remove from `RSS_FEEDS`
   - Rate limit → Increase `RATE_LIMIT_SECONDS`
   - Gemini API error → Check `GEMINI_API_KEY`

#### AI Chat Not Working
**Symptom:** "AI temporarily unavailable"  
**Solution:**
1. Verify `GEMINI_API_KEY` in Vercel
2. Check Gemini API usage limits
3. Review Vercel function logs
4. Test with: `curl https://shangthing.vercel.app/api/chat`

#### Tech Pulse Summary Empty
**Symptom:** "Summary unavailable"  
**Solution:**
1. Check if articles exist: `/tech-trends`
2. Verify `GEMINI_API_KEY` configured
3. Clear cache: Change `revalidate` in route.ts
4. Redeploy to force regeneration

#### Database Connection Issues
**Symptom:** Prisma errors in logs  
**Solution:**
1. Check Neon dashboard (project status)
2. Verify `DATABASE_URL` is correct
3. Regenerate Prisma Client: `npx prisma generate`
4. Check connection pooling settings

---

## 📊 File & Folder Groups by Function

### 🎨 User Interface (Frontend)
**Purpose:** What users see and interact with  
**Location:** `app/(public)/`, `app/(private)/`, `components/`

**Key Files:**
- `app/(public)/page.tsx` - Home page with hero, dashboard, Tech Pulse
- `app/(public)/tech-trends/page.tsx` - Article browser with filtering
- `components/home/TechPulsePanel.tsx` - AI summary dashboard
- `components/ai/AIChatWidget.tsx` - Chat interface

**Maintenance:**
- Update content as needed
- Modify styling in Tailwind classes
- Add new pages in `app/` directory

---

### 🤖 AI & Intelligence (Backend Logic)
**Purpose:** AI agents, function calling, summarization  
**Location:** `lib/ai/`, `lib/gemini.ts`, `app/api/chat/`, `app/api/tech-pulse/`

**Key Files:**
- `lib/ai/agent.ts` - Multi-agent orchestration (200 lines)
- `lib/ai/tools.ts` - Function declarations (5 tools)
- `lib/gemini.ts` - Gemini API wrapper with fallback
- `app/api/chat/route.ts` - Chat endpoint
- `app/api/tech-pulse/summary/route.ts` - Summary generation

**Maintenance:**
- Update prompts for better responses
- Add new tools to `TOOL_DECLARATIONS`
- Adjust `MODEL_CHAIN` for new Gemini models
- Monitor token usage and costs

---

### 📰 News Aggregation (Scraper)
**Purpose:** Automated news collection from 22 sources  
**Location:** `scripts/`, `.github/workflows/`

**Key Files:**
- `scripts/scrape_tech_news.py` - Main scraper (227 lines)
- `scripts/requirements.txt` - Python dependencies
- `.github/workflows/scrape.yml` - Automation config
- `app/api/tech-trends/ingest/route.ts` - Data ingestion endpoint

**Maintenance:**
- Add/remove sources in `RSS_FEEDS` dict
- Adjust article limits (`MAX_ARTICLES_PER_FEED`)
- Monitor scraper logs in GitHub Actions
- Update Python dependencies annually

---

### 🗄️ Data Layer (Database & ORM)
**Purpose:** Data persistence and queries  
**Location:** `prisma/`, `lib/prisma.ts`

**Key Files:**
- `prisma/schema.prisma` - Database schema (5 tables)
- `lib/prisma.ts` - Prisma client singleton

**Maintenance:**
- Schema changes: Edit schema.prisma → `npx prisma db push`
- Migrations: `npx prisma migrate dev`
- Generate client: `npx prisma generate`
- Query optimization as data grows

---

### 🔐 Authentication & Security
**Purpose:** User authentication and access control  
**Location:** `lib/auth.ts`, `app/api/auth/`, `middleware.ts`

**Key Files:**
- `lib/auth.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - Auth handlers
- `middleware.ts` - Route protection

**Maintenance:**
- Rotate `AUTH_SECRET` annually
- Update OAuth credentials if Google changes
- Monitor failed login attempts
- Review authorized users

---

### ⚙️ Configuration & Constants
**Purpose:** App-wide settings and constants  
**Location:** `lib/constants.ts`, `lib/navigation.ts`, `.env.local`

**Key Files:**
- `lib/constants.ts` - Owner info, links, credentials
- `lib/navigation.ts` - Nav structure
- `.env.local` / `.env.example` - Environment variables

**Maintenance:**
- Update personal info as needed
- Add new nav items in `navigation.ts`
- Keep `.env.example` in sync with requirements

---

### 📦 Build & Deployment
**Purpose:** Production builds and hosting  
**Location:** Root config files, `.github/`

**Key Files:**
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript settings
- `tailwind.config.ts` - Tailwind customization
- `.github/workflows/scrape.yml` - CI/CD automation

**Maintenance:**
- Update dependencies monthly
- Monitor Vercel build times
- Review GitHub Actions usage
- Optimize bundle size if needed

---

## 🎓 How It All Works Together

### Data Flow: News Aggregation

```
1. GitHub Actions (every 6 hours)
   ↓
2. scripts/scrape_tech_news.py
   - Fetches 22 RSS/HTML feeds
   - Applies 2 articles/source limit
   - Generates AI summaries (Gemini)
   ↓
3. POST /api/tech-trends/ingest
   - Validates SCRAPER_TOKEN
   - Upserts to TechArticle table
   ↓
4. Database (Neon PostgreSQL)
   - Stores ~44 new articles
   - Prevents duplicates by URL
   ↓
5. User Views (cached for 1 hour)
   - /tech-trends → Browse all articles
   - / → Tech Pulse dashboard
```

---

### Data Flow: AI Chat

```
1. User types message in chat widget
   ↓
2. POST /api/chat
   - Receives message + history
   ↓
3. lib/ai/agent.ts → routeToAgent()
   - Analyzes message keywords
   - Routes to appropriate agent
   ↓
4. lib/ai/agent.ts → runAgent()
   - Loads agent config + tools
   - Creates Gemini chat session
   - Iterates up to 3-4 rounds
   ↓
5. Tool Execution (if needed)
   - search_tech_articles()
   - get_recent_notes()
   - save_note()
   - etc.
   ↓
6. Database Queries (via Prisma)
   - Fetches relevant data
   ↓
7. Returns formatted response
   - Markdown rendered in UI
   - Shows agent emoji + name
```

---

### Data Flow: Tech Pulse Summary

```
1. User visits homepage
   ↓
2. TechPulsePanel.tsx loads
   - useEffect → fetch('/api/tech-pulse/summary')
   ↓
3. GET /api/tech-pulse/summary (cached 2 hours)
   - Queries latest 40 articles
   - Groups by category
   ↓
4. Gemini API Call (single request)
   - Generates executive summary
   - Generates AI/ML highlight
   - Generates 8 category highlights
   ↓
5. Returns JSON response
   {
     executiveSummary: "...",
     aiMlHighlight: "...",
     categoryHighlights: {...}
   }
   ↓
6. Renders in UI
   - Gold box: Executive summary
   - Purple box: AI/ML highlight
   - Category tabs with counts
```

---

## 🏅 Achievement Highlights

### Development Efficiency
- ✅ **24-hour build sprint** - Full platform from concept to production
- ✅ **Zero cost** - Free tier usage (Vercel, Neon, GitHub Actions, Gemini)
- ✅ **6,500+ lines** - Comprehensive full-stack implementation
- ✅ **Production-grade** - Error handling, caching, rate limiting

### Technical Excellence
- ✅ **Native function calling** - Not string-based tool use
- ✅ **Model fallback chain** - Automatic retry on failure
- ✅ **Intelligent routing** - Context-aware agent selection
- ✅ **Structured outputs** - Type-safe AI responses
- ✅ **Real-time updates** - Serverless architecture

### Content Quality
- ✅ **22 verified sources** - Manually curated, no spam
- ✅ **8 categories** - Comprehensive tech coverage
- ✅ **AI-powered summaries** - Professional, concise
- ✅ **Dedicated AI/ML focus** - Specialized attention for LLMs

### User Experience
- ✅ **Clean design** - Modern, professional UI
- ✅ **Fast loading** - Optimized bundle, cached data
- ✅ **Mobile responsive** - Works on all devices
- ✅ **Accessible** - Semantic HTML, ARIA labels

---

## 📝 Credits & Acknowledgments

### Built By
**Peter Shang** - Full-Stack Developer, Data Scientist, Federal Financial Manager
- LinkedIn: [linkedin.com/in/petershang](https://linkedin.com/in/petershang)
- GitHub: [github.com/icetonges](https://github.com/icetonges)
- Portfolio: [petershang.vercel.app](https://petershang.vercel.app)

### AI Assistant
**Claude Sonnet 4.5** (Anthropic) - Code generation, architecture, documentation

### Technologies
- **Next.js** - Vercel
- **Gemini API** - Google DeepMind
- **Neon** - Serverless PostgreSQL
- **Prisma** - Database ORM
- **Tailwind CSS** - Styling framework

### Special Thanks
- Andrew Ng (The Batch newsletter)
- Hugging Face, OpenAI, Anthropic, Google AI (AI/ML news)
- DefenseScoop, C4ISRNET, Breaking Defense (DoD coverage)
- DoD IG, GAO (Government accountability)

---

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Mobile app (React Native)
- [ ] Email digest (daily/weekly summaries)
- [ ] Advanced search (vector embeddings)
- [ ] Article bookmarking
- [ ] Custom RSS feed export
- [ ] Multi-user support
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Webhook integrations

### Potential Improvements
- [ ] GraphQL API layer
- [ ] Redis caching
- [ ] Elasticsearch for full-text search
- [ ] Real-time updates (WebSockets)
- [ ] Dark mode toggle
- [ ] i18n (internationalization)
- [ ] PWA support
- [ ] Voice interface

---

## 📞 Support & Contact

**Issues:** [GitHub Issues](https://github.com/icetonges/mything/issues)  
**Email:** icetonges@gmail.com  
**Platform:** [shangthing.vercel.app](https://shangthing.vercel.app)

---

**Last Updated:** February 18, 2026  
**Version:** 1.0.0  
**Status:** Production 🚀
