import { NextResponse } from 'next/server';
import { generateWithSearch, getSystemContext } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const page = typeof body.page === 'string' ? body.page : 'home';
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }
    const systemContext = getSystemContext(page);
    const reply = await generateWithSearch(systemContext, message);
    return NextResponse.json({ reply });
  } catch (e) {
    console.error('Chat API error:', e);
    return NextResponse.json(
      { reply: 'Sorry, I encountered an error. Please try again.' },
      { status: 200 }
    );
  }
}
