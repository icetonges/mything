import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface NoteCardProps {
  id: string;
  date: string | Date;
  headline?: string | null;
  summary?: string | null;
  slug?: string | null;
}

export function NoteCard({ id, date, headline, summary, slug }: NoteCardProps) {
  const href = slug ? `/archive/${slug}` : `/notes?edit=${id}`;
  return (
    <Link href={href}>
      <Card className="hover:border-accent/50 transition-colors">
        <CardHeader className="pb-2">
          <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
          <h3 className="font-medium line-clamp-1">{headline || 'Untitled note'}</h3>
        </CardHeader>
        {summary && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2">{summary}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
