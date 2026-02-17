"use client";
import { useState } from "react";
import { PenLine, Sparkles, Loader2, Save, Tag, Calendar, Smile } from "lucide-react";
import { formatDate } from "@/lib/utils";

type QuickType = "idea" | "trend" | "goal" | "note" | "insight";

interface NoteAI {
  headline: string;
  summary: string;
  keyIdeas: string[];
  actionItems: string[];
  themes: string[];
  sentiment: string;
}

interface SavedNote {
  id: string;
  headline?: string;
  summary?: string;
  keyIdeas?: string;
  actionItems?: string;
  themes: string[];
  sentiment?: string;
  slug?: string;
}

const QUICK_TYPES: { type: QuickType; emoji: string; label: string; color: string }[] = [
  { type: "idea",    emoji: "💡", label: "Idea",    color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
  { type: "trend",   emoji: "📰", label: "Trend",   color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
  { type: "goal",    emoji: "🎯", label: "Goal",    color: "bg-red-500/10 border-red-500/20 text-red-400" },
  { type: "note",    emoji: "📝", label: "Note",    color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  { type: "insight", emoji: "⚡", label: "Insight", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
];

const MOOD_OPTIONS = [
  { val: 1, emoji: "😔", label: "Low" },
  { val: 2, emoji: "😐", label: "OK" },
  { val: 3, emoji: "🙂", label: "Good" },
  { val: 4, emoji: "😊", label: "Great" },
  { val: 5, emoji: "🚀", label: "Amazing" },
];

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "text-green-400",
  neutral: "text-blue-400",
  reflective: "text-purple-400",
  energized: "text-yellow-400",
  challenging: "text-red-400",
};

export default function NotesPage() {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<number>(3);
  const [tags, setTags] = useState("");
  const [quickType, setQuickType] = useState<QuickType>("note");
  const [saving, setSaving] = useState(false);
  const [aiResult, setAiResult] = useState<NoteAI | null>(null);
  const [savedNote, setSavedNote] = useState<SavedNote | null>(null);
  const [error, setError] = useState("");

  const today = new Date();

  const save = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          mood,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          quickType,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSavedNote(data);
      setAiResult({
        headline: data.headline ?? "",
        summary: data.summary ?? "",
        keyIdeas: JSON.parse(data.keyIdeas ?? "[]"),
        actionItems: JSON.parse(data.actionItems ?? "[]"),
        themes: data.themes ?? [],
        sentiment: data.sentiment ?? "neutral",
      });
      setContent("");
      setTags("");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <PenLine size={20} className="text-orange-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Daily Notes</h1>
            <p className="text-xs text-[hsl(var(--fg-muted))] flex items-center gap-1">
              <Calendar size={11} /> {formatDate(today)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─ INPUT PANEL ─ */}
        <div className="space-y-4">
          {/* Quick type */}
          <div className="flex flex-wrap gap-2">
            {QUICK_TYPES.map(q => (
              <button
                key={q.type}
                onClick={() => setQuickType(q.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                  quickType === q.type ? q.color + " border-current" : "border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--accent)/0.3)]"
                }`}>
                {q.emoji} {q.label}
              </button>
            ))}
          </div>

          {/* Main textarea */}
          <div className="card overflow-hidden">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What's on your mind today? Any thoughts, ideas, insights, or things you learned…"
              rows={12}
              className="w-full p-4 bg-transparent text-sm leading-relaxed focus:outline-none resize-none prose-note"
            />
            <div className="border-t border-[hsl(var(--border))] px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-[hsl(var(--fg-muted))]">{content.length} chars</span>
              <span className="text-xs text-[hsl(var(--fg-muted))]">Markdown supported</span>
            </div>
          </div>

          {/* Mood + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-3">
              <p className="text-xs font-medium text-[hsl(var(--fg-muted))] mb-2 flex items-center gap-1"><Smile size={12} /> Mood / Energy</p>
              <div className="flex gap-1">
                {MOOD_OPTIONS.map(m => (
                  <button key={m.val} onClick={() => setMood(m.val)} title={m.label}
                    className={`flex-1 py-1.5 rounded-lg text-lg transition-all ${mood === m.val ? "bg-[hsl(var(--accent)/0.15)] scale-110" : "hover:bg-[hsl(var(--bg-muted))]"}`}>
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-3">
              <p className="text-xs font-medium text-[hsl(var(--fg-muted))] mb-2 flex items-center gap-1"><Tag size={12} /> Tags</p>
              <input
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="budget, ai, family…"
                className="w-full text-sm bg-transparent focus:outline-none text-[hsl(var(--fg))]"
              />
            </div>
          </div>

          {/* Save button */}
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            onClick={save}
            disabled={!content.trim() || saving}
            className="w-full py-3 rounded-xl gold-bg font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Processing with AI…</> : <><Save size={16} /> Save & Analyze</>}
          </button>
        </div>

        {/* ─ AI OUTPUT PANEL ─ */}
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {aiResult ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-[hsl(var(--accent))]" />
                <p className="text-sm font-semibold">AI Analysis</p>
                {savedNote?.slug && (
                  <a href={`/archive/${savedNote.slug}`} className="ml-auto text-xs text-[hsl(var(--accent))] hover:underline">
                    View archive page →
                  </a>
                )}
              </div>

              {/* Headline */}
              <div className="card p-4 border-[hsl(var(--accent)/0.2)] bg-[hsl(var(--accent)/0.04)]">
                <p className="text-[10px] text-[hsl(var(--accent))] font-semibold uppercase tracking-wider mb-1">Headline</p>
                <p className="font-display font-bold text-base leading-snug break-all">{aiResult.headline}</p>
                {aiResult.sentiment && (
                  <p className={`text-xs mt-2 font-medium ${SENTIMENT_COLORS[aiResult.sentiment] ?? "text-[hsl(var(--fg-muted))]"}`}>
                    ● {aiResult.sentiment.charAt(0).toUpperCase() + aiResult.sentiment.slice(1)} sentiment
                  </p>
                )}
              </div>

              {/* Summary */}
              {aiResult.summary && (
                <div className="card p-4 max-h-64 overflow-y-auto">
                  <p className="text-[10px] text-[hsl(var(--fg-muted))] font-semibold uppercase tracking-wider mb-2">Executive Summary</p>
                  <div className="space-y-1">
                    {aiResult.summary.split("\n").map((line, i) => (
                      <p key={i} className="text-sm leading-relaxed break-words">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {/* Key Ideas */}
                {aiResult.keyIdeas.length > 0 && (
                  <div className="card p-4">
                    <p className="text-[10px] text-[hsl(var(--fg-muted))] font-semibold uppercase tracking-wider mb-2">Key Ideas</p>
                    <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                      {aiResult.keyIdeas.map((idea, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-[hsl(var(--accent))] mt-0.5 flex-shrink-0">→</span>
                          <span className="break-words">{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                {aiResult.actionItems.length > 0 && (
                  <div className="card p-4">
                    <p className="text-[10px] text-[hsl(var(--fg-muted))] font-semibold uppercase tracking-wider mb-2">Action Items</p>
                    <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                      {aiResult.actionItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-orange-400 mt-0.5 flex-shrink-0">☐</span>
                          <span className="break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Themes */}
              {aiResult.themes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {aiResult.themes.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="card p-8 border-dashed flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <Sparkles size={40} className="text-[hsl(var(--fg-muted))] mb-4" />
              <h3 className="font-semibold mb-2">AI Analysis Panel</h3>
              <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed max-w-xs">
                Write your thoughts and click &quot;Save &amp; Analyze&quot;. Gemini AI will instantly generate a headline, executive summary, key ideas, action items, themes, and sentiment analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
