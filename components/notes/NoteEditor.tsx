'use client';

import { useState } from 'react';
import { QuickCaptureBar } from './QuickCaptureBar';
import { Button } from '@/components/ui/button';

const MOOD_OPTIONS = ['😫', '😐', '🙂', '😊', '🔥'];

export function NoteEditor({
  onSave,
  initialDate,
  initialContent,
  initialMood,
  initialTags,
  initialQuickType,
  loading,
}: {
  onSave: (data: {
    date: string;
    content: string;
    mood?: number;
    tags: string[];
    quickType?: string;
  }) => Promise<void>;
  initialDate?: string;
  initialContent?: string;
  initialMood?: number | null;
  initialTags?: string[];
  initialQuickType?: string | null;
  loading?: boolean;
}) {
  const [date, setDate] = useState(
    initialDate ?? new Date().toISOString().slice(0, 10)
  );
  const [content, setContent] = useState(initialContent ?? '');
  const [mood, setMood] = useState<number | undefined>(initialMood ?? undefined);
  const [tags, setTags] = useState(initialTags?.join(', ') ?? '');
  const [quickType, setQuickType] = useState<string | null>(initialQuickType ?? null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave({
      date,
      content,
      mood: mood ? mood : undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      quickType: quickType ?? undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-muted bg-background px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Mood / Energy</label>
          <div className="flex gap-1">
            {MOOD_OPTIONS.map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMood(i + 1)}
                className={`text-2xl p-1 rounded ${mood === i + 1 ? 'ring-2 ring-accent' : ''}`}
                title={`${i + 1}/5`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="work, budget, idea"
          className="w-full rounded-lg border border-muted bg-background px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Quick capture</label>
        <QuickCaptureBar selected={quickType} onSelect={setQuickType} />
      </div>
      <div>
        <label className="block text-sm mb-1">Note</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts…"
          rows={12}
          className="w-full rounded-lg border border-muted bg-background px-3 py-2 font-mono text-sm"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Save & Process'}
      </Button>
    </form>
  );
}
