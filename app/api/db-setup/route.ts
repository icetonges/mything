import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Test connection + count tables
    const [notes, articles, contacts] = await Promise.all([
      prisma.dailyNote.count(),
      prisma.techArticle.count(),
      prisma.contact.count(),
    ]);
    return NextResponse.json({ status: "ok", notes, articles, contacts });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
