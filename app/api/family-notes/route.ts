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
  const body = await req.json();
  const data = Schema.parse(body);
  const note = await prisma.familyNote.create({ data });
  return NextResponse.json(note);
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notes = await prisma.familyNote.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json(notes);
}
