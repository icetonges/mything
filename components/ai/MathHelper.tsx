'use client';
import { useState } from 'react';
import { Calculator, Send, RotateCcw } from 'lucide-react';

export function MathHelper() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          sessionId: `math-${Date.now()}`,
          context: 'math-tutor',
        }),
      });
      const data = await res.json();
      setAnswer(data.message || 'I need help with that one! Try asking your teacher. 😊');
    } catch { setAnswer('Oops! Something went wrong. Try again!'); }
    finally { setLoading(false); }
  };

  return (
    <div className="card-base p-6 max-w-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-pink-400/10 border border-pink-400/30">
          <Calculator className="h-5 w-5 text-pink-400" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Math Helper 🧮</h3>
          <p className="text-xs text-muted-foreground">Ask any math question!</p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea value={question} onChange={e => setQuestion(e.target.value)}
          placeholder="Type your math question here... e.g. 'What is 12 × 8?' or 'How do I solve 2x + 5 = 13?'"
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-sm resize-none transition-all" />
        <div className="flex gap-2">
          <button onClick={ask} disabled={!question.trim() || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-600 disabled:opacity-50 transition-all text-sm">
            <Send className="h-3.5 w-3.5" /> {loading ? 'Thinking…' : 'Ask!'}
          </button>
          {answer && (
            <button onClick={() => { setAnswer(''); setQuestion(''); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-all text-sm">
              <RotateCcw className="h-3.5 w-3.5" /> New question
            </button>
          )}
        </div>
      </div>

      {answer && (
        <div className="mt-4 p-4 rounded-xl bg-green-400/10 border border-green-400/20">
          <p className="text-xs text-green-400 font-medium mb-2">Answer:</p>
          <p className="text-sm text-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
