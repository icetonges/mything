import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export const dynamic = "force-dynamic";

export default async function NoteArchivePage({ params }: Props) {
  const { slug } = await params;
  
  let note: {
    id: string; date: Date; content: string; headline?: string|null;
    summary?: string|null; keyIdeas?: string|null; actionItems?: string|null;
    themes: string[]; sentiment?: string|null; tags: string[];
    mood?: number|null; quickType?: string|null;
  } | null = null;
  
  try {
    note = await prisma.dailyNote.findUnique({
      where: { slug, deleted: false },
      select: {
        id:true, date:true, content:true, headline:true, summary:true,
        keyIdeas:true, actionItems:true, themes:true, sentiment:true,
        tags:true, mood:true, quickType:true,
      },
    });
  } catch { notFound(); }

  if (!note) notFound();

  const keyIdeas: string[] = note.keyIdeas ? JSON.parse(note.keyIdeas) : [];
  const actionItems: string[] = note.actionItems ? JSON.parse(note.actionItems) : [];
  const MOOD_EMOJI = ["😔","😐","🙂","😊","🚀"];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/archive" className="flex items-center gap-2 text-sm text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors mb-6">
          <ArrowLeft size={14} /> Back to Archive
        </Link>
        <div className="flex items-center gap-2 text-xs text-[hsl(var(--fg-muted))] mb-3 flex-wrap">
          <Calendar size={12} />
          <span>{formatDate(note.date)}</span>
          {note.quickType && <span className="px-2 py-0.5 rounded bg-[hsl(var(--bg-muted))]">{note.quickType}</span>}
          {note.mood && <span>{MOOD_EMOJI[note.mood - 1]}</span>}
          {note.sentiment && <span className="capitalize">● {note.sentiment}</span>}
        </div>
        {note.headline && (
          <h1 className="font-display text-3xl font-bold leading-tight mb-2">{note.headline}</h1>
        )}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {note.tags.map(t => (
              <Link key={t} href={`/archive?tag=${encodeURIComponent(t)}`}
                className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--bg-muted))] border border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--accent))] transition-colors">
                #{t}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* AI Summary */}
        {note.summary && (
          <div className="card p-5 border-[hsl(var(--accent)/0.2)] bg-[hsl(var(--accent)/0.03)]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-3">AI Executive Summary</p>
            <div className="space-y-1">
              {note.summary.split("\n").map((line, i) => (
                <p key={i} className="text-sm leading-relaxed">{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Key Ideas + Actions */}
        {(keyIdeas.length > 0 || actionItems.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyIdeas.length > 0 && (
              <div className="card p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-3">Key Ideas</p>
                <ul className="space-y-2">
                  {keyIdeas.map((idea, i) => (
                    <li key={i} className="flex gap-2 text-sm"><span className="text-[hsl(var(--accent))]">→</span>{idea}</li>
                  ))}
                </ul>
              </div>
            )}
            {actionItems.length > 0 && (
              <div className="card p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-3">Action Items</p>
                <ul className="space-y-2">
                  {actionItems.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm"><span className="text-orange-400">☐</span>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Raw note */}
        <div className="card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-3">Original Note</p>
          <div className="prose-note text-sm leading-relaxed whitespace-pre-wrap">{note.content}</div>
        </div>

        {/* Themes */}
        {note.themes.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <Tag size={13} className="text-[hsl(var(--fg-muted))]" />
            {note.themes.map(t => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
