'use client';

import { useState, useEffect } from 'react';
import { MathHelper } from '@/components/ai/MathHelper';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FUN_LINKS = [
  { label: 'Khan Academy', url: 'https://www.khanacademy.org' },
  { label: 'Cool Math', url: 'https://www.coolmath.com' },
  { label: 'NASA Kids', url: 'https://www.nasa.gov/kidsclub' },
];

export default function FamilyPage() {
  const [quickNote, setQuickNote] = useState('');
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [activityInput, setActivityInput] = useState('');

  function addActivity() {
    const text = activityInput.trim();
    if (!text) return;
    setActivityLog((prev) => [`${new Date().toLocaleString()}: ${text}`, ...prev]);
    setActivityInput('');
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-8">Family Space</h1>

      <section className="mb-10">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Note Pad</h2>
          </CardHeader>
          <CardContent>
            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Quick capture…"
              rows={3}
              className="w-full rounded-lg border border-muted bg-background px-3 py-2 text-lg"
            />
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Activity Log</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="What did you do?"
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addActivity()}
                className="text-lg"
              />
              <Button onClick={addActivity}>Add</Button>
            </div>
            <ul className="space-y-2 text-lg">
              {activityLog.slice(0, 10).map((entry, i) => (
                <li key={i} className="text-muted-foreground">{entry}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Math Helper</h2>
            <p className="text-muted-foreground text-sm">Kid-friendly math tutor</p>
          </CardHeader>
          <CardContent>
            <MathHelper />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Fun Links</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-lg">
              {FUN_LINKS.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {l.label} →
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
