#!/usr/bin/env python3
"""
MyThing Tech News Scraper - Enhanced February 2026
Fetches RSS feeds, generates AI summaries, pushes to shangthing.vercel.app

ENHANCED: Premium AI/ML sources (LLM, Agentic AI, Applied AI)
ENHANCED: Premium DoD sources (DefenseScoop, C4ISRNET, DoD IG)
KEPT: All existing categories

Usage:
  pip install feedparser requests google-generativeai python-dateutil beautifulsoup4
  python scripts/scrape_tech_news.py

Environment variables:
  GEMINI_API_KEY  — Google AI Studio key
  SCRAPER_TOKEN   — Matches SCRAPER_TOKEN in Vercel env
  SITE_URL        — e.g. https://shangthing.vercel.app
"""
import feedparser
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
import os
import json
import re
import time
import logging
from datetime import datetime, timezone
from dateutil import parser as dateparser

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# ─── CONFIG ───────────────────────────────────────────────────────────────────
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
SCRAPER_TOKEN  = os.environ.get("SCRAPER_TOKEN", "")
SITE_URL       = os.environ.get("SITE_URL", "https://shangthing.vercel.app")
INGEST_URL     = f"{SITE_URL}/api/tech-trends/ingest"

RSS_FEEDS = {
    # ── ENHANCED: AI/ML (Latest trends, LLMs, Agentic AI) ─────────────────────
    "AI/ML": [
        # ✅ BEST: Hugging Face (LLM models, tools, applied AI)
        "https://huggingface.co/blog/feed.xml",
        # ✅ NEW: The Batch by DeepLearning.AI (Andrew Ng's newsletter)
        "https://www.deeplearning.ai/the-batch/feed/",
        # ✅ NEW: OpenAI Blog (GPT, ChatGPT, latest releases)
        "https://openai.com/blog/rss/",
        # ✅ NEW: Anthropic News (Claude updates, research)
        "https://www.anthropic.com/news/rss",
        # ✅ NEW: Google AI Blog (Gemini, PaLM, latest research)
        "https://blog.google/technology/ai/rss/",
        # Existing: arXiv AI (academic papers)
        "https://arxiv.org/rss/cs.AI",
        # Existing: arXiv ML (academic papers)
        "https://arxiv.org/rss/cs.LG",
    ],
    
    # ── EXISTING: Web Dev (unchanged) ─────────────────────────────────────────
    "Web Dev": [
        "https://hnrss.org/frontpage",
    ],
    
    # ── EXISTING: Cybersecurity (unchanged) ───────────────────────────────────
    "Cybersecurity": [
        "https://feeds.feedburner.com/TheHackersNews",
        "https://www.schneier.com/feed/atom/",
    ],
    
    # ── EXISTING: Federal Tech ────────────────────────────────────────────────
    "Federal Tech": [
        "https://fedscoop.com/feed/",
        "https://defensescoop.com/feed/",
    ],
    
    # ── EXISTING: Cloud (unchanged) ───────────────────────────────────────────
    "Cloud": [
        "https://aws.amazon.com/blogs/aws/feed/",
    ],

    # ── ENHANCED: DoD Audit ───────────────────────────────────────────────────
    "DoD Audit": [
        # ✅ BEST: DoD IG official RSS
        "https://www.dodig.mil/rss.xml",
        # ✅ BEST: GAO reports (many cover DoD audits)
        "https://www.gao.gov/rss/reports.xml",
        # Existing: POGO watchdog
        "https://www.pogo.org/feed",
    ],
    
    # ── ENHANCED: DoD Budget ──────────────────────────────────────────────────
    "DoD Budget": [
        # Existing: DoD Comptroller official
        "https://comptroller.defense.gov/Portals/45/Comptroller_RSS.xml",
        # ✅ NEW: Defense One (better budget coverage)
        "https://www.defenseone.com/rss/all/",
        # Existing: Federal News Network budget
        "https://federalnewsnetwork.com/category/budget-and-finance/feed/",
    ],
    
    # ── ENHANCED: DoD Update (IT & AI focus) ──────────────────────────────────
    "DoD Update": [
        # ✅ NEW: DefenseScoop (#1 for DoD AI/IT news)
        "https://defensescoop.com/feed/",
        # ✅ NEW: C4ISRNET (best tech detail)
        "https://www.c4isrnet.com/arc/outboundfeeds/rss/?outputType=xml",
        # Existing: Breaking Defense
        "https://breakingdefense.com/feed/",
    ],
}

# Limit articles per feed (2 per source = optimal volume)
MAX_ARTICLES_PER_FEED = 2
RATE_LIMIT_SECONDS    = 1.5   # Be respectful to servers

# ─── AI SUMMARY ───────────────────────────────────────────────────────────────
def summarize(title: str, description: str, category: str) -> str:
    if not GEMINI_API_KEY:
        return description[:300] if description else title
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Tailored prompt for AI/ML content
        if category == "AI/ML":
            prompt = f"""Summarize this AI/ML article in exactly 2 clear sentences.
Focus on: what model/tool/technique was released, what it does, and key capabilities.
Highlight if it involves LLMs, Agentic AI, applied AI, or emerging techniques.
Title: {title}
Description: {description[:1000]}
Return only the 2-sentence summary, nothing else."""
        # Tailored prompt for DoD/federal content
        elif "DoD" in category:
            prompt = f"""Summarize this DoD/federal government article in exactly 2 clear sentences.
Focus on: what action was taken, which program/budget is affected, and dollar amounts if mentioned.
Include 2026 context like "Golden Dome", "DOGE Impact", or "Agentic AI" if relevant.
Title: {title}
Description: {description[:1000]}
Return only the 2-sentence summary, nothing else."""
        else:
            prompt = f"""Summarize this tech article in exactly 2 clear sentences. Be specific, avoid fluff.
Title: {title}
Description: {description[:1000]}
Return only the 2-sentence summary, nothing else."""

        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        log.warning(f"Gemini error: {e}")
        return (description or title)[:300]

# ─── FETCH ────────────────────────────────────────────────────────────────────
def fetch_articles(category: str, feed_url: str) -> list[dict]:
    articles = []
    try:
        log.info(f"Fetching [{category}] {feed_url}")
        feed = feedparser.parse(feed_url, request_headers={"User-Agent": "MyThing-Scraper/2.0 (https://shangthing.vercel.app)"})

        if not feed.entries:
            log.warning(f"  No entries found for {feed_url}")
            return []

        for entry in feed.entries[:MAX_ARTICLES_PER_FEED]:
            title = entry.get("title", "").strip()
            url   = entry.get("link", "").strip()
            if not title or not url:
                continue

            # Parse date — ALWAYS output UTC with Z suffix (Zod requires this)
            published = datetime.now(timezone.utc)
            for field in ["published", "updated", "created"]:
                if hasattr(entry, field):
                    try:
                        parsed = dateparser.parse(getattr(entry, field))
                        if parsed:
                            published = parsed.astimezone(timezone.utc)
                            break
                    except Exception:
                        pass

            # Format as ISO 8601 with Z (not +00:00) — Zod datetime() requires Z
            published_str = published.strftime("%Y-%m-%dT%H:%M:%SZ")

            desc = entry.get("summary", entry.get("description", ""))
            desc = re.sub(r"<[^>]+>", "", desc).strip()

            time.sleep(RATE_LIMIT_SECONDS)
            summary = summarize(title, desc, category)

            source = feed.feed.get("title", feed_url.split("/")[2])
            # Clean up source names
            source = source.replace(" - News", "").replace(" | News", "").strip()[:80]

            articles.append({
                "title":       title[:500],
                "url":         url,
                "source":      source,
                "category":    category,
                "summary":     summary,
                "publishedAt": published_str,
            })

    except Exception as e:
        log.error(f"Error fetching {feed_url}: {e}")
    return articles

# ─── PUSH ─────────────────────────────────────────────────────────────────────
def push_to_site(articles: list[dict]) -> bool:
    if not articles:
        log.warning("No articles to push")
        return False
    if not SCRAPER_TOKEN:
        log.error("SCRAPER_TOKEN not set — cannot push to site")
        return False

    try:
        log.info(f"Pushing {len(articles)} articles to {INGEST_URL}")
        res = requests.post(
            INGEST_URL,
            json={"articles": articles, "token": SCRAPER_TOKEN},
            timeout=60,
            headers={"Content-Type": "application/json"},
        )
        data = res.json()
        log.info(f"Push result [{res.status_code}]: {data}")
        return res.status_code == 200
    except Exception as e:
        log.error(f"Push failed: {e}")
        return False

# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    log.info("=" * 60)
    log.info("MyThing Tech News Scraper — ENHANCED February 2026")
    log.info("NEW: Premium AI/ML sources (LLMs, Agentic AI, Applied AI)")
    log.info("NEW: Premium DoD sources (DefenseScoop, C4ISRNET)")
    log.info(f"Target: {INGEST_URL}")
    log.info(f"Token set: {'YES' if SCRAPER_TOKEN else 'NO ← will fail!'}")
    log.info(f"Gemini key set: {'YES' if GEMINI_API_KEY else 'NO ← no AI summaries'}")
    log.info(f"Max articles per feed: {MAX_ARTICLES_PER_FEED}")
    log.info("=" * 60)

    all_articles = []
    category_counts = {}

    for category, feeds in RSS_FEEDS.items():
        category_articles = []
        for feed_url in feeds:
            articles = fetch_articles(category, feed_url)
            category_articles.extend(articles)
            all_articles.extend(articles)
            log.info(f"  ✓ {category} ← {len(articles)} articles from {feed_url.split('/')[2]}")
        
        category_counts[category] = len(category_articles)

    log.info("\n" + "=" * 60)
    log.info("SCRAPING SUMMARY")
    log.info("=" * 60)
    for cat, count in category_counts.items():
        log.info(f"  {cat:20s}: {count:3d} articles")
    log.info(f"\n  {'TOTAL':20s}: {len(all_articles):3d} articles")
    log.info("=" * 60)

    if all_articles:
        success = push_to_site(all_articles)
        log.info(f"\nPush {'✅ SUCCEEDED' if success else '❌ FAILED'}")
    else:
        log.warning("No articles scraped — check RSS feed URLs")

    # Save locally for debugging
    with open("scraped_articles.json", "w") as f:
        json.dump(all_articles, f, indent=2, default=str)
    log.info("Saved scraped_articles.json locally for debugging")

if __name__ == "__main__":
    main()
