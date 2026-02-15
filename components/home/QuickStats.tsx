import { prisma } from '@/lib/prisma';
import { FileText, FolderOpen, Clock, BookOpen } from 'lucide-react';
import { PROJECTS } from '@/lib/projects';
import { formatRelative } from '@/lib/utils';

async function getStats() {
  try {
    const [noteCount, lastNote] = await Promise.all([
      prisma.dailyNote.count({ where: { deleted: false } }),
      prisma.dailyNote.findFirst({ where: { deleted: false }, orderBy: { createdAt: 'desc' } }),
    ]);
    const daysJournaled = noteCount;
    return { noteCount, lastUpdated: lastNote?.createdAt ?? null, daysJournaled };
  } catch {
    return { noteCount: 0, lastUpdated: null, daysJournaled: 0 };
  }
}

export async function QuickStats() {
  const { noteCount, lastUpdated, daysJournaled } = await getStats();

  const stats = [
    { icon: FileText, label: 'Notes Captured', value: noteCount.toString() },
    { icon: FolderOpen, label: 'Projects', value: PROJECTS.length.toString() + '+' },
    { icon: Clock, label: 'Last Updated', value: lastUpdated ? formatRelative(lastUpdated) : 'Today' },
    { icon: BookOpen, label: 'Days Journaled', value: daysJournaled.toString() },
  ];

  return (
    <section className="border-y border-border/50" style={{ background: 'hsl(224,40%,6%)' }}>
      <div className="content-max">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }, i) => (
            <div key={label} className={`flex flex-col items-center py-5 px-4 ${i < stats.length - 1 ? 'border-r border-border/30' : ''}`}>
              <Icon className="h-4 w-4 text-accent mb-1.5" />
              <span className="text-2xl font-bold text-foreground font-playfair">{value}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
