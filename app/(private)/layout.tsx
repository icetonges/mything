import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-[hsl(var(--accent)/0.08)] border-b border-[hsl(var(--accent)/0.2)] px-4 py-1.5">
        <p className="max-w-7xl mx-auto text-xs text-[hsl(var(--accent))] font-medium flex items-center gap-2">
          <span>🔒</span>
          <span>Private Space — Welcome, {session.user?.name ?? 'Peter'}</span>
        </p>
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
