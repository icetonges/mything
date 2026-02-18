# MyThing Platform - Quick Reference Guide

## 🎯 Essential Commands

### Development
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npx prisma studio              # Open Prisma Studio
npx prisma db push             # Push schema changes
npx prisma generate            # Regenerate client
npx prisma migrate dev         # Create migration
```

### Deployment
```bash
vercel                         # Deploy to Vercel
vercel env pull .env.local     # Pull environment variables
git push                       # Auto-deploy (if connected)
```

---

## 📁 Key File Locations

### Must-Know Files
```
lib/ai/agent.ts              → Multi-agent system core
lib/ai/tools.ts              → Function declarations
lib/gemini.ts                → Gemini API wrapper
scripts/scrape_tech_news.py  → News scraper
app/api/chat/route.ts        → Chat endpoint
app/api/tech-pulse/summary/route.ts → AI summary
```

### Configuration
```
.env.local                   → Environment variables
prisma/schema.prisma         → Database schema
next.config.ts               → Next.js config
tailwind.config.ts           → Tailwind config
```

---

## 🔧 Common Tasks

### Add a New News Source
1. Open `scripts/scrape_tech_news.py`
2. Add to `RSS_FEEDS` dict under appropriate category
3. Test locally: `python scripts/scrape_tech_news.py`
4. Commit and push

### Create a New AI Agent
1. Open `lib/ai/agent.ts`
2. Add to `AGENTS` object with config
3. Add routing logic to `routeToAgent()`
4. Test in chat widget

### Add a New Tool/Function
1. Open `lib/ai/tools.ts`
2. Add function declaration to `TOOL_DECLARATIONS`
3. Add handler to `TOOL_HANDLERS`
4. Test with agent

### Update AI Prompts
1. **Chat:** `lib/ai/agent.ts` → `AGENTS[agentId].systemPrompt`
2. **Summary:** `app/api/tech-pulse/summary/route.ts` → `prompt` variable
3. **Scraper:** `scripts/scrape_tech_news.py` → `summarize()` function

---

## 🐛 Quick Troubleshooting

### Scraper Not Working
```bash
# Check logs
GitHub → Actions → Latest run → View logs

# Test locally
cd scripts
pip install -r requirements.txt
python scrape_tech_news.py

# Common fix
# Add missing dependency to scripts/requirements.txt
```

### AI Chat Fails
```bash
# Check environment variable
echo $GEMINI_API_KEY  # Should not be empty

# Test Gemini API
curl https://generativelanguage.googleapis.com/v1beta/models \
  -H "x-goog-api-key: YOUR_KEY"

# Verify in Vercel
Vercel Dashboard → Settings → Environment Variables
```

### Database Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (CAREFUL - deletes data)
npx prisma db push --force-reset

# Check connection
npx prisma studio
```

### Build Fails
```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run build 2>&1 | grep error
```

---

## 📊 Monitoring Checklist

### Daily
- [ ] Scraper ran successfully (GitHub Actions)
- [ ] AI chat responding (test on homepage)
- [ ] Tech Pulse summary generated
- [ ] New articles appearing in /tech-trends

### Weekly
- [ ] Review scraper logs for errors
- [ ] Check Gemini API usage (aistudio.google.com)
- [ ] Verify article quality in Tech Trends
- [ ] Test all 4 AI agents

### Monthly
- [ ] Update npm dependencies
- [ ] Review and clean database (optional)
- [ ] Check for broken RSS feeds
- [ ] Test new Gemini models

---

## 🔑 Important URLs

### Production
- **Homepage:** https://shangthing.vercel.app
- **Tech Trends:** https://shangthing.vercel.app/tech-trends
- **Archive:** https://shangthing.vercel.app/archive (auth required)

### Admin/Dev
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Neon Console:** https://console.neon.tech
- **GitHub Actions:** https://github.com/icetonges/mything/actions
- **Google AI Studio:** https://aistudio.google.com

### Documentation
- **Gemini API:** https://ai.google.dev/gemini-api/docs
- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs

---

## 💡 Pro Tips

### Performance
- Use `revalidate` in API routes for caching
- Keep function declarations minimal
- Limit scraper to 2 articles per source
- Use Vercel Edge Functions for fast responses

### Debugging
- Check Vercel function logs (Dashboard → Deployments → Functions)
- Use `console.log()` liberally, check in logs
- Test API endpoints with curl or Postman
- Enable verbose logging in scraper

### Maintenance
- Keep dependencies updated (security)
- Monitor Gemini API usage (avoid overages)
- Review scraper success rate weekly
- Archive old articles (90+ days)

---

## 📞 Getting Help

1. **Check documentation:** `MYTHING-PLATFORM-DOCUMENTATION.md`
2. **Review error logs:** Vercel Dashboard or GitHub Actions
3. **Test locally:** `npm run dev` and debug
4. **GitHub Issues:** For bugs and feature requests

---

**Quick wins for common issues:**
- Scraper fails → Check `beautifulsoup4` in requirements.txt
- Chat not working → Verify `GEMINI_API_KEY`
- No summary → Check if articles exist, clear cache
- Build error → Clear `.next` folder, reinstall dependencies
