"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Lock, LogOut } from "lucide-react";
import * as Icons from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

function NavIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[name];
  return Icon ? <Icon size={16} /> : null;
}

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const visibleItems = NAV_ITEMS.filter(n => n.enabled).filter(n =>
    n.access === "public" || !!session
  );

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle mobile menu"
        className="p-2 rounded-md text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] px-4 py-3 space-y-1 shadow-lg">
          {visibleItems.map(item => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]"
                    : "text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--bg-muted))]"
                )}
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
                {item.access === "private" && !session && (
                  <Lock size={11} className="opacity-40 ml-auto" />
                )}
              </Link>
            );
          })}

          {session && (
            <button
              onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all w-full mt-2 border-t border-[hsl(var(--border))] pt-3"
            >
              <LogOut size={16} /> Sign out
            </button>
          )}
        </div>
      )}
    </div>
  );
}
