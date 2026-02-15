import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArchiveClient } from './ArchiveClient';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  const session = await auth();
  if (!session) redirect('/login');

  const notes = await prisma.dailyNote.findMany({
    where: { deleted: false },
    orderBy: { date: 'desc' },
    select: {
      id: true,
      date: true,
      headline: true,
      summary: true,
      slug: true,
      themes: true,
      tags: true,
      mood: true,
    },
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">Archive</h1>
        <p className="text-muted-foreground mb-8">Inventory of all notes and auto-summaries</p>
        <ArchiveClient notes={notes} />
      </div>
    </div>
  );
}
