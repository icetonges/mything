'use client';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'));
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle('light', next);
    try { localStorage.setItem('theme', next ? 'light' : 'dark'); } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] hover:border-[hsl(var(--accent))] transition-all duration-200 text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--accent))]"
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
