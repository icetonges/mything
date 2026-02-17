'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, ChevronDown, ChevronUp, Wrench, Brain, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────
interface AgentStep {
  type:    'thought' | 'tool_call' | 'tool_result' | 'answer';
  content: string;
  tool?:   string;
  data?:   unknown;
}

interface Message {
  role:       'user' | 'assistant';
  content:    string;
  agentName?: string;
  agentEmoji?: string;
  steps?:     AgentStep[];
}

interface Props { page?: string; }

// ── Per-page quick-start suggestions ─────────────────────────────────────
const SUGGESTIONS: Record<string, string[]> = {
  'home':        ['Tell me about Peter', 'Show platform stats', 'What has Peter built?'],
  'fed-finance': ['Explain OMB A-11', 'Latest DoD audit news', 'What is FIAR?'],
  'ai-ml':       ['Latest AI news', "Peter's Kaggle notebooks", 'Show AI/ML trends'],
  'my-work':     ["Peter's best projects", 'What is MyThing?', 'Show his GitHub'],
  'archive':     ['Summarize recent notes', 'What topics come up most?'],
};

// ── Step bubble — shows agent reasoning inline ────────────────────────────
function StepBubble({ step }: { step: AgentStep }) {
  const [open, setOpen] = useState(false);
  if (step.type === 'answer') return null;

  const meta = {
    thought:     { icon: <Brain     size={10} className="text-purple-400" />, label: 'Thinking…',               color: 'border-purple-500/20 bg-purple-500/5  text-purple-300'  },
    tool_call:   { icon: <Wrench    size={10} className="text-yellow-400" />, label: `Calling ${step.tool}`,    color: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-300' },
    tool_result: { icon: <Database  size={10} className="text-cyan-400"   />, label: `Result: ${step.tool}`,    color: 'border-cyan-500/20   bg-cyan-500/5   text-cyan-300'   },
  }[step.type];

  return (
    <div className={`rounded-lg border px-2.5 py-1.5 mb-1 text-[10px] ${meta.color}`}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 w-full text-left">
        {meta.icon}
        <span className="flex-1 font-medium truncate">{meta.label}</span>
        {step.content.length > 30 && (open ? <ChevronUp size={9} /> : <ChevronDown size={9} />)}
      </button>
      {open && (
        <pre className="mt-1.5 text-[9px] whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto opacity-80">
          {step.content.length > 600 ? step.content.substring(0, 600) + '…' : step.content}
        </pre>
      )}
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────
export default function AIChatWidget({ page = 'home' }: Props) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role:       'assistant',
    content:    "Hi! I have 4 specialized agents — Portfolio 💼, Tech Trends 📡, DoD Policy 🏛️, and Notes 📝. I'll automatically route your question to the right one. What would you like to know?",
    agentName:  'Agent Hub',
    agentEmoji: '🤖',
  }]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  // sessionId lives in React state — no localStorage (breaks in SSR/Vercel)
  const [sessionId, setSessionId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 50);
    }
  }, [open, messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          // Send plain role/content array — no steps/emoji in API payload
          messages:  nextMessages.map(m => ({ role: m.role, content: m.content })),
          page,
          sessionId,   // undefined on first message, then server-assigned
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Persist sessionId for conversation continuity (in state, not localStorage)
      if (data.sessionId) setSessionId(data.sessionId);

      setMessages(prev => [...prev, {
        role:       'assistant',
        content:    data.content ?? 'Sorry, I had trouble responding.',
        agentName:  data.agentName,
        agentEmoji: data.agentEmoji,
        steps:      (data.steps ?? []).filter((s: AgentStep) => s.type !== 'answer'),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role:    'assistant',
        content: 'Connection error. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = SUGGESTIONS[page] ?? SUGGESTIONS.home;

  return (
    <>
      {/* ── Floating button ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gold-bg shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 glow-gold',
          open && 'opacity-0 pointer-events-none'
        )}
        aria-label="Open AI Agents"
      >
        <MessageCircle size={24} />
      </button>

      {/* ── Chat panel ──────────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right',
          open ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        )}
        style={{ height: '560px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--accent)/0.05)] rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold">Peter&apos;s AI Agents</p>
              <p className="text-[10px] text-[hsl(var(--fg-muted))]">Portfolio · Tech · DoD Policy · Notes</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.map((m, i) => (
            <div key={i} className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full gold-bg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs leading-none">
                  {m.agentEmoji ?? '🤖'}
                </div>
              )}
              <div className="max-w-[85%] space-y-1 min-w-0">
                {/* Agent label */}
                {m.role === 'assistant' && m.agentName && (
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[hsl(var(--accent))] px-0.5">
                    {m.agentName}
                  </p>
                )}
                {/* Thought steps */}
                {m.steps && m.steps.length > 0 && (
                  <div>
                    {m.steps.map((s, si) => <StepBubble key={si} step={s} />)}
                  </div>
                )}
                {/* Bubble */}
                <div className={cn(
                  'rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words',
                  m.role === 'user'
                    ? 'bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--fg))] rounded-br-sm'
                    : 'bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg))] rounded-bl-sm'
                )}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 rounded-full gold-bg flex items-center justify-center flex-shrink-0 text-xs">⚙️</div>
              <div className="bg-[hsl(var(--bg-muted))] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[hsl(var(--accent))]" />
                <span className="text-xs text-[hsl(var(--fg-muted))]">Agent thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions */}
        {messages.length === 1 && !loading && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--accent)/0.5)] hover:text-[hsl(var(--accent))] transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-[hsl(var(--border))] flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask anything — agents route automatically…"
              className="flex-1 px-3 py-2 rounded-xl bg-[hsl(var(--bg))] border border-[hsl(var(--border))] text-sm focus:outline-none focus:border-[hsl(var(--accent)/0.5)] transition-colors"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl gold-bg flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
