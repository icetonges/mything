/**
 * lib/ai/tools.ts
 *
 * Tools wired to Gemini's NATIVE function-calling API.
 * The SDK returns structured functionCalls() — no text parsing needed.
 *
 * Each tool has:
 *   declaration  — schema Gemini uses to decide when/how to call it
 *   handler      — async function that executes and returns data
 */
import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────
export interface ToolResult {
  success: boolean;
  data?:   unknown;
  error?:  string;
}

export type ToolArgs = Record<string, unknown>;

// ── Tool 1: search_tech_articles ──────────────────────────────────────────
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
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Tool 2: search_dod_news ───────────────────────────────────────────────
async function searchDodNews(args: ToolArgs): Promise<ToolResult> {
  const topic = args.topic as string | undefined;
  const type  = (args.type as string | undefined) ?? "all";
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
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Tool 3: save_note ─────────────────────────────────────────────────────
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
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Tool 4: get_recent_notes ──────────────────────────────────────────────
async function getRecentNotes(args: ToolArgs): Promise<ToolResult> {
  const limit = (args.limit as number | undefined) ?? 5;
  try {
    const notes = await prisma.dailyNote.findMany({
      where: { deleted: false },
      orderBy: { date: "desc" }, take: Math.min(limit, 20),
      select: { id: true, date: true, headline: true, summary: true, sentiment: true, tags: true, quickType: true },
    });
    return { success: true, data: { count: notes.length, notes } };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Tool 5: get_platform_stats ────────────────────────────────────────────
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
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Handler registry ──────────────────────────────────────────────────────
export const TOOL_HANDLERS: Record<string, (args: ToolArgs) => Promise<ToolResult>> = {
  search_tech_articles: searchTechArticles,
  search_dod_news:      searchDodNews,
  save_note:            saveNote,
  get_recent_notes:     getRecentNotes,
  get_platform_stats:   getPlatformStats,
};

// ── Gemini native functionDeclarations schema ─────────────────────────────
// These are passed directly to getGenerativeModel({ tools: [...] })
// Gemini SDK returns typed functionCalls() — no text parsing needed.
export const TOOL_DECLARATIONS = [
  {
    name: "search_tech_articles",
    description: "Search the database for tech news articles. Use for AI, cloud, cybersecurity, web dev topics.",
    parameters: {
      type: "object",
      properties: {
        query:    { type: "string",  description: "Search keyword or topic" },
        category: { type: "string",  description: "Filter: AI/ML | Cloud | Cybersecurity | Web Dev | Federal Tech" },
        limit:    { type: "number",  description: "Max results (default 5)" },
      },
      required: [],
    },
  },
  {
    name: "search_dod_news",
    description: "Search DoD-specific news: audit findings, budget updates, policy memos, OMB circulars.",
    parameters: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Search topic (e.g. 'FIAR', 'A-11', 'continuing resolution')" },
        type:  { type: "string", description: "Category filter: audit | budget | policy | all (default: all)" },
        limit: { type: "number", description: "Max results (default 5)" },
      },
      required: [],
    },
  },
  {
    name: "save_note",
    description: "Save a note to the database. ALWAYS confirm exact content with the user before calling this.",
    parameters: {
      type: "object",
      properties: {
        content:   { type: "string",  description: "The note content to save" },
        tags:      { type: "array",   items: { type: "string" }, description: "Optional tags" },
        mood:      { type: "number",  description: "Mood 1-5 (1=sad, 5=energized)" },
        quickType: { type: "string",  description: "Type: note | idea | goal | insight | trend" },
      },
      required: ["content"],
    },
  },
  {
    name: "get_recent_notes",
    description: "Retrieve Peter's most recent personal notes for reflection or summarization.",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Number of notes to retrieve (default 5)" },
      },
      required: [],
    },
  },
  {
    name: "get_platform_stats",
    description: "Get live usage statistics: total notes, articles, chats, and DoD content count.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];
