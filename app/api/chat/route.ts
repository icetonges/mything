import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, PETER_CONTEXT } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { z } from "zod";


export const runtime = "nodejs";

const Schema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  page: z.string().optional(),
  sessionId: z.string().optional(),
});

const PAGE_CONTEXTS: Record<string, string> = {
  "fed-finance": "The user is on the Federal Finance page. Focus on OMB circulars, federal budgeting, appropriations law, and Peter's Pentagon expertise. Be authoritative and policy-accurate.",
  "ai-ml": "The user is on the AI & ML page. Focus on AI/ML concepts, Peter's Kaggle notebooks, Google AI Agents Intensive, and applying AI to federal finance.",
  "my-work": "The user is on the My Work / Portfolio page. Help them understand Peter's projects, tech stack, and capabilities. Link to relevant repos and live sites.",
  "family-math": "You are a friendly math tutor for kids. Explain math step by step in simple, encouraging language. Use fun examples. Never be condescending. Celebrate correct answers!",
  "home": "General assistant. Help with anything related to Peter's background, expertise, and platform.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Chat API] Request received:', { page: body.page, messageCount: body.messages?.length });
    
    const { messages, page, sessionId } = Schema.parse(body);

    const sid = sessionId ?? crypto.randomUUID();
    const pageCtx = PAGE_CONTEXTS[page ?? "home"] ?? PAGE_CONTEXTS.home;
    const systemPrompt = `${PETER_CONTEXT}\n\nCurrent page context: ${pageCtx}`;

    const historyText = messages
      .map(m => `${m.role === "user" ? "Human" : "Assistant"}: ${m.content}`)
      .join("\n");

    const lastUser = messages.filter(m => m.role === "user").pop()?.content ?? "";
    const prompt = historyText.length > lastUser.length
      ? `Conversation so far:\n${historyText}\n\nProvide a helpful, concise response to the last user message.`
      : lastUser;

    const content = await generateWithFallback(prompt, systemPrompt);
    console.log('[Chat API] Response generated:', { contentLength: content.length, sessionId: sid });

    // Store in DB (non-blocking)
    try {
      await prisma.chatHistory.createMany({
        data: [
          { sessionId: sid, role: "user", content: lastUser, page },
          { sessionId: sid, role: "assistant", content, page },
        ],
      });
    } catch (dbErr) {
      console.error('[Chat API] DB save failed (non-fatal):', dbErr);
    }

    return NextResponse.json({ content, sessionId: sid });
  } catch (err) {
    console.error('[Chat API] Error:', err);
    return NextResponse.json({ 
      error: 'Chat failed', 
      details: process.env.NODE_ENV === 'development' ? String(err) : undefined 
    }, { status: 500 });
  }
}
