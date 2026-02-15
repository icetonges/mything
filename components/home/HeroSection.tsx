import Link from 'next/link';
import { LINKS, SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function HeroSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-2">
          {SITE.owner}
        </h1>
        <p className="text-xl text-muted-foreground mb-2">{SITE.ownerTitle}</p>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          {SITE.description}
        </p>
        <Link
          href={LINKS.resume}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium',
            'bg-accent text-accent-foreground hover:opacity-90'
          )}
        >
          View Resume →
        </Link>
      </div>
    </section>
  );
}
