import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <>
      <Navbar showOwnerBadge />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
