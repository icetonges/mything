import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { processNote } from "@/lib/gemini";
import { slugify, formatDateKey } from "@/lib/utils";
import { z } from "zod";

const NoteSchema = z.object({
  content: z.string().min(1).max(50000),
  mood: z.number().int().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
  quickType: z.enum(["idea","trend","goal","note","insight"]).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = NoteSchema.parse(body);
    console.log('[Notes API] Creating note:', { contentLength: data.content.length, mood: data.mood });

    // Create note first
    const note = await prisma.dailyNote.create({
      data: { content: data.content, mood: data.mood, tags: data.tags ?? [], quickType: data.quickType },
    });
    console.log('[Notes API] Note created:', note.id);

    // Process with AI
    const ai = await processNote(data.content);
    const dateKey = formatDateKey(note.date);
    const slug = `${dateKey}-${slugify(ai.headline || data.content.substring(0, 60))}`;

    // Update with AI results
    const updated = await prisma.dailyNote.update({
      where: { id: note.id },
      data: {
        headline: ai.headline,
        summary: ai.summary,
        keyIdeas: JSON.stringify(ai.keyIdeas),
        actionItems: JSON.stringify(ai.actionItems),
        themes: ai.themes,
        sentiment: ai.sentiment,
        slug,
        aiProcessedAt: new Date(),
      },
    });
    console.log('[Notes API] AI processing complete:', { headline: ai.headline, sentiment: ai.sentiment });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[Notes API] Save error:', err);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const take = 20;

  const [notes, total] = await Promise.all([
    prisma.dailyNote.findMany({
      where: { deleted: false },
      orderBy: { date: "desc" },
      skip: (page - 1) * take,
      take,
    }),
    prisma.dailyNote.count({ where: { deleted: false } }),
  ]);

  return NextResponse.json({ notes, total, page, pages: Math.ceil(total / take) });
}
