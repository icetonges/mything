import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ArticleSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
  category: z.string(),
  summary: z.string(),
  // Accept both "Z" and "+00:00" timezone formats from Python's isoformat()
  publishedAt: z.string().datetime({ offset: true }),
});

const BodySchema = z.object({
  articles: z.array(ArticleSchema),
  token: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[Ingest] Received", body?.articles?.length ?? 0, "articles");

    const { articles, token } = BodySchema.parse(body);

    if (token !== process.env.SCRAPER_TOKEN) {
      console.error("[Ingest] Invalid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let created = 0;
    let skipped = 0;
    for (const a of articles) {
      try {
        await prisma.techArticle.upsert({
          where: { url: a.url },
          update: { summary: a.summary, category: a.category },
          create: { ...a, publishedAt: new Date(a.publishedAt) },
        });
        created++;
      } catch (err) {
        console.error("[Ingest] Failed article:", a.url, err);
        skipped++;
      }
    }

    console.log(`[Ingest] Done — created/updated: ${created}, skipped: ${skipped}`);
    return NextResponse.json({ success: true, created, skipped });
  } catch (err) {
    console.error("[Ingest] Parse error:", err);
    return NextResponse.json({ error: "Failed", detail: String(err) }, { status: 500 });
  }
}
