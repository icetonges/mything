import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { extractNoteAI } from '@/lib/gemini';
import { slugify } from '@/lib/utils';
import { z } from 'zod';

const createSchema = z.object({
  date: z.string().optional(),
  content: z.string(),
  mood: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
  quickType: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50);
    const cursor = searchParams.get('cursor') ?? undefined;
    const notes = await prisma.dailyNote.findMany({
      where: { deleted: false },
      orderBy: { date: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const nextCursor = notes.length > limit ? notes[limit - 1]?.id : null;
    return NextResponse.json({
      notes: notes.slice(0, limit),
      nextCursor,
    });
  } catch (e) {
    console.error('Notes GET error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const { date, content, mood, tags, quickType } = parsed.data;
    const note = await prisma.dailyNote.create({
      data: {
        date: date ? new Date(date) : new Date(),
        content,
        mood: mood ?? null,
        tags: tags ?? [],
        quickType: quickType ?? null,
      },
    });
    const ai = await extractNoteAI(content);
    const slug = slugify(ai.headline || 'note');
    const dateStr = (date ? new Date(date) : new Date()).toISOString().slice(0, 10);
    const fullSlug = `${dateStr}-${slug}`.slice(0, 100);
    let uniqueSlug = fullSlug;
    let n = 0;
    while (await prisma.dailyNote.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${fullSlug}-${++n}`;
    }
    const updated = await prisma.dailyNote.update({
      where: { id: note.id },
      data: {
        headline: ai.headline,
        summary: ai.summary,
        keyIdeas: JSON.stringify(ai.keyIdeas),
        actionItems: JSON.stringify(ai.actionItems),
        themes: ai.themes,
        sentiment: ai.sentiment,
        slug: uniqueSlug,
        aiProcessedAt: new Date(),
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('Notes POST error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
