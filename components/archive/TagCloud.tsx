"use client";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  tags: { tag: string; count: number }[];
}

export default function TagCloud({ tags }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  if (!tags.length) return null;

  const maxCount = Math.max(...tags.map(t => t.count));

  const getSize = (count: number): string => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return "text-base font-bold";
    if (ratio > 0.5) return "text-sm font-semibold";
    if (ratio > 0.3) return "text-sm font-medium";
    return "text-xs font-normal";
  };

  return (
    <div className="card p-5">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--fg-muted))] mb-4">Tag Cloud</h3>
      <div className="flex flex-wrap gap-2">
        {activeTag && (
          <button onClick={() => router.push("/archive")}
            className="px-3 py-1.5 rounded-full text-xs bg-[hsl(var(--bg-muted))] text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors">
            ✕ Clear
          </button>
        )}
        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => router.push(`/archive?tag=${encodeURIComponent(tag)}`)}
            title={`${count} note${count !== 1 ? "s" : ""}`}
            className={`px-3 py-1.5 rounded-full border transition-all ${getSize(count)} ${
              activeTag === tag
                ? "gold-bg border-transparent"
                : "border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--accent)/0.4)] hover:text-[hsl(var(--accent))]"
            }`}
          >
            #{tag}
            <span className="ml-1 opacity-50 text-[10px]">{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
