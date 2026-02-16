'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV_ITEMS } from '@/lib/navigation';
import { SITE } from '@/lib/constants';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Lock, LogOut } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

function NavIcon({ name, size = 15 }: { name: string; size?: number }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[name];
  return Icon ? <Icon size={size} /> : null;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const visibleItems = NAV_ITEMS.filter(n => n.enabled).filter(n => {
    if (n.access === 'private') return !!session;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--bg)/0.9)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg text-[hsl(var(--accent))] hover:opacity-80 transition-opacity">
            <span className="text-2xl">✦</span>
            <span>{SITE.name}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {visibleItems.map(item => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]'
                      : 'text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--bg-muted))]'
                  )}
                >
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {item.access === 'private' && !session && <Lock size={11} className="opacity-40" />}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[hsl(var(--fg-muted))] hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
              >
                <LogOut size={15} />
                <span>Sign out</span>
              </button>
            )}
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-md text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))]"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] px-4 py-3 space-y-1">
          {visibleItems.map(item => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]'
                    : 'text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--bg-muted))]'
                )}
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
                {item.access === 'private' && !session && <Lock size={11} className="opacity-40 ml-auto" />}
              </Link>
            );
          })}
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all w-full"
            >
              <LogOut size={15} /> Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
