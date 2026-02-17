import { prisma } from '@/lib/prisma';
import { formatDateShort } from '@/lib/utils';
import { Zap, ExternalLink, RefreshCw } from 'lucide-react';
import AIChatWidget from '@/components/ai/AIChatWidget';

export const revalidate = 1800;
const CATEGORIES = ['All', 'AI/ML', 'Cloud', 'Cybersecurity', 'Web Dev', 'Federal Tech', 'DoD Audit', 'DoD Budget', 'DoD Policy'];

type SearchParams = { category?: string };

export default async function TechTrendsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { category } = await searchParams;
  const cat = category ?? 'All';

  let articles: {id:string;title:string;url:string;source:string;category:string;summary:string;publishedAt:Date;createdAt:Date}[] = [];
  let lastUpdated: Date | null = null;
  try {
    articles = await prisma.techArticle.findMany({
      where: cat !== 'All' ? { category: cat } : undefined,
      orderBy: { publishedAt: 'desc' }, take: 50,
    });
    const l = await prisma.techArticle.findFirst({ orderBy: { createdAt: 'desc' } });
    lastUpdated = l?.createdAt ?? null;
  } catch {}

  const FEEDS = [
    { name:'Hacker News',         url:'https://news.ycombinator.com',                          cat:'Web Dev' },
    { name:'ArXiv CS.AI',         url:'https://arxiv.org/list/cs.AI/recent',                   cat:'AI/ML' },
    { name:'FedScoop',            url:'https://fedscoop.com',                                   cat:'Federal Tech' },
    { name:'Defense News',        url:'https://www.defensenews.com',                            cat:'Federal Tech' },
    { name:'Krebs Security',      url:'https://krebsonsecurity.com',                            cat:'Cybersecurity' },
    { name:'DoD OIG',             url:'https://www.dodig.mil/reports-and-publications/',        cat:'DoD Audit' },
    { name:'GAO Reports',         url:'https://www.gao.gov/reports-testimonies',                cat:'DoD Audit' },
    { name:'DoD Comptroller',     url:'https://comptroller.defense.gov',                        cat:'DoD Budget' },
    { name:'Federal News Network',url:'https://federalnewsnetwork.com/budget-and-finance/',     cat:'DoD Budget' },
    { name:'Breaking Defense',    url:'https://breakingdefense.com',                            cat:'DoD Policy' },
    { name:'Defense.gov News',    url:'https://www.defense.gov/News/',                          cat:'DoD Policy' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Zap size={20} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--fg-muted))]">{lastUpdated ? `Updated ${formatDateShort(lastUpdated)}` : 'Auto-updated daily'}</p>
            <h1 className="font-display text-3xl font-bold">Tech Trends</h1>
          </div>
        </div>
        <p className="text-[hsl(var(--fg-muted))] max-w-2xl">AI-aggregated emerging technology news from top sources. Updated daily via automated Python scraper + GitHub Actions.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(c => (
          <a key={c} href={c === 'All' ? '/tech-trends' : `/tech-trends?category=${encodeURIComponent(c)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${cat === c ? 'gold-bg' : 'border border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--accent)/0.4)]'}`}>
            {c}
          </a>
        ))}
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map(a => (
            <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer"
              className="card p-5 hover:border-[hsl(var(--accent)/0.3)] transition-all hover:-translate-y-1 group flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">{a.category}</span>
                <ExternalLink size={13} className="text-[hsl(var(--fg-muted))] group-hover:text-[hsl(var(--accent))] transition-colors" />
              </div>
              <h3 className="font-semibold text-sm mb-2 group-hover:text-[hsl(var(--accent))] transition-colors line-clamp-2 flex-1">{a.title}</h3>
              <p className="text-xs text-[hsl(var(--fg-muted))] line-clamp-3 mb-3">{a.summary}</p>
              <div className="flex items-center justify-between text-[10px] text-[hsl(var(--fg-muted))]">
                <span className="font-medium">{a.source}</span>
                <span>{formatDateShort(a.publishedAt)}</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="card p-8 border-dashed text-center">
          <RefreshCw size={32} className="text-[hsl(var(--fg-muted))] mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Content being aggregated</h3>
          <p className="text-sm text-[hsl(var(--fg-muted))] mb-6">The automated scraper runs daily. Browse these top sources directly:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
            {FEEDS.map(f => (
              <a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-[hsl(var(--border))] hover:border-[hsl(var(--accent)/0.4)] transition-all text-sm">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))]">{f.cat}</span>
                <span className="font-medium">{f.name}</span>
                <ExternalLink size={12} className="ml-auto text-[hsl(var(--fg-muted))]" />
              </a>
            ))}
          </div>
        </div>
      )}
      <AIChatWidget page="tech-trends" />
    </div>
  );
}
