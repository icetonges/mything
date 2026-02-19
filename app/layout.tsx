import type { Metadata } from 'next';
import './globals.css';
import { SITE } from '@/lib/constants';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';
import { Analytics } from '@vercel/analytics/react'; // Added import

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    type: 'website',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('theme');
              if (t === 'light') document.documentElement.classList.add('light');
            } catch(e) {}
          })();
        `}} />
      </head>
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
        <Analytics /> {/* Added component */}
      </body>
    </html>
  );
}