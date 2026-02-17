import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // ── Record counts ──────────────────────────────────────────
    const [
      totalNotes,
      activeNotes,
      deletedNotes,
      totalArticles,
      totalContacts,
      totalFamilyNotes,
      totalChatHistory,
      notes24h,
      notes7d,
      notes30d,
      articles7d,
      chats24h,
    ] = await Promise.all([
      prisma.dailyNote.count(),
      prisma.dailyNote.count({ where: { deleted: false } }),
      prisma.dailyNote.count({ where: { deleted: true } }),
      prisma.techArticle.count(),
      prisma.contact.count(),
      prisma.familyNote.count(),
      prisma.chatHistory.count(),
      prisma.dailyNote.count({ where: { createdAt: { gte: last24h } } }),
      prisma.dailyNote.count({ where: { createdAt: { gte: last7d } } }),
      prisma.dailyNote.count({ where: { createdAt: { gte: last30d } } }),
      prisma.techArticle.count({ where: { createdAt: { gte: last7d } } }),
      prisma.chatHistory.count({ where: { createdAt: { gte: last24h } } }),
    ]);

    // ── Sentiment breakdown ────────────────────────────────────
    const sentimentGroups = await prisma.dailyNote.groupBy({
      by: ["sentiment"],
      _count: { sentiment: true },
      where: { deleted: false, sentiment: { not: null } },
    });

    // ── Recent activity log ────────────────────────────────────
    const [recentNotes, recentChats, recentContacts, recentArticles] = await Promise.all([
      prisma.dailyNote.findMany({
        where: { createdAt: { gte: last7d } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, createdAt: true, headline: true, quickType: true, sentiment: true },
      }),
      prisma.chatHistory.findMany({
        where: { createdAt: { gte: last24h }, role: "user" },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, createdAt: true, page: true, content: true },
      }),
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, createdAt: true, name: true, subject: true },
      }),
      prisma.techArticle.findMany({
        where: { createdAt: { gte: last7d } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, createdAt: true, title: true, source: true, category: true },
      }),
    ]);

    // ── Notes per day (last 7 days for sparkline) ──────────────
    const notesPerDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      notesPerDay[d.toISOString().split("T")[0]] = 0;
    }
    const recentDayNotes = await prisma.dailyNote.findMany({
      where: { createdAt: { gte: last7d } },
      select: { createdAt: true },
    });
    recentDayNotes.forEach(n => {
      const key = n.createdAt.toISOString().split("T")[0];
      if (key in notesPerDay) notesPerDay[key]++;
    });

    // ── Estimate DB row count as rough size proxy ──────────────
    // Neon free tier = 512MB. Rough estimate: avg note ~2KB, article ~1KB, chat ~0.5KB
    const estimatedMB = (
      totalNotes * 2 +
      totalArticles * 1 +
      totalChatHistory * 0.5 +
      totalContacts * 0.5 +
      totalFamilyNotes * 1
    ) / 1024;
    const dbLimitMB = 512;
    const dbUsedPct = Math.min((estimatedMB / dbLimitMB) * 100, 100);

    return NextResponse.json({
      generatedAt: now.toISOString(),
      db: {
        estimatedMB: Math.round(estimatedMB * 100) / 100,
        limitMB: dbLimitMB,
        usedPct: Math.round(dbUsedPct * 10) / 10,
        provider: "Neon PostgreSQL (Free Tier)",
        tables: [
          { name: "daily_notes",   rows: totalNotes,       sizeKB: Math.round(totalNotes * 2) },
          { name: "tech_articles", rows: totalArticles,    sizeKB: Math.round(totalArticles * 1) },
          { name: "chat_history",  rows: totalChatHistory, sizeKB: Math.round(totalChatHistory * 0.5) },
          { name: "contacts",      rows: totalContacts,    sizeKB: Math.round(totalContacts * 0.5) },
          { name: "family_notes",  rows: totalFamilyNotes, sizeKB: Math.round(totalFamilyNotes * 1) },
        ],
      },
      records: {
        notes: { total: totalNotes, active: activeNotes, deleted: deletedNotes },
        articles: totalArticles,
        contacts: totalContacts,
        familyNotes: totalFamilyNotes,
        chatHistory: totalChatHistory,
      },
      activity: {
        notes24h,
        notes7d,
        notes30d,
        articles7d,
        chats24h,
        notesPerDay,
      },
      sentiment: sentimentGroups.map(g => ({ label: g.sentiment ?? "unknown", count: g._count.sentiment })),
      recentActivity: {
        notes: recentNotes.map(n => ({
          id: n.id,
          time: n.createdAt.toISOString(),
          label: n.headline ?? "Untitled note",
          type: n.quickType ?? "note",
          sentiment: n.sentiment,
        })),
        chats: recentChats.map(c => ({
          id: c.id,
          time: c.createdAt.toISOString(),
          page: c.page ?? "home",
          preview: c.content.substring(0, 60),
        })),
        contacts: recentContacts.map(c => ({
          id: c.id,
          time: c.createdAt.toISOString(),
          name: c.name,
          subject: c.subject,
        })),
        articles: recentArticles.map(a => ({
          id: a.id,
          time: a.createdAt.toISOString(),
          title: a.title.substring(0, 60),
          source: a.source,
          category: a.category,
        })),
      },
      system: {
        platform: "Vercel (Free Tier)",
        region: process.env.VERCEL_REGION ?? "iad1 (US East)",
        nodeVersion: process.version,
        env: process.env.NODE_ENV ?? "production",
        scraperConfigured: !!(process.env.SCRAPER_TOKEN),
        geminiConfigured: !!(process.env.GEMINI_API_KEY),
        authConfigured: !!(process.env.AUTH_SECRET),
        emailConfigured: !!(process.env.EMAIL_USER),
      },
    });
  } catch (err) {
    console.error("[Admin Monitor] Error:", err);
    return NextResponse.json({ error: "Failed to fetch metrics", detail: String(err) }, { status: 500 });
  }
}
