import { prisma } from "@/lib/prisma";
import { Archive, Search, Tag, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface SearchProps { searchParams: Promise<{ q?: string; tag?: string }> }

export default async function ArchivePage({ searchParams }: SearchProps) {
  const { q, tag } = await searchParams;

  let notes: {
    id: string; date: Date; headline?: string|null; summary?: string|null;
    themes: string[]; sentiment?: string|null; slug?: string|null;
    quickType?: string|null; tags: string[]; mood?: number|null;
  }[] = [];
  
  let allTags: string[] = [];
  let totalCount = 0;

  try {
    const where = {
      deleted: false,
      ...(q ? { OR: [
        { content: { contains: q, mode: "insensitive" as const } },
        { headline: { contains: q, mode: "insensitive" as const } },
        { summary: { contains: q, mode: "insensitive" as const } },
      ]} : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    };

    [notes, totalCount] = await Promise.all([
      prisma.dailyNote.findMany({
        where, orderBy: { date: "desc" }, take: 50,
        select: { id:true, date:true, headline:true, summary:true, themes:true, sentiment:true, slug:true, quickType:true, tags:true, mood:true },
      }),
      prisma.dailyNote.count({ where: { deleted: false } }),
    ]);

    const allNotes = await prisma.dailyNote.findMany({ where: { deleted: false }, select: { tags: true } });
    const tagCount: Record<string, number> = {};
    allNotes.forEach(n => n.tags.forEach(t => { tagCount[t] = (tagCount[t] ?? 0) + 1; }));
    allTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 20).map(e => e[0]);
  } catch {}

  const SENTIMENT_DOT: Record<string, string> = {
    positive: "text-green-400", neutral: "text-blue-400",
    reflective: "text-purple-400", energized: "text-yellow-400", challenging: "text-red-400",
  };

  const grouped = notes.reduce((acc, n) => {
    const key = new Date(n.date).toLocaleDateString("en-US", { year: "numeric", month: "long" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {} as Record<string, typeof notes>);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
          <Archive size={20} className="text-slate-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Note Archive</h1>
          <p className="text-xs text-[hsl(var(--fg-muted))]">{totalCount} notes captured</p>
        </div>
      </div>

      {/* Search */}
      <form className="mb-6" method="get">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--fg-muted))]" />
          <input name="q" defaultValue={q} placeholder="Search notes, summaries, ideas…"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] text-sm focus:outline-none focus:border-[hsl(var(--accent)/0.5)]" />
        </div>
      </form>

      {/* Tag cloud */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-3 flex items-center gap-1">
            <Tag size={11} /> Popular Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {tag && <Link href="/archive" className="text-xs px-3 py-1 rounded-full bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors">✕ Clear</Link>}
            {allTags.map(t => (
              <Link key={t} href={`/archive?tag=${encodeURIComponent(t)}`}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${tag === t ? "gold-bg border-transparent" : "border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--accent)/0.4)]"}`}>
                #{t}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {notes.length === 0 ? (
        <div className="card p-10 text-center border-dashed">
          <Calendar size={36} className="text-[hsl(var(--fg-muted))] mx-auto mb-3" />
          <h3 className="font-semibold mb-2">{q || tag ? "No matching notes" : "No notes yet"}</h3>
          <p className="text-sm text-[hsl(var(--fg-muted))]">
            {q || tag ? "Try a different search or tag." : "Start capturing your daily thoughts in the Notes section."}
          </p>
          <Link href="/notes" className="inline-block mt-4 text-sm text-[hsl(var(--accent))] hover:underline">Go to Daily Notes →</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, monthNotes]) => (
            <div key={month}>
              <h2 className="font-display text-lg font-bold text-[hsl(var(--fg-muted))] mb-4 flex items-center gap-2">
                <Calendar size={16} /> {month}
                <span className="text-sm font-sans font-normal text-[hsl(var(--fg-muted))] ml-1">({monthNotes.length})</span>
              </h2>
              <div className="space-y-2">
                {monthNotes.map(n => (
                  <div key={n.id} className="card p-4 hover:border-[hsl(var(--accent)/0.2)] transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] text-[hsl(var(--fg-muted))]">{formatDate(n.date)}</span>
                          {n.quickType && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))]">{n.quickType}</span>}
                          {n.sentiment && <span className={`text-[10px] font-medium ${SENTIMENT_DOT[n.sentiment] ?? ""}`}>● {n.sentiment}</span>}
                          {n.mood && <span className="text-sm">{["😔","😐","🙂","😊","🚀"][n.mood - 1]}</span>}
                        </div>
                        {n.headline ? (
                          <h3 className="font-semibold text-sm mb-1">{n.headline}</h3>
                        ) : null}
                        {n.summary && (
                          <p className="text-xs text-[hsl(var(--fg-muted))] line-clamp-2">{n.summary.split("\n")[0]}</p>
                        )}
                        {n.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {n.tags.map(t => (
                              <Link key={t} href={`/archive?tag=${encodeURIComponent(t)}`}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--accent))] transition-colors">
                                #{t}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      {n.slug && (
                        <Link href={`/archive/${n.slug}`}
                          className="text-xs text-[hsl(var(--accent))] hover:underline flex-shrink-0">View →</Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
