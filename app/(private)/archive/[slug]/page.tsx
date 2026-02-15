import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ArchiveSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session) redirect('/login');

  const { slug } = await params;
  const note = await prisma.dailyNote.findFirst({
    where: { slug, deleted: false },
  });

  if (!note) notFound();

  const keyIdeas = note.keyIdeas ? (() => { try { return JSON.parse(note.keyIdeas) as string[]; } catch { return []; } })() : [];
  const actionItems = note.actionItems ? (() => { try { return JSON.parse(note.actionItems) as string[]; } catch { return []; } })() : [];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/archive" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← Archive
        </Link>
        <article className="space-y-6">
          <header>
            <p className="text-sm text-muted-foreground">{formatDate(note.date)}</p>
            <h1 className="font-display text-2xl font-bold mt-1">{note.headline || 'Untitled'}</h1>
          </header>
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap rounded-lg bg-card border border-muted p-6">
              {note.content}
            </div>
          </div>
          {note.summary && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Summary</h2>
              <div className="whitespace-pre-wrap text-muted-foreground">{note.summary}</div>
            </section>
          )}
          {keyIdeas.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Key ideas</h2>
              <ul className="list-disc list-inside space-y-1">
                {keyIdeas.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}
          {actionItems.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Action items</h2>
              <ul className="list-disc list-inside space-y-1">
                {actionItems.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}
          {note.themes.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Themes</h2>
              <div className="flex flex-wrap gap-2">
                {note.themes.map((t) => (
                  <span key={t} className="rounded bg-muted px-2 py-0.5 text-sm">
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}
          {note.sentiment && (
            <p className="text-sm text-muted-foreground">Sentiment: {note.sentiment}</p>
          )}
        </article>
      </div>
    </div>
  );
}
