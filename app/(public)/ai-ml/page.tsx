"use server";
import { LINKS } from "@/lib/constants";
import { Brain, ExternalLink, Code, BookOpen, Zap } from "lucide-react";
import AIChatWidget from "@/components/ai/AIChatWidget";

export const revalidate = 3600;

const CONCEPTS = [
  { title: "Agentic AI", desc: "AI systems that reason, plan, and use tools autonomously via function-calling loops. Studied in Google/Kaggle AI Agents Intensive (Nov 2025)." },
  { title: "RAG (Retrieval Augmented Generation)", desc: "Combining LLMs with vector databases to ground responses in private/domain-specific knowledge. Applied to federal policy document analysis." },
  { title: "Fine-tuning vs Prompting", desc: "When to prompt-engineer vs fine-tune a model. Trade-offs: cost, latency, data requirements, and capability gains." },
  { title: "Gradient Boosting (XGBoost)", desc: "Ensemble ML method for structured/tabular data. Used for federal budget execution forecasting and obligation pattern analysis." },
  { title: "Time Series Forecasting", desc: "Prophet and ARIMA models for predicting budget obligation patterns and fiscal year end execution rates across appropriation accounts." },
  { title: "NLP for Policy Documents", desc: "Transformer-based extraction of requirements and metrics from OMB circulars, DoD regulations, and congressional budget documents." },
];

const CERTS = [
  { title: "Google/Kaggle AI Agents Intensive", date: "Nov 2025", desc: "5-day intensive: agentic AI, function calling, RAG architectures, multi-agent orchestration", badge: "🏅" },
  { title: "IBM Data Science Professional", date: "2024", desc: "End-to-end data science: Python, ML, SQL, visualization, Jupyter notebooks", badge: "📊" },
  { title: "CDFM (Defense Financial Manager)", date: "Active", desc: "Federal financial management certification: budget, accounting, audit readiness", badge: "🏛️" },
];

const CODE_SNIPPET = `# Gemini Agentic Loop (from AI Agents Intensive)
import google.generativeai as genai

def run_agent(question: str, tools: list) -> str:
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash-preview-05-20",
        tools=tools,
    )
    response = model.generate_content(question)
    
    # Function-calling loop — agent decides when done
    while response.candidates[0].finish_reason.name == "TOOL_CALLS":
        tool_result = execute_tool(response)
        response = model.generate_content(
            [question, response, tool_result]
        )
    
    return response.text`;

export default function AIMLPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Brain size={20} className="text-purple-400" />
          </div>
          <h1 className="font-display text-3xl font-bold">AI &amp; ML</h1>
        </div>
        <p className="text-[hsl(var(--fg-muted))] max-w-2xl">
          My AI/ML knowledge base — concepts, experiments, certifications, and applied work at the intersection of federal finance and artificial intelligence.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        <a href={LINKS.kaggle} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-xl gold-bg font-semibold text-sm hover:opacity-90 transition-opacity">
          Kaggle Notebooks <ExternalLink size={14} />
        </a>
        <a href={LINKS.github} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[hsl(var(--border))] font-semibold text-sm hover:border-[hsl(var(--accent)/0.4)] transition-all">
          GitHub AI/ML Repos <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={18} className="text-purple-400" />
              <h2 className="font-display text-xl font-bold">Certifications &amp; Training</h2>
            </div>
            <div className="space-y-3">
              {CERTS.map(c => (
                <div key={c.title} className="card p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{c.badge}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{c.title}</h3>
                        <span className="text-[10px] text-[hsl(var(--fg-muted))] border border-[hsl(var(--border))] px-1.5 py-0.5 rounded-full">{c.date}</span>
                      </div>
                      <p className="text-xs text-[hsl(var(--fg-muted))]">{c.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-5">
              <Code size={18} className="text-purple-400" />
              <h2 className="font-display text-xl font-bold">Code Spotlight</h2>
            </div>
            <div className="card p-4 bg-[hsl(var(--bg-muted))]">
              <p className="text-[10px] text-[hsl(var(--fg-muted))] mb-3 font-mono">python — agentic_loop.py</p>
              <pre className="text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">
                {CODE_SNIPPET}
              </pre>
            </div>
          </section>
        </div>

        <section>
          <div className="flex items-center gap-2 mb-5">
            <Zap size={18} className="text-purple-400" />
            <h2 className="font-display text-xl font-bold">Key Concepts</h2>
          </div>
          <div className="space-y-3">
            {CONCEPTS.map(c => (
              <div key={c.title} className="card p-4 hover:border-purple-500/30 transition-all">
                <h3 className="font-semibold text-sm mb-1.5 text-purple-300">{c.title}</h3>
                <p className="text-xs text-[hsl(var(--fg-muted))] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-12 card p-6 border-purple-500/20 bg-purple-500/5 text-center">
        <Brain size={28} className="text-purple-400 mx-auto mb-3" />
        <h3 className="font-display text-lg font-bold mb-2">Ask My AI Agent</h3>
        <p className="text-sm text-[hsl(var(--fg-muted))]">
          Use the chat widget to ask any question about AI/ML concepts, my Kaggle work, or how I apply AI to federal finance.
        </p>
      </div>

      <AIChatWidget page="ai-ml" />
    </div>
  );
}
