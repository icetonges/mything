'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const page = pathname?.replace('/', '') || 'home';
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, page }),
      });
      const data = await res.json();
      const reply = data.reply ?? 'Sorry, I could not generate a response.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:opacity-90 lg:bottom-8 lg:right-8"
        aria-label="Open AI chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-md rounded-xl border border-muted bg-card shadow-xl lg:bottom-28 lg:right-8">
          <div className="flex items-center justify-between border-b border-muted px-4 py-2">
            <span className="font-semibold text-sm">AI Assistant</span>
            <button type="button" onClick={() => setOpen(false)} className="p-1 hover:bg-muted rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">Ask me anything about Peter, MyThing, federal finance, or AI/ML.</p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm',
                  msg.role === 'user' ? 'ml-8 bg-muted' : 'mr-8 bg-accent/20'
                )}
              >
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="mr-8 rounded-lg px-3 py-2 text-sm bg-accent/20 text-muted-foreground">
                Thinking…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form
            className="flex gap-2 p-2 border-t border-muted"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-lg border border-muted bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button type="submit" size="sm" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
