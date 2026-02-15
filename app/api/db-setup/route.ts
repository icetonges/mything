import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.ADMIN_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Trigger Prisma to ensure DB is reachable; migrations are run separately (prisma migrate)
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, message: 'DB connected' });
  } catch (e) {
    console.error('DB setup check error:', e);
    return NextResponse.json({ error: 'DB connection failed' }, { status: 503 });
  }
}
