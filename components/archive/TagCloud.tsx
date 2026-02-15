'use client';

import { useMemo } from 'react';

interface Note {
  themes: string[];
  tags?: string[];
}

export function TagCloud({
  notes,
  selectedTag,
  onSelectTag,
}: {
  notes: Note[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}) {
  const tagCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const n of notes) {
      for (const t of n.themes ?? []) {
        map[t] = (map[t] ?? 0) + 1;
      }
      for (const t of n.tags ?? []) {
        map[t] = (map[t] ?? 0) + 1;
      }
    }
    return map;
  }, [notes]);

  const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) return null;

  const max = Math.max(...sorted.map(([, c]) => c));

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelectTag(null)}
        className={`rounded-full px-3 py-1 text-sm ${selectedTag === null ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}
      >
        All
      </button>
      {sorted.map(([tag, count]) => {
        const scale = 0.8 + (count / max) * 0.6;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              selectedTag === tag ? 'bg-accent text-accent-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
            style={{ fontSize: `${scale}rem` }}
          >
            {tag} ({count})
          </button>
        );
      })}
    </div>
  );
}
