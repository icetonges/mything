import { prisma } from '@/lib/prisma';
import { PROJECTS } from '@/lib/projects';

async function getStats() {
  try {
    const [noteCount, lastNote] = await Promise.all([
      prisma.dailyNote.count({ where: { deleted: false } }),
      prisma.dailyNote.findFirst({ where: { deleted: false }, orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
    ]);
    const featuredCount = PROJECTS.filter((p) => p.featured).length;
    return {
      noteCount,
      projects: featuredCount,
      lastUpdated: lastNote?.updatedAt ?? null,
      daysJournaled: noteCount,
    };
  } catch {
    return { noteCount: 0, projects: PROJECTS.filter((p) => p.featured).length, lastUpdated: null, daysJournaled: 0 };
  }
}

export async function QuickStats() {
  const stats = await getStats();
  const lastStr = stats.lastUpdated
    ? new Date(stats.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-muted">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-8 justify-center text-center text-sm">
          <div>
            <span className="text-muted-foreground">Notes</span>
            <p className="text-xl font-semibold">{stats.noteCount}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Projects</span>
            <p className="text-xl font-semibold">{stats.projects}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Last updated</span>
            <p className="text-xl font-semibold">{lastStr}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Days journaled</span>
            <p className="text-xl font-semibold">{stats.daysJournaled}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
