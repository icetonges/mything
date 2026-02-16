"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DataPoint {
  date: string;
  mood: number | null;
  count: number;
}

interface Props {
  data: DataPoint[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-xs shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function TrendChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="card p-8 border-dashed text-center">
        <p className="text-sm text-[hsl(var(--fg-muted))]">No trend data yet. Start journaling to see mood and activity trends.</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-5">Mood & Activity Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 16%)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(213 20% 65%)" }} />
          <YAxis yAxisId="mood" domain={[1, 5]} tick={{ fontSize: 10, fill: "hsl(213 20% 65%)" }} />
          <YAxis yAxisId="count" orientation="right" tick={{ fontSize: 10, fill: "hsl(213 20% 65%)" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line
            yAxisId="mood"
            type="monotone"
            dataKey="mood"
            stroke="hsl(45 96% 54%)"
            strokeWidth={2}
            dot={false}
            name="Mood (1–5)"
            connectNulls
          />
          <Line
            yAxisId="count"
            type="monotone"
            dataKey="count"
            stroke="hsl(200 80% 60%)"
            strokeWidth={2}
            dot={false}
            name="Notes/week"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
