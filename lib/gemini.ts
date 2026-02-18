import { GoogleGenAI } from '@google/genai';

// ── Model chain — mirrors shangthing.vercel.app exactly ──────────────────────
const MODEL_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
] as const;

// ── Safety settings — BLOCK_ONLY_HIGH (same as shangthing) ───────────────────
const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
];

export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiResponse {
  content: string;
  model: string;
}

/**
 * Call Gemini using the NEW @google/genai SDK (not the deprecated @google/generative-ai).
 * Uses ai.models.generateContent() — the correct API for v1.x
 * Mirrors shangthing.vercel.app model chain: gemini-2.5-flash → gemini-2.5-flash-lite
 */
export async function callGemini(
  messages: GeminiMessage[],
  systemInstruction: string,
  options: { maxOutputTokens?: number; temperature?: number } = {}
): Promise<GeminiResponse> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_GEMINI_API_KEY not configured');

  const ai = new GoogleGenAI({ apiKey });
  const { maxOutputTokens = 1000, temperature = 0.7 } = options;

  // Format messages for new SDK — contents array
  const contents = messages
    .filter((m) => m?.content?.trim())
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  if (contents.length === 0) {
    contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
  }

  for (const model of MODEL_CHAIN) {
    try {
      // ✅ Correct new SDK API: ai.models.generateContent()
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          maxOutputTokens,
          temperature,
          safetySettings: SAFETY_SETTINGS,
        },
      });

      const text = response.text;
      if (!text?.trim()) throw new Error('Empty response');

      return { content: text, model };
    } catch (err: any) {
      const isQuotaError =
        err.message?.includes('429') ||
        err.message?.includes('quota') ||
        err.message?.includes('RESOURCE_EXHAUSTED') ||
        err.status === 429;

      if (isQuotaError && model !== MODEL_CHAIN[MODEL_CHAIN.length - 1]) {
        console.warn(`[Gemini] ${model} quota exceeded, trying fallback...`);
        continue;
      }
      throw err;
    }
  }

  throw new Error('All Gemini models failed');
}

/**
 * Simple one-shot text generation — no chat history.
 * Used for document analysis, summarization, etc.
 */
export async function generateText(
  prompt: string,
  systemInstruction = 'You are a helpful AI assistant.',
  options: { maxOutputTokens?: number; temperature?: number } = {}
): Promise<GeminiResponse> {
  return callGemini(
    [{ role: 'user', content: prompt }],
    systemInstruction,
    options
  );
}
