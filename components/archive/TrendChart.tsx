'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Note {
  date: string;
  mood: number | null;
}

export function TrendChart({ notes }: { notes: Note[] }) {
  const data = notes
    .filter((n) => n.mood != null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((n) => ({
      date: new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: n.mood,
    }));

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">No mood data yet. Add mood when saving notes.</p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" />
          <YAxis domain={[1, 5]} className="text-xs" />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--muted))' }}
          />
          <Line type="monotone" dataKey="mood" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
