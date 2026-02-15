'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Home,
  Zap,
  Briefcase,
  Brain,
  Landmark,
  PenLine,
  Heart,
  Archive,
  Lock,
  LogOut,
  User,
} from 'lucide-react';
import { NAV_ITEMS } from '@/lib/navigation';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

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

export function Navbar({ showOwnerBadge }: { showOwnerBadge?: boolean }) {
  const { data: session } = useSession();
  const items = NAV_ITEMS.filter((n) => n.enabled && (n.access === 'public' || !!session));

  return (
    <header className="sticky top-0 z-40 border-b border-muted bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <Link href="/" className="font-display font-bold text-lg text-foreground">
          MyThing
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {items.map((item) => {
            const Icon = iconMap[item.icon] ?? Home;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all'
                )}
                title={item.description}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.access === 'private' && <Lock className="h-3 w-3" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden lg:block" />
          {(session || showOwnerBadge) && (
            <div className="hidden lg:flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" /> Owner
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
