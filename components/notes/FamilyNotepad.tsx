'use client';
import { useState } from 'react';
import { PenLine, Save, CheckCircle } from 'lucide-react';

export function FamilyNotepad() {
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('note');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!note.trim() || saving) return;
    setSaving(true);
    try {
      await fetch('/api/family-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: note, category }),
      });
      setNote('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  return (
    <div className="card-base p-5">
      <div className="flex items-center gap-2 mb-4">
        <PenLine className="h-4 w-4 text-pink-400" />
        <h3 className="font-semibold text-foreground">Quick Note</h3>
      </div>
      <div className="flex gap-2 mb-3">
        {[{ v: 'note', l: '📝 Note' }, { v: 'activity', l: '🎯 Activity' }, { v: 'math', l: '🧮 Math' }, { v: 'link', l: '🔗 Link' }].map(c => (
          <button key={c.v} onClick={() => setCategory(c.v)}
            className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${category === c.v ? 'bg-pink-500/20 text-pink-400 border border-pink-400/30' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {c.l}
          </button>
        ))}
      </div>
      <textarea value={note} onChange={e => setNote(e.target.value)} rows={4}
        placeholder="Write something for the family…"
        className="w-full px-3 py-2.5 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-sm resize-none transition-all mb-3" />
      <button onClick={handleSave} disabled={!note.trim() || saving}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-600 disabled:opacity-50 transition-all text-sm">
        {saved ? <><CheckCircle className="h-3.5 w-3.5" /> Saved!</> : <><Save className="h-3.5 w-3.5" /> Save note</>}
      </button>
    </div>
  );
}
