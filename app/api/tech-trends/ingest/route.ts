import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ArticleSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
  category: z.string(),
  summary: z.string(),
  publishedAt: z.string().datetime(),
});

const BodySchema = z.object({
  articles: z.array(ArticleSchema),
  token: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { articles, token } = BodySchema.parse(body);

    if (token !== process.env.SCRAPER_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let created = 0;
    for (const a of articles) {
      try {
        await prisma.techArticle.upsert({
          where: { url: a.url },
          update: { summary: a.summary, category: a.category },
          create: { ...a, publishedAt: new Date(a.publishedAt) },
        });
        created++;
      } catch {}
    }

    return NextResponse.json({ success: true, created });
  } catch (_err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
