'use client';

import { useState, useEffect } from 'react';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { NoteAIPanel } from '@/components/ai/NoteAIPanel';
import { NoteCard } from '@/components/notes/NoteCard';

interface Note {
  id: string;
  date: string;
  content: string;
  mood: number | null;
  tags: string[];
  quickType: string | null;
  headline: string | null;
  summary: string | null;
  keyIdeas: string | null;
  actionItems: string | null;
  themes: string[];
  sentiment: string | null;
  aiProcessedAt: string | null;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data.notes ?? []);
    })();
  }, []);

  async function handleSave(data: {
    date: string;
    content: string;
    mood?: number;
    tags: string[];
    quickType?: string;
  }) {
    setSaving(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const note = await res.json();
      setNotes((prev) => [note, ...prev.filter((n) => n.id !== note.id)]);
      setSelected(note);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-6">Daily Notes</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Capture</h2>
            <NoteEditor
              onSave={handleSave}
              loading={saving}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">AI Output</h2>
            <div className="rounded-xl border border-muted bg-card p-6 min-h-[200px]">
              {selected ? (
                <NoteAIPanel
                  headline={selected.headline}
                  summary={selected.summary}
                  keyIdeas={selected.keyIdeas}
                  actionItems={selected.actionItems}
                  themes={selected.themes}
                  sentiment={selected.sentiment}
                  aiProcessedAt={selected.aiProcessedAt}
                />
              ) : (
                <p className="text-muted-foreground">Save a note to see AI summary and insights here.</p>
              )}
            </div>
          </div>
        </div>
        {notes.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Recent notes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.slice(0, 6).map((n) => (
                <div key={n.id} onClick={() => setSelected(n)} className="cursor-pointer">
                  <NoteCard
                    id={n.id}
                    date={n.date}
                    headline={n.headline}
                    summary={n.summary}
                    slug={(n as Note & { slug?: string | null }).slug}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
