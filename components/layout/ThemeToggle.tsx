'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(typeof document !== 'undefined' && document.documentElement.classList.contains('light'));
  }, []);

  function toggle() {
    const html = document.documentElement;
    if (html.classList.contains('light')) {
      html.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setLight(false);
    } else {
      html.classList.add('light');
      localStorage.setItem('theme', 'light');
      setLight(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      className={cn(
        'rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all',
        className
      )}
    >
      {light ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
