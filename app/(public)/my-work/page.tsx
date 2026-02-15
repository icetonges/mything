import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';
import { LINKS } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export default function MyWorkPage() {
  const byCategory = {
    'federal-finance': PROJECTS.filter((p) => p.category === 'federal-finance'),
    'data-science': PROJECTS.filter((p) => p.category === 'data-science'),
    'full-stack': PROJECTS.filter((p) => p.category === 'full-stack'),
    'ai-ml': PROJECTS.filter((p) => p.category === 'ai-ml'),
  };
  const labels: Record<string, string> = {
    'federal-finance': 'Federal Financial Management',
    'data-science': 'Data Science',
    'full-stack': 'Full-Stack',
    'ai-ml': 'AI & ML',
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">My Work</h1>
        <p className="text-muted-foreground mb-8">Portfolio, GitHub, Kaggle, and resume</p>

        {(Object.keys(byCategory) as Array<keyof typeof byCategory>).map((cat) => {
          const list = byCategory[cat];
          if (list.length === 0) return null;
          return (
            <section key={cat} className="mb-12">
              <h2 className="text-xl font-semibold mb-4">{labels[cat]}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {list.map((p) => (
                  <Card key={p.id}>
                    <CardHeader>
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.tech.map((t) => (
                          <span key={t} className="text-xs rounded bg-muted px-2 py-0.5">
                            {t}
                          </span>
                        ))}
                      </div>
                    </CardHeader>
                    {p.links.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="flex gap-2">
                          {p.links.map((l) => (
                            <a
                              key={l.url}
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-accent hover:underline flex items-center gap-1"
                            >
                              {l.label}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">GitHub & Kaggle</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-muted bg-card px-4 py-2 hover:bg-muted"
            >
              GitHub (icetonges)
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={LINKS.kaggle}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-muted bg-card px-4 py-2 hover:bg-muted"
            >
              Kaggle Profile
              <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              href={LINKS.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-4 py-2 hover:opacity-90"
            >
              View Resume →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
