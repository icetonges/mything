'use client';

const QUICK_TYPES = [
  { label: '💡 Idea', value: 'idea' },
  { label: '📰 Trend', value: 'trend' },
  { label: '🎯 Goal', value: 'goal' },
  { label: '📝 Note', value: 'note' },
  { label: '⚡ Insight', value: 'insight' },
];

export function QuickCaptureBar({
  onSelect,
  selected,
}: {
  onSelect: (value: string) => void;
  selected?: string | null;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_TYPES.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={`rounded-lg px-3 py-1.5 text-sm border transition-colors ${
            selected === value
              ? 'bg-accent text-accent-foreground border-accent'
              : 'border-muted hover:bg-muted'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
