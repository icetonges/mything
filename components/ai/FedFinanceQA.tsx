"use client";
import { useState } from "react";
import { Landmark, Send, Loader2, Bot } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }

export default function FedFinanceQA() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const SUGGESTIONS = [
    "What is OMB Circular A-11?",
    "Explain the federal budget lifecycle",
    "What is FIAR and why does it matter?",
    "Difference between obligation and outlay?",
    "What does OMB A-123 require?",
  ];

  const ask = async (q?: string) => {
    const query = q ?? question;
    if (!query.trim() || loading) return;
    const userMsg: Message = { role: "user", content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          page: "fed-finance",
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content ?? "I couldn't answer that. Please try rephrasing." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[hsl(var(--border))] bg-green-500/5">
        <Landmark size={18} className="text-green-400" />
        <div>
          <p className="font-semibold text-sm">Federal Finance Q&amp;A</p>
          <p className="text-[10px] text-[hsl(var(--fg-muted))]">Powered by Gemini 2.5 · Peter&apos;s context</p>
        </div>
      </div>

      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="p-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => ask(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-green-400/50 hover:text-green-400 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="max-h-64 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={12} className="text-green-400" />
                </div>
              )}
              <div className={`max-w-[85%] text-sm rounded-xl px-3 py-2 leading-relaxed ${
                m.role === "user"
                  ? "bg-[hsl(var(--accent)/0.12)] rounded-br-sm"
                  : "bg-[hsl(var(--bg-muted))] rounded-bl-sm"
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Bot size={12} className="text-green-400" />
              </div>
              <div className="bg-[hsl(var(--bg-muted))] rounded-xl rounded-bl-sm px-3 py-2">
                <Loader2 size={14} className="animate-spin text-green-400" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-[hsl(var(--border))]">
        <div className="flex gap-2">
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && ask()}
            placeholder="Ask about federal budget policy…"
            disabled={loading}
            className="flex-1 px-3 py-2 rounded-lg bg-[hsl(var(--bg))] border border-[hsl(var(--border))] text-sm focus:outline-none focus:border-green-400/40 transition-colors"
          />
          <button onClick={() => ask()} disabled={!question.trim() || loading}
            className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center disabled:opacity-40 hover:bg-green-500/20 transition-colors">
            <Send size={14} className="text-green-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
