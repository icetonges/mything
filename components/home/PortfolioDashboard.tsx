'use client';
import { useState } from 'react';
import { TrendingUp, Award, Code, Brain, Briefcase, Calendar, Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardProps {
  stats: { projectCount: number; noteCount: number; articleCount: number };
  articles?: { id: string; title: string; url: string; source: string; category: string; publishedAt: string | Date }[];
}

const TIMELINE = [
  { year: '2026', title: 'AI-Powered Full-Stack Dev',   desc: 'Built 2 production apps (6,300+ lines) in 24 hrs — MyThing platform & interactive resume', highlight: true },
  { year: '2025', title: 'Google AI Agents Intensive',  desc: 'Completed advanced AI agents course — agentic workflows, tool calling, prompt engineering' },
  { year: '2025', title: 'Master of Data Science',      desc: "Saint Peter's University — Capstone: Predictive analytics for federal budget forecasting" },
  { year: '2024', title: 'Pentagon GS-15 Manager',      desc: 'Managing $338B DoD budget portfolio — strategic planning, execution, audit readiness' },
  { year: '2022', title: 'M.S. Cybersecurity',          desc: 'University of Maryland — Federal systems security, risk management, FISMA compliance' },
  { year: '2020', title: 'M.S. Cyber Forensics',        desc: 'UMGC — Digital forensics, incident response, malware analysis' },
  { year: '2010', title: 'DoD Inspector General',       desc: 'Financial analyst — audited DoD programs, identified $50M+ in cost savings' },
  { year: '2008', title: 'U.S. Army Veteran',           desc: 'Served honorably — logistics, operations, leadership' },
];

const SKILLS = [
  { category: 'Federal Finance', level: 95, color: 'bg-green-500',  items: ['OMB A-11/A-123', 'FIAR', 'CFO Act', 'DoD FMR', 'FASAB'] },
  { category: 'Data Science',    level: 90, color: 'bg-blue-500',   items: ['Python', 'Pandas', 'Scikit-learn', 'Tableau', 'SQL'] },
  { category: 'Full-Stack Dev',  level: 85, color: 'bg-purple-500', items: ['Next.js 15', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL'] },
  { category: 'AI / ML',         level: 88, color: 'bg-yellow-500', items: ['Gemini API', 'Prompt Eng.', 'RAG', 'Agentic AI', 'XGBoost'] },
  { category: 'Cloud & DevOps',  level: 80, color: 'bg-cyan-500',   items: ['Vercel', 'AWS', 'GitHub Actions', 'Docker', 'Neon DB'] },
];

const ACHIEVEMENTS = [
  { icon: '💰', title: '$338B Portfolio',      desc: 'DoD budget execution, strategic planning & Congressional justifications at the Pentagon' },
  { icon: '⚡', title: '24-Hour Build Sprint', desc: '2 production full-stack apps · 6,300 lines · AI-powered at zero cost' },
  { icon: '🎓', title: '5 Advanced Degrees',   desc: 'Data Science · Cybersecurity (2×) · Cyber Forensics · MBA' },
  { icon: '🏅', title: '15+ Yrs Federal',      desc: 'Pentagon · DoD OIG · U.S. Army — mission-critical leadership' },
];

export default function PortfolioDashboard({ stats, articles = [] }: DashboardProps) {
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  const [activeSkill, setActiveSkill]         = useState<number | null>(null);

  const visibleTimeline = showAllTimeline ? TIMELINE : TIMELINE.slice(0, 4);

  return (
    <div className="space-y-4">

      {/* ── ROW 1: Stats ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Code}       label="Projects"      value={`${stats.projectCount}+`} color="yellow" />
        <StatCard icon={Brain}      label="Notes Logged"  value={stats.noteCount}           color="blue"   />
        <StatCard icon={Github}     label="GitHub Repos"  value="29+"                       color="green"  />
        <StatCard icon={TrendingUp} label="Tech Articles" value={stats.articleCount}        color="purple" />
      </div>

      {/* ── ROW 2: Skills + Achievements ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Expertise Matrix */}
        <div className="card p-5">
          <h3 className="font-display text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[hsl(var(--accent))]">
            <Award size={14} /> Expertise Matrix
          </h3>
          <div className="space-y-3">
            {SKILLS.map((skill, i) => (
              <div key={skill.category}>
                <div className="flex items-center justify-between mb-1">
                  <button
                    onClick={() => setActiveSkill(activeSkill === i ? null : i)}
                    className="flex items-center gap-1.5 text-sm font-medium hover:text-[hsl(var(--accent))] transition-colors">
                    {skill.category}
                    {activeSkill === i ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  </button>
                  <span className="text-xs text-[hsl(var(--fg-muted))] font-mono">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-[hsl(var(--bg-muted))] rounded-full overflow-hidden">
                  <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.level}%` }} />
                </div>
                {activeSkill === i && (
                  <div className="mt-2 flex flex-wrap gap-1.5 pt-1">
                    {skill.items.map(item => (
                      <span key={item} className="text-xs px-2 py-0.5 rounded bg-[hsl(var(--bg-muted))] border border-[hsl(var(--border))] text-[hsl(var(--fg-muted))]">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Impact & Recognition */}
        <div className="card p-5">
          <h3 className="font-display text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[hsl(var(--accent))]">
            <Briefcase size={14} /> Impact & Recognition
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ACHIEVEMENTS.map(a => (
              <div key={a.title}
                className="flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--bg-muted))] border border-[hsl(var(--border))] hover:border-[hsl(var(--accent)/0.3)] transition-all">
                <span className="text-lg flex-shrink-0 leading-none mt-0.5">{a.icon}</span>
                <div>
                  <p className="font-semibold text-xs mb-0.5">{a.title}</p>
                  <p className="text-[11px] text-[hsl(var(--fg-muted))] leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Career Timeline ────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-[hsl(var(--accent))]">
            <Calendar size={14} /> Career Timeline
          </h3>
          <button
            onClick={() => setShowAllTimeline(!showAllTimeline)}
            className="text-xs text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--accent))] flex items-center gap-1 transition-colors">
            {showAllTimeline ? 'Show Less' : 'View All'}
            {showAllTimeline ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>

        {/* Horizontal timeline line */}
        <div className="relative">
          <div className="absolute top-[18px] left-0 right-0 h-px bg-gradient-to-r from-[hsl(var(--accent))] via-[hsl(var(--accent)/0.3)] to-transparent pointer-events-none" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {visibleTimeline.map((item, i) => (
              <div key={i} className="relative pt-9">
                {/* Dot */}
                <div className={`absolute top-2.5 left-0 w-4 h-4 rounded-full border-2 border-[hsl(var(--bg-card))]
                  ${item.highlight ? 'bg-gradient-to-br from-yellow-400 to-orange-400' : 'bg-[hsl(var(--accent))]'}`}>
                  {item.highlight && <span className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                </div>

                <div className={`rounded-lg p-3 h-full border transition-all hover:border-[hsl(var(--accent)/0.3)]
                  ${item.highlight ? 'border-yellow-500/30 bg-yellow-500/5' : 'bg-[hsl(var(--bg-muted))] border-transparent'}`}>
                  <div className="flex flex-wrap items-center gap-1 mb-1">
                    <span className="text-[10px] font-bold text-[hsl(var(--accent))]">{item.year}</span>
                    {item.highlight && (
                      <span className="text-[9px] px-1 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold leading-tight">Latest</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-xs mb-1 leading-tight">{item.title}</h4>
                  <p className="text-[11px] text-[hsl(var(--fg-muted))] leading-relaxed line-clamp-3">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 4: Mini Tech Pulse (3 latest articles) ────── */}
      {articles.length > 0 && (
        <div className="card p-5">
          <h3 className="font-display text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[hsl(var(--accent))]">
            <TrendingUp size={14} /> Latest Tech Pulse
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {articles.slice(0, 3).map(a => (
              <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer"
                className="flex flex-col gap-1.5 p-3 rounded-lg bg-[hsl(var(--bg-muted))] border border-[hsl(var(--border))] hover:border-[hsl(var(--accent)/0.3)] transition-all group">
                <p className="text-xs font-medium line-clamp-2 group-hover:text-[hsl(var(--accent))] transition-colors leading-snug">{a.title}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--fg-muted))] mt-auto">
                  <span className="px-1.5 py-0.5 rounded bg-[hsl(var(--bg-card))] border border-[hsl(var(--border))]">{a.source}</span>
                  <span>·</span>
                  <span>{new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <ExternalLink size={10} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; value: string | number; color: string;
}) {
  const styles: Record<string, string> = {
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    blue:   'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green:  'bg-green-500/10 border-green-500/20 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  };
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${styles[color]}`}>
      <Icon size={18} className="flex-shrink-0" />
      <div>
        <p className="text-xl font-black leading-none">{value}</p>
        <p className="text-[11px] text-[hsl(var(--fg-muted))] mt-0.5">{label}</p>
      </div>
    </div>
  );
}
