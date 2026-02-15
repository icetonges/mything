'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SITE, OWNER } from '@/lib/constants';
import { Lock, Chrome, KeyRound, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [passphrase, setPassphrase] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/notes';

  const handleGoogle = async () => {
    setLoading('google');
    await signIn('google', { callbackUrl });
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('credentials');
    setError('');
    const res = await signIn('credentials', { passphrase, callbackUrl, redirect: false });
    if (res?.error) { setError('Incorrect passphrase. Try again.'); setLoading(null); }
    else if (res?.ok) window.location.href = callbackUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[hsl(var(--bg))]">
      <div className="w-full max-w-md space-y-6">
        {/* Back */}
        <Link href="/" className="flex items-center gap-2 text-sm text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors">
          <ArrowLeft size={14} /> Back to {SITE.name}
        </Link>

        {/* Card */}
        <div className="card p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--accent)/0.12)] flex items-center justify-center mx-auto">
              <Lock size={22} className="text-[hsl(var(--accent))]" />
            </div>
            <h1 className="font-display text-2xl font-bold">Private Access</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">
              {SITE.name} — owner-only area
            </p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] hover:border-[hsl(var(--accent)/0.4)] hover:bg-[hsl(var(--accent)/0.05)] transition-all duration-200 text-sm font-medium disabled:opacity-50"
          >
            <Chrome size={18} className="text-[hsl(var(--accent))]" />
            {loading === 'google' ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3">
            <hr className="flex-1 border-[hsl(var(--border))]" />
            <span className="text-xs text-[hsl(var(--fg-muted))]">or</span>
            <hr className="flex-1 border-[hsl(var(--border))]" />
          </div>

          {/* Passphrase */}
          <form onSubmit={handleCredentials} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-[hsl(var(--fg-muted))] uppercase tracking-wider">
                Owner Passphrase
              </label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--fg-muted))]" />
                <input
                  type="password"
                  value={passphrase}
                  onChange={e => setPassphrase(e.target.value)}
                  placeholder="Enter passphrase…"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))] text-sm focus:outline-none focus:border-[hsl(var(--accent)/0.6)] transition-colors"
                  required
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={!!loading || !passphrase}
              className="w-full py-3 rounded-xl gold-bg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading === 'credentials' ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[hsl(var(--fg-muted))]">
          Only {OWNER.shortName} can access private areas.
        </p>
      </div>
    </div>
  );
}
