"use client";
import { useState } from "react";
import { Lightbulb, TrendingUp, Target, FileText, Zap, ChevronDown } from "lucide-react";

export type QuickType = "idea" | "trend" | "goal" | "note" | "insight";

interface Props {
  onCapture: (text: string, type: QuickType) => void;
}

const TYPES: { type: QuickType; icon: React.ComponentType<{ size?: number }>; label: string; placeholder: string; color: string }[] = [
  { type: "idea",    icon: Lightbulb,   label: "Idea",    placeholder: "A new idea just hit me…",       color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  { type: "trend",   icon: TrendingUp,  label: "Trend",   placeholder: "I noticed a trend today…",      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { type: "goal",    icon: Target,      label: "Goal",    placeholder: "A goal I want to achieve…",     color: "text-red-400 bg-red-500/10 border-red-500/20" },
  { type: "note",    icon: FileText,    label: "Note",    placeholder: "Something worth remembering…",  color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { type: "insight", icon: Zap,         label: "Insight", placeholder: "A key insight or realization…", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
];

export default function QuickCaptureBar({ onCapture }: Props) {
  const [selected, setSelected] = useState<QuickType>("note");
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const active = TYPES.find(t => t.type === selected)!;

  const submit = () => {
    if (!text.trim()) return;
    onCapture(text.trim(), selected);
    setText("");
  };

  return (
    <div className="card p-3 flex items-center gap-2">
      {/* Type selector */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${active.color}`}
        >
          <active.icon size={13} />
          {active.label}
          <ChevronDown size={11} className={open ? "rotate-180" : ""} />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 z-10 card p-1 shadow-xl min-w-[140px]">
            {TYPES.map(t => (
              <button key={t.type} onClick={() => { setSelected(t.type); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  selected === t.type ? t.color : "text-[hsl(var(--fg-muted))] hover:bg-[hsl(var(--bg-muted))]"
                }`}>
                <t.icon size={13} /> {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        placeholder={active.placeholder}
        className="flex-1 bg-transparent text-sm focus:outline-none text-[hsl(var(--fg))] placeholder:text-[hsl(var(--fg-muted))]"
      />

      <button onClick={submit} disabled={!text.trim()}
        className="px-3 py-2 rounded-lg gold-bg text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0">
        Capture
      </button>
    </div>
  );
}
