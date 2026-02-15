import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const articleSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
  category: z.string(),
  summary: z.string(),
  publishedAt: z.string().or(z.coerce.date()),
});

const bodySchema = z.object({
  articles: z.array(articleSchema),
  token: z.string(),
});

export async function POST(req: Request) {
  const token = process.env.SCRAPER_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Ingest not configured' }, { status: 503 });
  }
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success || parsed.data.token !== token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let created = 0;
    for (const a of parsed.data.articles) {
      const publishedAt = typeof a.publishedAt === 'string' ? new Date(a.publishedAt) : a.publishedAt;
      await prisma.techArticle.upsert({
        where: { url: a.url },
        create: {
          title: a.title,
          url: a.url,
          source: a.source,
          category: a.category,
          summary: a.summary,
          publishedAt,
        },
        update: {
          title: a.title,
          source: a.source,
          category: a.category,
          summary: a.summary,
          publishedAt,
        },
      });
      created++;
    }
    return NextResponse.json({ ok: true, created });
  } catch (e) {
    console.error('Ingest error:', e);
    return NextResponse.json({ error: 'Ingest failed' }, { status: 500 });
  }
}
