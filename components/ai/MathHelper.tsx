'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function MathHelper() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  async function ask() {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, page: 'family' }),
      });
      const data = await res.json();
      setAnswer(data.reply ?? 'Try again!');
    } catch {
      setAnswer('Something went wrong. Ask again!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">Math Helper — ask any math question</p>
      <div className="flex gap-2">
        <Input
          placeholder="e.g. What is 15% of 80?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          className="text-lg"
        />
        <Button onClick={ask} disabled={loading}>
          {loading ? '…' : 'Ask'}
        </Button>
      </div>
      {answer && (
        <div className="rounded-xl bg-card border border-muted p-4 text-lg whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}
