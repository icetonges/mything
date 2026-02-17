#!/usr/bin/env python3
"""
MyThing Tech News Scraper
Fetches RSS feeds, generates AI summaries, pushes to shangthing.vercel.app

Usage:
  pip install feedparser requests google-generativeai python-dateutil
  python scripts/scrape_tech_news.py

Environment variables:
  GEMINI_API_KEY  — Google AI Studio key
  SCRAPER_TOKEN   — Matches SCRAPER_TOKEN in Vercel env
  SITE_URL        — e.g. https://shangthing.vercel.app
"""
import feedparser
import requests
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
    # ── Existing feeds ────────────────────────────────────
    "AI/ML": [
        "https://arxiv.org/rss/cs.AI",
        "https://arxiv.org/rss/cs.LG",
    ],
    "Web Dev": [
        "https://hnrss.org/frontpage",
    ],
    "Cybersecurity": [
        "https://feeds.feedburner.com/TheHackersNews",
        "https://www.schneier.com/feed/atom/",
    ],
    "Federal Tech": [
        "https://fedscoop.com/feed/",
        "https://gcn.com/rss-feeds/all.aspx",
        "https://defensescoop.com/feed/",
    ],
    "Cloud": [
        "https://aws.amazon.com/blogs/aws/feed/",
    ],

    # ── NEW: DoD Audit, Budget & Policy feeds ─────────────
    "DoD Audit": [
        # DoD OIG — press releases and reports
        "https://www.dodig.mil/rss/rss-press-releases.xml",
        # GAO — recent reports (many cover DoD)
        "https://www.gao.gov/rss/reports.xml",
        # POGO — Project on Government Oversight (DoD watchdog)
        "https://www.pogo.org/feed",
    ],
    "DoD Budget": [
        # Office of the Under Secretary of Defense (Comptroller) — news
        "https://comptroller.defense.gov/Portals/45/Comptroller_RSS.xml",
        # Defense News — budget & finance coverage
        "https://www.defensenews.com/arc/outboundfeeds/rss/category/pentagon/?outputType=xml",
        # Federal News Network — federal budget and finance
        "https://federalnewsnetwork.com/category/budget-and-finance/feed/",
        # OMB — White House budget releases
        "https://www.whitehouse.gov/omb/feed/",
    ],
    "DoD Policy": [
        # Defense.gov — official DoD news
        "https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=10",
        # Breaking Defense — DoD initiatives and memos
        "https://breakingdefense.com/feed/",
        # InsideDefense (public headlines)
        "https://insidedefense.com/rss.xml",
    ],
}

MAX_ARTICLES_PER_FEED = 5
RATE_LIMIT_SECONDS    = 1.2   # slightly longer to avoid API rate limits

# ─── AI SUMMARY ───────────────────────────────────────────────────────────────
def summarize(title: str, description: str, category: str) -> str:
    if not GEMINI_API_KEY:
        return description[:300] if description else title
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Tailored prompt for DoD/federal content
        if "DoD" in category:
            prompt = f"""Summarize this DoD/federal government article in exactly 2 clear sentences.
Focus on: what action was taken, which program/budget is affected, and dollar amounts if mentioned.
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
        feed = feedparser.parse(feed_url, request_headers={"User-Agent": "MyThing-Scraper/1.0"})

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
    log.info("MyThing Tech News Scraper — Starting")
    log.info(f"Target: {INGEST_URL}")
    log.info(f"Token set: {'YES' if SCRAPER_TOKEN else 'NO ← will fail!'}")
    log.info(f"Gemini key set: {'YES' if GEMINI_API_KEY else 'NO ← no AI summaries'}")
    log.info("=" * 60)

    all_articles = []

    for category, feeds in RSS_FEEDS.items():
        for feed_url in feeds:
            articles = fetch_articles(category, feed_url)
            all_articles.extend(articles)
            log.info(f"  ✓ {category} ← {len(articles)} articles")

    log.info(f"\nTotal articles scraped: {len(all_articles)}")

    if all_articles:
        success = push_to_site(all_articles)
        log.info(f"Push {'✅ SUCCEEDED' if success else '❌ FAILED'}")
    else:
        log.warning("No articles scraped — check RSS feed URLs")

    # Save locally for debugging
    with open("scraped_articles.json", "w") as f:
        json.dump(all_articles, f, indent=2, default=str)
    log.info("Saved scraped_articles.json locally for debugging")

if __name__ == "__main__":
    main()
