'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message { role: 'user' | 'assistant'; content: string; }

interface Props { page?: string; }

export default function AIChatWidget({ page = 'home' }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Peter's AI assistant. I can answer questions about his work, federal finance expertise, AI/ML projects, or anything on this platform. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); inputRef.current?.focus(); }
  }, [open, messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], page }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content ?? 'Sorry, I had trouble responding.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gold-bg shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 glow-gold',
          open && 'opacity-0 pointer-events-none'
        )}
        aria-label="Open AI assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat panel */}
      <div className={cn(
        'fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right',
        open ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
      )} style={{ height: '520px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--accent)/0.05)] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold">Peter's AI Agent</p>
              <p className="text-[10px] text-[hsl(var(--fg-muted))]">Powered by Gemini 2.5 · Live Search</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full gold-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={12} />
                </div>
              )}
              <div className={cn(
                'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--fg))] rounded-br-sm'
                  : 'bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg))] rounded-bl-sm'
              )}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 rounded-full gold-bg flex items-center justify-center flex-shrink-0">
                <Bot size={12} />
              </div>
              <div className="bg-[hsl(var(--bg-muted))] rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 size={16} className="animate-spin text-[hsl(var(--accent))]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {['Tell me about Peter', 'What is OMB A-11?', 'Show me AI projects', 'Contact info'].map(s => (
              <button key={s} onClick={() => setInput(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--accent)/0.5)] hover:text-[hsl(var(--accent))] transition-all">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-[hsl(var(--border))]">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask anything…"
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
