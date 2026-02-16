import Link from 'next/link';
import { LINKS, OWNER } from '@/lib/constants';
import { Github, Linkedin, BookOpen, FileText, ExternalLink } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, hsl(224,40%,3%) 0%, hsl(224,40%,5%) 100%)' }}>
      <div className="content-max text-center py-8">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-medium tracking-wider uppercase">
          Personal Knowledge Hub
        </div>
        <h1 className="font-playfair text-5xl md:text-7xl font-bold text-gradient mb-4 leading-tight">
          Peter&apos;s Space
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-playfair italic mb-2">
          {OWNER.name}
        </p>
        <p className="text-sm text-muted-foreground mb-2 tracking-widest uppercase">{OWNER.tagline}</p>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Federal financial management · Data science · Cybersecurity · AI engineering.
          This is where ideas are captured, knowledge grows, and work is showcased.
        </p>

        {/* Qualification badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['Data Science, M.S.', 'Cybersecurity, M.S.', 'Cyber Forensics, M.S.', 'CDFM', 'IBM Data Science', 'Agentic AI'].map(badge => (
            <span key={badge} className="px-3 py-1 rounded-full text-xs border border-border bg-muted/50 text-muted-foreground">
              {badge}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <a href={LINKS.resume} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all hover:scale-105">
            <FileText className="h-4 w-4" /> View Resume
          </a>
          <Link href="/my-work"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:bg-muted hover:border-accent/50 transition-all font-medium">
            <ExternalLink className="h-4 w-4" /> See My Work
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
          {[
            { href: LINKS.github,   Icon: Github,   label: 'GitHub (29 repos)' },
            { href: LINKS.kaggle,   Icon: BookOpen, label: 'Kaggle' },
            { href: LINKS.linkedin, Icon: Linkedin, label: 'LinkedIn' },
          ].map(({ href, Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
              <Icon className="h-4 w-4" /> {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
