import { DailyNote } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface Props {
  notes: Pick<DailyNote, "id" | "date" | "headline" | "summary" | "themes" | "sentiment" | "slug" | "quickType" | "tags" | "mood">[];
}

const SENTIMENT_DOT: Record<string, string> = {
  positive: "text-green-400", neutral: "text-blue-400",
  reflective: "text-purple-400", energized: "text-yellow-400", challenging: "text-red-400",
};
const MOOD_EMOJI = ["😔", "😐", "🙂", "😊", "🚀"];

export default function Timeline({ notes }: Props) {
  if (!notes.length) {
    return (
      <div className="card p-10 border-dashed text-center">
        <Calendar size={36} className="text-[hsl(var(--fg-muted))] mx-auto mb-3" />
        <h3 className="font-semibold mb-2">No notes yet</h3>
        <p className="text-sm text-[hsl(var(--fg-muted))]">Start capturing your daily thoughts in the Notes section.</p>
        <Link href="/notes" className="inline-block mt-4 text-sm text-[hsl(var(--accent))] hover:underline">
          Go to Daily Notes →
        </Link>
      </div>
    );
  }

  // Group by month
  const grouped = notes.reduce((acc, n) => {
    const key = new Date(n.date).toLocaleDateString("en-US", { year: "numeric", month: "long" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {} as Record<string, typeof notes>);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([month, monthNotes]) => (
        <div key={month}>
          <h3 className="font-display text-base font-bold text-[hsl(var(--fg-muted))] mb-4 flex items-center gap-2">
            <Calendar size={14} /> {month}
            <span className="text-sm font-sans font-normal">({monthNotes.length})</span>
          </h3>
          <div className="space-y-2 border-l-2 border-[hsl(var(--border))] ml-1.5 pl-4">
            {monthNotes.map(n => (
              <div key={n.id} className="relative card p-4 hover:border-[hsl(var(--accent)/0.2)] transition-all">
                <div className="absolute -left-[21px] top-5 w-3 h-3 rounded-full border-2 border-[hsl(var(--accent))] bg-[hsl(var(--bg))]" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] text-[hsl(var(--fg-muted))]">{formatDate(n.date)}</span>
                      {n.quickType && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))]">{n.quickType}</span>}
                      {n.sentiment && <span className={`text-[10px] font-medium ${SENTIMENT_DOT[n.sentiment] ?? ""}`}>● {n.sentiment}</span>}
                      {n.mood && <span className="text-sm">{MOOD_EMOJI[n.mood - 1]}</span>}
                    </div>
                    {n.headline && <h4 className="font-semibold text-sm mb-1">{n.headline}</h4>}
                    {n.summary && (
                      <p className="text-xs text-[hsl(var(--fg-muted))] line-clamp-2">{n.summary.split("\n")[0]}</p>
                    )}
                    {(n.tags as string[]).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(n.tags as string[]).map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))]">#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {n.slug && (
                    <Link href={`/archive/${n.slug}`}
                      className="text-xs text-[hsl(var(--accent))] hover:underline flex-shrink-0">
                      View →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
