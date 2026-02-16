import { PROJECTS } from "@/lib/projects";
import { LINKS } from "@/lib/constants";
import { Briefcase, ExternalLink, Github, Star } from "lucide-react";
import AIChatWidget from "@/components/ai/AIChatWidget";

export const revalidate = 86400;

const CAT_LABELS: Record<string, string> = {
  "federal-finance": "Federal Finance",
  "data-science": "Data Science",
  "ai-ml": "AI & ML",
  "full-stack": "Full Stack",
};
const CAT_COLORS: Record<string, string> = {
  "federal-finance": "text-green-400 bg-green-500/10",
  "data-science": "text-blue-400 bg-blue-500/10",
  "ai-ml": "text-purple-400 bg-purple-500/10",
  "full-stack": "text-yellow-400 bg-yellow-500/10",
};

export default function MyWorkPage() {
  const categories = ["federal-finance", "data-science", "ai-ml", "full-stack"] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Briefcase size={20} className="text-blue-400" />
          </div>
          <h1 className="font-display text-3xl font-bold">My Work</h1>
        </div>
        <p className="text-[hsl(var(--fg-muted))] max-w-2xl">Portfolio spanning federal financial management, data science, AI/ML research, and full-stack engineering.</p>
      </div>

      {/* CTA links */}
      <div className="flex flex-wrap gap-3 mb-12">
        {[
          { label: "Resume Site", href: LINKS.resume, icon: "📄" },
          { label: "GitHub (29+ repos)", href: LINKS.github, icon: "🐙" },
          { label: "Kaggle Profile", href: LINKS.kaggle, icon: "📊" },
          { label: "Portfolio", href: LINKS.portfolio, icon: "🌐" },
        ].map(l => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--accent)/0.4)] hover:bg-[hsl(var(--accent)/0.05)] transition-all text-sm font-medium">
            <span>{l.icon}</span> {l.label} <ExternalLink size={13} className="text-[hsl(var(--fg-muted))]" />
          </a>
        ))}
      </div>

      {/* Projects by category */}
      {categories.map(cat => {
        const catProjects = PROJECTS.filter(p => p.category === cat);
        if (!catProjects.length) return null;
        return (
          <section key={cat} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display text-xl font-bold">{CAT_LABELS[cat]}</h2>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${CAT_COLORS[cat]}`}>
                {catProjects.length} {catProjects.length === 1 ? "project" : "projects"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catProjects.map(p => (
                <div key={p.id} className="card p-5 flex flex-col hover:border-[hsl(var(--accent)/0.2)] transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${CAT_COLORS[p.category]}`}>
                        {CAT_LABELS[p.category]}
                      </span>
                      {p.featured && <span className="flex items-center gap-0.5 text-[10px] text-yellow-400"><Star size={10} fill="currentColor" /> Featured</span>}
                    </div>
                    <span className="text-xs text-[hsl(var(--fg-muted))]">{p.year}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{p.title}</h3>
                  <p className="text-xs text-[hsl(var(--fg-muted))] leading-relaxed flex-1 mb-3">{p.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.tech.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))]">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {p.links.map(l => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[hsl(var(--accent))] hover:underline">
                        {l.label} <ExternalLink size={11} />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* GitHub link */}
      <div className="card p-6 flex items-center justify-between border-dashed">
        <div className="flex items-center gap-3">
          <Github size={24} className="text-[hsl(var(--fg-muted))]" />
          <div>
            <p className="font-semibold text-sm">More on GitHub</p>
            <p className="text-xs text-[hsl(var(--fg-muted))]">29+ repositories — open source tools, experiments, and scripts</p>
          </div>
        </div>
        <a href={LINKS.github} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl gold-bg text-sm font-medium hover:opacity-90 transition-opacity">
          View GitHub <ExternalLink size={14} />
        </a>
      </div>

      <AIChatWidget page="my-work" />
    </div>
  );
}
