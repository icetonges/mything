import { Sparkles, Lightbulb, Target, Tag } from 'lucide-react';

interface NoteAIPanelProps {
  headline?: string;
  summary?: string;
  keyIdeas?: string;
  actionItems?: string;
  themes?: string[];
  sentiment?: string;
  isProcessing?: boolean;
}

const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'text-green-400 bg-green-400/10 border-green-400/30',
  neutral: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  reflective: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  energized: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  concerned: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
};

export function NoteAIPanel({ headline, summary, keyIdeas, actionItems, themes, sentiment, isProcessing }: NoteAIPanelProps) {
  if (isProcessing) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Sparkles className="h-8 w-8 text-accent animate-pulse-slow" />
        <p className="text-sm font-medium">AI is analyzing your note…</p>
        <div className="flex gap-1">
          {[0,1,2].map(i => <span key={i} className="h-2 w-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: `${i*200}ms` }} />)}
        </div>
      </div>
    );
  }

  if (!headline && !summary) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground p-6 text-center">
        <Sparkles className="h-10 w-10 text-accent/40" />
        <p className="font-medium text-foreground/60">AI Summary</p>
        <p className="text-sm">Write and save a note — AI will instantly generate an executive summary, key ideas, and action items.</p>
      </div>
    );
  }

  const ideas: string[] = keyIdeas ? JSON.parse(keyIdeas) : [];
  const actions: string[] = actionItems ? JSON.parse(actionItems) : [];
  const sentimentClass = sentiment ? (SENTIMENT_COLORS[sentiment] || SENTIMENT_COLORS.neutral) : '';

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 space-y-4">
      {/* Headline */}
      {headline && (
        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
          <p className="text-xs text-accent font-medium mb-1 uppercase tracking-wider">Headline</p>
          <p className="text-sm font-semibold text-foreground leading-snug">{headline}</p>
        </div>
      )}

      {/* Sentiment */}
      {sentiment && (
        <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-medium ${sentimentClass}`}>
          {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
        </span>
      )}

      {/* Summary */}
      {summary && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Executive Summary</p>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
            {summary.split('\n').filter(Boolean).map((line, i) => (
              <p key={i} className="flex gap-2"><span className="text-accent shrink-0">•</span>{line.replace(/^[•\-]\s*/, '')}</p>
            ))}
          </div>
        </div>
      )}

      {/* Key Ideas */}
      {ideas.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-yellow-400" />
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Key Ideas</p>
          </div>
          <ul className="space-y-1.5">
            {ideas.map((idea, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold">{i+1}</span>
                {idea}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Items */}
      {actions.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Target className="h-3.5 w-3.5 text-green-400" />
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Action Items</p>
          </div>
          <ul className="space-y-1.5">
            {actions.map((action, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground items-start">
                <span className="h-4 w-4 shrink-0 rounded border border-green-400/40 mt-0.5" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Themes */}
      {themes && themes.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="h-3.5 w-3.5 text-blue-400" />
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Themes</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {themes.map(theme => (
              <span key={theme} className="text-xs px-2 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400">{theme}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
