/**
 * lib/gemini.ts
 * Uses the NEW @google/genai SDK (replaces deprecated @google/generative-ai).
 * @google/generative-ai reached end-of-life August 2025 and does NOT support
 * gemini-2.5-flash or any 2.0+ models properly.
 */
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
];

const SAFETY = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

export async function generateWithFallback(prompt: string, systemPrompt?: string): Promise<string> {
  for (const modelName of MODEL_CHAIN) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          safetySettings: SAFETY,
          ...(systemPrompt ? { systemInstruction: systemPrompt } : {}),
        },
      });
      const text = response.text;
      if (text) {
        console.log(`[Gemini] Success: ${modelName}`);
        return text;
      }
    } catch (err) {
      console.error(`[Gemini] ${modelName} failed:`, err instanceof Error ? err.message : String(err));
      continue;
    }
  }
  console.error('[Gemini] All models failed');
  return 'AI processing temporarily unavailable. Please try again.';
}

export async function processNote(content: string): Promise<{
  headline: string; summary: string; keyIdeas: string[];
  actionItems: string[]; themes: string[]; sentiment: string;
}> {
  const prompt = `Analyze this personal note and return ONLY valid JSON (no markdown fences):

Note:
"""
${content}
"""

Return exactly this JSON structure:
{
  "headline": "A single tweet-length headline (max 120 chars)",
  "summary": "Three bullet points as a single string, each on new line starting with •",
  "keyIdeas": ["idea 1", "idea 2", "idea 3"],
  "actionItems": ["action 1", "action 2"],
  "themes": ["theme1", "theme2"],
  "sentiment": "positive|neutral|reflective|energized|challenging"
}`;

  try {
    const raw = await generateWithFallback(prompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.headline || !parsed.summary) throw new Error('Missing required AI fields');
    return {
      headline:    parsed.headline,
      summary:     parsed.summary,
      keyIdeas:    Array.isArray(parsed.keyIdeas)    ? parsed.keyIdeas    : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      themes:      Array.isArray(parsed.themes)      ? parsed.themes      : [],
      sentiment:   parsed.sentiment || 'neutral',
    };
  } catch (err) {
    console.error('[processNote] failed:', err instanceof Error ? err.message : String(err));
    return {
      headline: content.substring(0, 100),
      summary: '• Note captured successfully\n• AI processing encountered an issue\n• Content saved',
      keyIdeas: [], actionItems: [], themes: ['uncategorized'], sentiment: 'neutral',
    };
  }
}

export const PETER_CONTEXT = `You are Peter Shang's AI assistant on his personal platform "MyThing" (shangthing.vercel.app).

About Peter Shang:
- GS-15 Federal Financial Manager at the Pentagon, managing a $338B portfolio
- Former DoD OIG (Inspector General) financial analyst
- U.S. Army veteran
- 15+ years in federal financial management
- 5 advanced degrees (Data Science, Cybersecurity, Cyber Forensics, MBA, Accounting)
- Certified Defense Financial Manager (CDFM)
- IBM Data Science Professional Certificate
- Google/Kaggle AI Agents Intensive Certificate (Nov 2025)
- Located: Washington, D.C. Metro Area

Technical Skills:
- Full-stack: Next.js 15, React 19, TypeScript, Python, PostgreSQL
- AI/ML: Gemini API, scikit-learn, pandas, XGBoost, transformer models
- Federal finance: OMB A-11, A-123, A-136, CFO Act, GPRA, FASAB, FIAR

Recent Projects:
- ML AI Knowledge Hub (mlaithing.vercel.app): Comprehensive ML guide with 8+ algorithms
- MyThing Platform: Multi-agent AI system with 4 specialized agents
- Interactive Resume: AI-powered portfolio with search grounding

Online Presence:
- Portfolio: https://petershang.vercel.app
- ML AI Hub: https://mlaithing.vercel.app
- GitHub: https://github.com/icetonges (29+ repos)
- Kaggle: https://www.kaggle.com/icetonges
- LinkedIn: https://www.linkedin.com/in/petershang/

Be helpful, precise, and professional. For federal finance questions, provide authoritative answers.`;
