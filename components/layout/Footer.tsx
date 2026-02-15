import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/navigation';
import { LINKS, OWNER, SITE } from '@/lib/constants';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const publicNav = NAV_ITEMS.filter(n => n.access === 'public' && n.enabled);

  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg text-[hsl(var(--accent))]">
              <span className="text-xl">✦</span> {SITE.name}
            </Link>
            <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed max-w-xs">
              {OWNER.tagline}
            </p>
            <div className="flex gap-3 pt-1">
              <a href={LINKS.github}   target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--accent))] transition-colors"><Github size={18} /></a>
              <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--accent))] transition-colors"><Linkedin size={18} /></a>
              <a href={`mailto:${LINKS.email}`} className="text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--accent))] transition-colors"><Mail size={18} /></a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-4">Navigate</h3>
            <ul className="space-y-2">
              {publicNav.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-4">Connect</h3>
            <ul className="space-y-2">
              {[
                { label: 'Resume Site', url: LINKS.resume },
                { label: 'GitHub', url: LINKS.github },
                { label: 'Kaggle', url: LINKS.kaggle },
                { label: 'LinkedIn', url: LINKS.linkedin },
                { label: 'Portfolio', url: LINKS.portfolio },
              ].map(l => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors">
                    {l.label} <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[hsl(var(--border))] mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[hsl(var(--fg-muted))]">
          <span>© {new Date().getFullYear()} {OWNER.shortName}. All rights reserved.</span>
          <span>Built with Next.js 15 · Gemini 2.5 · Vercel</span>
        </div>
      </div>
    </footer>
  );
}
