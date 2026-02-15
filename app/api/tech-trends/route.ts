import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') ?? undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50);
    const cursor = searchParams.get('cursor') ?? undefined;

    const where = category && category !== 'All' ? { category } : {};
    const articles = await prisma.techArticle.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const nextCursor = articles.length > limit ? articles[limit - 1]?.id : null;
    const list = articles.slice(0, limit);
    return NextResponse.json({
      articles: list,
      nextCursor,
    });
  } catch (e) {
    console.error('Tech trends GET error:', e);
    return NextResponse.json({ articles: [], nextCursor: null });
  }
}
