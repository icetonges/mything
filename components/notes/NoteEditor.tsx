'use client';
import { useState } from 'react';
import { NoteAIPanel } from '@/components/ai/NoteAIPanel';
import { Save, Sparkles } from 'lucide-react';

const QUICK_TYPES = [
  { emoji: '💡', label: 'Idea',    value: 'idea' },
  { emoji: '📰', label: 'Trend',   value: 'trend' },
  { emoji: '🎯', label: 'Goal',    value: 'goal' },
  { emoji: '📝', label: 'Note',    value: 'note' },
  { emoji: '⚡', label: 'Insight', value: 'insight' },
];

const MOODS = ['😔', '😐', '🙂', '😊', '🚀'];

interface NoteData {
  id: string; date: string; content: string; mood?: number; tags: string[]; quickType?: string;
  headline?: string; summary?: string; keyIdeas?: string; actionItems?: string; themes?: string[]; sentiment?: string; slug?: string;
}

export function NoteEditor() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<number>(3);
  const [tags, setTags] = useState('');
  const [quickType, setQuickType] = useState('note');
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [savedNote, setSavedNote] = useState<NoteData | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    setProcessing(true);
    setSaved(false);

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          mood,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          quickType,
          date: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedNote(data.note);
        setSaved(true);
        setContent('');
        setTags('');
      }
    } catch { /* silent */ }
    finally { setSaving(false); setProcessing(false); }
  };

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden border border-border">
      {/* Left — Editor */}
      <div className="flex-1 flex flex-col" style={{ background: 'hsl(224,40%,7%)' }}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border/50">
          {/* Quick type */}
          <div className="flex gap-1">
            {QUICK_TYPES.map(t => (
              <button key={t.value} onClick={() => setQuickType(t.value)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${quickType === t.value ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Mood */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Mood:</span>
            {MOODS.map((emoji, i) => (
              <button key={i} onClick={() => setMood(i + 1)}
                className={`text-base transition-all ${mood === i + 1 ? 'scale-125' : 'opacity-50 hover:opacity-100'}`}>
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Text area */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind today? Capture thoughts, ideas, trends, or anything worth remembering…"
          className="flex-1 p-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none text-sm leading-relaxed font-sans scrollbar-thin"
        />

        {/* Bottom bar */}
        <div className="flex items-center gap-3 p-3 border-t border-border/50">
          <input value={tags} onChange={e => setTags(e.target.value)}
            placeholder="Tags (comma-separated)…"
            className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
          <span className="text-xs text-muted-foreground shrink-0">{content.length} chars</span>
          <button onClick={handleSave} disabled={!content.trim() || saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 disabled:opacity-50 transition-all text-sm shrink-0">
            {saving ? <><Sparkles className="h-3.5 w-3.5 animate-spin" /> Processing…</> : <><Save className="h-3.5 w-3.5" /> Save & Analyze</>}
          </button>
        </div>
        {saved && <div className="px-3 pb-2 text-xs text-green-400">✓ Note saved and analyzed!</div>}
      </div>

      {/* Right — AI Panel */}
      <div className="w-full md:w-80 lg:w-96 border-l border-border/50 flex flex-col" style={{ background: 'hsl(224,40%,6%)' }}>
        <div className="flex items-center gap-2 p-3 border-b border-border/50">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">AI Analysis</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <NoteAIPanel
            headline={savedNote?.headline}
            summary={savedNote?.summary}
            keyIdeas={savedNote?.keyIdeas}
            actionItems={savedNote?.actionItems}
            themes={savedNote?.themes}
            sentiment={savedNote?.sentiment}
            isProcessing={processing}
          />
        </div>
      </div>
    </div>
  );
}
