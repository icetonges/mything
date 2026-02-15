'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FedFinanceQA({
  page,
  placeholder = 'Ask a question…',
}: {
  page: string;
  placeholder?: string;
}) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, page }),
      });
      const data = await res.json();
      setAnswer(data.reply ?? 'No response.');
    } catch {
      setAnswer('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <Button onClick={submit} disabled={loading}>
          {loading ? '…' : 'Ask'}
        </Button>
      </div>
      {answer && (
        <div className="rounded-lg bg-muted p-4 text-sm whitespace-pre-wrap">{answer}</div>
      )}
    </div>
  );
}
