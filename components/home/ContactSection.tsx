'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LINKS } from '@/lib/constants';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          subject: fd.get('subject'),
          message: fd.get('message'),
        }),
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" id="contact">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-2xl font-bold mb-6">Contact</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Send a message</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm mb-1">Name</label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm mb-1">Email</label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm mb-1">Subject</label>
                  <Input id="subject" name="subject" required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full rounded-lg border border-muted bg-background px-3 py-2 text-foreground"
                    required
                  />
                </div>
                <Button type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : 'Send'}
                </Button>
                {status === 'error' && (
                  <p className="text-sm text-red-500">Something went wrong. Try emailing directly.</p>
                )}
              </form>
            </CardContent>
          </Card>
          <div>
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Links</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Github className="h-4 w-4" /> GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a href={LINKS.kaggle} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  Kaggle
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a href={LINKS.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  Resume
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a href={`mailto:${LINKS.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Mail className="h-4 w-4" /> {LINKS.email}
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
