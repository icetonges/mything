"use client";
import { useState } from "react";
import { Heart, Send, BookOpen, Calculator, Link as LinkIcon, Loader2 } from "lucide-react";

const FUN_LINKS = [
  { label: "Khan Academy", url: "https://www.khanacademy.org", emoji: "📚" },
  { label: "CoolMathGames", url: "https://www.coolmathgames.com", emoji: "🎮" },
  { label: "NASA Kids Club", url: "https://www.nasa.gov/learning-resources/nasa-kids-club/", emoji: "🚀" },
  { label: "National Geographic Kids", url: "https://kids.nationalgeographic.com", emoji: "🌍" },
  { label: "Scratch (MIT)", url: "https://scratch.mit.edu", emoji: "🎨" },
  { label: "DK Find Out", url: "https://www.dkfindout.com", emoji: "🔍" },
];

export default function FamilyPage() {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [mathQ, setMathQ] = useState("");
  const [mathA, setMathA] = useState("");
  const [mathLoading, setMathLoading] = useState(false);

  const saveNote = async () => {
    if (!note.trim()) return;
    try {
      await fetch("/api/family-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note, category: "note" }),
      });
      setSavedNotes(prev => [note, ...prev]);
      setNote("");
    } catch {}
  };

  const askMath = async () => {
    if (!mathQ.trim() || mathLoading) return;
    setMathLoading(true);
    setMathA("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: mathQ }],
          page: "family-math",
        }),
      });
      const data = await res.json();
      setMathA(data.content ?? "I had trouble with that one! Try again.");
    } catch { setMathA("Something went wrong. Please try again!"); }
    finally { setMathLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
          <Heart size={22} className="text-pink-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Family Space 🏠</h1>
          <p className="text-sm text-[hsl(var(--fg-muted))]">Private space for the Shang family</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Note */}
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold flex items-center gap-2"><BookOpen size={16} className="text-pink-400" /> Quick Note</h2>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Jot something down… a memory, reminder, or activity idea…"
            rows={4}
            className="w-full bg-[hsl(var(--bg))] rounded-lg p-3 text-sm border border-[hsl(var(--border))] focus:outline-none focus:border-pink-400/40 resize-none"
          />
          <button onClick={saveNote} disabled={!note.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium hover:bg-pink-500/20 transition-all disabled:opacity-50">
            <Send size={14} /> Save Note
          </button>
          {savedNotes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[hsl(var(--border))]">
              <p className="text-xs text-[hsl(var(--fg-muted))]">This session ({savedNotes.length})</p>
              {savedNotes.slice(0, 3).map((n, i) => (
                <p key={i} className="text-sm text-[hsl(var(--fg-muted))] border-l-2 border-pink-400/30 pl-2">{n}</p>
              ))}
            </div>
          )}
        </div>

        {/* Math Helper */}
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold flex items-center gap-2"><Calculator size={16} className="text-yellow-400" /> Math Helper 🧮</h2>
          <p className="text-xs text-[hsl(var(--fg-muted))]">Ask any math question — the AI will explain step by step in a simple, friendly way!</p>
          <div className="flex gap-2">
            <input
              value={mathQ}
              onChange={e => setMathQ(e.target.value)}
              onKeyDown={e => e.key === "Enter" && askMath()}
              placeholder="e.g. What is 15% of 80?"
              className="flex-1 px-3 py-2.5 rounded-lg bg-[hsl(var(--bg))] border border-[hsl(var(--border))] text-sm focus:outline-none focus:border-yellow-400/40"
            />
            <button onClick={askMath} disabled={mathLoading || !mathQ.trim()}
              className="w-10 h-10 rounded-lg gold-bg flex items-center justify-center disabled:opacity-50">
              {mathLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
          {mathA && (
            <div className="bg-[hsl(var(--bg-muted))] rounded-lg p-3 text-sm leading-relaxed border border-[hsl(var(--border))]">
              {mathA}
            </div>
          )}
        </div>

        {/* Fun Links */}
        <div className="card p-5 md:col-span-2">
          <h2 className="font-semibold flex items-center gap-2 mb-4"><LinkIcon size={16} className="text-cyan-400" /> Fun & Learning Links 🌟</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FUN_LINKS.map(l => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--accent)/0.3)] hover:bg-[hsl(var(--accent)/0.04)] transition-all">
                <span className="text-2xl">{l.emoji}</span>
                <span className="text-sm font-medium">{l.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
