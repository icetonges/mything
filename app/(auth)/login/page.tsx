'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SITE } from '@/lib/constants';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      passphrase,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or passphrase.');
      return;
    }
    if (res?.url) window.location.href = res.url;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-lg border border-muted">
        <h1 className="font-display text-2xl font-bold text-center mb-2">MyThing</h1>
        <p className="text-muted-foreground text-center text-sm mb-6">{SITE.name} — Sign in</p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleCredentials} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-muted bg-background px-3 py-2 text-foreground"
              required
            />
          </div>
          <div>
            <label htmlFor="passphrase" className="block text-sm font-medium mb-1">
              Passphrase
            </label>
            <input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full rounded-lg border border-muted bg-background px-3 py-2 text-foreground"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent text-accent-foreground font-medium py-2 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in with passphrase'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-muted">
          <p className="text-center text-sm text-muted-foreground mb-3">Or sign in with Google</p>
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full rounded-lg border border-muted bg-card py-2 text-foreground hover:bg-muted"
          >
            Sign in with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="underline hover:text-foreground">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
