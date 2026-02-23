/**
 * lib/ai/agent.ts
 * Multi-agent system with Gemini + optional Groq fallback
 * Primary: Google Gemini 2.5 Flash models
 * Optional Fallback: Groq Llama models (if GROQ_API_KEY is set)
 */
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { TOOL_DECLARATIONS, TOOL_HANDLERS } from "./tools";
import { PETER_CONTEXT } from "@/lib/gemini";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Initialize Groq only if API key is available
let groq: any = null;
if (process.env.GROQ_API_KEY) {
  try {
    const Groq = require('groq-sdk').default;
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('[Agent] Groq fallback enabled');
  } catch (err) {
    console.log('[Agent] Groq SDK not available, using Gemini only');
  }
}

// Build model chain with Groq fallback
const buildModelChain = () => {
  const chain = [
    { provider: 'gemini', model: 'gemini-2.5-flash' },
    { provider: 'gemini', model: 'gemini-2.5-flash-lite' },
  ];
  
  if (groq) {
    chain.push(
      { provider: 'groq', model: 'llama-3.3-70b-versatile' },
      { provider: 'groq', model: 'llama-3.1-8b-instant' }
    );
  }
  
  return chain;
};

const MODEL_CHAIN = buildModelChain();

const SAFETY = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

export interface AgentStep {
  type: "thought" | "tool_call" | "tool_result" | "answer";
  content: string; tool?: string; data?: unknown;
}
export interface AgentResponse {
  steps: AgentStep[]; answer: string;
  agentId: string; agentName: string; agentEmoji: string;
}
interface AgentConfig {
  id: string; name: string; emoji: string;
  description: string; systemPrompt: string; maxIterations: number;
}

export const AGENTS: Record<string, AgentConfig> = {
  portfolio: {
    id: "portfolio", name: "Portfolio Agent", emoji: "💼",
    description: "Peter's background, projects, skills, and career achievements",
    maxIterations: 3,
    systemPrompt: `${PETER_CONTEXT}\n\nYou are the Portfolio Agent. Specialize in Peter Shang's professional background. Use get_platform_stats when asked about platform numbers. Use get_recent_notes for recent thinking. Be specific with dollar amounts and achievements.`,
  },
  techNews: {
    id: "techNews", name: "Tech Trends Agent", emoji: "📡",
    description: "Latest tech news, AI trends, and articles from the platform database",
    maxIterations: 3,
    systemPrompt: `${PETER_CONTEXT}\n\nYou are the Tech Trends Agent. Retrieve and synthesize technology news from the live database. ALWAYS use search_tech_articles before answering. Present results in a clean format with source and date.`,
  },
  dodPolicy: {
    id: "dodPolicy", name: "DoD Policy Agent", emoji: "🏛️",
    description: "DoD budget, audit findings, OMB circulars, and federal finance policy",
    maxIterations: 4,
    systemPrompt: `${PETER_CONTEXT}\n\nYou are the DoD Policy Agent — expert in DoD budget (OMB A-11, A-123), FIAR audit readiness, Congressional appropriations, CFO Act, GPRA, FASAB. Use search_dod_news to retrieve current news before answering.`,
  },
  noteHelper: {
    id: "noteHelper", name: "Notes Agent", emoji: "📝",
    description: "Capture thoughts, reflect on past notes, identify patterns",
    maxIterations: 3,
    systemPrompt: `${PETER_CONTEXT}\n\nYou are the Notes Agent. ALWAYS echo back the exact content you plan to save and ask for confirmation BEFORE calling save_note. Use get_recent_notes to retrieve past entries.`,
  },
};

export function routeToAgent(message: string, page: string): string {
  const msg = message.toLowerCase();
  if (page === "fed-finance") return "dodPolicy";
  if (page === "ai-ml")       return "techNews";
  if (/\b(dod|pentagon|omb|fiar|audit|appropriation|budget|continuing resolution|a-11|a-123|comptroller|fasab)\b/.test(msg)) return "dodPolicy";
  if (/\b(news|article|trend|latest|recent news|ai\/ml|cloud|cybersec|tech trend|scrape)\b/.test(msg)) return "techNews";
  if (/\b(note|save|capture|log|my notes|recent thoughts|journal|wrote)\b/.test(msg)) return "noteHelper";
  return "portfolio";
}

// Helper to run agent with Groq fallback
async function runAgentWithGroq(
  config: AgentConfig,
  userMessage: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  modelName: string,
): Promise<AgentResponse> {
  if (!groq) throw new Error('Groq not initialized');
  
  const steps: AgentStep[] = [];
  const messages: any[] = [{ role: 'system', content: config.systemPrompt }];
  
  // Add conversation history
  conversationHistory.slice(-6).forEach(m => {
    messages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content });
  });
  
  // Add current user message
  messages.push({ role: 'user', content: userMessage });
  
  // Groq doesn't support function calling the same way as Gemini
  // So we'll just get a direct response
  const response = await groq.chat.completions.create({
    model: modelName,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
  });
  
  const answer = response.choices[0]?.message?.content || '';
  steps.push({ type: "answer", content: answer });
  
  return {
    steps,
    answer,
    agentId: config.id,
    agentName: config.name,
    agentEmoji: config.emoji,
  };
}

export async function runAgent(
  agentId: string,
  userMessage: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[] = [],
): Promise<AgentResponse> {
  const config = AGENTS[agentId] ?? AGENTS.portfolio;
  const steps: AgentStep[] = [];

  for (const { provider, model: modelName } of MODEL_CHAIN) {
    try {
      // Use Groq for Groq models
      if (provider === 'groq') {
        console.log(`[Agent] Trying ${provider}/${modelName}`);
        return await runAgentWithGroq(config, userMessage, conversationHistory, modelName);
      }
      
      // Use Gemini for Gemini models
      const history = conversationHistory.slice(-6).map(m => ({
        role:  m.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.content }],
      }));

      const chat = gemini.chats.create({
        model: modelName,
        config: {
          safetySettings:    SAFETY,
          systemInstruction: config.systemPrompt,
          tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
        },
        history,
      });

      let response = await chat.sendMessage({ message: userMessage });

      for (let i = 0; i < config.maxIterations; i++) {
        const functionCalls = response.functionCalls ?? [];

        if (functionCalls.length > 0) {
          const functionResponseParts = await Promise.all(
            functionCalls.map(async (fc) => {
              const toolName = fc.name ?? "unknown_tool";
              
              steps.push({
                type: "tool_call",
                content: `${toolName}(${JSON.stringify(fc.args ?? {})})`,
                tool: toolName, data: fc.args,
              });

              const handler = TOOL_HANDLERS[toolName];
              const toolResult = handler
                ? await handler(fc.args as Record<string, unknown>)
                : { success: false, error: `Unknown tool: ${toolName}` };

              steps.push({
                type: "tool_result",
                content: JSON.stringify(toolResult.data ?? { error: toolResult.error }, null, 2),
                tool: toolName, data: toolResult.data,
              });

              return {
                functionResponse: {
                  id:       fc.id,
                  name:     toolName,
                  response: toolResult.success
                    ? { output: JSON.stringify(toolResult.data) }
                    : { error: toolResult.error ?? "Tool failed" },
                },
              };
            })
          );

          response = await chat.sendMessage({ message: functionResponseParts });

        } else {
          const answer = (response.text ?? "").trim();
          steps.push({ type: "answer", content: answer });
          console.log(`[Agent] Success: ${provider}/${modelName}`);
          return { steps, answer, agentId: config.id, agentName: config.name, agentEmoji: config.emoji };
        }
      }

      const final = await chat.sendMessage({ message: "Please provide your final answer now." });
      const finalAnswer = (final.text ?? "").trim();
      steps.push({ type: "answer", content: finalAnswer });
      console.log(`[Agent] Success: ${provider}/${modelName}`);
      return { steps, answer: finalAnswer, agentId: config.id, agentName: config.name, agentEmoji: config.emoji };

    } catch (err) {
      console.error(`[Agent] ${provider}/${modelName} failed:`, err instanceof Error ? err.message : String(err));
      continue;
    }
  }

  const errMsg = "All AI models failed. Please try again.";
  return { steps: [{ type: "answer", content: errMsg }], answer: errMsg, agentId: config.id, agentName: config.name, agentEmoji: config.emoji };
}
