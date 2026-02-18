import { LINKS } from "@/lib/constants";
import { Brain, ExternalLink, Code, BookOpen, Sparkles } from "lucide-react";
import AIChatWidget from "@/components/ai/AIChatWidget";

export const revalidate = 3600;

export default function AIMLPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section with ML AI Hub Highlight */}
      <div className="mb-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Brain size={32} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AI & Machine Learning
            </h1>
            <p className="text-lg text-[hsl(var(--fg-muted))] max-w-3xl">
              My AI/ML knowledge base — concepts, experiments, certifications, and applied work at the intersection of federal finance and artificial intelligence.
            </p>
          </div>
        </div>

        {/* NEW: ML AI Hub Highlight Box */}
        <div className="p-6 rounded-xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-blue-500/5 mb-8">
          <div className="flex items-start gap-4">
            <Sparkles size={24} className="text-purple-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 text-purple-300 flex items-center gap-2">
                🎉 New: Comprehensive ML AI Knowledge Hub
              </h3>
              <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed mb-4">
                Explore my complete machine learning guide featuring <strong>8+ algorithms</strong> with production-ready code 
                (Logistic Regression, SVM, Random Forest, SGD, KNN, Naive Bayes, K-Means, GMM), 
                comprehensive evaluation metrics, clustering techniques, and a full AI agents framework. 
                Every algorithm includes real-world DoD/federal use cases, advantages/disadvantages, 
                and working Python examples. Everything you need to master ML and agentic AI in one place.
              </p>
              <a href="https://mlaithing.vercel.app" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-purple-500/50 bg-purple-500/10 text-sm font-semibold hover:bg-purple-500/20 hover:border-purple-500/70 transition-all">
                <Brain size={16} className="text-purple-400" />
                Visit ML AI Knowledge Hub
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links - UPDATED to include ML AI Hub */}
        <div className="flex flex-wrap gap-3">
          <a href="https://mlaithing.vercel.app" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl gold-bg font-semibold text-sm hover:opacity-90 transition-opacity">
            <Brain size={16} />
            ML AI Knowledge Hub
            <ExternalLink size={14} />
          </a>
          <a href={LINKS.kaggle} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[hsl(var(--border))] font-semibold text-sm hover:border-[hsl(var(--accent)/0.4)] transition-all">
            <BookOpen size={16} />
            Kaggle Notebooks
            <ExternalLink size={14} />
          </a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[hsl(var(--border))] font-semibold text-sm hover:border-[hsl(var(--accent)/0.4)] transition-all">
            <Code size={16} />
            GitHub AI/ML Repos
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Existing content continues below... */}
      {/* Concepts Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={18} className="text-purple-400" />
          <h2 className="font-display text-xl font-bold">Core Concepts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { 
              title: "Agentic AI", 
              desc: "AI systems that reason, plan, and use tools autonomously via function-calling loops. Studied in Google/Kaggle AI Agents Intensive (Nov 2025)." 
            },
            { 
              title: "RAG (Retrieval Augmented Generation)", 
              desc: "Combining LLMs with vector databases to ground responses in private/domain-specific knowledge. Applied to federal policy document analysis." 
            },
            { 
              title: "Fine-tuning vs Prompting", 
              desc: "When to prompt-engineer vs fine-tune a model. Trade-offs: cost, latency, data requirements, and capability gains." 
            },
            { 
              title: "Gradient Boosting (XGBoost)", 
              desc: "Ensemble ML method for structured/tabular data. Used for federal budget execution forecasting and obligation pattern analysis." 
            },
            { 
              title: "Time Series Forecasting", 
              desc: "Prophet and ARIMA models for predicting budget obligation patterns and fiscal year end execution rates across appropriation accounts." 
            },
            { 
              title: "NLP for Policy Documents", 
              desc: "Transformer-based extraction of requirements and metrics from OMB circulars, DoD regulations, and congressional budget documents." 
            },
          ].map(concept => (
            <div key={concept.title} className="card p-5">
              <h3 className="font-semibold text-sm mb-2">{concept.title}</h3>
              <p className="text-xs text-[hsl(var(--fg-muted))] leading-relaxed">{concept.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-purple-400" />
          <h2 className="font-display text-xl font-bold">Certifications & Training</h2>
        </div>
        <div className="space-y-3">
          {[
            { 
              title: "Google/Kaggle AI Agents Intensive", 
              date: "Nov 2025", 
              desc: "5-day intensive: agentic AI, function calling, RAG architectures, multi-agent orchestration", 
              badge: "🏅" 
            },
            { 
              title: "IBM Data Science Professional", 
              date: "2024", 
              desc: "End-to-end data science: Python, ML, SQL, visualization, Jupyter notebooks", 
              badge: "📊" 
            },
            { 
              title: "CDFM (Defense Financial Manager)", 
              date: "Active", 
              desc: "Federal financial management certification: budget, accounting, audit readiness", 
              badge: "🏛️" 
            },
          ].map(cert => (
            <div key={cert.title} className="card p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{cert.badge}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{cert.title}</h3>
                    <span className="text-[10px] text-[hsl(var(--fg-muted))] border border-[hsl(var(--border))] px-1.5 py-0.5 rounded-full">{cert.date}</span>
                  </div>
                  <p className="text-xs text-[hsl(var(--fg-muted))]">{cert.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Spotlight Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <Code size={18} className="text-purple-400" />
          <h2 className="font-display text-xl font-bold">Code Spotlight</h2>
        </div>
        <div className="card p-4 bg-[hsl(var(--bg-muted))]">
          <p className="text-[10px] text-[hsl(var(--fg-muted))] mb-3 font-mono">python — agentic_loop.py</p>
          <pre className="text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{`# Gemini Agentic Loop (from AI Agents Intensive)
import google.generativeai as genai

def run_agent(question: str, tools: list) -> str:
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        tools=tools,
    )
    response = model.generate_content(question)
    
    # Function-calling loop — agent decides when done
    while response.candidates[0].finish_reason.name == "TOOL_CALLS":
        tool_result = execute_tool(response)
        response = model.generate_content(
            [question, response, tool_result]
        )
    
    return response.text`}</pre>
        </div>
      </section>

      {/* CTA Section */}
      <div className="card p-8 border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-center">
        <Brain size={48} className="text-purple-400 mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold mb-3">Explore the ML AI Knowledge Hub</h3>
        <p className="text-sm text-[hsl(var(--fg-muted))] mb-6 max-w-2xl mx-auto">
          Deep dive into machine learning algorithms, AI agents framework, and production-ready implementations.
        </p>
        <a href="https://mlaithing.vercel.app" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gold-bg font-semibold hover:opacity-90 transition-opacity">
          <Brain size={20} />
          Visit ML AI Hub
          <ExternalLink size={16} />
        </a>
      </div>

      <AIChatWidget page="ai-ml" />
    </div>
  );
}
