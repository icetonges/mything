import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

async function getLatestHeadlines() {
  try {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${base}/api/tech-trends?limit=3`, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles ?? [];
  } catch {
    return [];
  }
}

export async function TechPulse() {
  const articles = await getLatestHeadlines();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Tech Pulse</h2>
          <Link href="/tech-trends" className="text-sm text-accent hover:underline">
            View all →
          </Link>
        </div>
        {articles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {articles.map((a: { id: string; title: string; url: string; source: string; summary: string }) => (
              <Card key={a.id}>
                <CardHeader className="pb-2">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-accent line-clamp-2"
                  >
                    {a.title}
                  </a>
                  <p className="text-xs text-muted-foreground">{a.source}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{a.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>No tech headlines yet. Check back after the scraper runs, or visit Tech Trends for curated feeds.</p>
              <Link href="/tech-trends" className="text-accent hover:underline mt-2 inline-block">
                Tech Trends →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
