'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { useSession } from 'next-auth/react';

const CATEGORIES = ['All', 'AI/ML', 'Cloud', 'Cybersecurity', 'Federal Tech', 'Web Dev'];

const FALLBACK_FEEDS = [
  { title: 'Hacker News', url: 'https://news.ycombinator.com', source: 'HN' },
  { title: 'TechCrunch', url: 'https://techcrunch.com', source: 'TechCrunch' },
  { title: 'MIT Tech Review', url: 'https://www.technologyreview.com', source: 'MIT TR' },
];

export function TechTrendsClient({ categories }: { categories: string[] }) {
  const [articles, setArticles] = useState<Array<{ id: string; title: string; url: string; source: string; category: string; summary: string; publishedAt: string }>>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.set('category', category);
        params.set('limit', '20');
        const res = await fetch(`/api/tech-trends?${params}`);
        const data = await res.json();
        if (!cancelled) setArticles(data.articles ?? []);
      } catch {
        if (!cancelled) setArticles([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [category]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await fetch('/api/tech-trends/refresh', { method: 'POST' });
      const params = new URLSearchParams();
      if (category !== 'All') params.set('category', category);
      params.set('limit', '20');
      const res = await fetch(`/api/tech-trends?${params}`);
      const data = await res.json();
      setArticles(data.articles ?? []);
    } finally {
      setRefreshing(false);
    }
  }

  const filtered = search.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          (a.summary && a.summary.toLowerCase().includes(search.toLowerCase()))
      )
    : articles;

  const cats = categories.length > 1 ? categories : CATEGORIES;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-sm ${
              category === c ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search headlines…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {session && (
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((a) => (
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
                <p className="text-xs text-muted-foreground">
                  {a.source} · {a.category} · {new Date(a.publishedAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{a.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground mb-4">No articles yet. Curated feeds:</p>
            <ul className="space-y-2">
              {FALLBACK_FEEDS.map((f) => (
                <li key={f.url}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {f.title} — {f.source}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
