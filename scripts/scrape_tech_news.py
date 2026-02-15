#!/usr/bin/env python3
"""
Tech news scraper for MyThing.
Fetches RSS feeds, summarizes with Gemini, and POSTs to /api/tech-trends/ingest.
Dependencies: pip install feedparser requests google-generativeai
Run: python scripts/scrape_tech_news.py
"""
import os
import re
import json
from datetime import datetime
from urllib.parse import urlparse

try:
    import feedparser
    import requests
    import google.generativeai as genai
except ImportError:
    print("Install: pip install feedparser requests google-generativeai")
    raise

RSS_FEEDS = {
    "AI/ML": [
        "https://arxiv.org/rss/cs.AI",
        "https://feeds.feedburner.com/TechCrunch/artificial-intelligence",
    ],
    "Cloud": ["https://feeds.feedburner.com/TechCrunch/cloud"],
    "Cybersecurity": ["https://feeds.feedburner.com/TechCrunch/security"],
    "Web Dev": ["https://hnrss.org/frontpage"],
    "Federal Tech": ["https://www.fedscoop.com/feed/"],
}

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
SCRAPER_TOKEN = os.environ.get("SCRAPER_TOKEN")
SITE_URL = os.environ.get("SITE_URL", "https://mything.vercel.app").rstrip("/")


def get_source_name(url: str) -> str:
    parsed = urlparse(url)
    host = parsed.netloc or ""
    if "arxiv" in host:
        return "ArXiv"
    if "techcrunch" in host:
        return "TechCrunch"
    if "hnrss" in host:
        return "Hacker News"
    if "fedscoop" in host:
        return "FedScoop"
    return host.split(".")[-2] if "." in host else "RSS"


def categorize(title: str, summary: str) -> str:
    text = (title + " " + summary).lower()
    if any(k in text for k in ["ai", "ml", "machine learning", "neural", "llm", "gpt"]):
        return "AI/ML"
    if any(k in text for k in ["cloud", "aws", "azure", "gcp"]):
        return "Cloud"
    if any(k in text for k in ["security", "cyber", "breach", "ransomware"]):
        return "Cybersecurity"
    if any(k in text for k in ["federal", "government", "dod", "omb"]):
        return "Federal Tech"
    return "Web Dev"


def summarize_with_gemini(title: str, link: str) -> str:
    if not GEMINI_API_KEY:
        return (title[:200] + "...") if len(title) > 200 else title
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"Summarize this tech article in exactly 2 short sentences. Title: {title}\nURL: {link}"
        response = model.generate_content(prompt)
        return (response.text or title).strip()[:500]
    except Exception:
        return (title[:200] + "...") if len(title) > 200 else title


def main():
    if not SCRAPER_TOKEN:
        print("Set SCRAPER_TOKEN environment variable.")
        return 1

    articles = []
    seen_urls = set()

    for category, urls in RSS_FEEDS.items():
        for url in urls:
            try:
                feed = feedparser.parse(url)
                source = get_source_name(url)
                for entry in feed.entries[:10]:
                    link = entry.get("link") or ""
                    if not link or link in seen_urls:
                        continue
                    seen_urls.add(link)
                    title = (entry.get("title") or "").strip()
                    if not title:
                        continue
                    published = entry.get("published_parsed")
                    if published:
                        from time import mktime
                        pub_dt = datetime.utcfromtimestamp(mktime(published))
                    else:
                        pub_dt = datetime.utcnow()
                    summary_text = entry.get("summary", "") or ""
                    summary_clean = re.sub(r"<[^>]+>", "", summary_text)[:300]
                    cat = categorize(title, summary_clean)
                    ai_summary = summarize_with_gemini(title, link)
                    articles.append({
                        "title": title[:500],
                        "url": link,
                        "source": source,
                        "category": cat,
                        "summary": ai_summary[:1000],
                        "publishedAt": pub_dt.isoformat() + "Z",
                    })
            except Exception as e:
                print(f"Error fetching {url}: {e}")

    if not articles:
        print("No articles fetched.")
        return 0

    ingest_url = f"{SITE_URL}/api/tech-trends/ingest"
    resp = requests.post(
        ingest_url,
        json={"articles": articles, "token": SCRAPER_TOKEN},
        headers={"Content-Type": "application/json"},
        timeout=30,
    )
    if resp.status_code != 200:
        print(f"Ingest failed: {resp.status_code} {resp.text}")
        return 1
    print(f"Ingested {len(articles)} articles.")
    return 0


if __name__ == "__main__":
    exit(main())
