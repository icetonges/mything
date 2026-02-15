import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Zap, ArrowRight } from 'lucide-react';
import { formatRelative, truncate } from '@/lib/utils';

const FALLBACK_ARTICLES = [
  { id: '1', title: 'Gemini 2.5 Pro brings advanced reasoning to Google AI ecosystem', source: 'Google Blog', category: 'AI/ML', summary: 'Google releases Gemini 2.5 Pro with enhanced reasoning capabilities and extended context windows for enterprise applications.', publishedAt: new Date(), url: 'https://blog.google' },
  { id: '2', title: 'Next.js 16 introduces Cache Components and Partial Pre-Rendering', source: 'Vercel Blog', category: 'Web Dev', summary: 'Next.js 16 ships with a new caching model, Cache Components, and major improvements to developer experience and routing.', publishedAt: new Date(), url: 'https://nextjs.org/blog' },
  { id: '3', title: 'Federal agencies accelerate AI adoption in financial management systems', source: 'FedScoop', category: 'Federal Tech', summary: 'OMB issues new guidance on AI integration in federal financial systems, with ADVANA and JUPITER platforms leading the transition.', publishedAt: new Date(), url: 'https://fedscoop.com' },
];

async function getLatestArticles() {
  try {
    return await prisma.techArticle.findMany({ orderBy: { publishedAt: 'desc' }, take: 3 });
  } catch { return FALLBACK_ARTICLES; }
}

export async function TechPulse() {
  const articles = await getLatestArticles();
  const items = articles.length > 0 ? articles : FALLBACK_ARTICLES;

  return (
    <section className="section-padding" style={{ background: 'hsl(224,40%,7%)' }}>
      <div className="content-max">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/30">
              <Zap className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-foreground">Tech Pulse</h2>
              <p className="text-sm text-muted-foreground">Latest from the tech world</p>
            </div>
          </div>
          <Link href="/tech-trends" className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            All trends <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map(article => (
            <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer"
              className="card-base p-5 hover:border-cyan-400/30 hover:scale-[1.02] group block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 font-medium">
                  {article.category}
                </span>
                <span className="text-xs text-muted-foreground">{formatRelative(article.publishedAt)}</span>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-2 leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {truncate(article.summary, 120)}
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{article.source}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
