'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Home,
  Zap,
  Briefcase,
  Brain,
  Landmark,
  PenLine,
  Heart,
  Archive,
} from 'lucide-react';
import { NAV_ITEMS } from '@/lib/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

const colorMap: Record<string, string> = {
  yellow: 'text-yellow-500',
  cyan: 'text-cyan-500',
  blue: 'text-blue-500',
  purple: 'text-purple-500',
  green: 'text-green-500',
  orange: 'text-orange-500',
  pink: 'text-pink-500',
  slate: 'text-slate-400',
};

export function TabCards() {
  const { data: session } = useSession();
  const items = NAV_ITEMS.filter((n) => n.enabled && (n.access === 'public' || !!session));

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-2xl font-bold mb-6">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Home;
            const colorClass = colorMap[item.color] ?? 'text-accent';
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={item.href}>
                  <Card className="h-full hover:border-accent/50 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className={cn('mb-2', colorClass)}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="font-semibold text-lg">{item.label}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
