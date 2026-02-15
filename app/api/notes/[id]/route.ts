import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { extractNoteAI } from '@/lib/gemini';
import { slugify } from '@/lib/utils';
import { z } from 'zod';

const updateSchema = z.object({
  date: z.string().optional(),
  content: z.string().optional(),
  mood: z.number().min(1).max(5).optional().nullable(),
  tags: z.array(z.string()).optional(),
  quickType: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const note = await prisma.dailyNote.findFirst({
    where: { id, deleted: false },
  });
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(note);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.dailyNote.findFirst({
    where: { id, deleted: false },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const data: Record<string, unknown> = {};
  if (parsed.data.date != null) data.date = new Date(parsed.data.date);
  if (parsed.data.content != null) data.content = parsed.data.content;
  if (parsed.data.mood !== undefined) data.mood = parsed.data.mood;
  if (parsed.data.tags !== undefined) data.tags = parsed.data.tags;
  if (parsed.data.quickType !== undefined) data.quickType = parsed.data.quickType;

  if (parsed.data.content && parsed.data.content !== existing.content) {
    const ai = await extractNoteAI(parsed.data.content);
    data.headline = ai.headline;
    data.summary = ai.summary;
    data.keyIdeas = JSON.stringify(ai.keyIdeas);
    data.actionItems = JSON.stringify(ai.actionItems);
    data.themes = ai.themes;
    data.sentiment = ai.sentiment;
    data.aiProcessedAt = new Date();
    const dateStr = (parsed.data.date ? new Date(parsed.data.date) : existing.date).toISOString().slice(0, 10);
    data.slug = `${dateStr}-${slugify(ai.headline || 'note')}`.slice(0, 100);
  }

  const updated = await prisma.dailyNote.update({
    where: { id },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.dailyNote.update({
    where: { id },
    data: { deleted: true },
  });
  return NextResponse.json({ ok: true });
}
