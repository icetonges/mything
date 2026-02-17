import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Schema = z.object({
  content: z.string().min(1).max(10000),
  category: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const body = await req.json();
    const data = Schema.parse(body);
    const note = await prisma.familyNote.create({ data });
    console.log('[Family Notes] Created:', note.id);
    return NextResponse.json(note);
  } catch (err) {
    console.error('[Family Notes] Create error:', err);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const notes = await prisma.familyNote.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
    console.log('[Family Notes] Retrieved:', notes.length);
    return NextResponse.json(notes);
  } catch (err) {
    console.error('[Family Notes] Fetch error:', err);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
