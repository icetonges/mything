'use client';

interface NoteAIPanelProps {
  headline?: string | null;
  summary?: string | null;
  keyIdeas?: string | null;
  actionItems?: string | null;
  themes?: string[];
  sentiment?: string | null;
  aiProcessedAt?: Date | string | null;
}

export function NoteAIPanel({
  headline,
  summary,
  keyIdeas,
  actionItems,
  themes,
  sentiment,
  aiProcessedAt,
}: NoteAIPanelProps) {
  const parsedKeyIdeas = keyIdeas ? (() => { try { return JSON.parse(keyIdeas) as string[]; } catch { return []; } })() : [];
  const parsedActions = actionItems ? (() => { try { return JSON.parse(actionItems) as string[]; } catch { return []; } })() : [];

  return (
    <div className="space-y-4">
      {headline && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase mb-1">Headline</h3>
          <p className="font-medium">{headline}</p>
        </div>
      )}
      {summary && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase mb-1">Summary</h3>
          <div className="text-sm whitespace-pre-wrap">{summary}</div>
        </div>
      )}
      {parsedKeyIdeas.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase mb-1">Key Ideas</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {parsedKeyIdeas.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {parsedActions.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase mb-1">Action Items</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {parsedActions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {themes && themes.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase mb-1">Themes</h3>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <span key={t} className="rounded bg-muted px-2 py-0.5 text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
      {sentiment && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase mb-1">Sentiment</h3>
          <p className="text-sm capitalize">{sentiment}</p>
        </div>
      )}
      {aiProcessedAt && (
        <p className="text-xs text-muted-foreground">
          Processed {new Date(aiProcessedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
