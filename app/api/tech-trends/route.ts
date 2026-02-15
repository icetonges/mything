import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") ?? "1");
  const take = 20;

  const where = category && category !== "All" ? { category } : {};
  const [articles, total] = await Promise.all([
    prisma.techArticle.findMany({ where, orderBy: { publishedAt: "desc" }, skip: (page-1)*take, take }),
    prisma.techArticle.count({ where }),
  ]);
  return NextResponse.json({ articles, total, page });
}
