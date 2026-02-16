'use client';
import { useState } from 'react';
import { LINKS, OWNER } from '@/lib/constants';
import { Send, Github, Linkedin, Mail, BookOpen, BarChart2, CheckCircle } from 'lucide-react';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: info */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-2">Get In Touch</p>
            <h2 className="font-display text-3xl font-bold mb-4">Let&apos;s Connect</h2>
            <p className="text-[hsl(var(--fg-muted))] leading-relaxed">
              Whether you have questions about federal financial management, AI projects, or want to collaborate — I&apos;d love to hear from you.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: Mail,     label: 'Email',     value: OWNER.email,    href: `mailto:${OWNER.email}` },
              { icon: Github,   label: 'GitHub',    value: 'icetonges',    href: LINKS.github },
              { icon: Linkedin, label: 'LinkedIn',  value: 'Peter Shang',  href: LINKS.linkedin },
              { icon: BarChart2,label: 'Kaggle',    value: 'icetonges',    href: LINKS.kaggle },
              { icon: BookOpen, label: 'Resume',    value: 'petershang.vercel.app', href: LINKS.resume },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--accent)/0.4)] hover:bg-[hsl(var(--accent)/0.04)] transition-all group">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--bg-muted))] flex items-center justify-center group-hover:bg-[hsl(var(--accent)/0.12)] transition-colors">
                  <Icon size={16} className="text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--fg-muted))]">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="card p-6">
          {status === 'sent' ? (
            <div className="flex flex-col items-center justify-center h-full py-10 space-y-3 text-center">
              <CheckCircle size={48} className="text-green-400" />
              <h3 className="font-display text-xl font-bold">Message Sent!</h3>
              <p className="text-sm text-[hsl(var(--fg-muted))]">Thank you. I&apos;ll get back to you soon.</p>
              <button onClick={() => setStatus('idle')} className="text-sm text-[hsl(var(--accent))] hover:underline">Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h3 className="font-display text-lg font-bold mb-2">Send a Message</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-[hsl(var(--fg-muted))] mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))] text-sm focus:outline-none focus:border-[hsl(var(--accent)/0.5)] transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--fg-muted))] mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="What's this about?"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))] text-sm focus:outline-none focus:border-[hsl(var(--accent)/0.5)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--fg-muted))] mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Your message…"
                  required
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))] text-sm focus:outline-none focus:border-[hsl(var(--accent)/0.5)] transition-colors resize-none"
                />
              </div>
              {status === 'error' && <p className="text-xs text-red-400">Something went wrong. Please email directly.</p>}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 rounded-xl gold-bg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send size={15} />
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
