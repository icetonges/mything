import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/navigation';
import { LINKS, OWNER, CREDENTIALS } from '@/lib/constants';
import { FEATURED_PROJECTS } from '@/lib/projects';
import { prisma } from '@/lib/prisma';
import { formatDateShort } from '@/lib/utils';
import AIChatWidget from '@/components/ai/AIChatWidget';
import ContactSection from '@/components/home/ContactSection';
import PortfolioDashboard from '@/components/home/PortfolioDashboard';
import * as Icons from 'lucide-react';
import { ExternalLink, ArrowRight, Github, Award } from 'lucide-react';

export const revalidate = 3600;

function NavIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name];
  return Icon ? <Icon size={20} className="text-[hsl(var(--accent))]" /> : null;
}

const COLOR_MAP: Record<string, string> = {
  yellow: 'rgba(245,197,24,0.08)',
  cyan:   'rgba(6,182,212,0.08)',
  blue:   'rgba(59,130,246,0.08)',
  purple: 'rgba(168,85,247,0.08)',
  green:  'rgba(34,197,94,0.08)',
  orange: 'rgba(249,115,22,0.08)',
  pink:   'rgba(236,72,153,0.08)',
  slate:  'rgba(100,116,139,0.08)',
};

async function getStats() {
  try {
    const [noteCount, articleCount] = await Promise.all([
      prisma.dailyNote.count({ where: { deleted: false } }),
      prisma.techArticle.count(),
    ]);
    return { noteCount, articleCount, projectCount: FEATURED_PROJECTS.length };
  } catch { return { noteCount: 0, articleCount: 0, projectCount: FEATURED_PROJECTS.length }; }
}

async function getLatestArticles() {
  try {
    return await prisma.techArticle.findMany({ take: 3, orderBy: { publishedAt: 'desc' } });
  } catch { return []; }
}

export default async function HomePage() {
  const [stats, articles] = await Promise.all([getStats(), getLatestArticles()]);
  const publicTabs = NAV_ITEMS.filter(n => n.enabled && n.href !== '/');

  return (
    <div className="noise">

      {/* ── HERO — centered, compact ─────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[hsl(var(--border))]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[240px] rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, hsl(45 96% 54%) 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          {/* Avatar + title row — all centered */}
          <div className="flex flex-col items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl gold-bg flex items-center justify-center text-2xl font-black font-display">P</div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-2">
                <span className="text-[hsl(var(--fg))]">Peter Shang&apos;s </span>
                <span className="gold">Digital Space</span>
              </h1>
              <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed max-w-2xl mx-auto">{OWNER.tagline}</p>
            </div>
          </div>

          {/* Role badge */}
          <div className="flex justify-center mb-5">
            <span className="text-xs font-medium text-[hsl(var(--fg-muted))] border border-[hsl(var(--border))] px-4 py-1.5 rounded-full">
              AI Enabler · Federal Financial Manager · Data Scientist · GS-15
            </span>
          </div>

          {/* CTA buttons — centered */}
          <div className="flex flex-wrap justify-center gap-3 mb-5">
            <a href={LINKS.resume} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-bg font-semibold text-sm hover:opacity-90 transition-opacity">
              View Resume <ExternalLink size={14} />
            </a>
            <Link href="/my-work"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[hsl(var(--border))] font-semibold text-sm hover:border-[hsl(var(--accent)/0.5)] hover:bg-[hsl(var(--accent)/0.05)] transition-all">
              See My Work <ArrowRight size={14} />
            </Link>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] font-semibold text-sm hover:border-[hsl(var(--accent)/0.5)] transition-all">
              <Github size={14} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/petershang/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] font-semibold text-sm hover:border-[hsl(var(--accent)/0.5)] transition-all">
              LinkedIn
            </a>
          </div>

          {/* Credentials — centered */}
          <div className="flex flex-wrap justify-center gap-2">
            {CREDENTIALS.map(c => (
              <span key={c.label} title={c.full}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-[hsl(var(--bg-muted))] border border-[hsl(var(--border))] text-[hsl(var(--fg-muted))]">
                <Award size={11} className="text-[hsl(var(--accent))]" /> {c.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO DASHBOARD ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PortfolioDashboard stats={stats} articles={articles} />
      </section>

      {/* ── EXPLORE TABS ─────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[hsl(var(--border))]">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-1">Explore</p>
          <h2 className="font-display text-2xl font-bold">Everything in One Place</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {publicTabs.map(item => (
            <Link key={item.href} href={item.href}
              className="group card p-5 hover:border-[hsl(var(--accent)/0.3)] transition-all duration-300 hover:-translate-y-1"
              style={{ background: COLOR_MAP[item.color] ?? 'hsl(var(--bg-card))' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-[hsl(var(--bg-card))] flex items-center justify-center border border-[hsl(var(--border))]">
                  <NavIcon name={item.icon} />
                </div>
                <ArrowRight size={15} className="text-[hsl(var(--fg-muted))] group-hover:text-[hsl(var(--accent))] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-semibold text-sm mb-1 group-hover:text-[hsl(var(--accent))] transition-colors">{item.label}</h3>
              <p className="text-xs text-[hsl(var(--fg-muted))] leading-snug">{item.description}</p>
            </Link>
          ))}
          <div className="card p-5 border-dashed opacity-50">
            <div className="w-9 h-9 rounded-lg bg-[hsl(var(--bg-muted))] flex items-center justify-center mb-3 border border-[hsl(var(--border))]">
              <Icons.Lock size={16} className="text-[hsl(var(--fg-muted))]" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Private Spaces</h3>
            <p className="text-xs text-[hsl(var(--fg-muted))] leading-snug">Notes · Archive · Family — owner access only</p>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[hsl(var(--border))]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-1">Portfolio</p>
            <h2 className="font-display text-2xl font-bold">Featured Work</h2>
          </div>
          <Link href="/my-work" className="text-sm text-[hsl(var(--accent))] hover:underline flex items-center gap-1">
            All projects <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_PROJECTS.slice(0, 3).map(p => (
            <div key={p.id} className="card p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  p.category === 'federal-finance' ? 'bg-green-500/10 text-green-400'
                  : p.category === 'ai-ml' ? 'bg-purple-500/10 text-purple-400'
                  : p.category === 'data-science' ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-yellow-500/10 text-yellow-400'}`}>
                  {p.category.replace('-', ' ')}
                </span>
                <span className="text-[10px] text-[hsl(var(--fg-muted))]">{p.year}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">{p.title}</h3>
              <p className="text-xs text-[hsl(var(--fg-muted))] leading-relaxed flex-1 line-clamp-3">{p.description}</p>
              <div className="flex flex-wrap gap-1 mt-3 mb-3">
                {p.tech.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))]">{t}</span>
                ))}
                {p.tech.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-md bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))]">+{p.tech.length - 3}</span>}
              </div>
              <div className="flex gap-3">
                {p.links.slice(0, 2).map(l => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 text-[hsl(var(--accent))] hover:underline">
                    {l.label} <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <ContactSection />

      {/* ── AI WIDGET ────────────────────────────────────────── */}
      <AIChatWidget page="home" />
    </div>
  );
}
