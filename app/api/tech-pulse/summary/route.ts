/**
 * app/api/tech-pulse/summary/route.ts
 *
 * FIXED: Single Gemini call for everything (was 9 parallel calls → timeout)
 * Returns executive summary + all category highlights in one JSON response.
 * Cached 2 hours server-side.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateWithFallback } from "@/lib/gemini";

export const revalidate = 7200;

const ALL_CATEGORIES = [
  "AI/ML", "Cloud", "Cybersecurity", "Web Dev",
  "Federal Tech", "DoD Audit", "DoD Budget", "DoD Policy",
];

export async function GET() {
  try {
    const articles = await prisma.techArticle.findMany({
      orderBy: { publishedAt: "desc" },
      take: 40,
      select: { title: true, summary: true, category: true, source: true },
    });

    if (articles.length === 0) {
      return NextResponse.json({
        executiveSummary: null,
        categoryHighlights: {},
        categoryCounts: {},
        generatedAt: new Date().toISOString(),
        articleCount: 0,
      });
    }

    // Build category buckets + counts
    const byCategory: Record<string, typeof articles> = {};
    for (const cat of ALL_CATEGORIES) byCategory[cat] = [];
    for (const a of articles) {
      if (byCategory[a.category]) byCategory[a.category].push(a);
    }
    const categoryCounts: Record<string, number> = {};
    for (const cat of ALL_CATEGORIES) categoryCounts[cat] = byCategory[cat].length;

    // Active categories (have at least 1 article)
    const activeCats = ALL_CATEGORIES.filter(c => byCategory[c].length > 0);

    // ── SINGLE prompt for everything ──────────────────────────
    // One call = no rate limits, no timeout risk
    const articleSnippets = articles.slice(0, 20)
      .map(a => `[${a.category}] ${a.title}: ${a.summary?.substring(0, 100) ?? ""}`)
      .join("\n");

    const catSections = activeCats.map(cat => {
      const items = byCategory[cat].slice(0, 3)
        .map(a => `- ${a.title}`)
        .join("\n");
      return `${cat}:\n${items}`;
    }).join("\n\n");

    const prompt = `You are a senior technology and federal government analyst.
Analyze these recent tech/government news articles and return ONLY valid JSON (no markdown, no explanation).

Articles for executive summary:
${articleSnippets}

Articles by category for highlights:
${catSections}

Return exactly this JSON structure:
{
  "executiveSummary": "3 sentences. Professional tone. Mention specific technologies, agencies, or dollar amounts.",
  "categoryHighlights": {
${activeCats.map(c => `    "${c}": "One sentence, max 20 words, most important development"`).join(",\n")}
  }
}

Return ONLY the JSON object, no other text.`;

    const raw = await generateWithFallback(prompt);
    
    // Check if we got the fallback error message
    if (raw.includes('AI processing temporarily unavailable')) {
      console.error("[TechPulse] Gemini returned fallback — API key or model issue");
      return NextResponse.json({
        executiveSummary: "Gemini API unavailable. Check GEMINI_API_KEY and model compatibility.",
        categoryHighlights: {},
        categoryCounts,
        generatedAt: new Date().toISOString(),
        articleCount: articles.length,
      });
    }

    // Parse — strip any accidental markdown fences
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    let parsed: { executiveSummary: string; categoryHighlights: Record<string, string> };

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // JSON parse failed — extract what we can
      console.error("[TechPulse] JSON parse failed, raw:", cleaned.substring(0, 200));
      return NextResponse.json({
        executiveSummary: "Summary generation encountered a formatting issue. Check Vercel logs for details.",
        categoryHighlights: {},
        categoryCounts,
        generatedAt: new Date().toISOString(),
        articleCount: articles.length,
      });
    }

    console.log(`[TechPulse] Done — ${activeCats.length} category highlights generated`);

    return NextResponse.json({
      executiveSummary:   parsed.executiveSummary ?? null,
      categoryHighlights: parsed.categoryHighlights ?? {},
      categoryCounts,
      generatedAt:        new Date().toISOString(),
      articleCount:       articles.length,
    });

  } catch (err) {
    console.error("[TechPulse] Error:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({
      executiveSummary: null,
      categoryHighlights: {},
      categoryCounts: {},
      generatedAt: new Date().toISOString(),
      articleCount: 0,
    }, { status: 500 });
  }
}
