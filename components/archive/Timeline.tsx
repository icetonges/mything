'use client';

import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';

interface Note {
  id: string;
  date: string;
  headline?: string | null;
  summary?: string | null;
  slug?: string | null;
}

export function Timeline({ notes }: { notes: Note[] }) {
  const byMonth = notes.reduce<Record<string, Note[]>>((acc, n) => {
    const key = new Date(n.date).toLocaleString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(byMonth).map(([month, list]) => (
        <div key={month}>
          <h3 className="text-lg font-semibold text-muted-foreground mb-4">{month}</h3>
          <div className="space-y-3">
            {list.map((n) => (
              <Link key={n.id} href={n.slug ? `/archive/${n.slug}` : '#'}>
                <Card className="hover:border-accent/50 transition-colors">
                  <CardHeader className="py-3">
                    <p className="text-xs text-muted-foreground">{formatDate(n.date)}</p>
                    <h4 className="font-medium">{n.headline || 'Untitled'}</h4>
                  </CardHeader>
                  {n.summary && (
                    <CardContent className="pt-0 pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{n.summary}</p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
