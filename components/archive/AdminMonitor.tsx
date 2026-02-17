'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  Database, Activity, Users, MessageSquare, FileText, Newspaper,
  RefreshCw, Server, Shield, Zap, CheckCircle, AlertCircle,
  TrendingUp, Clock, Heart, ChevronDown, ChevronUp,
} from 'lucide-react';

interface MonitorData {
  generatedAt: string;
  db: {
    estimatedMB: number; limitMB: number; usedPct: number;
    provider: string;
    tables: { name: string; rows: number; sizeKB: number }[];
  };
  records: {
    notes: { total: number; active: number; deleted: number };
    articles: number; contacts: number; familyNotes: number; chatHistory: number;
  };
  activity: {
    notes24h: number; notes7d: number; notes30d: number;
    articles7d: number; chats24h: number;
    notesPerDay: Record<string, number>;
  };
  sentiment: { label: string; count: number }[];
  recentActivity: {
    notes: { id: string; time: string; label: string; type: string; sentiment: string | null }[];
    chats: { id: string; time: string; page: string; preview: string }[];
    contacts: { id: string; time: string; name: string; subject: string }[];
    articles: { id: string; time: string; title: string; source: string; category: string }[];
  };
  system: {
    platform: string; region: string; nodeVersion: string; env: string;
    scraperConfigured: boolean; geminiConfigured: boolean;
    authConfigured: boolean; emailConfigured: boolean;
  };
}

const SENTIMENT_COLOR: Record<string, string> = {
  positive: 'bg-green-500', neutral: 'bg-blue-500',
  reflective: 'bg-purple-500', energized: 'bg-yellow-500', challenging: 'bg-red-500',
};
const QUICK_EMOJI: Record<string, string> = {
  idea: '💡', trend: '📰', goal: '🎯', note: '📝', insight: '⚡',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminMonitor() {
  const [data, setData]         = useState<MonitorData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'system'>('overview');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/monitor');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setLastRefresh(new Date());
    } catch (e) {
      setError('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  // ── Sparkline ────────────────────────────────────────────────
  function Sparkline({ data: d }: { data: Record<string, number> }) {
    const vals = Object.values(d);
    const max = Math.max(...vals, 1);
    const w = 120; const h = 32;
    const pts = vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - (v / max) * (h - 4) - 2;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width={w} height={h} className="opacity-80">
        <polyline fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5"
          strokeLinejoin="round" strokeLinecap="round" points={pts} />
        {vals.map((v, i) => {
          const x = (i / (vals.length - 1)) * w;
          const y = h - (v / max) * (h - 4) - 2;
          return v > 0 ? <circle key={i} cx={x} cy={y} r="2.5" fill="hsl(var(--accent))" /> : null;
        })}
      </svg>
    );
  }

  // ── DB usage bar ────────────────────────────────────────────
  function UsageBar({ pct, color }: { pct: number; color: string }) {
    return (
      <div className="h-2 bg-[hsl(var(--bg-muted))] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    );
  }

  const dbColor = !data ? 'bg-slate-500'
    : data.db.usedPct > 80 ? 'bg-red-500'
    : data.db.usedPct > 50 ? 'bg-yellow-500'
    : 'bg-green-500';

  return (
    <div className="mb-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] overflow-hidden">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--bg-muted)/0.5)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[hsl(var(--accent)/0.12)] flex items-center justify-center">
            <Server size={14} className="text-[hsl(var(--accent))]" />
          </div>
          <span className="font-display font-bold text-sm">System Monitor</span>
          {!loading && !error && (
            <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <span className="text-[10px] text-[hsl(var(--fg-muted))]">
              Updated {timeAgo(lastRefresh.toISOString())}
            </span>
          )}
          <button onClick={fetch_} disabled={loading}
            className="p-1.5 rounded-lg hover:bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors disabled:opacity-40"
            title="Refresh">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-lg hover:bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))] transition-colors">
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>

      {collapsed ? null : loading && !data ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-[hsl(var(--fg-muted))]">
          <RefreshCw size={14} className="animate-spin" /> Loading metrics…
        </div>
      ) : error ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-red-400">
          <AlertCircle size={14} /> {error}
        </div>
      ) : data ? (
        <>
          {/* ── Tabs ─────────────────────────────────────── */}
          <div className="flex border-b border-[hsl(var(--border))] px-5">
            {(['overview', 'activity', 'system'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2.5 text-xs font-semibold capitalize border-b-2 transition-colors mr-1
                  ${activeTab === t
                    ? 'border-[hsl(var(--accent))] text-[hsl(var(--accent))]'
                    : 'border-transparent text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))]'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="p-5">

            {/* ════ OVERVIEW TAB ════════════════════════════ */}
            {activeTab === 'overview' && (
              <div className="space-y-5">

                {/* Row 1: DB Usage + Record Counts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                  {/* DB Storage */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--fg-muted))]">
                      Database Storage — {data.db.provider}
                    </p>
                    <div className="flex items-end justify-between mb-1">
                      <span className="text-2xl font-black">{data.db.estimatedMB} <span className="text-sm font-normal text-[hsl(var(--fg-muted))]">MB used</span></span>
                      <span className="text-sm text-[hsl(var(--fg-muted))]">{data.db.limitMB} MB limit · {data.db.usedPct}%</span>
                    </div>
                    <UsageBar pct={data.db.usedPct} color={dbColor} />

                    {/* Table breakdown */}
                    <div className="space-y-1.5 pt-1">
                      {data.db.tables.map(t => (
                        <div key={t.name} className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[hsl(var(--fg-muted))] w-32 flex-shrink-0">{t.name}</span>
                          <div className="flex-1 h-1 bg-[hsl(var(--bg-muted))] rounded-full overflow-hidden">
                            <div className="h-full bg-[hsl(var(--accent)/0.5)] rounded-full"
                              style={{ width: `${Math.min((t.sizeKB / (data.db.estimatedMB * 1024)) * 100, 100)}%` }} />
                          </div>
                          <span className="text-[10px] text-[hsl(var(--fg-muted))] w-12 text-right">{t.rows} rows</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Record Counts */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: FileText,      label: 'Active Notes',  value: data.records.notes.active,   color: 'text-orange-400 bg-orange-500/10' },
                      { icon: Newspaper,     label: 'Tech Articles', value: data.records.articles,        color: 'text-cyan-400 bg-cyan-500/10' },
                      { icon: MessageSquare, label: 'Chat Messages', value: data.records.chatHistory,     color: 'text-purple-400 bg-purple-500/10' },
                      { icon: Users,         label: 'Contacts',      value: data.records.contacts,        color: 'text-blue-400 bg-blue-500/10' },
                      { icon: Heart,         label: 'Family Notes',  value: data.records.familyNotes,     color: 'text-pink-400 bg-pink-500/10' },
                      { icon: Database,      label: 'Trash',         value: data.records.notes.deleted,   color: 'text-red-400 bg-red-500/10' },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className={`flex items-center gap-2.5 p-2.5 rounded-lg ${color.split(' ')[1]}`}>
                        <Icon size={14} className={color.split(' ')[0]} />
                        <div>
                          <p className="text-base font-black leading-none">{value}</p>
                          <p className="text-[10px] text-[hsl(var(--fg-muted))] mt-0.5">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 2: Activity Trend + Sentiment */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                  {/* Notes activity */}
                  <div className="p-4 rounded-xl bg-[hsl(var(--bg-muted))] border border-[hsl(var(--border))]">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--fg-muted))]">Note Activity</p>
                      <Sparkline data={data.activity.notesPerDay} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xl font-black text-[hsl(var(--accent))]">{data.activity.notes24h}</p>
                        <p className="text-[10px] text-[hsl(var(--fg-muted))]">Last 24h</p>
                      </div>
                      <div>
                        <p className="text-xl font-black">{data.activity.notes7d}</p>
                        <p className="text-[10px] text-[hsl(var(--fg-muted))]">Last 7d</p>
                      </div>
                      <div>
                        <p className="text-xl font-black">{data.activity.notes30d}</p>
                        <p className="text-[10px] text-[hsl(var(--fg-muted))]">Last 30d</p>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment breakdown */}
                  <div className="p-4 rounded-xl bg-[hsl(var(--bg-muted))] border border-[hsl(var(--border))]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-3">Sentiment Breakdown</p>
                    {data.sentiment.length === 0 ? (
                      <p className="text-xs text-[hsl(var(--fg-muted))]">No sentiment data yet</p>
                    ) : (
                      <div className="space-y-2">
                        {data.sentiment.map(s => {
                          const total = data.sentiment.reduce((a, b) => a + b.count, 0);
                          const pct = Math.round((s.count / total) * 100);
                          return (
                            <div key={s.label} className="flex items-center gap-2">
                              <span className="text-xs capitalize w-24 flex-shrink-0">{s.label}</span>
                              <div className="flex-1 h-1.5 bg-[hsl(var(--bg-card))] rounded-full overflow-hidden">
                                <div className={`h-full ${SENTIMENT_COLOR[s.label] ?? 'bg-slate-500'} rounded-full`}
                                  style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[10px] text-[hsl(var(--fg-muted))] w-12 text-right">{s.count} ({pct}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ════ ACTIVITY TAB ════════════════════════════ */}
            {activeTab === 'activity' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Recent Notes */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-3 flex items-center gap-1.5">
                    <FileText size={10} /> Recent Notes (7d)
                  </p>
                  <div className="space-y-1.5">
                    {data.recentActivity.notes.length === 0 ? (
                      <p className="text-xs text-[hsl(var(--fg-muted))]">No notes yet</p>
                    ) : data.recentActivity.notes.map(n => (
                      <div key={n.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-[hsl(var(--bg-muted))] text-xs">
                        <span className="flex-shrink-0 mt-0.5">{QUICK_EMOJI[n.type] ?? '📝'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{n.label}</p>
                          <p className="text-[hsl(var(--fg-muted))] text-[10px]">{timeAgo(n.time)}</p>
                        </div>
                        {n.sentiment && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full capitalize ${SENTIMENT_COLOR[n.sentiment] ?? 'bg-slate-500'} bg-opacity-20 text-[hsl(var(--fg-muted))]`}>
                            {n.sentiment}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat + Contacts + Articles */}
                <div className="space-y-4">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-2 flex items-center gap-1.5">
                      <MessageSquare size={10} /> AI Chat Sessions (24h) — {data.activity.chats24h} messages
                    </p>
                    <div className="space-y-1.5">
                      {data.recentActivity.chats.length === 0 ? (
                        <p className="text-xs text-[hsl(var(--fg-muted))]">No chat activity</p>
                      ) : data.recentActivity.chats.map(c => (
                        <div key={c.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-[hsl(var(--bg-muted))] text-xs">
                          <span className="text-purple-400 flex-shrink-0 mt-0.5">💬</span>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-[hsl(var(--fg-muted))]">&ldquo;{c.preview}…&rdquo;</p>
                            <p className="text-[10px] text-[hsl(var(--fg-muted))]">{c.page} · {timeAgo(c.time)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-2 flex items-center gap-1.5">
                      <Users size={10} /> Contact Form Submissions
                    </p>
                    {data.recentActivity.contacts.length === 0 ? (
                      <p className="text-xs text-[hsl(var(--fg-muted))]">No contacts yet</p>
                    ) : data.recentActivity.contacts.map(c => (
                      <div key={c.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-[hsl(var(--bg-muted))] text-xs mb-1.5">
                        <Users size={12} className="text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{c.name}</span>
                          <span className="text-[hsl(var(--fg-muted))]"> — {c.subject}</span>
                        </div>
                        <span className="text-[10px] text-[hsl(var(--fg-muted))] flex-shrink-0">{timeAgo(c.time)}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-2 flex items-center gap-1.5">
                      <Newspaper size={10} /> Scraped Articles (7d) — {data.activity.articles7d} new
                    </p>
                    {data.recentActivity.articles.map(a => (
                      <div key={a.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-[hsl(var(--bg-muted))] text-xs mb-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 flex-shrink-0">{a.category}</span>
                        <p className="flex-1 truncate text-[hsl(var(--fg-muted))]">{a.title}</p>
                        <span className="text-[10px] text-[hsl(var(--fg-muted))] flex-shrink-0">{timeAgo(a.time)}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ════ SYSTEM TAB ══════════════════════════════ */}
            {activeTab === 'system' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-3">Infrastructure</p>
                  {[
                    { label: 'Platform',     value: data.system.platform },
                    { label: 'Region',       value: data.system.region },
                    { label: 'Node.js',      value: data.system.nodeVersion },
                    { label: 'Environment',  value: data.system.env },
                    { label: 'Database',     value: data.db.provider },
                    { label: 'Generated At', value: new Date(data.generatedAt).toLocaleString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))] text-xs">
                      <span className="text-[hsl(var(--fg-muted))]">{label}</span>
                      <span className="font-mono font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-3">Service Health</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Database (Neon)',     ok: true },
                      { label: 'Auth (NextAuth)',      ok: data.system.authConfigured },
                      { label: 'AI (Gemini API)',      ok: data.system.geminiConfigured },
                      { label: 'Scraper Token',        ok: data.system.scraperConfigured },
                      { label: 'Email (Nodemailer)',   ok: data.system.emailConfigured },
                      { label: 'Vercel Deploy',        ok: true },
                    ].map(({ label, ok }) => (
                      <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--bg-muted))] border border-[hsl(var(--border))]">
                        <span className="text-sm">{label}</span>
                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${ok ? 'text-green-400' : 'text-red-400'}`}>
                          {ok
                            ? <><CheckCircle size={13} /> Configured</>
                            : <><AlertCircle size={13} /> Missing</>}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-[hsl(var(--accent)/0.06)] border border-[hsl(var(--accent)/0.2)] text-xs">
                    <p className="font-semibold mb-1 text-[hsl(var(--accent))]">Free Tier Limits</p>
                    <div className="space-y-1 text-[hsl(var(--fg-muted))]">
                      <p>Vercel — 100 GB bandwidth · 100h build/mo</p>
                      <p>Neon — 512 MB storage · 0.5 compute units</p>
                      <p>Gemini — 1M tokens/day free</p>
                      <p>GitHub Actions — 2,000 min/mo</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </>
      ) : null}
    </div>
  );
}
