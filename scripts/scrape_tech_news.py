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
    "AI/ML": [
        "https://arxiv.org/rss/cs.AI",
        "https://arxiv.org/rss/cs.LG",
    ],
    "Web Dev": [
        "https://hnrss.org/frontpage",
    ],
    "Cybersecurity": [
        "https://feeds.feedburner.com/TheHackersNews",
    ],
    "Federal Tech": [
        "https://fedscoop.com/feed/",
    ],
    "Cloud": [
        "https://aws.amazon.com/blogs/aws/feed/",
    ],
}

MAX_ARTICLES_PER_FEED = 5
RATE_LIMIT_SECONDS = 1.0

# ─── AI SUMMARY ───────────────────────────────────────────────────────────────
def summarize(title: str, description: str) -> str:
    if not GEMINI_API_KEY:
        return description[:300] if description else title
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
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
        log.info(f"Fetching {feed_url}")
        feed = feedparser.parse(feed_url)
        for entry in feed.entries[:MAX_ARTICLES_PER_FEED]:
            title = entry.get("title", "").strip()
            url   = entry.get("link", "").strip()
            if not title or not url:
                continue

            # Parse date
            published = datetime.now(timezone.utc)
            for field in ["published", "updated", "created"]:
                if hasattr(entry, field):
                    try:
                        published = dateparser.parse(getattr(entry, field)).astimezone(timezone.utc)
                        break
                    except Exception:
                        pass

            desc = entry.get("summary", entry.get("description", ""))
            # Strip HTML tags
            import re
            desc = re.sub(r"<[^>]+>", "", desc).strip()

            time.sleep(RATE_LIMIT_SECONDS)
            summary = summarize(title, desc)

            articles.append({
                "title": title[:500],
                "url": url,
                "source": feed.feed.get("title", feed_url.split("/")[2]),
                "category": category,
                "summary": summary,
                "publishedAt": published.isoformat(),
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
        res = requests.post(
            INGEST_URL,
            json={"articles": articles, "token": SCRAPER_TOKEN},
            timeout=30,
            headers={"Content-Type": "application/json"},
        )
        data = res.json()
        log.info(f"Push result: {data}")
        return res.status_code == 200
    except Exception as e:
        log.error(f"Push failed: {e}")
        return False

# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    log.info("Starting MyThing Tech News Scraper")
    all_articles = []

    for category, feeds in RSS_FEEDS.items():
        for feed_url in feeds:
            articles = fetch_articles(category, feed_url)
            all_articles.extend(articles)
            log.info(f"  {category} ← {len(articles)} articles from {feed_url}")

    log.info(f"Total articles scraped: {len(all_articles)}")

    if all_articles:
        success = push_to_site(all_articles)
        log.info(f"Push {'succeeded' if success else 'failed'}")

    # Also save locally for debugging
    with open("scraped_articles.json", "w") as f:
        json.dump(all_articles, f, indent=2, default=str)
    log.info("Saved scraped_articles.json locally")

if __name__ == "__main__":
    main()
