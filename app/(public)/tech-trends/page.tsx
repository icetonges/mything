import { TechTrendsClient } from './TechTrendsClient';
import { prisma } from '@/lib/prisma';

async function getCategories() {
  const articles = await prisma.techArticle.findMany({ select: { category: true } });
  const set = new Set(articles.map((a) => a.category).filter(Boolean));
  return ['All', 'AI/ML', 'Cloud', 'Cybersecurity', 'Federal Tech', 'Web Dev', ...Array.from(set)].filter(
    (c, i, arr) => arr.indexOf(c) === i
  );
}

export const revalidate = 1800;

export default async function TechTrendsPage() {
  const categories = await getCategories();
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">Tech Trends</h1>
        <p className="text-muted-foreground mb-8">Emerging tech from top sources</p>
        <TechTrendsClient categories={categories} />
      </div>
    </div>
  );
}
