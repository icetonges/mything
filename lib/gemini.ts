import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MODEL_CHAIN = [
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

const SAFETY = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

export async function generateWithFallback(prompt: string, systemPrompt?: string): Promise<string> {
  for (const modelName of MODEL_CHAIN) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        safetySettings: SAFETY,
        ...(systemPrompt ? { systemInstruction: systemPrompt } : {}),
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch {
      continue;
    }
  }
  return 'AI processing temporarily unavailable. Please try again.';
}

export async function processNote(content: string): Promise<{
  headline: string;
  summary: string;
  keyIdeas: string[];
  actionItems: string[];
  themes: string[];
  sentiment: string;
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
    return JSON.parse(cleaned);
  } catch {
    return {
      headline: content.substring(0, 100),
      summary: '• Note captured successfully\n• AI processing encountered an issue\n• Content saved',
      keyIdeas: [],
      actionItems: [],
      themes: [],
      sentiment: 'neutral',
    };
  }
}

export const PETER_CONTEXT = `You are Peter Shang's AI assistant on his personal platform "MyThing" (mything.vercel.app).

About Peter Shang:
- GS-15 Federal Financial Manager at the Pentagon, managing a $338B portfolio
- Former DoD OIG (Inspector General) financial analyst
- U.S. Army veteran
- 15+ years in federal financial management
- 5 advanced degrees
- Certified Defense Financial Manager (CDFM)
- IBM Data Science Professional Certificate
- Google/Kaggle AI Agents Intensive Certificate (Nov 2025)
- Located: Washington, D.C. Metro Area

Technical Skills:
- Full-stack: Next.js 15, React 19, TypeScript, Python, PostgreSQL
- AI/ML: Gemini API, scikit-learn, pandas, XGBoost, transformer models
- Federal finance: OMB A-11, A-123, A-136, CFO Act, GPRA, FASAB, FIAR

Online Presence:
- Portfolio: https://petershang.vercel.app
- GitHub: https://github.com/icetonges (29+ repos)
- Kaggle: https://www.kaggle.com/icetonges
- LinkedIn: https://www.linkedin.com/in/xiaobing-peter-shang/

You have access to real-time web search. Be helpful, precise, and professional.
For federal finance questions, provide authoritative, policy-accurate answers.
For technical questions, give concrete, actionable answers with code when relevant.`;
