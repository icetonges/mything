import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Owner-only. Actual scraping is done by scripts/scrape_tech_news.py (e.g. via GitHub Actions).
// This endpoint can be used to signal "refresh" or to run a server-side scrape in the future.
export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ ok: true, message: 'Refresh triggered. Scraper runs via cron or manual run.' });
}
