import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';
import { Tag, ArrowRight } from 'lucide-react';

interface NoteCardProps {
  id: string; date: Date; headline?: string | null; summary?: string | null;
  tags?: string[]; themes?: string[]; sentiment?: string | null; slug?: string | null;
  quickType?: string | null;
}

const QUICK_EMOJIS: Record<string, string> = { idea: '💡', trend: '📰', goal: '🎯', note: '📝', insight: '⚡' };

export function NoteCard({ id, date, headline, summary, tags, themes, sentiment, slug, quickType }: NoteCardProps) {
  return (
    <div className="card-base p-5 hover:border-orange-400/30 transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{QUICK_EMOJIS[quickType || 'note'] || '📝'}</span>
          <span className="text-xs text-muted-foreground">{formatDateShort(date)}</span>
          {sentiment && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{sentiment}</span>}
        </div>
        {slug && (
          <Link href={`/archive/${slug}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-accent">
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {headline && <p className="font-semibold text-foreground text-sm mb-2 leading-snug">{headline}</p>}
      {summary && <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{summary.split('\n')[0]}</p>}

      {(tags && tags.length > 0) && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Tag className="h-3 w-3 text-muted-foreground mt-0.5" />
          {tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded-md bg-orange-400/10 text-orange-400/80 border border-orange-400/20">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
