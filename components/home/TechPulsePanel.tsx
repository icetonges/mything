'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, ExternalLink, Brain, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  category: string;
  summary: string;
  publishedAt: string | Date;
}

interface SummaryData {
  executiveSummary: string | null;
  categoryHighlights: Record<string, string>;
  categoryCounts: Record<string, number>;
  generatedAt: string;
  articleCount: number;
}

interface Props {
  articles: Article[];
}

const ALL_CATEGORIES = [
  'All', 'AI/ML', 'Cloud', 'Cybersecurity', 'Web Dev',
  'Federal Tech', 'DoD Audit', 'DoD Budget', 'DoD Policy',
];

const CAT_COLORS: Record<string, string> = {
  'AI/ML':        'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Cloud':        'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Cybersecurity':'bg-red-500/10 text-red-400 border-red-500/20',
  'Web Dev':      'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Federal Tech': 'bg-green-500/10 text-green-400 border-green-500/20',
  'DoD Audit':    'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'DoD Budget':   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'DoD Policy':   'bg-teal-500/10 text-teal-400 border-teal-500/20',
};

const CAT_EMOJIS: Record<string, string> = {
  'AI/ML': '🤖', 'Cloud': '☁️', 'Cybersecurity': '🔒',
  'Web Dev': '💻', 'Federal Tech': '🏛️',
  'DoD Audit': '📋', 'DoD Budget': '💰', 'DoD Policy': '📜',
};

function timeAgo(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TechPulsePanel({ articles }: Props) {
  const [activeTab, setActiveTab]     = useState('All');
  const [summary, setSummary]         = useState<SummaryData | null>(null);
  const [loadingSummary, setLoading]  = useState(true);
  const [summaryError, setSummaryError] = useState(false);

  // Fetch AI summary once on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchSummary() {
      try {
        const res = await fetch('/api/tech-pulse/summary');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (!cancelled) setSummary(data);
      } catch {
        if (!cancelled) setSummaryError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSummary();
    return () => { cancelled = true; };
  }, []);

  // Filter articles by active tab
  const filtered = activeTab === 'All'
    ? articles
    : articles.filter(a => a.category === activeTab);

  // Only show tabs that have articles
  const activeCats = ALL_CATEGORIES.filter(cat =>
    cat === 'All' || articles.some(a => a.category === cat)
  );

  const execSummary = summary?.executiveSummary;
  const highlights  = summary?.categoryHighlights ?? {};
  const counts      = summary?.categoryCounts ?? {};

  return (
    <div className="card overflow-hidden">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-display text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-[hsl(var(--accent))]">
          <TrendingUp size={14} /> Latest Tech Pulse
        </h3>
        {summary?.generatedAt && (
          <span className="text-[10px] text-[hsl(var(--fg-muted))] flex items-center gap-1">
            <Brain size={10} className="text-[hsl(var(--accent))]" />
            AI summary · {new Date(summary.generatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* ── Executive Summary ────────────────────────────────── */}
      <div className="mx-5 mb-4 rounded-xl border border-[hsl(var(--accent)/0.2)] bg-[hsl(var(--accent)/0.04)] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={13} className="text-[hsl(var(--accent))]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
            AI Executive Summary
          </span>
          {loadingSummary && <RefreshCw size={10} className="animate-spin text-[hsl(var(--fg-muted))]" />}
        </div>

        {loadingSummary ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-3 rounded-full bg-[hsl(var(--bg-muted))] animate-pulse"
                style={{ width: `${[95, 88, 72][i - 1]}%` }} />
            ))}
          </div>
        ) : summaryError || !execSummary ? (
          <p className="text-xs text-[hsl(var(--fg-muted))] italic">
            Summary unavailable — ensure GEMINI_API_KEY is configured and articles are scraped.
          </p>
        ) : (
          <p className="text-sm text-[hsl(var(--fg))] leading-relaxed">{execSummary}</p>
        )}
      </div>

      {/* ── Category Tabs ────────────────────────────────────── */}
      <div className="px-5 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {activeCats.map(cat => {
            const count = cat === 'All' ? articles.length : (counts[cat] ?? articles.filter(a => a.category === cat).length);
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                  ${isActive
                    ? 'gold-bg border-transparent text-black font-bold'
                    : 'border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--accent)/0.4)] hover:text-[hsl(var(--fg))]'
                  }`}
              >
                {cat !== 'All' && <span className="text-[11px]">{CAT_EMOJIS[cat]}</span>}
                {cat}
                {count > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold
                    ${isActive ? 'bg-black/20' : 'bg-[hsl(var(--bg-muted))]'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Category Highlight ───────────────────────────────── */}
      {activeTab !== 'All' && (
        <div className="mx-5 mb-4">
          {loadingSummary ? (
            <div className="h-3 w-3/4 rounded-full bg-[hsl(var(--bg-muted))] animate-pulse" />
          ) : highlights[activeTab] ? (
            <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border text-xs ${CAT_COLORS[activeTab] ?? 'border-[hsl(var(--border))] text-[hsl(var(--fg-muted))]'}`}>
              <ChevronRight size={12} className="flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{highlights[activeTab]}</span>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Article Grid ─────────────────────────────────────── */}
      <div className="px-5 pb-5">
        {filtered.length === 0 ? (
          <p className="text-xs text-[hsl(var(--fg-muted))] text-center py-4">
            No articles in this category yet — run the scraper to populate.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {filtered.slice(0, 6).map(a => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-2 p-3 rounded-lg bg-[hsl(var(--bg-muted))] border border-[hsl(var(--border))] hover:border-[hsl(var(--accent)/0.3)] transition-all group"
              >
                {/* Category badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${CAT_COLORS[a.category] ?? 'border-[hsl(var(--border))] text-[hsl(var(--fg-muted))]'}`}>
                    {CAT_EMOJIS[a.category]} {a.category}
                  </span>
                  <ExternalLink size={10} className="text-[hsl(var(--fg-muted))] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Title */}
                <p className="text-xs font-medium line-clamp-2 group-hover:text-[hsl(var(--accent))] transition-colors leading-snug flex-1">
                  {a.title}
                </p>

                {/* AI summary */}
                {a.summary && (
                  <p className="text-[10px] text-[hsl(var(--fg-muted))] line-clamp-2 leading-relaxed">
                    {a.summary}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--fg-muted))] mt-auto pt-1 border-t border-[hsl(var(--border))]">
                  <span className="truncate">{a.source}</span>
                  <span className="ml-auto flex-shrink-0">{timeAgo(a.publishedAt)}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Show more link if > 6 */}
        {filtered.length > 6 && (
          <div className="text-center mt-3">
            <a href="/tech-trends" className="text-xs text-[hsl(var(--accent))] hover:underline flex items-center justify-center gap-1">
              View all {filtered.length} {activeTab !== 'All' ? activeTab : ''} articles
              <ChevronRight size={12} />
            </a>
          </div>
        )}
      </div>

    </div>
  );
}
