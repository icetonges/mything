import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/navigation';
import { COLOR_MAP } from '@/lib/constants';
import { Lock, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

function NavIcon({ name }: { name: string }) {
  const Icon = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return Icon ? <Icon className="h-6 w-6" /> : null;
}

export function TabCards() {
  const items = NAV_ITEMS.filter(n => n.enabled && n.href !== '/');

  return (
    <section className="section-padding bg-background">
      <div className="content-max">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl font-bold text-foreground mb-3">Explore Everything</h2>
          <p className="text-muted-foreground">Public knowledge and private spaces — all in one place</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => {
            const colors = COLOR_MAP[item.color] || COLOR_MAP.slate;
            const [textClass, borderClass, bgClass] = colors.split(/\s+/);

            return (
              <Link key={item.href} href={item.href}
                className={`group card-base p-5 hover:scale-[1.02] hover:shadow-xl ${item.access === 'private' ? 'border-orange-500/20 hover:border-orange-500/40' : 'hover:border-border/80'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${bgClass} ${borderClass} border`}>
                    <span className={textClass}><NavIcon name={item.icon} /></span>
                  </div>
                  {item.access === 'private'
                    ? <Lock className="h-3.5 w-3.5 text-orange-400/60" />
                    : <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  }
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                  {item.label}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                {item.access === 'private' && (
                  <span className="inline-block mt-2 text-xs text-orange-400/70 font-medium">Private</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
