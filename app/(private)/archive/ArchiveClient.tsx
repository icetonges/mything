'use client';

import { useState, useMemo } from 'react';
import { Timeline } from '@/components/archive/Timeline';
import { TagCloud } from '@/components/archive/TagCloud';
import { TrendChart } from '@/components/archive/TrendChart';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Note {
  id: string;
  date: string;
  headline?: string | null;
  summary?: string | null;
  slug?: string | null;
  themes: string[];
  tags?: string[];
  mood?: number | null;
}

export function ArchiveClient({ notes }: { notes: Note[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = notes;
    if (selectedTag) {
      list = list.filter(
        (n) =>
          (n.themes && n.themes.includes(selectedTag)) ||
          (n.tags && n.tags.includes(selectedTag))
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          (n.headline && n.headline.toLowerCase().includes(q)) ||
          (n.summary && n.summary.toLowerCase().includes(q))
      );
    }
    return list;
  }, [notes, selectedTag, search]);

  const themeCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const n of notes) {
      for (const t of n.themes ?? []) {
        map[t] = (map[t] ?? 0) + 1;
      }
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [notes]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search notes and summaries…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Tag cloud</h2>
        <TagCloud notes={notes} selectedTag={selectedTag} onSelectTag={setSelectedTag} />
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Mood / Energy over time</h2>
        </CardHeader>
        <CardContent>
          <TrendChart notes={notes} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Theme frequency</h2>
        </CardHeader>
        <CardContent>
          {themeCounts.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {themeCounts.map(([theme, count]) => (
                <div key={theme} className="flex items-center gap-2">
                  <span className="text-sm">{theme}</span>
                  <span className="text-muted-foreground text-sm">({count})</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No themes yet.</p>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Timeline</h2>
        <Timeline notes={filtered} />
      </div>
    </div>
  );
}
