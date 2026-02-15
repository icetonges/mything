// lib/gemini.ts — Gemini API wrapper + model fallback + Google Search tool
import { GoogleGenerativeAI, type Content, type Part } from '@google/generative-ai';

const MODELS = [
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
] as const;

function getClient(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

export async function generateWithFallback(
  systemPrompt: string,
  userContent: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const client = getClient();
  if (!client) return 'AI is not configured. Set GEMINI_API_KEY.';

  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 2048;

  for (const modelId of MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelId,
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      });
      const result = await model.generateContent([
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userContent }] },
      ]);
      const text = result.response.text();
      if (text?.trim()) return text.trim();
    } catch {
      continue;
    }
  }
  return 'Unable to generate a response. Please try again.';
}

export async function generateWithSearch(
  systemPrompt: string,
  userMessage: string,
  searchResult?: string
): Promise<string> {
  const client = getClient();
  if (!client) return 'AI is not configured. Set GEMINI_API_KEY.';

  const fullPrompt = searchResult
    ? `${systemPrompt}\n\n[Search context]\n${searchResult}\n\n[User]\n${userMessage}`
    : systemPrompt + '\n\n' + userMessage;

  for (const modelId of MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelId,
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      });
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
      if (text?.trim()) return text.trim();
    } catch {
      continue;
    }
  }
  return 'Unable to generate a response. Please try again.';
}

export interface NoteAIOutput {
  headline: string;
  summary: string;
  keyIdeas: string[];
  actionItems: string[];
  themes: string[];
  sentiment: string;
}

const NOTE_EXTRACT_PROMPT = `You are an assistant that extracts structured information from a daily note.
Return ONLY valid JSON with these exact keys (all strings; keyIdeas, actionItems, themes are arrays of strings):
{
  "headline": "One tweet-length headline (max 80 chars)",
  "summary": "Exactly 3 bullet points, each on one line starting with -",
  "keyIdeas": ["idea1", "idea2", ...],
  "actionItems": ["action1", ...],
  "themes": ["theme1", "theme2", ...],
  "sentiment": "one of: positive | neutral | reflective | energized"
}
No other text, no markdown code fence.`;

export async function extractNoteAI(content: string): Promise<NoteAIOutput> {
  const raw = await generateWithFallback(NOTE_EXTRACT_PROMPT, content, {
    temperature: 0.3,
    maxTokens: 1024,
  });
  try {
    const cleaned = raw.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned) as NoteAIOutput;
    return {
      headline: String(parsed.headline ?? '').slice(0, 80),
      summary: String(parsed.summary ?? ''),
      keyIdeas: Array.isArray(parsed.keyIdeas) ? parsed.keyIdeas.slice(0, 5) : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      themes: Array.isArray(parsed.themes) ? parsed.themes : [],
      sentiment: String(parsed.sentiment ?? 'neutral'),
    };
  } catch {
    return {
      headline: content.slice(0, 80) || 'Untitled',
      summary: '- ' + content.slice(0, 200),
      keyIdeas: [],
      actionItems: [],
      themes: [],
      sentiment: 'neutral',
    };
  }
}

export function getSystemContext(page: string): string {
  const base = `You are an AI assistant for Peter Shang's MyThing platform. Peter is a federal financial management expert (GS-15 Pentagon, $338B portfolio, 15+ years), data scientist, and AI enabler. He has 5 degrees, CDFM, IBM Data Science cert, Kaggle/GitHub activity. Portfolio: budgetmatter.github.io, resume: petershang.vercel.app, GitHub: github.com/icetonges, Kaggle: kaggle.com/icetonges. Answer helpfully and concisely.`;
  const byPage: Record<string, string> = {
    home: base + ' Overview of MyThing and Peter\'s highlights.',
    'fed-finance': base + ' Deep focus on OMB A-11, A-123, A-136, CFO Act, GPRA, FASAB, federal budget lifecycle.',
    'ai-ml': base + ' ML concepts, Kaggle projects, current AI trends.',
    'my-work': base + ' Portfolio deep-dive, GitHub/Kaggle links.',
    notes: 'You are in note analysis mode. Summarize, highlight, find patterns. Be concise.',
    family: 'You are a kid-friendly math tutor. Explain simply and encourage. No complex jargon.',
  };
  return byPage[page] ?? base;
}
