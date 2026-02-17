import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { runAgent, routeToAgent, AGENTS } from "@/lib/ai/agent";

export const runtime = "nodejs";

const Schema = z.object({
  messages:  z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  page:      z.string().optional(),
  sessionId: z.string().optional(),
  agentId:   z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, page, sessionId, agentId } = Schema.parse(body);

    const sid      = sessionId ?? crypto.randomUUID();
    const lastUser = messages.filter(m => m.role === "user").pop()?.content ?? "";

    // History = everything except the last user message
    const history = messages.slice(0, -1);

    // Auto-route to appropriate agent, or use pinned agentId
    const resolvedAgentId = agentId ?? routeToAgent(lastUser, page ?? "home");
    const agentConfig     = AGENTS[resolvedAgentId] ?? AGENTS.portfolio;

    console.log(`[Agent] "${agentConfig.name}" | page: ${page} | "${lastUser.substring(0, 50)}"`);

    const result = await runAgent(resolvedAgentId, lastUser, history);

    console.log(`[Agent] Done — ${result.steps.length} steps, ${result.answer.length} chars`);

    // Persist to DB — non-blocking, never fails the response
    prisma.chatHistory.createMany({
      data: [
        { sessionId: sid, role: "user",      content: lastUser,      page },
        { sessionId: sid, role: "assistant",  content: result.answer, page },
      ],
    }).catch(e => console.error("[Agent] DB save failed:", e));

    return NextResponse.json({
      content:    result.answer,
      steps:      result.steps,
      agentId:    result.agentId,
      agentName:  result.agentName,
      agentEmoji: result.agentEmoji,
      sessionId:  sid,
    });

  } catch (err) {
    console.error("[Agent] Fatal:", err);
    return NextResponse.json({
      content: "I had trouble processing that. Please try again.",
      steps:   [],
      error:   process.env.NODE_ENV === "development" ? String(err) : undefined,
    }, { status: 500 });
  }
}
