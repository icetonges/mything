import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Trash2, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getDeletedNotes() {
  const session = await auth();
  if (!session) redirect("/login");

  const notes = await prisma.dailyNote.findMany({
    where: { deleted: true },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return notes;
}

export default async function TrashPage() {
  const notes = await getDeletedNotes();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link 
          href="/archive" 
          className="inline-flex items-center gap-2 text-sm text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--accent))] mb-4">
          <ArrowLeft size={14} /> Back to Archive
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Trash2 size={20} className="text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Trash</h1>
            <p className="text-xs text-[hsl(var(--fg-muted))]">
              {notes.length} deleted note{notes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="card p-12 text-center">
          <Trash2 size={48} className="text-[hsl(var(--fg-muted))] mx-auto mb-4 opacity-50" />
          <p className="text-[hsl(var(--fg-muted))]">No deleted notes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <TrashNoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

function TrashNoteCard({ note }: { note: any }) {
  return (
    <div className="card p-4 opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[hsl(var(--fg-muted))]">{formatDateShort(note.date)}</span>
            {note.sentiment && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {note.sentiment}
              </span>
            )}
          </div>
          
          {note.headline && (
            <p className="font-semibold text-sm mb-1">{note.headline}</p>
          )}
          
          {note.summary && (
            <p className="text-xs text-[hsl(var(--fg-muted))] line-clamp-2">
              {note.summary.split('\n')[0]}
            </p>
          )}
        </div>

        <form action={async () => {
          'use server';
          await prisma.dailyNote.update({
            where: { id: note.id },
            data: { deleted: false },
          });
        }}>
          <button 
            type="submit"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-500/20 bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20 transition-colors">
            <RotateCcw size={12} /> Restore
          </button>
        </form>
      </div>
    </div>
  );
}
