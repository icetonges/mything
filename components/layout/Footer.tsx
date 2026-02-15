import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/navigation';
import { LINKS, SITE } from '@/lib/constants';

export function Footer() {
  const links = NAV_ITEMS.filter((n) => n.enabled).map((n) => ({ label: n.label, href: n.href }));

  return (
    <footer className="border-t border-muted bg-card/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-6 justify-center mb-6">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {SITE.owner}. Built with Next.js, Vercel, and AI.</p>
          <p className="mt-1">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              GitHub
            </a>
            {' · '}
            <a href={LINKS.resume} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              Resume
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
