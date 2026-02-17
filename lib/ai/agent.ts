/**
 * lib/ai/agent.ts
 *
 * Multi-agent system using Gemini's NATIVE function-calling API.
 * 
 * Key difference from text-parsing approach:
 *   - response.functionCalls() returns a typed SDK object
 *   - Model CANNOT hallucinate the tool call format
 *   - We pass tool results back via functionResponse parts
 *   - chat.sendMessage() maintains conversation state natively
 *
 * Pattern: Thought (implicit) → functionCalls() → functionResponse → Answer
 */
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type FunctionCall,
} from "@google/generative-ai";
import { TOOL_DECLARATIONS, TOOL_HANDLERS } from "./tools";
import { PETER_CONTEXT } from "@/lib/gemini";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SAFETY = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

// Model chain — tries each in order until one succeeds
const MODEL_CHAIN = ["gemini-2.0-flash", "gemini-1.5-flash"];

// ── Exported interfaces (used by chat route + widget) ─────────────────────
export interface AgentStep {
  type:    "thought" | "tool_call" | "tool_result" | "answer";
  content: string;
  tool?:   string;
  data?:   unknown;
}

export interface AgentResponse {
  steps:      AgentStep[];
  answer:     string;
  agentId:    string;
  agentName:  string;
  agentEmoji: string;
}

export interface AgentConfig {
  id:            string;
  name:          string;
  emoji:         string;
  description:   string;
  systemPrompt:  string;
  maxIterations: number;
}

// ── Agent definitions ─────────────────────────────────────────────────────
export const AGENTS: Record<string, AgentConfig> = {

  portfolio: {
    id: "portfolio", name: "Portfolio Agent", emoji: "💼",
    description: "Peter's background, projects, skills, and career achievements",
    maxIterations: 3,
    systemPrompt: `${PETER_CONTEXT}

You are the Portfolio Agent. You specialize in Peter Shang's professional background.
Use get_platform_stats when asked about platform activity or numbers.
Use get_recent_notes when asked about recent thinking or notes.
Be professional, specific, and highlight concrete dollar amounts and achievements.`,
  },

  techNews: {
    id: "techNews", name: "Tech Trends Agent", emoji: "📡",
    description: "Latest tech news, AI trends, and articles from the platform database",
    maxIterations: 3,
    systemPrompt: `${PETER_CONTEXT}

You are the Tech Trends Agent. You retrieve and synthesize technology news from the live database.
ALWAYS use search_tech_articles or search_dod_news before answering — never rely on training data alone.
Present results in a clean, structured format with source and date.
Group by category when multiple results are returned.`,
  },

  dodPolicy: {
    id: "dodPolicy", name: "DoD Policy Agent", emoji: "🏛️",
    description: "DoD budget, audit findings, OMB circulars, and federal finance policy",
    maxIterations: 4,
    systemPrompt: `${PETER_CONTEXT}

You are the DoD Policy Agent — expert in:
• DoD budget formulation & execution (OMB A-11, A-123, A-136)
• Federal audit readiness (FIAR) and IG findings  
• Congressional appropriations and continuing resolutions
• CFO Act, GPRA, FASAB standards
• GS-15 level Pentagon financial management

Use search_dod_news to retrieve current news before answering.
Cite specific OMB circulars, statutes, or DoD regulations when relevant.`,
  },

  noteHelper: {
    id: "noteHelper", name: "Notes Agent", emoji: "📝",
    description: "Capture thoughts, reflect on past notes, and identify patterns",
    maxIterations: 3,
    systemPrompt: `${PETER_CONTEXT}

You are the Notes Agent — helping Peter capture and reflect on ideas.
IMPORTANT: When asked to save a note, ALWAYS echo back the exact content you plan to save and ask for confirmation BEFORE calling save_note.
Use get_recent_notes to retrieve past entries for reflection or summarization.
Be concise — notes should be scannable bullet points, not essays.`,
  },
};

// ── Auto-router: picks the right agent from message content + page ─────────
export function routeToAgent(message: string, page: string): string {
  const msg = message.toLowerCase();
  if (page === "fed-finance") return "dodPolicy";
  if (page === "ai-ml")       return "techNews";
  if (/\b(dod|pentagon|omb|fiar|audit|appropriation|budget|continuing resolution|a-11|a-123|comptroller|fasab)\b/.test(msg))
    return "dodPolicy";
  if (/\b(news|article|trend|latest|recent news|ai\/ml|cloud|cybersec|tech trend|scrape)\b/.test(msg))
    return "techNews";
  if (/\b(note|save|capture|log|my notes|recent thoughts|journal|wrote)\b/.test(msg))
    return "noteHelper";
  return "portfolio";
}

// ── Core agent runner ─────────────────────────────────────────────────────
export async function runAgent(
  agentId: string,
  userMessage: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[] = [],
): Promise<AgentResponse> {
  const config = AGENTS[agentId] ?? AGENTS.portfolio;
  const steps: AgentStep[] = [];

  // Try each model in the chain
  for (const modelName of MODEL_CHAIN) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        safetySettings: SAFETY,
        systemInstruction: config.systemPrompt,  // ← correct placement (not in message)
        tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
      });

      // Build chat history in Gemini format
      // IMPORTANT: history must alternate user/model and cannot include system turns
      const history = conversationHistory
        .slice(-6)
        .map(m => ({
          role:  m.role === "user" ? "user" as const : "model" as const,
          parts: [{ text: m.content }],
        }));

      const chat = model.startChat({ history });

      // ── Agentic loop ────────────────────────────────────────────────
      let currentMessage = userMessage;

      for (let i = 0; i < config.maxIterations; i++) {
        const result   = await chat.sendMessage(currentMessage);
        const response = result.response;

        // Check for native function calls (Gemini SDK typed object — not text)
        const functionCalls: FunctionCall[] = response.functionCalls() ?? [];

        if (functionCalls.length > 0) {
          // Record each tool call as a step
          const functionResponses = await Promise.all(
            functionCalls.map(async (fc) => {
              steps.push({
                type:    "tool_call",
                content: `${fc.name}(${JSON.stringify(fc.args ?? {})})`,
                tool:    fc.name,
                data:    fc.args,
              });

              // Execute the tool
              const handler = TOOL_HANDLERS[fc.name];
              const toolResult = handler
                ? await handler(fc.args as Record<string, unknown>)
                : { success: false, error: `Unknown tool: ${fc.name}` };

              steps.push({
                type:    "tool_result",
                content: JSON.stringify(toolResult.data ?? { error: toolResult.error }, null, 2),
                tool:    fc.name,
                data:    toolResult.data,
              });

              // Return in Gemini's required functionResponse format
              return {
                functionResponse: {
                  name:     fc.name,
                  response: toolResult.success
                    ? { content: toolResult.data }
                    : { error: toolResult.error },
                },
              };
            })
          );

          // Feed tool results back — next iteration gets the final answer
          currentMessage = functionResponses as unknown as string;

        } else {
          // No function call — this IS the final answer
          const answer = response.text().trim();
          steps.push({ type: "answer", content: answer });
          return {
            steps,
            answer,
            agentId:    config.id,
            agentName:  config.name,
            agentEmoji: config.emoji,
          };
        }
      }

      // Exceeded iterations — ask for final answer without tools
      const fallbackResult = await chat.sendMessage(
        "Please provide your final answer now based on the information gathered."
      );
      const fallbackAnswer = fallbackResult.response.text().trim();
      steps.push({ type: "answer", content: fallbackAnswer });
      return { steps, answer: fallbackAnswer, agentId: config.id, agentName: config.name, agentEmoji: config.emoji };

    } catch (err) {
      console.error(`[Agent] ${modelName} failed:`, err instanceof Error ? err.message : String(err));
      // Try next model in chain
      continue;
    }
  }

  // All models failed
  return {
    steps:      [{ type: "answer", content: "AI temporarily unavailable. Please try again." }],
    answer:     "AI temporarily unavailable. Please try again.",
    agentId:    config.id,
    agentName:  config.name,
    agentEmoji: config.emoji,
  };
}
