export type AccessLevel = 'public' | 'private';

export interface NavItem {
  label: string;
  href: string;
  access: AccessLevel;
  icon: string;
  description: string;
  color: string;
  enabled: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home',           href: '/',            access: 'public',  icon: 'Home',     description: 'Overview and highlights',                  color: 'yellow',  enabled: true },
  { label: 'Tech Trends',    href: '/tech-trends', access: 'public',  icon: 'Zap',      description: 'Emerging tech from top sources',           color: 'cyan',    enabled: true },
  { label: 'My Work',        href: '/my-work',     access: 'public',  icon: 'Briefcase',description: 'Portfolio, GitHub, Kaggle projects',       color: 'blue',    enabled: true },
  { label: 'AI & ML',        href: '/ai-ml',       access: 'public',  icon: 'Brain',    description: 'AI knowledge, experiments, and trends',    color: 'purple',  enabled: true },
  { label: 'Federal Finance', href: '/fed-finance', access: 'public',  icon: 'Landmark', description: 'Federal budget and financial management',   color: 'green',   enabled: true },
  { label: 'Daily Notes',    href: '/notes',       access: 'private', icon: 'PenLine',  description: 'Private thought capture and AI summaries', color: 'orange',  enabled: true },
  { label: 'Family Space',   href: '/family',      access: 'private', icon: 'Heart',    description: 'Private family and personal space',        color: 'pink',    enabled: true },
  { label: 'Archive',        href: '/archive',     access: 'private', icon: 'Archive',  description: 'Inventory of all notes and auto-summaries',color: 'slate',   enabled: true },
];

export const PUBLIC_ROUTES  = NAV_ITEMS.filter(n => n.access === 'public'  && n.enabled).map(n => n.href);
export const PRIVATE_ROUTES = NAV_ITEMS.filter(n => n.access === 'private' && n.enabled).map(n => n.href);
