'use client';
import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, ChevronRight } from 'lucide-react';

interface SummaryData {
  executiveSummary: string | null;
  categoryHighlights: Record<string, string>;
  categoryCounts:     Record<string, number>;
  generatedAt:        string;
  articleCount:       number;
}

const CAT_COLORS: Record<string, string> = {
  'AI/ML':         'border-purple-500/30 bg-purple-500/5  text-purple-300',
  'Cloud':         'border-cyan-500/30   bg-cyan-500/5    text-cyan-300',
  'Cybersecurity': 'border-red-500/30    bg-red-500/5     text-red-300',
  'Web Dev':       'border-blue-500/30   bg-blue-500/5    text-blue-300',
  'Federal Tech':  'border-green-500/30  bg-green-500/5   text-green-300',
  'DoD Audit':     'border-orange-500/30 bg-orange-500/5  text-orange-300',
  'DoD Budget':    'border-yellow-500/30 bg-yellow-500/5  text-yellow-300',
  'DoD Policy':    'border-teal-500/30   bg-teal-500/5    text-teal-300',
};

const CAT_EMOJIS: Record<string, string> = {
  'AI/ML': '🤖', 'Cloud': '☁️', 'Cybersecurity': '🔒',
  'Web Dev': '💻', 'Federal Tech': '🏛️',
  'DoD Audit': '📋', 'DoD Budget': '💰', 'DoD Policy': '📜',
};

export default function TechPulseSummary() {
  const [data, setData]       = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/tech-pulse/summary')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // Don't render at all if no data and no error
  if (!loading && !data?.executiveSummary && !error) return null;

  const highlights  = data?.categoryHighlights ?? {};
  const cats        = Object.keys(highlights);

  return (
    <div className="mb-8 rounded-2xl border border-[hsl(var(--accent)/0.2)] bg-[hsl(var(--accent)/0.03)] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[hsl(var(--accent)/0.15)]">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[hsl(var(--accent))]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
            AI Intelligence Summary
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[hsl(var(--fg-muted))]">
          {loading && <RefreshCw size={10} className="animate-spin" />}
          {data?.generatedAt && (
            <span>
              Generated {new Date(data.generatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              {data.articleCount > 0 && ` · ${data.articleCount} articles analyzed`}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* Executive Summary */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-2">
            Executive Summary
          </p>
          {loading ? (
            <div className="space-y-2">
              <div className="h-3.5 rounded-full bg-[hsl(var(--bg-muted))] animate-pulse w-full" />
              <div className="h-3.5 rounded-full bg-[hsl(var(--bg-muted))] animate-pulse w-11/12" />
              <div className="h-3.5 rounded-full bg-[hsl(var(--bg-muted))] animate-pulse w-4/5" />
            </div>
          ) : error || !data?.executiveSummary ? (
            <p className="text-sm text-[hsl(var(--fg-muted))] italic">
              Summary unavailable — ensure GEMINI_API_KEY is set and articles are scraped.
            </p>
          ) : (
            <p className="text-sm text-[hsl(var(--fg))] leading-relaxed">
              {data.executiveSummary}
            </p>
          )}
        </div>

        {/* Category Highlights grid */}
        {(loading || cats.length > 0) && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-3">
              Category Highlights
            </p>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-[hsl(var(--bg-muted))] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {cats.map(cat => (
                  <a
                    key={cat}
                    href={`/tech-trends?category=${encodeURIComponent(cat)}`}
                    className={`flex items-start gap-2 p-3 rounded-lg border text-xs transition-all hover:opacity-80 ${CAT_COLORS[cat] ?? 'border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))]'}`}
                  >
                    <span className="flex-shrink-0 mt-0.5 text-[13px]">{CAT_EMOJIS[cat]}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-[9px] uppercase tracking-wider mb-0.5 opacity-70">{cat}</p>
                      <p className="leading-snug line-clamp-2 text-[11px]">{highlights[cat]}</p>
                    </div>
                    <ChevronRight size={10} className="flex-shrink-0 mt-1 ml-auto opacity-50" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
