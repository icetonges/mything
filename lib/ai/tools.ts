/**
 * lib/ai/tools.ts
 * Uses new @google/genai SDK.
 * FunctionDeclaration now uses `parametersJsonSchema` with `Type` enum (not SchemaType).
 */
import { prisma } from "@/lib/prisma";
import { Type, type FunctionDeclaration } from "@google/genai";

export interface ToolResult { success: boolean; data?: unknown; error?: string; }
export type ToolArgs = Record<string, unknown>;

// ── Handlers ──────────────────────────────────────────────────────────────
async function searchTechArticles(args: ToolArgs): Promise<ToolResult> {
  const query    = args.query    as string | undefined;
  const category = args.category as string | undefined;
  const limit    = (args.limit   as number | undefined) ?? 5;
  try {
    const where: Record<string, unknown> = {};
    if (category && category !== "All") where.category = category;
    if (query) {
      where.OR = [
        { title:   { contains: query, mode: "insensitive" } },
        { summary: { contains: query, mode: "insensitive" } },
        { source:  { contains: query, mode: "insensitive" } },
      ];
    }
    const articles = await prisma.techArticle.findMany({
      where, orderBy: { publishedAt: "desc" }, take: Math.min(limit, 10),
      select: { title: true, url: true, source: true, category: true, summary: true, publishedAt: true },
    });
    return { success: true, data: { count: articles.length, articles } };
  } catch (e) { return { success: false, error: String(e) }; }
}

async function searchDodNews(args: ToolArgs): Promise<ToolResult> {
  const topic = args.topic as string | undefined;
  const type  = (args.type  as string | undefined) ?? "all";
  const limit = (args.limit as number | undefined) ?? 5;
  const categoryMap: Record<string, string[]> = {
    audit:  ["DoD Audit"],
    budget: ["DoD Budget"],
    policy: ["DoD Policy", "Federal Tech"],
    all:    ["DoD Audit", "DoD Budget", "DoD Policy", "Federal Tech"],
  };
  const cats = categoryMap[type] ?? categoryMap.all;
  try {
    const articles = await prisma.techArticle.findMany({
      where: {
        category: { in: cats },
        ...(topic ? { OR: [
          { title:   { contains: topic, mode: "insensitive" } },
          { summary: { contains: topic, mode: "insensitive" } },
        ]} : {}),
      },
      orderBy: { publishedAt: "desc" }, take: Math.min(limit, 10),
      select: { title: true, url: true, source: true, category: true, summary: true, publishedAt: true },
    });
    return { success: true, data: { count: articles.length, articles } };
  } catch (e) { return { success: false, error: String(e) }; }
}

async function saveNote(args: ToolArgs): Promise<ToolResult> {
  const content   = args.content   as string;
  const tags      = (args.tags     as string[] | undefined) ?? [];
  const mood      = args.mood      as number | undefined;
  const quickType = (args.quickType as string | undefined) ?? "note";
  if (!content?.trim()) return { success: false, error: "Content is required" };
  try {
    const note = await prisma.dailyNote.create({
      data: { content, tags, mood, quickType,
        headline: content.substring(0, 100),
        summary: "• Note saved via AI agent\n• AI processing pending",
        themes: tags, sentiment: "neutral", deleted: false,
      },
    });
    return { success: true, data: { id: note.id, headline: note.headline } };
  } catch (e) { return { success: false, error: String(e) }; }
}

async function getRecentNotes(args: ToolArgs): Promise<ToolResult> {
  const limit = (args.limit as number | undefined) ?? 5;
  try {
    const notes = await prisma.dailyNote.findMany({
      where: { deleted: false },
      orderBy: { date: "desc" }, take: Math.min(limit, 20),
      select: { id: true, date: true, headline: true, summary: true, sentiment: true, tags: true, quickType: true },
    });
    return { success: true, data: { count: notes.length, notes } };
  } catch (e) { return { success: false, error: String(e) }; }
}

async function getPlatformStats(_args: ToolArgs): Promise<ToolResult> {
  try {
    const [totalNotes, totalArticles, totalChats, last24hNotes, dodArticles] = await Promise.all([
      prisma.dailyNote.count({ where: { deleted: false } }),
      prisma.techArticle.count(),
      prisma.chatHistory.count(),
      prisma.dailyNote.count({ where: { createdAt: { gte: new Date(Date.now() - 86400000) } } }),
      prisma.techArticle.count({ where: { category: { in: ["DoD Audit", "DoD Budget", "DoD Policy"] } } }),
    ]);
    return { success: true, data: { totalNotes, totalArticles, totalChats, last24hNotes, dodArticles } };
  } catch (e) { return { success: false, error: String(e) }; }
}

export const TOOL_HANDLERS: Record<string, (args: ToolArgs) => Promise<ToolResult>> = {
  search_tech_articles: searchTechArticles,
  search_dod_news:      searchDodNews,
  save_note:            saveNote,
  get_recent_notes:     getRecentNotes,
  get_platform_stats:   getPlatformStats,
};

// ── New SDK: parametersJsonSchema with Type enum (not SchemaType) ──────────
export const TOOL_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: "search_tech_articles",
    description: "Search the database for tech news articles. Use for AI, cloud, cybersecurity, web dev topics.",
    parametersJsonSchema: {
      type: Type.OBJECT,
      properties: {
        query:    { type: Type.STRING, description: "Search keyword or topic" },
        category: { type: Type.STRING, description: "Filter: AI/ML | Cloud | Cybersecurity | Web Dev | Federal Tech" },
        limit:    { type: Type.NUMBER, description: "Max results (default 5)" },
      },
    },
  },
  {
    name: "search_dod_news",
    description: "Search DoD-specific news: audit findings, budget updates, policy memos.",
    parametersJsonSchema: {
      type: Type.OBJECT,
      properties: {
        topic: { type: Type.STRING, description: "Search topic e.g. FIAR, A-11, continuing resolution" },
        type:  { type: Type.STRING, description: "Category: audit | budget | policy | all" },
        limit: { type: Type.NUMBER, description: "Max results (default 5)" },
      },
    },
  },
  {
    name: "save_note",
    description: "Save a note to the database. ALWAYS confirm content with user before calling.",
    parametersJsonSchema: {
      type: Type.OBJECT,
      properties: {
        content:   { type: Type.STRING, description: "The note content to save" },
        tags:      { type: Type.ARRAY,  items: { type: Type.STRING }, description: "Optional tags" },
        mood:      { type: Type.NUMBER, description: "Mood 1-5" },
        quickType: { type: Type.STRING, description: "Type: note | idea | goal | insight | trend" },
      },
      required: ["content"],
    },
  },
  {
    name: "get_recent_notes",
    description: "Retrieve Peter's most recent personal notes.",
    parametersJsonSchema: {
      type: Type.OBJECT,
      properties: {
        limit: { type: Type.NUMBER, description: "Number of notes (default 5)" },
      },
    },
  },
  {
    name: "get_platform_stats",
    description: "Get live platform stats: total notes, articles, chats, DoD content count.",
    parametersJsonSchema: {
      type: Type.OBJECT,
      properties: {
        format: { type: Type.STRING, description: "Optional: brief or detailed" },
      },
    },
  },
];
