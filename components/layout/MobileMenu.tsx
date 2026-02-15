'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Zap, Briefcase, Brain, Landmark, PenLine, Heart, Archive, Lock } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/navigation';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Zap,
  Briefcase,
  Brain,
  Landmark,
  PenLine,
  Heart,
  Archive,
};

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const items = NAV_ITEMS.filter((n) => n.enabled && (n.access === 'public' || !!session));

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-foreground hover:bg-muted"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-card border-b border-muted shadow-lg z-50 py-4 px-4">
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = iconMap[item.icon] ?? Home;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.access === 'private' && <Lock className="h-3 w-3 text-muted-foreground" />}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-muted flex justify-between items-center">
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
