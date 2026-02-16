# MyThing — Deployment Guide
**Step-by-step setup for local development and Vercel production**

> **Time to complete:** ~45 minutes for first-time setup  
> **Skill level:** Basic terminal + web console familiarity  
> **Platform:** macOS / Windows (WSL) / Linux

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Get the Code](#2-get-the-code)
3. [Set Up the Database (Neon)](#3-set-up-the-database-neon)
4. [Set Up Google OAuth](#4-set-up-google-oauth)
5. [Set Up Gemini AI API Key](#5-set-up-gemini-ai-api-key)
6. [Set Up Gmail SMTP](#6-set-up-gmail-smtp)
7. [Configure Environment Variables](#7-configure-environment-variables)
8. [Run Locally](#8-run-locally)
9. [Deploy to Vercel](#9-deploy-to-vercel)
10. [Post-Deployment: Verify Everything Works](#10-post-deployment-verify-everything-works)
11. [Set Up the Tech News Scraper](#11-set-up-the-tech-news-scraper)
12. [Day-to-Day Maintenance](#12-day-to-day-maintenance)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Prerequisites

Before starting, make sure you have these installed on your local machine.

### Required Software

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | 18.17+ (LTS) | https://nodejs.org → Download LTS |
| **npm** | 9+ (comes with Node) | Included with Node.js |
| **Git** | Any recent version | https://git-scm.com |
| **Python** | 3.10+ (for scraper only) | https://python.org |

**Verify your installs:**
```bash
node --version    # Should show v18.x or higher
npm --version     # Should show 9.x or higher
git --version     # Any version is fine
python3 --version # Should show 3.10 or higher
```

### Required Accounts (all free)

| Service | Purpose | Sign Up |
|---------|---------|---------|
| **GitHub** | Code hosting + CI/CD | https://github.com |
| **Vercel** | Deployment + hosting | https://vercel.com (use GitHub login) |
| **Neon** | PostgreSQL database | https://neon.tech (free tier) |
| **Google Cloud** | OAuth + Gemini API | https://console.cloud.google.com |
| **Gmail** | Email notifications | Already have: icetonges@gmail.com |

---

## 2. Get the Code

### Option A — From the zip file (what you have now)

```bash
# 1. Unzip the package
unzip mything-complete.zip
cd mything

# 2. Install all Node dependencies
npm install

# 3. Confirm structure looks right
ls app/ lib/ prisma/ scripts/ components/
```

### Option B — Create a new GitHub repo and push

```bash
cd mything

# Initialize git
git init
git add .
git commit -m "Initial commit — MyThing platform"

# Create repo on GitHub (do this at github.com first), then:
git remote add origin https://github.com/icetonges/mything.git
git branch -M main
git push -u origin main
```

> **Tip:** Keep the GitHub repo private for now — it contains your project structure. You can make it public later if desired.

---

## 3. Set Up the Database (Neon via Vercel)

MyThing uses **Neon** — a serverless PostgreSQL database. The recommended approach is
to create it directly from the Vercel dashboard, which automatically injects all
connection variables into your project. No manual copying of connection strings needed.

---

### ✅ If you already see these variables in Vercel → you are done with this step

If your Vercel project's **Settings → Environment Variables** already shows these entries,
Neon is already connected and all database variables are already set:

| Variable already present | Maps to |
|--------------------------|---------|
| `DATABASE_URL` | Pooled connection — used by Prisma in production |
| `DATABASE_URL_UNPOOLED` | Direct connection — used by Prisma migrations |
| `POSTGRES_URL` | Alias — same as DATABASE_URL |
| `POSTGRES_HOST` | Database host |
| `POSTGRES_USER` | Database user |
| `POSTGRES_DATABASE` | Database name |
| `PGUSER` | Alias for POSTGRES_USER |
| `NEON_PROJECT_ID` | Your Neon project identifier |

**You do not need to copy or create any of these manually.** Skip to Step 3.3 to get
the two values you need for your local `.env.local` file.

---

### Step 3.1 — Create Neon database from Vercel (if not done yet)

> Skip this step if variables already appear in your Vercel project (see above).

1. Go to your Vercel project dashboard
2. Click the **"Storage"** tab in the top navigation
3. Click **"Create Database"**
4. Select **"Postgres (Neon)"** → click **Continue**
5. Choose a region close to you (e.g., `us-east-1` for DC area)
6. Click **"Create"**

Vercel automatically creates the Neon project and injects all the environment variables
shown above into your project. No Neon account setup or manual credential copying needed.

### Step 3.2 — Verify variables are set

After creation (or if already set):

1. Go to Vercel → your project → **Settings → Environment Variables**
2. Confirm you see at minimum: `DATABASE_URL` and `DATABASE_URL_UNPOOLED`
3. Both should show **"All Environments"** — meaning they apply to Production, Preview, and Development

### Step 3.3 — Get values for your local `.env.local`

Your local machine needs these two database variables. Here is how to get them:

**Method A — Copy directly from Vercel (easiest)**

1. Go to Vercel → your project → **Settings → Environment Variables**
2. Find `DATABASE_URL` → click the **eye icon** to reveal the value → copy it
3. Find `DATABASE_URL_UNPOOLED` → reveal → copy it
4. Paste both into your local `.env.local` file (Step 7)

**Method B — Use Vercel CLI to pull all env vars at once**

```bash
# Install Vercel CLI if you don't have it
npm install -g vercel

# Link your local project to Vercel
vercel link

# Pull all environment variables into .env.local automatically
vercel env pull .env.local
```

This pulls every variable from Vercel into your `.env.local` in one command — the
fastest way to set up your local environment. You still need to add any variables
that are NOT in Vercel yet (like `NEXTAUTH_SECRET`, `GEMINI_API_KEY`, etc.).

> **What the two strings look like** (for reference):
> ```
> DATABASE_URL=postgresql://neondb_owner:AbCdEfGh@ep-name-123.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true
> DATABASE_URL_UNPOOLED=postgresql://neondb_owner:AbCdEfGh@ep-name-123.us-east-1.aws.neon.tech/neondb?sslmode=require
> ```
> The difference: `DATABASE_URL` has `&pgbouncer=true` at the end (connection pooling for serverless).
> `DATABASE_URL_UNPOOLED` does not — used for direct schema migrations.

---

## 4. Set Up Google OAuth

This is how you (as owner) log in to access private spaces (Notes, Archive, Family).

### Step 4.1 — Create a Google Cloud project

1. Go to **https://console.cloud.google.com**
2. Click the project dropdown at the top → **"New Project"**
3. Name it: `mything` → Click **Create**
4. Make sure the new project is selected in the dropdown

### Step 4.2 — Enable the required API

> **Note:** Google+ API is deprecated and removed from the console. You do NOT need to
> enable any APIs manually for basic Google sign-in with NextAuth. The OAuth2 and
> OpenID Connect scopes (email, profile) are built-in and require no Library setup.

**Skip this step entirely** — go directly to Step 4.3 to create credentials.

The only case where you would visit APIs & Services → Library is if you later want to
access additional Google APIs (Drive, Calendar, etc.) beyond basic login. For MyThing
sign-in only, nothing needs to be enabled.

### Step 4.3 — Set up the OAuth Consent Screen (Branding)

Google now calls this section **"Google Auth Platform"** or **"OAuth consent screen"**
depending on your console version.

1. In the left menu go to: **APIs & Services → OAuth consent screen**  
   *(Some accounts now show this as: **Google Auth Platform → Branding**)*
2. If asked "How do you want to configure your app?", select **External** → click **Create**
3. Fill in the form:
   - **App name:** `MyThing`
   - **User support email:** `icetonges@gmail.com`
   - **App logo:** optional — skip for now
   - **Developer contact email:** `icetonges@gmail.com`
4. Click **Save and Continue**
5. On **Scopes** step: click **Save and Continue** (no changes needed — NextAuth handles scopes)
6. On **Test users** step:
   - Click **"+ Add Users"**
   - Add: `icetonges@gmail.com`
   - Click **Save and Continue**
7. Click **Back to Dashboard**

> **Publishing status:** Leave the app in **"Testing"** mode — since only your email is
> in the test users list, only you can log in. This is exactly what you want for a
> personal private platform. No verification needed.

### Step 4.4 — Create OAuth Client ID credentials

1. In the left menu: **APIs & Services → Credentials**
2. Click **"+ Create Credentials"** at the top → select **"OAuth Client ID"**
3. Fill in:
   - **Application type:** Web application
   - **Name:** `MyThing Web`
4. Under **Authorized JavaScript origins** click **"+ Add URI"** and add both:
   ```
   http://localhost:3000
   https://shangthing.vercel.app
   ```
5. Under **Authorized redirect URIs** click **"+ Add URI"** and add both:
   ```
   http://localhost:3000/api/auth/callback/google
   https://shangthing.vercel.app/api/auth/callback/google
   ```
6. Click **Create**

### Step 4.5 — Save your credentials

> **Important change as of 2025:** Google only shows the Client Secret **once** at
> creation time. Copy it immediately — you cannot retrieve it again later (you can
> only create a new one).

A popup appears titled **"OAuth client created"**:
- **Client ID** → copy this (looks like `123456789-abc.apps.googleusercontent.com`)
- **Client Secret** → copy this (looks like `GOCSPX-AbCdEfGh`)

Save both somewhere secure before clicking OK. They go into your `.env.local` in Step 7.

---

## 5. Set Up Gemini AI API Key

The AI assistant, note summarization, and tech article summaries all use Google's Gemini API.

### Step 5.1 — Get your API key

1. Go to **https://aistudio.google.com**
2. Sign in with your Google account (`icetonges@gmail.com`)
3. Click **"Get API key"** in the top navigation
4. Click **"Create API key"**
5. Choose the **"mything"** Google Cloud project you created in Step 4
6. Copy the key (looks like `AIzaSyAbCdEfGhIjKlMnOpQr`)

### Step 5.2 — Verify free tier limits

- **Free tier:** 15 requests/minute, 1 million tokens/day for Gemini 1.5 Flash
- **Gemini 2.5 Flash:** May require enabling billing — start with the free tier and upgrade if needed
- The app's model fallback chain automatically drops to free-tier models if the latest model is unavailable

> **No billing required to start.** The fallback chain ensures the app always works even on the free tier.

---

## 6. Set Up Gmail SMTP

This allows the contact form to email you whenever someone sends a message.

### Step 6.1 — Enable 2-Factor Authentication (required)

1. Go to **https://myaccount.google.com/security**
2. Under "How you sign in to Google," click **"2-Step Verification"**
3. Follow the steps to enable it (if not already enabled)

### Step 6.2 — Create an App Password

> Regular Gmail passwords don't work for SMTP. You need an "App Password."

1. Go to **https://myaccount.google.com/apppasswords**
2. You may need to re-authenticate
3. Under "Select app" choose **"Mail"**
4. Under "Select device" choose **"Other (Custom name)"** → type `MyThing`
5. Click **"Generate"**
6. Copy the 16-character password shown (e.g., `abcd efgh ijkl mnop`)
7. **Remove the spaces** when saving — use it as: `abcdefghijklmnop`

> This password only needs to be generated once. Store it securely.

---

## 7. Configure Environment Variables

### Step 7.1 — Generate a secure NextAuth secret

> **Windows users:** `openssl` is not installed by default on Windows.
> Use the Node.js commands below — Node is already on your machine since you have npm.

**On Windows (PowerShell) — use Node.js:**
```powershell
# NEXTAUTH_SECRET (base64, 32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# ADMIN_SECRET (hex, 24 bytes) — run this once
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"

# SCRAPER_TOKEN (hex, 24 bytes) — run this again for a different value
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

**On Mac/Linux — use openssl:**
```bash
openssl rand -base64 32   # NEXTAUTH_SECRET
openssl rand -hex 24      # ADMIN_SECRET
openssl rand -hex 24      # SCRAPER_TOKEN
```

**Alternative for all platforms — PowerShell built-in (no Node needed):**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Copy each output and save it — you will paste these into `.env.local` in the next step.

### Step 7.2 — Create your local `.env.local` file

**Fastest method — Pull from Vercel automatically (recommended):**
```bash
cd mything
npm install -g vercel       # install Vercel CLI if not already installed
vercel link                  # connect your local folder to the Vercel project
vercel env pull .env.local   # pulls DATABASE_URL and all Neon vars automatically
```
This pre-fills your `.env.local` with all the database variables already in Vercel.
Then open the file and add the remaining entries that Vercel doesn't hold yet
(NEXTAUTH_SECRET, Google, Gemini, Email, Admin secrets).

**Manual method — Copy from template:**
```bash
cd mything
cp .env.example .env.local
```

Open `.env.local` in your editor and fill in every value:

```env
# ─── App ──────────────────────────────────────────────────────────────
NEXTAUTH_SECRET=<paste the openssl output from step 7.1>
NEXTAUTH_URL=http://localhost:3000

# ─── Auth — Google OAuth ───────────────────────────────────────────────
GOOGLE_CLIENT_ID=<paste from Step 4.4>
GOOGLE_CLIENT_SECRET=<paste from Step 4.4>
OWNER_EMAIL=icetonges@gmail.com
OWNER_PASSPHRASE=<choose a strong passphrase you'll remember>

# ─── Database ──────────────────────────────────────────────────────────
DATABASE_URL=<paste pooled connection string from Step 3.2>
DATABASE_URL_UNPOOLED=<paste direct connection string from Step 3.2>

# ─── AI ────────────────────────────────────────────────────────────────
GEMINI_API_KEY=<paste from Step 5.1>

# ─── Email — Gmail SMTP ────────────────────────────────────────────────
EMAIL_USER=icetonges@gmail.com
EMAIL_PASS=<paste 16-char app password from Step 6.2, no spaces>
EMAIL_TO=icetonges@gmail.com

# ─── Security ──────────────────────────────────────────────────────────
ADMIN_SECRET=<paste first openssl hex from step 7.1>
SCRAPER_TOKEN=<paste second openssl hex from step 7.1>
```

> **Important:** `.env.local` is already in `.gitignore` — it will never be committed to GitHub. This is intentional and correct.

---

## 8. Run Locally

With environment variables configured, you can now run the full app on your machine.

### Step 8.1 — Push the database schema

This creates all the tables (daily_notes, tech_articles, contacts, etc.) in your Neon database:

```bash
npm run db:push
```

Expected output:
```
Environment variables loaded from .env.local
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "mything" ...
✔  Generated Prisma Client
The database is now in sync with your Prisma schema.
```

> If you see a connection error, double-check your `DATABASE_URL` value in `.env.local`.

### Step 8.2 — Start the development server

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 15.1.0 (Turbopack)
  - Local:        http://localhost:3000
  - Ready in 892ms
```

### Step 8.3 — Open the app

Open your browser and go to: **http://localhost:3000**

You should see the MyThing home page with dark mode active.

### Step 8.4 — Test each feature locally

Work through this checklist:

```
□ Home page loads with hero, tab cards, contact form
□ Click "Tech Trends" → page loads (empty state is fine)
□ Click "My Work" → projects show correctly
□ Click "AI & ML" → certifications and concepts visible
□ Click "Federal Finance" → budget lifecycle and policy cards visible
□ Click "Daily Notes" → redirects to /login (auth working)
□ Click "Login" → Google OAuth button visible + passphrase field visible
□ Log in with Google (icetonges@gmail.com) OR enter your passphrase
□ After login → /notes page loads with split-pane editor
□ Type a test note → click "Save & Analyze" → AI summary appears
□ Click "Archive" → note appears in timeline
□ Click "Family Space" → math helper and note pad visible
□ Test contact form → check Gmail for notification email
□ Test AI chat widget → floating button bottom-right → ask a question
```

### Step 8.5 — Inspect the database (optional)

```bash
npm run db:studio
```

This opens **Prisma Studio** at `http://localhost:5555` — a visual browser for your database where you can see all tables and records.

---

## 9. Deploy to Vercel

### Step 9.1 — Push code to GitHub

If you haven't already:
```bash
git add .
git commit -m "MyThing v1.0 — ready for deployment"
git push origin main
```

### Step 9.2 — Import project into Vercel

1. Go to **https://vercel.com** → Log in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find your `mything` repository → click **"Import"**
4. Vercel auto-detects Next.js — leave all settings as default
5. **Do NOT click Deploy yet** — you need to set environment variables first

### Step 9.3 — Add environment variables in Vercel

> **Important:** DATABASE_URL and all Neon/Postgres variables are already in Vercel
> from when you connected the database (Step 3). You do NOT need to add those again.
> Only add the variables listed below.

**Where to find the Environment Variables screen:**

- If you are on the **Import screen** (before first deploy):
  Scroll down → click **"Environment Variables"** to expand the section

- If your project is **already deployed**:
  Vercel Dashboard → click your project → **Settings** tab → **Environment Variables**
  in the left sidebar → click **"Add Environment Variable"**

---

**How to add each variable (repeat for each one):**

1. Click **"Add"** or **"Add Environment Variable"**
2. In the **Name** field: type the variable name exactly as shown (all caps)
3. In the **Value** field: paste your value
4. Under **Environments**: leave all three checked ✅ Production ✅ Preview ✅ Development
5. Click **Save**

---

**Variables to add one by one:**

#### Group 1 — Auth (4 variables)

| # | Name | Value | Where to get it |
|---|------|-------|----------------|
| 1 | `NEXTAUTH_SECRET` | Long random string | Run in terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| 2 | `NEXTAUTH_URL` | `https://shangthing.vercel.app` | Type this exactly — use YOUR actual Vercel domain |
| 3 | `GOOGLE_CLIENT_ID` | `123456789-abc.apps.googleusercontent.com` | From Google Cloud Console → Credentials (Step 4.5) |
| 4 | `GOOGLE_CLIENT_SECRET` | `GOCSPX-AbCdEfGh...` | From Google Cloud Console → Credentials (Step 4.5) |

#### Group 2 — Owner Identity (2 variables)

| # | Name | Value | Notes |
|---|------|-------|-------|
| 5 | `OWNER_EMAIL` | `icetonges@gmail.com` | Must match your Google login email exactly |
| 6 | `OWNER_PASSPHRASE` | Your chosen passphrase | The backup login password you set locally |

#### Group 3 — AI (1 variable)

| # | Name | Value | Where to get it |
|---|------|-------|----------------|
| 7 | `GEMINI_API_KEY` | `AIzaSy...` | From https://aistudio.google.com → Get API Key (Step 5.1) |

#### Group 4 — Email / Gmail SMTP (3 variables)

| # | Name | Value | Notes |
|---|------|-------|-------|
| 8 | `EMAIL_USER` | `icetonges@gmail.com` | Your Gmail address |
| 9 | `EMAIL_PASS` | 16-character app password | From Google Account → Security → App Passwords (Step 6.2). No spaces. |
| 10 | `EMAIL_TO` | `icetonges@gmail.com` | Where contact form submissions are sent |

#### Group 5 — Security tokens (2 variables)

| # | Name | Value | Where to get it |
|---|------|-------|----------------|
| 11 | `ADMIN_SECRET` | Random hex string | Run: `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"` |
| 12 | `SCRAPER_TOKEN` | Different random hex string | Run the same command again for a different value |

---

**✅ Skip these — already set automatically by Vercel Neon integration:**

These are already in your project from Step 3. Do NOT add them again:
`DATABASE_URL` · `DATABASE_URL_UNPOOLED` · `POSTGRES_URL` · `POSTGRES_HOST` ·
`POSTGRES_USER` · `POSTGRES_DATABASE` · `PGUSER` · `NEON_PROJECT_ID` ·
`POSTGRES_URL_NO_SSL` · `POSTGRES_URL_NON_POOLING` · `NEON_AUTH_BASE_URL`

---

**After adding all 12 variables, verify the list looks right:**

Go to **Settings → Environment Variables** and confirm you see entries for all 12 names
above (in addition to the Neon variables already there). The values will be hidden
(shown as dots) — that is normal and correct.

> **Tip:** If you need to edit a value after saving, click the **⋯** (three dots) menu
> on the right side of any variable row → **Edit**.

### Step 9.4 — Deploy

Click **"Deploy"**. Vercel will:
1. Clone your repository
2. Run `npm install`
3. Run `npm run build`
4. Deploy to a global CDN

Watch the build log. A successful build looks like:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (12/12)
✓ Finalizing page optimization
Route (app)                    Size    First Load JS
├ ○ /                         8.5 kB      120 kB
├ ○ /tech-trends              4.2 kB      116 kB
...
```

### Step 9.5 — Set your custom domain (optional)

By default, your app is at `mything-[random].vercel.app`.

To get `shangthing.vercel.app` exactly:
1. In Vercel → Project → **Settings → Domains**
2. Add `shangthing.vercel.app`
3. Vercel will confirm availability (this exact subdomain must not be taken)

### Step 9.6 — Update Google OAuth for production

Go back to **Google Cloud Console → APIs & Services → Credentials → your OAuth client**.

Confirm these are already added (you should have done this in Step 4.3):
- Authorized JavaScript origins: `https://shangthing.vercel.app`
- Authorized redirect URIs: `https://shangthing.vercel.app/api/auth/callback/google`

If not, add them now and click **Save**.

### Step 9.7 — Verify database schema in production

After deployment, visit this URL in your browser to confirm the database is connected:

```
https://shangthing.vercel.app/api/db-setup?secret=YOUR_ADMIN_SECRET
```

Replace `YOUR_ADMIN_SECRET` with the value you set. Expected response:
```json
{ "status": "ok", "notes": 0, "articles": 0, "contacts": 0 }
```

If you see an error, check your `DATABASE_URL` in Vercel environment variables.

---

## 10. Post-Deployment: Verify Everything Works

Run this checklist on your live production URL:

```
□ https://shangthing.vercel.app loads correctly
□ Dark mode is default (no flash on load)
□ All 5 public tabs navigate correctly
□ Theme toggle works (dark ↔ light)
□ AI chat widget opens and responds
□ Contact form submits → you receive email at icetonges@gmail.com
□ Clicking "Daily Notes" → redirects to /login
□ Google login works with icetonges@gmail.com
□ Passphrase login works
□ After login: Notes page opens
□ Write and save a note → AI summary appears
□ Archive shows the saved note with its auto-generated slug URL
□ /api/db-setup?secret=... returns { "status": "ok" }
```

---

## 11. Set Up the Tech News Scraper

The Python scraper populates your Tech Trends page with daily AI-summarized articles.

### Option A — Run manually from your local machine

```bash
# Install Python dependencies
pip install feedparser requests google-generativeai python-dateutil

# Set environment variables (Mac/Linux)
export GEMINI_API_KEY=your_gemini_key
export SCRAPER_TOKEN=your_scraper_token
export SITE_URL=https://shangthing.vercel.app

# Run the scraper
python scripts/scrape_tech_news.py
```

On Windows:
```cmd
set GEMINI_API_KEY=your_gemini_key
set SCRAPER_TOKEN=your_scraper_token
set SITE_URL=https://shangthing.vercel.app
python scripts/scrape_tech_news.py
```

After running, visit `/tech-trends` to see articles populated.

### Option B — Automate with GitHub Actions (recommended)

This runs the scraper every day at 8 AM UTC automatically — no manual work needed.

**Step 11.1 — Add secrets to your GitHub repository**

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Click **"New repository secret"** and add each:

| Secret Name | Value |
|-------------|-------|
| `GEMINI_API_KEY` | Your Gemini API key |
| `SCRAPER_TOKEN` | Your scraper token (same as in `.env.local`) |

**Step 11.2 — Push the workflow file**

The workflow file is already created at `.github/workflows/scrape.yml`. Make sure it's committed and pushed:

```bash
git add .github/workflows/scrape.yml
git commit -m "Add automated scraper workflow"
git push origin main
```

**Step 11.3 — Test the workflow manually**

1. Go to your GitHub repo → **Actions** tab
2. Click **"Auto-Scrape Tech News"** in the left sidebar
3. Click **"Run workflow"** → **"Run workflow"** (green button)
4. Watch the run complete (~2-3 minutes)
5. Visit `/tech-trends` to confirm articles appeared

After this, the scraper runs automatically every day at 8 AM UTC (4 AM ET).

---

## 12. Day-to-Day Maintenance

### Adding a new tab or page

Edit exactly **one file** — `lib/navigation.ts`:

```typescript
// Add this entry to NAV_ITEMS array:
{
  label: 'New Tab',
  href: '/new-tab',
  access: 'public',    // or 'private'
  icon: 'Star',        // any lucide-react icon name
  description: 'What this tab is about',
  color: 'indigo',
  enabled: true,
},
```

Then create the page file: `app/(public)/new-tab/page.tsx`

The navbar, footer, home page cards, and middleware all update automatically.

### Adding a new project to My Work

Edit `lib/projects.ts` — add one entry to the `PROJECTS` array:

```typescript
{
  id: 'my-new-project',
  title: 'Project Title',
  description: 'What this project does.',
  category: 'data-science',  // federal-finance | data-science | ai-ml | full-stack
  tech: ['Python', 'Pandas'],
  links: [{ label: 'GitHub', url: 'https://github.com/...' }],
  featured: true,
  year: 2026,
},
```

Deploy with `git push` — Vercel rebuilds automatically.

### Updating contact information or links

Edit `lib/constants.ts` — change the `LINKS` or `OWNER` objects. All pages that use these values update automatically.

### Updating environment variables

1. Go to **Vercel → Project → Settings → Environment Variables**
2. Find the variable → click the three-dot menu → **Edit**
3. After saving, **redeploy** for the change to take effect:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

### Monitoring and logs

- **Vercel Function Logs:** Vercel dashboard → Project → **Functions** tab → click any route to see logs
- **Database:** Run `npm run db:studio` locally to browse tables
- **Scraper:** GitHub → Actions tab → click any run to see output

---

## 13. Troubleshooting

### "Module not found" or import errors after `npm install`

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Database connection error (`P1001` or `P1002`)

1. Check `DATABASE_URL` in `.env.local` — ensure no line breaks or extra spaces
2. Verify Neon project is not paused (free tier pauses after inactivity):
   - Go to https://neon.tech → your project → click **"Resume"** if shown
3. Re-run `npm run db:push` to confirm schema sync

### Google login redirects to error page

- Check that `NEXTAUTH_URL` exactly matches your actual URL (no trailing slash)
- Verify the redirect URI in Google Cloud Console exactly matches (including `http` vs `https`)
- For local: must be `http://localhost:3000` (not `127.0.0.1`)
- For production: must be `https://shangthing.vercel.app`

### AI chat returns "temporarily unavailable"

1. Verify `GEMINI_API_KEY` is set correctly in `.env.local`
2. Check Gemini API quotas at https://aistudio.google.com — free tier is 15 req/min
3. The fallback chain will use `gemini-1.5-flash` if newer models are unavailable — this is normal

### Contact form emails not arriving

1. Verify `EMAIL_PASS` has no spaces (Gmail app passwords are displayed with spaces but stored without)
2. Check spam folder
3. Verify 2FA is still active on the Gmail account — app passwords stop working if 2FA is disabled
4. Test by visiting `/api/db-setup?secret=YOUR_SECRET` — if contacts table count increases after a form submit, the DB is fine but email is failing

### Build fails on Vercel with "Type error"

```bash
# Run TypeScript check locally first
npx tsc --noEmit

# Fix any errors shown, then push again
git add .
git commit -m "Fix TypeScript errors"
git push
```

### Scraper fails with "connection refused"

- Verify `SITE_URL` does not have a trailing slash
- Verify `SCRAPER_TOKEN` in GitHub Secrets matches exactly the one in Vercel env vars
- Check the scraper log in GitHub Actions for specific error messages

### Private pages accessible without login

- Verify `middleware.ts` exists in the project root (not inside `/app`)
- Verify `NEXTAUTH_SECRET` is set in Vercel environment variables
- Redeploy after adding the secret: `git commit --allow-empty -m "force redeploy" && git push`

---

## Quick Reference Card

```
LOCAL DEVELOPMENT
─────────────────────────────────────
Start dev server:   npm run dev
View at:            http://localhost:3000
Database browser:   npm run db:studio (http://localhost:5555)
Sync schema:        npm run db:push
Run scraper:        python scripts/scrape_tech_news.py
TypeScript check:   npx tsc --noEmit

ENVIRONMENT FILES
─────────────────────────────────────
Local:       .env.local          ← never committed
Production:  Vercel dashboard → Settings → Environment Variables

KEY URLS
─────────────────────────────────────
Live site:          https://shangthing.vercel.app
DB health check:    https://shangthing.vercel.app/api/db-setup?secret=YOUR_ADMIN_SECRET
Neon console:       https://console.neon.tech
Vercel dashboard:   https://vercel.com/dashboard
Google Cloud:       https://console.cloud.google.com
Gemini Studio:      https://aistudio.google.com

ADDING CONTENT (one-file edits)
─────────────────────────────────────
New tab:            lib/navigation.ts  → add to NAV_ITEMS
New project:        lib/projects.ts    → add to PROJECTS array
New link:           lib/constants.ts   → update LINKS object
New page content:   edit the page tsx file directly
```

---

*MyThing Deployment Guide v1.0*  
*Xiaobing (Peter) Shang | AI Enabler | shangthing.vercel.app*
